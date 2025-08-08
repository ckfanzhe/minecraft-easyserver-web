# Minecraft Easy Server Frontend

**[中文版本](README_CN.md)**

A modern web management panel for Minecraft Easy Server built with Vue 3 and Element Plus.

## 🚀 Features

- **Server Control** - Start, stop, restart Minecraft server
- **Performance Monitoring** - Real-time CPU and memory usage
- **Server Configuration** - Visual configuration editor
- **Player Management** - Allowlist and permission management
- **World Management** - Upload and switch worlds (.zip/.mcworld)
- **Resource Packs** - Upload and manage resource packs (.zip/.mcpack)
- **Command Console** - Execute commands with history
- **Log Viewer** - Real-time server logs
- **Authentication** - Secure login system with session management
- **Multi-language** - Chinese and English support

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Element Plus** - Vue 3 UI component library
- **Vue Router 4** - Official router for Vue.js
- **Vue I18n** - Internationalization support
- **ECharts** - Charts and data visualization
- **Axios** - HTTP client for API requests
- **Webpack 5** - Module bundler
- **Sass** - CSS preprocessor


## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
# Clone repository
git clone https://github.com/ckfanzhe/bedrock-easy-server.git
cd minecraft-easy-server/minecraft-easyserver-web

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
# Access at http://localhost:3001
```

### Production Build

```bash
# Build for production
npm run build
# Output in dist/ directory
```

## 🔧 Configuration

### API Proxy

Development server proxies API requests to backend:

```javascript
// webpack.config.js - API proxy to localhost:8080
devServer: {
  proxy: [{
    context: ['/api'],
    target: 'http://localhost:8080',
    changeOrigin: true
  }]
}
```

## 🧪 Development

### Vue 3 Features
- Composition API for component logic
- Vue Router 4 for navigation
- Vue I18n for internationalization
- Element Plus components

### Code Style
- SCSS for styling
- ESLint for code quality
- Scoped component styles
- Responsive design

## 🌐 Internationalization

Supports Chinese and English with dynamic language switching:

```javascript
// All translations in src/i18n/index.js
const messages = {
  zh: { /* Chinese translations */ },
  en: { /* English translations */ }
}

// Usage in components
const { t } = useI18n()
// Template: {{ $t('nav.title') }}
// Script: t('common.save')
```

## 📦 Build & Deployment

### Build Output
- `dist/index.html` - Main HTML file
- `dist/bundle.js` - Bundled JavaScript
- Static assets optimized for production

### Deployment
1. **Static hosting** - Deploy `dist/` to any web server
2. **Embedded** - Files embedded in Go binary for single executable

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Submit Pull Request

### Standards
- Follow Vue.js style guide
- Use ESLint for code quality
- Test in multiple browsers
- Maintain responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [ECharts](https://echarts.apache.org/) - Data visualization
- [Vue I18n](https://vue-i18n.intlify.dev/) - Internationalization
- [Webpack](https://webpack.js.org/) - Module bundler