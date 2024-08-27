import fs from 'fs';
import path from 'path';

function createHtmlFile() {
  const htmlFilePath = path.join(
    process.cwd(),
    'components-page',
    'src',
    'index.html',
  );

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>公共组件平台</title>
</head>
<body data-theme='light'>
  <div id="root"></div>
  <script type="module" src="/main.jsx"></script>
</body>
</html>
  `;

  if (!fs.existsSync(path.dirname(htmlFilePath))) {
    fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
  }

  fs.writeFileSync(htmlFilePath, htmlContent.trim());
  console.log('------------------------------------------------------------');

  console.log(`index.html 文件已更新或创建，请查看：${htmlFilePath}`);
}

export default createHtmlFile;
