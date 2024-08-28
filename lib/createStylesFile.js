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
body {
  margin: 0;
}

.site-layout-background .ant-menu {
  background: #f5f5f5;
  padding-top: 30px;
}

.main-layout-background {
  background: #fff;
}

.memo-page-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.total-page {
  display: block;

  .total-page-item {
    display: inline-flex;
    flex-direction: column;
    margin: 0 20px 20px 20px;
    width: calc(33% - 40px);
    height: 270px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    text-align: center;
    line-height: 200px;

    .total-page-item-title {
      height: 48px;
      line-height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .total-page-item-title-label {
        font-size: 16px;
        margin: 0 16px
      }

      .total-page-item-title-des {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        -webkit-line-clamp: 1;
        line-height: inherit;
        display: -webkit-box;
        overflow: hidden;
        white-space: pre-wrap;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }
    }

    .total-page-item-content {
      width: 100%;
      flex: 1;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;

      img {
        width: 100%;
        height: auto;
        position: relative;
      }
    }
  }
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
