<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    //let extraData: SettingTypes.Date = <SettingTypes.Date>settingInfo.ExtraData;

    const HandleInput = () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        CustomValue: (<HTMLInputElement>window.event.target).checked,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.Other
    });
</script>

<input type="checkbox"
    bind:checked={settingInfo.Value}
    on:input={HandleInput}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>