import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts", "./core/scripts/generate.ts"],
  format: ["esm"],
  dts: {
    entry: {
      index: "./index.ts",
      generate: "./core/scripts/generate.ts",
    },
    compilerOptions: {
      incremental: true,
      tsBuildInfoFile: "./build/.tsbuildinfo",
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "build",
  onSuccess: "./bin/zodocs.sh",
});
