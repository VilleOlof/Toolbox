<script lang="ts">
    import { onMount } from "svelte";
    import { SettingTypes, GlobalSettings, Settings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    function OnInput(event): void {
        //console.log(settingInfo);

        const settingInstance: Settings = GlobalSettings._ComponentSettings[componentID];
        settingInstance.Set(settingName, Number.parseInt(event.target.value));
        
        //console.log(settingInfo);
    }

    onMount(() => {
        // const input: HTMLInputElement = document.getElementById("inputField") as HTMLInputElement;
        // console.log(input);
        // input.value = GlobalSettings._ComponentSettings[componentID].GetSettingValue(settingName);
    });

</script>

<!--
    maxlength={settingInfo.ExtraData?.MaxLength || Infinity} 
    minlength={settingInfo.ExtraData?.MinLength || 0}
    placeholder={settingInfo.ExtraData?.Placeholder || undefined}
    list={settingInfo.ExtraData?.List || undefined}
    pattern={settingInfo.ExtraData?.Pattern || undefined}
-->

<input type="number" id="inputField"


    bind:value={settingInfo.Value}
    on:input={OnInput}
>
<span></span>

<style lang="scss">

    input:invalid + span::after {
        position: absolute;
        content: "✖";
        padding-left: 5px;
    }

</style>