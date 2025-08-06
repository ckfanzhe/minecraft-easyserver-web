# Minecraft Easy Server Frontend

**[中文版本 (Chinese Version)](README_CN.md)**

A modern, responsive web frontend for Minecraft Easy Server management panel, built with Vue 3, Element Plus, and modern web technologies.

## 🚀 Features

### 🎮 Server Management
- **Real-time Server Control** - Start, stop, and restart Minecraft servers with one click
- **Server Status Monitoring** - Live server status updates and resource monitoring
- **Multi-version Support** - Download and switch between different Minecraft server versions

### ⚙️ Configuration Management
- **Visual Configuration Editor** - Easy-to-use interface for server settings
- **Real-time Validation** - Instant feedback on configuration changes
- **Backup & Restore** - Save and restore server configurations

### 👥 Player Management
- **Whitelist Management** - Add/remove players from server whitelist
- **Permission System** - Manage player permissions (Visitor/Member/Operator)
- **Player Activity** - Monitor player connections and activity

### 🌍 World Management
- **World Upload** - Support for .zip and .mcworld file uploads
- **World Switching** - One-click world activation
- **World Backup** - Automated world backup and restore

### 🎨 Resource Pack Management
- **Resource Pack Upload** - Support for .zip and .mcpack formats
- **Pack Activation** - Easy resource pack management
- **Preview Support** - Visual preview of resource packs

### 💻 Command Console
- **Real-time Command Execution** - Execute server commands directly
- **Command History** - Access to previous commands
- **Quick Commands** - Predefined command shortcuts

### 📊 Monitoring & Logs
- **Real-time Logs** - Live server log streaming
- **Performance Metrics** - Server performance monitoring
- **Log Filtering** - Advanced log search and filtering

### 🌐 Internationalization
- **Multi-language Support** - English and Chinese interfaces
- **Dynamic Language Switching** - Change language without page reload

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Element Plus** - Vue 3 component library for modern UI
- **Vue Router 4** - Official router for Vue.js
- **Axios** - Promise-based HTTP client
- **Vue I18n** - Internationalization plugin
- **ECharts** - Data visualization library
- **Webpack 5** - Module bundler and build tool
- **Sass** - CSS preprocessor

## 📁 Project Structure

```
minecraft-easyserver-web/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── api/                    # API service layer
│   │   ├── index.js           # API client configuration
│   │   ├── server.js          # Server management APIs
│   │   ├── config.js          # Configuration APIs
│   │   ├── player.js          # Player management APIs
│   │   ├── world.js           # World management APIs
│   │   └── logs.js            # Logging APIs
│   ├── components/             # Reusable components
│   │   ├── common/            # Common UI components
│   │   ├── charts/            # Chart components
│   │   └── forms/             # Form components
│   ├── views/                  # Page components
│   │   ├── Dashboard.vue      # Main dashboard
│   │   ├── ServerManagement.vue # Server control panel
│   │   ├── Configuration.vue   # Server configuration
│   │   ├── PlayerManagement.vue # Player management
│   │   ├── WorldManagement.vue # World management
│   │   ├── ResourcePacks.vue   # Resource pack management
│   │   ├── CommandConsole.vue  # Command execution
│   │   ├── LogViewer.vue      # Log monitoring
│   │   └── Performance.vue    # Performance monitoring
│   ├── router/
│   │   └── index.js           # Route configuration
│   ├── stores/                # State management
│   │   ├── server.js          # Server state
│   │   ├── config.js          # Configuration state
│   │   └── user.js            # User preferences
│   ├── i18n/                  # Internationalization
│   │   ├── index.js           # i18n configuration
│   │   ├── en.js              # English translations
│   │   └── zh.js              # Chinese translations
│   ├── styles/                # Global styles
│   │   ├── global.scss        # Global styles
│   │   ├── variables.scss     # SCSS variables
│   │   └── mixins.scss        # SCSS mixins
│   ├── utils/                 # Utility functions
│   │   ├── request.js         # HTTP request utilities
│   │   ├── validation.js      # Form validation
│   │   └── helpers.js         # Helper functions
│   ├── App.vue                # Root component
│   └── main.js                # Application entry point
├── package.json               # Project dependencies
├── webpack.config.js          # Webpack configuration
├── .babelrc                   # Babel configuration
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ckfanzhe/bedrock-easy-server.git
   cd minecraft-easy-server/minecraft-easyserver-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Open browser and visit: `http://localhost:3001`
   - The dev server includes hot reload for instant updates

### Production Build

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Output**:
   - Built files will be generated in the `dist/` directory
   - Files are optimized and minified for production use

## 🔧 Configuration

### API Proxy

The development server is configured to proxy API requests to the backend:

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

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# API Base URL (for production)
VUE_APP_API_BASE_URL=http://your-server:8080

# Default Language
VUE_APP_DEFAULT_LANG=en

# Debug Mode
VUE_APP_DEBUG=false
```

## 🎨 Styling Guidelines

### SCSS Structure
- Use SCSS for all styling
- Follow BEM naming convention
- Utilize Element Plus theme variables
- Implement responsive design patterns

### Component Styling
```vue
<style lang="scss" scoped>
.component-name {
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
</style>
```

## 🧪 Development Guidelines

### Vue 3 Best Practices
- Use Composition API for complex logic
- Implement proper component lifecycle
- Follow Vue 3 reactivity patterns
- Use TypeScript for better type safety (optional)

### Code Style
- Use ESLint for code linting
- Follow Vue.js style guide
- Implement proper error handling
- Add comprehensive comments

### Component Development
```vue
<template>
  <!-- Template content -->
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ComponentName',
  setup() {
    const { t } = useI18n()
    
    // Component logic
    
    return {
      // Exposed properties
    }
  }
}
</script>

<style lang="scss" scoped>
// Component styles
</style>
```

## 🌐 Internationalization

The frontend supports multiple languages:

### Adding New Languages

1. Create language file in `src/i18n/`:
   ```javascript
   // src/i18n/es.js
   export default {
     common: {
       save: 'Guardar',
       cancel: 'Cancelar'
     }
   }
   ```

2. Register in i18n configuration:
   ```javascript
   // src/i18n/index.js
   import es from './es'
   
   const messages = {
     en,
     zh,
     es
   }
   ```

### Using Translations
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

## 📦 Build and Deployment

### Production Build
The build process creates optimized files for production:

```bash
npm run build
```

### Build Output
- `dist/index.html` - Main HTML file
- `dist/bundle.js` - Bundled JavaScript
- `dist/images/` - Optimized images

### Deployment Options

1. **Static File Server**: Deploy `dist/` contents to any web server
2. **CDN**: Upload to CDN for global distribution
3. **Embedded**: Files are embedded in Go binary for single-file deployment

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -am 'Add new feature'`
5. Push branch: `git push origin feature/new-feature`
6. Create Pull Request

### Code Standards

- Follow Vue.js style guide
- Use ESLint for code quality
- Implement responsive design
- Add proper documentation
- Test on multiple browsers

### Testing

- Test all features thoroughly
- Verify responsive design
- Check browser compatibility
- Validate accessibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [ECharts](https://echarts.apache.org/) - Data visualization
- [Vue I18n](https://vue-i18n.intlify.dev/) - Internationalization
- [Webpack](https://webpack.js.org/) - Module bundler