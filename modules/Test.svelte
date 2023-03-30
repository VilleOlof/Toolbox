<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';

    const componentID: string = "Test";

    const settings: Settings = GlobalSettings.GetInstance(componentID);

    settings.RegisterSetting('file', 'used to upload files',
        undefined,
        SettingTypes.Type.File,
        <SettingTypes.File>{
            Accept: ''
        }
    );

    setInterval(() => {
        console.log("a", settings.GetSettingValue('file'));
    }, 1000);

</script>