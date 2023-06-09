import { AppSettings } from "./AppSettings"
import { Common } from "./Common"
import { Resolve } from "./DavinciResolve"
import { Logger } from "./Logger"
import { ModuleHandler } from "./ModuleHandler"

/**
 * Used to send statistics to the backend.
 */
export namespace Statistics {
    const backendAdress: string = "https://api.olofspelar.se/toolboxStatistics"

    type StatRequest = {
        Type: "startup",
        ModulesUsed: string[],
        ResolveVersion: string,
        ToolboxVersion: string,
        OS: string,
        CountryCode: string,
    }

    /**
     * Sends statistics to the backend.
     */
    export function SendStatisticsOnStartup(): void {
        if (!AppSettings.GetSetting("DataCollection", true)) return;

        const os = Common.GetOSModule();
        const request: StatRequest = {
            Type: "startup",
            ModulesUsed: Object.keys(ModuleHandler.RegisteredModules),
            ResolveVersion: Resolve.GetVersionString(),
            ToolboxVersion: AppSettings.GetMetadata().Version,
            OS: `${os.type()}-${os.platform()}`,
            CountryCode: Common.Electron.GetApp().getLocaleCountryCode(),
        }

        fetch(backendAdress, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        })

        Logger.Log('Sent Statistics To Backend [startup]', 'info', 'file');
    }
}