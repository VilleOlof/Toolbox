<script lang="ts">
    import { onMount } from "svelte";
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Dropdown = <SettingTypes.Dropdown>settingInfo.ExtraData;

    const HandleInput = async () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.String
    });

    onMount(() => {
        const select = document.querySelector("select");
        select.value = settingInfo.Value;
    });
</script>

<select
    bind:value={settingInfo.Value}
    on:change={HandleInput}
>
{#if settingInfo.Value}
    <option value={settingInfo.Value} selected>{settingInfo.Value}</option>
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