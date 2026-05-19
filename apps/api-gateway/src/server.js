const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://auth-service:3000",
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
  })
);

app.get("/", (req, res) => {
  res.send("api-gateway running");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`api-gateway running on port ${PORT}`);
});