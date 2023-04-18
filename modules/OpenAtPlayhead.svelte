<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "OpenAtPlayhead";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small,
        "Opens the current file at the current playhead position in a new explorer window. ");
    });

    const OpenFileAtPlayhead = () => {
        const timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
        const currentItem = timeline.GetCurrentVideoItem();
        if (!currentItem) return;

        const filePath: string = currentItem.GetMediaPoolItem().GetClipProperty("File Path") as string;
        if (!filePath) return;

        Common.IO.OpenFolder("", ["/select,", filePath], true);
    }

</script>


<main id={componentID}>
    <h1 id=title>Open File At</h1>
    <h1 id=titleUnder>Playhead</h1>
    <button id=openFileButton on:click={OpenFileAtPlayhead}>
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h279v60H180v600h600V597h60v279q0 24-18 42t-42 18H180Zm202-219-42-43 398-398H519v-60h321v321h-60V319L382 717Z"/></svg>
    </button>
</main>


<style lang="scss">
    @use '../src/scss/Colors';
    
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        text-align: center;
    }

    #title {
        opacity: 0.5;
        font-size: 0.75rem;

        margin: 0.3rem;
        margin-bottom: 0;
    }

    #titleUnder {
        @extend #title;
        font-size: 1rem;

        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }

    #openFileButton {
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 0;
        margin: 0;

        color: Colors.$TextColor;

        &:hover {
            color: darken(Colors.$TextColor, 30%);
        }

        transition: color 0.2s;
    }
</style>