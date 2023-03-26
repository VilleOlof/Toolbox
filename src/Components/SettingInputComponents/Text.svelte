<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    function OnInput(event): void {
        // console.log(settingInfo);

        // console.log(componentID, settingName, event.target.value)
        // const componentSettings = GlobalSettings._ComponentSettings[componentID];
        // componentSettings.Set(settingName, event.target.value)
        
        // console.log(settingInfo);
    }
</script>

<!--
    maxlength={settingInfo.ExtraData?.MaxLength || Infinity} 
    minlength={settingInfo.ExtraData?.MinLength || 0}
    placeholder={settingInfo.ExtraData?.Placeholder || undefined}
    list={settingInfo.ExtraData?.List || undefined}
    pattern={settingInfo.ExtraData?.Pattern || undefined}
-->

<input type="text" 


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