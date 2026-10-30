# AI秘境塔羅

> 一個 Progressive Web App

## 📦 包含檔案

- `icon-192.png`
- `icon-512.png`
- `manifest.json`
- `sw.js`
- `index.html`
- `icon.svg`
- `icon-maskable.svg`
- `offline.html`

## 🚀 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "init: AI秘境塔羅 PWA"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

然後在 GitHub repo → **Settings → Pages** → Source 選 `main` 分支，等待幾分鐘後即可訪問。

## 🃏 牌面圖

`cards/00.webp`～`77.webp` 是 Pamela Colman Smith 繪製的 Rider–Waite–Smith「Pam-A」版（1910）掃描，
取自 Wikimedia Commons〈Rider-Waite-Smith tarot deck (TaionWC)〉，標示為公有領域；逐張來源見 `cards/SOURCES.md`。
編號與 `DB` 的 `id` 相同。逆位用 CSS 轉 180°。Service Worker 會在背景把 78 張存進獨立快取（App 更新時不重下載）。

## 📱 安裝 PWA

在支援的瀏覽器（Chrome / Edge / Safari iOS）中打開網頁，  
點擊「**安裝**」或「**加入主畫面**」即可將此 App 安裝到裝置。

## ⚙ 技術規格

| 項目 | 值 |
|------|-----|
| display | standalone |
| theme_color | #1a73e8 |
| lang | zh-TW |
| scope | /tarot/ |

---
*由 [PWA 打包神器](https://github.com) 自動生成*
