# @minho-friends/friend-design-system

**HTML → 컴포넌트 파이프라인 자동화** 실험 — 일관된 디자인 시스템을 생성하기에 충분한 스펙 포맷이 무엇인지 탐구합니다.

---

## 시작점

세 개의 손으로 만든 HTML 파일: `lazy-simple-dashboard.sample1~3.html`. 프레임워크도, 컴포넌트도 없는 순수 HTML과 인라인 스타일로 동작하는 최소한의 어드민 대시보드 페이지들.

가설은 이랬습니다:
1. LLM이 HTML 파일을 읽고 디자인 의도를 `DESIGN.md`로 추출
2. `DESIGN.md`를 이용해 재사용 가능한 컴포넌트 생성
3. 기존 HTML을 생성된 컴포넌트로 자동 대체

**1단계 성공.** LLM이 HTML 샘플로부터 색상, 타이포그래피, 간격 규칙, 컴포넌트 형태, 인터랙션 패턴을 담은 `DESIGN.md`를 만들어냈습니다.

**2단계 부분 성공.** 컴포넌트는 생성됐지만 미묘하게 달랐습니다. 문제는 `DESIGN.md` 산문만으로는 컴포넌트 생성의 정확한 계약서가 되기 어렵다는 것. "3px border-radius 상태 뱃지"는 괜찮은 산문이지만 props, variants, 컴포저빌리티, 컴포넌트 계층 내 관계를 명시하지 않습니다. 그릇이 맞지 않았습니다.

**해결책**: shadcn 아키텍처를 기반으로 LLM에게 제대로 된 컴포넌트 설계를 가르쳤습니다 — registry 타입, variant 시스템, primitive vs. block vs. component 구분. 그 결과물이 `SPEC_primitives.md`. ~~이 레이어가 추가되자 컴포넌트 생성이 일관되어지고 기존 HTML을 대체할 수 있었습니다.~~

## 스펙 파이프라인

```
DESIGN.md
  ↓ 디자인 의도 (색상, 타이포그래피, 컴포넌트 동작, 인터랙션 규칙)
SPEC_primitives.md
  ↓ 공식 컴포넌트 카탈로그 (props, variants, 컴포저빌리티, registry 타입)
       ↓
    LLM이 생성
       ↓
  ┌────────────────────────────────────────────┐
  │ components/lit/     Lit 3 웹 컴포넌트      │
  │ components/react/   React 래퍼             │
  │ derives/json-render/  JSON → UI 카탈로그   │
  │ derives/shadcn-registry/  shadcn 레지스트리│
  └────────────────────────────────────────────┘

REQUIREMENTS_TEMPLATE.md
  ↓ 페이지별 스펙 (구성, API 형태, 동작 패턴, 카피)
       ↓
    LLM이 생성
           ↓
        generated.html
               ↓
            (TODO: 컴포넌트·블록으로 학습 → shadcn-registry 등록)
```

## json-render가 닫는 루프

더 깊은 실험은 `derives/json-render/`에 있습니다. 디자인 시스템 컴포넌트들을 Zod로 검증된 JSON 스키마로 표현해, LLM이 안정적으로 출력할 수 있는 타입화된 카탈로그를 정의합니다.

이것이 가능해지면:
1. 사용자가 자연어로 설명 ("네 개의 서비스와 상태를 보여주는 대시보드")
2. LLM이 카탈로그를 이용해 타입 안전한 JSON 스펙 생성
3. json-render가 실제 디자인 시스템 컴포넌트로 렌더링

`apps/demo`의 채팅 페이지(`/chat`)가 이 흐름을 end-to-end로 보여줍니다. AI는 raw HTML이나 React를 생성하는 게 아니라, 컴포넌트 props와 동일한 Zod 스키마로 제약된 구조화된 객체를 생성합니다.

**전체 루프**: 산문 디자인 스펙 → LLM이 컴포넌트 생성 → LLM이 JSON 생성 → UI가 라이브 대시보드 렌더링.

## 검증 중인 것들

**지금까지 확인된 것:**
- LLM은 raw HTML에서 디자인 의도를 구조화된 스펙으로 역공학할 수 있다
- DESIGN.md 단독보다 2레이어 스펙(DESIGN.md + SPEC_primitives.md)이 일관된 컴포넌트를 만든다
- Zod 검증 JSON 카탈로그(`json-render`)가 자연어 → 렌더링된 대시보드 루프를 닫는다

**미결 질문 — 다음 단계:**

스펙 파이프라인에는 아직 품질 한계가 있습니다. 산문은 의도를 담을 수 있지만 시각적 정확성을 완전히 잡아내지 못합니다. 계획은 원본 HTML 샘플을 Figma(또는 대안)로 옮긴 뒤 피드백 루프를 만드는 것:

```
HTML 샘플 → Figma
               ↓
         시각적 ground truth
               ↓
         LLM: 컴포넌트를 시각에 맞게 업데이트
               ↓
         원본 HTML에 더 가까운 컴포넌트
```

마크다운 스펙만으로 달성할 수 있는 수준 이상으로 시각적 레퍼런스가 컴포넌트 품질을 끌어올릴 수 있는지, 그 루프를 자동화하거나 반자동화할 수 있는지를 실험합니다.

`propagate-lit-components` 스킬(`.claude/skills/`)은 이 실험의 부산물입니다: Lit 컴포넌트 props가 변경될 때마다 React 래퍼, json-render 카탈로그, shadcn 레지스트리를 자동으로 동기화합니다 — 수동 전파가 첫 번째 마찰 포인트로 발견되었기 때문입니다.

---

## 시작하기

```bash
# 전체 워크스페이스 의존성 설치
npm install

# 전체 빌드 (nx affected)
npm run build
```

### 개발 서버 실행

portless 프록시를 먼저 실행한 뒤 원하는 패키지를 시작합니다:

```bash
# 1. 프록시 (백그라운드에서 한 번만)
npm run dev:proxy

# 2. 원하는 개발 환경 선택
cd apps/demo && npm run dev                     # http://ui-renderer.localhost
cd tests/storybook-vite && npm run storybook    # http://storybook.localhost
cd tests/storybook-react && npm run storybook   # http://storybook-react.localhost
cd tests/shadcn-registry-test && npm run dev    # http://shadcn-registry-test.localhost
```

| 패키지 | 경로 | 커맨드 | Portless 사이트 |
|--------|------|--------|----------------|
| demo (v0 클론) | `apps/demo/` | `npm run dev` | `http://ui-renderer.localhost` |
| storybook-vite | `tests/storybook-vite/` | `npm run storybook` | `http://storybook.localhost` |
| storybook-react | `tests/storybook-react/` | `npm run storybook` | `http://storybook-react.localhost` |
| shadcn-registry-test | `tests/shadcn-registry-test/` | `npm run dev` | `http://shadcn-registry-test.localhost` |
| shadcn-registry-test (preview) | `tests/shadcn-registry-test/` | `npm run preview` | `http://shadcn-registry-test.localhost` |

### AI 채팅 설정

`/chat` 페이지는 환경 변수로 API 키가 필요합니다. 키 없이 테스트하려면 `/chat#demo`를 사용하세요 (미리 입력된 프롬프트로 자동 실행됩니다).

---

## 구조

```
monorepo/
├── DESIGN.md           # 시작점
├── SPEC_primitives.md  # 프리미티브 레퍼런스
├── .claude/skills/propagate-lit-components/SKILL.md  # (하위 패키지 동기화)
├── components/
│   ├── lit/          # 핵심 웹 컴포넌트 (프레임워크 독립)
│   └── react/        # React 래퍼
├── derives/
│   ├── json-render/  # JSON 스펙 → 컴포넌트 렌더러
│   └── shadcn-registry/ # shadcn/ui 레지스트리 export
├── apps/
│   └── demo/         # v0 클론 — Next.js 데모 앱 (json-render + AI 채팅)
└── tests/
    ├── e2e/               # E2E 테스트
    ├── storybook-vite/    # Lit 컴포넌트 Storybook
    ├── storybook-react/   # React 래퍼 Storybook
    └── shadcn-registry-test/ # 레지스트리 스모크 테스트
```

## 패키지

| 패키지 | 경로 | 설명 |
|--------|------|------|
| `@minho-friends/friend-design-system` | `/` | 루트 패키지 — 서브패스 export (`./lit`, `./react`, `./json-render`) |
| `@minho-friends/friend-design-system--lit` | `components/lit/` | Lit 3 웹 컴포넌트, Rollup 빌드 |
| `@minho-friends/friend-design-system--react` | `components/react/` | `@lit/react` 기반 React 19 래퍼 |
| `@minho-friends/friend-design-system--json-render` | `derives/json-render/` | Zod 검증 JSON 카탈로그 → React 렌더러 |
| `@minho-friends/friend-design-system--shadcn-registry` | `derives/shadcn-registry/` | shadcn/ui 호환 컴포넌트 레지스트리 |
| `@minho-friends/friend-design-system--demo` | `apps/demo/` | Next.js 15 데모 앱 |
| `@minho-friends/friend-design-system--e2e` | `tests/e2e/` | E2E 테스트 하네스 |
| `@minho-friends/friend-design-system--storybook-vite` | `tests/storybook-vite/` | Lit용 Storybook (Vite) |
| `@minho-friends/friend-design-system--storybook-react` | `tests/storybook-react/` | React용 Storybook (Vite) |
| `@minho-friends/friend-design-system--shadcn-registry-test` | `tests/shadcn-registry-test/` | 레지스트리 통합 테스트 |

## 컴포넌트 (Lit)

### 레이아웃
- `Stack` — flex 컨테이너 (수직/수평)
- `Grid` — 동일 너비 컬럼 CSS 그리드
- `Card` — 선택적 title/subtitle이 있는 테두리 카드
- `Separator` — 수평 구분선

### 텍스트 & 표시
- `Text` — size·muted variant가 있는 단락
- `Heading` — h1–h6 섹션 헤딩
- `Badge` — color variant가 있는 인라인 레이블 (default/success/warning/error/info)
- `InfoText` — 아이콘 + 레이블 정보 줄
- `Callout` — 강조된 콜아웃 블록

### 데이터 & 메트릭
- `Metric` — 단일 키/값 메트릭 표시
- `MetricsRow` — 메트릭 수평 행
- `KeyValueList` — 정의 스타일 키/값 쌍

### 상태 & 프로세스
- `StatusBadge` — 상태 필 (running/stopped/completed/disabled/unknown)
- `ProcessCard` — 상태·메트릭·액션이 있는 서비스/프로세스 카드
- `TunnelEntry` — 터널/포트 매핑 항목

### 네비게이션 & 컨트롤
- `ActionGroup` — 그룹화된 액션 버튼
- `SearchFilterBar` — 필터 컨트롤이 있는 검색 입력
- `AdminPageHeader` — 제목과 액션이 있는 페이지 헤더
- `TreeNode` — 접을 수 있는 트리 항목
- `CollapsibleFooter` — 토글 가능한 푸터 패널

## 개발 페이지

### 데모 앱 (`apps/demo`)

| 라우트 | 설명 |
|--------|------|
| `/` | json-render 데모 — 카탈로그 컴포넌트 전체를 사용하는 정적 `demoSpec` 렌더링 |
| `/chat` | AI 채팅 UI — 텍스트로 대시보드를 설명하면 컴포넌트가 라이브 렌더링 |
| `/chat#demo` | 데모 모드 — API 키 없이 샘플 프롬프트 자동 전송 |

### Storybook Vite (`tests/storybook-vite`) — Lit 컴포넌트

| 스토리 | 컴포넌트 |
|--------|---------|
| `ActionGroup` | `<action-group>` |
| `AdminPageHeader` | `<admin-page-header>` |
| `CollapsibleFooter` | `<collapsible-footer>` |
| `InfoText` | `<info-text>` |
| `KeyValueList` | `<key-value-list>` |
| `MetricsRow` | `<metrics-row>` |
| `ProcessCard` | `<process-card>` |
| `SearchFilterBar` | `<search-filter-bar>` |
| `StatusBadge` | `<status-badge>` |
| `TreeNode` | `<tree-node>` |
| `TunnelEntry` | `<tunnel-entry>` |

### Storybook React (`tests/storybook-react`) — React 래퍼

| 스토리 | 컴포넌트 |
|--------|---------|
| `MetricsRowReact` | `<MetricsRow>` |
| `ProcessCardReact` | `<ProcessCard>` |
| `SearchFilterBarReact` | `<SearchFilterBar>` |
| `StatusBadgeReact` | `<StatusBadge>` |

## Import

```ts
// 웹 컴포넌트 (모든 프레임워크)
import "@minho-friends/friend-design-system/lit";

// React 래퍼
import { ProcessCard, StatusBadge } from "@minho-friends/friend-design-system/react";

// JSON 기반 렌더러
import { catalog } from "@minho-friends/friend-design-system/json-render";
```

## 빌드

Nx가 모노레포 전체 빌드를 조율합니다. 각 패키지는 독립적으로 빌드됩니다:

- `components/lit` — Rollup (ESM, `lit` external)
- `components/react` — `tsc`
- `derives/json-render` — `tsc`
- `derives/shadcn-registry` — `shadcn build`

```bash
# 전체 affected 빌드
npm run build

# 특정 패키지 빌드
cd components/lit && npm run build
```

## 로드맵

- [ ] P0 html→figma→lit 컴포넌트 — 전체 디자인 역전파
- [ ] P0 생성된 샘플에서 새 컴포넌트·블록 학습 → shadcn-registry 등록
- [ ] P1 React 컴포넌트에 tailwind 주입?
- [ ] P2 A2UI 데모
- [ ] P1 릴리즈 프로세스:
  - [ ] P3 GitHub Packages 배포 (`npm registry`)
  - [ ] P3 버전 전략
  - [ ] P4 오래된 배포 버전 자동 삭제 스크립트
