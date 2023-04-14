<script lang="ts">
    import { ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onDestroy, onMount } from 'svelte';

    const componentID: string = "Timecode";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    let UpdateInterval: number = _Settings.RegisterSetting('Update Interval', 'How often the timecode should update (Seconds)', 1, SettingTypes.Type.Numeric, { Step: 0.1, Min: 0.1 });
    let StartOnZero: boolean = _Settings.RegisterSetting('Start On Zero', 'Start the timecode on 00:00:00:00', true, SettingTypes.Type.Checkbox);
    let BackgroundColor: string = _Settings.RegisterSetting('Background Color', 'Background color of the module', '#28282E', SettingTypes.Type.Color);
    let ShowTitle: boolean = _Settings.RegisterSetting('Show Title', 'Show the title of the module', true, SettingTypes.Type.Checkbox);

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

        let hours: number = +resolveTimecode.substring(0, 2);
        let minutes: number = +resolveTimecode.substring(3, 5);
        let seconds: number = +resolveTimecode.substring(6, 8);
        let frames: number = +resolveTimecode.substring(9, 11);

        if (StartOnZero) hours -= 1;

        let timecodeString: string = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;

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
    {#if ShowTitle}
        <p>{componentID}</p>
    {/if}
    <h1>{timecode}</h1>
</main>

<style lang="scss">

    main {
        display: flex;
        flex-direction: column;

        background-color: var(--background-color);
        color: var(--text-color);
        
        text-align: center;
    }

    p {
        margin: 0.5rem 0 0 0;

        opacity: 0.5;
    }

    h1 {
        font-size: 3.25rem;

        margin: 0.25rem 0 0.5rem 0;
    }
</style>