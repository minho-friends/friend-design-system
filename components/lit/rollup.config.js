import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import minifyHTML from "rollup-plugin-minify-html-literals";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  external: [
    /^lit/,
    /^@lit/,
  ],
  plugins: [
    minifyHTML.default?.minifyHTMLLiterals
      ? minifyHTML.default
      : minifyHTML,
    resolve(),
    typescript({
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
    }),
  ],
};
