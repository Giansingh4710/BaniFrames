import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/BaniFrames/", // Set this to your repository name
  base: "", // Set this to your repository name
  build: {
    outDir: "dist",
  },
});
