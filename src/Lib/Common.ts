import { ChildProcess } from "child_process";
import { App, BrowserWindow, Shell } from "electron";
import { AppSettings } from "./AppSettings";

const electron = require("electron");
const fs = require("fs");
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const { exec, spawn } = require("child_process");

/**
 * "Common" provides a set of simple functions that can be used by any module.  
 * These are meant to be simple functions.  
 * More advanced functions should betailored to the consumers needs and custom made.
 * 
 * @namespace Common
 * 
 * @example
 * ```typescript
 * // Importing the Common namespace
 * import { Common } from './Lib/Common';
 * 
 * // Using the Common namespace
 * Common.IO.ReadFile("path/to/file");
 * ```
 */
export namespace Common {

    /**
     * "IO" provides a set of functions that can be used to interact with the file system.
     */
    export namespace IO {

        /**
         * Reads a file from the file system.
         * 
         * @param path the path to the file
         * @param json return the file as T if true
         * @returns the file as a string or T
         * 
         * @example
         * ```typescript
         * // Reading a file as a string
         * let file: string = Common.IO.ReadFile("path/to/file");
         * 
         * // Reading a file as JSON
         * let file: {[key: string]: number} = Common.IO.ReadFile<{[key: string]: number}>("path/to/file", true);
         * ```
         */
        export function ReadFile<T = string>(path: string, json?: boolean): T {
            let file: string = fs.readFileSync(path, "utf8");
            if (!file) {
                console.log(`[Common.IO.ReadFile] File not found: ${path}`);
                return undefined;
            }

            if (json) return <T>JSON.parse(file);
            return <T>file;
        }

        /**
         * Writes a file to the file system.
         * If content is not a string it will be converted to JSON by default.
         * 
         * @param path the path to the file
         * @param content the content to write to the file
         * @param json write the file as JSON if true
         * 
         * @example
         * ```typescript
         * // Writing a file as a string
         * Common.IO.WriteFile("path/to/file", "content");
         * 
         * // Writing a file as JSON
         * Common.IO.WriteFile("path/to/file", { "key": "value" }, true);
         * ```
         */
        export function WriteFile(_path: string, content: any, json?:boolean, stringifyContentDefault: boolean = true): void {
            if ((json || typeof content != "string") && stringifyContentDefault) content = JSON.stringify(content, null, 4);

            //Check if the directory exists
            let dir: string = _path.substring(0, _path.lastIndexOf(path.sep));
            if (!fs.existsSync(dir)) {   
                //Create the directory
                CreateDirectory(dir);
            }

            fs.writeFileSync(_path, content, { encoding: "utf8", flag: "w" });
        }

        export function AppendToFile(path: string, content: any): void {
            fs.appendFileSync(path, content, { encoding: "utf8", flag: "a" });
        }

        /**
         * Creates a directory.
         * 
         * @param path the path to the directory
         */
        export function CreateDirectory(path: string): void {
            fs.mkdirSync(path);
        }

        /**
         * Gets all files in a directory.
         * 
         * @param path the path to the directory
         * @param fileExt the file extension to filter by
         * @returns an array of files
         */
        export function GetFiles(path: string, fileExt?: string): string[] {
            let files: string[] = [];
            let dir: string[] = fs.readdirSync(path);

            for (let i = 0; i < dir.length; i++) {
                let filePath: string = path + "/" + dir[i];
                let stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    files = files.concat(GetFiles(filePath, fileExt));
                } else {
                    if (fileExt && filePath.endsWith(fileExt)) {
                        files.push(filePath);
                    }
                }
            }

            return files;
        }

        /**
         * Checks if a file exists.
         * 
         * @param path the path to the file
         * @returns true if the file exists
         */
        export function FileExists(path: string): boolean {
            return fs.existsSync(path);
        }

        /**
         * Gets the last modified date of a file.
         * 
         * @param path the path to the file
         * @returns the last modified date
         */
        export function GetFileLastModified(path: string): Date {
            return fs.statSync(path).mtime;
        }

        /**
         * Deletes a file.
         * 
         * @param path the path to the file
         */
        export function DeleteFile(path: string): void {
            fs.unlinkSync(path);
        }

        /**
         * Reads a directory from the file system.
         * 
         * @param path the path to the directory
         * @returns an array of file names
         * 
         * @example
         * ```typescript
         * // Reading a directory
         * let files: string[] = Common.IO.ReadDirectory("path/to/directory");
         * ```
         */
        export function ReadDirectory(path: string): string[] {
            let files: string[] = fs.readdirSync(path);
            if (!files) return [];

            return files;
        }

        /**
         * Opens a folder in the file explorer.
         * 
         * @param path the path to the folder
         * @param _arguments any additional arguments to pass to the file explorer
         * 
         * @example
         * ```typescript
         * // Opening a folder
         * Common.IO.OpenFolder("path/to/folder");
         * 
         * // Opening a folder with additional arguments
         * Common.IO.OpenFolder("path/to/folder", "/select, "file.txt");
         * ```
         */
        export function OpenFolder(filePath: string, _arguments?: string[], onlyArguments: boolean = false): void {
            const fileManager: string = process.platform === "win32" ? "explorer" : "open";

            if (filePath) filePath = filePath.replace(/\//g, path.sep);

            if (!_arguments) {
                spawn(fileManager, [filePath]);
                return;
            }
            if (onlyArguments) {
                spawn(fileManager, _arguments);
                return;
            }

            spawn(fileManager, _arguments, {
                cwd: filePath
            })
        }

        /**
         * Opens a file in the file explorer.
         * 
         * @param path the path to the file
         * @param _arguments any additional arguments to pass to the file explorer
         * 
         * @example
         * ```typescript
         * // Opening a file
         * Common.IO.OpenFile("path/to/file");
         * 
         * // Opening a file with additional arguments
         * Common.IO.OpenFile("path/to/file", "/select, "file.txt");
         * ```
         */
        export function OpenFile(filePath: string, _arguments?: string[], onlyArguments: boolean = false): void {
            OpenFolder(filePath, _arguments, onlyArguments);
        }

        /**
         * File dialog properties.
         */
        export type FileDialogProperties = "openFile" | "openDirectory" | "multiSelections" | "showHiddenFiles";

        /**
         * File dialog options.
         */
        export type FileDialogOptions = {
            title?: string,
            defaultPath?: string,
            buttonLabel?: string,
            filters?: { name: string, extensions: string[] }[],
            properties?: FileDialogProperties[],
        }

        /**
         * Opens a file dialog.
         * 
         * @param options the options for the file dialog
         * 
         * @example
         * ```typescript
         * // Opening a file dialog
         * Common.IO.Dialog({
         *     title: "Open File",
         *     defaultPath: "path/to/file",
         *     buttonLabel: "Open",
         *     properties: ["openFile", "multiSelections"]
         * });
         * 
         * // Opening a directory dialog
         * Common.IO.Dialog({
         *     title: "Open Directory",
         *     defaultPath: "path/to/directory",
         *     buttonLabel: "Open",
         *     properties: ["openDirectory"]
         * });
         * ```
         */
        export function Dialog(options: FileDialogOptions): string[] { 
            Common.LifeCyclePing(true); // Prevents the application from auto-closing
            /* @ts-ignore */
            const result = electron.remote.dialog.showOpenDialogSync(options);
            if (!result) return [];

            return result;
        }

        /**
         * Gets the root folder of the application.
         * (__dirname)
         * 
         * @returns the root folder.
         * 
         * @example
         * ```typescript
         * // Getting the root folder
         * let rootFolder: string = Common.IO.GetRootFolder();
         * ```
         */
        export function GetRootFolder(): string {
            return __dirname;
        }

        /**
         * Gets the home directory of the user.
         * 
         * @returns the home directory
         * 
         * @example
         * ```typescript
         * // Getting the home directory
         * let homeDirectory: string = Common.IO.GetHomeDirectory();
         * ```
         */
        export function GetHomeDirectory(): string {
            return os.homedir();
        }

        /**
         * Combines multiple paths into one.
         * 
         * @param paths the paths to combine
         * @returns the combined path
         * 
         * @example
         * ```typescript
         * // Combining paths
         * let path: string = Common.IO.CombinePaths("path", "to", "file");
         * ```
         */
        export function CombinePaths(...paths: string[]): string {
            return path.join(...paths);
        }
    }

    /**
     * "Electron" provides a set of functions that can be used to interact with Electron.
     */
    export namespace Electron {

        /**
         * Opens a link in the default browser.
         * 
         * @param url the url to open
         * 
         * @example
         * ```typescript
         * // Opening a link
         * Common.Electron.OpenExternalLink("https://google.com");
         * ```
         */
        export function OpenExternalLink(url: string): void {
            electron.shell.openExternal(url);
        }

        /**
         * Gets the current window.
         * 
         * @returns the current window
         * 
         * @example
         * ```typescript
         * // Getting the current window
         * let window: BrowserWindow = Common.Electron.GetCurrentWindow();
         * ```
         */
        export function GetCurrentWindow(): BrowserWindow {
            /* @ts-ignore */
            return electron.remote.getCurrentWindow();
        }

        /**
         * Gets the current electron app.
         * 
         * @returns the current electron app
         * 
         * @example
         * ```typescript
         * // Getting the current electron app
         * let app: Electron.App = Common.Electron.GetApp();
         * ```
         */
        export function GetApp(): App {
            /* @ts-ignore */
            return electron.remote.app;
        }

        /**
         * Gets the current electron shell.
         * 
         * @returns the current electron shell
         * 
         * @example
         * ```typescript
         * // Getting the current electron shell
         * let shell: Electron.Shell = Common.Electron.GetShell();
         * ```
         */
        export function GetShell(): Shell {
            return electron.shell;
        }

        /**
         * Gets Electron
         * 
         * @returns Electron
         * 
         * @example
         * ```typescript
         * // Getting Electron
         * let electron: typeof globalThis.Electron.CrossProcessExports = Common.Electron.GetElectron();
         * ```
         */
        export function GetElectron(): typeof globalThis.Electron.CrossProcessExports {
            return electron;
        }

        /**
         * Gets the current electron clipboard.
         * 
         * @returns the current electron clipboard
         * 
         * @example
         * ```typescript
         * // Getting the current electron clipboard
         * let clipboard: Electron.Clipboard = Common.Electron.GetClipboard();
         * ```
         */
        export function GetClipboard(): globalThis.Electron.Clipboard {
            return electron.clipboard;
        }

        let Callbacks: { [key: string]: () => void } = {};
        /**
         * Registers a shortcut.
         * 
         * @param key the key to register
         * @param callback the callback to execute when the key is pressed
         * 
         * @example
         * ```typescript
         * // Registering a shortcut
         * Common.Electron.RegisterShortcut("F1", () => {
         *    console.log("F1 was pressed!");
         * });
         * ```
         */
        export function RegisterShortcut(key: globalThis.Electron.Accelerator, callback: () => void): void {
            if (AppSettings.GetSetting("DisabledShortcuts", false) && key.toString() !== AppSettings.GetSetting("DisableShortcut-Keybind", "F1")) {
                return; // Shortcuts are disabled
            }
            console.log(`Registering shortcut: ${key}`);

            electron.ipcRenderer.invoke('keybind:set', key);

            electron.ipcRenderer.on(`keybind:${key}`, callback);
            Callbacks[key.toString()] = callback;
        }

        /**
         * Unregisters a shortcut.
         * 
         * @param key the key to unregister
         * 
         * @example
         * ```typescript
         * // Unregistering a shortcut
         * Common.Electron.UnregisterShortcut("F1");
         * ```
         */
        export function UnregisterShortcut(key: globalThis.Electron.Accelerator): void {
            electron.ipcRenderer.invoke('keybind:unset', key);
            electron.ipcRenderer.removeAllListeners(`keybind:${key}`);
            delete Callbacks[key.toString()];
        }

        /**
         * Unregisters all shortcuts.
         * 
         * @example
         * ```typescript
         * // Unregistering all shortcuts
         * Common.Electron.UnregisterAllShortcuts();
         * ```
         */
        export function UnregisterAllShortcuts(): void {
            electron.ipcRenderer.invoke('keybind:unsetAll');
            for (const key in Callbacks) {
                electron.ipcRenderer.removeAllListeners(`keybind:${key}`);
            }
        }

        /**
         * Registers all callback saved shortcuts.
         * 
         * @example
         * ```typescript
         * // Registering all saved shortcuts
         * Common.Electron.RegisterAllShortcuts();
         * ```
         */
        export function RegisterAllShortcuts(): void {
            for (const key in Callbacks) {
                electron.ipcRenderer.invoke('keybind:set', key);
                electron.ipcRenderer.on(`keybind:${key}`, Callbacks[key]);
            }
        }

        /**
         * Gets a shortcut accelerator.
         * 
         * @param modifierOne Modifier one
         * @param modifierTwo Modifier two
         * @param key Key
         * @returns the accelerator
         * 
         * @example
         * ```typescript
         * // Getting a shortcut accelerator
         * let accelerator: globalThis.Electron.Accelerator = Common.Electron.GetShortCutAccelerator("Ctrl", "Shift", "F1");
         * ```
         */
        export function GetShortCutAccelerator(modifierOne: string, modifierTwo: string, key: string): globalThis.Electron.Accelerator {
            return `${modifierOne}${modifierOne ? "+" : ""}${modifierTwo}${modifierTwo ? "+" : ""}${key}`;
        }

        /**
         * Gets a shortcut accelerator from a string.
         * 
         * @param accelerator the accelerator string
         * @returns the accelerator
         * 
         * @example
         * ```typescript
         * // Getting a shortcut accelerator from a string
         * let accelerator: globalThis.Electron.Accelerator = Common.Electron.GetShortCutAcceleratorFromString("Ctrl+Shift+F1");
         * ```
         */
        export function GetShortCutAcceleratorFromString(accelerator: string): globalThis.Electron.Accelerator {
            return accelerator as globalThis.Electron.Accelerator;
        }

        /**
         * Deconstructs an accelerator.
         * 
         * @param accelerator the accelerator to deconstruct
         * @returns the deconstructed accelerator
         * 
         * @example
         * ```typescript
         * // Deconstructing an accelerator
         * let deconstructedAccelerator: { modifierOne: string, modifierTwo: string, key: string } = Common.Electron.DeconstructAccelerator("Ctrl+Shift+F1");
         * ```
         */
        // Not good but works.
        export function DeconstructAccelerator(accelerator: globalThis.Electron.Accelerator): { modifierOne: string, modifierTwo: string, key: string } {
            let parts = accelerator.split("+");

            if (parts.length == 1) return {
                modifierOne: "",
                modifierTwo: "",
                key: parts[0]
            };
            else if (parts.length == 2) return {
                modifierOne: parts[0],
                modifierTwo: "",
                key: parts[1]
            };
            else if (parts.length == 3) return {
                modifierOne: parts[0],
                modifierTwo: parts[1],
                key: parts[2]
            };

            return {
                modifierOne: "",
                modifierTwo: "",
                key: ""
            };
        }

        /**
         * Disables all shortcuts.
         * This function is mostly used just by the plugin but can be used if so wished.
         * 
         * @returns the action that was performed
         * 
         * @example
         * ```typescript
         * // Disabling all shortcuts
         * let action: string = Common.Electron.DisableAllShortcutsAction();
         * ```
         */
        export function DisableAllShortcutsAction(): string {
            let disabled: boolean = !AppSettings.GetSetting("DisabledShortcuts", false);
            AppSettings.SetSetting("DisabledShortcuts", disabled);
            return disabled ? "Enable" : "Disable";
        }

        /**
         * The function that is called when the disable all shortcuts button is pressed.
         * Or when the keyboard icon is pressed.
         * 
         * @param UnregisterAllKeybind the keybind that was pressed (optional)
         */
        export function RegisterShortCutKeybindFunction(UnregisterAllKeybind?: string): void {
            if (AppSettings.GetSetting('Debug', false)) console.log(`Pressed ${UnregisterAllKeybind ?? 'undefined (called from button)'}: ${AppSettings.GetSetting('DisabledShortcuts', true)}`);
            DisableAllShortcutsAction();
            
            UnregisterAllShortcuts();
            const indicationElement = document.querySelector('#shortcutsEnabledIndicator > img') as HTMLImageElement;

            if (AppSettings.GetSetting('DisabledShortcuts', false)) {
                RegisterUnregisterShortcut();
                if (indicationElement) indicationElement.src = "../src/assets/KeyboardOff.svg";
            }
            else {
                RegisterAllShortcuts();
                if (indicationElement) indicationElement.src = "../src/assets/KeyboardOn.svg";
            }

            //reload if on the moduleView
            if (indicationElement) location.reload();
        }

        /**
         * Registers the shortcut to disable all shortcuts.
         * 
         * @example
         * ```typescript
         * // Registering the shortcut to disable all shortcuts
         * Common.Electron.RegisterUnregisterShortcut();
         * ```
         */
        export function RegisterUnregisterShortcut(): void {
            const UnregisterAllKeybind = AppSettings.GetSetting("DisableShortcut-Keybind", "F1");

            RegisterShortcut(UnregisterAllKeybind, () => RegisterShortCutKeybindFunction(UnregisterAllKeybind));
        }
    }

    /**
     * Get a random hash.
     * 
     * @param byteAmount the amount of bytes to use
     * @returns the hash
     * 
     * @example
     * ```typescript
     * // Getting a random hash
     * let hash: string = Common.GetRandomHash(16);
     * ```
     */
    export function GetRandomHash(byteAmount: number, toHex: boolean = true): string {
        let bytes = crypto.randomBytes(byteAmount);
        if (toHex) return bytes.toString('hex');
        return bytes;
    }

    /**
     * Executes a command.
     * 
     * @param command the command to execute
     * @param workingDirectory the working directory of the command
     * 
     * @example
     * ```typescript
     * // Executing a command
     * Common.ExecuteCommand("npm install", "path/to/directory");
     * 
     * // Executing a command and getting the result
     * let result: ChildProcess = Common.ExecuteCommand("npm install", "path/to/directory");
     * ```
     */
    export function ExecuteCommand(command: string, workingDirectory: string): ChildProcess {
        let result: ChildProcess = exec(command, { cwd: workingDirectory }, (error: Error, stdout: string, stderr: string) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        return result;
    }

    /**
     * Formats a string with the given values.
     * 
     * @param string the string to format
     * @param values the values to format the string with
     * @returns the formatted string
     * 
     * @example
     * ```typescript
     * // Formatting a string
     * let formattedString: string = Common.FormatString("Hello {0}", "World");
     * ```
     */
    export function FormatString(string: string, ...values: string[]) {
        for (let index: number = 0; index < values.length; index++) {
            string = string.replace(`{${index}}`, values[index]);
        }
        return string;
    }

    /**
     * Gets the OS node module.
     * 
     * @returns the OS node module
     * 
     * @example
     * ```typescript
     * // Getting the OS node module
     * let os: typeof os = Common.GetOSModule();
     * ```
     */
    export function GetOSModule(): typeof os {
        return os;
    }

    /**
     * Gets the adm-zip node module.
     * 
     * @returns the adm-zip node module
     * 
     * @example
     * ```typescript
     * // Getting the adm-zip node module
     * let admZip: typeof AdmZip = Common.GetAdmZipModule();
     * ```
     */
    export function GetAdmZipModule() {
        return require('adm-zip');
    }

    /**
     * Pings the life cycle in the main electron process.
     * 
     * @param onlyClear If it should only clear a timeOut and not set a new one
     * 
     * @example
     * ```typescript
     * // Pinging the life cycle
     * Common.LifeCyclePing(false);
     * ```
     */
    export function LifeCyclePing(onlyClear: boolean): void {
        //Common.Electron.GetElectron().ipcRenderer.invoke('lifeCycle:ping', onlyClear);
    }
}