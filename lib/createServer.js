import express from 'express';
import path from 'path';

function createServer() {
  const app = express();
  const componentsPageDir = path.join(process.cwd(), 'components-page');

  // Serve static files
  app.use(express.static(componentsPageDir));

  // Serve the index.html file
  app.get('/', (req, res) => {
    res.sendFile(path.join(componentsPageDir, 'index.html'));
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server 运行 在 http://localhost:${PORT}`);
  });
}

export default createServer;
