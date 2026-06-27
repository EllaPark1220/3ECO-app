# UX 퍼널 플로우차트 — 랜딩 → 핵심 CTA

> 작성일: 2026-06-13
> 분석 대상: `3ECO-prototypes/3ECO-claude-v1/goyo-prototype/src/app/page.tsx` (랜딩페이지)
> 범위: 유저 진입 → 핵심 CTA 로직(첫 강의 진입) 도달까지의 Funnel

## 코드에서 확인된 전환 경로

- **히어로(STAGE 1)**: `1권 1편 시작하기 → /lesson/L001`(즉시 전환), `커리큘럼 여정 보기 → #stage-3`(앵커 점프)
- **기능 소개(STAGE 2)**: `스탬프 맵 → /stamp-map`, `교안 → /teacher-kit`
- **커리큘럼 여정(STAGE 3)**: `안전한 여정 시작하기 → /lesson/L001`
- **전환 섹션(STAGE 4)**: `계정 만들기 → /signup`, `소식 받기(뉴스레터 구독)`, `강의 둘러보기 → /lesson/L001`
- **최종 CTA** = `/lesson/L001` (핵심 학습 로직 진입)

## 퍼널 플로우차트

```mermaid
flowchart TD
    Entry(["유저 진입 · 랜딩 URL"]):::entry

    subgraph HUB["① 랜딩 허브 — 모든 경로의 시작"]
        direction TB
        Hero["STAGE 1 · 히어로<br/>광고도 결제도 없이"]
        Feat["STAGE 2 · 기능 소개 Bento"]
        Journey["STAGE 3 · 5단계 커리큘럼 여정"]
    end

    subgraph CONV["② 전환 허브 — 가입·구독 (STAGE 4)"]
        direction TB
        ConvHead["전환 섹션<br/>지금, 천천히 첫 편을"]
        Signup["계정 만들기<br/>/signup"]
        News["소식 받기<br/>뉴스레터 구독"]
    end

    Core{{"③ 최종 CTA<br/>1권 1편 시작 → /lesson/L001<br/>핵심 학습 로직 진입"}}:::core

    Aux["보조 경로<br/>/dictionary · /stamp-map<br/>/teacher-kit · /login"]:::aux

    %% ===== 메인 스크롤 흐름 (실선) =====
    Entry --> Hero
    Hero --> Feat
    Feat --> Journey
    Journey --> ConvHead
    ConvHead --> Signup
    ConvHead --> News
    ConvHead --> Core

    %% ===== 점프 경로 (점선) =====
    Hero -. "1권 1편 시작하기 · 즉시 전환" .-> Core
    Hero -. "커리큘럼 여정 보기 · #stage-3" .-> Journey
    Journey -. "안전한 여정 시작하기" .-> Core
    Feat -. "스탬프 맵 / 교안 보기" .-> Aux
    Hero -. "상단 NAV · INDEX/MAP/로그인" .-> Aux
    Signup -. "가입 완료 후" .-> Core
    News -. "구독 후 재방문" .-> Core
    Aux -. "탐색 후 복귀" .-> Core

    classDef entry fill:#052830,stroke:#0D5F6D,color:#ffffff;
    classDef core fill:#1A8E9C,stroke:#0D5F6D,color:#ffffff,stroke-width:2px;
    classDef aux fill:#EBF5F5,stroke:#86D0D6,color:#0E2B30;
```

## 범례 / 퍼널 해석

- **실선(`-->`)**: 의도된 메인 스크롤 흐름 — 랜딩 허브 → 전환 허브 → 최종 CTA의 3단 스파인.
- **점선(`-.->`)**: 점프 경로 — 단계를 건너뛰는 앵커/직행/이탈·복귀.
- 이 사이트는 결제가 없는 구조라 "플랜/구독"의 전환 허브는 **계정 만들기(/signup)** + **뉴스레터 구독(소식 받기)** 으로 매핑했고, 최종 전환 목표는 **첫 강의 진입(/lesson/L001)** 이다.
- 주목할 점: 히어로에서 `1권 1편 시작하기`가 **퍼널 전체를 건너뛰고 최종 CTA로 직행**하는 강한 점프 경로라, 전환 허브(가입·구독)를 거치지 않고 핵심 로직에 도달하는 비중이 클 수 있다(가입 유도와 즉시 학습 진입이 경쟁 관계).
