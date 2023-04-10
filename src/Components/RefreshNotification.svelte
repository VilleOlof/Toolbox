<script lang="ts">
    import moduleIgnores from '../../module_ignore.json'

    const NPM_Command: string = 'npm run build';
    const moduleListPath: string = '../module_list.json';
    
    let ShowNotification: boolean = false;
    let NoNotification: boolean = false;

    function GetModulesInDirectory(): string[] {
        const fs = require('fs');
        const path = require('path');
        
        const modulesDirectory: string = path.join(__dirname, '../modules');
        let modules: string[] = [];

        fs.readdirSync(modulesDirectory).forEach((file: string) => {
            const Name: string = path.basename(file, '.svelte');
            if (Name.endsWith(".disabled")) return;
            modules.push(Name);
        });

        return modules;
    }

    function GetCurrentModules(): string[] {
        return require(moduleListPath);
    }

    function CheckForNewModules(): void {
        const modules: string[] = GetModulesInDirectory();
        const currentModules: string[] = GetCurrentModules();

        if (modules.length != currentModules.length) {
            ShowNotification = true;
        }
        else ShowNotification = false;
    }

    function RelaunchApp(): void {
        // @ts-ignore // it thinks that 'remote' is not a property of 'electron'
        const app = require('electron').remote.app;
        app.relaunch();
        app.exit();
    }

    function RefreshAppWithNewModules(): void {
        const { exec } = require('child_process');

        exec(NPM_Command,{
            cwd: __dirname
        }, (error: any) => {
            if (error) console.log(`error: ${error.message}`);

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
            <button on:click={RefreshAppWithNewModules}>Yes</button> 

            <button on:click={DisableNotification}>No</button>
        </div>
    </div>
{/if}

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Animation';
    
    #notificationContainer {
        @include Flex.Container(center, center, column);

        position: absolute;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        color: white;

        z-index: 10;
    }
    
    #buttons {
        @include Flex.Container();
    }

    #refreshIcon {
        @include Animation.Icon(1.2, 0.9, 0.2s);

        width: 2rem;

        margin-right: 1rem;
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
        filter: invert(100%);
    }
</style>