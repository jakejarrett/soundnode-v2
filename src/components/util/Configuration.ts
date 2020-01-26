import fs from 'fs-extra';
import userHome from 'user-home';
import mkdirp from 'mkdirp';

export interface Config {
    accessToken: string;
    clientId: string;
}

export class Configuration {

    private createUserConfig(userConfigPath: string): void {
        mkdirp(userConfigPath, err => {
            if (err) {
                console.error(err);
            }
        });
    };

    private createIfNotExist(path: string): void {
        try {
            const pathInfo = fs.statSync(path);
            if (!pathInfo.isDirectory()) {
                this.createUserConfig(path);
            }
        }
        catch (error) {
            this.createUserConfig(path);
        }
    };

    /**
     * Get the configuration folder location
     *
     * @returns {string} The folder location of the config
     */
    private get userConfig(): string {
        let userConfigPath = null;

        /** Windows platform */
        if (process.platform === 'win32') {
            userConfigPath = `${userHome}/.config/Soundnode`;
        }

        /** Linux platforms - XDG Standard */
        if (process.platform === 'linux') {
            userConfigPath = `${userHome}/.config/Soundnode`;
        }

        /** Mac os configuration location */
        if (process.platform === 'darwin') {
            userConfigPath = `${userHome}/Library/Preferences/Soundnode`;
        }

        /** Unsupported platform */
        if (userConfigPath === null) {
            throw `could not set config path for this OS ${process.platform}`
        }

        this.createIfNotExist(userConfigPath)

        return userConfigPath;
    };

    /**
     * Get the configuration path
     *
     * @returns {string} The file location of the config
     */
    public get path(): string {
        return `${this.userConfig}/userConfig.json`
    };

    /**
     * Get the config file
     *
     * @returns {Object} Parsed version of the saved file
     */
    public get config(): Config {
        return JSON.parse(fs.readFileSync(`${this.path}`, 'utf-8'));
    };

    /**
     * Ensure the config exists
     *
     * @returns {Boolean} True if the file exists
     */
    public get hasConfig(): boolean {
        return fs.existsSync(`${this.path}`);
    };

}
