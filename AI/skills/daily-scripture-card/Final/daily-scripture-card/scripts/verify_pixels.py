#!/usr/bin/env python3
"""像素統計備援驗證：當視覺預覽無法帶回畫面時，用來確認 PNG 圖檔非空白、內容有渲染。

用法:
    python3 verify_pixels.py <card.png>

健康的卡片參考值（不是硬性門檻，是合理範圍）：
    - 不同顏色數 unique_colors 約 8,000 ~ 9,800
    - 插圖區 (上 5%~22%) 有可觀筆畫 art_marks
    - 內文區 (30%~85%) 有大量深色文字像素 body_text
    - 頁尾區 (90%~97%) 有少量深色像素 footer

若要確認「該張主體特徵色」存在，可另外針對顏色抽樣（見檔末 hint）。
"""
import sys
from PIL import Image


def verify(png_path: str) -> None:
    img = Image.open(png_path).convert("RGB")
    w, h = img.size
    px = img.load()

    colors = img.getcolors(maxcolors=2_000_000)
    unique_colors = len(colors) if colors else -1

    art_marks = sum(
        1
        for y in range(int(h * 0.05), int(h * 0.22), 4)
        for x in range(0, w, 4)
        if sum(px[x, y]) < 690
    )
    body_text = sum(
        1
        for y in range(int(h * 0.30), int(h * 0.85), 6)
        for x in range(0, w, 6)
        if sum(px[x, y]) < 300
    )
    footer = sum(
        1
        for y in range(int(h * 0.90), int(h * 0.97), 3)
        for x in range(0, w, 3)
        if sum(px[x, y]) < 300
    )

    print(f"size:          {w} x {h}")
    print(f"unique_colors: {unique_colors}")
    print(f"art_marks:     {art_marks}")
    print(f"body_text:     {body_text}")
    print(f"footer:        {footer}")

    ok = (
        w > 0 and h > 0
        and unique_colors >= 4000
        and art_marks > 1000
        and body_text > 800
        and footer > 100
    )
    print(f"\nverdict:       {'OK 圖檔完整' if ok else 'CHECK 需人工確認'}")

    # hint: 要驗證主體特徵色，可在此加抽樣，例如：
    #   水的藍灰:   px[x,y][2] > px[x,y][0] + 6
    #   麥的金黃:   r>200 and g>160 and b<160
    #   花的粉紫:   r>190 and b>130 and r>g
    #   晨光的亮黃: r>235 and g>210 and b<180


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("用法: python3 verify_pixels.py <card.png>")
        sys.exit(1)
    verify(sys.argv[1])
