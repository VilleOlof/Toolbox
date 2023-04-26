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
        export function WriteFile(path: string, content: any, json?:boolean, stringifyContentDefault: boolean = true): void {
            if ((json || typeof content != "string") && stringifyContentDefault) content = JSON.stringify(content, null, 4);
            
            fs.writeFileSync(path, content, "utf8");
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
         * Checks if a file exists.
         * 
         * @param path the path to the file
         * @returns true if the file exists
         */
        export function FileExists(path: string): boolean {
            return fs.existsSync(path);
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
         */
        export function GetHomeDirectory(): string {
            return os.homedir();
        }

        /**
         * Combines multiple paths into one.
         * 
         * @param paths the paths to combine
         * @returns the combined path
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
         */
        export function GetShell(): Shell {
            return electron.shell;
        }

        /**
         * Gets the current electron clipboard.
         * 
         * @returns the current electron clipboard
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
         */
        export function UnregisterShortcut(key: globalThis.Electron.Accelerator): void {
            electron.ipcRenderer.invoke('keybind:unset', key);
            electron.ipcRenderer.removeAllListeners(`keybind:${key}`);
            delete Callbacks[key.toString()];
        }

        /**
         * Unregisters all shortcuts.
         */
        export function UnregisterAllShortcuts(): void {
            electron.ipcRenderer.invoke('keybind:unsetAll');
            for (const key in Callbacks) {
                electron.ipcRenderer.removeAllListeners(`keybind:${key}`);
            }
        }

        /**
         * Registers all callback saved shortcuts.
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
         */
        export function GetShortCutAccelerator(modifierOne: string, modifierTwo: string, key: string): globalThis.Electron.Accelerator {
            return `${modifierOne}${modifierOne ? "+" : ""}${modifierTwo}${modifierTwo ? "+" : ""}${key}`;
        }

        /**
         * Gets a shortcut accelerator from a string.
         * 
         * @param accelerator the accelerator string
         * @returns the accelerator
         */
        export function GetShortCutAcceleratorFromString(accelerator: string): globalThis.Electron.Accelerator {
            return accelerator as globalThis.Electron.Accelerator;
        }

        /**
         * Deconstructs an accelerator.
         * 
         * @param accelerator the accelerator to deconstruct
         * @returns the deconstructed accelerator
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
         */
        export function DisableAllShortcutsAction(): string {
            let disabled: boolean = !AppSettings.GetSetting("DisabledShortcuts", false);
            AppSettings.SetSetting("DisabledShortcuts", disabled);
            return disabled ? "Enable" : "Disable";
        }

        export function RegisterUnregisterShortcut(): void {
            const UnregisterAllKeybind = AppSettings.GetSetting("DisableShortcut-Keybind", "F1");

            RegisterShortcut(UnregisterAllKeybind, () => {
                if (AppSettings.GetSetting('Debug')) console.log(`Pressed ${UnregisterAllKeybind}: ${AppSettings.GetSetting('DisabledShortcuts')}`);
                DisableAllShortcutsAction();
                
                UnregisterAllShortcuts();

                if (AppSettings.GetSetting('DisabledShortcuts', false)) {
                    RegisterUnregisterShortcut();
                }
                else {
                    RegisterAllShortcuts();
                }
            });
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
     */
    export function FormatString(string: string, ...values: string[]) {
        for (let index: number = 0; index < values.length; index++) {
            string = string.replace(`{${index}}`, values[index]);
        }
        return string;
    }
}