import mysql, { type RowDataPacket } from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.IDX_DB_HOST,
  port: Number(process.env.IDX_DB_PORT || 3307),
  user: process.env.IDX_DB_USER,
  password: process.env.IDX_DB_PASSWORD,
  database: process.env.IDX_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false
});

export async function query<T extends RowDataPacket>(
  sql: string,
  params: (string | number)[] = []
): Promise<T[]> {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
}
