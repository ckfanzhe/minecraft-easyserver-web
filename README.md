# Minecraft Easy Server Frontend

这是 Minecraft Easy Server 的现代化前端项目，使用 Vue 3 + Webpack + Element Plus 构建。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Element Plus** - 基于 Vue 3 的组件库
- **Axios** - HTTP 客户端
- **Webpack 5** - 模块打包器
- **Sass** - CSS 预处理器

## 项目结构

```
frontend/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── api/
│   │   └── index.js        # API 接口封装
│   ├── router/
│   │   └── index.js        # 路由配置
│   ├── styles/
│   │   └── global.scss     # 全局样式
│   ├── views/              # 页面组件
│   │   ├── Home.vue
│   │   ├── ServerManagement.vue
│   │   ├── ServerConfig.vue
│   │   ├── PlayerManagement.vue
│   │   ├── WorldManagement.vue
│   │   ├── CommandConsole.vue
│   │   ├── LogViewer.vue
│   │   └── PerformanceMonitor.vue
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json            # 项目配置
├── webpack.config.js       # Webpack 配置
└── README.md              # 项目说明
```

## 功能模块

### 已实现的基础功能

1. **首页 (Home)**
   - 服务器状态概览
   - 快速操作按钮
   - 最近日志显示
   - 系统信息展示

2. **导航系统**
   - 侧边栏导航
   - 路由管理
   - 页面标题动态更新

3. **API 集成**
   - 完整的后端 API 封装
   - 请求/响应拦截器
   - 错误处理

### 待开发的功能模块

- 服务器管理 (启动/停止/重启)
- 服务器配置编辑
- 玩家管理 (白名单/权限)
- 世界管理 (上传/切换/备份)
- 命令控制台 (实时命令执行)
- 日志查看 (实时日志/过滤)
- 性能监控 (图表展示)

## 安装和运行

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

构建文件将生成在 `dist/` 目录中。

## 开发说明

### API 代理配置

开发服务器已配置代理，所有 `/api` 请求将转发到后端服务器 `http://localhost:8080`。

### 样式规范

- 使用 Sass 预处理器
- 遵循 BEM 命名规范
- 响应式设计支持
- Element Plus 主题定制

### 组件开发

- 使用 Vue 3 Composition API
- 组件按功能模块划分
- 统一的错误处理和加载状态

## 部署说明

1. 执行生产构建
2. 将 `dist/` 目录内容部署到 Web 服务器
3. 配置反向代理将 `/api` 请求转发到后端服务

## 贡献指南

1. 遵循现有的代码风格
2. 添加适当的注释
3. 确保响应式设计
4. 测试新功能的兼容性

## 许可证

MIT License