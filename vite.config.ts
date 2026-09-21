import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    sourcemap: false
  },
  plugins: [react(), tailwindcss()],
  // ckeditor5 va wrapper BIRGA prebundle qilinadi — yadro bitta ulashilgan
  // chunk bo'ladi (alohida bo'lsa "ckeditor-duplicated-modules" xatosi chiqadi)
  optimizeDeps: {
    include: ["ckeditor5"],
    exclude: ["@ckeditor/ckeditor5-react", "@ckeditor/ckeditor5-integrations-common"],
    esbuildOptions: {
      target: "esnext"
    }
  }
});
