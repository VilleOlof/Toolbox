<script lang="ts">
    import { DataStore } from "../src/Stores/DataStore";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    const { spawn } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    const componentID: string = "Folders";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small);

        UpdateEmptyFolderCSS();

        MinimizeAddFolder(MinimizedAddFolder);
    });

    type Folder = {
        Path: string;
        Hash: string;
        Color: string;
    }

    const PopupSideChoiceToRem = (side: string) => {
        switch (side) {
            case "Left":
                return "-17rem";
            case "Right":
                return "3rem";
        }
    }

    let _Datastore = new DataStore(componentID);
    let Folders = _Datastore.Get<Folder[]>("Folders", []);
    let MinimizedAddFolder = _Datastore.Get<boolean>("MinimizedAddFolder", false);

    let _Settings = GlobalSettings.GetInstance(componentID);
    let PromptFolderUponAdd = _Settings.RegisterSetting("Quick Select","Prompts you to select a folder directly when creating a new folder slot", true, SettingTypes.Type.Checkbox);

    let PopupSide = _Settings.RegisterSetting("Popup Side", "Side of the folder icon the popup appears on", "Right", SettingTypes.Type.Dropdown, <SettingTypes.Dropdown>{ Options: ["Left", "Right"]});

    let SelectLatestFile = _Settings.RegisterSetting("Select Latest File", "Automatically selects the latest modified file in the folder when opening it", true, SettingTypes.Type.Checkbox);

    let AddFolder = () => {
        let hash: string = require('crypto').randomBytes(16).toString('hex');
        _Datastore.Set("Folders", [...Folders, {
            Path: "", 
            //Generate a random hash for each folder
            Hash: hash,
            Color: '#ffffff'
        }]);

        Folders = _Datastore.Get<Folder[]>("Folders", []);

        UpdateEmptyFolderCSS();

        if (PromptFolderUponAdd) {
            SetFolder(null, hash);
        }
    }

    let RemoveFolder = (event: MouseEvent) => {
        //Button > Popup Bottom > Popup(has ID)
        let folder = (event.target as HTMLElement).parentElement.parentElement as HTMLElement;
        let folderHash = folder.id;

        let newFolders = Folders.filter((folder) => {
            return folder.Hash != folderHash;
        });

        _Datastore.Set("Folders", newFolders);

        Folders = _Datastore.Get<Folder[]>("Folders", []);

        UpdateEmptyFolderCSS();
    }

    let UpdateEmptyFolderCSS = () => {
        let folders = _Datastore.Get<Folder[]>("Folders", []);

        folders.forEach((folder) => {
            if (folder.Path == "") {
                const element = <HTMLElement>document.getElementById(`folderIcon-${folder.Hash}`);
                if (!element) return;
                element.classList.add("emptyFolder");
            } else {
                const element = <HTMLElement>document.getElementById(`folderIcon-${folder.Hash}`);
                if (!element) return;
                element.classList.remove("emptyFolder");
            }
        });
    }

    let SetFolder = (event: Event | null, forceHash?: string) => {
        let folderHash = forceHash ?? ((event?.target as HTMLElement).parentElement.parentElement as HTMLElement).id;

        //prompt the user to select a folder
        /*@ts-ignore*/
        let folderPath = require('electron').remote.dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
        
        if (!folderPath) return;

        let newFolders = Folders.map((folder) => {
            if (folder.Hash == folderHash) {
                folder.Path = folderPath[0];
            }

            return folder;
        });

        _Datastore.Set("Folders", newFolders);

        Folders = _Datastore.Get<Folder[]>("Folders", []);

        UpdateEmptyFolderCSS();
    }

    let OpenFolder = (event: Event) => {
        let folder = (event.target as HTMLElement).parentElement.parentElement as HTMLElement;
        let folderHash = folder.id;

        let folderPath = Folders.find((folder) => {
            return folder.Hash == folderHash;
        })?.Path;

        if (!folderPath) return;

        if (!SelectLatestFile) {
            const fileManager = process.platform === 'win32' ? 'explorer' : 'open';
            const folderPathNormalized = path.normalize(folderPath);
            spawn(fileManager, [folderPathNormalized]);
            return;
        }

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.log(err);
                return;
            }

            // Sort files by modification time
            const fileDetails = files.map((file) => {
                const filePath = `${folderPath}/${file}`;
                const stats = fs.statSync(filePath);
                return {
                    filePath,
                    stats,
                };
            });
            fileDetails.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

            // Open folder with default selected file
            const defaultSelectedFile = fileDetails[0].filePath.replace(/\//g, path.sep);

            const fileManager = process.platform === 'win32' ? 'explorer' : 'open';
            const folderPathNormalized = path.normalize(folderPath);
            
            spawn(fileManager, ['/select,', defaultSelectedFile], {
                cwd: folderPathNormalized,
            });
        });
    }

    let FolderColorChange = (event: Event) => {
        _Datastore.Set("Folders", Folders);

        const Hash = ((event?.target as HTMLElement).parentElement.parentElement as HTMLElement).id;

        const element = <HTMLElement>document.getElementById(`folderIcon-${Hash}`);
        if (!element) return;
        element.setAttribute('style', `color: ${(event.target as HTMLInputElement).value}`);
    }

    let MinimizeAddFolder = (forceStatus?: boolean) => {
        const element = <HTMLElement>document.getElementById("addFolder");
        if (!element) return;

        MinimizedAddFolder = forceStatus ?? !MinimizedAddFolder;

        if (MinimizedAddFolder) {
            element.classList.add("minimized");
        } else {
            element.classList.remove("minimized");
        }

        _Datastore.Set("MinimizedAddFolder", MinimizedAddFolder);
    }

</script>


<main id={componentID}>

    {#each Folders as folder}
    <div class="folder" id={folder.Hash}>

        <div class="folderIcon" id={`folderIcon-${folder.Hash}`}>
            <svg 
                on:click={OpenFolder} on:keydown={OpenFolder} style="color: {folder.Color};"
                id={folder.Hash} xmlns="http://www.w3.org/2000/svg" height="52" viewBox="0 96 960 960" width="52" fill="currentColor">
                <path d="M141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z"/>
            </svg>
        </div>

        <div class="folderPath" id={folder.Hash} style="--popupside: {PopupSideChoiceToRem(PopupSide)}">
            <input type="text" id={`folderInput-${folder.Hash}`} bind:value={folder.Path} placeholder="Use the 'Set Path' Button">
            <div class=folderPathBottom>
                <button on:click={SetFolder}>Set Path</button>
                <button on:click={RemoveFolder}>Remove</button>
                <input type="color" id={`color-${folder.Hash}`} bind:value={folder.Color} on:change={FolderColorChange}>
            </div>
        </div>
    </div>
{/each}

    <div id="addButton">
        <div id="thinLine" on:click={() => MinimizeAddFolder()} on:keydown={() => MinimizeAddFolder()}>&nbsp;</div>

        <svg id="addFolder" on:click={AddFolder} on:keydown={AddFolder} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M570 736h60v-90h90v-60h-90v-90h-60v90h-90v60h90v90ZM141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z"/></svg>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    svg {
        cursor: pointer;

        transition: opacity 0.2s, transform 0.2s;

        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 0.6;
            transform: scale(0.9);
        }
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        width: 100%;
        height: 100%;
    }

    button {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-color: Colors.$BackgroundColor;
        border-radius: 0.5rem;

        padding: 0.4rem;

        margin: 0.5rem 0.5rem 0 0.5rem;

        outline: none;

        cursor: pointer;

        &:hover {
            background-color: darken(Colors.$ColumnColor, 3%);
        }

        &:active {
            background-color: darken(Colors.$ColumnColor, 5%);
        }

        transition: background-color 0.2s;
    }

    input {
        @extend button;
    }

    .folder {
        position: relative;

        height: 3rem;
        width: 3rem;
    }

    .folderPath {
        display: none;

        position: absolute;

        top: /*2.75rem*/ 0;
        left: var(--popupside);

        background-color: darken(#222222, 5%);
        color: Colors.$TextColor;

        border-radius: 0.5rem;
        padding: 0.5rem;

        z-index: 55;

        input[type=text] {
            width: 14rem;
        }
    }

    .folder:hover .folderPath {
        display: block;
    }

    .folderPathBottom {
        display: flex;
        justify-content: center;
        flex-direction: row;
    }

    #addButton {
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    #thinLine {
        width: 60%;
        height: 0.2rem;
        background-color: Colors.$BackgroundColor;

        cursor: pointer;
        user-select: none;

        margin: 0.5rem 0 0.5rem 0;

        &:hover {
            background-color: darken(Colors.$BackgroundColor, 5%);
        }

        transition: background-color 0.1s;
    }

    :global(.minimized) {
        display: none;
    }

    :global(.emptyFolder) {
        & > svg {
            opacity: 0.3;
        }
    }

</style>