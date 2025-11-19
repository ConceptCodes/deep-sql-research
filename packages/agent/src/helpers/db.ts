import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database;

export class DBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DBError";
  }
}

export async function connectToDatabase(dbPath: string): Promise<Database> {
  const absolute = path.resolve(dbPath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Database file not found at: ${absolute}`);
  }

  db = await open({
    filename: absolute,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READONLY,
    
  });

  console.log(`Connected to ${absolute}`);
  return db;
}

export async function listTableSchemas(): Promise<string> {
  if (!db) throw new Error("Call connectToDatabase first");

  const tables = await db.all<Array<{ name: string }>>(
    `SELECT name
       FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%';`
  );

  if (tables.length === 0) return "📭  No user tables found.";

  let out = "";
  for (const { name } of tables) {
    out += `Table: ${name}\nColumns:\n`;

    const cols = await db.all(`PRAGMA table_info(${JSON.stringify(name)});`);
    const fks = await db.all(`PRAGMA foreign_key_list(${JSON.stringify(name)});`);

    // Create a map of columns that are foreign keys for easy lookup
    const fkMap = new Map<string, string>();
    for (const fk of fks) {
      fkMap.set(fk.from, `(FK -> ${fk.table}.${fk.to})`);
    }

    for (const c of cols) {
      const fkInfo = fkMap.get(c.name) || "";
      out += `  • ${c.name}: ${c.type}${c.pk ? " (PK)" : ""} ${fkInfo}\n`;
    }
    out += "\n";
  }
  return out.trim();
}

export async function executeQuery(sql: string, params: any[] = []) {
  if (!db) throw new Error("Call connectToDatabase first");
  try {
    return db.all(sql, params);
  } catch (error) {
    console.error("Error executing query:", error);
    throw new DBError(`Failed to execute query: ${error}`);
  }
}
