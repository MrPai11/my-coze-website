// 环境变量检查端点
export default function handler(req, res) {
  // 安全考虑，不显示敏感信息的具体值
  const envInfo = {
    CLIENT_ID: process.env.CLIENT_ID ? '已设置' : '未设置',
    CLIENT_SECRET: process.env.CLIENT_SECRET ? '已设置' : '未设置',
    REDIRECT_URI: process.env.REDIRECT_URI || '未设置',
    NODE_ENV: process.env.NODE_ENV || '未设置'
  };

  res.status(200).json({
    message: '环境变量状态',
    environment: envInfo,
    timestamp: new Date().toISOString()
  });
}
