// FW-AUTH-005 / FR-AUTH-005 — 사용자 환경설정 계약(단일 출처).
// 3필드: accessibilityMode·mediaPreference·fontSize. colorMode 는 모델 제외분
// (다크모드 연기, schema.prisma L21 / STARTER 지침) → 환경설정에도 넣지 않음.
// enum 은 Prisma 런타임 enum 을 z.enum 으로 재사용 → 값 정의 단일 출처(task §Technical).
import { z } from "zod";
import { MediaPreference, FontSize } from "@prisma/client";

// PATCH 입력 — 3필드 전부 optional, 최소 1개 필요(부분 갱신).
// strict: 정의 외 키(위조 user_id 등) 거부 → IDOR 구조 차단(userId 는 세션에서만).
export const UpdateUserPreferencesRequestSchema = z
  .object({
    accessibility_mode: z.boolean().optional(),
    media_preference: z.enum(MediaPreference).optional(),
    font_size: z.enum(FontSize).optional(),
  })
  .strict()
  .refine((d) => Object.keys(d).length > 0, {
    message: "변경할 필드가 없습니다",
  });

export type UpdateUserPreferencesRequest = z.infer<
  typeof UpdateUserPreferencesRequestSchema
>;

// PATCH 성공 응답 — 실제 갱신된 필드명(snake_case)만. 디버깅·테스트 용이(task §응답).
export type UpdatedPreferenceField =
  | "accessibility_mode"
  | "media_preference"
  | "font_size";

export interface UpdatePreferencesResponse {
  ok: true;
  updated_fields: UpdatedPreferenceField[];
}

// GET 응답 DTO(FR-AUTH-005) — 3필드 화이트리스트. email·role·createdAt 등 미포함.
export interface UserPreferencesResponse {
  accessibility_mode: boolean;
  media_preference: MediaPreference; // 'VIDEO' | 'TEXT' | 'MIXED'
  font_size: FontSize; // 'XS' | 'S' | 'L' | 'XL'
}
