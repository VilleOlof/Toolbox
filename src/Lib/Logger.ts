import { Common } from "./Common";

export namespace Logger {
    export type LogType = "info" | "warn" | "error" | "debug"; 

    let LogFile: string = "";

    export function Initialize(): void {
        console.log("Logger initialized");

        LogFile = `${Common.IO.GetRootFolder()}/../Logs/Toolbox-${GetDate()}.log`
    }

    function GetDate(_date?: Date): string {
        const date = _date ?? new Date();
        return `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    }

    function AppendToLogFile(message: string): void {
        Common.IO.AppendToFile(LogFile, message);
    }

    export function Log(message: string, type: LogType = "info", dontLogToFile: boolean = false): void {
        if (LogFile == "") console.error("Logger not initialized");
        
        switch (type) {
            case "info":
                console.log(`[INFO] ${message}`);
                break;
            case "warn":
                console.warn(`[WARN] ${message}`);
                break;
            case "error":
                console.error(`[ERROR] ${message}`);
                break;
            case "debug":
                console.debug(`[DEBUG] ${message}`);
                break;
        }

        if (!dontLogToFile) AppendToLogFile(`[${GetDate()}] [${type.toUpperCase()}] ${message}`);
    }

    export function LogAsJSON(input: any, type: LogType = "info"): void {
        console.log(`[${type.toUpperCase()}] ${JSON.stringify(input)}`);
    }
}

