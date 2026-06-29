// 교사 자료(PDF kit) 메타 seam — 화면(app/teacher-kit)과 백엔드 사이의 계약 경계.
// PDF 본문은 binary 라 lib/contracts/teacher-kit 에 body 스키마가 없어 메타 타입은 여기서 정의.
//
// MOCK → 실연동 교체 레시피 (EPIC W13 / FW-PDF-001, CT-DB-007 TeacherFeedback, IF-CACHE-001):
//   listKits 를 실제 레슨×PDF 메타로 교체, getKit 다운로드는 2-tier 캐시 경유 PDF 스트림.
//   파일명은 contracts/teacher-kit 의 teacherKitContentDisposition() 사용.
import { LESSONS } from "./curriculum";

export interface TeacherKitMeta {
  lesson_id: string;
  title: string;
  download_url: string; // MOCK — W13 에서 실제 PDF 경로
  license: "CC BY-NC-SA 4.0";
  pages: number; // A4 2~3p 표준 (grill-it T8)
}

export async function listKits(limit = 6): Promise<TeacherKitMeta[]> {
  return LESSONS.slice(0, limit).map((l) => ({
    lesson_id: l.lessonId,
    title: l.title,
    download_url: `/api/teacher/kit/${l.lessonId}`,
    license: "CC BY-NC-SA 4.0",
    pages: 3,
  }));
}

export async function getKit(lessonId: string): Promise<TeacherKitMeta | null> {
  const all = await listKits(LESSONS.length);
  return all.find((k) => k.lesson_id === lessonId) ?? null;
}
