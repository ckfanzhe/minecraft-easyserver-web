import { createI18n } from 'vue-i18n'

// 翻译资源
const messages = {
  zh: {
    // Navigation
    nav: {
      title: 'Minecraft 控制面板',
      status: '状态：',
      statusOffline: '离线',
      statusOnline: '在线',
      statusUnknown: '未知',
      statusRunning: '运行中',
      statusStopped: '已停止',
      statusStarting: '启动中',
      statusStopping: '停止中',
      statusRestarting: '重启中',
      menu: {
        dashboard: '仪表板',
        server: '服务器',
        management: '管理',
        serverControl: '服务器控制',
        serverConfig: '服务器配置',
        allowlist: '白名单管理',
        permission: '权限管理',
        world: '世界管理',
        resourcepack: '资源包管理',
        versions: '版本管理',
        tools: '服务器工具',
        logs: '服务器日志',
        interaction: '命令交互与日志',
        commands: '快捷命令'
      },
      buttons: {
        start: '启动服务器',
        stop: '停止服务器',
        restart: '重启服务器',
        toggle: '启动/停止'
      }
    },
    
    // Dashboard
    dashboard: {
      title: '仪表板',
      recentActivity: {
        title: '最近活动',
        empty: '暂无活动记录'
      },
      performance: {
        title: '性能监控',
        system: '系统性能',
        bedrock: 'Bedrock进程',
        cpu: 'CPU使用率',
        memory: '内存使用率',
        memoryMb: '内存使用',
        bedrockStopped: 'Bedrock服务器未运行',
        bedrockRunning: 'PID: {pid}'
      }
    },
    
    // Performance Monitor
    performance: {
      title: '性能监控',
      systemCpu: '系统 CPU',
      systemMemory: '系统内存',
      bedrockCpu: 'Bedrock CPU',
      bedrockMemory: 'Bedrock 内存',
      cpuChart: 'CPU 使用率趋势',
      memoryChart: '内存使用率趋势',
      systemInfo: '系统信息',
      bedrockInfo: 'Bedrock 服务器信息',
      processId: '进程 ID',
      cpuUsage: 'CPU 使用率',
      memoryUsage: '内存使用率',
      memorySize: '内存使用量',
      lastUpdate: '最后更新时间',
      clearData: '清空数据',
      refresh: '刷新'
    },
    
    // Server Management
    serverManagement: {
      serverStatus: '服务器状态',
      serverControl: '服务器控制',
      performanceMonitor: '性能监控',
      currentStatus: '当前状态',
      processId: '进程ID',
      lastUpdate: '最后更新',
      startServer: '启动服务器',
      stopServer: '停止服务器',
      restartServer: '重启服务器',
      autoRefresh: '自动刷新',
      systemCpu: '系统CPU',
      systemMemory: '系统内存',
      serverCpu: '服务器CPU',
      serverMemory: '服务器内存',
      noPerformanceData: '暂无性能数据',
      confirm: '确认操作',
      confirmStart: '确定要启动服务器吗？',
      confirmStop: '确定要停止服务器吗？',
      confirmRestart: '确定要重启服务器吗？',
      startingServer: '正在启动服务器...',
      stoppingServer: '正在停止服务器...',
      restartingServer: '正在重启服务器...',
      startSuccess: '服务器启动成功',
      stopSuccess: '服务器停止成功',
      restartSuccess: '服务器重启成功',
      startError: '启动服务器失败',
      stopError: '停止服务器失败',
      restartError: '重启服务器失败',
      getStatusError: '获取服务器状态失败'
    },

    // Server Control
    server: {
      control: {
        title: '服务器控制',
        start: '启动服务器',
        stop: '停止服务器',
        restart: '重启服务器'
      },
      versions: {
        title: '服务器版本管理',
        description: '管理Minecraft基岩版专用服务器版本，下载、激活不同版本的服务器。',
        local: '本地版本配置',
        update: '更新版本列表',
        updating: '更新中...',
        download: '下载',
        activate: '激活',
        downloading: '下载中...',
        extracting: '解压中...',
        downloaded: '已下载',
        active: '当前激活',
        downloadFailed: '下载失败',
        activateConfirm: '确定要激活版本 {version} 吗？这将重启服务器。',
        activated: '版本已激活',
        activateFailed: '激活失败',
        empty: '暂无服务器版本'
      }
    },
    
    // Configuration
    config: {
      title: '服务器配置',
      serverName: '服务器名称',
      gamemode: '游戏模式',
      gamemodes: {
        survival: '生存模式',
        creative: '创造模式',
        adventure: '冒险模式'
      },
      difficulty: '难度',
      difficulties: {
        peaceful: '和平',
        easy: '简单',
        normal: '普通',
        hard: '困难'
      },
      maxPlayers: '最大玩家数',
      serverPort: '服务器端口',
      levelName: '世界名称',
      defaultPermission: '默认玩家权限级别',
      permissions: {
        visitor: '访客',
        member: '成员',
        operator: '管理员'
      },
      allowCheats: '允许作弊',
      allowList: '启用白名单',
      onlineMode: '在线模式',
      save: '保存配置',
      saveConfirm: '确定要保存配置吗？这可能需要重启服务器才能生效。',
      saveSuccess: '配置保存成功',
      saveError: '配置保存失败',
      loadError: '加载配置失败',
      validation: {
        serverNameRequired: '请输入服务器名称',
        maxPlayersRequired: '请输入最大玩家数',
        maxPlayersRange: '最大玩家数必须在1-100之间',
        serverPortRequired: '请输入服务器端口',
        serverPortRange: '服务器端口必须在1024-65535之间',
        levelNameRequired: '请输入世界名称'
      }
    },
    
    // Allowlist Management
    allowlist: {
      title: '白名单管理',
      placeholder: '输入玩家xuid',
      add: '添加',
      remove: '移除',
      empty: '暂无白名单用户',
      errorEmptyName: '请输入玩家xuid'
    },
    
    // Permission Management
    permission: {
      title: '权限管理',
      placeholder: '输入玩家xuid',
      add: '添加权限',
      remove: '移除',
      empty: '暂无权限设置',
      errorEmptyName: '请输入玩家xuid',
      modal: {
        title: '选择权限级别',
        description: '为玩家',
        description2: '选择权限级别：',
        cancel: '取消'
      },
      levels: {
        visitor: '访客',
        visitorDesc: '只能查看，无法修改',
        member: '成员',
        memberDesc: '可以进行基本操作',
        operator: '管理员',
        operatorDesc: '拥有完全管理权限'
      }
    },
    
    // World Management
    world: {
      title: '世界管理',
      upload: '上传世界文件',
      uploadDesc: '支持 .zip 和 .mcworld 格式，自动解压并删除压缩包',
      uploadNote: '上传后将自动解压到世界目录，原压缩文件会被删除',
      activate: '激活',
      delete: '删除',
      current: '当前世界',
      empty: '暂无世界文件',
      uploadFailed: '上传失败',
      deleteConfirm: '确定要删除世界 "{worldName}" 吗？此操作不可撤销！'
    },
    
    // Resource Pack Management
    resourcepack: {
      title: '资源包管理',
      upload: '上传资源包',
      uploadDesc: '支持 .zip 和 .mcpack 格式，自动解压并读取配置',
      uploadNote: '上传后将自动解压到资源包目录，原压缩文件会被删除',
      uploadError: '上传失败',
      activate: '激活',
      deactivate: '停用',
      delete: '删除',
      active: '已激活',
      empty: '暂无资源包',
      deleteConfirm: '确定要删除此资源包吗？此操作不可撤销！'
    },
    
    // Logs
    logs: {
      title: '服务器日志',
      refresh: '刷新',
      clear: '清空',
      autoScroll: '自动滚动',
      status: '状态',
      connecting: '连接中...',
      connected: '已连接',
      disconnected: '已断开',
      connectionError: '连接错误',
      connectionFailed: '连接失败',
      noLogs: '暂无日志',
      cleared: '日志已清空',
      clearSuccess: '日志清空成功',
      clearFailed: '日志清空失败',
      loadFailed: '日志加载失败'
    },
    
    // Interaction
    interaction: {
      title: '命令交互与日志',
      sendCommand: '发送命令',
      command: '命令',
      send: '发送',
      history: '命令历史',
      clearHistory: '清空',
      enabled: '命令交互已启用',
      disabled: '命令交互在当前平台不可用',
      commandSent: '命令发送成功',
      sendFailed: '发送命令失败',
      noHistory: '暂无命令历史',
      historyCleared: '命令历史已清空',
      clearHistorySuccess: '命令历史清空成功',
      clearHistoryFailed: '清空命令历史失败'
    },
    
    // Commands
    commands: {
      title: '快捷命令',
      all: '全部',
      time: '时间',
      weather: '天气',
      gamemode: '游戏模式',
      difficulty: '难度',
      execute: '执行',
      noCommands: '暂无可用命令',
      loadFailed: '加载快捷命令失败',
      filterFailed: '筛选命令失败',
      executed: '命令已执行',
      executeFailed: '执行命令失败'
    },
    
    // Messages
    message: {
      requestFailed: '请求失败',
      configSaved: '配置已保存',
      playerAdded: '玩家已添加',
      playerRemoved: '玩家已移除',
      permissionUpdated: '权限已更新',
      worldUploaded: '世界已上传',
      worldActivated: '世界已激活',
      worldDeleted: '世界已删除'
    },
    
    // Language
    language: {
      switch: '切换语言',
      chinese: '中文',
      english: 'English'
    },
    
    // Common
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      remove: '移除',
      upload: '上传',
      download: '下载',
      refresh: '刷新',
      clear: '清空',
      loading: '加载中...',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    }
  },
  
  en: {
    // Navigation
    nav: {
      title: 'Minecraft EasyServer',
      status: 'Status:',
      statusOffline: 'Offline',
      statusOnline: 'Online',
      statusUnknown: 'Unknown',
      statusRunning: 'Running',
      statusStopped: 'Stopped',
      statusStarting: 'Starting',
      statusStopping: 'Stopping',
      statusRestarting: 'Restarting',
      menu: {
        dashboard: 'Dashboard',
        server: 'Server',
        management: 'Management',
        serverControl: 'Server Control',
        serverConfig: 'Server Configuration',
        allowlist: 'Allowlist Management',
        permission: 'Permission Management',
        world: 'World Management',
        resourcepack: 'Resource Pack Management',
        versions: 'Version Management',
        tools: 'Server Tools',
        logs: 'Server Logs',
        interaction: 'Command Interaction & Logs',
        commands: 'Quick Commands'
      },
      buttons: {
        start: 'Start Server',
        stop: 'Stop Server',
        restart: 'Restart Server',
        toggle: 'Start/Stop'
      }
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      recentActivity: {
        title: 'Recent Activity',
        empty: 'No recent activity'
      },
      performance: {
        title: 'Performance Monitoring',
        system: 'System Performance',
        bedrock: 'Bedrock Process',
        cpu: 'CPU Usage',
        memory: 'Memory Usage',
        memoryMb: 'Memory Usage',
        bedrockStopped: 'Bedrock server not running',
        bedrockRunning: 'PID: {pid}'
      }
    },
    
    // Performance Monitor
    performance: {
      title: 'Performance Monitor',
      systemCpu: 'System CPU',
      systemMemory: 'System Memory',
      bedrockCpu: 'Bedrock CPU',
      bedrockMemory: 'Bedrock Memory',
      cpuChart: 'CPU Usage Trend',
      memoryChart: 'Memory Usage Trend',
      systemInfo: 'System Information',
      bedrockInfo: 'Bedrock Server Information',
      processId: 'Process ID',
      cpuUsage: 'CPU Usage',
      memoryUsage: 'Memory Usage',
      memorySize: 'Memory Usage',
      lastUpdate: 'Last Update',
      clearData: 'Clear Data',
      refresh: 'Refresh'
    },
    
    // Server Management
    serverManagement: {
      serverStatus: 'Server Status',
      serverControl: 'Server Control',
      performanceMonitor: 'Performance Monitor',
      currentStatus: 'Current Status',
      processId: 'Process ID',
      lastUpdate: 'Last Update',
      startServer: 'Start Server',
      stopServer: 'Stop Server',
      restartServer: 'Restart Server',
      autoRefresh: 'Auto Refresh',
      systemCpu: 'System CPU',
      systemMemory: 'System Memory',
      serverCpu: 'Server CPU',
      serverMemory: 'Server Memory',
      noPerformanceData: 'No performance data available',
      confirm: 'Confirm Operation',
      confirmStart: 'Are you sure you want to start the server?',
      confirmStop: 'Are you sure you want to stop the server?',
      confirmRestart: 'Are you sure you want to restart the server?',
      startingServer: 'Starting server...',
      stoppingServer: 'Stopping server...',
      restartingServer: 'Restarting server...',
      startSuccess: 'Server started successfully',
      stopSuccess: 'Server stopped successfully',
      restartSuccess: 'Server restarted successfully',
      startError: 'Failed to start server',
      stopError: 'Failed to stop server',
      restartError: 'Failed to restart server',
      getStatusError: 'Failed to get server status'
    },

    // Server Control
    server: {
      control: {
        title: 'Server Control',
        start: 'Start Server',
        stop: 'Stop Server',
        restart: 'Restart Server'
      },
      versions: {
        title: 'Server Version Management',
        description: 'Manage Minecraft Bedrock dedicated server versions, download and activate different server versions.',
        local: 'Local Version Configuration',
        update: 'Update Version List',
        updating: 'Updating...',
        download: 'Download',
        activate: 'Activate',
        downloading: 'Downloading...',
        extracting: 'Extracting...',
        downloaded: 'Downloaded',
        active: 'Currently Active',
        downloadFailed: 'Download failed',
        activateConfirm: 'Are you sure you want to activate version {version}? This will restart the server.',
        activated: 'Version activated',
        activateFailed: 'Activation failed',
        empty: 'No server versions available'
      }
    },
    
    // Configuration
    config: {
      title: 'Server Configuration',
      serverName: 'Server Name',
      gamemode: 'Game Mode',
      gamemodes: {
        survival: 'Survival',
        creative: 'Creative',
        adventure: 'Adventure'
      },
      difficulty: 'Difficulty',
      difficulties: {
        peaceful: 'Peaceful',
        easy: 'Easy',
        normal: 'Normal',
        hard: 'Hard'
      },
      maxPlayers: 'Max Players',
      serverPort: 'Server Port',
      levelName: 'Level Name',
      defaultPermission: 'Default Player Permission Level',
      permissions: {
        visitor: 'Visitor',
        member: 'Member',
        operator: 'Operator'
      },
      allowCheats: 'Allow Cheats',
      allowList: 'Enable Allowlist',
      onlineMode: 'Online Mode',
      save: 'Save Configuration',
      saveConfirm: 'Are you sure you want to save the configuration? This may require a server restart to take effect.',
      saveSuccess: 'Configuration saved successfully',
      saveError: 'Failed to save configuration',
      loadError: 'Failed to load configuration',
      validation: {
        serverNameRequired: 'Please enter server name',
        maxPlayersRequired: 'Please enter max players',
        maxPlayersRange: 'Max players must be between 1-100',
        serverPortRequired: 'Please enter server port',
        serverPortRange: 'Server port must be between 1024-65535',
        levelNameRequired: 'Please enter level name'
      }
    },
    
    // Allowlist Management
    allowlist: {
      title: 'Allowlist Management',
      placeholder: 'Enter player xuid',
      add: 'Add',
      remove: 'Remove',
      empty: 'No allowlist users',
      errorEmptyName: 'Please enter player xuid'
    },
    
    // Permission Management
    permission: {
      title: 'Permission Management',
      placeholder: 'Enter player xuid',
      add: 'Add Permission',
      remove: 'Remove',
      empty: 'No permission settings',
      errorEmptyName: 'Please enter player xuid',
      modal: {
        title: 'Select Permission Level',
        description: 'For player',
        description2: 'select permission level:',
        cancel: 'Cancel'
      },
      levels: {
        visitor: 'Visitor',
        visitorDesc: 'View only, cannot modify',
        member: 'Member',
        memberDesc: 'Can perform basic operations',
        operator: 'Operator',
        operatorDesc: 'Full administrative permissions'
      }
    },
    
    // World Management
    world: {
      title: 'World Management',
      upload: 'Upload World File',
      uploadDesc: 'Supports .zip and .mcworld formats, auto-extract and delete archive',
      uploadNote: 'Files will be auto-extracted to worlds directory, original archive will be deleted',
      activate: 'Activate',
      delete: 'Delete',
      current: 'Current World',
      empty: 'No world files',
      uploadFailed: 'Upload failed',
      deleteConfirm: 'Are you sure you want to delete world "{worldName}"? This action cannot be undone!'
    },
    
    // Resource Pack Management
    resourcepack: {
      title: 'Resource Pack Management',
      upload: 'Upload Resource Pack',
      uploadDesc: 'Supports .zip and .mcpack formats, auto-extract and read configuration',
      uploadNote: 'Files will be auto-extracted to resource packs directory, original archive will be deleted',
      uploadError: 'Upload failed',
      activate: 'Activate',
      deactivate: 'Deactivate',
      delete: 'Delete',
      active: 'Active',
      empty: 'No resource packs',
      deleteConfirm: 'Are you sure you want to delete this resource pack? This action cannot be undone!'
    },
    
    // Logs
    logs: {
      title: 'Server Logs',
      refresh: 'Refresh',
      clear: 'Clear',
      autoScroll: 'Auto Scroll',
      status: 'Status',
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      connectionError: 'Connection Error',
      connectionFailed: 'Connection Failed',
      noLogs: 'No logs available',
      cleared: 'Logs cleared',
      clearSuccess: 'Logs cleared successfully',
      clearFailed: 'Failed to clear logs',
      loadFailed: 'Failed to load logs'
    },
    
    // Interaction
    interaction: {
      title: 'Command Interaction & Logs',
      sendCommand: 'Send Command',
      command: 'Command',
      send: 'Send',
      history: 'Command History',
      clearHistory: 'Clear',
      enabled: 'Command interaction enabled',
      disabled: 'Command interaction not available on current platform',
      commandSent: 'Command sent successfully',
      sendFailed: 'Failed to send command',
      noHistory: 'No command history',
      historyCleared: 'Command history cleared',
      clearHistorySuccess: 'Command history cleared successfully',
      clearHistoryFailed: 'Failed to clear command history'
    },
    
    // Commands
    commands: {
      title: 'Quick Commands',
      all: 'All',
      time: 'Time',
      weather: 'Weather',
      gamemode: 'Game Mode',
      difficulty: 'Difficulty',
      execute: 'Execute',
      noCommands: 'No commands available',
      loadFailed: 'Failed to load quick commands',
      filterFailed: 'Failed to filter commands',
      executed: 'Command executed',
      executeFailed: 'Failed to execute command'
    },
    
    // Messages
    message: {
      requestFailed: 'Request failed',
      configSaved: 'Configuration saved',
      playerAdded: 'Player added',
      playerRemoved: 'Player removed',
      permissionUpdated: 'Permission updated',
      worldUploaded: 'World uploaded',
      worldActivated: 'World activated',
      worldDeleted: 'World deleted'
    },
    
    // Language
    language: {
      switch: 'Switch Language',
      chinese: '中文',
      english: 'English'
    },
    
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      upload: 'Upload',
      download: 'Download',
      refresh: 'Refresh',
      clear: 'Clear',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    }
  }
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('language') || 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages
})

export default i18n