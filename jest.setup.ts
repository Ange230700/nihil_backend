// jest.setup.ts

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("API ENV: USER_DATABASE_URL", process.env.USER_DATABASE_URL);
