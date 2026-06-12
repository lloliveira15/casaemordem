import { readFileSync } from "fs"
import { resolve } from "path"
import pkg from "pg"
const { Client } = pkg

async function main() {
  const supabaseUrl = "isiuoxgpoaiotmizdopo"
  const dbPassword = process.env.DB_PASSWORD

  if (!dbPassword) {
    console.error("Set DB_PASSWORD env var or edit this script")
    process.exit(1)
  }

  const client = new Client({
    host: `aws-0-sa-east-1.pooler.supabase.com`,
    port: 6543,
    database: "postgres",
    user: "postgres.isiuoxgpoaiotmizdopo",
    password: dbPassword,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()
  console.log("Connected to Supabase PostgreSQL")

  const sqlPath = resolve(import.meta.dirname, "../supabase/migrations/00001_schema.sql")
  const sql = readFileSync(sqlPath, "utf-8")

  console.log("Running migration...")
  await client.query(sql)
  console.log("Migration applied successfully!")

  await client.end()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
