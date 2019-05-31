const { app, BrowserWindow } = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log')

const ipc = require('electron').ipcMain

let win

log.transports.file.level = "info"

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
      x:0,
      y:0,
      width: 1000,
      height: 1000,
      maxWidth: 1000,
      maxHeight: 1000,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    win.loadURL(path.join('file://', __dirname, 'index.html'))
  
    // Open the DevTools.
    win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
      win = null
    })
  }

  app.on('ready', ()=>{
      createWindow()
  })

  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })

  const sendStatusToWindow = (text) => {
    log.info(text)
    win.webContents.send(text)
  }

  ipc.on('show-update', (event, arg)=>{
    autoUpdater.checkForUpdates()

    autoUpdater.on('checking-for-update', ()=>{
      event.sender.send('check-update', 'checking for updates')
    })
    
    autoUpdater.on('update-available', (info)=>{
      event.sender.send('update-available', info)
    })

    autoUpdater.on('update-not-available', (info) => {
      event.sender.send('update-available-not', info)
    })

    autoUpdater.on('error', (err) => {
      event.sender.send('update-error', err)
    })

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      event.sender.send('update-download-progress', log_message)
    })

    autoUpdater.on('update-downloaded', (info) => {
      event.sender.send('update-download-done', info)
      autoUpdater.quitAndInstall(); 
    })

  })

  // app.on('ready', function()  {
      // autoUpdater.checkForUpdatesAndNotify()
      // autoUpdater.checkForUpdates()
  // })

  // autoUpdater.on('checking-for-update', ()=>{
  //   sendStatusToWindow('checking for updates')
  // })