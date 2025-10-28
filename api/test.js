// 最简单的测试端点
export default function handler(request, response) {
  response.status(200).json({
    message: "✅ API工作正常",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
