import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "libtak",
      fileName: (format) => `libtak.${format}.js`,
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      copyDtsFiles: true,
    }),
  ],
})
