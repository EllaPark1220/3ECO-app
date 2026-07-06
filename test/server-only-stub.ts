// vitest 전용 — Next 의 "server-only" 모듈을 단위 테스트에서 no-op 으로 대체.
// server-only 는 Next 런타임에서만 해석되므로, 서버 모듈을 vitest 로 테스트하려면 스텁이 필요하다.
export {};
