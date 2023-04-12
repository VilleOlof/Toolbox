<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Slider = <SettingTypes.Slider>settingInfo.ExtraData;

    const HandleInput = async () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.Number,
        Save: false
    });

    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;
    });
    
</script>

{#if extraData.List !== undefined}
    <datalist id={`${componentID}-${settingName}-list`}>
        {#each extraData.List as listEntry}
            <option value={listEntry} />
        {/each}
    </datalist>
{/if}

<input type="range"
    max={extraData.Max ?? Infinity}
    min={extraData.Min ?? 0}
    step={extraData.Step ?? 1}
    list={extraData.List ? `${componentID}-${settingName}-list` : undefined}

    bind:value={settingInfo.Value}
    on:input={HandleInput}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>