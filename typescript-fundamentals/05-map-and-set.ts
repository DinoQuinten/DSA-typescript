// ================================================================
// 🗺️ Section 5: Map & Set — Critical for DSA
// Run standalone:  bun run 05-map-and-set.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log, color } from "./_helpers";

export function run() {
  title("🗺️", "Section 5: Map & Set — Critical for DSA");
  explain("Map = key→value store with O(1) get/set/has/delete.");
  explain("Set = unique values only with O(1) add/has/delete.");
  explain("You'll use these in ~30% of all LeetCode problems.");

  sub("Map — stores key-value pairs");
  log();
  const fruitCount = new Map<string, number>();
  fruitCount.set("apple", 3);
  fruitCount.set("banana", 5);
  fruitCount.set("cherry", 2);

  codeRaw(`map.set("apple", 3)`, `Store "apple" with value 3`);
  codeRaw(`map.set("banana", 5)`, `Store "banana" with value 5`);
  code(`map.get("apple")`, fruitCount.get("apple"));
  explain("  ↳ Retrieve the value for a key — O(1) instant lookup!");
  code(`map.get("missing")`, fruitCount.get("missing"));
  explain("  ↳ Returns undefined if key doesn't exist");
  code(`map.has("apple")`, fruitCount.has("apple"));
  explain("  ↳ Check if key exists — true/false");
  fruitCount.delete("cherry");
  code(`map.delete("cherry")  →  map.size`, fruitCount.size);

  sub("Most important DSA pattern: Frequency Counter");
  explain("Count how many times each character appears in a string.");
  explain("You'll write this pattern in almost every hash map problem:");
  log();
  const word = "abracadabra";
  const charFreq = new Map<string, number>();
  for (const ch of word) {
    charFreq.set(ch, (charFreq.get(ch) ?? 0) + 1);
  }
  codeRaw(`for (const ch of "${word}")`, "");
  codeRaw(`  map.set(ch, (map.get(ch) ?? 0) + 1)`, "");
  log();
  explain("  Result:");
  for (const [char, count] of charFreq) {
    log(color.green(`     '${char}' → ${count} times`));
  }
  log();
  tip("The ?? 0 part means: if the key doesn't exist yet, start counting from 0.");

  sub("Set — stores unique values only");
  explain("Adding duplicates is silently ignored. Perfect for deduplication:");
  log();
  const seen = new Set<number>();
  seen.add(1); seen.add(2); seen.add(3); seen.add(1); seen.add(2);
  codeRaw(`set.add(1, 2, 3, 1, 2)`, `Set { 1, 2, 3 }  — duplicates ignored!`);
  code(`set.size`, seen.size);
  code(`set.has(1)`, seen.has(1));
  code(`set.has(99)`, seen.has(99));

  log();
  explain("One-liner tricks with Set:");
  const withDupes = [1, 3, 5, 3, 7, 5, 1];
  code(`[...new Set([1,3,5,3,7,5,1])]`, [...new Set(withDupes)]);
  explain("  ↳ Remove all duplicates from an array — one line!");
  code(`arr.length !== new Set(arr).size`, withDupes.length !== new Set(withDupes).size);
  explain("  ↳ Check if array has duplicates — one line!");
}

if (import.meta.main) run();
