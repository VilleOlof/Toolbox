<script lang="ts">
  import { onMount } from "svelte";
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";
    import Keystroke from "svelte-keystroke";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    //let extraData: SettingTypes.Keybind = <SettingTypes.Keybind>settingInfo.ExtraData;

    const HandleInput = (detail: any) => {
        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        if (!keyStrokeText) return;
        if (!keyStrokeText.matches(':focus')) return;

        let key = detail;

        keyStrokeText.value = "";

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            CustomValue: key,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }

    onMount(() => {
        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        keyStrokeText.value = settingInfo.Value;
    });
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;

        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        if (!keyStrokeText) return;
        keyStrokeText.value = settingInfo.Value;
    });
    
</script>

<input type="text" id={`${componentID}-keyStrokes`}>
<!-- on:combo={ ({ detail }) => HandleInput(detail)} -->
<Keystroke on:stroke={ ({ detail }) => HandleInput(detail)}></Keystroke>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;

    input {
        @include CI.SettingStyle;
        @include CI.SettingFocus;
    }
</style>