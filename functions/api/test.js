// 测试API端点
export async function handler(request) {
  try {
    // 设置响应头
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 200 });
    }
    
    // 返回测试数据
    const testData = {
      message: "✅ API工作正常",
      timestamp: new Date().toISOString(),
      request: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers)
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        environmentVariables: {
          CLIENT_ID: process.env.CLIENT_ID ? '已设置' : '未设置',
          CLIENT_SECRET: process.env.CLIENT_SECRET ? '已设置' : '未设置',
          REDIRECT_URI: process.env.REDIRECT_URI || '未设置'
        }
      },
      note: "这是一个最小验证配置的测试端点"
    };
    
    console.log('测试端点被访问:', testData);
    
    return new Response(JSON.stringify(testData, null, 2), {
      headers,
      status: 200
    });
    
  } catch (error) {
    console.error('测试端点错误:', error);
    
    return new Response(JSON.stringify({ 
      error: '测试端点错误',
      message: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
