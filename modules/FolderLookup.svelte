<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";

    const componentID: string = "FolderLookup";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "Select a folder and see the latest modified files, with a quick import button!!\nRight into the media pool!"
        );
    });

    const _Settings = GlobalSettings.GetInstance(componentID);
    const AmountOfFilesToDisplay: number = _Settings.RegisterSetting(
        'Number Of Files', 
        "The Amount Of Files To Display", 
        10, 
        SettingTypes.Type.Numeric, 
        <SettingTypes.Numeric>{
            Min: 1,
            Max: 100,
            Step: 1
        }
    );
    const MediaImportBin: string = _Settings.RegisterSetting(
        'Media Import Bin', 
        "The Media Bin To Import The Files Into\nLeave Empty To Import Into The Current Bin\nAnd 'root' To Import Into The Root Bin", 
        "root", 
        SettingTypes.Type.Text
    );
    const AllowedExtensions: string = _Settings.RegisterSetting(
        'Allowed Extensions', 
        "The Allowed Extensions To Display\nComma Seperated (.mp4, .png)", 
        ".mp4, .mkv, .png, .jpg", 
        SettingTypes.Type.Text
    );

    const _Datastore = new DataStore(componentID);

    let folders: string[] = _Datastore.Get('folders', []);
    $: _Datastore.Set('folders', folders);
    const FolderReAssign = () => folders = folders;

    let currentFolderSelected = _Datastore.Get('currentFolderSelected', folders[0]);
    $: {
        _Datastore.Set('currentFolderSelected', currentFolderSelected);
        files = !currentFolderSelected ? [] : GetLatestModifiedFiles(currentFolderSelected, AmountOfFilesToDisplay);
    } 

    let showList = _Datastore.Get('showList', true);
    $: _Datastore.Set('showList', showList);

    const MaxNameLength: number = 18;

    function GetLastFolderName(folderPath: string, shrink: boolean = false) {
        if (!folderPath) return "Empty";
        let name = folderPath.split(Common.GetPathModule().sep).pop();
        if (!shrink) return name;
        return ShrinkName(name, MaxNameLength);
    }

    function GetFileName(filePath: string, shrink: boolean = false) {
        if (!filePath) return "Empty";
        let name = filePath.split(Common.GetPathModule().sep).pop();
        if (!shrink) return name;
        return ShrinkName(name, MaxNameLength);
    }

    function ShrinkName(name: string, length: number) {
        if (name.length <= length) return name;
        return name.slice(0, length) + "...";
    }

    function AddNewFolder() {
        const folder = Common.IO.Dialog({
            title: "Select Folder",
            properties: ["openDirectory"]
        })[0];
        if (!folder) return;

        folders.push(folder);
        currentFolderSelected = folder;
        FolderReAssign();
    }

    function RemoveFolder() {
        folders = folders.filter(folder => folder != currentFolderSelected);
        currentFolderSelected = folders[0];
        FolderReAssign();
    }

    function OpenFolder() {
        Common.IO.OpenFolder(currentFolderSelected);
    }

    let files: string[] = [];
    function GetLatestModifiedFiles(folderPath: string, amount: number): string[] {
        let _allowedExtensions = AllowedExtensions.split(",").map(ext => ext.trim());
        if (_allowedExtensions[0] == "") _allowedExtensions = [];

        const files = Common.IO.GetFiles(folderPath, _allowedExtensions);
        files.sort((a, b) => {
            const aStats = Common.IO.GetFileLastModified(a);
            const bStats = Common.IO.GetFileLastModified(b);
            return bStats - aStats;
        });
        return files.slice(0, amount);
    }

    function ImportFileIntoMediaPool(filePath: string) {
        const project = ResolveFunctions.GetCurrentProject();
        const mediapool = project.GetMediaPool();
        if (!project || !mediapool) return;

        let folder = ResolveFunctions.GetMediaFolder(MediaImportBin);
        if (MediaImportBin == "root") folder = mediapool.GetRootFolder();
        else if (!folder) {
            const root = mediapool.GetRootFolder();
            mediapool.AddSubFolder(root, MediaImportBin);
        }
        mediapool.SetCurrentFolder(folder);
        
        mediapool.ImportMedia([filePath]);
    }

    function ToggleList() {
        showList = !showList;
    }

</script>


<main id={componentID}>
    <h1>Folder Lookup</h1>
    <div class="mainHeader">
        <button on:click={AddNewFolder}>Add New Folder</button>
        <select id="folderDropdown" bind:value={currentFolderSelected}>
            {#each folders as folderPath}
                <option value={folderPath}>{GetLastFolderName(folderPath)}</option>
            {/each}
        </select>
    </div>

    <div class="folder">
        <div class="folderHeader">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p on:click={ToggleList}>{GetLastFolderName(currentFolderSelected, true)}</p>
            <div>
                <button on:click={RemoveFolder}>Remove</button>
                <button on:click={OpenFolder}>Open</button>
            </div>
        </div>

        {#if showList}
            <div class="folderList" transition:slide|local>
                {#each files as file}
                    <div class="file">
                        <p>{GetFileName(file)}</p>
                        <button on:click={() => {ImportFileIntoMediaPool(file)}}>Import</button>
                    </div>
                {/each}
            </div>
        {/if}

        {#if files.length == 0}
            <p id=listHidden>No Files Found</p>
        {/if}

        {#if !showList && files.length > 0}
            <p id=listHidden>List Hidden, Click On The Folder Name To Toggle</p>
        {/if}
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
    }

    h1 {
        margin: 0.25rem 0.25rem 0 0.25rem;
        opacity: 0.5;
        font-size: 1.5rem;
    }

    .mainHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 90%;

        margin: 0.5rem;
    }

    #folderDropdown {
        max-width: 10rem;
        min-width: 10rem;
    }

    .folder {
        width: 90%;
        height: 90%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        background-color: darken(Colors.$ColumnColor, 2%);
        border-radius: 0.5rem;

        padding: 0.5rem;
        margin: 0 0.5rem 0.5rem 0.5rem;
    }

    .folderHeader {
        background-color: darken(Colors.$BackgroundColor, 2%);

        width: 100%;
        height: 2rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        p { 
            margin-left: 0.5rem; 
            cursor: pointer;

            transition: color 0.1s ease-in-out;

            &:hover {
                color: darken(Colors.$TextColor, 30%)
            }

            &:active {
                color: darken(Colors.$TextColor, 50%)
            }
        }
        div { margin-right: 0.5rem; }

        border-radius: 0.25rem;
    }

    .folderList {
        width: 95%;
    }

    .file {
        width: 100%;
        height: 2rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        p { 
            margin: 0 0.5rem 0 0.5rem;
        }

        border-radius: 0.25rem;
    }

    #listHidden {
        margin: 0.5rem;
        opacity: 0.5;
        font-size: 0.7rem;
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

    select {
        margin-left: 0.5rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        transition: background-color 0.1s ease-in-out;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

</style>