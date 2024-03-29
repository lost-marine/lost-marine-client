import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const phasermsg = () => {
  return {
    name: "phasermsg",
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    }
  };
};

export default defineConfig({
  host: "0.0.0.0",
  base: "./",
  plugins: [vue(), phasermsg()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@game", replacement: "/src/game" },
      { find: "@components", replacement: "/src/gane/components" },
      { find: "@public", replacement: "/public" }
    ]
  },
  logLevel: "warning",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"]
        }
      }
    },
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  }
});
