# 每日經文早安賀卡（Claude Code 版）

在 Claude Code 裡，用一句話或 `/card` 指令，就能產生一張「書籤式每日經文早安賀卡」：以聖經經文為底、寫給非基督徒、附鄉村風手繪 SVG 插圖，輸出 retina PNG 與可再編輯的 HTML。

專案規則寫在 `CLAUDE.md`，Claude Code 會自動讀取並依此製作。

同一套流程也存成了全域 Skill（`~/.claude/skills/daily-scripture-card/SKILL.md`），內容以本專案絕對路徑為 `<ROOT>`，因此不論在哪個目錄開 Claude Code 對話，都能直接說「幫我做今天的早安賀卡」觸發，不必先切到這個資料夾。

---

## 一、環境安裝（一次性）

需要 Python 3、Playwright（含 Chromium）、Pillow，以及 Noto CJK 字型。

```bash
# 1) Python 套件
pip install playwright pillow
python -m playwright install chromium

# 2) Noto CJK 字型（擇一）
#   Ubuntu / Debian：
sudo apt-get install -y fonts-noto-cjk
#   macOS（Homebrew）：
brew install --cask font-noto-serif-cjk font-noto-sans-cjk
#   或到 Google Fonts 下載 Noto Serif TC / Noto Sans TC 後安裝
```

字型若沒裝，圖仍會渲染，但中文會變成豆腐框或改用系統替代字型，外觀會跑掉。

---

## 二、使用方式

### 方式 A：斜線指令（推薦）

在 Claude Code 對話輸入：

```
/card 2026-08-20 尼希米記 13:1-14
```

Claude 會依 `CLAUDE.md` 全流程產出 `cards/card_20260820.html` 與 `images/morning_card_20260820.png`，並自我驗證。

### 方式 B：自然語言

貼上當天的讀經進度表，直接說：

```
請做 8/20 的早安賀卡，套用專案流程
```

### 方式 C：手動只跑渲染／驗證

```bash
python3 scripts/render_card.py cards/card_20260820.html images/morning_card_20260820.png
python3 scripts/verify_pixels.py images/morning_card_20260820.png
```

---

## 三、目錄結構

```
daily-scripture-card/
├── CLAUDE.md                     # 專案規則（Claude Code 自動讀取）
├── README.md                     # 本檔
├── .claude/commands/card.md      # 斜線指令 /card
├── assets/card_template.html     # 可重用樣板（含 .verse 經節區塊）
├── scripts/render_card.py        # HTML → PNG
├── scripts/verify_pixels.py      # 像素統計備援驗證
├── cards/                        # 產出 HTML
└── images/                       # 產出 PNG
```

---

## 四、產出物

- `cards/card_YYYYMMDD.html`：可再編輯的原始檔。
- `images/morning_card_YYYYMMDD.png`：約 1800px 寬的 retina 圖，可直接分享。

---

## 五、核心原則（摘要，詳見 CLAUDE.md）

- 一律**繁體中文**，寫給**非基督徒**，語氣親切不說教。
- **直白信仰**：明說出自聖經、直接稱耶穌與神、引用原句，但不激進、不施壓；結尾用「若你好奇……歡迎有一天翻開聖經裡的○○記」這類**邀請**。
- 插圖需**呼應當日主題**，並保留系列一致元素（晨光＋淡化十字、木籬笆、野花、飛鳥、落葉）。
- **產圖後務必自行驗證**可正常顯示。
