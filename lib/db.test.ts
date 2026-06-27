import { describe, it, expect } from "vitest";
import { prisma } from "./db";

describe("prisma 싱글톤", () => {
  it("PrismaClient 인스턴스 + $queryRaw 노출 (쿼리 미실행)", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$queryRaw).toBe("function");
  });

  it("동일 모듈 재import 시 동일 인스턴스 (싱글톤)", async () => {
    const again = (await import("./db")).prisma;
    expect(again).toBe(prisma);
  });
});
