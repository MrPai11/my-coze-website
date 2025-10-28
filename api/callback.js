// 扣子OAuth回调处理函数
export default async function handler(req, res) {
  // 设置CORS头部，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // 从查询参数获取授权码
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?error=缺少授权码');
    }
    
    console.log('收到扣子授权码:', code);
    
    // 从环境变量获取配置
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    
    // 动态导入node-fetch
    const fetch = (await import('node-fetch')).default;
    
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
      return res.redirect('/?error=授权失败');
    }
    
    const tokenData = await tokenResponse.json();
    console.log('获取到的token数据:', tokenData);
    
    // 重定向回主页，并携带token信息
    res.redirect(`/?auth=success&token=${encodeURIComponent(tokenData.access_token)}`);
    
  } catch (error) {
    console.error('OAuth回调处理错误:', error);
    res.redirect('/?error=服务器错误');
  }
}
