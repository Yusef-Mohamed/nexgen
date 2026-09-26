import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { z } from "zod";

const root = new URL("../", import.meta.url);
function load(relative, mocks = {}) {
  const source = readFileSync(new URL(relative, root), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(output, { exports, FormData, console, require(name) {
    if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`);
    return mocks[name];
  } });
  return exports;
}
const { getSectionId, mergeSectionUpdate, moveRelative } = load("hooks/curriculumState.ts");
const plain = value => JSON.parse(JSON.stringify(value));
const sections = () => Array.from({ length: 7 }, (_, i) => ({ sectionId: `section-${i + 1}`, title: { en: `Section ${i + 1}`, ar: `قسم ${i + 1}` }, order: i + 1, lessons: [{ _id: `lesson-${i + 1}`, order: i + 1 }] }));
test("rename section seven preserves every lesson, parent and current ordering", () => {
  const current = sections();
  const changed = mergeSectionUpdate(current, { _id: "section-7", title: { en: "AI", ar: "ذكاء" }, order: 1 }, true);
  assert.equal(changed[6].title.en, "AI");
  assert.equal(changed[6].order, 7);
  assert.equal(changed[6].lessons, current[6].lessons);
  assert.deepEqual(plain(changed.map(getSectionId)), current.map(getSectionId));
  assert.deepEqual(plain(changed.flatMap(s => s.lessons)), current.flatMap(s => s.lessons));
  assert.equal(changed[0], current[0]);
});
test("rename after unsaved cross-section move preserves the move and empty source", () => {
  const current = sections();
  current[1].lessons.push(current[6].lessons.pop());
  const reordered = moveRelative(current, 6, 1, "below");
  const result = mergeSectionUpdate(reordered, { _id: "section-7", title: { en: "Renamed", ar: "جديد" }, lessons: [{ _id: "stale" }] }, true);
  assert.deepEqual(plain(result[2].lessons), []);
  assert.equal(result[1].lessons[1]._id, "lesson-7");
  assert.deepEqual(plain(result.map(getSectionId)), plain(reordered.map(getSectionId)));
});
test("newly created sections have a stable ID and empty lesson list", () => {
  const result = mergeSectionUpdate([], { _id: "new", title: "New" }, false);
  assert.equal(getSectionId(result[0]), "new");
  assert.deepEqual(plain(result[0].lessons), []);
});
for (const [from, target, position, expected] of [
  [0, 2, "above", ["b", "a", "c", "d"]],
  [0, 2, "below", ["b", "c", "a", "d"]],
  [3, 1, "above", ["a", "d", "b", "c"]],
  [3, 1, "below", ["a", "b", "d", "c"]],
  [0, 1, "above", ["a", "b", "c", "d"]],
]) {
  test(`drag ${from} ${position} ${target} stays adjacent to the actual target`, () => {
    const source = ["a", "b", "c", "d"];
    assert.deepEqual(plain(moveRelative(source, from, target, position)), expected);
    assert.deepEqual(source, ["a", "b", "c", "d"]);
  });
}
function hookMocks() {
  const requests = [];
  const axiosInstance = { put: async (...args) => { requests.push(["put", ...args]); return { data: { data: { _id: "section-7" } } }; }, post: async (...args) => { requests.push(["post", ...args]); return { data: { data: { _id: "new" } } }; } };
  const mocks = {
    react: { useState: initial => [initial, () => {}], useEffect() {} },
    "next-intl": { useTranslations: () => key => key, useLocale: () => "ar" },
    "@/app/lib/utils": { axiosInstance },
    "@/components/auth-provider": { useAuth: () => ({ token: true }) },
    "react-hook-form": { useForm: () => ({ reset() {} }) },
    "@hookform/resolvers/zod": { zodResolver: () => {} },
    zod: { z, ...z },
    "@/lib/utils": { getStringObject: value => value },
  };
  return { mocks, requests };
}
for (const legacy of [false, true]) {
  test(`section rename request only updates title (legacy ID=${legacy})`, async () => {
    const { mocks, requests } = hookMocks();
    const { useSectionEditDialog } = load("components/SectionEditDialog/useSectionEditDialog.ts", mocks);
    let updated;
    const hook = useSectionEditDialog({ section: legacy ? { sectionId: "section-7" } : { _id: "section-7" }, isEdit: true, courseId: "course", sectionsLength: 7, onSectionUpdated: value => { updated = value; } });
    assert.equal(await hook.onSubmit({ title: { en: "AI section", ar: "قسم الذكاء" } }), true);
    assert.equal(requests[0][1], "/sections/section-7");
    assert.deepEqual(Object.keys(requests[0][2]), ["title"]);
    assert.equal(updated.title.en, "AI section");
    assert.equal(updated.title.ar, "قسم الذكاء");
    assert.equal(updated.title.localized, "قسم الذكاء");
  });
}
test("lesson edit never changes global order or pending parent placement", async () => {
  const { mocks, requests } = hookMocks();
  const { useLessonEditDialog } = load("components/LessonEditDialog/useLessonEditDialog.ts", mocks);
  const hook = useLessonEditDialog({ lesson: { _id: "lesson-20", order: 20 }, isEdit: true, courseId: "course", sectionId: "pending-new-section", lessonsLength: 25, onLessonUpdated() {} });
  assert.equal(await hook.onSubmit({ title: { en: "English", ar: "عربي" }, description: { en: "Description", ar: "الوصف" }, lessonDuration: "10", videoUrl: "existing-video" }), true);
  const payload = requests[0][2];
  assert.equal(requests[0][1], "/lessons/lesson-20");
  for (const field of ["order", "section", "course"]) assert.equal(payload.has(field), false);
  assert.equal(payload.get("title[ar]"), "عربي");
});
test("new lesson receives course-wide append order", async () => {
  const { mocks, requests } = hookMocks();
  const { useLessonEditDialog } = load("components/LessonEditDialog/useLessonEditDialog.ts", mocks);
  const hook = useLessonEditDialog({ isEdit: false, courseId: "course", sectionId: "section-7", lessonsLength: 25, onLessonUpdated() {} });
  await hook.onSubmit({ title: { en: "English", ar: "عربي" }, description: { en: "Description", ar: "الوصف" }, lessonDuration: "10", videoUrl: "existing-video" });
  const payload = requests[0][2];
  assert.equal(payload.get("order"), "26");
  assert.equal(payload.get("section"), "section-7");
});
