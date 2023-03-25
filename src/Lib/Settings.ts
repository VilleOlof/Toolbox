import SettingsJSON from "../../Settings.json";

/**
 * The global settings namespace.
 */
namespace GlobalSettings {

    /**
     * The global settings object.  
     * This holds all the settings for all the components.
     */
    // Maybe take settings instances instead of _Settings Record type?;
    export let _Settings: Record<string, Record<string, SettingTypes.Info>>;

    /**
     * Loads all the global settings.  
     * This should be called when the app starts.
     * 
     * @example
     * 
     * ```ts
     * GlobalSettings.LoadGlobalSettings();
     * ```
     */
    export function LoadGlobalSettings(): void {
        _Settings = {};

        for (let componentID in SettingsJSON) {
            let settings = new Settings(componentID);
            settings.Load(SettingsJSON[componentID]);
            _Settings[componentID] = settings.GetAllComponentSettings();
        }
    }

    /**
     * Gets the settings for a component by ID in the GlobalSettings.
     * 
     * @param componentID The component ID.
     * 
     * @example
     * 
     * ```ts
     * let settings: Record<string, SettingTypes.Info> = GlobalSettings.GetComponentSettingsByID("ComponentID");
     * ```
     */
    export function GetComponentSettingsByID(componentID: string): Record<string, SettingTypes.Info> {
        return GlobalSettings._Settings[componentID];
    }

    /**
     * Saves the settings to the JSON file.
     * 
     * @param JSON The JSON string to save.
     * @param SettingsPath The path to the settings file.
     * 
     * @example
     * 
     * ```ts
     * let settingsJSON: string = JSON.stringify(GlobalSettings._Settings, null, 4);
     * GlobalSettings.SaveToJSON(settingsJSON);
     * ```
     */
    export function SaveToJSON(JSON: string, SettingsPath: string = "./../Settings.json"): void {
        const fs = require("fs");
        SettingsPath = __dirname + SettingsPath;

        fs.writeFileSync(SettingsPath, JSON, (err: any) => {
            if (err) console.error(err);
        });
    }

    /**
     * Saves the settings to the GlobalSettings.
     * 
     * @param componentID The component ID.
     * @param _Settings The settings to save.
     * 
     * @example
     * 
     * ```ts
     * let componentID: string = settings.GetComponentID();
     * GlobalSettings.Save(componentID, settings);
     * ```
     */
    export function Save(componentID: string, _Settings: Record<string, SettingTypes.Info>): void {
        GlobalSettings._Settings[componentID] = _Settings;

        let settingsJSON: string = JSON.stringify(GlobalSettings._Settings, null, 4);

        GlobalSettings.SaveToJSON(settingsJSON);
    }

    /**
     * Deletes an entire component's settings.  
     * Including its instance.
     * 
     * @param SettingsInstance The settings instance to delete. 
     * 
     * @example
     * 
     * ```ts
     * GlobalSettings.DeleteComponentSettings(settings);
     * ```
     */
    export function DeleteComponentSettings(SettingsInstance: Settings ): void {
        let componentID = SettingsInstance.GetComponentID();

        delete GlobalSettings._Settings[componentID];
        SettingsInstance.DeleteAllLocalSettings();

        let _Settings: Record<string, SettingTypes.Info> = GlobalSettings.GetComponentSettingsByID(componentID);

        SettingsInstance = undefined;

        GlobalSettings.Save(componentID, _Settings);
    }
}

/**
 * The settings type namespace.
 * Holds all enums and types for the settings.
 */
namespace SettingTypes {

    /**
     * The type of setting.
     * 
     * @enum
     */
    export enum Type {
        Text = 0, // String
        Numeric = 1, // Number
        Checkbox = 2, // Boolean
        Slider = 3, // Number ( Min, Max, Step )
        Dropdown = 4, // String ( Array of options(string) )
        Color = 5, // String
        Date = 6, // Date
        RegExp = 7, // String
        File = 8, // String
        Button = 9, // Function
    }

    /**
     * The extra data types.
     */
    export type ExtraDataTypes = Slider | Dropdown | Button;
    
    /**
     * The setting info type.
     * 
     * @param Value The value of the setting.
     * @param Type The type of the setting.
     * @param Description The description of the setting.
     * @param ExtraData Extra data for the setting.
     */
    export type Info = {
        Value: any;
        Type: Type;
        Description: string;
        ExtraData?: ExtraDataTypes;
    }
    
    /**
     * The slider extra data type.
     * 
     * @param Min The minimum value of the slider.
     * @param Max The maximum value of the slider.
     * @param Step The step value of the slider.
     */
    export type Slider = {
        Min: number;
        Max: number;
        Step: number;
    }
    
    /**
     * The dropdown extra data type.
     * 
     * @param Options The options of the dropdown.
     */
    export type Dropdown = {
        Options: string[];
    }

    /**
     * The button extra data type.
     * 
     * @param Label The label of the button.
     * @param Function The function of the button.
     */
    export type Button = {
        Label: string;
        Function: Function;
    }
}

/**
 * The settings class.  
 * Used to Save/Load & Register settings for a component.  
 * Registered settings will show up in the settings menu.  
 */
class Settings {

    /**
     * The settings constructor.
     * 
     * @constructor
     * @param componentID The ID of the component that the settings are for.
     * 
     * @example
     * 
     * ```ts
     * let settings: Settings = new Settings("ComponentID");
     * ```
     */
    constructor(componentID: string) {
        this._ComponentID = componentID;

        this._Settings = {};

        return this;
    }

    /**
     * The ID of the component that the settings are for.
     */
    private _ComponentID: string;

    /**
     * The settings that are stored for the component.
     */
    private _Settings: Record<string, SettingTypes.Info>;

    /**
     * Registers a setting.
     * 
     * @param settingName The name
     * @param settingDescription The description
     * @param defaultValue The default value
     * @param type The type of the setting input
     * @param ExtraData Extra data for the setting type (Optional)
     * @param loadOldValues Whether to load old values from the settings file (Optional)
     * 
     * @example
     * ```ts
     *  // Basic example:
     *  settings.RegisterSetting("Increment", "The value to increment", 1, SettingTypes.Type.Numeric);
     * 
     *  // Slider example:
     *  settings.RegisterSetting("Default Zoom", "The default zoom level", 1.5, SettingTypes.Type.Slider, {
     *      Min: 0.5,
     *      Max: 2,
     *      Step: 0.1
     *  });
     *
     *  // Button example:
     *  settings.RegisterSetting("Reset", "Resets the settings", null, SettingTypes.Type.Button, {
     *      Label: "Reset",
     *      Function: () => {
     *          settings.DeleteAllLocalSettings();
     *      }
     *  });
     * ```
     */
    public RegisterSetting(settingName: string, settingDescription: string, defaultValue: any, type: SettingTypes.Type, ExtraData?: SettingTypes.ExtraDataTypes, loadOldValues: boolean = true) {
        
        //a bit jank, copilot generated and had issues with loading old values before. but this works
        if (loadOldValues) {
            let oldSettings = GlobalSettings.GetComponentSettingsByID(this._ComponentID);
            if (oldSettings) {
                let oldSetting = oldSettings[settingName];
                if (oldSetting) {
                    defaultValue = oldSetting.Value;
                }
            }
        }

        this._Settings[settingName] = {
            Value: defaultValue,
            Type: type,
            Description: settingDescription,
            ExtraData: ExtraData,
        };

        GlobalSettings.Save(this._ComponentID, this._Settings);
    }

    /**
     * Sets a setting value.
     * 
     * @param settingName The name of the setting
     * @param value The value to set the setting to
     * 
     * @example
     * 
     * ```ts
     * settings.Set("Increment", 2);
     * ```
     */
    public Set(settingName: string, value: any) {
        this._Settings[settingName].Value = value;

        GlobalSettings.Save(this._ComponentID, this._Settings);
    }

    /**
     * Gets the setting info for specified setting.
     * 
     * @param settingName The name of the setting
     * 
     * @example
     * 
     * ```ts
     * let settingInfo: SettingTypes.Info = settings.GetSettingInfo("Increment");
     * ```
     */
    public GetSettingInfo(settingName: string): SettingTypes.Info {
        return this._Settings[settingName];
    }

    /**
     * Gets the value of a setting.
     * 
     * @param settingName The name of the setting
     * @param defaultValue The default value to return if the setting doesn't exist (Optional)
     * 
     * @example
     * 
     * ```ts
     * let increment: number = settings.GetSettingValue<number>("Increment");
     * ```
     */
    public GetSettingValue<T>(settingName: string, defaultValue?: T): T {
        return this._Settings[settingName]?.Value || defaultValue;
    }

    /**
     * Gets all the settings for the component.
     * 
     * @example
     * 
     * ```ts
     * let allSettings: Record<string, SettingTypes.Info> = settings.GetAllComponentSettings();
     * ```
     */
    public GetAllComponentSettings(): Record<string, SettingTypes.Info> {
        return this._Settings;
    }

    /**
     * Gets the component ID of the current instance.
     * 
     * @example
     * 
     * ```ts
     * let componentID: string = settings.GetComponentID();
     * ```
     */
    public GetComponentID(): string {
        return this._ComponentID;
    }

    /**
     * Loads the settings from "JSON".
     * 
     * @param settingData The setting data to load
     * 
     * @example
     * 
     * ```ts
     * settings.Load({
     *  Increment: 4
     * });
     * ```
     */
    public Load(settingData: any): void {
        for (let key in settingData) {
            this._Settings[key] = settingData[key];
        }
    }

    /**
     * Deletes a setting.
     * 
     * @param settingName The name of the setting 
     * 
     * @example
     * 
     * ```ts
     * settings.DeleteSetting("Increment");
     * ```
     */
    public DeleteSetting(settingName: string): void {
        delete this._Settings[settingName];

        GlobalSettings.Save(this._ComponentID, this._Settings);
    }

    /**
     * Deletes all the settings for the component.
     * 
     * @example
     * 
     * ```ts
     * settings.DeleteAllLocalSettings();
     * ```
     */
    public DeleteAllLocalSettings(): void {
        delete this._Settings

        GlobalSettings.Save(this._ComponentID, this._Settings);
    }
}

export { Settings, SettingTypes, GlobalSettings };