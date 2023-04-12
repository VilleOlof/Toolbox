<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Text = <SettingTypes.Text>settingInfo.ExtraData;

    const HandleInput = () => GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
        Event: window.event,
        ComponentID: componentID,
        SettingName: settingName,
        DefaultValue: settingInfo.Default,
        Type: SettingTypes.InputTypes.String
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

<input type="text"
    maxlength={extraData.MaxLength ?? Infinity}
    minlength={extraData.MinLength ?? 0}
    placeholder={extraData.Placeholder ?? undefined}
    pattern={extraData.Pattern ?? undefined}
    list={extraData.List ? `${componentID}-${settingName}-list` : undefined}

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