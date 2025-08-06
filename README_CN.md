# Minecraft Easy Server 前端项目

**[English Version](README.md)**

基于 Vue 3 和 Element Plus 构建的 Minecraft Easy Server 现代化 Web 管理面板。

## 🚀 功能特性

- **服务器控制** - 启动、停止、重启 Minecraft 服务器
- **性能监控** - 实时 CPU 和内存使用率监控
- **服务器配置** - 可视化配置编辑器
- **玩家管理** - 白名单和权限管理
- **世界管理** - 上传和切换世界文件（.zip/.mcworld）
- **资源包管理** - 上传和管理资源包（.zip/.mcpack）
- **命令控制台** - 执行命令并保存历史记录
- **日志查看器** - 实时服务器日志
- **多语言支持** - 中英文界面

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - Vue 3 UI 组件库
- **Vue Router 4** - Vue.js 官方路由器
- **Vue I18n** - 国际化支持
- **ECharts** - 图表和数据可视化
- **Axios** - API 请求的 HTTP 客户端
- **Webpack 5** - 模块打包器
- **Sass** - CSS 预处理器

## 🚀 快速开始

### 前置要求

- Node.js 16+ 和 npm
- 现代 Web 浏览器

### 安装

```bash
# 克隆仓库
git clone https://github.com/ckfanzhe/bedrock-easy-server.git
cd minecraft-easy-server/minecraft-easyserver-web

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 访问 http://localhost:3001
```

### 生产构建

```bash
# 构建生产版本
npm run build
# 输出到 dist/ 目录
```

## 🔧 配置

### API 代理

开发服务器将 API 请求代理到后端：

```javascript
// webpack.config.js - API 代理到 localhost:8080
devServer: {
  proxy: [{
    context: ['/api'],
    target: 'http://localhost:8080',
    changeOrigin: true
  }]
}
```

## 🧪 开发

### Vue 3 特性
- Composition API 用于组件逻辑
- Vue Router 4 用于导航
- Vue I18n 用于国际化
- Element Plus 组件

### 代码风格
- SCSS 用于样式
- ESLint 用于代码质量
- 作用域组件样式
- 响应式设计

## 🌐 国际化

支持中英文动态语言切换：

```javascript
// 所有翻译在 src/i18n/index.js 中
const messages = {
  zh: { /* 中文翻译 */ },
  en: { /* 英文翻译 */ }
}

// 在组件中使用
const { t } = useI18n()
// 模板中：{{ $t('nav.title') }}
// 脚本中：t('common.save')
```

## 📦 构建和部署

### 构建输出
- `dist/index.html` - 主 HTML 文件
- `dist/bundle.js` - 打包的 JavaScript
- 针对生产环境优化的静态资源

### 部署
1. **静态托管** - 将 `dist/` 部署到任何 Web 服务器
2. **嵌入式** - 文件嵌入到 Go 二进制文件中实现单文件可执行

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 进行更改并测试
4. 提交 Pull Request

### 标准
- 遵循 Vue.js 风格指南
- 使用 ESLint 进行代码质量检查
- 在多个浏览器上测试
- 保持响应式设计

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](../LICENSE) 文件。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化
- [Vue I18n](https://vue-i18n.intlify.dev/) - 国际化
- [Webpack](https://webpack.js.org/) - 模块打包器