<script lang="ts">
    import RefreshNotification from "./RefreshNotification.svelte";
    import { GlobalSettings } from "../Lib/Settings";
    import { ModuleHandler } from "../Lib/ModuleHandler";
    import ModuleView from "./ModuleView.svelte";

    const GithubEvent = () => {
        require('electron').shell.openExternal('https://github.com/VilleOlof/Toolbox');
    }

    const ToggleColumnDropdown = (Show: boolean) => {
        let dropdown = document.querySelector("#columnDropdown") as HTMLDivElement;

        dropdown.style.display = Show ? "block" : "none";
    }

    const ToggleModuleDropdown = (Show: boolean) => {
        let dropdown = document.querySelector("#moduleDropdown") as HTMLDivElement;

        dropdown.style.display = Show ? "block" : "none";
    }

</script>

<div id=navbarContainer>
    <div id=leftSide>
        <h1>Davinki Toolbox</h1>

        <img class=reverseColor on:click={GithubEvent} on:keydown={GithubEvent} src="../src/assets/github.svg" alt="Github">
    </div>

    <div id=rightSide>
        <RefreshNotification />

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
                            on:keydown={() => {ModuleHandler.AddModuleInColumn(ModuleName, document.body)}}>
                            + {ModuleName}
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
    @use '../scss/Variables' as vars;
    @use '../scss/Animation';

    #navbarContainer {
        @include Flex.Container(center, center, row);

        position: absolute;
        top: 0;

        background-color: darken(vars.$BackgroundColor, 5%);
        height: 3rem;
        width: 100%;

        box-shadow: 0 1rem 1rem rgba(19, 19, 19, 0.384);

        z-index: 3;
    }

    #leftSide {
        @include Flex.Container(flex-start, center, row);

        margin-right: auto;

        h1 {
            margin-left: 1rem;
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

        background-color: darken(#222222d5, 3%);
        border-radius: 0.5rem;
        padding: 0.5rem;
    }

    #ColumnSizeEntries {
        @include Flex.Container(center, center, column);

        & > span {
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
    }

    #moduleDropdown {
        @extend #columnDropdown;
    }

    #moduleEntries {
        @extend #ColumnSizeEntries;
    }

    .reverseColor {
        filter: invert(100%);
    }

</style>