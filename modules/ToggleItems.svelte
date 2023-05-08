<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "ToggleItems";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "Used to toggle the enabled/disable status on timeline items quickly."
        );
    });

    type Profile = {
        Name: string,
        Video: string,
        Audio: string,
        ForceToggle: boolean,
        ForceStatus: boolean,
        Keybind: string
    }

    const _Settings = GlobalSettings.GetInstance(componentID);

    const _Datastore = new DataStore(componentID);

    let CurrentProfile: number = _Datastore.Get("CurrentProfile", 0);
    $: _Datastore.Set("CurrentProfile", CurrentProfile);

    const defaultProfile = {
        Name: "New Profile",
        Video: "",
        Audio: "",
        ForceToggle: false,
        ForceStatus: false,
        Keybind: ""
    }

    let Profiles: Profile[] = _Datastore.Get("Profiles", [defaultProfile]);
    $: _Datastore.Set("Profiles", Profiles);
    const UpdateProfiles = () => Profiles = Profiles;

    function SetupSettingsAndKeybinds() {
        for (let i = 0; i < Profiles.length; i++) {
            const profile = Profiles[i];

            profile.Keybind = _Settings.RegisterSetting(`${profile.Name} - Keybind`, "The keybind used to toggle this specific profile.", profile.Keybind, SettingTypes.Type.Keybind);

            if (profile.Keybind != "") Common.Electron.RegisterShortcut(profile.Keybind, MainToggle);
        }
    }
    SetupSettingsAndKeybinds();

    function ToggleClip(trackType: ResolveEnums.TrackType, index: number, timeline?: Timeline): void {
        timeline = timeline ?? ResolveFunctions.GetCurrentTimeline();
        const timelineItem = ResolveFunctions.GetTimelineItem(trackType, index, timeline) as TimelineItem;
        if (!timelineItem) return;

        const profile = Profiles[CurrentProfile];
        if (profile.ForceToggle) {
            timelineItem.SetClipEnabled(profile.ForceStatus);
            return;
        }

        timelineItem.SetClipEnabled(!timelineItem.GetClipEnabled());
    }

    const SplitTrackStrings = (input: string) => input.split(",").map(x => parseInt(x));

    function MainToggle(): void {
        const currentTimeline = ResolveFunctions.GetCurrentTimeline();
        if (!currentTimeline) return;

        const profile = Profiles[CurrentProfile];
        const videoTracks = SplitTrackStrings(profile.Video);
        const audioTracks = SplitTrackStrings(profile.Audio);

        for (let i = 0; i < videoTracks.length; i++) {
            const trackIndex = videoTracks[i];
            ToggleClip(ResolveEnums.TrackType.Video, trackIndex, currentTimeline);
        }

        for (let i = 0; i < audioTracks.length; i++) {
            const trackIndex = audioTracks[i];
            ToggleClip(ResolveEnums.TrackType.Audio, trackIndex, currentTimeline);
        }
    }

    function AddNewProfile(): void {
        Profiles[Profiles.length] = defaultProfile;
        CurrentProfile = Profiles.length - 1;
    }

    function RemoveProfile(): void {
        if (Profiles.length == 1) return;

        _Settings.DeleteSetting(`${Profiles[CurrentProfile].Name} - Keybind`);
        Profiles.splice(CurrentProfile, 1);

        UpdateProfiles();
        CurrentProfile = 0;
    }


</script>


<main id={componentID}>
    <div class="header">
        <div class="main">
            <h1>Toggle Item</h1>
            <button on:click={MainToggle}>Toggle</button>
        </div>

        <div class="profileHandling">
            <div class="profileButtons">
                <button on:click={AddNewProfile}>Add Profile</button>
                <button on:click={RemoveProfile}>Remove Profile</button>
            </div>

            <div class="profileSelection">
                <input type="text" bind:value={Profiles[CurrentProfile].Name}>

                <select bind:value={CurrentProfile}>
                    {#each Profiles as profile, i}
                        <option value={i}>{profile.Name}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>

    <div class="profileInput">
        <div class="profileHeader">
            <h2>Profile Settings</h2>
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <img src="../src/assets/Info.svg" alt="Info"
                on:mouseover={() => document.getElementById("trackInfo").style.display = "block"}
                on:mouseout={() => document.getElementById("trackInfo").style.display = "none"}
            >
            <p id=trackInfo>
                Track Inputs are seperated by a comma. <br>
                Example: 1,2,3,4,5 <br>
                <br>
                Force Toggle will force the track to be enabled or disabled. <br>
                Force Status is what state the 'Force Toggle' is on. <br>
            </p>
        </div>
        
        <div>
            <label for="profileVideo">Video Tracks</label>
            <input type="text" name="profileVideo" placeholder="Video Tracks" bind:value={Profiles[CurrentProfile].Video}>
        </div>

        <div>
            <label for="profileAudio">Audio Tracks</label>
            <input type="text" name="profileAudio" placeholder="Audio Tracks" bind:value={Profiles[CurrentProfile].Audio}>
        </div>
        
        <div>
            <label for="profileForceToggle">Force Toggle</label>
            <input type="checkbox" name="profileForceToggle" bind:checked={Profiles[CurrentProfile].ForceToggle}>
        </div>

        <div>
            <label for="profileForceStatus">Force Status</label>
            <input type="checkbox" name="profileForceStatus" bind:checked={Profiles[CurrentProfile].ForceStatus}>
        </div>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    @mixin Flex($direction: row, $justify: center, $align: center) {
        display: flex;
        flex-direction: $direction;
        justify-content: $justify;
        align-items: $align;
    }

    main {
        @include Flex(column, center, center);
        width: 100%;
    }

    .header {
        @include Flex(column, center, center);
        width: 100%;

        .main {
            @include Flex(row, space-between, center);
            width: 80%;

            margin: 0.5rem;

            h1 {
                opacity: 0.5;
                margin: 0;
                font-size: 1.5rem;
            }
        }

        .profileHandling {
            @include Flex(column, space-between, center);
            width: 90%;

            background-color: darken(Colors.$ModuleColor, 5%);
            border-radius: 0.25rem;
            padding: 0.5rem;

            .profileButtons {
                @include Flex(row, space-between, center);
                width: 100%;
                margin-bottom: 0.25rem;
            }

            .profileSelection {
                @include Flex(row, space-between, center);
                width: 100%;
            }
        }
    }

    .profileInput {
        @include Flex(column, space-between, center);
        width: 95%;
        margin: 0.5rem;

        background-color: Colors.$BackgroundColor;
        border-radius: 0.25rem;

        h2 {
            margin: 0.4rem 0;
            font-size: 1.5rem;
        }

        div {
            @include Flex(row, space-between, center);
            width: 90%;
            margin: 0.2rem 0;
        }
    }

    img {
        width: 2rem;
        height: 2rem;

        filter: invert(Colors.$IconInvertPercentage);

        &:hover {
            transform: scale(1.1);
        }

        transition: transform 0.1s ease-in-out;
    }

    #trackInfo {
        display: none;
        position: absolute;
        top: 10%;
        left: 0;

        width: 15rem;
        height: 6.75rem;

        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border: 0.15rem solid Colors.$ModuleColor;

        padding: 0.5rem;

        font-size: 0.8rem;
    }

    button {
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

    input, select {
        min-width: 3rem;
        max-width: 7rem;
        height: 1.5rem;

        border: none;
        border-radius: 0.25rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border: 0.15rem solid Colors.$ModuleColor;

        padding-left: 0.4rem;

        outline: none;
    }

    input[type="checkbox"] {
        min-width: 1.25rem;
        height: 1.25rem;
    }

</style>