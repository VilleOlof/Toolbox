<script lang="ts">
    import { DataStore } from "../src/Stores/DataStore";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    const componentID: string = "Notes";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
        "Allows you to write notes and save them between sessions (Or not!).");
    });

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let _ResetOnStart = _Settings.RegisterSetting("Reset On Start", "Resets the notes content upon start", false, SettingTypes.Type.Checkbox);
    let _Height = _Settings.RegisterSetting("Height", "Height of the notes box (Rows)", 7, SettingTypes.Type.Numeric);

    let Notes = _Datastore.Get<string>("Notes", "");

    $: {
        _Datastore.Set("Notes", Notes);
    }

    if (_ResetOnStart) {
        Notes = "";
    }

</script>


<main id={componentID}>
    <p>Notes</p>
    <textarea name="Notes" id="Notes" cols="15" rows={_Height} bind:value={Notes}></textarea>
</main>


<style lang="scss">
    @use "../src/scss/Colors";

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    textarea {
        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        font-family: "Roboto", sans-serif;

        outline: none;

        resize: vertical;

        max-width: 100%;

        margin: 0.5rem;
    }

    p {
        color: Colors.$TextColor;
        font-family: "Roboto", sans-serif;

        font-size: 1rem;
        opacity: 0.5;

        margin: 0.25rem 0.25rem 0rem 0.55rem;
    }
</style>