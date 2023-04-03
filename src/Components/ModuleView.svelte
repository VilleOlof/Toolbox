<script lang="ts">
    import { onMount } from "svelte";
    import { ModuleHandler } from "../Lib/ModuleHandler";

    onMount(() => {
        ModuleHandler.Init(document.getElementById("columns") as HTMLDivElement);
    });

</script>

<main>
    <div id="columns"></div>
</main>

<style lang="scss">
    @use '../scss/Flex';

    //All of these are global styles because they are
    //dynamically added through typescript
    //and not this component directly.

    //column container > actual column > module
    :global(#columns > div > *) {
        max-width: 400px;
        max-height: 400px;
    }

    :global(.column) {
        height: calc(100vh - 4rem);

        margin: 0.5rem;
        padding: 0.5rem;

        @include Flex.Container(flex-start, center, column);
    }

    :global(.is-small) {
        //width: calc(100% / 3 / 4);
        min-width: calc(100% / 3 / 4);

        background-color: rgb(96, 255, 96);
    }

    :global(.is-large) {
        min-width: calc(100% / 3);

        background-color: rgb(255, 120, 120);
    }

    main {
        @include Flex.Container(center, center, row);

        width: 100%;
        height: 100%;

        //move the column down by 3 rem
        //so that it is below the navbar
        transform: translateY(3rem);

        overflow: auto;
    }

    #columns {
        @include Flex.Container(center, center, row);

        width: 100%;
        height: 100%;
    }

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