// 扣子OAuth回调处理函数 - 适配EdgeOne Pages
export async function handler(request) {
  try {
    // 解析URL参数
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response(JSON.stringify({ error: '缺少授权码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('收到扣子授权码:', code);
    
    // 从环境变量获取配置
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    
    // 用授权码换取访问令牌
    const tokenResponse = await fetch('https://api.coze.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('换取token失败:', errorText);
      return new Response(JSON.stringify({ error: '授权失败' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const tokenData = await tokenResponse.json();
    console.log('获取到的token数据:', tokenData);
    
    // 重定向回主页
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `/?auth=success&token=${encodeURIComponent(tokenData.access_token)}`
      }
    });
    
  } catch (error) {
    console.error('OAuth回调处理错误:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
