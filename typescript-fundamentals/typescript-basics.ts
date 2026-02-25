export {};

// ================================================================
// 🚀 TYPESCRIPT FUNDAMENTALS — Complete Runnable Tutorial
// ================================================================
// Run this file: bun run typescript-basics.ts
// Every section is self-contained and prints its own output.
// Read the comments — they ARE the tutorial.
// ================================================================

console.log("=".repeat(60));
console.log("🚀 TypeScript Fundamentals — Let's learn!");
console.log("=".repeat(60));

// ================================================================
// 📝 SECTION 1: VARIABLES & TYPES
// ================================================================
// TypeScript adds types to JavaScript. Types tell the compiler
// what kind of data a variable holds, so it can catch mistakes
// BEFORE your code runs.
// ================================================================

console.log("\n📝 SECTION 1: Variables & Types");
console.log("-".repeat(40));

// ✅ const — for values that never change (use this by default)
const PI = 3.14159;
const courseName: string = "DSA with TypeScript";

// ✅ let — for values that WILL change
let score: number = 0;
score = 100; // This is fine — let allows reassignment

// ❌ var — NEVER use. It has confusing scoping rules.
// var bad = "don't do this";

// 🎨 Primitive types — the building blocks
const greeting: string = "Hello, DSA!";    // Text
const age: number = 25;                     // Numbers (int AND float — same type!)
const isReady: boolean = true;              // true or false
const empty: null = null;                   // Intentionally nothing
const notSet: undefined = undefined;        // Not yet assigned

console.log("greeting:", greeting);
console.log("age:", age, "— typeof:", typeof age);
console.log("isReady:", isReady);
console.log("empty:", empty);
console.log("notSet:", notSet);

// 🧠 Type inference — TypeScript figures out the type automatically
// You don't NEED to write the type when it's obvious from the value
const inferredString = "TypeScript knows this is a string";
const inferredNumber = 42;
const inferredBool = true;

// 🚨 any vs unknown — two very different approaches to "I don't know the type"

// ❌ any — disables type checking entirely. Avoid!
let dangerous: any = "hello";
dangerous = 42;         // No error — TypeScript gave up checking
dangerous = [1, 2, 3];  // Still no error — any accepts everything

// ✅ unknown — the safe version. Forces you to check the type first
let safe: unknown = "hello";
// safe.toUpperCase();  // ❌ Error! TypeScript won't let you use it blindly
if (typeof safe === "string") {
  console.log("safe (after type check):", safe.toUpperCase()); // ✅ Now it's safe
}

// 📜 Template literals — embed expressions inside strings using backticks
const name = "Prasanna";
const points = 95;
const message = `${name} scored ${points} points!`;
console.log("Template literal:", message);

// You can put ANY expression inside ${}
console.log(`2 + 3 = ${2 + 3}`);
console.log(`Is even? ${points % 2 === 0}`);

// ================================================================
// 🔢 SECTION 2: NUMBERS & MATH
// ================================================================
// TypeScript has ONE number type — no int vs float distinction.
// All numbers are 64-bit floating point (IEEE 754).
// For DSA, the key Math methods are listed below.
// ================================================================

console.log("\n🔢 SECTION 2: Numbers & Math");
console.log("-".repeat(40));

// 📐 Essential Math methods you'll use constantly
console.log("Math.floor(3.7):", Math.floor(3.7));   // 3  — round DOWN
console.log("Math.ceil(3.2):", Math.ceil(3.2));      // 4  — round UP
console.log("Math.round(3.5):", Math.round(3.5));    // 4  — round to nearest
console.log("Math.max(1, 5, 3):", Math.max(1, 5, 3)); // 5
console.log("Math.min(1, 5, 3):", Math.min(1, 5, 3)); // 1
console.log("Math.abs(-7):", Math.abs(-7));           // 7
console.log("Math.pow(2, 10):", Math.pow(2, 10));     // 1024
console.log("Math.sqrt(144):", Math.sqrt(144));        // 12

// ♾️ Special numeric values
console.log("Infinity:", Infinity);
console.log("-Infinity:", -Infinity);
console.log("MAX_SAFE_INTEGER:", Number.MAX_SAFE_INTEGER); // 9007199254740991

// ➗ Integer division — TypeScript has NO integer division operator!
// You MUST manually floor the result
const a = 7, b = 2;
console.log("7 / 2 =", a / b);                  // 3.5 — regular division
console.log("Math.floor(7/2) =", Math.floor(a / b)); // 3 — integer division

// % Modulo — gives the remainder. Used everywhere in DSA.
console.log("7 % 3 =", 7 % 3);     // 1   (7 = 2×3 + 1)
console.log("10 % 2 =", 10 % 2);   // 0   (even number!)
console.log("10 % 3 =", 10 % 3);   // 1   (not divisible by 3)

// 🔧 Bitwise operators — used in some tricky LeetCode problems
console.log("5 & 3 =", 5 & 3);     // 1  (AND)
console.log("5 | 3 =", 5 | 3);     // 7  (OR)
console.log("5 ^ 3 =", 5 ^ 3);     // 6  (XOR)
console.log("1 << 3 =", 1 << 3);   // 8  (left shift = multiply by 2^3)
console.log("8 >> 2 =", 8 >> 2);   // 2  (right shift = divide by 2^2)

// 🎯 Classic: find single number using XOR (every other number appears twice)
const xorNums = [2, 1, 4, 1, 2];
let single = 0;
for (const n of xorNums) single ^= n;
console.log("Single number (XOR trick):", single); // 4

// ================================================================
// 📦 SECTION 3: ARRAYS — The Most Important Data Structure
// ================================================================
// Arrays are ordered collections stored in contiguous memory.
// In TypeScript, arrays are dynamic (they grow automatically).
// You'll use arrays in ~40% of all LeetCode problems.
// ================================================================

console.log("\n📦 SECTION 3: Arrays");
console.log("-".repeat(40));

// 🏗️ Creating arrays — multiple ways, each useful in different situations
const fruits: string[] = ["apple", "banana", "cherry"];
const numbers: number[] = [1, 2, 3, 4, 5];
console.log("fruits:", fruits);
console.log("numbers:", numbers);

// Pre-filled array of zeros — you'll use this ALL THE TIME in DP
const zeros: number[] = new Array(10).fill(0);
console.log("Zeros:", zeros);

// Array.from — create arrays with custom initialization
// The (_, i) means "ignore the value, use the index"
const indices = Array.from({ length: 5 }, (_, i) => i);
console.log("Indices:", indices); // [0, 1, 2, 3, 4]

const squares = Array.from({ length: 5 }, (_, i) => i * i);
console.log("Squares:", squares); // [0, 1, 4, 9, 16]

// ⚠️ GOTCHA: Creating 2D arrays — the WRONG way vs RIGHT way
// WRONG: All rows point to the SAME inner array (changing one changes all!)
const wrong2D = new Array(3).fill(new Array(3).fill(0));
wrong2D[0][0] = 1;
console.log("Wrong 2D:", JSON.stringify(wrong2D));
// [[1,0,0], [1,0,0], [1,0,0]] — ALL rows changed! 😱

// RIGHT: Each row is a NEW independent array
const right2D = Array.from({ length: 3 }, () => new Array(3).fill(0));
right2D[0][0] = 1;
console.log("Right 2D:", JSON.stringify(right2D));
// [[1,0,0], [0,0,0], [0,0,0]] — Only first row changed! ✅

// 📊 Array methods with Big O complexity

const arr = [10, 20, 30, 40, 50];

// O(1) operations — FAST
arr.push(60);              // Add to end → [10, 20, 30, 40, 50, 60]
console.log("After push(60):", arr);

const popped = arr.pop();  // Remove from end → [10, 20, 30, 40, 50]
console.log("Popped:", popped, "Array:", arr);

// O(n) operations — SLOW (shifts all elements)
arr.unshift(5);             // Add to start → [5, 10, 20, 30, 40, 50]
console.log("After unshift(5):", arr);

const shifted = arr.shift(); // Remove from start → [10, 20, 30, 40, 50]
console.log("Shifted:", shifted, "Array:", arr);

// slice — creates a COPY of a portion (does NOT modify original)
const sliced = arr.slice(1, 3);
console.log("slice(1,3):", sliced);  // [20, 30]
console.log("Original unchanged:", arr);

// splice — MODIFIES the array (removes/inserts at index)
const spliced = [1, 2, 3, 4, 5];
spliced.splice(2, 1);       // Remove 1 element at index 2
console.log("After splice(2,1):", spliced); // [1, 2, 4, 5]

// 🔄 Iteration patterns — 4 ways to loop through arrays

console.log("\nIteration patterns:");
const iterArr = [10, 20, 30];

// 1️⃣ Classic for loop — use when you NEED the index
console.log("Classic for:");
for (let i = 0; i < iterArr.length; i++) {
  console.log(`  Index ${i}: ${iterArr[i]}`);
}

// 2️⃣ for...of — cleanest way when you just need values
console.log("for...of:");
for (const val of iterArr) {
  console.log(`  Value: ${val}`);
}

// 3️⃣ forEach — functional style, gives value AND index
console.log("forEach:");
iterArr.forEach((val, i) => {
  console.log(`  [${i}] = ${val}`);
});

// 4️⃣ Reverse iteration — useful in many algorithms
console.log("Reverse:");
for (let i = iterArr.length - 1; i >= 0; i--) {
  console.log(`  Index ${i}: ${iterArr[i]}`);
}

// 🧮 Functional array methods — transform data without loops
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const doubled = nums.map(n => n * 2);
console.log("map (×2):", doubled);

const evens = nums.filter(n => n % 2 === 0);
console.log("filter (evens):", evens);

const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("reduce (sum):", sum);

const firstBig = nums.find(n => n > 5);
console.log("find (>5):", firstBig);

const bigIndex = nums.findIndex(n => n > 5);
console.log("findIndex (>5):", bigIndex);

console.log("some (>5):", nums.some(n => n > 5));
console.log("every (>0):", nums.every(n => n > 0));
console.log("includes(5):", nums.includes(5));

// 🔀 Sorting — CRITICAL: .sort() has a GOTCHA!
const unsorted = [10, 9, 2, 30, 100];
console.log("\nBefore sort:", [...unsorted]);

// ❌ Default sort converts to STRINGS first (lexicographic order)
const wrongSort = [...unsorted].sort();
console.log("Wrong sort (default):", wrongSort); // [10, 100, 2, 30, 9] — WRONG!

// ✅ Always provide a comparator for numbers
const ascending = [...unsorted].sort((a, b) => a - b);
console.log("Ascending:", ascending);   // [2, 9, 10, 30, 100]

const descending = [...unsorted].sort((a, b) => b - a);
console.log("Descending:", descending); // [100, 30, 10, 9, 2]

// ✂️ Destructuring arrays
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log("\nDestructuring: first =", first, "second =", second, "rest =", rest);

// 🔄 Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log("Spread merge:", merged); // [1, 2, 3, 4, 5, 6]

// ================================================================
// 🔤 SECTION 4: STRINGS
// ================================================================
// Strings are IMMUTABLE — you cannot change a character in place.
// Every string method returns a NEW string.
// ~20% of LeetCode problems are string-based.
// ================================================================

console.log("\n🔤 SECTION 4: Strings");
console.log("-".repeat(40));

const str = "Hello, TypeScript!";
console.log("Original:", str);
console.log("Length:", str.length);

// Accessing characters (0-indexed, just like arrays)
console.log("charAt(0):", str.charAt(0));     // "H"
console.log("str[0]:", str[0]);               // "H" — bracket notation also works

// ⚠️ Strings are IMMUTABLE — you can't do str[0] = "h"
// str[0] = "h";  // ❌ This does nothing (silently fails)

// 🔧 Essential string methods
console.log("toLowerCase():", str.toLowerCase());
console.log("toUpperCase():", str.toUpperCase());
console.log("trim():", "  spaces  ".trim());
console.log("slice(0, 5):", str.slice(0, 5));         // "Hello"
console.log("substring(7, 17):", str.substring(7, 17)); // "TypeScript"
console.log("indexOf('Type'):", str.indexOf("Type"));   // 7
console.log("includes('Type'):", str.includes("Type")); // true
console.log("startsWith('Hello'):", str.startsWith("Hello")); // true
console.log("endsWith('!'):", str.endsWith("!"));       // true
console.log("repeat(2):", "ha".repeat(3));              // "hahaha"
console.log("replace:", "aab".replace("a", "x"));      // "xab" — first only
console.log("replaceAll:", "aab".replaceAll("a", "x")); // "xxb" — all

// 🔄 String ↔ Array conversions — used ALL THE TIME
const chars = "hello".split("");
console.log("split(''):", chars);        // ["h", "e", "l", "l", "o"]

const fromArr = ["h", "e", "l", "l", "o"].join("");
console.log("join(''):", fromArr);       // "hello"

// Using Array.from for string → array
const chars2 = Array.from("hello");
console.log("Array.from:", chars2);      // ["h", "e", "l", "l", "o"]

// Splitting by delimiter
const csv = "apple,banana,cherry";
const items = csv.split(",");
console.log("split(','):", items);       // ["apple", "banana", "cherry"]

// 🔤 Character codes (ASCII) — used in frequency counting problems
console.log("\nCharacter codes:");
console.log("'a'.charCodeAt(0):", "a".charCodeAt(0));  // 97
console.log("'z'.charCodeAt(0):", "z".charCodeAt(0));  // 122
console.log("'A'.charCodeAt(0):", "A".charCodeAt(0));  // 65
console.log("'0'.charCodeAt(0):", "0".charCodeAt(0));  // 48

console.log("String.fromCharCode(97):", String.fromCharCode(97)); // "a"

// 🎯 DSA pattern: map a letter to an index (0-25)
const letterIndex = "c".charCodeAt(0) - "a".charCodeAt(0);
console.log("'c' index (0-based):", letterIndex); // 2

// ⚖️ String comparison — lexicographic (dictionary order)
console.log("\nComparisons:");
console.log("'apple' < 'banana':", "apple" < "banana");   // true
console.log("'abc' === 'abc':", "abc" === "abc");          // true
console.log("'abc' < 'abd':", "abc" < "abd");              // true

// ================================================================
// 🗺️ SECTION 5: MAP & SET — Critical for DSA
// ================================================================
// Map = key-value store with O(1) get/set/has/delete
// Set = unique values with O(1) add/has/delete
// You'll use these in ~30% of LeetCode problems.
// ================================================================

console.log("\n🗺️ SECTION 5: Map & Set");
console.log("-".repeat(40));

// 📍 Map — stores key-value pairs
const fruitCount = new Map<string, number>();

// .set() — add or update a key-value pair
fruitCount.set("apple", 3);
fruitCount.set("banana", 5);
fruitCount.set("cherry", 2);
console.log("Map:", fruitCount);

// .get() — retrieve a value (returns undefined if key doesn't exist)
console.log("get('apple'):", fruitCount.get("apple"));     // 3
console.log("get('missing'):", fruitCount.get("missing")); // undefined

// .has() — check if key exists
console.log("has('apple'):", fruitCount.has("apple"));     // true
console.log("has('grape'):", fruitCount.has("grape"));     // false

// .delete() — remove a key
fruitCount.delete("cherry");
console.log("After delete('cherry'):", fruitCount.size);   // 2

// 🎯 Most important DSA pattern: frequency counter
// Count how many times each character appears in a string
const word = "abracadabra";
const charFreq = new Map<string, number>();
for (const ch of word) {
  charFreq.set(ch, (charFreq.get(ch) ?? 0) + 1);
  // ?? 0 means: if get() returns undefined, use 0 instead
}
console.log("\nFrequency of '" + word + "':");
for (const [char, count] of charFreq) {
  console.log(`  '${char}' appears ${count} times`);
}

// 🔄 Map iteration
console.log("\nMap iteration:");
const scoreMap = new Map<string, number>([
  ["Alice", 95],
  ["Bob", 87],
  ["Charlie", 92],
]);

// for...of with destructuring — cleanest way
for (const [name, score] of scoreMap) {
  console.log(`  ${name}: ${score}`);
}

// Get keys, values, or entries as arrays
console.log("Keys:", [...scoreMap.keys()]);
console.log("Values:", [...scoreMap.values()]);

// 🎯 Set — stores UNIQUE values only
console.log("\nSet:");
const seen = new Set<number>();

seen.add(1);
seen.add(2);
seen.add(3);
seen.add(1);  // ← Duplicate! Silently ignored.
seen.add(2);  // ← Duplicate! Silently ignored.
console.log("Set after adding [1,2,3,1,2]:", seen); // Set { 1, 2, 3 }
console.log("Size:", seen.size);          // 3 (not 5!)
console.log("has(1):", seen.has(1));      // true
console.log("has(99):", seen.has(99));    // false

// 🎯 Remove duplicates from an array — one-liner!
const withDupes = [1, 3, 5, 3, 7, 5, 1];
const unique = [...new Set(withDupes)];
console.log("Remove dupes:", unique); // [1, 3, 5, 7]

// 🎯 Check for duplicates in an array
const hasDuplicates = withDupes.length !== new Set(withDupes).size;
console.log("Has duplicates?", hasDuplicates); // true

// ================================================================
// 🔧 SECTION 6: FUNCTIONS
// ================================================================
// Functions are the building blocks of algorithms.
// You'll use them for recursion, helpers, and callbacks.
// ================================================================

console.log("\n🔧 SECTION 6: Functions");
console.log("-".repeat(40));

// 1️⃣ Function declaration — classic syntax, hoisted
function add(a: number, b: number): number {
  return a + b;
}
console.log("add(2, 3):", add(2, 3));

// 2️⃣ Arrow function — concise, modern, most common
const multiply = (a: number, b: number): number => a * b;
console.log("multiply(4, 5):", multiply(4, 5));

// Arrow with body — when you need multiple statements
const safeDivide = (a: number, b: number): number | null => {
  if (b === 0) return null;
  return a / b;
};
console.log("safeDivide(10, 3):", safeDivide(10, 3));
console.log("safeDivide(10, 0):", safeDivide(10, 0));

// ⚙️ Optional parameters — marked with ?
function greet(userName: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${userName}!`;
}
console.log(greet("Prasanna"));           // "Hello, Prasanna!"
console.log(greet("Prasanna", "Hey"));    // "Hey, Prasanna!"

// ⚙️ Default parameters — have a fallback value
function createFilledArray(size: number, fill: number = 0): number[] {
  return new Array(size).fill(fill);
}
console.log("Default fill:", createFilledArray(5));     // [0,0,0,0,0]
console.log("Custom fill:", createFilledArray(3, 7));   // [7,7,7]

// ⚙️ Rest parameters — accept any number of arguments
function sumAll(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log("sumAll(1,2,3):", sumAll(1, 2, 3));       // 6
console.log("sumAll(1,2,3,4,5):", sumAll(1, 2, 3, 4, 5)); // 15

// 🔄 Callbacks — passing functions as arguments
// This is how .sort(), .map(), .filter() work under the hood
function processArray(arr: number[], transform: (n: number) => number): number[] {
  return arr.map(transform);
}
console.log("Double:", processArray([1, 2, 3], n => n * 2));
console.log("Square:", processArray([1, 2, 3], n => n ** 2));

// ================================================================
// 🔀 SECTION 7: CONTROL FLOW
// ================================================================
// Loops and conditionals are the engine of every algorithm.
// ================================================================

console.log("\n🔀 SECTION 7: Control Flow");
console.log("-".repeat(40));

// 🔀 if / else if / else
const testScore = 85;
if (testScore >= 90) {
  console.log("Grade: A");
} else if (testScore >= 80) {
  console.log("Grade: B"); // ← This runs
} else {
  console.log("Grade: C");
}

// Ternary — one-line if/else (great for inline decisions)
const grade = testScore >= 90 ? "A" : testScore >= 80 ? "B" : "C";
console.log("Ternary grade:", grade);

// 🔄 Classic for loop
console.log("\nCounting 0-4:");
for (let i = 0; i < 5; i++) {
  process.stdout.write(`${i} `); // print without newline
}
console.log();

// 🔄 while loop — great for "process until condition changes"
let n = 128;
let steps = 0;
while (n > 1) {
  n = Math.floor(n / 2);
  steps++;
}
console.log(`128 halved ${steps} times to reach 1`); // 7 times

// 🔄 for...of — iterate VALUES (use for arrays, strings, sets, maps)
console.log("for...of 'DSA':");
for (const char of "DSA") {
  process.stdout.write(`${char} `);
}
console.log();

// ⚠️ for...in — iterates KEYS/indices. Avoid for arrays!
// It can include prototype properties and returns string indices.
// Use for...of instead.

// 🛑 break — exit a loop entirely
console.log("Break at 3:");
for (let i = 0; i < 10; i++) {
  if (i === 3) break;
  process.stdout.write(`${i} `);
}
console.log();

// ⏭️ continue — skip current iteration, go to next
console.log("Skip evens:");
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  process.stdout.write(`${i} `);
}
console.log();

// 🏷️ Labeled break — break out of a specific outer loop
// Useful in 2D array problems
console.log("Labeled break (find target in 2D):");
const grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const target = 5;
let found = false;
search: for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    if (grid[r][c] === target) {
      console.log(`  Found ${target} at [${r}][${c}]`);
      found = true;
      break search; // Breaks out of BOTH loops
    }
  }
}

// ================================================================
// 🏗️ SECTION 8: CLASSES & OOP — For Data Structures
// ================================================================
// Classes let you build custom data structures:
// linked lists, trees, graphs, stacks, queues, heaps.
// ================================================================

console.log("\n🏗️ SECTION 8: Classes & OOP");
console.log("-".repeat(40));

// 📐 ListNode — the foundation of linked list problems
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// Build a linked list: 1 → 2 → 3 → null
const node3 = new ListNode(3);
const node2 = new ListNode(2, node3);
const node1 = new ListNode(1, node2);

// Traverse and print the linked list
let current: ListNode | null = node1;
const llValues: number[] = [];
while (current !== null) {
  llValues.push(current.val);
  current = current.next;
}
console.log("Linked list:", llValues.join(" → ") + " → null");

// 🏗️ Stack class — shows private, getters, and methods
class Stack<T> {
  private items: T[] = [];

  push(val: T): void {
    this.items.push(val);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const stack = new Stack<number>();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Stack peek:", stack.peek());    // 30
console.log("Stack size:", stack.size);       // 3
console.log("Stack pop:", stack.pop());       // 30
console.log("Stack after pop:", stack.peek()); // 20

// 🌳 TreeNode — shorthand constructor syntax
// Adding "public" before constructor params auto-creates properties
class TreeNode {
  constructor(
    public val: number = 0,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

//       1
//      / \
//     2   3
//    /
//   4
const tree = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4)),
  new TreeNode(3)
);
console.log("Tree root:", tree.val);
console.log("Tree left:", tree.left?.val);
console.log("Tree right:", tree.right?.val);
console.log("Tree left.left:", tree.left?.left?.val);

// ================================================================
// 🧬 SECTION 9: GENERICS — Reusable Data Structures
// ================================================================
// Generics let you write ONE piece of code that works with
// ANY type while keeping full type safety. The Stack<T> above
// already uses generics!
// ================================================================

console.log("\n🧬 SECTION 9: Generics");
console.log("-".repeat(40));

// 🔧 Generic function — works with ANY type
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// TypeScript infers the type from the argument
console.log("first([1,2,3]):", firstElement([1, 2, 3]));         // 1 (number)
console.log("first(['a','b']):", firstElement(["a", "b"]));      // "a" (string)

// You can also specify the type explicitly
console.log("first<number>:", firstElement<number>([10, 20]));   // 10

// 🔧 Generic function: identity — returns exactly what you pass in
function identity<T>(val: T): T {
  return val;
}
const numId = identity(42);       // type: number
const strId = identity("hello");  // type: string

// 🔒 Generic constraints — limit what types are allowed
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
console.log("Length of 'hello':", getLength("hello"));   // 5
console.log("Length of [1,2,3]:", getLength([1, 2, 3])); // 3
// getLength(123);  // ❌ Error! Numbers don't have .length

// 🎯 Generics in action: the Stack<T> class above works with any type
const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
console.log("Number stack peek:", numStack.peek());

const strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");
console.log("String stack peek:", strStack.peek());

// ================================================================
// 🔗 SECTION 10: INTERFACES & TYPE ALIASES
// ================================================================
// Interfaces and types define the SHAPE of data.
// Use them to describe what properties an object should have.
// ================================================================

console.log("\n🔗 SECTION 10: Interfaces & Types");
console.log("-".repeat(40));

// 📐 Interface — defines the shape of an object
interface Point {
  x: number;
  y: number;
}

const origin: Point = { x: 0, y: 0 };
console.log("Point:", origin);

// Optional properties — may or may not exist
interface Config {
  width: number;
  height: number;
  color?: string;  // Optional
}

const defaultConfig: Config = { width: 100, height: 50 };
const colorConfig: Config = { width: 100, height: 50, color: "blue" };
console.log("Config (no color):", defaultConfig);
console.log("Config (with color):", colorConfig);

// 🏷️ Type alias — can name ANY type, not just objects
type Direction = "north" | "south" | "east" | "west";
type Matrix = number[][];
type Comparator = (a: number, b: number) => number;
type Nullable<T> = T | null;

const dir: Direction = "north";
console.log("Direction:", dir);

// 🔑 Index signatures — when keys are dynamic
interface FrequencyMap {
  [key: string]: number;
}

const freq: FrequencyMap = {};
freq["apple"] = 3;
freq["banana"] = 5;
console.log("FrequencyMap:", freq);

// ================================================================
// ❓ SECTION 11: NULL HANDLING
// ================================================================
// In DSA, null is EVERYWHERE:
// - Linked list's next → null at the end
// - Tree node's left/right → null for missing children
// - Function returns → null when nothing found
// Master null handling to avoid runtime crashes.
// ================================================================

console.log("\n❓ SECTION 11: Null Handling");
console.log("-".repeat(40));

// 🔀 Union types with null — "this value might not exist"
let maybeNode: TreeNode | null = new TreeNode(42);
console.log("maybeNode:", maybeNode?.val);

maybeNode = null;
console.log("maybeNode (null):", maybeNode?.val); // undefined (no crash!)

// 🔗 Optional chaining (?.) — safely access nested properties
// If any part is null/undefined, the whole expression returns undefined
const deepTree = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
console.log("Deep access:", deepTree?.left?.left?.val);  // 3
console.log("Missing path:", deepTree?.right?.left?.val); // undefined (no crash!)

// 🛡️ Nullish coalescing (??) — provide a default for null/undefined
const mapLookup = new Map<string, number>();
mapLookup.set("a", 0);

// ?? only triggers for null/undefined (NOT for 0, "", false)
console.log("get('a') ?? 99:", mapLookup.get("a") ?? 99);     // 0 ← correct!
console.log("get('b') ?? 99:", mapLookup.get("b") ?? 99);     // 99 ← default

// ⚠️ Compare with || which ALSO triggers for 0, "", false
console.log("get('a') || 99:", mapLookup.get("a") || 99);     // 99 ← WRONG! 0 is falsy

// 🎯 Type narrowing — TypeScript narrows the type after null checks
function processTreeNode(node: TreeNode | null): string {
  if (node === null) {
    return "null";
  }
  // After the check, TypeScript KNOWS node is TreeNode (not null)
  return `TreeNode(${node.val})`;
}
console.log("processNode(tree):", processTreeNode(new TreeNode(42)));
console.log("processNode(null):", processTreeNode(null));

// ================================================================
// 🧰 SECTION 12: DESTRUCTURING & SPREAD
// ================================================================
// These features make code cleaner and more readable.
// You'll use them in almost every DSA solution.
// ================================================================

console.log("\n🧰 SECTION 12: Destructuring & Spread");
console.log("-".repeat(40));

// 📦 Array destructuring — pull values out by position
const [aa, bb, cc] = [10, 20, 30];
console.log("Destructured:", aa, bb, cc);

// Skip elements with empty slots
const [firstVal, , thirdVal] = [1, 2, 3];
console.log("Skip middle:", firstVal, thirdVal);

// Rest pattern — collect remaining elements
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log("Head:", head, "Tail:", tail);

// 🎯 SWAP TRICK — no temp variable needed!
// This is used ALL THE TIME in sorting algorithms
let x = 1, y = 2;
[x, y] = [y, x];
console.log("After swap: x =", x, "y =", y); // x=2, y=1

// Swap elements in an array — essential for partition, bubble sort, etc.
const swapArr = [10, 20, 30, 40, 50];
[swapArr[0], swapArr[4]] = [swapArr[4], swapArr[0]];
console.log("Array swap [0]↔[4]:", swapArr); // [50, 20, 30, 40, 10]

// 📋 Object destructuring
const person = { personName: "Prasanna", personAge: 25, city: "Chennai" };
const { personName, personAge } = person;
console.log("Object destructured:", personName, personAge);

// Rename during destructuring
const { personName: userName2, city: userCity } = person;
console.log("Renamed:", userName2, userCity);

// 🔄 Spread operator — copy and merge
const original = [1, 2, 3];
const copy = [...original];
console.log("Spread copy:", copy);

const merged2 = [...[1, 2], ...[3, 4], ...[5, 6]];
console.log("Spread merge:", merged2);

// ================================================================
// 📋 SECTION 13: COMMON DSA PATTERNS
// ================================================================
// These are patterns you'll see and use in nearly every problem.
// Bookmark this section — you'll come back to it often!
// ================================================================

console.log("\n📋 SECTION 13: Common DSA Patterns");
console.log("-".repeat(40));

// 🏗️ Array initialization patterns
const dpArray = new Array(10).fill(0);         // DP table
const visited = new Array(10).fill(false);      // Visited tracker
const distArray = new Array(10).fill(Infinity); // Distance array (Dijkstra)
console.log("DP array:", dpArray);
console.log("Visited:", visited);
console.log("Distance:", distArray);

// 2D grid — the RIGHT way (always use Array.from)
const rows = 3, cols = 4;
const grid2D = Array.from({ length: rows }, () => new Array(cols).fill(0));
console.log("2D grid:", JSON.stringify(grid2D));

// ♾️ Using Infinity as initial value
const testNums = [5, 2, 8, 1, 9, 3];
let minVal = Infinity;
let maxVal = -Infinity;
for (const num of testNums) {
  minVal = Math.min(minVal, num);
  maxVal = Math.max(maxVal, num);
}
console.log(`Min: ${minVal}, Max: ${maxVal}`);

// 🔄 Type conversions
console.log("\nType conversions:");
console.log("Number('123'):", Number("123"));         // 123
console.log("parseInt('123'):", parseInt("123"));      // 123
console.log("parseFloat('3.14'):", parseFloat("3.14")); // 3.14
console.log("String(123):", String(123));              // "123"
console.log("parseInt('123abc'):", parseInt("123abc")); // 123 (stops at non-digit)
console.log("Number('123abc'):", Number("123abc"));     // NaN (stricter)

// 🎯 Grid bounds checking — you'll write this in EVERY grid/matrix problem
const gridRows = 5, gridCols = 5;
const inBounds = (r: number, c: number): boolean =>
  r >= 0 && r < gridRows && c >= 0 && c < gridCols;

console.log("\nBounds check:");
console.log("(0,0) in bounds?", inBounds(0, 0));     // true
console.log("(4,4) in bounds?", inBounds(4, 4));     // true
console.log("(-1,0) in bounds?", inBounds(-1, 0));   // false
console.log("(5,0) in bounds?", inBounds(5, 0));     // false

// 🎯 4-directional movement — for BFS/DFS on grids
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // right, left, down, up
const r = 2, c = 2;
console.log("Neighbors of (2,2):");
for (const [dr, dc] of directions) {
  const nr = r + dr, nc = c + dc;
  if (inBounds(nr, nc)) {
    console.log(`  (${nr}, ${nc})`);
  }
}

// 🐛 Debugging — formatted output for complex data
console.log("\nDebugging output:");
const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log("Matrix:", JSON.stringify(matrix));

// Pretty-print a matrix
console.log("Pretty matrix:");
for (const row of matrix) {
  console.log("  [" + row.map(v => String(v).padStart(3)).join(",") + " ]");
}

// ================================================================
// 🎉 DONE!
// ================================================================
console.log("\n" + "=".repeat(60));
console.log("🎉 Congratulations! You now know TypeScript for DSA!");
console.log("=".repeat(60));
console.log("Next step: Start solving DSA problems with confidence.");
console.log("Run this file anytime to refresh: bun run typescript-basics.ts");
