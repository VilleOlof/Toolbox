import { ChildProcess } from "child_process";
import { App, BrowserWindow, Shell } from "electron";

const electron = require("electron");
const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

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