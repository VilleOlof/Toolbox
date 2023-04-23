<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { ModuleHandler } from "../Lib/ModuleHandler";
    import { AppSettings } from "../Lib/AppSettings";
    import { Common } from "../Lib/Common";
    import { GlobalSettings } from "../Lib/Settings";

    onMount(async () => {
        GlobalSettings.DisableSettingButton = true; // prevents user from going to settings while modules load.
        await ModuleHandler.Init(document.getElementById("columnContainer") as HTMLDivElement);
        GlobalSettings.DisableSettingButton = false;

        const MirrorFlipped = AppSettings.GetSetting("MirrorFlipped", false);
        
        //const mainContainer: HTMLElement = document.querySelector('#mainColumnContainer');
        //mainContainer.setAttribute('style', `align-items: ${MirrorFlipped ? "flex-end" : "flex-start"};`);

        const columnContainer: HTMLElement = document.querySelector('#columnContainer');
        columnContainer.setAttribute('style', `flex-direction: ${MirrorFlipped ? "row-reverse" : "row"};`);

        const emptyDiv = document.createElement("div");
        emptyDiv.setAttribute('style', 'flex-grow: 1');
        columnContainer.appendChild(emptyDiv);
    });

    onDestroy(() => {
        ModuleHandler.SaveLayout();
        ModuleHandler.DestroyInstances();

        Common.Electron.UnregisterAllShortcuts();
    });

</script>

<main id=mainColumnContainer>
    <div id="columnContainer"></div>
</main>

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Colors';

    main {
        transform: translateY(3rem);

        @include Flex.Container(flex-start, flex-start, column);
    }

    :global(.module) {
        min-width: 100%;

        margin: 0.5rem 0 0.5rem 0;

        position: relative;

        background-color: Colors.$ModuleColor;
        filter: drop-shadow(0 0 0.25em #000);

        transition: transform 0.2s, background-color 1s;

        z-index: 1;

        border-radius: 0.25rem;
    }


    :global(#columnContainer) {
        @include Flex.Container(flex-end, flex-start, row);
        display: inline-flex;

        gap: 0.5rem;
        margin: 0.5rem;
        margin-top: 1rem;
        margin-right: 0.45rem;
    }

    :global(.column) {
        @include Flex.Container(flex-start, flex-start, column);

        position: relative;

        padding: 0.5rem;
        gap: 0.5rem;
        margin: 0 0.5rem 0 0.5rem;

        border-radius: 0.5rem;
        filter: drop-shadow(0 0 0.25em #000);

        height: 100%;

        background-color: Colors.$ColumnColor;

        &:empty {
            background-color: rgba(Colors.$ColumnColor, 0.75);
        } 

        animation: fadeIn 0.2s ease-in-out 1;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    :global(.is-large) {
        max-width: 20rem;
        min-width: 20rem;
    }

    :global(.is-small) {
        max-width: 5rem;
        min-width: 5rem;
    }

    :global(.cornerDrag) {
        position: absolute;
        top: 0;
        left: 0;

        display: none;

        width: 0;
        height: 0;
        border-style: solid;
        border-width: 1rem 1rem 0 0;
        border-color: #6d6d6d75 transparent transparent transparent;

        &:hover {
            border-color: #8a8a8a75 transparent transparent transparent;
        }
    }
    
</style>