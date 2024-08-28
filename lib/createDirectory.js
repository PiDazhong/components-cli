import fs from 'fs';
import path from 'path';

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // 递归删除文件夹
        deleteFolderRecursive(curPath);
      } else {
        // 删除文件
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

function createDirectory(directoryName) {
  const directoryPath = path.join(process.cwd(), directoryName);
  console.log('------------------------------------------------------------');

  if (fs.existsSync(directoryPath)) {
    console.log(`目录 ${directoryName} 已存在，正在清理...`);

    // 需要删除的目录
    const deleteDir = [
      path.join(directoryPath, 'src'),
      path.join(directoryPath, 'components-page'),
    ];

    for (const dir of deleteDir) {
      if (fs.existsSync(dir)) {
        deleteFolderRecursive(dir);
        console.log(`删除目录：${dir}`);
      }
    }

    // 需要删除的文件
    const deleteFiles = [
      path.join(directoryPath, 'index.html'),
      path.join(directoryPath, 'package.json'),
      path.join(directoryPath, 'vite.config.js'),
      path.join(directoryPath, 'components-page.zip'),
    ];

    for (const file of deleteFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`删除文件：${file}`);
      }
    }
  } else {
    fs.mkdirSync(directoryPath);
    console.log(`创建目录：${directoryPath}`);
  }
}

export default createDirectory;
