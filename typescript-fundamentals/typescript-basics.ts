// ================================================================
// 🚀 TypeScript Fundamentals — Interactive Tutorial Launcher
// Run:  bun run typescript-basics.ts
//
// Each section is also a standalone file you can read and run:
//   bun run 01-variables-and-types.ts
//   bun run 02-numbers-and-math.ts
//   ... etc.
// ================================================================

import * as p from "@clack/prompts";
import color from "picocolors";

import { run as s01 } from "./01-variables-and-types";
import { run as s02 } from "./02-numbers-and-math";
import { run as s03 } from "./03-arrays";
import { run as s04 } from "./04-strings";
import { run as s05 } from "./05-map-and-set";
import { run as s06 } from "./06-functions";
import { run as s07 } from "./07-control-flow";
import { run as s08 } from "./08-classes-and-oop";
import { run as s09 } from "./09-generics";
import { run as s10 } from "./10-interfaces-and-types";
import { run as s11 } from "./11-null-handling";
import { run as s12 } from "./12-destructuring-and-spread";
import { run as s13 } from "./13-common-dsa-patterns";

interface Section {
  value: string;
  label: string;
  hint: string;
  run: (name: string) => void;
}

const sections: Section[] = [
  { value: "1",  label: "📝  Variables & Types",       hint: "Primitives, const/let, type inference, template literals",   run: s01 },
  { value: "2",  label: "🔢  Numbers & Math",          hint: "Math methods, integer division, modulo, bitwise ops",        run: () => s02() },
  { value: "3",  label: "📦  Arrays",                  hint: "Creating, iterating, sorting, functional methods",           run: () => s03() },
  { value: "4",  label: "🔤  Strings",                 hint: "Methods, conversions, char codes, comparisons",              run: () => s04() },
  { value: "5",  label: "🗺️   Map & Set",               hint: "Frequency counter, O(1) lookups, deduplication",             run: () => s05() },
  { value: "6",  label: "🔧  Functions",               hint: "Arrow functions, optional/default params, callbacks",        run: s06 },
  { value: "7",  label: "🔀  Control Flow",            hint: "Loops, break/continue, labeled loops, ternary",              run: () => s07() },
  { value: "8",  label: "🏗️   Classes & OOP",           hint: "ListNode, Stack, TreeNode — data structure building blocks", run: () => s08() },
  { value: "9",  label: "🧬  Generics",                hint: "Reusable functions & data structures with type safety",      run: () => s09() },
  { value: "10", label: "🔗  Interfaces & Types",      hint: "Shapes, type aliases, union types, index signatures",        run: () => s10() },
  { value: "11", label: "❓  Null Handling",            hint: "Optional chaining, nullish coalescing, type narrowing",      run: () => s11() },
  { value: "12", label: "🧰  Destructuring & Spread",  hint: "Array/object destructuring, swap trick, spread operator",    run: s12 },
  { value: "13", label: "📋  Common DSA Patterns",     hint: "Array init, grid bounds, 4-dir movement, debugging",         run: () => s13() },
];

async function main() {
  console.clear();

  p.intro(color.bgCyan(color.black(" 🚀 TypeScript Fundamentals — Interactive Tutorial ")));

  const userName = await p.text({
    message: "What's your name?",
    placeholder: "Enter your name",
    validate: (val) => {
      if (!val || val.trim().length === 0) return "Please enter your name!";
    },
  });

  if (p.isCancel(userName)) {
    p.outro("Bye!");
    process.exit(0);
  }

  const name = (userName as string).trim();

  console.log();
  p.note(
    `Welcome, ${color.bold(name)}! 🎉\n\nPick a section to run, or run them all.\nEach section explains the concept, shows the code, and runs it.`,
    "How it works"
  );

  let keepGoing = true;

  while (keepGoing) {
    const choice = await p.select({
      message: `What would you like to learn, ${name}?`,
      options: [
        ...sections.map(s => ({ value: s.value, label: s.label, hint: s.hint })),
        { value: "all",  label: "🚀  Run All Sections",   hint: "Run everything from top to bottom" },
        { value: "exit", label: "👋  Exit",                hint: "Quit the tutorial" },
      ],
    });

    if (p.isCancel(choice) || choice === "exit") {
      p.outro(color.green(`Happy coding, ${name}! 🎉 Run again anytime: bun run typescript-basics.ts`));
      keepGoing = false;
      break;
    }

    if (choice === "all") {
      for (const section of sections) {
        section.run(name);
      }
      console.log();
      console.log(color.bgGreen(color.black(` 🎉 All 13 sections complete! Great job, ${name}! `)));
    } else {
      const section = sections.find(s => s.value === choice);
      if (section) section.run(name);
    }

    console.log();

    const continueChoice = await p.confirm({
      message: "Run another section?",
    });

    if (p.isCancel(continueChoice) || !continueChoice) {
      p.outro(color.green(`Happy coding, ${name}! 🎉 Run again anytime: bun run typescript-basics.ts`));
      keepGoing = false;
    }
  }
}

main();
