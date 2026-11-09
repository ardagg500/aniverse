import { PrismaClient } from "@prisma/client";

// Veritabanı URL'si henüz girilmediyse Prisma schema doğrulamasının
// build sırasında hata vermesini engellemek için güvenli varsayılan tanım
export const isDbAvailable = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("localhost:5432/aniverse_fallback")
);

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/aniverse_fallback?schema=public";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
