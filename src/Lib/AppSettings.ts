import { Common } from "./Common";
import { Logger } from "./Logger";

/**
 * AppSettings class
 * 
 * App settings are core-app settings for the plugin itself.
 * These are not visible in the plugin settings page.
 */
export class AppSettings {

    /**
     * Is the AppSettings class initialized
     */
    private static _Init: boolean = false;

    /**
     * The AppSettings.json file
     */
    private static AppSettingsJSON: any;
    private static Metadata: AppSettings.Metadata;

    /**
     * Initialize the AppSettings class
     * Should only be called once by the plugin itself at startup.
     * 
     * @returns {boolean} True if the class is initialized
     */
    public static Init(): boolean {
        if (this._Init) return this._Init;

        this._Init = true;

        this.AppSettingsJSON = Common.IO.ReadFile(
            Common.IO.GetRootFolder() + "/../AppSettings.json", 
            true
        );

        this.Metadata = Common.IO.ReadFile(
            Common.IO.GetRootFolder() + "/../Metadata.json",
            true
        );

        Logger.Log("AppSettings initialized", 'info', 'file');

        return this._Init;
    }

    /**
     * Get all settings
     * 
     * @returns {any} All settings
     * 
     * @example
     * 
     * ```ts
     * const settings = AppSettings.GetAllSettings();
     * ```
     */
    public static GetAllSettings(): any {
        return this.AppSettingsJSON;
    }

    /**
     * Get a setting
     * Sets the value to the default value if the setting is not found
     * 
     * @param key The key of the setting
     * @param defaultValue The default value if the setting is not found
     * @returns {T} The setting
     * 
     * @example
     * 
     * ```ts
     * const setting: string = AppSettings.GetSetting<string>("mySetting", "defaultValue");
     * ```
     */
    public static GetSetting<T>(key: string, defaultValue?: T): T {
        if (this.AppSettingsJSON[key] === undefined) this.SetSetting(key, defaultValue); 
        return this.AppSettingsJSON[key] ?? defaultValue;
    }

    /**
     * Set a setting
     * 
     * @param key The key of the setting
     * @param value The value of the setting
     */
    public static SetSetting<T>(key: string, value: T): T {
        this.AppSettingsJSON[key] = value;
        this.Save();
        return value;
    }

    /**
     * Saves the AppSettings to file
     */
    private static Save(): void {
        Common.IO.WriteFile(
            Common.IO.GetRootFolder() + "/../AppSettings.json", 
            this.AppSettingsJSON, 
            true
        );
    }

    /**
     * Get the metadata
     * 
     * @returns {this.Metadata} The metadata
     */
    public static GetMetadata(): any {
        return this.Metadata;
    }
}

/**
 * AppSettings namespace
 */
export namespace AppSettings {

    /**
     * AppSettings metadata
     */
    export type Metadata = {
        PluginID: string,
        Version: string,
    }
}


