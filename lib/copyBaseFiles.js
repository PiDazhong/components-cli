import fs from 'fs';
import path from 'path';

function copyBaseFiles() {
  const sourcePath = path.join(process.cwd(), 'package.json');
  const destinationPath = path.join(
    process.cwd(),
    'components-page',
    'package.json',
  );

  console.log('------------------------------------------------------------');

  const packageJson = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

  // 添加所需的依赖 react-markdown
  packageJson.dependencies = packageJson.dependencies || {};

  if (!packageJson.dependencies['react-markdown']) {
    packageJson.dependencies['react-markdown'] = '^8.0.0';
    console.log('添加 react-markdown 依赖');
  }

  if (!packageJson.dependencies['antd']) {
    packageJson.dependencies['antd'] = '^5.0.0';
    console.log('添加 antd 依赖');
  }

  // 添加开发依赖
  packageJson.devDependencies = packageJson.devDependencies || {};

  if (!packageJson.devDependencies['vite']) {
    packageJson.devDependencies['vite'] = '^4.0.0';
    console.log('添加 vite 依赖');
  }

  // 覆盖默认的启动和构建脚本
  packageJson.scripts = {
    ...packageJson.scripts,
    dev: 'vite',
    build: 'vite build',
  };

  // 写入更新后的 package.json 文件
  fs.writeFileSync(destinationPath, JSON.stringify(packageJson, null, 2));
  console.log('复制和更新 package.json 到 components-page 目录下');

  // 复制额外的 SCSS 文件
  const extraFiles = ['_overhide.scss', '_global.scss'];
  const srcDir = path.join(process.cwd(), 'src');
  const destDir = path.join(process.cwd(), 'components-page', 'src');

  extraFiles.forEach((file) => {
    const sourceFilePath = path.join(srcDir, file);
    const destinationFilePath = path.join(destDir, file);

    if (fs.existsSync(sourceFilePath)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(sourceFilePath, destinationFilePath);
      console.log(`复制 ${file} 到 components-page/src 目录下`);
    } else {
      console.warn(`${file} 不存在`);
    }
  });
}

export default copyBaseFiles;
