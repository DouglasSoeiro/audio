const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist');
const port = Number(process.env.PORT) || 4173;
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendFile(request, response, file) {
  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Arquivo não encontrado.');
      return;
    }

    const headers = {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    };
    const range = request.headers.range;

    if (!range) {
      headers['Content-Length'] = stats.size;
      response.writeHead(200, headers);
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(file).pipe(response);
      return;
    }

    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      response.end();
      return;
    }

    let start = match[1] ? Number(match[1]) : Math.max(0, stats.size - Number(match[2]));
    let end = match[2] && match[1] ? Number(match[2]) : stats.size - 1;
    end = Math.min(end, stats.size - 1);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      response.end();
      return;
    }

    headers['Content-Length'] = end - start + 1;
    headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
    response.writeHead(206, headers);
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file, { start, end }).pipe(response);
  });
}

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end();
    return;
  }
  sendFile(request, response, file);
}).listen(port, () => {
  console.log(`Sementinha disponível em http://localhost:${port}`);
});
