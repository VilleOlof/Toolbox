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

    let KeyStrokeElement: HTMLInputElement;
    let ModifierOneElement: HTMLSelectElement;
    let ModifierTwoElement: HTMLSelectElement;

    let hoverText: HTMLDivElement;
        
    const HandleInput = (event) => {
        let key = KeyStrokeElement.value;

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
        const accelerator = Common.Electron.GetShortCutAccelerator(modifierOne, modifierTwo, KeyStrokeElement.value);

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            CustomValue: accelerator,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }

    function SetElements() {
        let accelerator = Common.Electron.DeconstructAccelerator(settingInfo.Value);

        KeyStrokeElement.value = accelerator.key

        ModifierOneElement.value = accelerator.modifierOne;

        ModifierTwoElement.value = accelerator.modifierTwo;
    }

    onMount(() => {
        SetElements();
    });
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;
        let accelerator = Common.Electron.DeconstructAccelerator(settingInfo.Default);

        KeyStrokeElement.value = accelerator.key

        modifierOne = accelerator.modifierOne
        modifierTwo = accelerator.modifierTwo

        ModifierOneElement.value = accelerator.modifierOne;
        ModifierTwoElement.value = accelerator.modifierTwo;
    });
    
</script>

<main>
    <select id={`${componentID}-${settingName}-modifierOne`} bind:this={ModifierOneElement} bind:value={modifierOne} on:change={ModifierChange}>
        <option value="">None</option>
    
        <option value="Alt">Alt</option>
        <option value="CommandOrControl">Ctrl</option>
        <option value="Shift">Shift</option>
    </select>
    +
    <select id={`${componentID}-${settingName}-modifierTwo`}  bind:this={ModifierTwoElement} bind:value={modifierTwo} on:change={ModifierChange}>
        <option value="">None</option>
    
        <option value="Alt">Alt</option>
        <option value="CommandOrControl">Ctrl</option>
        <option value="Shift">Shift</option>
    </select>
    +
    <input type="text" id={`${componentID}-${settingName}-keyStrokes`} bind:this={KeyStrokeElement} on:change={HandleInput} maxlength=1>
    <span></span>
    <img src="../src/assets/Info.svg" alt="Info" class=keybindInfo 
        on:mouseenter={() => { hoverText.style.display = 'block' }}
        on:mouseleave={() => { hoverText.style.display = 'none' }}
    >
    <div id="hoverText" bind:this={hoverText}>
        <p>A keybind set through the plugin will disable its normal behavior.</p>
    </div>
</main>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;
    
    main {
        display: flex;
        align-items: center;
    }

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

    .keybindInfo {
        filter: invert(100%);

        cursor: pointer;

        width: 1.5rem;
        height: 1.5rem;

        margin-left: 0.5rem;

        &:hover {
            filter: invert(60%);
        }

        transition: filter 0.2s ease-in-out;
    }

    #hoverText {
        background-color: #1A1A1A;

        border-radius: 0.25rem;
        border: 0.15rem solid darken(#1A1A1A, 3%);

        filter: drop-shadow(0 0 0.25em #0000005e);

        position: absolute;
        display: none;

        white-space: nowrap;

        top: 4rem;
        left: 10rem;

        p {
            padding: 0 0.3rem;
            margin: 0.2rem;
        }
    }
</style>