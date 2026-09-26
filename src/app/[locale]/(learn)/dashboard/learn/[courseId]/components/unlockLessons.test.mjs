import * as jsxRuntime from "react/jsx-runtime";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("./unlockLessons.ts", import.meta.url),
  "utf8",
);
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const exports = {};
vm.runInNewContext(output, { exports });
const { unlockLessonsSequentially } = exports;

const section = (lessons) => [{ section: "Section", lessons }];
const lesson = (id, order, extra = {}) => ({
  _id: id,
  order,
  hasQuiz: false,
  examAvailable: true,
  isRequireAnalytic: false,
  isUnlocked: false,
  ...extra,
});
const unlocked = (sections) =>
  sections
    .flatMap((part) => part.lessons)
    .filter((item) => item.isUnlocked)
    .map((item) => item._id);

test("submission unlocks through videos to the first unfinished requirement and closes later lessons", () => {
  const original = section([
    lesson("a", 1, { hasQuiz: true, passedExam: true }),
    lesson("b", 2),
    lesson("c", 3, { isRequireAnalytic: true }),
    lesson("d", 4, { isUnlocked: true, videoUrl: "old-access" }),
  ]);
  const result = unlockLessonsSequentially(original, "a");
  assert.deepEqual(unlocked(result), ["a", "b", "c"]);
  assert.equal(result[0].lessons[3].videoUrl, undefined);
  assert.equal(original[0].lessons[3].videoUrl, "old-access");
});
test("a submitted assignment with a title or file never remains a phantom blocker", () => {
  const result = unlockLessonsSequentially(
    section([
      lesson("a", 1, {
        hasQuiz: true,
        passedExam: true,
        isRequireAnalytic: true,
        passedAnalyticsTask: true,
        assignmentTitle: "Assignment",
        assignmentFile: "worksheet.pdf",
      }),
      lesson("b", 2),
    ]),
    "a",
  );
  assert.deepEqual(unlocked(result), ["a", "b"]);
});
test("both requirements must be complete in either order", () => {
  for (const [quiz, assignment] of [
    [true, false],
    [false, true],
  ]) {
    const result = unlockLessonsSequentially(
      section([
        lesson("a", 1, {
          hasQuiz: true,
          passedExam: quiz,
          isRequireAnalytic: true,
          passedAnalyticsTask: assignment,
        }),
        lesson("b", 2),
      ]),
      "a",
    );
    assert.deepEqual(unlocked(result), ["a"]);
  }
});
test("already completed later requirements do not block and lessons follow global order", () => {
  const result = unlockLessonsSequentially(
    section([
      lesson("c", 3),
      lesson("a", 1, { hasQuiz: true, passedExam: true }),
      lesson("b", 2, { hasQuiz: true, passedExam: true }),
    ]),
    "a",
  );
  assert.deepEqual(new Set(unlocked(result)), new Set(["a", "b", "c"]));
});
test("an earlier unfinished quiz cannot be bypassed by submitting a later assignment", () => {
  const result = unlockLessonsSequentially(
    section([
      lesson("a", 1, { hasQuiz: true, passedExam: false }),
      lesson("b", 2, { isRequireAnalytic: true, passedAnalyticsTask: true }),
    ]),
    "b",
  );
  assert.deepEqual(unlocked(result), ["a"]);
});

const { applyLessonProgression, isLearningSelectionLocked } = exports;
const initialLesson = (id, order, extra = {}) =>
  lesson(id, order, {
    isUnlocked: true,
    videoUrl: "test-video",
    ...extra,
  });

test("initial load locks all eleven later lessons when the first quiz is unfinished", () => {
  const raw = Array.from({ length: 4 }, (_, sectionIndex) => ({
    section: "Section " + sectionIndex,
    sectionId: String(sectionIndex),
    lessons: Array.from({ length: 3 }, (_, index) => {
      const order = sectionIndex * 3 + index + 1;
      return initialLesson(String(order), order, {
        hasQuiz: order === 1,
        passedExam: false,
      });
    }),
  }));
  const gated = applyLessonProgression(raw);
  assert.deepEqual(unlocked(gated), ["1"]);
  assert.equal(gated[1].sectionId, "1");
  assert.equal(raw[3].lessons[2].isUnlocked, true);
  for (const display of ["lesson", "quiz", "practice"]) {
    assert.equal(
      isLearningSelectionLocked(
        gated.flatMap((item) => item.lessons),
        "2",
        display,
        false,
      ),
      true,
    );
  }
});

test("initial load: an analytic assignment alone blocks every following section", () => {
  const result = applyLessonProgression([
    {
      section: "One",
      lessons: [
        initialLesson("a", 1, {
          isRequireAnalytic: true,
          passedAnalyticsTask: false,
        }),
      ],
    },
    { section: "Two", lessons: [initialLesson("b", 2), initialLesson("c", 3)] },
  ]);
  assert.deepEqual(unlocked(result), ["a"]);
});

test("initial load: passing the quiz does not bypass an unfinished assignment", () => {
  assert.deepEqual(
    unlocked(
      applyLessonProgression(
        section([
          initialLesson("a", 1, {
            hasQuiz: true,
            passedExam: true,
            isRequireAnalytic: true,
            passedAnalyticsTask: false,
          }),
          initialLesson("b", 2),
        ]),
      ),
    ),
    ["a"],
  );
});

test("after submission and after reload: open through the next unfinished quiz or assignment", () => {
  const raw = section([
    initialLesson("a", 1, { hasQuiz: true, passedExam: true }),
    initialLesson("b", 2),
    initialLesson("c", 3, {
      isRequireAnalytic: true,
      passedAnalyticsTask: false,
    }),
    initialLesson("d", 4),
  ]);
  assert.deepEqual(unlocked(applyLessonProgression(raw)), ["a", "b", "c"]);
  assert.deepEqual(unlocked(unlockLessonsSequentially(raw, "a")), [
    "a",
    "b",
    "c",
  ]);
});

test("initial load preserves additional server access restrictions", () => {
  const result = applyLessonProgression(
    section([
      initialLesson("a", 1),
      initialLesson("b", 2, { isUnlocked: false }),
      initialLesson("c", 3),
    ]),
  );
  assert.deepEqual(unlocked(result), ["a"]);
});

test("a later state update cannot reopen a lesson past the blocker", () => {
  const result = applyLessonProgression(
    section([
      initialLesson("a", 1, { isRequireAnalytic: true }),
      initialLesson("b", 2, { lessonWatched: true, isUnlocked: true }),
    ]),
  );
  assert.deepEqual(unlocked(result), ["a"]);
});

test("direct selection rejects missing lessons and a locked final exam", () => {
  assert.equal(isLearningSelectionLocked([], "missing", "lesson", false), true);
  assert.equal(isLearningSelectionLocked([], null, "final_exam", false), true);
  assert.equal(isLearningSelectionLocked([], null, "final_exam", true), false);
});
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("a locked direct URL never mounts the video, quiz, or analytic submission UI", () => {
  const gated = applyLessonProgression(
    section([
      initialLesson("a", 1, { hasQuiz: true }),
      initialLesson("b", 2, { hasQuiz: true, isRequireAnalytic: true }),
    ]),
  );
  const mainOutput = ts.transpileModule(
    readFileSync(new URL("./Main.tsx", import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  for (const display of ["lesson", "quiz", "practice"]) {
    const moduleExports = {};
    vm.runInNewContext(mainOutput, {
      exports: moduleExports,
      require: (name) => {
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "./unlockLessons") return exports;
        if (name.endsWith("/CourseContext"))
          return {
            useCourseContext: () => ({
              sections: gated,
              course: { _id: "course" },
              learningSummary: {},
              isLoading: false,
              error: null,
              canTakeFinalExam: false,
            }),
          };
        if (name === "@/hooks/useSearchParams")
          return {
            __esModule: true,
            default: () => ({
              searchParams: new URLSearchParams({ lesson: "b", display }),
              setSearchParams: () => {},
            }),
          };
        if (name === "next-intl")
          return { useTranslations: () => (key) => key };
        if (name === "@/lib/utils")
          return {
            getDynamicString: (value) => value || "",
            isImageFile: () => false,
          };
        if (name === "@/components/ui/button")
          return {
            Button: ({ children }) =>
              React.createElement("button", null, children),
          };
        if (
          name === "./LessonBody" ||
          name === "./QuizBody" ||
          name.includes("CreatePractice")
        ) {
          return {
            __esModule: true,
            default: () => {
              throw new Error("Blocked content mounted");
            },
          };
        }
        return new Proxy(
          { __esModule: true },
          { get: (target, key) => (key === "__esModule" ? true : () => null) },
        );
      },
    });
    const html = renderToStaticMarkup(
      React.createElement(moduleExports.default),
    );
    assert.match(html, /lessonLockedDescription/);
    assert.match(html, /returnToAvailableLesson/);
  }
});

for (const hasQuiz of [false, true]) {
  for (const examAvailable of [false, true]) {
    test('quiz requires both flags: ' + hasQuiz + '/' + examAvailable, () => {
      const current = lesson('a', 1, { hasQuiz, examAvailable, isUnlocked: true, videoUrl: 'video' });
      assert.equal(exports.hasUnfinishedRequirements(current), hasQuiz && examAvailable);
      assert.equal(exports.isLearningSelectionLocked([current], 'a', 'quiz', false), !(hasQuiz && examAvailable));
      const result = exports.applyLessonProgression(section([current, lesson('b', 2, { isUnlocked: true })]));
      assert.equal(result[0].lessons[1].isUnlocked, !(hasQuiz && examAvailable));
    });
  }
}
