const { contextBridge, ipcRenderer } = require('electron');

// 将 IPC 功能暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  updateGlobalHotkey: async (hotkey) => {
    try {
      // 使用 invoke 而不是 send，这样可以获得响应
      const result = await ipcRenderer.invoke('update-global-hotkey', hotkey);
      return result;
    } catch (error) {
      console.error('更新全局快捷键失败:', error);
      return { success: false, error: error.message };
    }
  },
  getCurrentHotkey: async () => {
    try {
      const result = await ipcRenderer.invoke('get-current-hotkey');
      return result;
    } catch (error) {
      console.error('获取当前快捷键失败:', error);
      return { success: false, error: error.message };
    }
  },
  onGlobalHotkeyUpdated: (callback) => {
    ipcRenderer.on('global-hotkey-updated', (event, data) => callback(data));
  }
});
