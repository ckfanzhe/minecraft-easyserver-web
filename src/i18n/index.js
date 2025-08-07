import { createI18n } from 'vue-i18n'

// Translation resources
const messages = {
  zh: {
    // Login
    login: {
      title: '登录',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      loginButton: '登录',
      loginSuccess: '登录成功',
      loginFailed: '登录失败',
      loginError: '登录失败，请重试',
      invalidPassword: '密码错误',
      passwordMinLength: '密码长度不能为空',
      rateLimitExceeded: '登录失败次数过多，账户已被暂时封禁',
      rateLimitInfo: '封禁时间：{blockedUntil}，请在 {retryAfter} 秒后重试',
      validation: {
        passwordRequired: '请输入密码'
      }
    },

    // Auth
    auth: {
      logout: {
        success: '退出登录成功'
      },
      changePassword: {
        title: '修改密码',
        warningText: '检测到您正在使用默认密码，为了安全起见，请立即修改为强密码。',
        currentPassword: '当前密码',
        currentPasswordPlaceholder: '请输入当前密码',
        newPassword: '新密码',
        newPasswordPlaceholder: '请输入新密码',
        confirmPassword: '确认新密码',
        confirmPasswordPlaceholder: '请再次输入新密码',
        passwordRequirements: '密码要求：',
        requirements: {
          minLength: '至少8位字符',
          uppercase: '包含大写字母',
          lowercase: '包含小写字母',
          number: '包含数字',
          specialChar: '包含特殊字符'
        },
        passwordMismatch: '两次输入的密码不一致',
        changeButton: '修改密码',
        changing: '修改中...',
        changeSuccess: '密码修改成功，即将跳转到登录页面',
        changeSuccessVoluntary: '密码修改成功，即将返回仪表板',
        changeFailed: '修改密码失败，请重试'
      }
    },

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
        commands: '快捷命令',
        serverManagement: '服务器管理',
        playerManagement: '玩家管理',
        worldManagement: '世界管理',
        interactionLogs: '交互与日志',
        changePassword: '修改密码'
      },
      buttons: {
        start: '启动服务器',
        stop: '停止服务器',
        restart: '重启服务器',
        toggle: '启动/停止',
        changePassword: '修改密码',
        logout: '退出登录'
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
      },
      statusOverview: {
        title: '服务器状态概览',
        serverStatus: '服务器状态',
        cpuUsage: 'CPU 使用率',
        memoryUsage: '内存使用'
      },
      quickActions: {
        title: '快速操作',
        startServer: '启动服务器',
        stopServer: '停止服务器',
        restartServer: '重启服务器',
        commandConsole: '命令控制台'
      },
      recentLogs: {
        title: '最近日志',
        viewMore: '查看更多',
        noLogs: '暂无日志'
      },
      serverInfo: {
        title: '服务器信息',
        serverName: '服务器名称',
        gameMode: '游戏模式',
        difficulty: '难度',
        port: '端口',
        notSet: '未设置',
        unknown: '未知'
      },
      quickLinks: {
        title: '快捷链接',
        serverConfig: '服务器配置',
        playerManagement: '玩家管理',
        worldManagement: '世界管理',
        performanceMonitoring: '性能监控'
      },
      messages: {
        startServerSuccess: '服务器启动命令已发送',
        stopServerSuccess: '服务器停止命令已发送',
        restartServerSuccess: '服务器重启命令已发送',
        startServerError: '启动服务器失败',
        stopServerError: '停止服务器失败',
        restartServerError: '重启服务器失败'
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
      placeholder: '输入玩家名称',
      add: '添加',
      remove: '移除',
      empty: '暂无白名单用户',
      errorEmptyName: '请输入玩家名称',
      // New fields
      addPlayer: '添加玩家',
      playerName: '玩家名称',
      ignoresPlayerLimit: '忽略玩家限制',
      actions: '操作',
      delete: '删除',
      emptyState: '暂无白名单玩家',
      addPlayerDialog: {
        title: '添加白名单玩家',
        playerNameLabel: '玩家名称',
        playerNamePlaceholder: '请输入玩家名称',
        ignoresPlayerLimitLabel: '忽略玩家限制',
        ignoresPlayerLimitTip: '开启后，该玩家可以在服务器满员时仍然加入',
        cancel: '取消',
        confirm: '添加'
      },
      validation: {
        nameRequired: '请输入玩家名称',
        nameLength: '玩家名称长度应在3-16个字符之间',
        namePattern: '玩家名称只能包含字母、数字和下划线'
      },
      messages: {
        loadFailed: '获取白名单失败',
        playerExists: '该玩家已在白名单中',
        addSuccess: '玩家添加成功',
        addFailed: '添加玩家失败',
        removeConfirm: '确定要将玩家 "{playerName}" 从白名单中移除吗？',
        removeConfirmTitle: '确认删除',
        removeSuccess: '玩家移除成功',
        removeFailed: '移除玩家失败'
      },
      status: {
        yes: '是',
        no: '否'
      }
    },
    
    // Permission Management
    permission: {
      title: '权限管理',
      add: '添加权限',
      playerXuid: '玩家XUID',
      permissionLevel: '权限等级',
      actions: '操作',
      remove: '移除',
      empty: '暂无权限配置',
      levels: {
        visitor: '访客',
        member: '成员',
        operator: '管理员',
        visitorDesc: '只能查看，无法修改',
        memberDesc: '可以进行基本操作',
        operatorDesc: '拥有完全管理权限'
      },
      addDialog: {
        title: '添加权限',
        xuidsLabel: '玩家XUID',
        xuidsPlaceholder: '请输入16位数字XUID',
        levelLabel: '权限等级',
        levelPlaceholder: '请选择权限等级',
        cancel: '取消',
        confirm: '添加'
      },
      editDialog: {
        title: '编辑权限'
      },
      validation: {
        xuidsRequired: '请输入玩家XUID',
        xuidsLength: 'XUID必须为16位数字',
        xuidsPattern: 'XUID只能包含数字',
        levelRequired: '请选择权限等级'
      },
      messages: {
        loadFailed: '获取权限列表失败',
        playerExists: '该玩家权限已存在',
        addSuccess: '添加权限成功',
        addFailed: '添加权限失败',
        updateSuccess: '更新权限成功',
        updateFailed: '更新权限失败',
        removeConfirm: '确定要移除玩家 {xuid} 的权限吗？',
        removeConfirmTitle: '确认移除',
        removeSuccess: '移除权限成功',
        removeFailed: '移除权限失败'
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
      autoRefresh: '自动刷新',
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
      loadFailed: '日志加载失败',
      confirmClear: '确定要清空所有日志吗？此操作不可撤销！'
    },
    
    // Interaction
    interaction: {
      title: '命令交互与日志',
      logs: '服务器日志',
      commandInput: '命令输入',
      quickCommands: '快捷命令',
      commandHistory: '命令历史',
      commandPlaceholder: '输入命令（支持上下箭头浏览历史）',
      noLogs: '暂无日志',
      clearLogs: '清空日志',
      clearHistory: '清空历史',
      confirmClearLogs: '确定要清空所有日志吗？',
      confirmClearHistory: '确定要清空命令历史吗？',
      logsCleared: '日志已清空',
      historyCleared: '历史已清空',
      loadLogsFailed: '加载日志失败',
      clearLogsFailed: '清空日志失败',
      clearHistoryFailed: '清空历史失败',
      commandExecuted: '命令执行成功',
      commandFailed: '命令执行失败',
      commandExecuteFailed: '命令执行失败，请检查网络连接',
      serverNotRunning: '服务器未运行，无法执行命令',
      checkServerStatusFailed: '检查服务器状态失败',
      executed: '已执行',
      sendCommand: '发送命令',
      command: '命令',
      send: '发送',
      history: '命令历史',
      enabled: '命令交互已启用',
      disabled: '命令交互在当前平台不可用',
      commandSent: '命令发送成功',
      sendFailed: '发送命令失败',
      noHistory: '暂无命令历史',
      clearHistorySuccess: '命令历史清空成功'
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
      name: '名称',
      status: '状态',
      actions: '操作',
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
      info: '信息',
      noData: '暂无数据',
      operation: '操作',
      description: '描述',
      enabled: '启用',
      disabled: '禁用',
      active: '活跃',
      inactive: '未激活',
      activate: '激活',
      version: '版本',
      selectFile: '请选择文件',
      loadFailed: '加载失败',
      operationFailed: '操作失败'
    }
   },
  en: {
    // Login
    login: {
      title: 'Login',
      password: 'Password',
      passwordPlaceholder: 'Please enter password',
      loginButton: 'Login',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      loginError: 'Login failed, please try again',
      invalidPassword: 'Invalid password',
      passwordMinLength: 'Password cannot be empty',
      rateLimitExceeded: 'Too many failed login attempts, account temporarily blocked',
      rateLimitInfo: 'Blocked until: {blockedUntil}, please retry after {retryAfter} seconds',
      validation: {
        passwordRequired: 'Please enter password'
      }
    },

    // Auth
    auth: {
      logout: {
        success: 'Logout successful'
      },
      changePassword: {
        title: 'Change Password',
        warningText: 'Default password detected. For security reasons, please change to a strong password immediately.',
        currentPassword: 'Current Password',
        currentPasswordPlaceholder: 'Enter current password',
        newPassword: 'New Password',
        newPasswordPlaceholder: 'Enter new password',
        confirmPassword: 'Confirm New Password',
        confirmPasswordPlaceholder: 'Re-enter new password',
        passwordRequirements: 'Password Requirements:',
        requirements: {
          minLength: 'At least 8 characters',
          uppercase: 'Contains uppercase letter',
          lowercase: 'Contains lowercase letter',
          number: 'Contains number',
          specialChar: 'Contains special character'
        },
        passwordMismatch: 'Passwords do not match',
        changeButton: 'Change Password',
        changing: 'Changing...',
        changeSuccess: 'Password changed successfully, redirecting to login page',
        changeSuccessVoluntary: 'Password changed successfully, returning to dashboard',
        changeFailed: 'Failed to change password, please try again'
      }
    },

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
        commands: 'Quick Commands',
        serverManagement: 'Server Management',
        playerManagement: 'Player Management',
        worldManagement: 'World Management',
        interactionLogs: 'Interaction & Logs',
        changePassword: 'Change Password'
      },
      buttons: {
        start: 'Start Server',
        stop: 'Stop Server',
        restart: 'Restart Server',
        toggle: 'Start/Stop',
        changePassword: 'Change Password',
        logout: 'Logout'
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
      },
      statusOverview: {
        title: 'Server Status Overview',
        serverStatus: 'Server Status',
        cpuUsage: 'CPU Usage',
        memoryUsage: 'Memory Usage'
      },
      quickActions: {
        title: 'Quick Actions',
        startServer: 'Start Server',
        stopServer: 'Stop Server',
        restartServer: 'Restart Server',
        commandConsole: 'Command Console'
      },
      recentLogs: {
        title: 'Recent Logs',
        viewMore: 'View More',
        noLogs: 'No logs available'
      },
      serverInfo: {
        title: 'Server Information',
        serverName: 'Server Name',
        gameMode: 'Game Mode',
        difficulty: 'Difficulty',
        port: 'Port',
        notSet: 'Not Set',
        unknown: 'Unknown'
      },
      quickLinks: {
        title: 'Quick Links',
        serverConfig: 'Server Configuration',
        playerManagement: 'Player Management',
        worldManagement: 'World Management',
        performanceMonitoring: 'Performance Monitor'
      },
      messages: {
        startServerSuccess: 'Server start command sent',
        stopServerSuccess: 'Server stop command sent',
        restartServerSuccess: 'Server restart command sent',
        startServerError: 'Failed to start server',
        stopServerError: 'Failed to stop server',
        restartServerError: 'Failed to restart server'
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
      placeholder: 'Enter player name',
      add: 'Add',
      remove: 'Remove',
      empty: 'No allowlist users',
      errorEmptyName: 'Please enter player name',
      // New fields
      addPlayer: 'Add Player',
      playerName: 'Player Name',
      ignoresPlayerLimit: 'Ignores Player Limit',
      actions: 'Actions',
      delete: 'Delete',
      emptyState: 'No allowlist players',
      addPlayerDialog: {
        title: 'Add Allowlist Player',
        playerNameLabel: 'Player Name',
        playerNamePlaceholder: 'Please enter player name',
        ignoresPlayerLimitLabel: 'Ignores Player Limit',
        ignoresPlayerLimitTip: 'When enabled, this player can join even when the server is full',
        cancel: 'Cancel',
        confirm: 'Add'
      },
      validation: {
        nameRequired: 'Please enter player name',
        nameLength: 'Player name length should be between 3-16 characters',
        namePattern: 'Player name can only contain letters, numbers and underscores'
      },
      messages: {
        loadFailed: 'Failed to load allowlist',
        playerExists: 'This player is already in the allowlist',
        addSuccess: 'Player added successfully',
        addFailed: 'Failed to add player',
        removeConfirm: 'Are you sure you want to remove player "{playerName}" from the allowlist?',
        removeConfirmTitle: 'Confirm Delete',
        removeSuccess: 'Player removed successfully',
        removeFailed: 'Failed to remove player'
      },
      status: {
        yes: 'Yes',
        no: 'No'
      }
    },
    
    // Permission Management
    permission: {
      title: 'Permission Management',
      add: 'Add Permission',
      playerXuid: 'Player XUID',
      permissionLevel: 'Permission Level',
      actions: 'Actions',
      remove: 'Remove',
      empty: 'No permission configurations',
      levels: {
        visitor: 'Visitor',
        member: 'Member',
        operator: 'Operator',
        visitorDesc: 'Basic access permissions',
        memberDesc: 'Regular member permissions',
        operatorDesc: 'Administrator permissions'
      },
      addDialog: {
        title: 'Add Permission',
        xuidsLabel: 'Player XUID',
        xuidsPlaceholder: 'Please enter 16-digit XUID',
        levelLabel: 'Permission Level',
        levelPlaceholder: 'Please select permission level',
        cancel: 'Cancel',
        confirm: 'Add'
      },
      editDialog: {
        title: 'Edit Permission'
      },
      validation: {
        xuidsRequired: 'Please enter player XUID',
        xuidsLength: 'XUID must be 16 digits',
        xuidsPattern: 'XUID can only contain numbers',
        levelRequired: 'Please select permission level'
      },
      messages: {
        loadFailed: 'Failed to load permission list',
        playerExists: 'Player permission already exists',
        addSuccess: 'Permission added successfully',
        addFailed: 'Failed to add permission',
        updateSuccess: 'Permission updated successfully',
        updateFailed: 'Failed to update permission',
        removeConfirm: 'Are you sure you want to remove permission for player {xuid}?',
        removeConfirmTitle: 'Confirm Remove',
        removeSuccess: 'Permission removed successfully',
        removeFailed: 'Failed to remove permission'
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
      autoRefresh: 'Auto Refresh',
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
      loadFailed: 'Failed to load logs',
      confirmClear: 'Are you sure you want to clear all logs? This action cannot be undone!'
    },
    
    // Interaction
    interaction: {
      title: 'Command Interaction & Logs',
      logs: 'Server Logs',
      commandInput: 'Command Input',
      quickCommands: 'Quick Commands',
      commandHistory: 'Command History',
      commandPlaceholder: 'Enter command (use up/down arrows to browse history)',
      noLogs: 'No logs available',
      clearLogs: 'Clear Logs',
      clearHistory: 'Clear History',
      confirmClearLogs: 'Are you sure you want to clear all logs?',
      confirmClearHistory: 'Are you sure you want to clear command history?',
      logsCleared: 'Logs cleared',
      historyCleared: 'History cleared',
      loadLogsFailed: 'Failed to load logs',
      clearLogsFailed: 'Failed to clear logs',
      clearHistoryFailed: 'Failed to clear history',
      commandExecuted: 'Command executed successfully',
      commandFailed: 'Command execution failed',
      commandExecuteFailed: 'Command execution failed, please check network connection',
      serverNotRunning: 'Server is not running, cannot execute command',
      checkServerStatusFailed: 'Failed to check server status',
      executed: 'Executed',
      sendCommand: 'Send Command',
      command: 'Command',
      send: 'Send',
      history: 'Command History',
      enabled: 'Command interaction enabled',
      disabled: 'Command interaction not available on current platform',
      commandSent: 'Command sent successfully',
      sendFailed: 'Failed to send command',
      noHistory: 'No command history',
      clearHistorySuccess: 'Command history cleared successfully'
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
      name: 'Name',
      status: 'Status',
      actions: 'Actions',
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
      info: 'Info',
      noData: 'No Data',
      operation: 'Operation',
      description: 'Description',
      enabled: 'Enabled',
      disabled: 'Disabled',
      active: 'Active',
      inactive: 'Inactive',
      activate: 'Activate',
      version: 'Version',
      selectFile: 'Please select a file',
      loadFailed: 'Load failed',
      operationFailed: 'Operation failed'
    }
  }
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: localStorage.getItem('language') || 'zh', // Default language
  fallbackLocale: 'zh', // Fallback language
  messages
})

export default i18n