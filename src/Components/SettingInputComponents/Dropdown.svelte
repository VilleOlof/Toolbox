<script lang="ts">
    import { onMount } from "svelte";
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Dropdown = <SettingTypes.Dropdown>settingInfo.ExtraData;

    let firstLoad: boolean = true;

    const HandleInput = async () => {
        if (firstLoad) return;
        settingInfo.Value = (<HTMLSelectElement>document.querySelector("select")).value;

        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            Event: window.event,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String
        });
    }

    onMount(() => {
        const select = document.querySelector("select");
        select.value = settingInfo.Value;

        firstLoad = false;
    });
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        const select = document.querySelector("select");
        select.value = settingInfo.Value;
        settingInfo.Value = settingInfo.Value;
    });
    
</script>
<!-- bind:value={settingInfo.Value} -->
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
    @use '../../scss/ComponentInputs';
</style>