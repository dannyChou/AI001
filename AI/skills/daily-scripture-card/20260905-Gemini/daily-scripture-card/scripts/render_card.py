#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
每日經文早安賀卡 - 300 DPI 印刷級極致清晰渲染腳本
1. WeasyPrint (Cairo + Pango 向量排版引擎) + pdftoppm (-r 300 超高採樣)
2. Playwright Chromium (viewport 1080x2160, device_scale_factor=3)
確保手機放大 300% 依然根根筆劃銳利，絕無半點模糊！
"""

import sys
import os
import shutil
import subprocess
from pathlib import Path

def render_card(html_path: str, output_png_path: str):
    html_file = Path(html_path).resolve()
    if not html_file.exists():
        print(f"[ERROR] HTML 檔案不存在: {html_file}", file=sys.stderr)
        sys.exit(1)

    out_file = Path(output_png_path).resolve()
    out_file.parent.mkdir(parents=True, exist_ok=True)

    # 引擎 1：WeasyPrint + pdftoppm -r 300 (頂級向量 300 DPI 渲染)
    try:
        import weasyprint
        if shutil.which("pdftoppm"):
            print("[INFO] 使用 WeasyPrint (Cairo+Pango) + pdftoppm (-r 300) 進行 300 DPI 渲染...")
            temp_pdf = out_file.with_suffix('.temp.pdf')
            weasyprint.HTML(str(html_file)).write_pdf(str(temp_pdf))
            temp_prefix = str(out_file.with_suffix(''))
            subprocess.run(["pdftoppm", "-png", "-r", "300", str(temp_pdf), temp_prefix], check=True)
            rendered_png = Path(f"{temp_prefix}-1.png")
            if rendered_png.exists():
                rendered_png.replace(out_file)
            if temp_pdf.exists():
                temp_pdf.unlink()
            print(f"[SUCCESS] 300 DPI 向量渲染完成: {out_file}")
            return
    except Exception as e:
        print(f"[WARN] WeasyPrint 備援失敗: {e}")

    # 引擎 2：Playwright Chromium (scale=3)
    try:
        from playwright.sync_api import sync_playwright
        print("[INFO] 使用 Playwright Chromium (scale=3) 引擎渲染...")
        file_url = html_file.as_uri()
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1080, 'height': 2160},
                device_scale_factor=3
            )
            page = context.new_page()
            page.goto(file_url, wait_until='networkidle')
            page.wait_for_timeout(1000)
            page.locator("body").screenshot(path=str(out_file))
            browser.close()
        print(f"[SUCCESS] Playwright 渲染完成: {out_file}")
        return
    except ImportError:
        pass

    print("[ERROR] 無可用之渲染引擎", file=sys.stderr)
    sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("用法: python render_card.py <path/to/card.html> <path/to/output.png>")
        sys.exit(1)
    render_card(sys.argv[1], sys.argv[2])

if __name__ == '__main__':
    main()
