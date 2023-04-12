<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    //let extraData: SettingTypes.Date = <SettingTypes.Date>settingInfo.ExtraData;
    const HandleInput = () => {
        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            Event: window.event,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;
    });
    
</script>

<input type="color" bind:value={settingInfo.Value} on:change={HandleInput}>

<!-- <div id=color>
    <ColorInput bind:color onInput={HandleInput}  showAlphaSlider={true} --input-width="260px" />
</div> -->

<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;

    input {
        @include CI.SettingStyle;
        @include CI.SettingFocus;

        width: 3rem;
        height: 3rem;
    }
</style>