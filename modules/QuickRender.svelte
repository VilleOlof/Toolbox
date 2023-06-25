<script lang="ts">
    import { Resolve, ResolveFunctions, AppQuit } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { SML } from "../src/Lib/SharedModuleLogic";

    const componentID: string = "QuickRender";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "A module that makes it quick and easy to render your timeline with just a few clicks."
        );

        SML.Shared.Function.Add("QuickRender.Render", Render);
        SML.Shared.Function.Add("QuickRender.AddRenderJob", AddRenderJob);
        SML.Shared.Function.Add("QuickRender.ChangeProfile", ChangeCurrentProfile);
    });

    type Profile = {
        ProfileName: string,
        RenderPresetIndex: number,
        FilePath: string,
        FileName: string,
        FileExtension: string,
        Suffix: string,
        UseSuffix: boolean,
        Overwrite: boolean,
    }
    const DefaultProfile: Profile = {
        ProfileName: "Default",
        RenderPresetIndex: 6,
        FilePath: "",
        FileName: "Video",
        FileExtension: "mp4",
        Suffix: "",
        UseSuffix: false,
        Overwrite: false,
    }

    let _DataStore = new DataStore(componentID);
    let _Settings = GlobalSettings.GetInstance(componentID);

    let QuitOnRender = _Settings.RegisterSetting("Quit Plugin On Render", "Saves and quits the plugin when pressing the 'Render' Button", false, SettingTypes.Type.Checkbox);
    let ClearJobsBeforeRender = _Settings.RegisterSetting("Clear Jobs Before Render", "Clears all render jobs in the queue before rendering", false, SettingTypes.Type.Checkbox);
    let PromptFolderOnRender = _Settings.RegisterSetting("Prompt Folder On Render", "Prompts the user to select a folder when pressing the 'Render' Button", false, SettingTypes.Type.Checkbox);
    let UseMarkerTool = _Settings.RegisterSetting("Use Marker Tool", "Uses the marker tool to set the in and out points", false, SettingTypes.Type.Checkbox);

    let DataProfileFallback = JSON.parse(JSON.stringify(DefaultProfile));
    let RenderProfiles: Profile[] = _DataStore.Get<Profile[]>("RenderProfiles", [DataProfileFallback]);

    //if there are no profiles, add the default profile
    if (RenderProfiles.length == 0) {
        RenderProfiles.push(DataProfileFallback);
        RenderProfiles = _DataStore.Set("RenderProfiles", RenderProfiles);
    }

    let currentProfileName: string; //used for the dropdown
    let CurrentProfile: Profile = RenderProfiles[0];

    //Ensures that the profile saves on every change
    $: {
        CurrentProfile = CurrentProfile;
        SaveProfile();
    }

    function UpdateDropdown(): void {
        currentProfileName = CurrentProfile.ProfileName;
    }

    function ChangeFolder(): void {
        if (CurrentProfile.FilePath == DefaultProfile.FilePath) CurrentProfile.FilePath = "";

        const folders = Common.IO.Dialog({
            title: "Select Folder",
            defaultPath: CurrentProfile.FilePath,
            buttonLabel: "Select Folder",
            properties: ["openDirectory"]
        })

        if (folders) {
            CurrentProfile.FilePath = folders[0];
        }
    }

    function GetRenderPresets(): string[] {
        let presets: string[] = ResolveFunctions.GetCurrentProject().GetRenderPresetList();
        return presets;
    }

    function AddProfile(): void {
        //copy the default profile
        let newProfile = JSON.parse(JSON.stringify(DefaultProfile));
        newProfile.ProfileName = "New Profile";

        RenderProfiles.push(newProfile);
        RenderProfiles = _DataStore.Set("RenderProfiles", RenderProfiles);
    }

    function RemoveProfile(): void {
        RenderProfiles = RenderProfiles.filter(x => x.ProfileName != CurrentProfile.ProfileName);
        RenderProfiles = _DataStore.Set("RenderProfiles", RenderProfiles);

        if (RenderProfiles.length == 0) {
            AddProfile();
        }

        CurrentProfile = RenderProfiles[0];

        UpdateDropdown();
    }

    function SaveProfile(): void {
        RenderProfiles = _DataStore.Set("RenderProfiles", RenderProfiles);
    }

    function ProfileChange(): void {
        let profile = RenderProfiles.find(x => x.ProfileName == currentProfileName);
        if (profile != undefined) {
            CurrentProfile = profile;
        }

        console.log(GetFileName());
    }

    function ChangeCurrentProfile(profileName: string): void {
        let profile = RenderProfiles.find(x => x.ProfileName == profileName);
        if (profile != undefined) {
            CurrentProfile = profile;
        }
    }

    function GetCombinedTryPath(result: string): string {
        return CurrentProfile.FilePath + "\\" + result + "." + CurrentProfile.FileExtension;
    }

    function GetCombinedAlternativeTryPath(result: string, index: number): string {
        return CurrentProfile.FilePath + "\\" + result + `_${index}.` + CurrentProfile.FileExtension;
    }

    function GetFileName(): string {
        let result: string = "";
        result += CurrentProfile.FileName;

        if (CurrentProfile.UseSuffix) {
            result += CurrentProfile.Suffix;
        }

        if (!CurrentProfile.Overwrite) {
            let amountOfFiles = 0;

            let path = GetCombinedTryPath(result);
            let alternativePath = GetCombinedAlternativeTryPath(result, amountOfFiles);

            while (Common.IO.FileExists(path) || Common.IO.FileExists(alternativePath)) {
                amountOfFiles++;
                path = GetCombinedTryPath(result);
                alternativePath = GetCombinedAlternativeTryPath(result, amountOfFiles);;
            }

            result += "_" + amountOfFiles;
        }

        result += "." + CurrentProfile.FileExtension;

        return result;
    }

    function AddRenderJob(): void {
        let project = ResolveFunctions.GetCurrentProject();

        if (CurrentProfile.FilePath == DefaultProfile.FilePath) {
            ChangeFolder();
        }

        const renderPresets: string[] = project.GetRenderPresetList();
        const presetName: string = renderPresets[CurrentProfile.RenderPresetIndex];
        project.LoadRenderPreset(presetName);

        let inPoint: number = 0;
        let outPoint: number = 0;

        let renderSettings: RenderSettings;

        if (UseMarkerTool) {
            let _MarkerToolDataStore = DataStore.GetDataStoreByID("MarkerTool");
            if (!_MarkerToolDataStore) {
                console.log("Marker Tool not found");
                return;
            }

            let startMarkerData = _MarkerToolDataStore.Get<string>('StartMarker');
            let endMarkerData = _MarkerToolDataStore.Get<string>('EndMarker');

            if (startMarkerData && endMarkerData) {
                const currentTimeline = ResolveFunctions.GetCurrentTimeline();

                inPoint = ResolveFunctions.GetMarkerFrameID(startMarkerData, currentTimeline);
                outPoint = ResolveFunctions.GetMarkerFrameID(endMarkerData, currentTimeline);

                inPoint += currentTimeline.GetStartFrame();
                outPoint += currentTimeline.GetStartFrame();

                inPoint += 1 //marker Duration frame
            }
        }

        renderSettings = {
            SelectAllFrames: (inPoint == 0 || outPoint == 0),
            TargetDir: CurrentProfile.FilePath,
            CustomName: GetFileName(),

            MarkIn: inPoint,
            MarkOut: outPoint,
        }
        
        project.SetRenderSettings(renderSettings);

        project.AddRenderJob();
    }

    function ClearRenderJobs(): void {
        let project = ResolveFunctions.GetCurrentProject();
        project.DeleteAllRenderJobs();
    }

    function Render(): void {
        let project = ResolveFunctions.GetCurrentProject();

        if (PromptFolderOnRender) {
            ChangeFolder();
        }

        if (ClearJobsBeforeRender) {
            //Clears old render jobs
            ClearRenderJobs();
            AddRenderJob();
        }

        project.StartRendering();

        if (QuitOnRender) {
            AppQuit();
        }
    }

    function OpenFilePath(): void {
        if (!CurrentProfile.FilePath) return;
        Common.IO.OpenFolder(CurrentProfile.FilePath);
    }
</script>


<main id={componentID}>
    <div id="topBar">
        <div id="leftSide">
            <select id="renderProfileDropdown" bind:value={currentProfileName} on:change={ProfileChange}>
                {#each RenderProfiles as profile}
                    <option value={profile.ProfileName}>{profile.ProfileName}</option>
                {/each}
            </select>

            <button id="addProfileButton" class=buttonStyle on:click={AddProfile}>+ Profile</button>
            <button id="removeProfileButton" class="buttonStyle" on:click={RemoveProfile}>-</button>
        </div>

        <div id="rightSide">
            <button id="renderButton" class=buttonStyle on:click={Render}>Render</button>
        </div>
    </div>

    <div id="lineBreak"></div>

    <div id="profileSettings">
        <div id="renderPreset" class=renderOption>
            <label for="renderPresetDropdown">Render Preset</label>
            <select id="renderPresetDropdown" bind:value={CurrentProfile.RenderPresetIndex}>
                {#each GetRenderPresets() as preset, i}
                    <option value={i+1}>{preset}</option>
                {/each}
            </select>
        </div>

        <div id="folder" class=renderOption>
            <label for="filePathInput" on:click={OpenFilePath} on:keydown={OpenFilePath}>Folder</label>
            <div>
                <input type="text" id="folderInput" class=inputTextStyle bind:value={CurrentProfile.FilePath}>
                <button id="folderLocationButton" class=buttonStyle on:click={ChangeFolder}>.../</button>
            </div>
        </div>

        <div id="fileName" class=renderOption>
            <label for="fileNameInput">File Name</label>
            <div>
                <input id="fileNameInput" type="text" class=inputTextStyle bind:value={CurrentProfile.FileName}/>
                <input id="fileExtensionInput" type="text" class=inputTextStyle bind:value={CurrentProfile.FileExtension}>
            </div>
        </div>

        <div id="suffix" class=renderOption>
            <label for="suffixInput">Suffix</label>

            <div id="suffixLeftSide">
                <input id="suffixInput" type="text" class=inputTextStyle bind:value={CurrentProfile.Suffix}/>
                <input id="useSuffix" type="checkbox" class=checkBoxxStyle bind:checked={CurrentProfile.UseSuffix}>
            </div>
        </div>

        <div id="overwrite" class=renderOption>
            <label for="overwriteCheckbox">Overwrite</label>
            <input id="overwriteCheckbox" type="checkbox" class=checkBoxxStyle bind:checked={CurrentProfile.Overwrite}/>
        </div>

        <div id="profileName" class="renderOption">
            <label for="profileNameInput">Profile Name</label>
            <input id="profileNameInput" type="text" class=inputTextStyle bind:value={CurrentProfile.ProfileName} on:change={UpdateDropdown}/>
        </div>
    </div>

    <div id="bottomBar">
        <button id="addRenderJobButton" class=buttonStyle on:click={AddRenderJob}>Add Renderjob</button>
        <button id="clearRenderJobButton" class=buttonStyle on:click={ClearRenderJobs}>Clear Renderjobs</button>
    </div>
</main>


<style lang="scss">
    @use "../src/scss/Colors" as Colors;

    #topBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: 0.5rem;
    }

    #leftSide {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    #rightSide {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    #bottomBar {
        @extend #topBar;
    }

    #renderButton {
        font-size: 1rem;
    }

    #addProfileButton {
        margin-left: 0.5rem;
    }

    #renderProfileDropdown {
        max-width: 7rem;
        min-width: 6rem;
        outline: none;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border: 0.1rem solid Colors.$BackgroundColor;

        padding: 0.4em;
    }

    .renderOption > select {
        @extend #renderProfileDropdown;

        min-width: 10rem;
    }

    .renderOption {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: 0.25rem 0.5rem;
    }

    .buttonStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        margin: 0rem 0.25rem;
        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    .inputTextStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border: 0.1rem solid Colors.$BackgroundColor;

        padding: 0.4em;

        outline: none;
    }

    .checkBoxxStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border: 0.1rem solid Colors.$BackgroundColor;

        padding: 0.4em;

        width: 1.25rem;
        height: 1.25rem;

        outline: none;
    }

    #suffixInput {
        max-width: 8rem;
    }

    #suffixLeftSide {
        display: flex;
        flex-direction: row;
        align-items: center;
        
        & > input[type="checkbox"] {
            margin-left: 1rem;
        }
    }

    #fileNameInput {
        max-width: 7.35rem;
    }

    #fileExtensionInput {
        max-width: 2rem;
    }

    #folderInput {
        max-width: 6.7rem;
    }

    #removeProfileButton {
        min-width: 0;
        width: 1.5rem;
        padding: 0;

        margin-left: 0;
    }

    #lineBreak {
        width: 90%;
        height: 0.25rem;

        background-color: Colors.$BackgroundColor;

        margin: 0.5rem auto;
    }

    #folder > label {
        &:hover {
            cursor: pointer;

            color: darken(Colors.$TextColor, 25%)
        }

        transition: color 0.2s;
    }

</style>