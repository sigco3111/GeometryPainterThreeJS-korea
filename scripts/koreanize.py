#!/usr/bin/env python3
"""
Geometry Painter Three.js — 빌드 후처리 한/영 토글 한국어화 스크립트.

빌드된 dist/ 폴더의 JS + HTML 안 영문 사용자 노출 문자열을 모두 한국어로
치환하되, **사용자가 한/영 토글로 즉시 복원할 수 있도록** 매핑 사전을
JSON으로 함께 dist/에 복사한다.

- index.html: title, lang, UI 정적 텍스트, 토글 UI 추가, lang 동적 적용
- dist/assets/main-*.js: 모드 이름, GUI 라벨, HUD, 토스트, 팔레트 이름
- dist/assets/i18n.json: 한↔영 매핑 사전을 클라이언트가 사용 (런타임 토글)
- dist/demos/*.html: 데모 페이지 동일 처리

영문 변수명·내부 식별자·TSL 셰이더 키워드는 절대 건드리지 않는다.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

# ---------------------------------------------------------------------------
# 사용자 노출 문자열 매핑 — 100% 커버리지
# ---------------------------------------------------------------------------
# (왼쪽: 원문, 오른쪽: 번역) — 좌변은 JS/HTML 안에 그대로 남아있는 리터럴.
STRINGS = {
    # === GUI / 모드 이름 (ui.ts에서 노출되는 문자열) ===
    "Geometry Painter": "지오메트리 페인터",
    "Paint mode": "그리기 모드",
    "Paint mode (D)": "페인팅 모드 (D)",
    "Painting mode (D)": "페인팅 모드 (D)",
    "Painting mode": "페인팅 모드",
    "Drawing": "드로잉",
    "Crystals (live)": "크리스털 (실시간)",
    "Molten fissures (live)": "용암 균열 (실시간)",
    "Aurora silk (live)": "오로라 실크 (실시간)",
    "Bioluminescent reef (live)": "바이오루미네선스 산호초 (실시간)",
    "Light & look (live)": "조명 & 룩 (실시간)",
    "Growth animation": "성장 애니메이션",
    "Replay growth": "성장 다시 재생",

    # === Drawing 폴더 ===
    "Undo last stroke": "마지막 획 실행 취소",
    "Clear all": "모두 지우기",

    # === 크리스털 컨트롤 ===
    "Clusters / unit": "군집 / 단위",
    "Crystal size": "크리스털 크기",
    "Shards / cluster": "파편 / 군집",
    "Cluster spread": "군집 확산",
    "Size variety": "크기 변주",
    "Clear crystal mix": "투명 크리스털 혼합",
    "Inner glow": "내부 발광",
    "Growth speed": "성장 속도",

    # === 용암 균열 컨트롤 ===
    "Crack width": "균열 너비",
    "Crack speed": "균열 속도",
    "Heat": "열",
    "Pulse speed": "맥동 속도",
    "Branches / unit": "가지 / 단위",
    "Branch length": "가지 길이",
    "Ember rate": "잉걸불 빈도",
    "Rock lips / unit": "암석 입구 / 단위",
    "Rock size": "암석 크기",
    "Light spill": "빛 확산",

    # === 오로라 실크 컨트롤 ===
    "Curtain height": "휘장 높이",
    "Billow": "물결",
    "Flow speed": "흐름 속도",
    "Ray streaks": "광선 줄무늬",
    "Brightness": "밝기",
    "Star motes": "별 입자",
    "Unfurl speed": "펼침 속도",

    # === 산호 컨트롤 ===
    "Colony size": "군락 크기",
    "Colonies / unit": "군락 / 단위",
    "Branching": "분기",
    "Anemone arms": "해변동물 촉수",
    "Bioluminescence": "생물발광",
    "Current sway": "흐름 흔들림",
    "Plankton": "플랑크톤",

    # === Light & look 컨트롤 ===
    "Exposure": "노출",
    "Studio light": "스튜디오 조명",
    "Backlight": "백라이트",
    "Bloom": "블룸",
    "Bloom strength": "블룸 강도",
    "Bloom threshold": "블룸 임계값",
    "Bloom speed": "블룸 속도",
    "Seed": "시드",
    "Instant": "즉시",
    "Replay": "다시 재생",

    # === 팔레트 이름 ===
    "Amethyst": "자수정",
    "Ice": "얼음",
    "Emerald": "에메랄드",
    "Citrine": "시트린",
    "Rose": "로즈",
    "Prism": "프리즘",
    "Borealis": "보레알리스",
    "Twilight": "트와일라이트",
    "Ember": "엠버",
    "Spectrum": "스펙트럼",
    "Abyss": "심연",
    "Tropic": "트로픽",
    "Ghost": "고스트",
    "Toxic": "톡식",

    # === 모드 이름 (앱 키) ===
    "Crystals": "크리스털",
    "Molten fissures": "용암 균열",
    "Aurora silk": "오로라 실크",
    "Bioluminescent reef": "바이오루미네선스 산호초",

    # === HUD 안내문 일부 ===
    "Move over the sphere, then ": "구체 위로 마우스를 올린 뒤 ",
    " to paint a ": "로 그려서 ",
    "Press ": "를 누르세요 ",
    " to orbit.": "로 회전 모드로 전환.",
    "Orbit mode": "회전 모드",
    "Press D to paint.": "D 키를 눌러 그리기를 시작하세요.",
    " — drag to rotate, scroll to zoom, right-drag to pan. ":
        " — 드래그로 회전, 스크롤로 줌, 우드래그로 이동. ",

    # === 토스트 ===
    "crystals seeded 💎": "크리스털 시드 완료 💎",
    "fissures carved 🌋": "용암 균열 생성 🌋",
    "aurora unfurled 🌌": "오로라 펼침 완료 🌌",
    "reef spawned 🪸": "산호초 생성 🪸",

    # === 기타 노출 ===
    "WebGL2 (fallback)": "WebGL2 (폴백)",
    "Renderer: ": "렌더러: ",
    "Mode: ": "모드: ",

    # === 데모 페이지 카테고리 ===
    "PAINTING": "페인팅",
    "ARCHITECTURE": "아키텍처",
    "SHADERS": "셰이더",
    "LOOK": "룩",

    # === 데모 index.html 카드 (10개) ===
    "Surface picking &amp; the tangent frame":
        "표면 선택 &amp; 탄젠트 프레임",
    "Surface picking & the tangent frame":
        "표면 선택 & 탄젠트 프레임",
    "One raycast becomes a point, a normal and the little basis every mode builds in. BVH on and off.":
        "하나의 레이캐스트가 점, 법선, 모든 모드가 사용하는 작은 기저 벡터가 됩니다. BVH 켜기/끄기.",
    "Painting on a canvas that moves":
        "움직이는 캔버스에 페인팅",
    "World space versus anchor space, on two spheres that won't stop turning.":
        "두 개의 회전하는 구체에서 월드 스페이스 vs 앵커 스페이스.",
    "From pointer events to a centreline":
        "포인터 이벤트에서 중심선으로",
    "Why raw pointer samples can't space anything, and what the modes get instead.":
        "왜 거친 포인터 샘플로는 간격이 일정해지지 않는지, 그리고 모드가 대신 받는 것은 무엇인지.",
    "Generate at the maximum, cull with the slider":
        "최대치로 생성하고 슬라이더로 컬링",
    "The real crystal mode, with a rebuild counter that never moves.":
        "실제 크리스털 모드, 리빌드 카운터는 한 번도 움직이지 않습니다.",
    "The growth front":
        "성장 전선",
    "Birth distance, growth window and the 5% overshoot that sells the pop.":
        "탄생 거리, 성장 윈도우, 그리고 그 팝(pop)을 완성시키는 5% 오버슈트.",
    "A ribbon with no width":
        "너비가 없는 리본",
    "Every crack vertex sits on the centreline. The width is a uniform.":
        "모든 균열 정점이 중심선 위에 있습니다. 너비는 uniform입니다.",
    "Building the heat ramp":
        "열 램프 만들기",
    "Four terms multiplied into one float, then pushed through a blackbody ramp.":
        "네 항을 곱해 하나의 float로 만든 다음 흑체 램프를 통과시킵니다.",
    "Fold-locked brightness":
        "주름 잠금 발광",
    "Share the wave phase with the fragment stage and a plane becomes fabric.":
        "fragment 스테이지와 파동 phase를 공유하면 평면이 천이 됩니다.",
    "One heartbeat, many colonies":
        "하나의 심장 박동, 여러 군락",
    "A wave that lives in world space, so separate strokes still breathe together.":
        "월드 스페이스에 사는 파동 — 시간 차로 그려진 획도 함께 호흡합니다.",

    # === 각 데모 페이지 본문 ===
    "Same stroke, same hand, two coordinate spaces. The sphere keeps turning after you let go — and only one of these two survives it.":
        "같은 획, 같은 손, 두 좌표 공간. 손을 떼도 구체는 계속 회전합니다 — 둘 중 하나만 살아남습니다.",
    "The environment is the lighting":
        "환경이 곧 조명이다",
    "The molten core is one float pushed through four mix() calls. Switch the terms off one at a time and see what each is worth.":
        "용암 코어는 4개의 mix() 호출을 통과한 하나의 float입니다. 항을 하나씩 끄면서 각 항의 가치를 확인하세요.",
    "A wave that lives in world space instead of in each object, so separate strokes painted minutes apart still pulse as one organism.":
        "각 오브젝트가 아닌 월드 스페이스에 사는 파동 — 몇 분 간격으로 그려진 획도 하나의 유기체처럼 박동합니다.",
    "The real crystal mode, driven by real sliders. Watch the rebuild counter refuse to move while you drag.":
        "실제 슬라이더로 구동되는 실제 크리스털 모드. 드래그하는 동안 리빌드 카운터가 움직이기를 거부하는 걸 지켜보세요.",
    "Two curtains, one wave. The right one shares the wave phase with its fragment shader, which is the entire difference between a wobbling plane and cloth.":
        "두 휘장, 하나의 파동. 오른쪽 휘장은 파동 phase를 fragment 셰이더와 공유합니다 — 흔들리는 평면과 천의 전부 차이입니다.",
    "Every instance knows the distance at which it was seeded. Growth is just the gap between that and how far the front has travelled.":
        "모든 인스턴스는 자신이 시드된 거리를 압니다. 성장은 그 거리와 전선이 이동한 거리 사이의 갭입니다.",
    "One pointer event, one raycast, and the little orthonormal basis every painting mode plants its geometry in. Toggle the BVH off to watch the cost of a pick jump.":
        "하나의 포인터 이벤트, 하나의 레이캐스트, 모든 페인팅 모드가 지오메트리를 심는 작은 정규 직교 기저. BVH를 끄면 픽 비용이 폭증하는 걸 볼 수 있습니다.",
    "Raw samples bunch where the hand slowed down. Modes need even spacing and a tangent frame, so every stroke gets resampled first.":
        "손이 느려진 곳에서 거친 샘플이 뭉칩니다. 모드는 균일 간격과 탄젠트 프레임이 필요하므로, 모든 획은 먼저 리셈플링됩니다.",
    "The fissure crack is a strip of vertices sitting on top of each other. Width, branch length and branch count all live in the vertex shader.":
        "균열은 서로 포개진 정점들의 스트립입니다. 너비, 가지 길이, 가지 개수 모두 vertex 셰이더 안에 살고 있습니다.",
    "Six emissive quads, prefiltered into an environment map, and no lights at all. Switch a quad off and its highlight goes with it.":
        "환경 맵에 프리필터링된 6개의 발광 쿼드, 그리고 라이트는 0개. 쿼드 하나를 끄면 그 하이라이트도 함께 사라집니다.",

    # === 데모 페이지 index.html 메인 헤더 ===
    "the pieces": "각 메커니즘",
    "Ten small pages, each one pulling a single mechanism out of the main app and looping it on its own. They exist so the moving parts can be watched instead of described: picking, resampling, culling, growth, and the four shaders that make the modes look alive. Most of them drive the production code directly.":
        "10개의 작은 페이지로, 각각 메인 앱에서 단일 메커니즘만 꺼내어 자체적으로 반복 실행합니다. 정적 설명 대신 움직이는 부품을 직접 관찰할 수 있도록: 선택, 리셈플링, 컬링, 성장, 그리고 모드를 살아있게 만드는 4개의 셰이더. 대부분은 실제 프로덕션 코드를 직접 구동합니다.",
    # index.html 카드 10번 짧은 버전
    "Six emissive quads and no lights. Switch one off, lose a highlight.":
        "환경 맵에 프리필터링된 6개의 발광 쿼드, 그리고 라이트는 0개. 쿼드 하나를 끄면 그 하이라이트도 함께 사라집니다.",

    # === index.html 정적 ===
    "Geometry Painter — three.js WebGPU": "지오메트리 페인터 — three.js WebGPU",
    "💎 Geometry Painter ": "💎 지오메트리 페인터 ",
    "🌋 Geometry Painter ": "🌋 지오메트리 페인터 ",
    "🌌 Geometry Painter ": "🌌 지오메트리 페인터 ",
    "🪸 Geometry Painter ": "🪸 지오메트리 페인터 ",
}

# ---------------------------------------------------------------------------
# i18n.json — 클라이언트 토글이 런타임에 참조할 매핑
# ---------------------------------------------------------------------------
def build_i18n():
    """한→영 역매핑 + 영→한 정매핑 + 영문 alias 모두 포함."""
    ko_to_en = {}
    en_to_ko = {}
    for en, ko in STRINGS.items():
        # 영문 alias는 다양한 표기 모두 → 한국어 매핑
        en_to_ko[en] = ko
        # 모드 이름 같은 영문 키는 한국어 결과도 등록
        ko_to_en.setdefault(ko, en)
    return {
        "ko": ko_to_en,
        "en": en_to_ko,
        "default": "ko",
    }


# ---------------------------------------------------------------------------
# 정규식 기반 HUD 패턴 (변수 보간 처리)
# ---------------------------------------------------------------------------
HUD_PATTERNS = [
    # app.ts: `Move over the sphere, then <b>drag</b> to paint a ${noun}. Press <b>D</b> to orbit.`
    (
        r"`Move over the sphere, then <b>drag</b> to paint a \$\{noun\}\. Press <b>D</b> to orbit\.`",
        "`구체 위로 마우스를 올린 뒤 <b>드래그</b>로 \${noun}을(를) 그려보세요. <b>D</b>를 눌러 회전 모드로 전환됩니다.`",
    ),
    # app.ts: '<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan. Press <b>D</b> to paint.'
    (
        r"<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan\. "
        r"Press <b>D</b> to paint\.",
        "<b>회전 모드</b> — 드래그로 회전, 스크롤로 줌, 우드래그로 이동. "
        "<b>D</b>를 눌러 그리기를 시작하세요.",
    ),
    # app.ts: `Mode: ${this.settings.mode} · Renderer: ${e}`
    (
        r'`Mode: \$\{this\.settings\.mode\} · Renderer: \$\{e\}`',
        '`모드: \${this.settings.mode} · 렌더러: \${e}`',
    ),
    # demos/index.html 메인 설명 — 줄바꿈 + 들여쓰기를 \s+ 로 흡수
    (
        r"Ten small pages,\s+each one pulling a single mechanism out of the main app and looping it\s+on its own\.\s+They exist so the moving parts can be watched instead of described:\s+picking, resampling, culling, growth, and the four shaders that make the modes look\s+alive\.\s+Most of them drive the production code directly\.",
        "10개의 작은 페이지로, 각각 메인 앱에서 단일 메커니즘만 꺼내어 자체적으로 반복 실행합니다. 정적 설명 대신 움직이는 부품을 직접 관찰할 수 있도록: 선택, 리셈플링, 컬링, 성장, 그리고 모드를 살아있게 만드는 4개의 셰이더. 대부분은 실제 프로덕션 코드를 직접 구동합니다.",
    ),
]


# ---------------------------------------------------------------------------
# 패치 로직
# ---------------------------------------------------------------------------
def patch_text(text: str) -> tuple[str, int]:
    """텍스트 한 건에 매핑/패턴 적용.

    보호 대상:
    - `<script src="...">` / `<link href="...">` 안의 chunk 경로
    - JS/CJS 식별자 (CamelCase 안의 부분 단어): e.g. OrbitControls 안의
      `Controls`가 단독 매핑되어 식별자가 깨지는 것 방지

    매핑에서 영문 키가 다른 영문 단어의 부분이 될 수 있으면
    CamelCase 안에서는 매칭을 건너뛴다.
    """
    count = 0

    # 보호 영역 마스킹 (1): chunk src/href 안의 경로
    placeholders: list[tuple[str, str]] = []

    def mask_attr(match: re.Match) -> str:
        attr = match.group('attr')
        path = match.group('path')
        placeholder = ''.join(chr(0xE000 + ord(c)) for c in path)
        placeholders.append((placeholder, path))
        return f'{attr}="{placeholder}"'

    masked = re.sub(
        r'(?P<attr>src|href)="(?P<path>[^"]+)"',
        mask_attr,
        text,
    )

    # 보호 영역 마스킹 (2): CamelCase 식별자 안의 매핑 키 위치
    # 식별자 = [A-Za-z_$][A-Za-z0-9_$]* 안에서 매핑 키가 단독 단어로 등장하는지
    # 확인한다. 등장하면 그 영역을 플레이스홀더로 마스킹.
    def mask_identifier_keys():
        nonlocal masked
        for key in list(STRINGS.keys()):
            # key가 영문 단어이고 다른 영문 식별자 안에 포함될 수 있는 경우만 처리
            if not re.fullmatch(r'[A-Za-z]+', key) or len(key) < 4:
                continue
            # 매핑 키가 식별자 안에서 단독 단어로 등장하는 패턴:
            # (?<=[a-z])([A-Z][a-z]* = 매핑 키)  — CamelCase 경계
            # (?<=[A-Z])([A-Z][a-z]+ = 매핑 키)  — ALLCAPS + CamelCase 경계
            # 양쪽이 식별자 문자([A-Za-z0-9_$])이면 매칭에서 제외
            camel_pat = re.compile(
                rf'(?<=[a-z])(?P<k>{re.escape(key)})(?=[A-Z])|'
                rf'(?<=[A-Z])(?P<k2>{re.escape(key)})(?=[A-Z][a-z])|'
                rf'(?<=[A-Z])(?P<k3>{re.escape(key)})(?=[^A-Za-z0-9_$]|$)'
            )

            def _mask(m):
                word = m.group(1) if m.group(1) else (m.group(2) if m.group(2) else m.group(3))
                placeholder = ''.join(chr(0xE000 + ord(c)) for c in word)
                placeholders.append((placeholder, word))
                return placeholder

            masked = camel_pat.sub(_mask, masked)

    mask_identifier_keys()

    # 1) 단순 문자열 치환
    for old, new in STRINGS.items():
        if old != new and old in masked:
            masked = masked.replace(old, new)
            count += 1

    # 2) 정규식 패턴
    for pattern, replacement in HUD_PATTERNS:
        replaced, n = re.subn(pattern, replacement, masked)
        if n:
            masked = replaced
            count += n

    # 3) 플레이스홀더 복원
    for placeholder, original in placeholders:
        masked = masked.replace(placeholder, original)

    return masked, count


def is_protected_path(path: Path) -> bool:
    """chunk 해시 파일명이나 모듈 import 경로 등 한국어화하면 안 되는 영역을
    보호한다. .js 파일 중에서 파일명 패턴이 vite chunk 네이밍 규칙에
    부합하면 본문은 패치하되 파일명은 절대 건드리지 않는다.
    """
    name = path.name
    # vite/rollup chunk 네이밍: name-HASH.ext 또는 name.ext
    # 예: OrbitControls-BHHAk_X3.js, main-RnyYGLK4.js, kit-D0Bq92t5.js
    import re as _re
    if _re.match(r'^[A-Za-z][A-Za-z0-9_-]*-[A-Za-z0-9_-]{6,}\.[a-z]+$', name):
        return True
    return False


def patch_file(path: Path) -> int:
    """파일 하나 패치. chunk 파일명은 보호한다."""
    text = path.read_text(encoding="utf-8")
    new_text, count = patch_text(text)
    if is_protected_path(path):
        # chunk 파일은 본문만 패치하고 파일명은 유지한다 (rename 효과 차단)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
        return count
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
    return count


def inject_toggle_ui(index_html: Path) -> None:
    """index.html에 한/영 토글 UI를 주입한다.

    - <html lang>을 ko로 강제 (영문 모드에서도 lang 속성은 유지하되 토글이 결정)
    - 우상단에 🌐 토글 버튼 추가
    - 클라이언트 스크립트가 localStorage에서 lang 읽어 매핑 적용
    """
    text = index_html.read_text(encoding="utf-8")

    # 1) lang="ko"가 아니면 변경
    text = re.sub(r'<html lang="en">', '<html lang="ko">', text)

    # 2) 토글 버튼 CSS + HTML을 #hud 위에 삽입 (또는 적절한 위치)
    toggle_css = """
      /* KO/EN language toggle (top-right) */
      #langToggle {
        position: fixed; right: 280px; top: 14px; z-index: 9999;
        display: flex; align-items: center; gap: 6px;
        padding: 7px 11px 7px 9px; border-radius: 999px;
        background: rgba(20, 22, 32, 0.85); backdrop-filter: blur(6px);
        border: 1px solid rgba(190, 140, 255, 0.4);
        color: #eef0f6; font-size: 12.5px; font-weight: 600;
        cursor: pointer; user-select: none;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      #langToggle:hover { background: rgba(50, 35, 80, 0.95); border-color: rgba(190, 140, 255, 0.65); }
      #langToggle .flag { font-size: 14px; line-height: 1; }
      #langToggle .code { letter-spacing: 0.05em; }
      #langToggle .arrow { opacity: 0.55; font-size: 10px; }
    """
    toggle_html = """
    <button id="langToggle" type="button" aria-label="Toggle language" title="한/영 전환 (T)">
      <span class="flag">🌐</span><span class="code">KO</span><span class="arrow">⇄</span><span class="code">EN</span>
    </button>
"""
    # CSS는 </style> 직전에, HTML은 <body> 직후에
    if "#langToggle" not in text:
        text = text.replace("</style>", toggle_css + "\n    </style>")
        text = text.replace("<body>", "<body>\n" + toggle_html)

    # 3) 클라이언트 토글 스크립트 — i18n.json을 fetch해 적용
    client_script = """
    <!-- ko/en i18n toggle -->
    <script>
      (function () {
        var DEFAULT_LANG = 'ko';
        var STORAGE_KEY = 'gp-lang';
        var i18n = null;
        function getLang() {
          try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
        }
        function setLang(l) {
          try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
        }
        // 한→영 또는 영→한 매핑을 텍스트 노드에 적용 (단어 단위 안전 치환)
        function applyLang(root, lang) {
          if (!i18n) return;
          // i18n.ko는 ko→en 매핑, i18n.en은 en→ko 매핑.
          // KO 모드: en→ko만 적용 (한→영은 건드리지 않음 — 빌드 시 이미 한국어 박힘)
          // EN 모드: en→ko 역방향이 필요. 한→영(ko→en) 적용.
          var tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
              if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
              var p = n.parentElement;
              if (!p) return NodeFilter.FILTER_REJECT;
              var tag = p.tagName;
              if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS') return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
          });
          var nodes = [];
          while (tree.nextNode()) nodes.push(tree.currentNode);
          nodes.forEach(function (n) {
            var original = n._original || n.nodeValue;
            n._original = original;
            var t = original;
            if (lang === 'ko') {
              // 영문 → 한글 (i18n.en은 en→ko)
              var enKeys = Object.keys(i18n.en || {}).sort(function (a, b) { return b.length - a.length; });
              enKeys.forEach(function (k) {
                if (t.indexOf(k) !== -1) t = t.split(k).join(i18n.en[k]);
              });
            } else {
              // 한글 → 영문 (i18n.ko는 ko→en)
              var koKeys = Object.keys(i18n.ko || {}).sort(function (a, b) { return b.length - a.length; });
              koKeys.forEach(function (k) {
                if (t.indexOf(k) !== -1) t = t.split(k).join(i18n.ko[k]);
              });
            }
            n.nodeValue = t;
          });
        }
        function setHtmlLang(l) {
          document.documentElement.setAttribute('lang', l === 'ko' ? 'ko' : 'en');
          // <title>도 토글 (head 안이지만 직접 갱신)
          var titleEl = document.querySelector('title');
          if (titleEl) {
            var t = titleEl._original || titleEl.textContent;
            titleEl._original = t;
            if (l === 'ko') titleEl.textContent = '지오메트리 페인터 — three.js WebGPU';
            else titleEl.textContent = 'Geometry Painter — three.js WebGPU';
          }
        }
        function updateToggleUi(l) {
          var btn = document.getElementById('langToggle');
          if (!btn) return;
          var codes = btn.querySelectorAll('.code');
          // .code[0] 현재, .code[1] 전환 대상
          if (codes.length >= 2) {
            codes[0].textContent = l === 'ko' ? 'KO' : 'EN';
            codes[1].textContent = l === 'ko' ? 'EN' : 'KO';
          }
        }
        function applyAll(l) {
          setHtmlLang(l);
          // 정적 DOM (title, hud, modeBtn, drawFrame 등)
          applyLang(document.body, l);
          updateToggleUi(l);
          // lil-gui 컨트롤의 런타임 라벨도 갱신
          if (window.__gpApplyLang) window.__gpApplyLang(l, i18n);
        }
        // i18n.json 로드 후 동작
        fetch('/assets/i18n.json').then(function (r) { return r.json(); }).then(function (data) {
          i18n = data;
          var lang = getLang();
          // DOMContentLoaded 이후 적용
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { applyAll(lang); });
          } else {
            // 한 번 더 즉시 적용 (이미 빌드 시 한국어로 박혀있는 경우 영문 복원)
            applyAll(lang);
          }
          // toggle button click
          document.addEventListener('click', function (e) {
            var t = e.target;
            if (t && t.closest && t.closest('#langToggle')) {
              var cur = getLang();
              var next = cur === 'ko' ? 'en' : 'ko';
              setLang(next);
              // 페이지 텍스트 갱신
              applyAll(next);
            }
          });
          // T 키 단축키
          document.addEventListener('keydown', function (e) {
            if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey && !e.altKey) {
              var cur = getLang();
              var next = cur === 'ko' ? 'en' : 'ko';
              setLang(next);
              applyAll(next);
            }
          });
        }).catch(function () { /* ignore */ });
      })();
    </script>
"""
    if 'gp-lang' not in text:
        text = text.replace("</body>", client_script + "\n  </body>")

    index_html.write_text(text, encoding="utf-8")


def main() -> None:
    if not DIST.exists():
        raise SystemExit(f"dist/ 폴더가 없습니다: {DIST} — 먼저 `npm run build` 실행")

    total = 0
    touched = []
    for ext in ("*.html", "*.js"):
        for p in DIST.rglob(ext):
            n = patch_file(p)
            if n:
                touched.append((p.relative_to(DIST), n))
                total += n

    # i18n.json 생성 (런타임 토글용)
    i18n_path = DIST / "assets" / "i18n.json"
    i18n_path.parent.mkdir(parents=True, exist_ok=True)
    i18n_path.write_text(
        json.dumps(build_i18n(), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # index.html에 토글 UI 주입
    index_html = DIST / "index.html"
    if index_html.exists():
        inject_toggle_ui(index_html)

    print(f"한글화 완료: {total}건 치환 ({len(touched)}개 파일)")
    print(f"i18n.json 생성: {i18n_path}")
    for path, n in touched:
        print(f"  · {path}  ({n}건)")


if __name__ == "__main__":
    main()
