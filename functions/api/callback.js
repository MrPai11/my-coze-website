// 最小验证版回调处理函数
export async function handler(request) {
  try {
    // 解析URL和查询参数
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
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
    
    // 简单响应测试
    if (request.method === 'GET') {
      const responseData = {
        status: '回调端点工作正常',
        message: '这是一个测试响应',
        timestamp: new Date().toISOString(),
        request: {
          method: request.method,
          path: url.pathname,
          query: {
            code: code ? '已提供' : '未提供',
            state: state || '未提供'
          }
        },
        environment: {
          hasClientId: !!process.env.CLIENT_ID,
          hasClientSecret: !!process.env.CLIENT_SECRET,
          hasRedirectUri: !!process.env.REDIRECT_URI,
          nodeVersion: process.version
        }
      };
      
      console.log('回调端点被访问:', responseData);
      
      return new Response(JSON.stringify(responseData, null, 2), {
        headers,
        status: 200
      });
    }
    
    // 处理POST请求（实际OAuth回调）
    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      
      const responseData = {
        status: 'OAuth回调处理中',
        message: '这是一个模拟的OAuth回调处理',
        timestamp: new Date().toISOString(),
        received: body
      };
      
      return new Response(JSON.stringify(responseData, null, 2), {
        headers,
        status: 200
      });
    }
    
    // 不支持的HTTP方法
    return new Response(JSON.stringify({ error: '方法不允许' }), {
      headers,
      status: 405
    });
    
  } catch (error) {
    console.error('回调处理错误:', error);
    
    return new Response(JSON.stringify({ 
      error: '服务器错误',
      message: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
