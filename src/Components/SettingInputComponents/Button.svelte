<script lang="ts">
    import { SettingTypes } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Button = <SettingTypes.Button>settingInfo.ExtraData;

    const HandleInput = () => extraData.Callback(componentID, settingName, settingInfo);
</script>

<button class="btnStyle"
    on:click={HandleInput}
>{extraData.Label}</button>

<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>