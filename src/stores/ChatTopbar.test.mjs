import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../app/[locale]/dashboard/chat/components/ChatTopbar.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

for (const isGroupChat of [false, true]) test(`chat header survives missing optional group fields (group=${isGroupChat})`, () => {
  const states = [];
  const effects = [];
  let cursor = 0;
  const react = {
    useState: initial => {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], value => { states[index] = value; }];
    },
    useEffect: effect => effects.push(effect),
  };
  const chat = { _id: "chat", isGroupChat, participants: [
    { _id: "member", user: "other", userDetails: { _id: "other", name: "Tester" } },
  ] };
  const testModule = { exports: {} };
  vm.runInNewContext(source, { module: testModule, exports: testModule.exports, require: name => {
    if (name === "react") return react;
    if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
    if (name === "next-intl") return { useLocale: () => "en", useTranslations: () => key => key };
    if (name === "@/stores/ChatStore") return { useChatStore: () => ({ thisChat: chat, chats: [chat] }) };
    if (name === "@/components/auth-provider") return { useAuth: () => ({ user: { _id: "me" } }) };
    if (name === "@/hooks/useSearchParams") return { default: () => ({ setSearchParams: () => {} }) };
    if (name === "@/lib/utils") return { cn: () => "" };
    // Visual primitives do not execute in this header state regression test.
    return new Proxy({}, { get: () => () => null });
  } });
  testModule.exports.default();
  effects.forEach(effect => effect());
  cursor = 0;
  assert.doesNotThrow(() => testModule.exports.default());
});
