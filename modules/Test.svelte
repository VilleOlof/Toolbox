<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from '../src/Lib/Settings';

    const componentID: string = "Test";

    const settings: Settings = GlobalSettings.GetInstance(componentID);

    settings.RegisterSetting('sliderrrrrr', "weeeee", 0, SettingTypes.Type.Slider, <SettingTypes.Slider>{
        Min: 0,
        Max: 10,
        Step: 1,
        List: [1, 3, 5, 7, 9]
    });

</script>