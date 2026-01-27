import "dotenv/config";

// pilih salah satu import ini (lihat yang cocok dengan project kamu)
// import { defineConfig, env } from "prisma/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: env("DATABASE_URL"),
  },
});