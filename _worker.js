export default {
       async fetch(request, env, ctx) {
                        const url = new URL(request.url);
                        url.hostname = env.HOST || 'www.speedtest.net';
                        url.protocol = 'https:';
                        request = new Request(url, request);
                        return fetch(request);
              }
};
