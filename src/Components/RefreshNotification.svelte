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
            if (moduleIgnores.includes(Name)) return;
            modules.push(Name);
        });

        return modules;
    }

    function GetCurrentModules(): string[] {
        const modules: string[] = require(moduleListPath);
        let outModules: string[] = [];

        modules.forEach((module: string) => {
            if (moduleIgnores.includes(module)) return;
            outModules.push(module);
        });

        return outModules;
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

    setInterval(() => {
        if (NoNotification) return;

        CheckForNewModules();
    }, 5000);

</script>

<button on:click={RefreshAppWithNewModules}>Refresh App</button>

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
    #notificationContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        color: white;

        z-index: 10;
    }
    
    #buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>