import express, { Request, Response } from "express";
import mysql from "mysql2/promise";

const app = express();

const PORT = process.env.PORT || 8080;

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "testuser",
  password: process.env.DB_PASSWORD || "testpassword",
  database: process.env.DB_NAME || "test_app_db",
};

async function getConnection() {
  return mysql.createConnection(dbConfig);
}

async function initializeDatabase() {
  const connection = await getConnection();

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.execute(`
    INSERT INTO messages (text)
    SELECT 'Hello from MySQL database!'
    WHERE NOT EXISTS (SELECT 1 FROM messages)
  `);

  await connection.end();
}

app.get("/", (req: Request, res: Response) => {
  res.json({
    app: "test-app",
    version: "1.0.0",
    message: "Hello from test-app on OpenShift!",
    status: "running",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.get("/db-check", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute("SELECT NOW() AS currentTime");

    await connection.end();

    res.json({
      status: "connected",
      database: process.env.DB_NAME,
      result: rows,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Could not connect to database",
    });
  }
});

app.get("/messages", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute("SELECT * FROM messages");

    await connection.end();

    res.json({
      status: "success",
      messages: rows,
    });
  } catch (error) {
    console.error("Could not read messages:", error);

    res.status(500).json({
      status: "error",
      message: "Could not read messages from database",
    });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`test-app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });