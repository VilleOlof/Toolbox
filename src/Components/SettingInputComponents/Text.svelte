<script lang="ts">
    import { SettingTypes, GlobalSettings, Settings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Text = <SettingTypes.Text>settingInfo.ExtraData;

    function HandleSettingInput(event: any, componentID: string, settingName: string): void {
        if (event.target.validity.valid === false) {
            return;
        }

        const settingInstance: Settings = GlobalSettings._ComponentSettings[componentID];
        settingInstance.Set(settingName, event.target.value || "");
    }
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
    on:input={() => HandleSettingInput(window.event, componentID, settingName)}
>
<span></span>

<style lang="scss">

    input:invalid + span::after {
        position: absolute;
        content: "✖";
        padding-left: 5px;
        color: #8b0000;
    }

</style>