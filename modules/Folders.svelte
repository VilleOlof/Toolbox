<script lang="ts">
    import { DataStore } from "../src/Stores/DataStore";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    const { spawn } = require('child_process');

    const componentID: string = "Folders";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small);

        UpdateEmptyFolderCSS();
    });

    type Folder = {
        Path: string;
        Hash: string;
    }

    const PopupSideChoiceToRem = (side: string) => {
        switch (side) {
            case "Left":
                return "-10rem";
            case "Right":
                return "0";
        }
    }

    let _Datastore = new DataStore(componentID);
    let Folders = _Datastore.Get<Folder[]>("Folders", []);

    let _Settings = GlobalSettings.GetInstance(componentID);
    let PromptFolderUponAdd = _Settings.RegisterSetting("Quick Select","Prompts you to select a folder directly when creating a new folder slot", true, SettingTypes.Type.Checkbox);

    let PopupSide = _Settings.RegisterSetting("Popup Side", "Side of the folder icon the popup appears on", "Right", SettingTypes.Type.Dropdown, <SettingTypes.Dropdown>{ Options: ["Left", "Right"]});

    let AddFolder = () => {
        let hash: string = require('crypto').randomBytes(16).toString('hex');
        _Datastore.Set("Folders", [...Folders, {
            Path: "", 
            //Generate a random hash for each folder
            Hash: hash
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

        const fileManager = process.platform === 'win32' ? 'explorer' : 'open';
        spawn(fileManager, [folderPath]);
    }

</script>


<main id={componentID}>

    {#each Folders as folder}
    <div class="folder" id={folder.Hash}>

        <div class="folderIcon" id={`folderIcon-${folder.Hash}`}>
            <svg 
                on:click={OpenFolder} on:keydown={OpenFolder}
                id={folder.Hash} xmlns="http://www.w3.org/2000/svg" height="52" viewBox="0 96 960 960" width="52">
                <path d="M141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z"/>
            </svg>
        </div>

        <div class="folderPath" id={folder.Hash} style="--popupside: {PopupSideChoiceToRem(PopupSide)}">
            <input type="text" id={`folderInput-${folder.Hash}`} bind:value={folder.Path} placeholder="Use the 'Set Path' Button">
            <div class=folderPathBottom>
                <button on:click={SetFolder}>Set New</button>
                <button on:click={RemoveFolder}>Remove</button>
            </div>
        </div>
    </div>
{/each}

    <div id="addButton">
        <svg on:click={AddFolder} on:keydown={AddFolder} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M570 736h60v-90h90v-60h-90v-90h-60v90h-90v60h90v90ZM141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z"/></svg>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    svg {
        filter: invert(Colors.$IconInvertPercentage);

        cursor: pointer;

        transition: filter 0.2s, transform 0.2s;

        &:hover {
            filter: invert(calc(Colors.$IconInvertPercentage - 40%));
        }

        &:active {
            filter: invert(calc(Colors.$IconInvertPercentage - 20%));
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

        top: 2.75rem;
        left: var(--popupside);

        background-color: darken(#222222, 5%);
        color: Colors.$TextColor;

        border-radius: 0.5rem;
        padding: 0.5rem;

        z-index: 55;
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
        margin-top: 1rem;
    }

    :global(.emptyFolder) {
        & > svg {
            filter: invert(calc(Colors.$IconInvertPercentage - 40%))
        }
    }

</style>