<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { onDestroy } from "svelte";
    import { slide } from "svelte/transition";

    const componentID: string = "QuickProperties";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "Apply already defined properties to the current video item in the timeline quickly\nQuick properties can be defined by changing properties on an existing item\nAnd then pressing the 'Set Property' button."
        );

        RegisterKeybinds();

        UpdateTrackInputsOnMount();
    });

    onDestroy(() => {
    });

    type Property = {
        KeybindEnabled: boolean,
        Name: string,
        Append: boolean,
        Tracks: number[],
        Minimized: boolean,
        ItemProperties: TimelineItemProperties | undefined
    }
    type PropertyObject = {[key: string]: Property};

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let _Properties: PropertyObject = _Datastore.Get("Properties", {});
    $: {
        for (const [oldName, properties] of Object.entries(_Properties)) {
            if (oldName != properties.Name) {
                _Properties[properties.Name] = properties;
                delete _Properties[oldName];
            }
        }

        _Datastore.Set("Properties", _Properties); // Save to datastore on change
    }

    type KeybindReturn = {
        Keybind: string,
        Properties: Property
    }
    function AddKeybindSettingsOnMount(): KeybindReturn[] {
        RemoveUnusedKeybinds(); //remove any keybinds that dont exist in _properties

        let keybinds: KeybindReturn[] = [];
        for (let key in _Properties) {
            let property = _Properties[key];

            if (property.KeybindEnabled) {
                let keybind = _Settings.RegisterSetting(`${property.Name}-Keybind`, `Generated Keybind for the ${property.Name} property`, 'F24', SettingTypes.Type.Keybind);
                keybinds.push({Keybind: keybind, Properties: property});
            }
        }

        return keybinds;
    }

    function RegisterKeybinds(): void {
        let keybindReturn = AddKeybindSettingsOnMount();
        for (let property of keybindReturn) {
            Common.Electron.RegisterShortcut(property.Keybind, () => {
                ApplyProperties(property.Properties);
            });
        }
    }

    function RemoveUnusedKeybinds(): void {
        //check existing setting keybind and compare them to _properties and if they dont exist in _properties then remove them
        let settings: Record<string, SettingTypes.Info> = _Settings.GetAllComponentSettings();

        for (let setting in settings) {
            if (setting.endsWith("-Keybind")) {
                let propertyName = setting.replace("-Keybind", "");
                if (_Properties[propertyName] === undefined || !_Properties[propertyName].KeybindEnabled) {
                    _Settings.DeleteSetting(setting);
                }
            }
        }
    }

    function AddNewProperty(): Property {
        const newPropertyName = "NewProperty";
        let newProperty = {
            KeybindEnabled: false,
            Name: newPropertyName,
            Append: false,
            Tracks: [1],
            Minimized: false,
            ItemProperties: undefined
        };
        newProperty = AddItemProperties(newProperty);

        _Properties[newPropertyName] = newProperty;

        return newProperty;
    }

    function RemoveProperty(propertyName: string): void {
        delete _Properties[propertyName];
        _Properties = _Properties; //force update since $: triggers on assignment
    }

    function AddItemProperties(properties: Property): Property {
        let currentTimeline = ResolveFunctions.GetCurrentTimeline();

        let currentVideoItem = currentTimeline.GetCurrentVideoItem();
        if (!currentVideoItem) return properties;

        let currentProperties: TimelineItemProperties = currentVideoItem.GetProperty() as TimelineItemProperties;

        _Properties[properties.Name] = {
            KeybindEnabled: properties.KeybindEnabled,
            Name: properties.Name,
            Append: properties.Append,
            Tracks: properties.Tracks,
            Minimized: properties.Minimized,
            ItemProperties: currentProperties
        }

        return _Properties[properties.Name];
    }

    //refactor to more functions instead of 6 level of indentation
    function ApplyProperties(properties: Property): void {
        let currentTimeline = ResolveFunctions.GetCurrentTimeline();
        let timelineTrackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

        let itemProps = properties.ItemProperties;
        for (let propertyTrackCount = 1; propertyTrackCount <= properties.Tracks.length; propertyTrackCount++) {
            if (propertyTrackCount >= timelineTrackCount) {
                return;
            }

            let itemsInTrack = currentTimeline.GetItemListInTrack(ResolveEnums.TrackType.Video, propertyTrackCount);

            //find the item thats above the timeline cursor
            let playheadPosition = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
            for (let item of itemsInTrack) {
                if (item === undefined) continue;

                let itemStart = item.GetStart();
                let itemEnd = item.GetEnd();

                if (playheadPosition >= itemStart && playheadPosition <= itemEnd) {
                    
                    const ZoomGang = item.GetProperty("ZoomGang");
                    Object.entries(itemProps).forEach(([key, value]) => {
                        if (value === undefined || value == 0) return;

                        if (properties.Append) {
                            let currentValue = item.GetProperty(key);

                            if (currentValue === undefined || currentValue == 0) return;
                            if (currentValue.toString() == "true" || currentValue.toString() == "false") return; //probably a better way to 
                            if (ZoomGang && key == "ZoomY") return;

                            if (key == "ZoomX") {
                                value -= 1; //removes the 1 that is default zoom level.
                            }
                            
                            value = currentValue + value;
                            item.SetProperty(key, value);

                            return;
                        }

                        console.log(key, value);
                        item.SetProperty(key, value);
                    });

                    break;
                }
            }
        }
    }

    function TrackInputChange(event: any, _propertiesName: string): void {
        let trackInputText: string = event.target.value;

        let tracks: number[] = [];

        let trackInputTextSplit = trackInputText.split(",");
        for (let track of trackInputTextSplit) {
            let trackNumber = parseInt(track);
            if (trackNumber > 0) {
                tracks.push(trackNumber);
            }
        }

        _Properties[_propertiesName].Tracks = tracks;
    }

    function UpdateTrackInputsOnMount() {
        for (const [propertyName, properties] of Object.entries(_Properties)) {
            let trackInput = document.querySelector(`#${propertyName}-track`) as HTMLInputElement;
            if (trackInput === null) continue;

            trackInput.value = properties.Tracks.join(",");
        }
    }

    function MinimizeProperty(propertyName: string): void {
        _Properties[propertyName].Minimized = !_Properties[propertyName].Minimized;
    }

    function ToggleTrackInfoHover(propertyName: string) {
        let trackInfo = document.querySelector(`#${propertyName}-trackInfoHover`);
        if (trackInfo === null) return;

        trackInfo.classList.toggle("minimized");
    }

</script>


<main id={componentID}>
    <div id="top">
        <h1>Quick Properties</h1>
        <button on:click={AddNewProperty} id=addNew class=buttonStyle>Add New</button>
    </div>
    <div class="lineBreak"></div>
    <div id="autoGenList">
        {#each Object.entries(_Properties) as [_, properties]}

            <div id={`${properties.Name}-propertyContainer`} class=propertyContainer>
                <div id={`${properties.Name}-propertyHeader`} class=propertyHeader>
                    <h1>{properties.Name}</h1>
                    <div class=headerButtons>
                        <button on:click={() => { MinimizeProperty(properties.Name) }} class=buttonStyle>Minimize</button>
                        <button on:click={() => { ApplyProperties(properties) }} class=buttonStyle>Apply</button>
                    </div>
                </div>

                {#if !properties.Minimized}
                    <div id={`${properties.Name}-propertyDetail`} class=propertyDetail transition:slide|local>
                        <div class="detail">
                            <label for={`${properties.Name}-keybindEnabled`}>Enable Keybind</label>
                            <input type="checkbox" id={`${properties.Name}-keybindEnabled`} class=keybindEnabled bind:checked={properties.KeybindEnabled}>
                        </div>

                        <div class="detail">
                            <label for={`${properties.Name}-append`}>Append</label>
                            <input type="checkbox" id={`${properties.Name}-append`} class=propertyAppend bind:checked={properties.Append}>
                        </div>

                        <div class="detail">
                            <label for={`${properties.Name}-name`}>Name</label>
                            <input type="text" id={`${properties.Name}-name`} class=propertyNameInput bind:value={properties.Name} pattern="^[a-zA-Z0-9]+$" maxlength=13>
                        </div>

                        <div class="detail">
                            <label for={`${properties.Name}-track`}>Tracks</label>
                            <div class="trackRightSide">
                                <img src="../src/assets/Info.svg" alt="Info" id={`${properties.Name}-trackInfo`} class=trackInfo on:mouseenter={() => { ToggleTrackInfoHover(properties.Name) }} on:mouseleave={() => { ToggleTrackInfoHover(properties.Name) }}>
                                <div id={`${properties.Name}-trackInfoHover`} class="trackInfoHover minimized">
                                    <p>Tracks are seperated by a comma<br>Example: 1,2,5,8</p>
                                </div>

                                <input type="text" id={`${properties.Name}-track`} pattern="^\d+(,\d+)*$" class=propertyTrack on:change={(e) => { TrackInputChange(e, properties.Name)}}>
                            </div>
                        </div>

                        <div class="bottomButtons">
                            <button on:click={() => { AddItemProperties(properties) }} class="setProperties buttonStyle">Set Properties</button>
                            <button on:click={() => { RemoveProperty(properties.Name) }} class="removeProperties buttonStyle">Remove</button>
                        </div>
                    </div>
                {/if}

            </div>

            <div class="PropertieslineBreak"></div>

        {/each}
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
    }

    #top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        width: 100%;

        h1 {
            font-size: 1.5rem;
            opacity: 0.5;
        }

        & > * {
            margin: 0.5rem 0.5rem;
        }
    }

    #autoGenList {
        width: 92.5%;

        background-color: Colors.$BackgroundColor;
        border: 0.2rem solid Colors.$ColumnColor;
        border-radius: 0.3rem;

        filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.5));

        margin: 0.5rem;
        padding: 0.25rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .propertyContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
    }

    .propertyHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        width: 90%;

        h1 {
            margin: 0;
            font-size: 1.1rem;
        }

        margin: 0 0.5rem;
        margin-bottom: 0.25rem;
    }

    .propertyDetail {
        background-color: darken(Colors.$BackgroundColor, 3%);

        padding: 0.5rem;
        width: 90%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .detail {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        width: 100%;

        margin: 0.2rem 0;
    }

    .trackInfo {
        width: 1.5rem;
        height: 1.5rem;

        margin-right: 0.5rem;

        cursor: pointer;

        filter: invert(Colors.$IconInvertPercentage)
    }

    .trackInfoHover {
        position: absolute;

        background-color: Colors.$BackgroundColor;
        border: 0.2rem solid Colors.$ColumnColor;
        border-radius: 0.3rem;

        filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.75));

        p {
            margin: 0.25rem;
        }

        top: 6rem;
        left: 2.5rem;
    }

    .bottomButtons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        width: 100%;

        & > * {
            margin: 0 0.25rem;
            margin-top: 0.4rem;
        }
    }

    .keybindEnabled, .propertyAppend {
        width: 1.25rem;
        height: 1.25rem;

        margin-right: 0.5rem;
    }

    .trackRightSide {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }

    .propertyNameInput:invalid, .propertyTrack:invalid {
        border-color: #ff6464;

        transition: border-color 0.2s ease-in-out;
    }

    .minimized {
        display: none;
    }

    .buttonStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    .propertyNameInput, .propertyTrack{
        max-width: 7rem;
        height: 1.5rem;

        border: none;
        border-radius: 0.25rem;

        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        border: 0.15rem solid Colors.$ColumnColor;

        padding-left: 0.4rem;

        outline: none;
    }

    .lineBreak {
        width: 90%;
        height: 0.2rem;

        background-color: Colors.$BackgroundColor;
        opacity: 0.75;

        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
    }

    .PropertieslineBreak {
        @extend .lineBreak;

        background-color: Colors.$ModuleColor;
    }

</style>