<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "ProgressTracker";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "Tracks your progress in the timeline and shows it in a progress bar\nContent Proccessed: The progress from start to end\nVideo Progress: The progress from start to a set amount of minutes"
        );

        CalculateContentProccessed();
        CalculateVideoProgress();

        setInterval(() => {
            CalculateContentProccessed();
            CalculateVideoProgress();
        }, _Interval * 1000);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID); 

    let _UseMarkerTool = _Settings.RegisterSetting("UseMarkerTool", "Uses the marker tool for finding the start or end if there is a marker", true, SettingTypes.Type.Checkbox);
    let _Interval = _Settings.RegisterSetting("Interval", "The interval in seconds to update the progress (Seconds)", 1, SettingTypes.Type.Numeric, <SettingTypes.Numeric>{Min: 0.1, Step: 0.1});

    let ContentProccessedPercentange: number = 0;
    let ContentProccessedText: string = "0%";

    let VideoProgressPercentange: number = 0;
    let VideoProgressText: string = "0%";
    let VideoProgressTargetMinutes: number = _Datastore.Get<number>("VideoProgressTargetMinutes", 10);

    $: _Datastore.Set("VideoProgressTargetMinutes", VideoProgressTargetMinutes);

    let currenTimeline = ResolveFunctions.GetCurrentTimeline();
    ResolveFunctions.SubscribeToChange(ResolveFunctions.SubscribeTypes.Timeline, (timeline: Timeline) => {
        currenTimeline = timeline;
    });

    let MarkerToolDatastore: DataStore;

    function GetStartFrame(): number {
        let startFrame: number = 0;

        if (_UseMarkerTool) {
            MarkerToolDatastore = MarkerToolDatastore ?? DataStore.GetDataStoreByID('MarkerTool');
            if (!MarkerToolDatastore) return startFrame;
            const markerData = MarkerToolDatastore.Get<string>('StartMarker');

            const startMarker: ResolveFunctions.CheckMarker = ResolveFunctions.CheckIfMarkerExists(markerData, true);
            if (!startMarker.Exists) return startFrame;

            return startMarker.MarkerData.frameId;
        }

        return startFrame;
    }

    function GetEndFrame(): number {
        let endFrame: number = currenTimeline.GetEndFrame() - currenTimeline.GetStartFrame();

        if (_UseMarkerTool) {
            MarkerToolDatastore = MarkerToolDatastore ?? DataStore.GetDataStoreByID('MarkerTool');
            if (!MarkerToolDatastore) return endFrame;
            const markerData = MarkerToolDatastore.Get<string>('EndMarker');

            const endMarker: ResolveFunctions.CheckMarker = ResolveFunctions.CheckIfMarkerExists(markerData, true);
            if (!endMarker.Exists) return endFrame;

            return endMarker.MarkerData.frameId;
        }

        return endFrame;
    }

    let OldTimecodeContentProccessed: string = "";
    function CalculateContentProccessed(): void {
        const currentTimecode = currenTimeline.GetCurrentTimecode();
        if (OldTimecodeContentProccessed == currentTimecode) return;
        OldTimecodeContentProccessed = currentTimecode;

        const startFrame: number = GetStartFrame();
        const endFrame: number = GetEndFrame();

        const currentFrame: number = ResolveFunctions.ConvertTimecodeToFrames(currentTimecode) - currenTimeline.GetStartFrame();

        const totalFrames: number = endFrame - startFrame;

        const percentage: number = (currentFrame / totalFrames) * 100;

        //if percentage is higher than 100% set it to 100%
        if (percentage > 100) {
            ContentProccessedPercentange = 100;
            ContentProccessedText = "100%";
            return;
        }

        ContentProccessedPercentange = percentage;
        ContentProccessedText = `${Math.round(percentage)}%`;
    }

    let OldTimecodeVideoProgress: string = "";
    function CalculateVideoProgress(): void {   
        const currentTimecode = currenTimeline.GetCurrentTimecode();
        if (OldTimecodeVideoProgress == currentTimecode) return;
        OldTimecodeVideoProgress = currentTimecode;

        let framerate = ResolveFunctions.GetTimelineFramerate(currenTimeline);
        const startFrame: number = GetStartFrame();
        const endFrame: number = VideoProgressTargetMinutes * 60 * framerate;

        const currentFrame: number = ResolveFunctions.ConvertTimecodeToFrames(currentTimecode) - currenTimeline.GetStartFrame();

        const totalFrames: number = endFrame - startFrame;

        const percentage: number = (currentFrame / totalFrames) * 100;

        //if percentage is higher than 100% set it to 100%
        if (percentage > 100) {
            VideoProgressPercentange = 100;
            VideoProgressText = "100%";
            return;
        }

        VideoProgressPercentange = percentage;
        VideoProgressText = `${Math.round(percentage)}%`;
    }

</script>


<main id={componentID}>
    <div id="contentProccessed">
        <div id="barInfo">
            <p>{ContentProccessedText}</p>
            <h1>Content Proccessed</h1>
        </div>
        
        <progress id="contentProccessedSlider" value={ContentProccessedPercentange} max="100"></progress>
    </div>

    <div class=lineBreak></div>

    <div id=videoProgress>
        <div id="barInfo">
            <p>{VideoProgressText}</p>
            <h1>Video Progress</h1>
            <input type="number" id="videoProgressLength" bind:value={VideoProgressTargetMinutes}>
        </div>

        <progress id=videoProgressSlider value={VideoProgressPercentange} max="100"></progress>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;
    }

    #contentProccessed {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;

        h1 {
            margin: 0.5rem;

            font-size: 1.5rem;
        }

        progress {
            width: 95%;
        }

        & > #barInfo {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            width: 100%;

            margin: 0.5rem;
            margin-top: 0;

            p {
                margin: 0;

                font-size: 1.25rem;
            }
        }
    }

    #videoProgress {
        @extend #contentProccessed;

        & > #barInfo {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            width: 90%;
        }
    }

    progress {
        background-color: Colors.$BackgroundColor;

        width: 100%;
        margin-bottom: 0.5rem;

        &::-webkit-progress-bar {
            background-color: Colors.$BackgroundColor;
        }

        &::-webkit-progress-value {
            background-color: #6dff5f;
        }
    }

    input[type=number] {
        width: 2.5rem;
        height: 1.5rem;

        border: none;
        border-radius: 0.25rem;

        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        padding-left: 0.25rem;

        outline: none;
    }

    .lineBreak {
        width: 90%;
        height: 0.2rem;

        margin: 0.25rem 0;

        background-color: Colors.$BackgroundColor;
    }

</style>