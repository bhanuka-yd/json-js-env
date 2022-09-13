// build.config.ts
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./index"],
  declaration: false, // generate .d.ts files
});
