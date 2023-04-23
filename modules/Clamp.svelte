<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "Clamp";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small,
            "Used to clamp a video to fit the screen border exactly."
        );

        Common.Electron.RegisterShortcut(clampKeybind, () => {
            Clamp();
        });
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    let trackAmount = _Settings.RegisterSetting(
        'Tracks', 
        'The amount of tracks to clamp (1->)', 
        1, 
        SettingTypes.Type.Numeric, 
        <SettingTypes.Numeric>{ Min: 1 }
    );

    let clampKeybind = _Settings.RegisterSetting(
        'Clamp Keybind', 
        'The key to clamp the video', 
        '3', 
        SettingTypes.Type.Keybind, 
        <SettingTypes.Keybind>{ 
            defaultModifierOne: SettingTypes.KeybindModifier.Shift, 
            defaultModifierTwo: SettingTypes.KeybindModifier.Alt
        }
    );

    function Clamp() {
        const currentTimeline = ResolveFunctions.GetCurrentTimeline();
        const currentProject = ResolveFunctions.GetCurrentProject();
        const timelineTrackAmount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

        for (let currentTrackIndex = 1; currentTrackIndex <= trackAmount; currentTrackIndex++) {
            if (currentTrackIndex >= timelineTrackAmount) {
                return;
            }

            const currentTrackItems = currentTimeline.GetItemListInTrack(ResolveEnums.TrackType.Video, currentTrackIndex);

            const playHeadPosition = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());

            for (let item of currentTrackItems) {
                if (item === undefined) continue;

                let itemStart = item.GetStart();
                let itemEnd = item.GetEnd();

                if (playHeadPosition >= itemStart && playHeadPosition <= itemEnd) {
                    // Clamp the item, still a bit unsure how this exactly works but its from old scripts.
                    //should also take crop into account but that is not implemented yet.

                    const ZoomLevel = item.GetProperty("ZoomX") as number;
                    const PanLevel = item.GetProperty("Pan") as number;
                    const TiltLevel = item.GetProperty("Tilt") as number;

                    const TimelineResolutionX = parseInt(currentProject.GetSetting('timelineResolutionWidth')) / 2;
                    const TimelineResolutionY = parseInt(currentProject.GetSetting('timelineResolutionHeight')) / 2;

                    const Pan = TimelineResolutionX * (ZoomLevel - 1);
                    const Tilt = TimelineResolutionY * (ZoomLevel - 1);

                    if (Math.abs(PanLevel) > Pan) {
                        const newPan = Pan * (PanLevel < 0 ? -1 : 1);
                        item.SetProperty("Pan", newPan);
                    }

                    if (Math.abs(TiltLevel) > Tilt) {
                        const newTilt = Tilt * (TiltLevel < 0 ? -1 : 1);
                        item.SetProperty("Tilt", newTilt);
                    }
                }
            }
        }
    }

</script>


<main id={componentID}>
    <button id="clampButton" on:click={Clamp}>Clamp</button>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #clampButton {
        width: 4rem;
        height: 3rem;

        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;
        font-size: 1rem;

        border: none;
        border-radius: 0.5em;

        margin: 0.25rem;

        cursor: pointer;

        outline: none;

        transition: transform 0.1s ease-in-out;

        &:hover {
            transform: scale(0.9)
        }

        &:active {
            transform: scale(0.8)
        }
    }

</style>