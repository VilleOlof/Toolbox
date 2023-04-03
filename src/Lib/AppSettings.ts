import AppSettingsJSON from "../../AppSettings.json";

/**
 * AppSettings class
 * 
 * App settings are core-app settings for the plugin itself.
 * Not meant to change during the life time of the app.
 * And only through the AppSettings.json file.
 */
export class AppSettings {

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
        return AppSettingsJSON;
    }

    /**
     * Get a setting
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
        return AppSettingsJSON[key] ?? defaultValue;
    }

    /**
     * Get a nested setting
     * 
     * @param defaultValue The default value if the setting is not found
     * @param key The key(s) of the setting
     * @returns {T} The setting
     */
    public static GetNestedSetting<T>(defaultValue?: T, ...key: string[]): T {
        let value = AppSettingsJSON;
        for (const k of key) {
            value = value[k];
            if (value === undefined) {
                return defaultValue;
            }
        }
        return <T>value;
    }
}


