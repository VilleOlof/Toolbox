<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.File = <SettingTypes.File>settingInfo.ExtraData;

    const HandleInput = async () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        CustomValue: (<HTMLInputElement>window.event.target).files[0],
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.Other,
        Save: false
    }); 
</script>

<input type="file"
    accept={extraData?.Accept ?? undefined}

    bind:value={settingInfo.Value}
    on:input={HandleInput}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs' as CI;
    @use '../../scss/Colors';

    input {
        @include CI.SettingStyle;
        @include CI.SettingFocus;

        &:hover {
            background-color: darken(Colors.$ColumnColor, 5%);
        }

        transition: background-color 0.2s;
    }
</style>