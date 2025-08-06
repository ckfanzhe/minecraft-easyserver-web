# Minecraft Easy Server 前端项目

**[English Version](README.md)**

这是 Minecraft Easy Server 的现代化前端项目，使用 Vue 3、Element Plus 和现代 Web 技术构建的响应式管理面板。

## 🚀 功能特性

### 🎮 服务器管理
- **实时服务器控制** - 一键启动、停止和重启 Minecraft 服务器
- **服务器状态监控** - 实时服务器状态更新和资源监控
- **多版本支持** - 下载和切换不同的 Minecraft 服务器版本

### ⚙️ 配置管理
- **可视化配置编辑器** - 易于使用的服务器设置界面
- **实时验证** - 配置更改的即时反馈
- **备份与恢复** - 保存和恢复服务器配置

### 👥 玩家管理
- **白名单管理** - 添加/删除服务器白名单中的玩家
- **权限系统** - 管理玩家权限（访客/成员/管理员）
- **玩家活动** - 监控玩家连接和活动

### 🌍 世界管理
- **世界上传** - 支持 .zip 和 .mcworld 文件上传
- **世界切换** - 一键激活世界
- **世界备份** - 自动世界备份和恢复

### 🎨 资源包管理
- **资源包上传** - 支持 .zip 和 .mcpack 格式
- **包激活** - 简易资源包管理
- **预览支持** - 资源包的可视化预览

### 💻 命令控制台
- **实时命令执行** - 直接执行服务器命令
- **命令历史** - 访问之前的命令
- **快捷命令** - 预定义的命令快捷方式

### 📊 监控与日志
- **实时日志** - 实时服务器日志流
- **性能指标** - 服务器性能监控
- **日志过滤** - 高级日志搜索和过滤

### 🌐 国际化
- **多语言支持** - 中英文界面
- **动态语言切换** - 无需页面重载即可更改语言

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架，使用 Composition API
- **Element Plus** - Vue 3 现代 UI 组件库
- **Vue Router 4** - Vue.js 官方路由器
- **Axios** - 基于 Promise 的 HTTP 客户端
- **Vue I18n** - 国际化插件
- **ECharts** - 数据可视化库
- **Webpack 5** - 模块打包器和构建工具
- **Sass** - CSS 预处理器

## 🚀 快速开始

### 前置要求

- Node.js 16+ 和 npm
- 现代 Web 浏览器（Chrome、Firefox、Safari、Edge）

### 安装

1. **克隆仓库**：
   ```bash
   git clone https://github.com/ckfanzhe/bedrock-easy-server.git
   cd minecraft-easy-server/minecraft-easyserver-web
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```

### 开发

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问应用程序**：
   - 打开浏览器访问：`http://localhost:3001`
   - 开发服务器包含热重载功能，可即时更新

### 生产构建

1. **构建生产版本**：
   ```bash
   npm run build
   ```

2. **输出**：
   - 构建文件将在 `dist/` 目录中生成
   - 文件已针对生产使用进行优化和压缩

## 🔧 配置

### API 代理

开发服务器配置为将 API 请求代理到后端：

```javascript
// webpack.config.js
devServer: {
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  ]
}
```

### 环境变量

创建 `.env` 文件进行环境特定配置：

```env
# API 基础 URL（用于生产环境）
VUE_APP_API_BASE_URL=http://your-server:8080

# 默认语言
VUE_APP_DEFAULT_LANG=zh

# 调试模式
VUE_APP_DEBUG=false
```

## 🎨 样式指南

### SCSS 结构
- 所有样式使用 SCSS
- 遵循 BEM 命名约定
- 利用 Element Plus 主题变量
- 实现响应式设计模式

### 组件样式
```vue
<style lang="scss" scoped>
.component-name {
  &__element {
    // 元素样式
  }
  
  &--modifier {
    // 修饰符样式
  }
}
</style>
```

## 🧪 开发指南

### Vue 3 最佳实践
- 对复杂逻辑使用 Composition API
- 实现适当的组件生命周期
- 遵循 Vue 3 响应式模式
- 使用 TypeScript 获得更好的类型安全（可选）

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循 Vue.js 风格指南
- 实现适当的错误处理
- 添加全面的注释

### 组件开发
```vue
<template>
  <!-- 模板内容 -->
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ComponentName',
  setup() {
    const { t } = useI18n()
    
    // 组件逻辑
    
    return {
      // 暴露的属性
    }
  }
}
</script>

<style lang="scss" scoped>
// 组件样式
</style>
```

## 🌐 国际化

前端支持多种语言：

### 添加新语言

1. 在 `src/i18n/` 中创建语言文件：
   ```javascript
   // src/i18n/es.js
   export default {
     common: {
       save: 'Guardar',
       cancel: 'Cancelar'
     }
   }
   ```

2. 在 i18n 配置中注册：
   ```javascript
   // src/i18n/index.js
   import es from './es'
   
   const messages = {
     en,
     zh,
     es
   }
   ```

### 使用翻译
```vue
<template>
  <div>{{ $t('common.save') }}</div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t } = useI18n()
    
    return {
      getMessage: () => t('common.message')
    }
  }
}
</script>
```

## 📦 构建和部署

### 生产构建
构建过程为生产环境创建优化文件：

```bash
npm run build
```

### 构建输出
- `dist/index.html` - 主 HTML 文件
- `dist/bundle.js` - 打包的 JavaScript
- `dist/images/` - 优化的图片

### 部署选项

1. **静态文件服务器**：将 `dist/` 内容部署到任何 Web 服务器
2. **CDN**：上传到 CDN 进行全球分发
3. **嵌入式**：文件嵌入到 Go 二进制文件中进行单文件部署

## 🤝 贡献

### 开发工作流程

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 进行更改并彻底测试
4. 提交更改：`git commit -am 'Add new feature'`
5. 推送分支：`git push origin feature/new-feature`
6. 创建 Pull Request

### 代码标准

- 遵循 Vue.js 风格指南
- 使用 ESLint 进行代码质量检查
- 实现响应式设计
- 添加适当的文档
- 在多个浏览器上测试

### 测试

- 彻底测试所有功能
- 验证响应式设计
- 检查浏览器兼容性
- 验证可访问性

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](../LICENSE) 文件。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化
- [Vue I18n](https://vue-i18n.intlify.dev/) - 国际化
- [Webpack](https://webpack.js.org/) - 模块打包器