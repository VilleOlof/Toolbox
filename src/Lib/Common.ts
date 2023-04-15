const electron = require("electron");
const fs = require("fs");
const { exec } = require("child_process");

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
         */
        export function ReadFile<T>(path: string, json?: boolean): string | T {
            return "";
        }

        /**
         * Reads a directory from the file system.
         * 
         * @param path the path to the directory
         * @returns an array of file names
         */
        export function ReadDirectory(path: string): string[] {
            return [];
        }

        /**
         * Opens a folder in the file explorer.
         * 
         * @param path the path to the folder
         * @param _arguments any additional arguments to pass to the file explorer
         */
        export function OpenFolder(path: string, ..._arguments: string[]): void {

        }

        /**
         * Opens a file in the file explorer.
         * 
         * @param path the path to the file
         * @param _arguments any additional arguments to pass to the file explorer
         */
        export function OpenFile(path: string, ..._arguments: string[]): void {
            OpenFolder(path, ..._arguments);
        }

        /**
         * 
         */
        export function Dialog(): void {

        }

        /**
         * Gets the root folder of the application.
         * (__dirname)
         * 
         * @returns the root folder.
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
         */
        export function OpenExternalLink(url: string): void {
            electron.shell.openExternal(url);
        }

        /**
         * Gets the current window.
         * 
         * @returns the current window
         */
        export function GetCurrentWindow(): void {
            return electron.remote.getCurrentWindow();
        }
    }

    /**
     * Get a random hash.
     * 
     * @param byteAmount the amount of bytes to use
     * @returns the hash
     */
    export function GetRandomHash(byteAmount: number): string {
        return "";
    }

    /**
     * Executes a command.
     * 
     * @param command the command to execute
     * @param workingDirectory the working directory of the command
     */
    export function ExecuteCommand(command: string, workingDirectory: string): void {

    }
}