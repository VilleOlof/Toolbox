<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { SML } from "../src/Lib/SharedModuleLogic";

    const componentID: string = "ImageClipboard";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small,
            "Saves the clipboard image to a folder and imports it into the media pool"
        );

        SML.Shared.Function.Add("ImageClipboard.Paste", ClipboardToFile);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    const defaultPath = Common.IO.CombinePaths(Common.IO.GetHomeDirectory(), "Pictures/Davinki Toolbox Clipboard");
    const clipboardFolder = _Settings.RegisterSetting("Clipboard Folder", "The folder where all images will be saved to (Project>Image)", defaultPath, SettingTypes.Type.Text);
    const clipboardPrefix = _Settings.RegisterSetting("Clipboard Prefix", "The prefix for all images saved from the clipboard", "Clipboard", SettingTypes.Type.Text);
    const mediaPoolBinName = _Settings.RegisterSetting("MediaPool Bin Name", "The name of the bin where all images will be imported to", "Clipboard", SettingTypes.Type.Text);

    function ClipboardToFile(): void {
        const clipboardImage = Common.Electron.GetClipboard().readImage();
        if (!clipboardImage) return;

        const fileBuffer: Buffer = clipboardImage.toPNG();
        if (fileBuffer.length == 0) return;

        const fileName: string = `${clipboardPrefix}_${FormatTime(new Date())}.png`;

        if (!Common.IO.FileExists(clipboardFolder)) Common.IO.CreateDirectory(clipboardFolder);

        const currentProject = ResolveFunctions.GetCurrentProject();
        const projectPath = `${currentProject.GetName()}`;

        const projectFolder: string = Common.IO.CombinePaths(clipboardFolder, projectPath);
        if (!Common.IO.FileExists(projectFolder)) Common.IO.CreateDirectory(projectFolder);

        const filePath: string = Common.IO.CombinePaths(projectFolder, fileName);

        Common.IO.WriteFile(filePath, fileBuffer, false, false);

        ImportIntoMediapool(filePath);
    }

    function ImportIntoMediapool(filePath: string): void {
        const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();

        let bin = ResolveFunctions.GetMediaFolder(mediaPoolBinName);
        if (bin == null) {
            bin = currentMediapool.AddSubFolder(currentMediapool.GetRootFolder(), mediaPoolBinName);
        }
        currentMediapool.SetCurrentFolder(bin);

        currentMediapool.ImportMedia([filePath]);
    }

    function FormatTime(date: Date): string {
        // format should be: YYYY-MM-DD_HH-MM-SS
        const year: number = date.getFullYear();
        const month: number = date.getMonth() + 1;
        const day: number = date.getDate();

        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();
        const seconds: number = date.getSeconds();

        const formattedDate: string = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

        return formattedDate;
    }

</script>


<main id={componentID}>
    <h1 id="title">Clipboard</h1>
    <button on:click={ClipboardToFile} id=clipboardButton>
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M180 936q-26 0-43-17t-17-43V276q0-26 17-43t43-17h202q7-35 34.5-57.5T480 136q36 0 63.5 22.5T578 216h202q26 0 43 17t17 43v600q0 26-17 43t-43 17H180Zm0-60h600V276h-60v90H240v-90h-60v600Zm300-600q17 0 28.5-11.5T520 236q0-17-11.5-28.5T480 196q-17 0-28.5 11.5T440 236q0 17 11.5 28.5T480 276Z"/></svg>
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
        font-size: 0.9rem;

        margin: 0.3rem;
        margin-bottom: 0.25rem;
    }

    #clipboardButton {
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