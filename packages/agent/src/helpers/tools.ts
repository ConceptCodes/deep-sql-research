import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { llm } from "./llm";

const datasource = new DataSource({
  type: "postgres",
  connectTimeoutMS: 1000,
  url: process.env.DB_URL,
  logging: Boolean(process.env.LOG_SQL_QUERIES),
  useUTC: true,
  poolErrorHandler(err) {
    console.error("Database connection error:", err);
  },
});

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
  sampleRowsInTableInfo: 5,
});

const toolkit = new SqlToolkit(db, llm);
export const sqlTools = toolkit.getTools();
