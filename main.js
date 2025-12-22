const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 判断是否为开发环境
const isDev = !app.isPackaged;

let mainWindow = null;
let currentGlobalHotkey = 'CommandOrControl+Shift+J'; // 默认快捷键

// 创建日志记录函数
function logToFile(message) {
  const logDir = path.join(app.getPath('userData'), 'logs');
  const logFile = path.join(logDir, 'app.log');
  
  // 确保日志目录存在
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  try {
    // 检查日志文件大小，如果超过5MB则清空
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      if (stats.size > 5 * 1024 * 1024) { // 5MB
        // 清空文件
        fs.writeFileSync(logFile, '');
      }
    }
    
    fs.appendFileSync(logFile, logMessage);
  } catch (err) {
    console.error('写入日志文件失败:', err);
  }
}

// 获取配置文件路径
function getConfigPath() {
  const userDataPath = app.getPath('userData');
  const configPath = path.join(userDataPath, 'config.json');
  logToFile(`配置文件路径: ${configPath}`);
  console.log('配置文件路径:', configPath);
  return configPath;
}

// 读取配置文件
function readConfig() {
  const configPath = getConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      logToFile(`从配置文件读取的配置: ${configData}`);
      console.log('从配置文件读取的配置:', configData);
      return JSON.parse(configData);
    }
  } catch (e) {
    logToFile(`读取配置文件失败，使用默认配置: ${e.message}`);
    console.log('读取配置文件失败，使用默认配置:', e.message);
  }
  
  const defaultConfig = { hotkeys: { quickOpen: 'CommandOrControl+Shift+J' } };
  logToFile(`使用默认配置: ${JSON.stringify(defaultConfig)}`);
  console.log('使用默认配置:', defaultConfig);
  return defaultConfig;
}

// 写入配置文件
function writeConfig(config) {
  const configPath = getConfigPath();
  try {
    // 确保目录存在
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    logToFile(`配置已保存到文件: ${configPath}`);
    console.log('配置已保存到文件:', configPath);
    return true;
  } catch (e) {
    logToFile(`写入配置文件失败: ${e.message}`);
    console.error('写入配置文件失败:', e.message);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS 原生的"红绿灯"按钮
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#f8fafc'
  });

  // 开发环境：加载 Vite 开发服务器
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：加载构建后的文件
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  }

  // 窗口关闭时清空引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 创建应用菜单
  createMenu();
}

// 显示或隐藏应用窗口
function toggleWindow() {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow.isMinimized()) {
    mainWindow.restore();
    mainWindow.focus();
  } else if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

function createMenu() {
  const template = [
    {
      label: 'ProJSON',
      submenu: [
        { role: 'about', label: '关于 ProJSON' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        { type: 'separator' },
        { role: 'front', label: '前置全部窗口' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 转换快捷键格式（从 cmd+shift+j 到 CommandOrControl+Shift+J）
function convertHotkeyFormat(hotkey) {
  if (!hotkey) return 'CommandOrControl+Shift+J';
  
  return hotkey
    .split('+')
    .map(key => {
      key = key.trim().toLowerCase();
      if (key === 'cmd' || key === 'ctrl') return 'CommandOrControl';
      if (key === 'shift') return 'Shift';
      if (key === 'alt' || key === 'option') return 'Alt';
      return key.charAt(0).toUpperCase() + key.slice(1);
    })
    .join('+');
}

// 注册全局快捷键
function registerGlobalShortcut(hotkeyStr) {
  // 先注销所有快捷键
  globalShortcut.unregisterAll();
  
  const electronFormat = convertHotkeyFormat(hotkeyStr || currentGlobalHotkey);
  currentGlobalHotkey = electronFormat;
  
  logToFile(`尝试注册全局快捷键: ${electronFormat}`);
  console.log(`尝试注册全局快捷键: ${electronFormat}`);
  
  const ret = globalShortcut.register(electronFormat, () => {
    logToFile('全局快捷键被触发，显示/隐藏窗口');
    console.log('全局快捷键被触发，显示/隐藏窗口');
    toggleWindow();
  });

  if (!ret) {
    logToFile(`全局快捷键注册失败: ${electronFormat}`);
    console.log(`全局快捷键注册失败: ${electronFormat}`);
    return { success: false, error: `Failed to register hotkey: ${electronFormat}` };
  } else {
    logToFile(`全局快捷键注册成功: ${electronFormat}`);
    console.log(`全局快捷键注册成功: ${electronFormat}`);
    return { success: true, hotkey: electronFormat };
  }
}

// 监听来自渲染进程的快捷键更新
ipcMain.handle('update-global-hotkey', async (event, hotkeyStr) => {
  logToFile(`收到快捷键更新请求: ${hotkeyStr}`);
  console.log(`收到快捷键更新请求: ${hotkeyStr}`);
  
  // 确保传入的hotkeyStr有效
  if (!hotkeyStr) {
    logToFile('快捷键更新请求中hotkeyStr为空，使用默认值');
    console.log('快捷键更新请求中hotkeyStr为空，使用默认值');
    hotkeyStr = 'CommandOrControl+Shift+J';
  }
  
  const result = registerGlobalShortcut(hotkeyStr);
  
  // 保存到配置文件
  if (result.success) {
    const config = readConfig();
    config.hotkeys = config.hotkeys || {};
    config.hotkeys.quickOpen = hotkeyStr;
    const saveSuccess = writeConfig(config);
    if (saveSuccess) {
      logToFile('快捷键已保存到配置文件');
      console.log('快捷键已保存到配置文件');
    } else {
      logToFile('快捷键保存到配置文件失败');
      console.error('快捷键保存到配置文件失败');
    }
  } else {
    logToFile(`快捷键注册失败，不更新配置文件: ${result.error}`);
    console.error(`快捷键注册失败，不更新配置文件: ${result.error}`);
  }
  
  return result;
});

// 提供当前快捷键给渲染进程
ipcMain.handle('get-current-hotkey', async (event) => {
  logToFile(`返回当前快捷键: ${currentGlobalHotkey}`);
  console.log(`返回当前快捷键: ${currentGlobalHotkey}`);
  return { success: true, hotkey: currentGlobalHotkey };
});

app.whenReady().then(() => {
  logToFile(`应用已准备就绪，开始创建窗口和初始化快捷键，环境: ${isDev ? '开发' : '生产'}`);
  console.log('应用已准备就绪，开始创建窗口和初始化快捷键，环境:', isDev ? '开发' : '生产');
  
  // 记录用户数据目录
  const userDataPath = app.getPath('userData');
  logToFile(`用户数据目录: ${userDataPath}`);
  console.log('用户数据目录:', userDataPath);
  
  createWindow();

  // 从配置文件读取并注册快捷键
  const config = readConfig();
  const savedHotkey = config.hotkeys?.quickOpen;
  logToFile('从配置文件读取到的快捷键:' + savedHotkey);
  console.log('从配置文件读取到的快捷键:', savedHotkey);
  
  if (savedHotkey) {
    const result = registerGlobalShortcut(savedHotkey);
    logToFile(`应用启动时注册快捷键结果: ${JSON.stringify(result)}`);
    console.log('应用启动时注册快捷键结果:', result);
  } else {
    const result = registerGlobalShortcut(currentGlobalHotkey);
    logToFile(`应用启动时使用默认快捷键注册结果: ${JSON.stringify(result)}`);
    console.log('应用启动时使用默认快捷键注册结果:', result);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // 注销所有全局快捷键
  globalShortcut.unregisterAll();
  logToFile('应用退出，已注销所有全局快捷键');
  console.log('应用退出，已注销所有全局快捷键');
});
