<!--
    This is an example
    this module wont be loaded

    This is a basic module which will count the amount of
    items in the timeline and display it on the screen

    Aswell as saving it to the DataStore
-->

<script lang="ts">
    import { onDestroy } from "svelte";
    import { Resolve } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";
    import { DataStore } from "../src/Stores/DataStore";

    // Local variables to store the amount of items in the timeline and their respective video type
    let timelineItems: number = 0;
    let videoItems: number = 0;
    let audioItems: number = 0;

    // Create a new DataStore
    const Data = new DataStore('TimelineCounter', true);

    // Assigns the number of items in the timeline to the variable if it already exists
    if (Data.Get<number>('timelineItems')) {
        timelineItems = Data.Get('timelineItems');

        videoItems = Data.Get('videoItems');
        audioItems = Data.Get('audioItems');
    }

    // Subscribe to the DataStore
    Data.Subscribe('timelineItems', (items: number) => {
        timelineItems = items;
    });

    // Get the amount of items in the timeline for each track
    const GetTimelineItems = () => {
        const timeline: Timeline = Resolve.GetProjectManager().GetCurrentProject().GetCurrentTimeline();

        const videoTracks: number = timeline.GetTrackCount(ResolveEnums.TrackType.Video);
        const audioTracks: number = timeline.GetTrackCount(ResolveEnums.TrackType.Audio);

        let totalItems: number = 0;

        videoItems = 0;
        audioItems = 0;

        for (let i = 1; i < videoTracks; i++) {
            const items = timeline.GetItemListInTrack(ResolveEnums.TrackType.Video, i);

            totalItems += items.length - 1;
            videoItems += items.length - 1;
        }

        for (let i = 1; i < audioTracks; i++) {
            const items = timeline.GetItemListInTrack(ResolveEnums.TrackType.Audio, i);

            totalItems += items.length - 1;
            audioItems += items.length - 1;
        }

        return totalItems;
    }

    // Delete the DataStore when the module is destroyed
    onDestroy(() => {
        DataStore.DeleteDataStore(Data);
    });

    // Update the DataStore every second
    setInterval(() => {
        const items = GetTimelineItems();

        Data.Set('timelineItems', items);
        Data.Set('videoItems', videoItems);
        Data.Set('audioItems', audioItems);
    }, 1000);
</script>

<main>
    <p>Amount of timeline items: <b>{timelineItems}</b></p>
    <p>Video Tracks: <b>{videoItems}</b> | Audio Tracks: <b>{audioItems}</b></p>
</main>

<style lang="scss">

</style>