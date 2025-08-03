// jest.setup.ts

(async () => {
  const path = await import("path");
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.resolve(__dirname, ".env") });
})();
