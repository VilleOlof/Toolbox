<script lang="ts">
  import { onMount } from "svelte";



    const AddColumn = () => {
        console.log('AddColumn');

        const div = document.createElement('div');
        div.style.width = '360px';
        div.style.height = '200px';
        div.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

        //document.querySelector('main').insertBefore(div, document.querySelector('#addColumn'));
        document.querySelector('#columns').appendChild(div);
    }

    onMount(() => {
        for (let i = 0; i < 3; i++) {
            AddColumn();
        }
    });

</script>

<main>

    <div id="columns">
        <div></div>
    </div>

</main>

<style lang="scss">
    @use '../scss/Flex';

    main {
        @include Flex.Container(center, center, row);

        width: 100%;
        height: 100%;

        overflow: visible;
    }

    #columns {
        @include Flex.Container(center, center, row);

        & > * {
            flex-shrink: 0;
        }

        & > *:not(:last-child) {
            margin-right: 0.5rem;
        }
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