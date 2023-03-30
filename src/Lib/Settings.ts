import SettingsJSON from "../../Settings.json";

/**
 * The global settings namespace.
 */
namespace GlobalSettings {

    /**
     * The global settings object.  
     * This holds all the settings for all the components.
     */
    export let _ComponentSettings: Record<string, Settings>;

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
        _ComponentSettings = {};

        for (let componentID in SettingsJSON) {
            let settings = new Settings(componentID);
            settings.Load(SettingsJSON[componentID]);
            _ComponentSettings[componentID] = settings;
        }
    }

    /**
     * Gets the settings for a component by ID in the GlobalSettings.  
     * Returns a new instance if the component ID is not found.  
     * This should **ALWAYS** be used to create / get a settings instance at startup.  
     * 
     * @param componentID The component ID.
     * 
     * @example
     * 
     * ```ts
     * let settings: Settings = GlobalSettings.GetInstance("ComponentID");
     * ```
     */
    export function GetInstance(componentID: string): Settings {
        return _ComponentSettings[componentID] ?? new Settings(componentID);
    }

    /**
     * Gets the settings for a component by ID in the GlobalSettings.
     * 
     * @param componentID The component ID.
     * 
     * @example
     * 
     * ```ts
     * let settings: Settings = GlobalSettings.GetComponentSettingsByID("ComponentID");
     * ```
     */
    export function GetComponentSettingsByID(componentID: string): Settings {
        return GlobalSettings._ComponentSettings[componentID];
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
    export function Save(componentID: string, _Settings: Settings): void {
        GlobalSettings._ComponentSettings[componentID] = _Settings;

        let settingsJSON: string = JSON.stringify(GlobalSettings._ComponentSettings, null, 4);

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

        delete GlobalSettings._ComponentSettings[componentID];
        SettingsInstance.DeleteAllLocalSettings();

        GlobalSettings.Save(componentID, SettingsInstance);

        SettingsInstance = undefined;
    }

    export async function HandleSettingInput(input: SettingTypes.SettingInput): Promise<void> {
        if (!ValidateSettingInput(input.Event)) return;

        let value: any = input.CustomValue ?? input.Event.target.value;

        if (input.Type == SettingTypes.InputTypes.Number) {
            value = parseFloat(value);
        } else if (input.Type == SettingTypes.InputTypes.Boolean) {
            value = value.checked; //??
        }
        else if (input.Type == SettingTypes.InputTypes.String) {
            value = value.toString();
        }

        const settingInstance: Settings = GlobalSettings._ComponentSettings[input.ComponentID];
        settingInstance.Set(input.SettingName, value ?? input.DefaultValue, input.Save ?? false);
    }

    export function ValidateSettingInput(event: any): boolean {
        return event.target.validity.valid;
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
        File = 7, // String
        Button = 8, // Function
    }

    /**
     * The extra data types.
     */
    export type ExtraDataTypes = 
      Text 
    | Numeric 
    | File 
    | Slider 
    | Dropdown 
    | Button;

    export enum InputTypes {
        String = "string",
        Number = "number",
        Boolean = "boolean",
        Other = undefined,
    }

    export type SettingInput = {
        Event: any;
        CustomValue?: any;
        ComponentID: string;
        SettingName: string;
        DefaultValue: any;
        Type: InputTypes;
        Save?: boolean;
    }
    
    /**
     * The setting info type.
     * 
     * @param Value The value of the setting.
     * @param Default The default value of the setting.
     * @param Type The type of the setting.
     * @param Description The description of the setting.
     * @param ExtraData Extra data for the setting.
     */
    export type Info = {
        Value: any;
        Default: any;
        Type: Type;
        Description: string;
        ExtraData?: ExtraDataTypes | undefined;
    }

    /**
     * The text extra data type.
     * 
     * @param MinLength The minimum length.
     * @param MaxLength The maximum length.
     * @param Placeholder The placeholder text.
     * @param List Makes a data list of the array. 
     */
    export type Text = {
        MinLength?: number;
        MaxLength?: number;
        Placeholder?: string;
        List?: string[];
        Pattern?: string;
    }

    export type Numeric = {
        Min?: number;
        Max?: number;
        Step?: number;
        Placeholder?: string;
        List?: number[];
    }

    export type File = {
        Accept?: string;
    }
    
    /**
     * The slider extra data type.
     * 
     * @param Min The minimum value of the slider.
     * @param Max The maximum value of the slider.
     * @param Step The step value of the slider.
     * @param List The list of values the slider can be.
     */
    export type Slider = {
        Min?: number;
        Max?: number;
        Step?: number;
        List?: number[];
    }
    
    /**
     * The dropdown extra data type.
     * 
     * @param Options The options of the dropdown.
     */
    export type Dropdown = {
        Options?: string[];
    }

    /**
     * The button extra data type.
     * 
     * @param Label The label of the button.
     * @param Function The function of the button.
     */
    export type Button = {
        Label?: string;
        Function?: Function;
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
     * *Don't use this directly, use [[GlobalSettings.GetInstance]] instead.*  
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

        GlobalSettings._ComponentSettings[componentID] = this;
        
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
            defaultValue = this.GetSettingValue(settingName, defaultValue);
        }

        this.SetSettingInfo(settingName, {
            Value: defaultValue,
            Default: defaultValue,
            Type: type,
            Description: settingDescription,
            ExtraData: ExtraData,
        });

        GlobalSettings.Save(this._ComponentID, this);
    }

    /**
     * Sets a setting value.
     * 
     * @param settingName The name of the setting
     * @param value The value to set the setting to
     * @param Save Whether to save the settings file (Optional)
     * 
     * @example
     * 
     * ```ts
     * settings.Set("Increment", 2);
     * ```
     */
    public Set<T>(settingName: string, value: T, Save: boolean = true): void {
        this._Settings[settingName].Value = value;

        if (Save) GlobalSettings.Save(this._ComponentID, this);
    }

    /**
     * Gets the setting information for a setting.
     * 
     * @param settingName The name of the setting
     * @param value The information to set the setting to
     * 
     * @example
     * 
     * ```ts
     * settings.SetSettingInfo("Increment", {
     *     Value: 2,
     *     Type: SettingTypes.Type.Numeric,
     *     Description: "The value to increment",
     *     ExtraData: undefined
     * });
     * ```
     */
    public SetSettingInfo(settingName: string, settingInfo: SettingTypes.Info): void {
        this._Settings[settingName] = settingInfo;

        GlobalSettings.Save(this._ComponentID, this);
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
        return this._Settings[settingName]?.Value ?? defaultValue;
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
    public Load(settings: any): void {
        for (let settingName in settings._Settings) {
            this.SetSettingInfo(settingName, settings._Settings[settingName]);
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

        GlobalSettings.Save(this._ComponentID, this);
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

        GlobalSettings.Save(this._ComponentID, this);
    }
}

export { Settings, SettingTypes, GlobalSettings };