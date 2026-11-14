const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8099);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".exe": "application/octet-stream",
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Petición no válida");
    return;
  }

  if (pathname === "/") pathname = "/index.html";

  const filePath = path.resolve(root, "." + pathname);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403");
    return;
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("No encontrado");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const isExe = extension === ".exe";

    res.writeHead(200, {
      "Content-Type": types[extension] || "application/octet-stream",
      "Content-Length": stat.size,
      "Content-Disposition": isExe
        ? 'attachment; filename="CobaltoFTP.exe"'
        : "inline",
      "Cache-Control": isExe ? "no-store" : "no-cache",
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log("");
  console.log("  Cobalto FTP web");
  console.log(`  http://localhost:${port}`);
  console.log("");
  console.log("  Deja esta ventana abierta mientras uses la web.");
  console.log("  Pulsa Ctrl+C para parar el servidor.");
});
