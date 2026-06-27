# 배포 런북 — goyo-economy → 3ECO-app 재연결 (Phase 8)

> 이 단계는 **Vercel 로그인(대화형)과 시크릿(env)** 이 필요하고 라이브 프로젝트를 재연결하는
> 외부 영향 작업이라 사람이 직접 실행한다. 아래는 정확한 순서.

## 전제
- 현재 작업 브랜치: `migrate/playboard-from-prototype` (3ECO-app, GitHub `EllaPark1220/3ECO-app`).
- 기존 Vercel 프로젝트: `goyo-economy` (`prj_s8xJsZcwMQwRpkSv3p1CzrhBa35x`, team `team_WnsUl3UsfUr1ZmuYGl4mKSLt`) — 지금은 `goyo-prototype` 레포에 연결됨.

## 1) 마이그레이션 브랜치 → PR 머지
`main` 직접 push 금지(CLAUDE.md). PR 로 머지한다.
```
git push -u origin migrate/playboard-from-prototype
gh pr create --fill --base <기본브랜치> --head migrate/playboard-from-prototype
# 리뷰 후 머지
```

## 2) Vercel 로그인 (대화형 — 세션에서 `! vercel login`)
```
! vercel login
```

## 3) goyo-economy 를 3ECO-app 레포/디렉터리에 재연결
3ECO-app 디렉터리에서:
```
cd 3ECO-app
vercel link --project goyo-economy        # 기존 프로젝트에 연결
```
대안(새 프로젝트로 가려면): `vercel link` 후 새 프로젝트명 입력.

## 4) 환경변수 프로비저닝 (.env.example 기준 — 시크릿은 사람이 입력)
production·preview 각각:
```
DATABASE_URL              # Supabase Postgres (pooled)
DIRECT_URL                # Supabase 직결(PgBouncer 우회)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
NEXT_PUBLIC_APP_URL
# (Upstash 사용 시) UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
```
PlayBoard 노출 플래그 — **preview 에만**:
```
vercel env add PROTOTYPE_ENABLED preview     # 값: true
# production 에는 추가하지 않는다 → production 에서 /playboard 404 유지
```

## 5) 배포 + 검증
```
vercel              # preview 배포
```
검증 체크리스트:
- preview URL: `/` `/lesson/L001` `/dictionary` `/stamp-map` `/login` `/teacher-kit` `/admin/dashboard` 렌더(200).
- preview URL: `/playboard` 및 10 표면 노출(200) — PROTOTYPE_ENABLED=true.
- production 승격 후: `/playboard` → **404**(플래그 없음), 제품 라우트는 정상.
- `/api/health/db` 200 (DB 연결 확인).

## 롤백
- Vercel 대시보드에서 직전 배포로 Instant Rollback.
- 재연결을 되돌리려면 `goyo-economy` 를 다시 `goyo-prototype` 레포에 연결.
