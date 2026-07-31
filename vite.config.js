import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is set for the GitHub Pages project site (https://<user>.github.io/advisortool/).
// It falls back to "/" for local dev and other hosts (e.g. Vercel at the root).
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/advisortool/" : "/",
  plugins: [react()],
});
