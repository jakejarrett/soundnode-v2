/** Can't use real typescript, just gets type definitions from electron to make dev easier... */
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');

const configuration = require(`${__dirname}/configLocation.js`);
const fs = require('fs');
const isDev = require('electron-is-dev');

/** TODO: Get new key & move a hardcoded key out of git? */
const clientId = process.env.SOUNDCLOUD_CLIENT_ID || '342b8a7af638944906dcdb46f9d56d98';
const redirectUri = process.env.REDIRECT_URL || 'http://sc-redirect.herokuapp.com/callback.html';
const soundcloudConnectUrl = `https://soundcloud.com/connect?&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

let mainWindow;
let authenticationWindow;

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
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,
		frame: false,
		darkTheme: true,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL(url);

	if (isDev) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', () => mainWindow = null);

	electron.ipcMain.on('window-action-clicked', (event, { action }) => {
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
}

/**
 * User config file doesn't exists
 * therefore open soundcloud authentication page
 */
const authenticateUser = () => {
	let contents;

	authenticationWindow = new BrowserWindow({
		width: 600,
		height: 600,
		frame: false,
		darkTheme: true,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: false
		}
	});

	authenticationWindow.loadURL(soundcloudConnectUrl);
	authenticationWindow.show();

	contents = authenticationWindow.webContents;

	contents.on('did-navigate', (_event, url, httpResponseCode) => {
		const access_tokenStr = 'access_token=';
		const expires_inStr = '&expires_in';
		let accessToken;

		if (url.indexOf('access_token=') < 0) {
			return false;
		}

		accessToken = url.substring(url.indexOf(access_tokenStr) + 13, url.indexOf(expires_inStr));

		accessToken = accessToken.split('&scope=')[0];
		console.log(accessToken);
		// // setUserData(accessToken);
		// authenticationWindow.destroy();
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
		app.quit();
	}
});

app.on('activate', () => {
	if (authenticationWindow === null) {
		authenticateUser();
	}
});