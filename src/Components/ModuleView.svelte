<script lang="ts">
    import { onMount } from "svelte";
    import { ModuleHandler } from "../Lib/ModuleHandler";

    onMount(() => {
        ModuleHandler.Init(document.getElementById("columnContainer") as HTMLDivElement);
    });

</script>

<main>
    <div id="columnContainer"></div>
</main>

<style lang="scss">
    @use '../scss/Flex';

    main {
        transform: translateY(3rem);
    }

    //All of these are global styles because they are
    //dynamically added through typescript
    //and not this component directly.

    //column container > actual column > module
    :global(#columnContainer > :not(.cornerDrag) > :not(.cornerDrag)) {
        min-width: 100%;
        max-width: 100%;
        
        max-height: 100%;

        margin: 0.5em 0 0.5em 0;
    }

    :global(#columnContainer) {
        @include Flex.Container(flex-start, flex-start, row);

        gap: 1.5em;
        margin: 0.5em;

        //height: 500px;

        overflow: auto;
    }

    :global(.column) {
        @include Flex.Container(flex-start, flex-start, column);

        height: 100%;
        background-color: #111;

        padding: 0.5em;
        margin: 1em;
        gap: 1em;

        //Module?
        & > * {
            width: 100%;
            min-height: 10vh;

            margin: 0.5em;

            aspect-ratio: 16 / 9;

            background-color: #333;

            &:hover {
                background-color: #444;

                transform: scale(0.95);
            }

            filter: drop-shadow(0 0 0.25em #000);

            transition: 0.2s;
        }

        &:empty {
            background-color: rgba(17, 17, 17, 0.5);
        }
        
    }

    :global(.is-large) {
        max-width: 20%;
        min-width: 20%;
    }

    :global(.is-small) {
        max-width: 5%;
        min-width: 5%;
    }

    //Scrollbar stuff
    ::-webkit-scrollbar {
        width: 1em;
    }

    ::-webkit-scrollbar-track {
        background-color: #55555525;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #8a8a8a25;
    }

    ::-webkit-scrollbar-corner {
        background-color: #6d6d6d25;
    }

    // :global(.column) {
    //     height: calc(100vh - 4rem);

    //     margin: 0.5rem;
    //     padding: 0.5rem;

    //     @include Flex.Container(flex-start, center, column);
    // }

    // :global(.is-small) {
    //     //width: calc(100% / 3 / 4);
    //     min-width: calc(100% / 3 / 4);

    //     background-color: rgb(96, 255, 96);
    // }

    // :global(.is-large) {
    //     min-width: calc(100% / 3);

    //     background-color: rgb(255, 120, 120);
    // }

    // main {
    //     @include Flex.Container(center, center, row);

    //     width: 100%;
    //     height: 100%;

    //     //move the column down by 3 rem
    //     //so that it is below the navbar
    //     transform: translateY(3rem);

    //     overflow: auto;
    // }

    // #columns {
    //     @include Flex.Container(center, center, row);

    //     width: 100%;
    //     height: 100%;
    // }

    // #addColumn {
    //     $addColumnBackground: rgba(207, 207, 207, 0.281);

    //     @include Flex.Container(center, center, column);

    //     height: 5rem;

    //     padding: 0 0.5rem;
    //     margin: 0 0.5rem;

    //     background-color: $addColumnBackground;

    //     border-radius: 1rem;

    //     &:hover {
    //         cursor: pointer;

    //         background-color: darken($addColumnBackground, 15%);
    //     }

    //     transition: 0.2s;
    // }
    
</style>