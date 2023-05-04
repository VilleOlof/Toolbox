import { Common } from "./Common";

export namespace Logger {
    export const LogType = {
        "info": "info", 
        "warn": "warn", 
        "error": "error", 
        "debug": "debug"
    } as const;
    export type LogType = keyof typeof LogType;

    export const LogLocation = {
        "console": "console",
        "file": "file"
    } as const;
    export type LogLocation = keyof typeof LogLocation;

    export type LogValueTypes = string | number | boolean | object | any[] | undefined;

    let LogFile: string = "";
    let Init: boolean = false;
    export let allowedTypes: LogType[] = Object.values(LogType);

    export function Initialize(): void {
        if (Init) return;
        LogFile = `${Common.IO.GetRootFolder()}/../Logs/Toolbox-${GetDate()}.log`

        DeleteOldZips(7); // Delete all logs older than 7 days
        CompressLogs(20); // Compress all logs if there are more than 20

        if (!Common.IO.FileExists(LogFile)) Common.IO.WriteFile(LogFile, `[LOG INIT: ${GetDate(undefined, false)}]\n\n`);

        // Log all uncaught errors
        onerror = (message, source, lineno, colno, error) => {
            Log(`${message}: '${error}' (${source}:${lineno}:${colno})`, LogType.error, LogLocation.file);
        }

        Init = true;
    }

    function CompressLogs(latestX: number) {
        const logs = Common.IO.GetFiles(`${Common.IO.GetRootFolder()}/../Logs/`, ".log");
        if (logs.length <= latestX) return;
        
        const AdmZip = Common.GetAdmZipModule();
        const zip = new AdmZip();

        for (const log of logs) {
            zip.addLocalFile(log);
        }

        zip.writeZip(`${Common.IO.GetRootFolder()}/../Logs/Toolbox-Logs-${GetDate()}.zip`);

        for (const log of logs) {
            Common.IO.DeleteFile(log);
        }
    }

    function DeleteOldZips(days: number) {
        const zips = Common.IO.GetFiles(`${Common.IO.GetRootFolder()}/../Logs/`, ".zip");
        const now = new Date().getTime();
        const daysInMS = days * 24 * 60 * 60 * 1000;

        for (const zip of zips) {
            const zipDate = new Date(Common.IO.GetFileLastModified(zip)).getTime();
            if (now - zipDate > daysInMS) {
                Common.IO.DeleteFile(zip);
            }
        }
    }

    function GetDate(_date?: Date, fileFriendly: boolean = true): string {
        const d_split = "-";
        const h_split = fileFriendly ? "_" : ":";

        const date = _date ?? new Date();
        let finalString = ""; // Really ugglyyyyyy
        finalString += date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        finalString += d_split;
        finalString += date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
        finalString += d_split;
        finalString += date.getFullYear();
        finalString += " ";
        finalString += date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        finalString += h_split;
        finalString += date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        finalString += h_split;
        finalString += date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        return finalString;
    }

    export function Log(message: LogValueTypes, type: LogType = LogType.debug, locations: LogLocation[] | LogLocation = [LogLocation.console, LogLocation.file]): void {
        //If logger is not initialized, return
        if (LogFile == "") console.error("Logger not initialized");
        //If type is not allowed, return
        if (!allowedTypes.includes(type)) return;

        //If locations is a single string, convert it to an array
        if (!Array.isArray(locations)) locations = [locations];
        
        //Log to whatever:
        if (locations.includes("console")) LogToConsole(message, type);
        if (locations.includes("file")) AppendToLogFile(message, type);
    }

    export function LogToConsole(message: LogValueTypes, type: LogType = "info"): void {
        message = `[${type.toUpperCase()}] ${message}`
        switch (type) {
            case "info":
                console.log(message); break;
            case "warn":
                console.warn(message); break;
            case "error":
                console.error(message); break;
            case "debug":
                console.debug(message); break;
            default: break;
        }
    }

    function AppendToLogFile(message: LogValueTypes, type: LogType): void {
        //If message is an object, convert it to a string
        if (typeof message == "object") message = JSON.stringify(message);
        if (Array.isArray(message)) message = JSON.stringify(message);

        message = `[${GetDate(undefined, false)}] [${type.toUpperCase()}] ${message}`;
        message += "\n"; // Add a new line

        Common.IO.AppendToFile(LogFile, message);
    }

    export function LogAsJSON(input: any, type: LogType = "info"): void {
        console.log(`[${type.toUpperCase()}] ${JSON.stringify(input)}`);
    }
}

