<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Text = <SettingTypes.Text>settingInfo.ExtraData;

    function OnInput(event): void {
        const settingInstance: Settings = GlobalSettings._ComponentSettings[componentID];
        settingInstance.Set(settingName, event.target.value);
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
    maxlength={extraData?.MaxLength || Infinity}
    minlength={extraData?.MinLength || 0}
    placeholder={extraData?.Placeholder || undefined}
    pattern={extraData?.Pattern || undefined}

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