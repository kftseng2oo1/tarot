# 塔羅秘境 · Arcana v3

AI 塔羅占卜：每日一牌、多種牌陣、深度分析、占卜日誌與牌義辭典。

**線上使用**：https://kftseng2oo1.github.io/tarot/

## 主要功能
- **每日一牌**：轉動水晶球抽牌，可設定每日提醒時間
- **牌陣占卜**：先選問題類別（綜合、投資理財、購屋置產、生育孕產、健康身體、事業成長、感情關係、靈性修行、其他），會依問題內容自動判斷類別
- **✦ 深度分析**：AI 結合元素、星體、月相、節氣解讀
- 解讀風格：🌙 詩意、🧠 心理、⚡ 直白；可語音朗讀
- **占卜日誌**：儲存每次結果與心情
- **牌義辭典**：查閱每張牌的正逆位牌義

## 技術與依賴
- 單檔 HTML PWA（`index.html` 內含全部 HTML/CSS/JS），`manifest.json` + `sw.js` 提供安裝到主畫面與離線快取。（約 290 KB）
- AI 經 `arcar.kftseng2oo1.workers.dev` 代理
- `speechSynthesis`、Notification、Web Share
- 本機資料：`arcana_journal`、`tarotJournal`、`tarot_reading_style`、`tarot_notif`、`tarot_notif_hour`

## 相關 repo
- [v3taro](https://github.com/kftseng2oo1/v3taro)：幾乎相同的另一份
