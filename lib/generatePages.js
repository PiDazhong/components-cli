import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function createIndexFile() {
  const pagesDir = path.join(process.cwd(), 'components-page', 'src', 'pages');
  const indexPath = path.join(pagesDir, 'index.js');
  console.log('------------------------------------------------------------');

  console.log(`根文件 index.jsx 已创建，请查看：${indexPath}`);

  const componentDirs = fs
    .readdirSync(pagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let indexContent = '';

  componentDirs.forEach((componentName) => {
    const demoPagePath = path.join(pagesDir, componentName, 'demoPage.jsx');
    if (fs.existsSync(demoPagePath)) {
      indexContent += `export { default as ${componentName} } from './${componentName}/demoPage.jsx';\n`;
    }
  });

  if (indexContent) {
    fs.writeFileSync(indexPath, indexContent.trim());
    console.log(`index.jsx 成功创建 并 导出`);
  } else {
    console.log('没有找到 demoPage.jsx 文件，无法导出。');
  }
}

function generatePages() {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const outputDir = path.join(process.cwd(), 'components-page', 'src', 'pages');

  console.log('------------------------------------------------------------');
  console.log(`公共组件目录位置：${componentsDir}`);
  console.log(`输出的目录位置：${componentsDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`文件夹 ${outputDir} 创建成功。`);
  }

  if (!fs.existsSync(componentsDir)) {
    console.error('Error: 没有找到 src/components 目录。');
    return;
  }

  const components = fs.readdirSync(componentsDir);
  if (components.length === 0) {
    console.error('Error: 没有找到 src/components 目录下的组件.');
    return;
  }

  components.forEach((componentName) => {
    const componentPath = path.join(componentsDir, componentName);

    // 查找 demo 和 define 和 index 文件
    const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

    const demoFilePath = fileExtensions
      .map((ext) => path.join(componentPath, `demo${ext}`))
      .find((filePath) => fs.existsSync(filePath));

    const defineFilePath = fileExtensions
      .map((ext) => path.join(componentPath, `define${ext}`))
      .find((filePath) => fs.existsSync(filePath));

    const indexFilePath = fileExtensions
      .map((ext) => path.join(componentPath, `index${ext}`))
      .find((filePath) => fs.existsSync(filePath));

    if (demoFilePath && defineFilePath) {
      const componentOutputDir = path.join(outputDir, componentName);
      copyDirectory(componentPath, componentOutputDir);

      // 读取 index 文件内容
      const indexContent = fs.readFileSync(indexFilePath, 'utf-8');
      // 提取 @des 后面的内容作为 description
      const descriptionMatch = indexContent.match(/@des\s+(.*)/);
      const description = descriptionMatch ? descriptionMatch[1] : '无 des';

      // 读取 define 和 demo 文件内容
      const defineContent = fs.readFileSync(defineFilePath, 'utf-8');
      const demoImportPath = `./${path.basename(demoFilePath)}`;

      // 使用正确的模板字符串处理 Markdown 内容
      const defineMarkdown = `\`\`\`js\n${defineContent}\n\`\`\``;

      // 生成 demoPage.jsx 的内容
      const pageContent = `
import React from 'react';
import DemoComponent from '${demoImportPath}';
import ReactMarkdown from 'react-markdown';
import '/styles.scss';

export default function demoPage() {
  const markdown = ${JSON.stringify(defineMarkdown)};

  return (
    <div className="memo-page-container">
      <h1 className="component-title">${componentName}</h1>
      <p className="component-description">${description}</p> 
      <hr className="custom-divider" />
      <section className="markdown-section">
        <h2>组件参数定义</h2>
        <ReactMarkdown className="markdown-content">{markdown}</ReactMarkdown>
      </section>
      <hr className="custom-divider" />
      <section className="demo-section">
        <h2>组件预览</h2>
        <DemoComponent />
      </section>
    </div>
  );
}
      `;

      // 在组件目录下生成 demoPage.jsx 文件
      const pageOutputPath = path.join(componentOutputDir, 'demoPage.jsx');
      fs.writeFileSync(pageOutputPath, pageContent.trim());
      console.log(
        `组件 ${componentName} 已复制到 ${componentOutputDir}，且 demoPage.jsx 已生成。\n`,
      );
    } else {
      if (!demoFilePath || !defineFilePath) {
        console.log(
          `跳过了 ${componentName}，因为没有找到 demo 或 define 文件。\n`,
        );
      }
    }
  });

  createIndexFile();
}

export default generatePages;
