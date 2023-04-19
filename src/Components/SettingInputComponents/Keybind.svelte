<script lang="ts">
    import { onMount } from "svelte";
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";
    import Keystroke from "svelte-keystroke";
    import { Common } from "../../Lib/Common";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Keybind = <SettingTypes.Keybind>settingInfo.ExtraData;

    let modifierOne: string = extraData.defaultModifierOne;
    let modifierTwo: string = extraData.defaultModifierTwo;

    const HandleInput = (detail: any) => {
        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        if (!keyStrokeText) return;
        if (!keyStrokeText.matches(':focus')) return;

        let key = detail;

        keyStrokeText.value = "";

        const accelerator = Common.Electron.GetShortCutAccelerator(modifierOne, modifierTwo, key);

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            CustomValue: accelerator,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }

    const ModifierChange = () => {
        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        if (!keyStrokeText) return;

        const accelerator = Common.Electron.GetShortCutAccelerator(modifierOne, modifierTwo, keyStrokeText.value);

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            CustomValue: accelerator,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }

    onMount(() => {
        let accelerator = Common.Electron.DeconstructAccelerator(settingInfo.Value);

        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        keyStrokeText.value = accelerator.key

        const modifierOneSelect = document.querySelector(`#${componentID}-modifierOne`) as HTMLSelectElement;
        modifierOneSelect.value = accelerator.modifierOne;

        const modifierTwoSelect = document.querySelector(`#${componentID}-modifierTwo`) as HTMLSelectElement;
        modifierTwoSelect.value = accelerator.modifierTwo;
    });
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;

        const keyStrokeText = document.querySelector(`#${componentID}-keyStrokes`) as HTMLInputElement;
        if (!keyStrokeText) return;
        keyStrokeText.value = settingInfo.Value;

        modifierOne = extraData.defaultModifierOne ?? "";
        modifierTwo = extraData.defaultModifierTwo ?? "";
    });
    
</script>

<select id={`${componentID}-modifierOne`} bind:value={modifierOne} on:change={ModifierChange}>
    <option value="">None</option>

    <option value="alt">Alt</option>
    <option value="ctrl">Ctrl</option>
    <option value="shift">Shift</option>
</select>
+
<select id={`${componentID}-modifierTwo`} bind:value={modifierTwo} on:change={ModifierChange}>
    <option value="">None</option>

    <option value="alt">Alt</option>
    <option value="ctrl">Ctrl</option>
    <option value="shift">Shift</option>
</select>
+
<input type="text" id={`${componentID}-keyStrokes`}>
<!-- on:combo={ ({ detail }) => HandleInput(detail)} -->
<Keystroke on:stroke={ ({ detail }) => HandleInput(detail)}></Keystroke>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;

    input {
        @include CI.SettingStyle;
        @include CI.SettingFocus;

        max-width: 5.5rem;
    }

    select {
        @include CI.SettingStyle;
        @include CI.SettingFocus;

        max-width: 5.5rem;
    }
</style>