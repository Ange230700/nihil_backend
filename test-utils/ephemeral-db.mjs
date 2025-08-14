// test-utils\ephemeral-db.mjs
import { createConnection } from "mysql2/promise";
import { writeFile, readFile } from "fs/promises";
import { randomBytes } from "crypto";
import { execa } from "execa";

function withNewDbName(url, newDb) {
  const u = new URL(url);
  // pathname starts with '/', keep same host/user/pass/port
  u.pathname = `/${newDb}`;
  return u.toString();
}

function parseUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname || "127.0.0.1",
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username || "root"),
    password: decodeURIComponent(u.password || ""),
    db: u.pathname.replace(/^\//, ""),
  };
}

export async function createEphemeralDb({
  baseUrlEnvKey,
  prismaSchemaPath, // e.g. require.resolve('nihildbuser/prisma/schema.prisma')
  runtimeUrlEnvKey, // USER_DATABASE_URL or POST_DATABASE_URL
  metaFile, // path to write meta JSON for teardown
}) {
  const baseUrl =
    process.env[baseUrlEnvKey] || "mysql://root:changeme@127.0.0.1:3307/app_db"; // sensible default for local

  const { host, port, user, password, db } = parseUrl(baseUrl);
  const suffix = randomBytes(4).toString("hex");
  const newDb = `${db}_test_${suffix}`;
  const conn = await createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${newDb}\`;`);
  await conn.end();

  const runtimeUrl = withNewDbName(baseUrl, newDb);

  // Run migrations for this schema into the new DB
  await execa(
    "npx",
    ["prisma", "migrate", "deploy", "--schema", prismaSchemaPath],
    { stdio: "inherit", env: { ...process.env, DATABASE_URL: runtimeUrl } },
  );

  // Expose to tests
  process.env[runtimeUrlEnvKey] = runtimeUrl;

  await writeFile(
    metaFile,
    JSON.stringify(
      { host, port, user, password, db: newDb, runtimeUrl },
      null,
      2,
    ),
  );
}

export async function dropEphemeralDb(metaFile) {
  const raw = await readFile(metaFile, "utf8");
  const { host, port, user, password, db } = JSON.parse(raw);
  const conn = await createConnection({ host, port, user, password });
  await conn.query(`DROP DATABASE IF EXISTS \`${db}\`;`);
  await conn.end();
}
