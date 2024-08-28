import fs from 'fs';
import path from 'path';

function getComponentDescription(componentName) {
  const pageDir = path.join(
    process.cwd(),
    'components-page',
    'src',
    'pages',
    componentName,
  );

  const fileExtensions = ['.jsx'];

  const indexFilePath = fileExtensions
    .map((ext) => path.join(pageDir, `index${ext}`))
    .find((filePath) => fs.existsSync(filePath));

  // 读取 index 文件内容
  const indexContent = fs.readFileSync(indexFilePath, 'utf-8');
  // 提取 @des-url 后面的内容作为 description
  const urlMatch = indexContent.match(/@des-url\s+(.*)/);
  const iconurl = urlMatch ? urlMatch[1] : '';
  // 提取 @des 后面的内容作为 description
  const desMatch = indexContent.match(/@des\s+(.*)/);
  const des = desMatch ? desMatch[1] : '';
  console.log('des', des);
  return {
    iconurl,
    des,
  };
}

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
        const { iconurl, des } = getComponentDescription(componentName);
        menuItems.push({
          key: componentName,
          label: componentName,
          iconurl,
          des,
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

const TotalPage = ({ menus }) => {

  return (
    <div className="total-page">
      {menus.map((item) => {
        const { key, label, iconurl, des } = item;
        return (
          <div key={key} className="total-page-item">
            <div className="total-page-item-title">
              <div className="total-page-item-title-label">{label}</div>
              <div className="total-page-item-title-des">{des}</div>
            </div>
            <div className="total-page-item-content">
              {iconurl ? (
                <img
                  src={iconurl}
                  width="100%"
                  height="100%"
                />
              ) : (
                <div>暂无图标</div> 
              )}
            </div>
          </div>
        )  
      })}
    </div>
  )
}

export default function App() {
  const items = [
    ${menuItems
      .map(
        (item) => `
    {
      key: '${item.key}',
      label: <Link to="/${item.key}">${item.label}</Link>,
      iconurl: '${item.iconurl}',
      des: '${item.des}',
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
            items={[
              {
                key: 'home',
                label: <Link to="/">首页</Link>,
              },
              ...items,
            ]}
          />
        </Sider>
        <Layout className="main-layout-background">
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Routes>
              ${routes.join('\n              ')}
              <Route
                path="/"
                element={<TotalPage menus={items} />}
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
