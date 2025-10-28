// 简化版回调处理
export default function handler(req, res) {
  console.log('回调端点被访问', {
    method: req.method,
    query: req.query,
    headers: req.headers
  });

  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 简单响应测试
  if (req.method === 'GET') {
    res.status(200).json({
      status: '回调端点工作正常',
      message: '这是一个测试响应',
      query: req.query,
      env: {
        hasClientId: !!process.env.CLIENT_ID,
        hasClientSecret: !!process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI
      }
    });
    return;
  }

  res.status(405).json({ error: '方法不允许' });
}
