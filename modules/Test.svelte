<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { onMount } from 'svelte';

    const componentID: string = "Test";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small);
    });

    const settings: Settings = GlobalSettings.GetInstance(componentID);

    let button: SettingTypes.Button = <SettingTypes.Button>{
        Label: 'Click me!',
        Callback: (componentID: string, settingName: string, settingInfo: SettingTypes.Info) => {
            console.log(`button clicked! - ${componentID} - ${settingName}`);
        }
    };
    settings.RegisterSetting('buttooon!!', 'clicky click!',
        null,
        SettingTypes.Type.Button,
        button
    );

    settings.RegisterSetting('dropdowntest', 'used for dropping',
        'test',
        SettingTypes.Type.Dropdown,
        <SettingTypes.Dropdown>{
            Options: ['test', 'test2', 'test3']
        }
    );

    settings.RegisterSetting('colorp', 'color picker',
        '#000000',
        SettingTypes.Type.Color,
        null
    );

    settings.RegisterSetting('dateee', 'wooo', "2023-04-13",
        SettingTypes.Type.Date,
        null
    );

    settings.RegisterSetting('boooolaeenee', 'true or false', true,
        SettingTypes.Type.Checkbox,
        null
    );

    settings.RegisterSetting('radio', 'hallå hallå',
        'test',
        SettingTypes.Type.Radio,
        <SettingTypes.Radio>{
            Options: ['test', 'test2', 'test3']
        }
    );

    settings.RegisterSetting('keyy', 'keybind!',
        'q',
        SettingTypes.Type.Keybind,
        <SettingTypes.Keybind>{
            placeholder: 'attack key'
        }
    );

</script>

<main id={componentID}>
    <p>This is a test module</p>
</main>

<style lang="scss">

    main {
        background-color: #fff;
        color: #000;

        text-align: center;
        overflow-wrap: break-word;
    }

</style>