<script lang="ts">
    import { GlobalSettings } from "../Lib/Settings";
    import { ModuleHandler } from "../Lib/ModuleHandler";
    import { DragHandler } from "../Lib/DragHandler";
    import { PluginCleanUp } from "../Lib/DavinciResolve";
    import { AppSettings } from "../Lib/AppSettings";
    import { Common } from "../Lib/Common";
    import RefreshNotification from "./RefreshNotification.svelte";
  import { Logger } from "../Lib/Logger";

    const GithubEvent = () => {
        Common.Electron.OpenExternalLink('https://github.com/VilleOlof/Toolbox');
    }

    const Close = () => {
        const bounds = Common.Electron.GetCurrentWindow().getBounds();
        AppSettings.SetSetting('WindowSize', {
            width: bounds.width,
            height: bounds.height
        })

        const position = Common.Electron.GetCurrentWindow().getPosition();
        AppSettings.SetSetting('WindowPosition', {
            x: position[0],
            y: position[1]
        });

        PluginCleanUp();
        Common.Electron.GetCurrentWindow().close();
    }

    const ToggleColumnDropdown = (Show: boolean) => {
        if (GlobalSettings.GetSettingToggleStatus()) return;
        let dropdown = document.querySelector("#columnDropdown") as HTMLDivElement;

        dropdown.style.display = Show ? "block" : "none";
    }

    const ToggleModuleDropdown = (Show: boolean) => {
        if (GlobalSettings.GetSettingToggleStatus()) return;
        let dropdown = document.querySelector("#moduleDropdown") as HTMLDivElement;

        dropdown.style.display = Show ? "block" : "none";
    }

    const ToggleEditBG = () => {
        let editBG = document.querySelector("#editModeBG") as HTMLDivElement;
        const editDisplay = editBG.style.display;

        editBG.style.display = editDisplay == "block" ? "none" : "block";
        Logger.Log(`Edit Mode: ${editDisplay == "block" ? "Enabled" : "Disabled"}`, 'info', 'file');
    }

    const ModuleEntryName = (moduleName: string) => {
        if (moduleName.length > 15) {
            return moduleName.substring(0, 15) + "...";
        } else {
            return moduleName;
        }
    }

</script>

<div id="editModeBG"></div>

<div id=navbarContainer>
    <div id=leftSide>
        <img id=closeButton class=reverseColor on:click={Close} on:keydown={Close} src="../src/assets/close.svg" alt="Exit">

        <h1 id="title">Davinki Toolbox</h1>

        <img class=reverseColor on:click={GithubEvent} on:keydown={GithubEvent} src="../src/assets/github.svg" alt="Github">
    </div>

    <div id=rightSide>

        <p id="trashArea">Trash</p>

        <RefreshNotification />

        <p id="editModeButton"
        on:click={() => {
            DragHandler.ToggleDragCorners(true);
            ToggleEditBG();
        }}
        on:keydown={() => {
            DragHandler.ToggleDragCorners(true);
            ToggleEditBG();
            }}
        >Edit Mode</p>

        <div id="nav_columnContainer">
            <p>Add Column</p>
            <img 
                on:mouseenter={() => {ToggleColumnDropdown(true)}}
                on:mouseleave={() => {ToggleColumnDropdown(false)}}

                id="arrowDownIcon" class=reverseColor src="../src/assets/arrowDown.svg" alt="Dropdown"
            >
            <div id=columnDropdown
            on:mouseenter={() => {ToggleColumnDropdown(true)}}
            on:mouseleave={() => {ToggleColumnDropdown(false)}}
            >
                <div id="ColumnSizeEntries">
                    {#each Object.keys(ModuleHandler.ComponentSize) as Size}
                        <span on:click={() => {ModuleHandler.AddColumn(ModuleHandler.ComponentSize[Size])}} 
                            on:keydown={() => {ModuleHandler.AddColumn(ModuleHandler.ComponentSize[Size])}}>
                            + {ModuleHandler.ComponentSize[Size]}
                        </span>
                    {/each}
                </div>
            </div>
        </div>

        <div id="moduleContainer">
            <p>Add Module</p>
            <img id="arrowDownIcon" 
            on:mouseenter={() => {ToggleModuleDropdown(true)}}
            on:mouseleave={() => {ToggleModuleDropdown(false)}}
            class=reverseColor src="../src/assets/arrowDown.svg" alt="Dropdown"
            >
            <div id="moduleDropdown"
            on:mouseenter={() => {ToggleModuleDropdown(true)}}
            on:mouseleave={() => {ToggleModuleDropdown(false)}}
            >
                <div id="moduleEntries">
                    {#each Object.keys(ModuleHandler.ModuleImports) as ModuleName}
                        <span on:click={() => {ModuleHandler.AddModuleInColumn(ModuleName, document.body)}} 
                            on:keydown={() => {ModuleHandler.AddModuleInColumn(ModuleName, document.body)}}
                            >
                            + {ModuleEntryName(ModuleName)}
                        </span>
                    {/each}
                </div>
            </div>
        </div>
    
        <img on:click={GlobalSettings.ChangeShowSettingsMenu} on:keydown={GlobalSettings.ChangeShowSettingsMenu} id="settingsIcon" class=reverseColor src="../src/assets/settings_icon.svg" alt="Settings">
    </div>

</div>

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Animation';
    @use '../scss/Colors';

    #navbarContainer {
        @include Flex.Container(center, center, row);

        position: fixed;
        top: 0;
        left: 0;

        background-color: darken(Colors.$BackgroundColor, 3%);
        height: 3rem;
        width: 100vw;

        box-shadow: 0 1rem 1rem rgba(19, 19, 19, 0.384);

        z-index: 15;

        -webkit-app-region: drag;
        user-select: none;

        & img {
            -webkit-user-drag: none;
        }
    }

    #editModeBG {
        display: none;

        position: fixed;
        top: 0;
        left: 0;

        height: 100vh;
        width: 100vw;

        background-color: rgba(0, 0, 0, 0.5);

        z-index: 0;

        background: repeating-linear-gradient(
        45deg,
        #00000015,
        #00000015 4rem,
        #949e0015 4rem,
        #949e0015 8rem
        );
    }

    #title {
        -webkit-app-region: drag !important;
    }

    *:not(#navbarContainer) {
        -webkit-app-region: no-drag;
    }

    #leftSide {
        @include Flex.Container(flex-start, center, row);

        margin-right: auto;

        h1 {
            margin: 0;
            margin-left: 1rem;

            @media screen and (max-width: 900px) {
                font-size: 1.25em;
            }
            @media screen and (max-width: 815px) {
                display: none;
            }

            transition: font-size 0.2s;
        }

        img {
            width: 1.5rem;
            height: auto;

            margin-left: 1rem;

            @include Animation.Icon(1.2, 0.9, 0.3s);
        }
    }

    #rightSide {
        @include Flex.Container(flex-end, center, row);

        margin-left: auto;
        margin-right: 1rem;
    }

    #moduleContainer {
        @include Flex.Container(center, center, row);

        margin-right: 1rem;
    }

    #nav_columnContainer {
        @extend #moduleContainer;
    }

    #settingsIcon {
        margin: 0.5rem;

        width: 2.5rem;
        height: auto;

        @include Animation.Icon;
    }

    #arrowDownIcon {
        @include Animation.Icon(1.2, 0.9, 0.2s);
    }

    #columnDropdown {
        display: none;

        position: absolute;

        top: 2.2rem;

        background-color: darken(#222222d5, 8%);
        border-radius: 0.5rem;
        padding: 0.5rem;
    }

    #ColumnSizeEntries {
        @include Flex.Container(center, center, column);

        & > span {
            user-select: none;

            &:not(.is-active):hover {
                cursor: pointer;

                color: #afafaf;
            }

            &:active {
                transform: scale(1.1);
            }

            transition: 0.2s;
        }
    }

    #moduleDropdown {
        @extend #columnDropdown;
    }

    #moduleEntries {
        @extend #ColumnSizeEntries;
    }

    #editModeButton {
        margin-right: 1rem;

        user-select: none;

        &:hover {
            cursor: pointer;

            color: #afafaf;
        }

        &:active {
            transform: scale(1.1);
        }

        transition: 0.2s;
    }

    #trashArea {
        user-select: none;
        padding: 0.4em;

        margin-right: 0.5rem;

        display: none;

        background-color: #ff000052;
        
        &:hover {
            background-color: #ff0000;
            transform: scale(0.9);
        }

        border-radius: 0.5em;

        transition: background-color 0.2s, transform 0.2s;
    }

    :global(#moduleEntries > .is-active) {
        color: #5f5f5f;
    }

    #closeButton {
        width: 2rem !important;
        height: auto;
    }

    .reverseColor {
        filter: invert(Colors.$IconInvertPercentage);
    }

</style>