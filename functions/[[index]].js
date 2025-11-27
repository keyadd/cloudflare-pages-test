const addr = 'dns.cloudflare.com/dns-query';

export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    // 检查并处理路径
    if (url.pathname.startsWith('/')) {
        // 修改请求的目标主机名
        url.hostname = addr;

        // 构建新的请求对象
        const newRequest = new Request(url.toString(), {
            method: request.method,
            headers: request.headers,
            body: request.method === 'POST' || request.method === 'PUT' ? request.body : null, // 仅在 POST 或 PUT 请求中有 body
            redirect: request.redirect,
        });

        console.log(`Forwarded URL: ${newRequest.url}`);

        try {
            // 转发请求到目标服务器
            return await fetch(newRequest);
        } catch (error) {
            console.error("Error during request forwarding:", error);
            return new Response("Error during request forwarding.", { status: 502 });
        }
    }

    // 如果路径不符合条件，返回原始请求
    return await fetch(request);
}
