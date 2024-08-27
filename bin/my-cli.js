#!/usr/bin/env node

import { program } from 'commander';
import generatePages from '../lib/generatePages.js';
import createDirectory from '../lib/createDirectory.js';
import copyBaseFiles from '../lib/copyBaseFiles.js';
import createAppFile from '../lib/createAppFile.js';
import createMainFile from '../lib/createMainFile.js';
import createHtmlFile from '../lib/createHtmlFile.js';
import createViteConfig from '../lib/createViteConfig.js';
import createStylesFile from '../lib/createStylesFile.js';
import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';

program.version('1.0.0').description('Custom front-end scaffolding tool');

program
  .command('init')
  .description('Initialize the project')
  .action(() => {
    console.log(chalk.green('项目初始化...'));

    // 创建 components-page 目录
    createDirectory('components-page');

    // 复制 package.json 、 全局 scss 文件到 components-page 目录下
    copyBaseFiles();

    // 生成组件对应的页面文件
    generatePages();

    // 创建 App.jsx 文件
    createAppFile();

    // 创建 index.js 文件
    createMainFile();

    // 创建或更新 index.html 文件
    createHtmlFile();

    // 创建 vite.config.js 文件
    createViteConfig();

    // 创建 styles.scss 文件
    createStylesFile();

    console.log(chalk.green('项目初始化完成!'));
  });

program
  .command('dev')
  .description('Start local development server')
  .action(() => {
    console.log(chalk.green('启动local development server...'));

    const projectPath = path.join(process.cwd(), 'components-page');

    try {
      execSync('yarn install', { stdio: 'inherit', cwd: projectPath });
    } catch (error) {
      console.error(chalk.red('依赖安装失败!'));
      console.error(error.message);
      return;
    }

    try {
      execSync('yarn dev', { stdio: 'inherit', cwd: projectPath });
    } catch (error) {
      console.error(chalk.red('server 启动失败!'));
      console.error(error.message);
    }
  });

program
  .command('build')
  .description('Build the project')
  .action(() => {
    console.log(chalk.green('构建项目...'));
    const projectPath = path.join(process.cwd(), 'components-page');
    try {
      // 执行 Vite 打包命令
      execSync('yarn build', { stdio: 'inherit', cwd: projectPath });
      console.log(chalk.green('构建完成!'));
    } catch (error) {
      console.error(chalk.red('构建失败!'));
      console.error(error.message);
    }
  });

program.parse(process.argv);
