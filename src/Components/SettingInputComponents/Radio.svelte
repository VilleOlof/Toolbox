<script lang="ts">
    import { SettingTypes, GlobalSettings } from "../../Lib/Settings";

    export let componentID: string;
    export let settingName: string;
    export let settingInfo: SettingTypes.Info;

    let extraData: SettingTypes.Radio = <SettingTypes.Radio>settingInfo.ExtraData;

    const HandleInput = () => {
        GlobalSettings.HandleSettingInput(<SettingTypes.SettingInput>{
            Event: window.event,
            ComponentID: componentID,
            SettingName: settingName,
            DefaultValue: settingInfo.Default,
            Type: SettingTypes.InputTypes.String,
            Validate: false
        });
    }
    
    const settings = GlobalSettings.GetComponentSettingsByID(componentID);
    settings.AddResetCallback(settingName, () => {
        settingInfo.Value = settingInfo.Value;
    });
    
</script>
 
{#each extraData.Options as option}
	<label>
		<input type=radio id={`${componentID}-radio`} bind:group={settingInfo.Value} on:change={HandleInput} name={extraData.name} value={option}>
		{option}
	</label>
{/each}

<span></span>

<style lang="scss">
    @use '../../scss/ComponentInputs';
</style>