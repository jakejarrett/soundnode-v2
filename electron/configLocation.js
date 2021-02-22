const fs = require('fs-extra');
const userHome = require('user-home');
const mkdirp = require('mkdirp');

const configuration = {

    createUserConfig(userConfigPath) {
        try {
            mkdirp(userConfigPath, { mode: 0777 }, err => {
                if (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    },

    createIfNotExist(path) {
        try {
            const pathInfo = fs.statSync(path);
            if (!pathInfo.isDirectory()) {
                this.createUserConfig(path);
            }
        }
        catch (error) {
            this.createUserConfig(path);
        }
    },

    /**
     * Get the configuration folder location
     *
     * @returns {string} The folder location of the config
     */
    getUserConfig() {
        const userConfigPath = process.platform === 'darwin' ? `${userHome}/Library/Preferences/Soundnode` : `${userHome}/.config/Soundnode`;
        this.createIfNotExist(userConfigPath)
        return userConfigPath;
    },

    /**
     * Get the configuration path
     *
     * @returns {string} The file location of the config
     */
    getPath() {
        return `${this.getUserConfig()}/userConfig.json`
    },

    /**
     * Get the config file
     *
     * @returns {Object} Parsed version of the saved file
     */
    getConfigfile() {
        return JSON.parse(fs.readFileSync(this.getPath(), 'utf-8'));
    },

    /**
     * Ensure the config exists
     *
     * @returns {Boolean} True if the file exists
     */
    containsConfig() {
        return fs.existsSync(this.getPath());
    }

}

module.exports = configuration;