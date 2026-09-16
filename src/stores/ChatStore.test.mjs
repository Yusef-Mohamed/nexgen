import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { create } from "zustand";
const source = ts.transpileModule(readFileSync(new URL("./ChatStore.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const testModule = { exports: {} };
vm.runInNewContext(source, { exports: testModule.exports, module: testModule, require: name => {
  if (name === "zustand") return { create };
  throw new Error("Unexpected dependency: " + name);
}});
const { useChatStore: store, isCurrentChatRequest } = testModule.exports;
test("safety changes clear chat content, previews and drafts and reject old HTTP responses", () => {
  const state = store.getState();
  state.setSelectedChatId("chat-one");
  state.setChats([{ _id: "chat-one", lastMessage: [{ text: "cached" }] }]);
  state.setMessages([{ _id: "message-one", text: "cached" }]);
  state.setThisChat({ _id: "chat-one" });
  state.setActionOnMessage({ action: "reply", message: { text: "cached" } });
  const epoch = store.getState().safetyEpoch;
  assert.equal(isCurrentChatRequest(epoch, "chat-one"), true);
  state.resetSafety();
  const cleared = store.getState();
  assert.equal(cleared.messages.length, 0);
  assert.equal(cleared.chats.length, 0);
  assert.equal(cleared.thisChat, null);
  assert.equal(cleared.actionOnMessage, null);
  assert.equal(isCurrentChatRequest(epoch, "chat-one"), false);
  assert.equal(isCurrentChatRequest(cleared.safetyEpoch, "chat-one"), true);
  state.setSelectedChatId("chat-two");
  assert.equal(isCurrentChatRequest(cleared.safetyEpoch, "chat-one"), false);
});
