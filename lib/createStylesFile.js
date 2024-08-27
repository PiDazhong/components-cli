import fs from 'fs';
import path from 'path';

function createStylesFile() {
  const stylesFilePath = path.join(
    process.cwd(),
    'components-page',
    'src',
    'styles.scss',
  );

  const stylesContent = `
.memo-page-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.component-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.custom-divider {
  border: 0;
  height: 1px;
  background: #e0e0e0; /* 灰色分割线 */
  margin: 20px 0;
}

.markdown-section {
  margin-bottom: 20px;
}

.markdown-content pre {
  background-color: #2d2d2d; /* 黑色背景 */
  color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  overflow: auto;
}

.markdown-content code {
  background-color: #2d2d2d;
  color: #ffffff;
}

.demo-section {
  margin-top: 20px;
}
  `;

  if (!fs.existsSync(path.dirname(stylesFilePath))) {
    fs.mkdirSync(path.dirname(stylesFilePath), { recursive: true });
  }

  fs.writeFileSync(stylesFilePath, stylesContent.trim());
  console.log('------------------------------------------------------------');

  console.log(`styles.scss 已经创建，请查看：${stylesFilePath}`);
}

export default createStylesFile;
