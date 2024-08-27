import fs from 'fs';
import path from 'path';

function createAppFile() {
  const appFilePath = path.join(
    process.cwd(),
    'components-page',
    'src',
    'App.jsx',
  );
  const pagesIndexPath = path.join(
    process.cwd(),
    'components-page',
    'src',
    'pages',
    'index.js',
  );

  let menuItems = [];
  let routes = [];

  if (fs.existsSync(pagesIndexPath)) {
    const indexContent = fs.readFileSync(pagesIndexPath, 'utf-8');
    const exportMatches = indexContent.match(
      /export\s\{[^\}]+\}\sfrom\s'\.\/([^/]+)\/demoPage\.jsx';/g,
    );

    if (exportMatches) {
      exportMatches.forEach((match) => {
        const componentName = match.match(
          /from\s'\.\/([^/]+)\/demoPage\.jsx';/,
        )[1];
        const routePath = `/${componentName}`;
        menuItems.push({
          key: componentName,
          label: componentName,
        });
        routes.push(`
          <Route path="${routePath}" element={<${componentName} />} />
        `);
      });
    }
  }

  const appContent = `
import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  ${menuItems.map((item) => `${item.key}`).join(',\n  ')}
} from './pages';

const { Header, Sider, Content } = Layout;

export default function App() {
  const items = [
    ${menuItems
      .map(
        (item) => `
    {
      key: '${item.key}',
      label: <Link to="/${item.key}">${item.label}</Link>,
    }`,
      )
      .join(',\n    ')}
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          />
        </Sider>
        <Layout className="main-layout-background">
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Routes>
              ${routes.join('\n              ')}
              <Route
                path="/"
                element={<div style={{ padding: 24, background: '#fff' }}>请选择左侧组件查看详情</div>}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
  `;

  if (!fs.existsSync(path.dirname(appFilePath))) {
    fs.mkdirSync(path.dirname(appFilePath), { recursive: true });
  }

  fs.writeFileSync(appFilePath, appContent.trim());
  console.log('------------------------------------------------------------');

  console.log(`App.jsx 和 路由 已创建，请查看：${appFilePath}`);
}

export default createAppFile;
