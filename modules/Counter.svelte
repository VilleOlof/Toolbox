<script lang="ts">
    import { DataStore } from "../src/Stores/DataStore";
    import { GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    const componentID: string = "Counter";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let counter_1: number = _Datastore.Get<number>('CounterValue_1', 0);
    let counter_2: number = _Datastore.Get<number>('CounterValue_2', 0);
    let positiveIncrement = _Settings.RegisterSetting('Positive Increment', 'The positive increment value', 1, SettingTypes.Type.Numeric, <SettingTypes.Numeric>{ min: 1 });
    let negativeIncrement = _Settings.RegisterSetting('Negative Increment', 'The negative increment value', -1, SettingTypes.Type.Numeric, <SettingTypes.Numeric>{ max: -1 });

    $: _Datastore.Set('CounterValue_1', counter_1);
    $: _Datastore.Set('CounterValue_2', counter_2);

    $: Difference = counter_1 - counter_2;
    $: Sum = counter_1 + counter_2;

</script>


<main id={componentID}>
    <div id=counters>
        <div class="counter">
            <h1>{counter_1}</h1>
            <button on:click={() => counter_1 += positiveIncrement}>+{positiveIncrement}</button>
            <button on:click={() => counter_1 += negativeIncrement}>{negativeIncrement}</button>
        </div>

        <div id=lineBreak></div>
    
        <div class="counter">
            <h1>{counter_2}</h1>
            <button on:click={() => counter_2 += positiveIncrement}>+{positiveIncrement}</button>
            <button on:click={() => counter_2 += negativeIncrement}>{negativeIncrement}</button>
        </div>
    </div>

    <div id=bottom>
        <p>Difference: {Difference}</p>
        <p>Summary: {Sum}</p>
    </div>
</main>


<style lang="scss">
    @use '../src/scss/_Colors.scss';

    #counters {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        text-align: center;
    }

    .counter {
        margin: 0.1rem 0.5rem;

        h1 {
            font-size: 3rem;

            margin: 0 0.5rem;
        }
    }

    #lineBreak {
        width: 0.2rem;
        height: 5rem;

        background-color: Colors.$BackgroundColor;

        margin: 0.5rem 0;
    }

    #bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;

        margin: 0.2rem 0 0 0;

        p {
            font-size: 1rem;
            opacity: 0.5;

            margin: 0.4rem 0;
        }
    }

    button {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 1rem;

        margin: 0rem 0.25rem;

        min-width: 3rem;

        cursor: pointer;
    }
</style>