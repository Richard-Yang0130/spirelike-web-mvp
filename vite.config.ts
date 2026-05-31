import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const githubPagesSpaRoutes = ["battle", "map", "shop", "rest", "event", "reward", "chest", "victory", "defeat"];

const githubPagesFallbackPlugin = () => ({
  name: "github-pages-spa-fallback",
  closeBundle() {
    if (process.env.GITHUB_PAGES !== "true") return;
    const indexPath = resolve("dist/index.html");
    const fallbackPath = resolve("dist/404.html");
    if (!existsSync(indexPath)) return;
    copyFileSync(indexPath, fallbackPath);
    for (const route of githubPagesSpaRoutes) {
      const routeDir = resolve("dist", route);
      mkdirSync(routeDir, { recursive: true });
      copyFileSync(indexPath, resolve(routeDir, "index.html"));
    }
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
