import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@store": path.resolve(__dirname, "./src/redux/store"),
      // "@loginbkg": path.resolve(
      //   __filename,
      //   "url(./src/assets/Images/Loginbkg.webp)"
      // ),
    },
  },
  define: {
    "process.env": {
      REACT_APP_UAT_URL: "https://api.homexbuilderscorp.com",
      // REACT_APP_UAT_URL: "http://localhost:4000",
      REACT_APP_ENCRYPTION: "WABBALABBA@3344$$1DUB43DUB",
      FONT_KEY: "AIzaSyC9NHFb4eI6H6AxlvLeHF_7Us7LTNg3deI",
    },
  },
  plugins: [react({})],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3004,
  },
  build: {
    minify: true,
    emptyOutDir: true,
    sourcemap: false, // Disable source maps
    rollupOptions: {
      external: "sweetalert2.all.min.js",
      output: {
        globals: {
          react: "React",
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor"; // Separate vendor chunks
            }
          },
        },
        vendor: ["react", "react-dom"], // Split out vendor libraries
        utils: ["./src/utils/index.js"], // Split out utility functions
      },
    },
  },
});
