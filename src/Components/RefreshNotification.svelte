<script lang="ts">
    import { AppSettings } from '../Lib/AppSettings';
    import { Common } from '../Lib/Common';
    import { Logger } from '../Lib/Logger';

    const NPM_Command: string = 'npm run build';
    const moduleListPath: string = '/../module_list.json';
    const moduleIgnorePath: string = '/../module_ignore.json'
    
    let ShowNotification: boolean = false;
    let NoNotification: boolean = false;

    function GetModulesInDirectory(): string[] {
        const path = require('path');
        
        const modulesDirectory: string = path.join(__dirname, '../modules');
        let modules: string[] = [];

        const files = Common.IO.ReadDirectory(modulesDirectory);

        files.forEach((file: string) => {
            const Name: string = path.basename(file, '.svelte');
            if (Name.endsWith(".disabled")) return;
            modules.push(Name);
        });

        return modules;
    }

    function GetCurrentModules(): string[] {
        return <string[]>Common.IO.ReadFile(__dirname + moduleListPath, true);
    }

    function GetCurrentIgnored(): string[] {
        return <string[]>Common.IO.ReadFile(__dirname + moduleIgnorePath, true);
    }

    function CheckForNewModules(): void {
        const modules: string[] = GetModulesInDirectory();
        const currentModules: string[] = GetCurrentModules();
        const ignoredModules: string[] = GetCurrentIgnored();

        //remove all ignoredModules from currentModules
        ignoredModules.forEach((ignoredModule: string) => {
            const index = currentModules.indexOf(ignoredModule);
            const dirIndex = modules.indexOf(ignoredModule);
            if (index > -1) {
                currentModules.splice(index, 1);
            }
            if (dirIndex > -1) {
                modules.splice(dirIndex, 1);
            }
        });

        const skipChecking = AppSettings.GetSetting('SkipModuleCheck', false);
        if (skipChecking) return;

        if (modules.length != currentModules.length) {
            ShowNotification = true;
        }
        else ShowNotification = false;
    }

    function RelaunchApp(): void {
        Logger.Log('Relaunching App From RefreshNotification', 'info', 'file');

        // @ts-ignore // it thinks that 'remote' is not a property of 'electron'
        const remote = require('electron').remote;

        const bounds = Common.Electron.GetCurrentWindow().getBounds();
        AppSettings.SetSetting('WindowSize', {
            width: bounds.width,
            height: bounds.height
        })

        const position = Common.Electron.GetCurrentWindow().getPosition();
        AppSettings.SetSetting('WindowPosition', {
            x: position[0],
            y: position[1]
        });

        remote.app.relaunch();
        remote.app.exit();
    }

    function RefreshAppWithNewModules(): void {
        const proccess = Common.ExecuteCommand(NPM_Command, __dirname);
        proccess.on('exit', () => {
            RelaunchApp();
        });
    }

    function DisableNotification(): void {
        NoNotification = true;
        ShowNotification = false;
    }

    function ToggleRefreshHoverText(state: boolean): void {
        const refreshHoverText: HTMLElement = document.getElementById('refreshHoverText');
        refreshHoverText.style.display = state ? 'block' : 'none';
    }

    CheckForNewModules();
    setInterval(() => {
        if (NoNotification) return;

        CheckForNewModules();
    }, 5000);

</script>

<div id="refreshButtonContainer">
    <img on:click={RefreshAppWithNewModules} on:keydown={RefreshAppWithNewModules} 
    on:mouseenter={() => {ToggleRefreshHoverText(true)}} on:mouseleave={() => {ToggleRefreshHoverText(false)}}
    id=refreshIcon class="reverseColor" src="../src/assets/refresh_icon.svg" alt="Refresh" >
    
    <p id="refreshHoverText" class=FadeIn >Restarts The Plugin</p>
</div>

{#if ShowNotification}
    <div id="notificationContainer">
        <p>We've noticed your modules folder changed, would you like to restart the app?</p>
        <div id="buttons">
            <button class=btnStyle on:click={RefreshAppWithNewModules}>Yes</button> 

            <button class=btnStyle on:click={DisableNotification}>No</button>
        </div>
    </div>
{/if}

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Animation';
    @use '../scss/Colors';
    
    #notificationContainer {
        @include Flex.Container(center, center, column);

        position: fixed;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        color: white;

        z-index: 15;

        font-size: 1.5rem;
        text-align: center;
    }
    
    #buttons {
        @include Flex.Container();

        button {
            font-size: 1.5rem;
            padding: 0.5rem 1rem;
        }

        & > button {
            z-index: 15;
        }
    }

    #refreshIcon {
        @include Animation.Icon(1.2, 0.9, 0.2s);

        width: 2rem;

        margin-right: 1rem;

        &:hover {
            transform: scale(1.2) rotate(30deg);
        }
    }

    #refreshHoverText {
        display: none;

        position: absolute;

        top: 2.2rem;

        background-color: darken(#222222d5, 3%);
        border-radius: 0.5rem;
        padding: 0.5rem;
    }

    .FadeIn {
        opacity: 0;
        animation: fadeIn 0.2s linear 1 forwards;
    }

    @keyframes fadeIn {
        0% { opacity: 0 }
        100% { opacity: 1 }
    }

    .reverseColor {
        filter: invert(Colors.$IconInvertPercentage);
    }
</style>