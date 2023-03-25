<script lang="ts">
    import RefreshNotification from "./RefreshNotification.svelte";

    const GithubEvent = () => {
        console.log('GithubEvent');
        require('electron').shell.openExternal('https://github.com/VilleOlof/Toolbox');
    }

</script>

<div id=navbarContainer>
    <div id=leftSide>
        <h1>Davinki Toolbox</h1>

        <img class=reverseColor on:click={GithubEvent} on:keydown={GithubEvent} src="../src/assets/github.svg" alt="Github">
    </div>

    <div id=rightSide>
        <RefreshNotification />

        <div id="columnContainer">
            <p>Add Column</p>
            <img id="arrowDownIcon" class=reverseColor src="../src/assets/arrowDown.svg" alt="Dropdown">
        </div>

        <div id="moduleContainer">
            <p>Add Module</p>
            <img id="arrowDownIcon" class=reverseColor src="../src/assets/arrowDown.svg" alt="Dropdown">
        </div>
    
        <img id="settingsIcon" class=reverseColor src="../src/assets/settings_icon.svg" alt="Settings">
    </div>

</div>

<style lang="scss">
    @use '../scss/Flex';
    @use '../scss/Variables' as vars;
    @use '../scss/Animation';

    #navbarContainer {
        @include Flex.Container(center, center, row);

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

    #columnContainer {
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

    .reverseColor {
        filter: invert(100%);
    }

</style>