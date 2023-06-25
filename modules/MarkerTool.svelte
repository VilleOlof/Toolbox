<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { SML } from "../src/Lib/SharedModuleLogic";

    import { onDestroy, onMount, setContext } from 'svelte';

    const componentID: string = "MarkerTool";
    //Maybe optimize all the calls to get a timeline?

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small,
            "Used to create specific markers used by other modules."
        );

        Common.Electron.RegisterShortcut(StartMarkerShortcut, function StartMarkerKey() {
            SML.MarkerTool.CreateStartMarker();
        });

        Common.Electron.RegisterShortcut(EndMarkerShortcut, () => {
            SML.MarkerTool.CreateEndMarker();
        });
    });

    onDestroy(() => {
        Common.Electron.UnregisterShortcut(StartMarkerShortcut);
        Common.Electron.UnregisterShortcut(EndMarkerShortcut);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let MarkerColors: string[] = Object.keys(ResolveEnums.MarkerColor);
    let StartColor: string = _Settings.RegisterSetting("Start Marker Color", "The color of the first, start marker", "Green", SettingTypes.Type.Dropdown, <SettingTypes.Dropdown>{ Options: MarkerColors});
    let EndColor: string = _Settings.RegisterSetting("End Marker Color", "The color of the second, end marker", "Red", SettingTypes.Type.Dropdown, <SettingTypes.Dropdown>{ Options: MarkerColors});

    let StartMarkerShortcut: string = _Settings.RegisterSetting(
        'Start Marker Keybind', 
        'The keybind used to create the start marker', 
        '1', 
        SettingTypes.Type.Keybind, 
        <SettingTypes.Keybind>{defaultModifierOne: SettingTypes.KeybindModifier.Shift, defaultModifierTwo: SettingTypes.KeybindModifier.Alt}
    );
    let EndMarkerShortcut: string = _Settings.RegisterSetting(
        'End Marker Keybind', 
        'The keybind used to create the end marker', 
        '2', 
        SettingTypes.Type.Keybind, 
        <SettingTypes.Keybind>{defaultModifierOne: SettingTypes.KeybindModifier.Shift, defaultModifierTwo: SettingTypes.KeybindModifier.Alt}
    );

    function ClearBothMarkers(): void {
        let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
        if (!timeline) return;

        if (SML.MarkerTool.CheckIfMarkerExists(SML.MarkerTool.StartMarkerData)) timeline.DeleteMarkerByCustomData(SML.MarkerTool.StartMarkerData);
        if (SML.MarkerTool.CheckIfMarkerExists(SML.MarkerTool.EndMarkerData)) timeline.DeleteMarkerByCustomData(SML.MarkerTool.EndMarkerData);
    }

    _Datastore.Set("StartMarker", SML.MarkerTool.StartMarkerData);
    _Datastore.Set("EndMarker", SML.MarkerTool.EndMarkerData);

</script>


<main id={componentID}>
    <h1 id=title>Marker Tool</h1>

    <button id="startMarkerButton" class=markerButton on:click={SML.MarkerTool.CreateStartMarker}>Start</button>
    <button id="endMarkerButton" class=markerButton on:click={SML.MarkerTool.CreateEndMarker}>End</button>

    <button id="clearMarkersButton" on:click={ClearBothMarkers}>Clear Markers</button>
</main>


<style lang="scss">
    @use "../src/scss/Colors";
    @use "sass:color";

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #title {
        opacity: 0.5;
        font-size: 0.75rem;

        margin: 0.3rem;
        margin-bottom: 0;
    }

    // #startMarkerButton {
    //     background-color: var(--startColor);
    // }

    // #endMarkerButton {
    //     background-color: var(--endColor);
    // }

    #clearMarkersButton {
        margin: 0.5rem;
        margin-top: 1rem;
        padding: 0.25rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.75rem;

        &:hover {
            background-color: darken(Colors.$ColumnColor, 5%);
        }
    }

    .markerButton {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        margin: 0.35rem 0rem;

        min-width: 4rem;
        min-height: 2rem;

        cursor: pointer;

        transition: transform 0.1s ease-in-out;

        &:hover {
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }

</style>