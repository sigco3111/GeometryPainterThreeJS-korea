#!/usr/bin/env python3
"""
Geometry Painter Three.js — 빌드 후처리 한국어화 스크립트.

빌드된 dist/ 폴더의 JS + HTML 안 영문 사용자 노출 문자열을 한�로 치환한다.
- index.html: title, lang, UI 정적 텍스트
- dist/assets/*.js: 모드 이름, GUI 라벨, HUD, 토스트, 팔레트 이름
- dist/demos/*.html: 데모 페이지 동일 처리

영문 변수명·내부 식별자·TSL 셰이더 키워드는 절대 건드리지 않는다
(사용자에게 노출되는 문자열만 안전하게 매핑한다).

사용법: python3 scripts/koreanize.py
"""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

# ---------------------------------------------------------------------------
# 사용자 노출 문자열 매핑
# (왼쪽: 원문, 오른쪽: 번역) — 좌변은 JS/HTML 안에 그대로 남아있는 리터럴.
# ---------------------------------------------------------------------------
STRINGS = {
    # ---- index.html 정적 ----
    "Geometry Painter — three.js WebGPU": "지오메트리 페인터 — three.js WebGPU",
    "💎 Geometry Painter ": "💎 지오메트리 페인터 ",
    "Paint mode": "그리기 모드",
    "Orbit mode": "회전 모드",

    # ---- GUI / 모드 이름 (ui.ts에서 노출되는 문자열) ----
    "Geometry Painter": "지오메트리 페인터",
    "Paint mode (D)": "그리기 모드 (D)",
    "Crystals": "크리스털",
    "Molten fissures": "용암 균열",
    "Aurora silk": "오로라 실크",
    "Bioluminescent reef": "바이오루미네선스 산호초",
    "Molten fissures (live)": "용암 균열 (실시간)",
    "Aurora silk (live)": "오로라 실크 (실시간)",
    "Bioluminescent reef (live)": "바이오루미네선스 산호초 (실시간)",

    # ---- GUI 컨트롤 라벨 ----
    "Palette": "팔레트",
    "Crystal size": "크리스털 크기",
    "Size variety": "크기 변주",
    "Glow": "발광",
    "Lean": "기울기",
    "Rock size": "암석 크기",
    "Side branches": "측면 가지",
    "Colony size": "군락 크기",
    "Colonies / unit": "군락 밀도",

    # ---- 팔레트 이름 ----
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

    # ---- HUD 안내문 (app.ts) ----
    "Move over the sphere, then ": "구체 위로 마우스를 올린 뒤 ",
    " to paint a ": "로 그려서 ",
    "Press ": "를 누르세요 ",
    " to orbit." " — 드래그로 회전, 스크롤로 줌, 우드래그로 이동.": "로 회전 모드로 전환.",
    "Orbit mode": "회전 모드",
    " — drag to rotate, scroll to zoom, right-drag to pan. ":
        " — 드래그로 회전, 스크롤로 줌, 우드래그로 이동. ",
    "Press D to paint.": "D 키를 눌러 그리기를 시작하세요.",

    # ---- 토스트 메시지 ----
    "crystals seeded 💎": "크리스털 시드 완료 💎",
    "fissures carved 🌋": "용암 균열 생성 🌋",
    "aurora unfurled 🌌": "오로라 펼침 🌌",
    "reef spawned 🪸": "산호초 생성 🪸",
}

# HUD 안내문은 백슬래시 표현식이라서 좀 더 정밀하게:
# app.ts는 `noun` 변수로 모드명을 끼워 넣는다. 빌드된 JS에도 그 흔적이 남아있다.
HUD_TEMPLATES = [
    (
        r'`Move over the sphere, then <b>drag</b> to paint a \$\{noun\}\. Press <b>D</b> to orbit\.`',
        "`구체 위로 마우스를 올린 뒤 <b>드래그</b>로 \${noun}을(를) 그려보세요. <b>D</b>를 누르면 회전 모드로 전환됩니다.`",
    ),
    (
        r'<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan\. '
        r'Press <b>D</b> to paint\.',
        '<b>회전 모드</b> — 드래그로 회전, 스크롤로 줌, 우드래그로 이동. '
        '<b>D</b>를 눌러 그리기를 시작하세요.',
    ),
]


def patch_file(path: Path) -> int:
    """파일 하나를 읽고 매핑된 문자열을 치환한다. 변경 횟수를 반환."""
    text = path.read_text(encoding="utf-8")
    original = text
    count = 0

    for old, new in STRINGS.items():
        if old in text:
            text = text.replace(old, new)
            count += text.count(new) - original.count(new)

    for pattern, replacement in HUD_TEMPLATES:
        new_text, n = re.subn(pattern, replacement, text)
        if n:
            text = new_text
            count += n

    if text != original:
        path.write_text(text, encoding="utf-8")
    return count


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

    print(f"한국어화 완료: {total}건 치환 ({len(touched)}개 파일)")
    for path, n in touched:
        print(f"  · {path}  ({n}건)")


if __name__ == "__main__":
    main()
