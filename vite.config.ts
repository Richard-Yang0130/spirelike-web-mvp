import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const githubPagesFallbackPlugin = () => ({
  name: "github-pages-spa-fallback",
  closeBundle() {
    if (process.env.GITHUB_PAGES !== "true") return;
    const indexPath = resolve("dist/index.html");
    const fallbackPath = resolve("dist/404.html");
    if (existsSync(indexPath)) copyFileSync(indexPath, fallbackPath);
  }
});

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/spirelike-web-mvp/" : "/",
  plugins: [react(), githubPagesFallbackPlugin()],
  test: {
    environment: "jsdom",
    globals: true
  }
});
