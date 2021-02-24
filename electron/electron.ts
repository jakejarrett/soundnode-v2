/** Can't use real typescript, just gets type definitions from electron to make dev easier... */
const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = electron;

const { initializeMediaShortcuts, menuBar } = require('./globalMenu');
const path = require('path');

const configuration = require(`${__dirname}/configLocation.js`);
const fs = require('fs');
const { removeSync } = require('fs-extra');

const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');

/** TODO: Get new key & move a hardcoded key out of git? */
/** TODO: Provide a way to skip auth & allow to use the app w/o an api key. */
const clientId = process.env.SOUNDCLOUD_CLIENT_ID || '342b8a7af638944906dcdb46f9d56d98';
const redirectUri = process.env.REDIRECT_URL || 'http://sc-redirect.herokuapp.com/callback.html';
const soundcloudConnectUrl = `https://soundcloud.com/connect?&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

let mainWindow;
let authenticationWindow;
const max_window_count = 1;
let current_window_count = 0;

const defaultWidth = process.env.DEFAULT_WIDTH || 1180;
const defaultHeight = process.env.DEFAULT_HEIGHT || 755;

const checkUserConfig = () => {
	const containsConfig = configuration.containsConfig();

	if (containsConfig) {
		createWindow();
	} else {
		authenticateUser();
	}
}

const createWindow = () => {
	const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
	const mainWindowState = windowStateKeeper({ defaultWidth, defaultHeight });

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 800,
		minHeight: 640,
		center: true,
		frame: false,
		darkTheme: true,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		},
		backgroundColor: '#151515'
	});

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.setTitle('Soundnode');
		mainWindow.show();
		mainWindow.focus();
	});

	initializeMediaShortcuts();
	menuBar();

	mainWindow.loadURL(url);

	if (isDev) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('maximize', () => {
		mainWindow.webContents.send('maximize-change', true);
	});

	mainWindow.on('unmaximize', () => {
		mainWindow.webContents.send('maximize-change', false);
	});

	mainWindow.on('closed', () => mainWindow = null);

	// NOTE: This does not work if the CLI forces a SIGINT. (control + c to close)
	mainWindowState.manage(mainWindow);
}

electron.ipcMain.on('window-action-clicked', (event, { action }) => {
	switch (action) {
		case "close": {
			if (process.platform !== "darwin") {
				mainWindow.close();
			} else {
				mainWindow.hide();
			}
			break;
		}

		case "minimize": {
			mainWindow.minimize();
			break;
		}

		case "maximize": {
			if (mainWindow.isMaximized()) {
				mainWindow.unmaximize()
			} else {
				mainWindow.maximize();
			}

			break;
		}
	}
});

electron.ipcMain.on('logout', () => {
	removeSync(configuration.getPath());
	authenticateUser(() => {
		if (mainWindow != null) {
			mainWindow.close();
			mainWindow = null;
		}
	});
});

/**
 * User config file doesn't exists
 * therefore open soundcloud authentication page
 */
const authenticateUser = (afterOpen) => {
	let contents;
	// todo: figure out how to deal with this.
	// Sessions after 24 hours will log you out.
	if (current_window_count > max_window_count && authenticationWindow != null) {
		return;
	}

	current_window_count++;

	authenticationWindow = new BrowserWindow({
		width: 600,
		height: 600,
		// Retain frame on sign in to allow closing without needing to know how to quit an app via shortcuts.
		frame: true,
		darkTheme: true,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false
		}
	});

	authenticationWindow.loadURL(soundcloudConnectUrl);
	authenticationWindow.show();

	if (afterOpen) {
		afterOpen();
	}

	authenticationWindow.on('closed', () => {
		authenticationWindow = null;
		contents = null;
	});

	contents = authenticationWindow.webContents;

	contents.on('did-navigate', (_, url) => {
		const access_tokenStr = 'access_token=';
		const expires_inStr = '&expires_in';
		let accessToken;

		if (url.indexOf('access_token=') < 0) {
			return false;
		}

		accessToken = url.substring(url.indexOf(access_tokenStr) + 13, url.indexOf(expires_inStr));

		accessToken = accessToken.split('&scope=')[0];
		setUserData(accessToken);
		authenticationWindow.close();
		current_window_count--;
	});
}

const setUserData = (accessToken) => {
	fs.writeFileSync(configuration.getPath(), JSON.stringify({
		accessToken: accessToken,
		clientId: clientId
	}), 'utf-8');

	createWindow();
}

app.on('ready', () => {
	checkUserConfig();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit(0);
	}
});

app.on('activate', () => {
	if (authenticationWindow === null) {
		authenticateUser();
	}
});

app.on('will-quit', () => {
	// Unregister all shortcuts.
	globalShortcut.unregisterAll()
});
