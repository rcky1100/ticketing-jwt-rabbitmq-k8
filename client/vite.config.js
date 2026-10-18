import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // already allows 0.0.0.0
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "ticketing.test", // add your host here
      "localhost",
    ],
  },
});
