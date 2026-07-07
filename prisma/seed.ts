// W11 / 결정2 — 소량 Lesson 시드. LessonProgress FK(lessonId) 대상이 존재해야
// 진척 저장이 가능하므로 최소 L001~L010(title 만) upsert. 멱등(재실행 안전).
// 본편 메타·나머지 편(L011~L133)은 FR-LESSON 계열 착수 시 확장.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessons = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  return { lessonId: `L${n}`, title: `레슨 ${n}` };
});

async function main() {
  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { lessonId: l.lessonId },
      create: l,
      update: { title: l.title },
    });
  }
  console.log(`[seed] Lesson ${lessons.length}편 upsert 완료 (L001~L010)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
