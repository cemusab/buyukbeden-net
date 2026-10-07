import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3210);

/** Testler production build üzerinde çalışır (önce `npm run build`; `npm run qa` hepsini yapar). */
export default defineConfig({
  testDir: "tests",
  timeout: 120_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
