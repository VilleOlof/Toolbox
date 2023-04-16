<script lang="ts">
    import { AppSettings } from '../Lib/AppSettings';

    const fs = require("fs");
    const path = require("path");

    let dropzone;
    const Dragover = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        dropzone.style.display = "flex";
    }

    const DragExit = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        dropzone.style.display = "none";
    }

    const Drop = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();

        dropzone.style.display = "none";

        const files = event.dataTransfer.files;

        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            if (!files[i].path.endsWith(".svelte")) continue;
            filePaths.push(files[i].path);
        }

        if (filePaths.length == 0) return;

        CopyModulesToModulesDirectory(filePaths);
    }

    function CopyModulesToModulesDirectory(files: string[]): void {
        files.forEach((file: string) => {
            const onlyFileName = path.basename(file);
            const modulesDirectory: string = path.join(__dirname, '../modules');

            fs.copyFileSync(file, `${modulesDirectory}/${onlyFileName}`, fs.constants.COPYFILE_EXCL, (err: any) => {
                if (err) throw err;
            });
        });

        RefreshAppWithNewModules();
    }

    //Stolen from RefreshNotification.svelte
    //TODO: Make these functions that can be used in both places
    function RefreshAppWithNewModules(): void {
        const { exec } = require('child_process');

        const NPM_Command: string = 'npm run build';

        exec(NPM_Command,{
            cwd: __dirname
        }, (error: any) => {
            if (error) console.log(`error: ${error.message}`);

            RelaunchApp();
        });
    }

    function RelaunchApp(): void {
        // @ts-ignore // it thinks that 'remote' is not a property of 'electron'
        const app = require('electron').remote.app;

        AppSettings.SetSetting('WindowSize', {
            width: window.innerWidth,
            height: window.innerHeight
        })

        app.relaunch();
        app.exit();
    }

    document.body.addEventListener("dragover", Dragover);
    document.body.addEventListener("dragleave", DragExit);
    document.body.addEventListener("drop", Drop);

</script>

<div class="activeDrop" bind:this={dropzone}>
    <img src="../src/assets/DropHere.svg" alt="Drop Here">
</div>

<style lang="scss">
    @use '../scss/Colors';
    
    .activeDrop {
        position: absolute;
        display: none;

        user-select: none;
        pointer-events: none;

        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        width: 100%;
        height: 100%;

        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.5);

        z-index: 100;

        img {
            filter: invert(Colors.$IconInvertPercentage);

            width: 25%;
            height: 25%;

            //give the image a little bit of a bounce
            animation: hithere 2s ease infinite;
        }
    }

    @keyframes hithere {
        10% { transform: scale(1.2); }
        20%, 40% { transform: rotate(-20deg) scale(1.2); }
        30% { transform: rotate(20deg) scale(1.2); }
        50% { transform: rotate(0deg) scale(1.2); }
        70% { transform: scale(1); }
        100% { transform: scale(1); }
    }
</style>