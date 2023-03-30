<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';

    const componentID: string = "Test";

    const settings: Settings = GlobalSettings.GetInstance(componentID);

    settings.RegisterSetting('dropdowny', 'dropping down',
        'option1',
        SettingTypes.Type.Dropdown,
        <SettingTypes.Dropdown>{
            Options: ['default', 'option1', 'option2', 'option3'],
            Multiple: false
        }
    );

</script>