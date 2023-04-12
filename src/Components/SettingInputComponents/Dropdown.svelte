<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Dropdown = <SettingTypes.Dropdown>settingInfo.ExtraData;

    const HandleInput = async () => {
        settingInfo.Value = (<HTMLSelectElement>document.querySelector("select")).value;

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            Event: window.event,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String
        });
    }

    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        const select = document.querySelector("select");
        select.value = settingInfo.Value;
        settingInfo.Value = settingInfo.Value;
    });
    
</script>

<select
    on:change={HandleInput}
>
{#if settingInfo.Value}
    <option value={settingInfo.Value}>{settingInfo.Value}</option>
{/if}

{#each extraData.Options as option}
    <option value={option}>{option}</option>
{/each}
</select>

<span></span>

<!--Add specific css rule for dropdown-->
<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;

    select {
        @include CI.SettingStyle;
        @include CI.SettingFocus;
    }
</style>