import fs from 'fs';
import path from 'path';

function createMainFile() {
  const indexFilePath = path.join(
    process.cwd(),
    'components-page',
    'src',
    'main.jsx',
  );

  const indexContent = `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './_global.scss';
import './_overhide.scss';

ReactDOM.render(<App />, document.getElementById('root'));
  `;

  if (!fs.existsSync(path.dirname(indexFilePath))) {
    fs.mkdirSync(path.dirname(indexFilePath), { recursive: true });
  }

  fs.writeFileSync(indexFilePath, indexContent.trim());
  console.log('------------------------------------------------------------');

  console.log(`main.jsx 已经创建，请查看：${indexFilePath}`);
}

export default createMainFile;
