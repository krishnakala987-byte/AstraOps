require('dotenv').config();

const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {

  res.json({
    message: 'API Gateway Running'
  });

});

app.get('/health', (req, res) => {

  res.json({
    service: process.env.SERVICE_NAME,
    status: 'healthy'
  });

});

/*
  FINAL PROXY
*/

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,

    /*
      DO NOT rewrite path anymore
    */

    pathRewrite: {
      '^/api/auth': ''
    },

    logLevel: 'debug'
  })
);

app.listen(PORT, () => {

  console.log(`${process.env.SERVICE_NAME} running on port ${PORT}`);

});