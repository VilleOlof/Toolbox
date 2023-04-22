<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "Timer";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "A simple module to keep track of time or a countdown."
        );

        //CountdownInputChange();
    });

    type Page = 'Timer' | 'Countdown';

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let SaveDataInterval: number = _Settings.RegisterSetting(
        'Save Data Interval', 
        'When to save the data, every X seconds', 
        5, 
        SettingTypes.Type.Numeric, 
        <SettingTypes.Numeric>{ Min: 1 }
    );

    let PageState = _Datastore.Get<Page>('PageState', 'Timer');
    let currentTime = _Datastore.Get<number>(`currentTime-${PageState}`, 0);
    let countDownLength = _Datastore.Get<number>('countDownLength', 5);
    let currentInterval: NodeJS.Timer;

    function GetReversePageState(): Page {
        return PageState == 'Timer' ? 'Countdown' : 'Timer';
    }

    function SwitchPageState() {
        PageState = GetReversePageState();
        _Datastore.Set('PageState', PageState);

        currentTime = _Datastore.Get<number>(`currentTime-${PageState}`, 0);

        Stop();
    }

    function Start() {
        if (currentInterval) return;

        StartInterval();
    }

    function Stop() {
        if (!currentInterval) return;

        clearInterval(currentInterval);
        currentInterval = null;
    }

    function Reset() {
        Stop();
        if (PageState == 'Countdown') {
            currentTime = countDownLength * 60;
        } else {
            currentTime = 0;
        }
        _Datastore.Set(`currentTime-${PageState}`, currentTime);
    }

    function StartInterval() {
        let interval: number = 0;
        currentInterval = setInterval(() => {
            if (PageState == 'Timer') {
                currentTime += 1;
            } else {
                currentTime -= 1;
            }
            interval += 1;

            if (interval >= SaveDataInterval) {
                _Datastore.Set(`currentTime-${PageState}`, currentTime);
                interval = 0;
            }
        }, 1000);
    }

    let formattedTime: string = FormatTime();

    $: {
        currentTime = currentTime;
        formattedTime = FormatTime();
    }

    function FormatTime() {
        let time = currentTime;
        let hours = Math.floor(time / 3600);
        time -= hours * 3600;
        let minutes = Math.floor(time / 60);
        time -= minutes * 60;
        let seconds = time;

        let hoursString = hours.toString().padStart(2, '0');
        let minutesString = minutes.toString().padStart(2, '0');
        let secondsString = seconds.toString().padStart(2, '0');

        return `${hoursString}:${minutesString}:${secondsString}`;
    }

    let CountdownInputElement: HTMLInputElement;
    function CountdownInputChange() {
        if (PageState != 'Countdown') {
            return;
        }
        if (currentInterval) return;

        let value = parseInt(CountdownInputElement.value);
        if (isNaN(value)) {
            value = 0;
        }

        countDownLength = value;

        _Datastore.Set('countDownLength', countDownLength);

        Reset();
    }

</script>


<main id={componentID}>
    <div id=topBar>
        <button class=buttonStyle on:click={SwitchPageState}>Switch To {PageState == 'Timer' ? 'Countdown' : 'Timer'}</button>
        <h1>{PageState}</h1>
    </div>

    <h1 id="time">{formattedTime}</h1>

    <div id="bottomBar">
        <button class=buttonStyle on:click={Start}>Start</button>
        <button class=buttonStyle on:click={Stop}>Stop</button>
        <button class=buttonStyle on:click={Reset}>Reset</button>
        {#if PageState == 'Countdown'}
            <input type="number" id="countdownStartInput" placeholder="Minutes" bind:value={countDownLength} on:change={CountdownInputChange} bind:this={CountdownInputElement}>
        {/if}
    </div>

</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        display: flex;
        flex-direction: column;
        
        justify-content: center;
        align-items: center;

        width: 100%;
    }

    #topBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        width: 100%;

        h1 {
            font-size: 1.5rem;
        }

        & > * {
            margin: 0.25rem 1rem;
        }
    }

    #bottomBar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 100%;

        margin: 0.25rem 1rem;

        & > * {
            margin: 0.25rem 0.4rem;
        }
    }

    #time {
        font-size: 3.75rem;
        margin: 0.5rem 1rem;
    }

    input {
        max-width: 4rem;
    }

    input[type=number] {
        height: 1.5rem;

        border: none;
        border-radius: 0.25rem;

        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        padding-left: 0.25rem;

        outline: none;
    }

    .buttonStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        margin: 0rem 0.25rem;
        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }


</style>