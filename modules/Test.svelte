<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { onMount } from 'svelte';

    const componentID: string = "Test";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small);
    });

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

    settings.RegisterSetting('dropdowntest', 'used for dropping',
        'test',
        SettingTypes.Type.Dropdown,
        <SettingTypes.Dropdown>{
            Options: ['test', 'test2', 'test3']
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