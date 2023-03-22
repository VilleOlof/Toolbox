import SettingsJSON from "../../Settings.json";

let GlobalSettings: Record<string, Record<string, SettingInfo>>;

function LoadGlobalSettings(): void {
    GlobalSettings = {};

    for (let componentID in SettingsJSON) {
        let settings = new Settings(componentID);
        settings.Load(SettingsJSON[componentID]);
        GlobalSettings[componentID] = settings.GetAll();
    }
}

enum SettingsType {
    Text = 0, // String
    Numeric = 1, // Number
    Checkbox = 2, // Boolean
    Slider = 3, // Number ( Min, Max, Step )
    Dropdown = 4, // String ( Array of options(string) )
    Color = 5, // String
    Date = 6, // Date
    RegExp = 7, // String
}

type SliderSetting = {
    Min: number;
    Max: number;
    Step: number;
}

type DropdownSetting = {
    Options: string[];
}

type SettingInfo = {
    Value: any;
    Type: SettingsType;
    Description: string;
    ExtraData?: SliderSetting | DropdownSetting;
}

class Settings {
    private _ComponentID: string;

    private _Settings: Record<string, SettingInfo>;

    constructor(componentID: string) {
        this._ComponentID = componentID;

        this._Settings = {};

        return this;
    }

    //RegisterSetting("TestSetting", "A value for testing", 5, SettingsType.Slider, { Min: 0, Max: 10, Step: 1 });
    public RegisterSetting(settingName: string, settingDescription: string, defaultValue: any, type: SettingsType, ExtraData?: SliderSetting | DropdownSetting, loadOldValues: boolean = true) {
        
        //a bit jank, copilot generated and had issues with loading old values before. but this works
        if (loadOldValues) {
            let oldSettings = Settings.GetSettingsByID(this._ComponentID);
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

        Settings.Save(this._ComponentID, this._Settings);
    }

    public Set(settingName: string, value: any) {
        this._Settings[settingName].Value = value;

        Settings.Save(this._ComponentID, this._Settings);
    }

    public Get(settingName: string): SettingInfo {
        return this._Settings[settingName];
    }

    public GetSettingValue(settingName: string, defaultValue?: any): any {
        return this._Settings[settingName]?.Value || defaultValue;
    }

    public GetAll(): Record<string, SettingInfo> {
        return this._Settings;
    }

    public static GetSettingsByID(componentID: string): Record<string, SettingInfo> {
        return GlobalSettings[componentID];
    }

    public Load(settingData: any): void {
        for (let key in settingData) {
            this._Settings[key] = settingData[key];
        }
    }

    public static SaveToJSON(JSON: string): void {
        const fs = require("fs");
        fs.writeFile(__dirname + "./../Settings.json", JSON, (err: any) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }

    public static Save(componentID: string, _Settings: Record<string, SettingInfo>): void {
        GlobalSettings[componentID] = _Settings;

        let settingsJSON: string = JSON.stringify(GlobalSettings, null, 4);

        Settings.SaveToJSON(settingsJSON);
    }

    public static DeleteComponentSettings(componentID: string): void {
        delete GlobalSettings[componentID];

        let _Settings: Record<string, SettingInfo> = Settings.GetSettingsByID(componentID);

        Settings.Save(componentID, _Settings);
    }

    public DeleteSetting(settingName: string): void {
        delete this._Settings[settingName];

        Settings.Save(this._ComponentID, this._Settings);
    }
}

export { Settings, SettingsType, LoadGlobalSettings, GlobalSettings };