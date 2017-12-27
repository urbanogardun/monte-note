// const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {

    path: string;
    data: any;

    constructor(opts: any) {
        // Renderer process has to get `app` module via `remote`, whereas the main 
        // process can get it directly - app.getPath('userData') will return a
        // string of the user's app data directory path.
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(__dirname, opts.configName + '.json');
        this.data = this.parseDataFile(this.path, opts.defaults);
    }

    // This will just return the property on the `data` object
    get(key: string) {
        return this.data[key];
    }

    // ...and this will set it
    set(key: string, val: string) {
        this.data[key] = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    
    private parseDataFile(filePath: string, defaults: any) {
        // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
        // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
        try {
            return JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            return defaults;
        }
    }
}

export default Store;