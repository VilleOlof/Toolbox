<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Date = <SettingTypes.Date>settingInfo.ExtraData;

    const HandleInput = () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.String
    });
</script>

<input type="date"
    max={extraData.Max ?? Infinity}
    min={extraData.Min ?? 0}
    step={extraData.Step ?? 1}

    bind:value={settingInfo.Value}
    on:input={HandleInput}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>