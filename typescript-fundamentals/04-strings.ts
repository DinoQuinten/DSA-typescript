// ================================================================
// 🔤 Section 4: Strings
// Run standalone:  bun run 04-strings.ts
// ================================================================

import { title, sub, explain, code, codeRaw, warn, tip, log } from "./_helpers";

export function run() {
  title("🔤", "Section 4: Strings");
  explain("Strings are IMMUTABLE — you cannot change a character in place.");
  explain("Every string method returns a NEW string. ~20% of LeetCode is string-based.");

  sub("Accessing characters");
  const str = "Hello, TypeScript!";
  log();
  code(`"Hello, TypeScript!".length`, str.length);
  code(`str.charAt(0)`, str.charAt(0));
  code(`str[0]`, str[0]);
  explain("  ↳ Both work, bracket notation is more common");
  warn("str[0] = 'h' does NOTHING — strings can't be modified in place!");

  sub("Essential methods you'll use constantly");
  log();
  code(`.toLowerCase()`, str.toLowerCase());
  code(`.toUpperCase()`, str.toUpperCase());
  code(`"  spaces  ".trim()`, "  spaces  ".trim());
  explain("  ↳ Removes whitespace from both ends");
  code(`.slice(0, 5)`, str.slice(0, 5));
  explain("  ↳ Extract a substring from index 0 to 4 (end is exclusive)");
  code(`.indexOf("Type")`, str.indexOf("Type"));
  explain("  ↳ Returns the position where 'Type' starts (7), or -1 if not found");
  code(`.includes("Type")`, str.includes("Type"));
  explain("  ↳ Just checks if it exists — true/false");
  code(`.startsWith("Hello")`, str.startsWith("Hello"));
  code(`.endsWith("!")`, str.endsWith("!"));
  code(`"aab".replace("a", "x")`, "aab".replace("a", "x"));
  explain("  ↳ Only replaces the FIRST occurrence");
  code(`"aab".replaceAll("a", "x")`, "aab".replaceAll("a", "x"));
  explain("  ↳ Replaces ALL occurrences");

  sub("String ↔ Array conversions — used ALL THE TIME");
  explain("You often need to convert a string to an array, manipulate it, then join back:");
  log();
  code(`"hello".split("")`, "hello".split(""));
  explain("  ↳ String → Array of characters");
  code(`["h","e","l","l","o"].join("")`, ["h", "e", "l", "l", "o"].join(""));
  explain("  ↳ Array → String (glue them back together)");
  code(`"apple,banana".split(",")`, "apple,banana".split(","));
  explain("  ↳ Split by delimiter → array of words");

  sub("Character codes (ASCII) — for frequency counting");
  explain("Each character has a numeric code. Used to map letters to array indices:");
  log();
  code(`"a".charCodeAt(0)`, "a".charCodeAt(0));
  code(`"z".charCodeAt(0)`, "z".charCodeAt(0));
  explain("  ↳ a=97 to z=122 — that's 26 letters");
  log();
  const letterIndex = "c".charCodeAt(0) - "a".charCodeAt(0);
  code(`"c".charCodeAt(0) - "a".charCodeAt(0)`, letterIndex);
  tip("This maps 'a'→0, 'b'→1, 'c'→2, etc. Perfect for frequency arrays!");
}

if (import.meta.main) run();
