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
        
        ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackAmount, currentTimeline, (item, trackIndex) => {
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
        });
    }

</script>


<main id={componentID}>
    <h1 id=title>Clamp</h1>
    <button id="clampButton" on:click={Clamp}>
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M109.086 946.914v-230.74h79.218v151.522h151.522v79.218h-230.74Zm511.088 0v-79.218h151.522V716.174h79.783v230.74H620.174ZM284.739 725.74 230.999 673l59.087-59.652h-221v-75.261h221L230.999 479l53.74-53.305L434.479 576l-149.74 149.74Zm391.087 0L526.087 576l149.739-150.305L729.566 479l-59.087 59.087h221v75.261h-221L729.566 673l-53.74 52.74Zm-566.74-289.914V204.521h230.74v79.783H188.304v151.522h-79.218Zm662.61 0V284.304H620.174v-79.783h231.305v231.305h-79.783Z"/></svg>
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
        font-size: 1rem;

        margin: 0.3rem;
        margin-bottom: 0;
    }

    #clampButton {
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