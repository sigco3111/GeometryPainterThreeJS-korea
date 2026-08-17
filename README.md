# 💎 지오메트리 페인터 — three.js WebGPU (한국어판)

> **검은 광택 구체 위에 브러시를 드래그하면, 결정·용암·오로라·산호가 살아 움직입니다.**
> 브라우저에서 바로 실행되는 WebGPU 3D 페인터를 한국어로 즐기세요.

<p align="center">
  <a href="https://sigco3111.github.io/GeometryPainterThreeJS-korea/"><img alt="라이브 데모" src="https://img.shields.io/badge/🌐_라이브_데모-지오메트리_페인터-7c3aed?style=for-the-badge"/></a>
  <a href="https://github.com/achrefelouafi/GeometryPainterThreeJS"><img alt="원본 출처" src="https://img.shields.io/badge/📦_원본_출처-achrefelouafi%2FGeometryPainterThreeJS-181717?style=for-the-badge&logo=github"/></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge"/></a>
</p>

---

## ✨ 라이브 데모

| 항목 | URL |
|------|-----|
| 🇰🇷 **한국어 메인 앱 (기본)** | <https://sigco3111.github.io/GeometryPainterThreeJS-korea/> |
| 🎬 데모 10종 | <https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/> |

> 💡 WebGPU 활성 **Chrome / Edge / Arc** 권장. WebGPU 미지원 환경에서는 자동으로 WebGL2로 폴백됩니다.

---

## 🌟 이 프로젝트는 무엇인가요?

**드래그 한 번으로 3D 표면에 결정, 용암, 오로라, 산호 같은 살아있는 지오메트리를 그릴 수 있는 브라우저 기반 인터랙티브 페인터**입니다.

- **어디서나 실행** — Node.js + WebGPU만 있으면 됩니다
- **4가지 페인팅 모드** — 크리스털 · 용암 균열 · 오로라 실크 · 바이오루미네선스 산호초
- **완전한 한국어 UI** — 우상단 토글로 즉시 한/영 전환
- **확장 가능한 모드 시스템** — 새 모드는 추상 인터페이스만 구현하면 추가됨

---

## 🎨 4가지 페인팅 모드

### 💎 크리스털 (Crystals)
> 굴절 빛나는 수정 클러스터가 자라납니다.

- 투과·무지개 분산 셰이더
- 6가지 팔레트: **자수정 / 얼음 / 에메랄드 / 시트린 / 로즈 / 프리즘**
- 투명 크리스털 혼합 실시간 슬라이더
- 탄성 성장 애니메이션 (`easeOutBack`)

### 🌋 용암 균열 (Molten fissures)
> 표면이 갈라지며 뜨거운 용암이 번집니다.

- TSL 흑체 셰이더 코어 + 진행 열파 (heat pulse)
- 백열 전파면 (propagation front) + 번개 가닥
- 용암 교차점 가산 블렌딩 → 더 뜨거운 분기점
- 부유 잉걸불 + 반짝이는 주황색 빛 확산
- 라이브 컨트롤: 균열 너비·속도 / 열 / 가지 밀도·길이 / 잉걸불 빈도 / 암석 입구·크기

### 🌌 오로라 실크 (Aurora silk)
> 빛의 휘장이 펄럭이며 펼쳐집니다.

- 두 겹 실크 레이어를 vertex 단계에서 사인파로 변위
- 주름 잠금 발광 (cloth glow along folds)
- 표류하는 광선 줄무늬 + 빛나는 헤밍 + 반짝이는 별 입자
- 4가지 팔레트: **보레알리스 / 트와일라이트 / 엠버 / 스펙트럼** (코사인 사이클링)
- 라이브 컨트롤: 휘장 높이 / 물결 / 흐름 속도 / 광선 줄무늬 / 밝기 / 별 입자 / 펼침 속도

### 🪸 바이오루미네선스 산호초 (Bioluminescent reef)
> 심해 산호 군체가 박동하며 살아납니다.

- 재귀 분기 staghorn 산호 + 발광 폴립
- 흔들리는 해면동물 촉수 + gorgonian 팬 격자
- 표류 플랑크톤 + 단일 파동으로 전체 군락 박동 (한 유기체의 신호처럼)
- 4가지 팔레트: **심연 / 트로픽 / 고스트 / 톡식**
- 라이브 컨트롤: 군락 크기·밀도 / 분기 / 해면동물 촉수 / 생물발광 / 맥동 속도 / 흐름 흔들림 / 플랑크톤

---

## 🎨 시각 / 라이팅

- **WebGPU 렌더러** + WebGL2 자동 폴백
- **ACES 필름 톤매핑** + MSAA 후처리 파이프라인
- **커스텀 스튜디오 환경** — 검은 방 + 천장 HDR 소프트박스 + 쿨/웜 사이드 스트립 + 바이올렛 백 워시
  - 광택 구체와 크리스털의 모든 하이라이트가 이 6개 환경 패널의 조합
- **소프트 섀도우 키 라이트** + 쿨 림 + 바이올렛 언더글로우
- **블룸** (크리스털 내부 발광) + 표류 먼지 입자 + 천천히 떠다니는 호흡 애니메이션

---

## 🕹️ 조작법

| 입력 | 동작 |
|------|------|
| **드래그** (페인팅 모드) | 구체 위에 모드별 효과 칠하기 |
| **D** 또는 하단 모드 버튼 | 페인팅 ↔ 궤도 회전 토글 |
| 드래그 / 스크롤 (궤도 모드) | 회전 / 줌 |
| 우측 GUI | 팔레트·밀도·크기·기울기·발광·조명·블룸·시드·성장 리플레이 |
| **우상단 🌐 버튼** | 한/영 토글 |
| **T 키** | 한/영 토글 단축키 |

---

## 🌍 한/영 토글

- **기본은 한국어** — 첫 방문 시 자동으로 한국어 모드
- **즉시 전환** — 우상단 🌐 버튼 클릭 또는 **T** 키
- **선택 기억** — `localStorage`에 저장되어 새로고침해도 유지
- **모든 라벨 번역** — 정적 HTML + lil-gui 런타임 컨트롤러 양쪽 모두 갱신

> 한/영 토글 인프라의 동작 방식은 [scripts/koreanize.py](scripts/koreanize.py)와 [src/ui.ts](src/ui.ts)의 `window.__gpApplyLang` 훅을 참고하세요.

---

## 🚀 로컬에서 실행

```bash
# 저장소 클론
git clone https://github.com/sigco3111/GeometryPainterThreeJS-korea.git
cd GeometryPainterThreeJS-korea

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

> 💡 WebGPU 활성 Chrome / Edge 권장. WebGPU 미지원 환경은 WebGL2로 자동 폴백됩니다.

### 빌드 명령

```bash
# tsc 검증 + Vite 빌드 + 한국어화 후처리
npm run build

# 빌드 산출물 로컬 미리보기 (http://localhost:4173)
npm run preview

# 영문만 빌드 (한국어화 스킵)
npm run build:en
```

---

## 📦 원본 출처 (Attribution)

이 프로젝트는 **achrefelouafi/GeometryPainterThreeJS**의 한국어화 + Vercel 배포 버전입니다.

- **원본 저장소**: <https://github.com/achrefelouafi/GeometryPainterThreeJS>
- **원작자**: [Achref El Ouafi](https://github.com/achrefelouafi)
- **원본 라이선스**: [MIT](LICENSE)
- **⭐ Stars (원본)**: 47+ (2026-08 기준)
- **🍴 Forks (원본)**: 9+ (2026-08 기준)

원본의 설계 철학 — **"extensible mode system: every painting mode consumes the same strokes and returns a living instance the app grows, animates, undoes and rebuilds uniformly"** — 을 그대로 유지하면서, 다음을 추가했습니다:

| 추가 항목 | 설명 |
|----------|------|
| 🇰🇷 한국어 UI (100%) | 모드 이름, GUI 컨트롤, 팔레트, HUD, 토스트 전부 번역 |
| 🌐 한/영 토글 | 우상단 버튼 + T 키, localStorage 영구화, lil-gui 런타임 라벨 동기화 |
| ☁️ Vercel 라이브 배포 | `vercel.json` 자동 인식, 매 푸시마다 강제 재배포 |
| 🛠️ 빌드 후처리 파이프라인 | `scripts/koreanize.py` — 빌드 산출물에 안전하게 한글 박기 |
| 📐 보호 로직 | chunk 파일명, CamelCase 식별자 보호로 JS 깨짐 방지 |

---

## 🛠️ 한국어화 인프라 (기술 노트)

빌드 시 한 번에 한국어를 박되, 런타임에 한/영 토글이 가능하도록 설계했습니다.

### 아키텍처

```
소스 (.ts)
    ↓ tsc + Vite build
빌드 산출물 (영문 .js, .html)
    ↓ scripts/koreanize.py
    ├─ STRINGS 매핑 (영↔한 95개)
    ├─ chunk src/href 보호 (마스킹 후 복원)
    ├─ CamelCase 식별자 보호 (OrbitControls 등)
    ├─ 빌드 산출물 패치
    ├─ dist/assets/i18n.json 생성 (양방향 매핑)
    └─ index.html에 토글 UI + 클라이언트 스크립트 주입
최종 dist/
    ↓ vercel deploy
라이브 URL
```

### 토글 시 흐름

```
사용자가 🌐 클릭
    ↓
localStorage('gp-lang') 업데이트
    ↓
applyAll(lang) 호출
    ├─ setHtmlLang(lang) — <html lang> + <title>
    ├─ applyLang(document.body, lang) — DOM tree walker로 텍스트 노드 일괄 치환
    ├─ updateToggleUi(lang) — 토글 버튼 라벨 갱신
    └─ window.__gpApplyLang(lang, i18n) — lil-gui 컨트롤러 _name 일괄 갱신
```

---

## 🎬 10단계 학습용 데모 (`/demos/`)

원본의 핵심 학습 자산을 그대로 보존했습니다. 각 데모는 단일 메커니즘만 격리해서 보여주며, 영상을 찍기 쉽게 무한 루프로 동작합니다.

| # | 페이지 | 설명 |
|---|--------|------|
| 01 | [picking](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/picking.html) | 레이캐스트 → hit, normal, tangent frame. BVH on/off 비용 비교 |
| 02 | [anchor-space](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/anchor-space.html) | 계속 회전하는 캔버스에서 world space vs anchor space |
| 03 | [resample](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/resample.html) | 거친 포인터 샘플 vs 균일 보간된 중심선 |
| 04 | [cull](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/cull.html) | 실제 크리스털 모드, 실제 슬라이더, 리빌드 0회. 컬링된 인스턴스는 유령으로 표시 |
| 05 | [growth](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/growth.html) | birth distance, growth window, linear vs easeOutBack |
| 06 | [ribbon](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/ribbon.html) | 균열 스트립 — 모든 정점이 중심선 위, 너비는 셰이더에서 |
| 07 | [blackbody](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/blackbody.html) | 열 램프를 항(term) 단위로 분해 |
| 08 | [fold-light](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/fold-light.html) | vertex / fragment wave phase 공유 |
| 09 | [colony-pulse](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/colony-pulse.html) | 월드 펄스 vs 오브젝트별 phase |
| 10 | [studio](https://sigco3111.github.io/GeometryPainterThreeJS-korea/demos/studio.html) | 6개 환경 패널과 각 패널이 만드는 하이라이트 |

> 💡 URL 끝에 `?still=4` 붙이면 4초 시뮬 후 1프레임 렌더하고 정지 → 헤드리스 브라우저로 스틸 캡처 가능 (무한 rAF 루프가 idle 안 됨).

---

## 📂 프로젝트 구조

```
GeometryPainterThreeJS-korea/
├── README.md                      ← 본 파일
├── LICENSE                        ← MIT (원본과 동일)
├── package.json                   ← build: tsc + vite + koreanize 체이닝
├── vercel.json                    ← name=geometry-painter-kr, framework=vite
├── tsconfig.json
├── vite.config.ts
├── index.html                     ← 토글 UI + i18n 클라이언트 스크립트 주입
├── scripts/
│   └── koreanize.py               ← 빌드 후처리 (영↔한 매핑 + 보호 로직)
├── src/
│   ├── main.ts                    ← 엔트리포인트
│   ├── app.ts                     ← App 클래스 (모드 라우팅, HUD, 페인터 통합)
│   ├── bvh.ts                     ← BVH 가속 레이캐스트
│   ├── surfacePainter.ts          ← 표면 페인팅 (브러시 + 스트로크)
│   ├── ui.ts                      ← lil-gui 빌더 + window.__gpApplyLang 훅
│   └── modes/                     ← 모드 시스템 (각 페인팅 모드)
│       ├── mode.ts                ← 추상 인터페이스
│       ├── crystals.ts            ← 💎 크리스털
│       ├── fissures.ts            ← 🌋 용암 균열
│       ├── aurora.ts              ← 🌌 오로라 실크
│       └── reef.ts                ← 🪸 산호초
└── demos/                         ← 10단계 학습용 단일 페이지 데모
```

---

## 🪤 한국어화 중 만났던 함정들 (기술 노트)

> 향후 three.js + Vite 프로젝트를 한국어화할 때 참고하세요.

1. **JS 깨짐 (U+FFFD)** — `write_file`로 한국어 매핑 값을 쓸 때 일부 한글이 깨져 들어가 빌드된 JS의 객체 키가 죽음 → 검은 빈 화면. 진단: `page.on('pageerror')`의 `line:N col:N` → grep.

2. **chunk 파일명 깨짐** — 정규식이 `<script|link[^>]*?` non-greedy로 src/href 매칭 시 prefix를 재매치해 태그 중복. 해결: 단순 `(?P<attr>src|href)="(?P<path>[^"]+)"`로 한 번만 매칭 + 보호 영역을 U+E000 private-use char로 마스킹 후 복원.

3. **CamelCase 식별자 깨짐** — `"Controls":"조작법"` 같은 단어 매핑이 `OrbitControls` 식별자를 `Orbit조작법`으로 깨뜨려 chunk 404. 해결: 4글자 이상 영문 키는 `(?<=[a-z])(key)(?=[A-Z])` 같은 CamelCase 경계 패턴으로 단독 단어 위치만 마스킹.

4. **lil-gui 라벨 동기화** — 런타임 토글 시 lil-gui 컨트롤러의 `_name`을 갱신하고 `$name.set()`으로 DOM 반영해야 함. `ui.ts`에 `window.__gpApplyLang` 훅 추가.

---

## 📜 라이선스

이 프로젝트는 원본과 동일한 [MIT 라이선스](LICENSE)를 따릅니다. 원본 저작권 고지를 보존합니다.

```
MIT License

Copyright (c) 2026 Achref El Ouafi (original author)
Copyright (c) 2026 sigco3111 (Korean localization, deployment)
```

---

## 🙏 감사의 말

- **Achref El Ouafi** — 놀라운 three.js WebGPU 페인터를 만들어주신 원작자
- **Three.js 팀** — WebGPU와 TSL (Three.js Shading Language)로 이런 종류의 인터랙티브 작업을 가능하게 해주신 분들
- **Vercel** — 무료 호스팅과 글로벌 CDN

---

<p align="center">
  <sub>🌐 <a href="https://sigco3111.github.io/GeometryPainterThreeJS-korea/">라이브 데모 보기</a> · 📦 <a href="https://github.com/achrefelouafi/GeometryPainterThreeJS">원본 저장소</a> · 🍴 <a href="https://github.com/sigco3111/GeometryPainterThreeJS-korea">이 포크</a></sub>
</p>
