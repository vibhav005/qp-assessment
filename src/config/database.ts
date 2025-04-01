import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "myuser",
  password: process.env.DB_PASSWORD || "mypassword",
  database: process.env.DB_DATABASE || "mydb",
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true,
  entities: ["src/models/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
