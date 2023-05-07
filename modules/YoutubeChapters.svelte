<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { scale } from "svelte/transition";

    const componentID: string = "YoutubeChapters";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "Create Youtube chapter text based on markers in the timeline.",
        );
    });

    const _Settings = GlobalSettings.GetInstance(componentID);
    const _Datastore = new DataStore(componentID);

    const markerColor: ResolveEnums.MarkerColor = _Settings.RegisterSetting('Marker Color', 'What color to search for when looking for markers.', ResolveEnums.MarkerColor.Rose, SettingTypes.Type.Dropdown, <SettingTypes.Dropdown>{ Options: Object.keys(ResolveEnums.MarkerColor)});
    const UseMarkerTool: boolean = _Settings.RegisterSetting('Use Marker Tool', 'Use the marker tool to set the starting point using the "start marker"', false, SettingTypes.Type.Checkbox);

    let StartMarkerName = _Datastore.Get<string>('DefaultMarkerName', 'Start')
    $: _Datastore.Set('DefaultMarkerName', StartMarkerName);

    type ModuleMarker = {
        name: string;
        frameID: number;
    }

    function GetAllMarkerData(): ModuleMarker[] {
        let markers: ModuleMarker[] = [];

        const currentTimeline = ResolveFunctions.GetCurrentTimeline();
        const allMarkersInTimeline= currentTimeline.GetMarkers();

        //marker at the start is at -1 for some reason and thus last;
        if (allMarkersInTimeline[-1] !== undefined) {
            allMarkersInTimeline[0] = allMarkersInTimeline[-1];
            delete allMarkersInTimeline[-1];
        }

        let frameOffset: number = 0;
        if (UseMarkerTool) {
            let markerDatastore = DataStore.GetDataStoreByID('MarkerTool')
            if (!markerDatastore) return;
            let startMarkerData = markerDatastore.Get<string>('StartMarker');

            let Marker: ResolveFunctions.CheckMarker = ResolveFunctions.CheckIfMarkerExists(startMarkerData, true);
            if (startMarkerData != null && Marker.Exists) frameOffset = Marker.MarkerData.frameId;
        }

        for (const [frameId, markerData] of Object.entries(allMarkersInTimeline)) {
            if (markerData.color != markerColor) continue;

            markers.push({
                name: markerData.name,
                frameID: ((parseInt(frameId)) + 1) - frameOffset
            });
        }

        return markers;
    }

    function FormatFrameToYTTimecode(frame: number): string {
        //format should be MM:SS
        const seconds = Math.floor(frame / ResolveFunctions.GetTimelineFramerate());
        const minutes = Math.floor(seconds / 60);

        const secondsString = (seconds % 60).toString().padStart(2, '0');
        const minutesString = minutes.toString().padStart(2, '0');

        return `${minutesString}:${secondsString}`;
    }
    
    function GetTimeRanges(markers: ModuleMarker[]): {[key: string]: string} {
        let timeRanges: {[key: string]: string} = {};

        //if the first marker isnt on frame 0, add one to the start
        if (markers[0].frameID > 1) {
            timeRanges[StartMarkerName] = FormatFrameToYTTimecode(0);
        }

        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            timeRanges[marker.name] = FormatFrameToYTTimecode(marker.frameID);
        }

        return timeRanges;
    }

    function GetFinalText(timeRanges: {[key: string]: string}): string {
        let finalText: string = "";

        for (const [name, timeRange] of Object.entries(timeRanges)) {
            //if its the last one, dont add a new line
            if (Object.keys(timeRanges).indexOf(name) == Object.keys(timeRanges).length - 1) {
                finalText += `${timeRange} - ${name}`;
                continue;
            }

            finalText += `${timeRange} - ${name}\n`;
        }

        return finalText;
    }

    let ShowNotis = false;
    function ShowCopiedNotification(): void {
        ShowNotis = true;

        setTimeout(() => {
            ShowNotis = false;
        }, 3000);
    }

    function RunModule(): void {
        const markers: ModuleMarker[] = GetAllMarkerData();
        const timeRanges: {[key: string]: string} = GetTimeRanges(markers);
        const text: string = GetFinalText(timeRanges);
        
        const clipboard = Common.Electron.GetClipboard();
        clipboard.writeText(text);

        ShowCopiedNotification();
    }

</script>


<main id={componentID}>
    <div id="mainWrapper">
        {#if ShowNotis}
            <div id=notification transition:scale|local>
                <p>Copied To Clipboard!</p>
            </div>
        {/if}

        <h1 id=title>Youtube Chapters</h1>

        <div id=inputContainer>
            <label for="startInput">Default Start Chapter Name</label>
            <input type="text" name="startInput" id="" placeholder="The First Chapter Name" bind:value={StartMarkerName}>
        </div>
    
        <div id=markerColorAndButton>
            <div id=markerColorContainer>
                <p>Marker Color:</p>
                <p id=markerColor style={`--markerText: #${ResolveFunctions.GetMarkerColorInHex(markerColor)}`}>
                    <b>{markerColor}</b>
                </p>
            </div>

            <button id=ChapterButton on:click={RunModule}>Get Chapters</button>
        </div>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    #mainWrapper {
        margin: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    #markerColorAndButton {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;

        width: 100%;
    }

    #ChapterButton {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    #inputContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin: 0.4rem 0;
        width: 100%;

        input {
            @extend #ChapterButton;

            max-width: 4rem;

            margin-left: 1rem;
            
            &:hover {
                background-color: darken(Colors.$ColumnColor, 3%);
            }
            &:focus {
                background-color: Colors.$BackgroundColor;
            }
        }
    }

    #title {
        opacity: 0.5;
        font-size: 1.25rem;
        margin: 0;
    }

    #markerColorContainer {
        display: flex;
        align-items: center;

        p {
            margin: 0.4rem 0;
        }
    }

    #markerColor {
        color: var(--markerText);
        margin-left: 0.5rem !important;
    }

    #notification {
        position: absolute;
        top: -18%;
        left: 0;

        width: 100%;
        background-color: Colors.$BackgroundColor;

        display: flex;
        justify-content: center;

        p {
            margin: 0.2rem 0;
        }

        border-top-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
    }
</style>