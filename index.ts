import { scanner } from "./src/scanner";

console.log("Compiler running ...");

try {
  scanner("program.txt");
} catch (e) {
  console.log("ERROR", (e as Error).message);
}
