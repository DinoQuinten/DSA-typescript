// ================================================================
// ❓ Section 11: Null Handling — Critical for Trees & Linked Lists
// Run standalone:  bun run 11-null-handling.ts
// ================================================================

import { title, sub, explain, code, codeRaw, warn, tip, log } from "./_helpers";
import { TreeNode } from "./_shared";

export function run() {
  title("❓", "Section 11: Null Handling — Critical for Trees & Linked Lists");
  explain("In DSA, null is EVERYWHERE:");
  explain("  - Linked list's next → null at the end");
  explain("  - Tree node's left/right → null for missing children");
  explain("  - Function returns → null when nothing found");
  explain("Master this to avoid runtime crashes.");

  sub("Optional chaining (?.) — safely access nested properties");
  explain("If any part in the chain is null/undefined, returns undefined instead of crashing:");
  log();
  const deepTree = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
  code(`tree?.left?.left?.val`, deepTree?.left?.left?.val);
  explain("  ↳ Safely walks down: tree → left child → left child → value");
  code(`tree?.right?.left?.val`, deepTree?.right?.left?.val);
  explain("  ↳ right is null, so the whole chain returns undefined — NO crash!");
  warn("Without ?. this would throw: 'Cannot read property val of null'");

  sub("Nullish coalescing (??) — provide a default value");
  explain("?? triggers ONLY for null/undefined. NOT for 0, '', or false:");
  log();
  const map = new Map<string, number>();
  map.set("a", 0);
  code(`map.get("a") ?? 99`, map.get("a") ?? 99);
  explain("  ↳ 'a' exists with value 0 → returns 0 (correct!)");
  code(`map.get("b") ?? 99`, map.get("b") ?? 99);
  explain("  ↳ 'b' doesn't exist → returns default 99");
  log();
  warn("Compare with || which ALSO triggers for 0, '', and false:");
  code(`map.get("a") || 99`, map.get("a") || 99);
  explain("  ↳ WRONG! 0 is falsy, so || replaces it with 99");
  tip("Always use ?? instead of || when the value could be 0 or empty string.");

  sub("Type narrowing — TypeScript gets smarter after null checks");
  log();
  function processNode(node: TreeNode | null): string {
    if (node === null) return "null";
    return `TreeNode(${node.val})`;
  }
  codeRaw(`if (node === null) return "null"`, "After this check...");
  codeRaw(`node.val`, "TS KNOWS node is TreeNode, not null!");
  code(`processNode(new TreeNode(42))`, processNode(new TreeNode(42)));
  code(`processNode(null)`, processNode(null));
}

if (import.meta.main) run();
