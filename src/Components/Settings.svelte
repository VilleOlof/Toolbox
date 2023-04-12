<script lang="ts">
    import { onMount } from "svelte";
    import { GlobalSettings, SettingTypes, Settings } from "../Lib/Settings";
  import { DataStore } from "../Stores/DataStore";

    let InputComponents: Record<string, Function> = {};

    for (const type of Object.keys(SettingTypes.Type).filter((v) => !isNaN(Number(v)))) {
        const name: string = SettingTypes.Type[type];
        InputComponents[name] = async function () {
            return (await import(/* @vite-ignore*/ `./SettingInputComponents/${name}.svelte`));
        };
    }

    //Too many arguments passing around, need to refactor this
    async function GenerateSettingComponents(Settings: Record<string, Settings>): Promise<void> {
        const settingsContainer = document.getElementById('autoGenSettings') as HTMLDivElement;

        for (const [componentID, settingInstance] of Object.entries(Settings)) {
            const componentContainer: HTMLDivElement = document.createElement('div');
            componentContainer.id = componentID;
            componentContainer.classList.add('componentContainer');

            AddSettingHeader(componentContainer, componentID);

            await LoopOverSettings(componentID, settingInstance, componentContainer);

            settingsContainer.appendChild(componentContainer);
        }
    }

    function AddSettingHeader(componentContainer: HTMLDivElement, componentID: string): void {
        const settingHeader: HTMLDivElement = document.createElement('div');
        settingHeader.classList.add('settingHeader');

        settingHeader.appendChild(document.createElement('h2')).innerText = componentID;

        const settingHeaderButtons: HTMLDivElement = document.createElement('div');
        settingHeaderButtons.classList.add('settingHeaderButtons');

        const resetModuleData: HTMLButtonElement = document.createElement('button');
        resetModuleData.innerText = 'Reset Data';
        resetModuleData.classList.add('btnStyle');

        resetModuleData.onclick = () => {
            DataStore.DeleteDataStore(componentID);
        }

        settingHeaderButtons.appendChild(resetModuleData);

        const resetSettings: HTMLButtonElement = document.createElement('button');
        resetSettings.innerText = 'Reset Settings';
        resetSettings.classList.add('btnStyle');

        resetSettings.onclick = () => {
            GlobalSettings.ResetAllComponentSettings(componentID);
        }

        settingHeaderButtons.appendChild(resetSettings);

        settingHeader.appendChild(settingHeaderButtons);

        componentContainer.appendChild(settingHeader);
    }

    async function LoopOverSettings(componentID: string, settingInstance: Settings,componentContainer: HTMLDivElement): Promise<void> {
        for (const [settingName, settingInfo] of Object.entries(settingInstance.GetAllComponentSettings())) {
                const settingContainer: HTMLDivElement = document.createElement('div');
                settingContainer.id = settingName;
                settingContainer.classList.add('settingContainer');
                
                settingContainer.appendChild(document.createElement('h3')).innerText = settingName;
                settingContainer.appendChild(document.createElement('p')).innerText = settingInfo.Description;

                AddNewSettingInput(settingInfo, settingContainer, componentID, settingName);

                componentContainer.appendChild(settingContainer);
        }
    }

    async function AddNewSettingInput(settingInfo: SettingTypes.Info, settingContainer: HTMLDivElement, componentID: string, settingName: string): Promise<void> {
        const EnumName: string = SettingTypes.Type[settingInfo.Type];
        const input = await InputComponents[EnumName]();
        
        new input.default({
            target: settingContainer,
            props: {
                componentID: componentID,
                settingName: settingName,
                settingInfo: settingInfo,
            }
        });
    }

    onMount(async () => {
        await GenerateSettingComponents(GlobalSettings._ComponentSettings);
    });

    const openDevTools = () => {
        /* @ts-ignore */
        const devTools = require('electron').remote.getCurrentWindow().webContents;
        devTools.openDevTools();
    }

    const toggleAlwaysOnTop = () => {
        /* @ts-ignore */
        const win = require('electron').remote.getCurrentWindow();
        win.setAlwaysOnTop(!win.isAlwaysOnTop());
    }

    /* @ts-ignore */
    const win = require('electron').remote.getCurrentWindow();
    /* @ts-ignore */
    const Zoom = (zoom: number, append: boolean = true) => {
        if (append)
            win.webContents.setZoomFactor(win.webContents.getZoomFactor() + zoom);
        else if (!append) win.webContents.setZoomFactor(zoom);
    }

</script>

<!--
    Input component that doesnt correctly have a default value from previous settings

    - File (this is okay though, it shouldnt have a default value)
    - Dropdown
    - Date
    - Color
    - Checkbox
-->

<main>
    <div id="otherContent">
        <button class=btnStyle on:click={openDevTools}>Open Devtools</button>

        <div id="zoomButtons">
            <button class="btnStyle" on:click={() => {Zoom(0.1)}}>Zoom In</button>
            <button class="btnStyle" on:click={() => {Zoom(-0.1)}}>Zoom Out</button>
            <button class="btnStyle" on:click={() => Zoom(1, false)}>Reset Zoom</button>
        </div>

        <button class="btnStyle" on:click={toggleAlwaysOnTop}>Always On Top</button>
    </div>
    
    <div id="settingsContainer">
    
        <h1>Module Settings</h1>
    
        <div id="autoGenSettings"></div>
    
    </div>
</main>

<style lang="scss">
    @use '../scss/Flex';

    main {transform: translateY(3rem);}

    #settingsContainer {
        @include Flex.Container(flex-start, center, column);

        margin: 1rem;
    }

    :global(.componentContainer) {
        background-color: #212126;

        min-width: 30rem;

        padding: 0.5rem;

        margin: 0.5rem;

        border-radius: 0.5rem;
	    filter: drop-shadow(0 0 0.25em #0000005e);

        :global(h2) {
            margin-left: 0.5rem;
        }
    }

    :global(.settingContainer) {
        background-color: #28282E;

        padding: 0.35rem;
        margin: 0.4rem;

        border-radius: 0.25rem;
	    filter: drop-shadow(0 0 0.25em #0000005e);
    }

    :global(.settingHeader) {
        @include Flex.Container(space-between, center, row);

        margin: 0.5rem;
    }

    #otherContent {
        margin: 1rem;

        @include Flex.Container(center, center, row);

        filter: drop-shadow(0 0 0.25em #00000046);
    }
    
    #zoomButtons {
        margin: 0;

        background-color: #212126;
        border-radius: 0.25rem;
        padding: 0.25rem;

        filter: drop-shadow(0 0 0.25em #00000046);

        & > .btnStyle {
            margin-right: 0.1rem;
            margin-left: 0.1rem;
        }
    }

    :global(.btnStyle) {
        background-color: #212126;
        color: #fff;

        border-color: darken(#212126, 5%);
        border-radius: 0.25rem;

        padding: 0.5rem;
        margin: 0.5rem;

        cursor: pointer;
        outline: none;

        &:hover {
            background-color: #28282E;
        }

        &:active {
            background-color: #212126;
        }

        filter: drop-shadow(0 0 0.2em #00000046);
    }

</style>