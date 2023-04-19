<script lang="ts">
    import { onMount } from "svelte";
    import { GlobalSettings, SettingTypes, Settings } from "../Lib/Settings";
    import { DataStore } from "../Stores/DataStore";
    import { AppSettings } from "../Lib/AppSettings";
    import { ModuleHandler } from "../Lib/ModuleHandler";
    import { Common } from "../Lib/Common";

    const path = require('path');

    let InputComponents: Record<string, Function> = {};

    for (const type of Object.keys(SettingTypes.Type).filter((v) => !isNaN(Number(v)))) {
        const name: string = SettingTypes.Type[type];
        InputComponents[name] = async function () {
            return (await import(/* @vite-ignore*/ `./SettingInputComponents/${name}.svelte`));
        };
    }

    //Too many arguments passing around, need to refactor this
    //Switch fully to svelte?
    async function GenerateSettingComponents(): Promise<void> {

        const Modules = ModuleHandler.RegisteredModules;

        const SettingInstances: Record<string, Settings> = {};
        
        for (const [componentID, _] of Object.entries(Modules)) {
            const settings = GlobalSettings.GetInstance(componentID);
            SettingInstances[componentID] = settings;
        }

        const settingsContainer = document.getElementById('autoGenSettings') as HTMLDivElement;

        for (const [componentID, settingInstance] of Object.entries(SettingInstances)) {
            //Check if the component has been registered
            if (!ModuleHandler.RegisteredModules[componentID]) {
                continue;
            }

            const componentContainer: HTMLDivElement = document.createElement('div');
            componentContainer.id = componentID;
            componentContainer.classList.add('componentContainer');

            let iconTextHover = AddSettingHeader(componentContainer, componentID);

            await LoopOverSettings(componentID, settingInstance, componentContainer);

            if (iconTextHover) {
                componentContainer.appendChild(iconTextHover);
            }

            //Check if settings should be minimized on load
            const componentSettings = componentContainer.querySelector('.allComponentSettingsContainer') as HTMLDivElement;
            let minimizedSettings = GlobalSettings.SettingsData.Get('MinimizedSettings', []);
            if (minimizedSettings.includes(componentID) && componentSettings) {
                componentSettings.style.display = 'none';

                const arrowIcon = componentContainer.querySelector('.minimizeSettingsIcon') as HTMLImageElement;
                arrowIcon.src = path.join(__dirname, '../src/assets/arrowUp.svg');
            }

            settingsContainer.appendChild(componentContainer);
        }
    }

    function AddSettingHeader(componentContainer: HTMLDivElement, componentID: string): HTMLDivElement {
        const settingHeader: HTMLDivElement = document.createElement('div');
        settingHeader.classList.add('settingHeader');

        const settingHeaderTitle: HTMLDivElement = document.createElement('div');
        settingHeaderTitle.classList.add('settingHeaderTitle');

        const title = <HTMLHeadElement>document.createElement('h2');
        title.innerText = componentID;
        settingHeaderTitle.appendChild(title);

        let infoText: HTMLDivElement;

        if (ModuleHandler.RegisteredModules[componentID].description) {
            const infoIcon: HTMLImageElement = document.createElement('img');
            infoIcon.src = path.join(__dirname, '../src/assets/Info.svg');
            infoIcon.classList.add('infoIcon');

            infoText = <HTMLDivElement>document.createElement('div');
            infoText.classList.add('infoText');
            infoText.innerText = ModuleHandler.RegisteredModules[componentID].description;

            infoIcon.onmouseenter = () => {
                infoText.style.display = 'block';
            }

            infoIcon.onmouseleave = () => {
                infoText.style.display = 'none';
            }

            infoText.onmouseleave = () => {
                infoText.style.display = 'none';
            }

            settingHeaderTitle.appendChild(infoIcon);
        }

        const minimizeSettingsIcon: HTMLImageElement = document.createElement('img');
        minimizeSettingsIcon.src = path.join(__dirname, '../src/assets/arrowDown.svg');
        minimizeSettingsIcon.classList.add('minimizeSettingsIcon');

        let globalSettings = GlobalSettings.SettingsData;

        minimizeSettingsIcon.onclick = () => {
            const mainSettingsContainer = document.querySelector(`.allComponentSettingsContainer#${componentID}`) as HTMLDivElement;
            if (!mainSettingsContainer) return;

            let minimizedSettings = globalSettings.Get<string[]>('MinimizedSettings', []);

            if (mainSettingsContainer.style.display === 'none') {
                mainSettingsContainer.style.display = 'block';
                minimizeSettingsIcon.src = path.join(__dirname, '../src/assets/arrowDown.svg');

                minimizedSettings = minimizedSettings.filter((v) => v !== componentID);
                globalSettings.Set('MinimizedSettings', minimizedSettings);
            } else {
                mainSettingsContainer.style.display = 'none';
                minimizeSettingsIcon.src = path.join(__dirname, '../src/assets/arrowUp.svg');
;
                minimizedSettings.push(componentID);
                globalSettings.Set('MinimizedSettings', minimizedSettings);
            }
        }

        settingHeaderTitle.appendChild(minimizeSettingsIcon);

        settingHeader.appendChild(settingHeaderTitle)

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

        return infoText ?? undefined;
    }

    async function LoopOverSettings(componentID: string, settingInstance: Settings,componentContainer: HTMLDivElement): Promise<void> {
        const allComponentSettingsContainer = document.createElement('div') as HTMLDivElement;
        allComponentSettingsContainer.id = componentID;
        allComponentSettingsContainer.classList.add('allComponentSettingsContainer');
        
        for (const [settingName, settingInfo] of Object.entries(settingInstance.GetAllComponentSettings())) {
            const settingContainer: HTMLDivElement = document.createElement('div');
            settingContainer.id = settingName;
            settingContainer.classList.add('settingContainer');

            const SpecificSettingHeader: HTMLDivElement = document.createElement('div');
            SpecificSettingHeader.classList.add('specificSettingHeader');
            
            SpecificSettingHeader.appendChild(document.createElement('h3')).innerText = settingName;

            const resetSpecificSetting = document.createElement('button');
            resetSpecificSetting.innerText = 'Reset';
            resetSpecificSetting.classList.add('btnStyle');

            resetSpecificSetting.onclick = () => {
                const settingInstance = GlobalSettings._ComponentSettings[componentID]
                if (!settingInstance) return;
                settingInstance.ResetSetting(settingName);
            }

            SpecificSettingHeader.appendChild(resetSpecificSetting);

            settingContainer.appendChild(SpecificSettingHeader);

            settingContainer.appendChild(document.createElement('p')).innerText = settingInfo.Description;

            AddNewSettingInput(settingInfo, settingContainer, componentID, settingName);

            allComponentSettingsContainer.appendChild(settingContainer);
        }

        //Remove the minimize icon if no settings are present
        if (allComponentSettingsContainer.children.length === 0) {
            const minimizeSettingsIcon = componentContainer.querySelector('.minimizeSettingsIcon') as HTMLImageElement;
            if (minimizeSettingsIcon) {
                minimizeSettingsIcon.style.display = 'none';
            }
        }

        componentContainer.appendChild(allComponentSettingsContainer);
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
        await GenerateSettingComponents();
    });

    const openDevTools = () => {
        const devTools = Common.Electron.GetCurrentWindow().webContents;
        devTools.openDevTools();
    }

    const toggleAlwaysOnTop = () => {
        const currentWindow = Common.Electron.GetCurrentWindow();
        currentWindow.setAlwaysOnTop(!currentWindow.isAlwaysOnTop(), 'screen-saver');

        AppSettings.SetSetting('AlwaysOnTop', currentWindow.isAlwaysOnTop());
    }

    const Zoom = (zoom: number, append: boolean = true) => {
        const currentWindow = Common.Electron.GetCurrentWindow();
        if (append)
            currentWindow.webContents.setZoomFactor(currentWindow.webContents.getZoomFactor() + zoom);
        else if (!append) currentWindow.webContents.setZoomFactor(zoom);
    }

    const GithubEvent = () => {
        Common.Electron.OpenExternalLink('https://github.com/VilleOlof/Toolbox');
    }

    const OpenModuleFolder = () => {
        const modulePath = path.join(__dirname, '..', 'modules');
        Common.IO.OpenFolder(modulePath);
    }

    const ClearColumns = () => {
        delete ModuleHandler.RegisteredModules;
        ModuleHandler.RegisteredModules = {};
        ModuleHandler.ColumnContainer.remove();

        ModuleHandler._DataStore.Set('RegisteredModules', []);
        ModuleHandler._DataStore.Set('Columns', []);

        ModuleHandler.UpdateNavEntries();
    }

    const MirrorFlipModules = () => {
        let MirrorFlipped = AppSettings.GetSetting('MirrorFlipped', false);
        AppSettings.SetSetting('MirrorFlipped', !MirrorFlipped);
    }

</script>

<main>
    <div id="otherContent">
        <div id=otherContentTop>
            <button class=btnStyle on:click={openDevTools}>Open Devtools</button>

            <div id="zoomButtons">
                <button class="btnStyle" on:click={() => {Zoom(0.1)}}>Zoom In</button>
                <button class="btnStyle" on:click={() => {Zoom(-0.1)}}>Zoom Out</button>
                <button class="btnStyle" on:click={() => Zoom(1, false)}>Reset Zoom</button>
            </div>
    
            <button class="btnStyle" on:click={toggleAlwaysOnTop}>Always On Top</button>
        </div>

        <div id="otherContentBottom">
            <button class="btnStyle" on:click={MirrorFlipModules}>Mirror Flip Modules</button>
            <button class="btnStyle" on:click={ClearColumns}>Clear All Columns</button>
            <button class="btnStyle" on:click={OpenModuleFolder}>Open Modules Folder</button>
        </div>
    </div>
    
    <div id="settingsContainer">
    
        <h1>Modules</h1>
    
        <div id="autoGenSettings"></div>
    
    </div>
</main>

<div id="cornerText">
    <p>Made By: VilleOlof</p>
    <p>Version: {AppSettings.GetSetting('Version')}</p>
    <p id=cornerGithub on:click={GithubEvent} on:keydown={GithubEvent}>
        Found a bug? Have a suggestion? <br />
        Create an issue on the Github page!
    </p>
</div>

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Colors';

    main {
        transform: translateY(3rem);
    }

    #settingsContainer {
        @include Flex.Container(flex-start, center, column);

        margin: 1rem;
    }

    :global(.componentContainer) {
        background-color: Colors.$ColumnColor;

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
        background-color: Colors.$ModuleColor;

        padding: 0.35rem;
        margin: 0.4rem;

        border-radius: 0.25rem;
        filter: drop-shadow(0 0 0.25em #0000005e);
    }

    :global(.settingContainer > h3) {
        margin: 0;
        margin: 1rem 0.5rem 0.25rem 0.5rem;    
    }
    :global(.settingContainer > p) {
        margin: 0;
        margin: 0.25rem 0.5rem 1rem 0.5rem;    
    }

    :global(.settingHeader) {
        @include Flex.Container(space-between, center, row);

        margin: 0.5rem;
    }

    :global(.specificSettingHeader) {
        @include Flex.Container(space-between, center, row);

        margin: 0 0.5rem;
    }

    :global(.settingHeaderTitle) {
        @include Flex.Container(flex-start, center, row);
    }

    :global(.infoIcon) {
        margin-left: 0.5rem;

        cursor: pointer;

        width: 1.75rem;
        height: 1.75rem;

        filter: invert(Colors.$IconInvertPercentage);

        &:hover {
            transform: scale(1.1);
        }

        transition: transform 0.2s ease-in-out;
    }

    :global(.infoText) {
        background-color: Colors.$BackgroundColor;

        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 0.15rem solid darken(Colors.$BackgroundColor, 3%);

        filter: drop-shadow(0 0 0.25em #0000005e);

        position: absolute;
        display: none;

        max-width: 20rem;

        top: 4.25rem;
        left: 8.5rem;
    }

    :global(.minimizeSettingsIcon) {
        margin-left: 0.5rem;

        cursor: pointer;

        width: 2.5rem;
        height: 2.5rem;

        filter: invert(Colors.$IconInvertPercentage);

        &:hover {
            transform: scale(1.1);
        }

        transition: transform 0.2s ease-in-out;
    }

    #otherContent {
        margin: 1rem;

        @include Flex.Container(center, center, column);

        filter: drop-shadow(0 0 0.25em #00000046);
    }

    #otherContentTop {
        margin: 1rem;

        @include Flex.Container(center, center, row);

        filter: drop-shadow(0 0 0.25em #00000046);
    }

    #otherContentBottom {
        @extend #otherContentTop;
    }
    
    #zoomButtons {
        margin: 0;

        background-color: Colors.$ColumnColor;
        border-radius: 0.25rem;
        padding: 0.25rem;

        filter: drop-shadow(0 0 0.25em #00000046);

        & > .btnStyle {
            margin-right: 0.1rem;
            margin-left: 0.1rem;
        }
    }

    :global(.btnStyle) {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-color: darken(Colors.$ColumnColor, 5%);
        border-radius: 0.25rem;

        padding: 0.5rem;
        margin: 0.5rem;

        cursor: pointer;
        outline: none;

        &:hover {
            background-color: Colors.$ModuleColor;
        }

        &:active {
            background-color: Colors.$ColumnColor;
        }

        filter: drop-shadow(0 0 0.2em #00000046);
    }

    #cornerText {
        position: fixed;
        bottom: 0;
        left: 0;

        color: #ffffff35;

        margin: 1rem;

        font-size: 1rem;

        @include Flex.Container(flex-start, flex-start, column);

        p {
            margin: 0;
            margin-bottom: 0.5rem;
        }
    }

    #cornerGithub {
        cursor: pointer;
        user-select: none;

        &:hover {
            color: #ffffff80;
        }

        transition: color 0.2s;

        &:active {
            color: #ffffff90;
        }
    }

</style>