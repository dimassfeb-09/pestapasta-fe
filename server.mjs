// Minimal static file server for the built Vite SPA (no nginx).
// Serves ./dist with SPA fallback to index.html.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "dist");
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";

    const filePath = path.join(root, pathname);
    // Prevent path traversal
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      stat = null;
    }

    if (stat && stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback
    const index = path.join(root, "index.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream(index).pipe(res);
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err));
  }
});

server.listen(port, host, () => {
  console.log(`FE static server listening on http://${host}:${port}`);
});