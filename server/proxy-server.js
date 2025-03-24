// server/proxy-server.js
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 啟用 CORS
app.use(cors());
app.use(express.json());

// 靜態文件服務
app.use(express.static(path.join(__dirname, '../dist')));

// API 代理
app.use('/api/data', createProxyMiddleware({
  target: 'https://cdn.sit.crm.ddpay.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api/data': '/data'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`代理請求: ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`代理回應: ${req.method} ${req.url} - ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`代理錯誤: ${err.message}`);
    res.status(500).send({ error: '代理請求失敗', message: err.message });
  }
}));

// 通用代理端點
app.post('/api/proxy', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body = null } = req.body;
    
    console.log(`收到代理請求: ${method} ${url}`);
    
    const fetchOptions = {
      method,
      headers: {
        ...headers,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    };
    
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    console.log(`代理請求成功: ${method} ${url}`);
    res.json(data);
  } catch (error) {
    console.error(`代理請求失敗: ${error.message}`);
    res.status(500).json({ error: '代理請求失敗', message: error.message });
  }
});

// 處理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`代理伺服器運行在 http://localhost:${PORT}`);
});