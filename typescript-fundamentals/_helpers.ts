import color from "picocolors";

const log = console.log;

export function title(emoji: string, text: string) {
  log();
  log(color.bgCyan(color.black(` ${emoji} ${text} `)));
  log();
}

export function sub(text: string) {
  log(`\n  ${color.underline(color.bold(text))}\n`);
}

export function explain(text: string) {
  log(color.dim(`  ${text}`));
}

export function code(codeStr: string, result: unknown) {
  const r = typeof result === "string" ? `"${result}"` : JSON.stringify(result) ?? String(result);
  log(`  ${color.cyan(codeStr.padEnd(45))} ${color.dim("→")}  ${color.green(String(r))}`);
}

export function codeRaw(codeStr: string, result: string) {
  log(`  ${color.cyan(codeStr.padEnd(45))} ${color.dim("→")}  ${color.green(result)}`);
}

export function warn(text: string) {
  log(color.yellow(`  ⚠️  ${text}`));
}

export function tip(text: string) {
  log(color.magenta(`  💡 ${text}`));
}

export { log, color };
