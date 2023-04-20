<script lang="ts">
    import { ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onDestroy, onMount } from 'svelte';
  import { DataStore } from "../src/Stores/DataStore";

    const componentID: string = "Timecode";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
        "A module that displays the current timecode of the timeline");
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    let UpdateInterval: number = _Settings.RegisterSetting('Update Interval', 'How often the timecode should update (Seconds)', 1, SettingTypes.Type.Numeric, { Step: 0.1, Min: 0.1 });
    let StartOnZero: boolean = _Settings.RegisterSetting('Start On Zero', 'Start the timecode on 00:00:00:00', true, SettingTypes.Type.Checkbox);
    let BackgroundColor: string = _Settings.RegisterSetting('Background Color', 'Background color of the module', '#28282E', SettingTypes.Type.Color);
    let UseMarkerTool: boolean = _Settings.RegisterSetting('Use Marker Tool', 'Use the marker tool to set the starting point using the "start marker"', false, SettingTypes.Type.Checkbox);

    //check if the background color is dark or light and set the text color accordingly
    let textColor: string = "white";

    if (BackgroundColor != null) {
        let color = BackgroundColor.replace("#", "");
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(3, 2), 16);
        let b = parseInt(color.substring(5, 2), 16);

        let brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        if (brightness < 125) {
            textColor = "white";
        } else {
            textColor = "black";
        }
    }

    let timecode: string = "00:00:00:00";
    let oldResolveTimecode: string = "00:00:00:00";
    let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();

    ResolveFunctions.SubscribeToChange(ResolveFunctions.SubscribeTypes.Timeline, (newTimeline: Timeline) => {
        timeline = newTimeline;
        console.log("Timeline changed");
    });

    async function GetTimecode() {
        let resolveTimecode: string = timeline.GetCurrentTimecode();
        if (resolveTimecode == oldResolveTimecode) return;

        let framerate = ResolveFunctions.GetTimelineFramerate(timeline);
        let frames = ResolveFunctions.ConvertTimecodeToFrames(resolveTimecode, framerate);

        if (StartOnZero) {
            // removes an hour from the timecode //
            frames -= (60 * 60 * framerate)
        }
        if (UseMarkerTool) {
            let markerDatastore = DataStore.GetDataStoreByID('MarkerTool')
            if (!markerDatastore) return;
            let startMarkerData = markerDatastore.Get<string>('StartMarker');

            if (startMarkerData != null && ResolveFunctions.CheckIfMarkerExists(startMarkerData)) {
                frames -= ResolveFunctions.GetMarkerFrameID(startMarkerData, timeline);
                frames -= 1; //The marker duration is 1 frame
            }
        }

        //Prevent negative timecodes
        if (frames < 0) {
            frames = 0;
        }

        let timecodeString: string = ResolveFunctions.ConvertFramesToTimecode(frames, framerate);

        timecode = timecodeString;
        oldResolveTimecode = resolveTimecode;
    }

    GetTimecode();
    const interval = setInterval(GetTimecode, UpdateInterval * 1000);

    onDestroy(() => {
        clearInterval(interval);
    });

</script>

<main id={componentID} style="--text-color: {textColor}; --background-color: {BackgroundColor}">
    <h1>{timecode}</h1>
</main>

<style lang="scss">

    main {
        display: flex;
        flex-direction: column;

        background-color: var(--background-color);
        color: var(--text-color);
        
        text-align: center;

        max-width: 100%;
    }

    h1 {
        font-size: 3.25rem;

        margin: 0.25rem 0 0.5rem 0;
    }
</style>