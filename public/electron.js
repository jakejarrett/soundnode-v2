const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
	const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,
		frame: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL(url);

	if (isDev) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', () => mainWindow = null);

	electron.ipcMain.on('windowActionClicked', ({ action }) => {
		switch (action) {
			case "close": {
				if (process.platform !== "darwin") {
					mainWindow.destroy();
				} else {
					mainWindow.hide();
				}
				break;
			}

			case "minimize": {
				mainWindow.minimize();
				break;
			}
		}
	  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});