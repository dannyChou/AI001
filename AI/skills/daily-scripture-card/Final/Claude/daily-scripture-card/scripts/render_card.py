#!/usr/bin/env python3
"""將卡片 HTML 渲染為 retina PNG（Claude Code 專案版）。

用法:
    python3 scripts/render_card.py cards/card_YYYYMMDD.html images/morning_card_YYYYMMDD.png

渲染參數（與整套流程一致）：
    viewport 900x1200, device_scale_factor=2（產出約 1800px 寬）
    goto file://絕對路徑 -> 等 800ms -> 對 body 截圖
需先安裝：pip install playwright && playwright install chromium
並安裝 Noto CJK 字型（見 README.md）。
"""
import sys
import os
from playwright.sync_api import sync_playwright


def render(html_path: str, png_path: str) -> None:
    abs_html = os.path.abspath(html_path)
    out_dir = os.path.dirname(os.path.abspath(png_path))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 900, "height": 1200},
            device_scale_factor=2,
        )
        page.goto(f"file://{abs_html}")
        page.wait_for_timeout(800)
        page.locator("body").screenshot(path=png_path)
        browser.close()
    print(f"rendered -> {png_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("用法: python3 scripts/render_card.py <input.html> <output.png>")
        sys.exit(1)
    render(sys.argv[1], sys.argv[2])
