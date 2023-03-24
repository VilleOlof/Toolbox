<script lang="ts">

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
        <div id="moduleContainer">
            <p>Add Module</p>
            <img id="arrowDownIcon" class=reverseColor src="../src/assets/arrowDown.svg" alt="Dropdown">
        </div>
    
        <img id="settingsIcon" class=reverseColor src="../src/assets/settings_icon.svg" alt="Settings">
    </div>

</div>

<style lang="scss">
    @use '../scss/Flex' as *;
    @use '../scss/Variables' as vars;

    @mixin IconAnimation($hoverScale: 1.1,$activeScale: 0.9, $duration: 0.2s) {
        &:hover {
            cursor: pointer;

            transform: scale($hoverScale);
        }

        &:active {
            transform: scale($activeScale);
        }

        transition: $duration;
    }

    #navbarContainer {
        @include FlexContainer(center, center, row);

        background-color: darken(vars.$BackgroundColor, 5%);
        height: 3rem;
        width: 100%;
    }

    #leftSide {
        @include FlexContainer(flex-start, center, row);

        margin-right: auto;

        h1 {
            margin-left: 1rem;
        }

        img {
            width: 1.5rem;
            height: auto;

            margin-left: 1rem;

            @include IconAnimation(1.2, 0.9, 0.3s);
        }
    }

    #rightSide {
        @include FlexContainer(flex-end, center, row);

        margin-left: auto;
    }

    #moduleContainer {
        @include FlexContainer(center, center, row);

        margin-right: 1rem;
    }

    #settingsIcon {
        margin: 0.5rem;

        width: 2.5rem;
        height: auto;

        @include IconAnimation;
    }

    #arrowDownIcon {
        @include IconAnimation(1.2, 0.9, 0.2s);
    }

    .reverseColor {
        filter: invert(100%);
    }

</style>