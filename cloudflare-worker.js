/**
 * 塔羅秘境 · Cloudflare Worker API Proxy
 * ========================================
 * 部署此 Worker 後，手機透過 GitHub Pages 開啟 App 即可使用 AI 功能。
 * API Key 安全存放在 Worker 環境變數中，不會暴露在前端程式碼裡。
 *
 * 部署方式請參考 DEPLOY.md
 */

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    const url = new URL(request.url);

    // ── 健康檢查端點 ─────────────────────────────────
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', service: '塔羅秘境 AI Proxy' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    // ── 只處理 /api/claude ──────────────────────────
    if (url.pathname !== '/api/claude') {
      return new Response('Not Found', { status: 404, headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
    }

    // ── 檢查 API Key ────────────────────────────────
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return jsonError(500, 'Worker 環境變數 ANTHROPIC_API_KEY 未設定');
    }

    // ── 解析請求 body ───────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError(400, '無效的 JSON 格式');
    }

    // ── 轉發到 Anthropic API ────────────────────────
    let anthropicResp;
    try {
      anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      return jsonError(503, `無法連線 Anthropic API：${e.message}`);
    }

    // ── 回傳結果（保留原始狀態碼）─────────────────
    const data = await anthropicResp.text();
    return new Response(data, {
      status: anthropicResp.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonError(status, message) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    }
  );
}
