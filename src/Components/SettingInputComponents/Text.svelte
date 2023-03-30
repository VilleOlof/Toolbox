<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Text = <SettingTypes.Text>settingInfo.ExtraData;
</script>

{#if extraData.List !== undefined}
    <datalist id={`${componentID}-${settingName}-list`}>
        {#each extraData.List as listEntry}
            <option value={listEntry} />
        {/each}
    </datalist>
{/if}

<input type="text"
    maxlength={extraData.MaxLength || Infinity}
    minlength={extraData.MinLength || 0}
    placeholder={extraData.Placeholder || undefined}
    pattern={extraData.Pattern || undefined}
    list={extraData.List ? `${componentID}-${settingName}-list` : undefined}

    bind:value={settingInfo.Value}
    on:input={() => GlobalSettings.HandleSettingInput(window.event, componentID, settingName, settingInfo.Default, SettingTypes.InputTypes.String)}
>
<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>