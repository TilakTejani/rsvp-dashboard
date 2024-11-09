import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/rsvp-dashboard/", // Adjust this to match your repository name
  build: {
    outDir: "dist",
  },
});
