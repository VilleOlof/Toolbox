<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';

    const componentID: string = "Test";

    const settings: Settings = GlobalSettings.GetInstance(componentID);

    function a(componentID: string, settingName: string, settingInfo: SettingTypes.Info): void {
        console.log(`button clicked! - ${componentID} - ${settingName}`);
    }

    let button: SettingTypes.Button = <SettingTypes.Button>{
        Label: 'Click me!',
        Callback: a
    };
    console.log(button);

    settings.RegisterSetting('buttooon!!', 'clicky click!',
        null,
        SettingTypes.Type.Button,
        button
    );

</script>