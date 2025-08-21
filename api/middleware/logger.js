export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const latency = Date.now() - start;
    console.log(JSON.stringify({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      latency
    }));
  });
  next();
}
