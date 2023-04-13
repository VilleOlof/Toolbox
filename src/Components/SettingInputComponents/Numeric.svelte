<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Numeric = <SettingTypes.Numeric>settingInfo.ExtraData;

    const HandleInput = () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.Number
    });

    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;
    });
    
</script>

<datalist id={`${componentID}-${settingName}-list`}>
    {#if extraData?.List}
        {#each extraData.List as listEntry}
            <option value={listEntry} />
        {/each}
    {/if}
</datalist>

<input type="number"
    max={extraData?.Max ?? Infinity}
    min={extraData?.Min ?? 0}
    step={extraData?.Step ?? 1}
    placeholder={extraData?.Placeholder ?? undefined}
    list={`${componentID}-${settingName}-list`}

    bind:value={settingInfo.Value}
    on:input={HandleInput}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;

    input {
        @include CI.SettingStyle;
        @include CI.SettingFocus;
    }
</style>