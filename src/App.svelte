<script lang="ts">
    import ModuleView from "./Components/ModuleView.svelte";
    import Navbar from "./Components/Navbar.svelte";

    import Settings from "./Components/Settings.svelte";
    import { GlobalSettings } from "./Lib/Settings";

    let settingComponent;
    let moduleViewComponent;

    let ShowSettings: boolean = GlobalSettings.SettingsData.Get("ShowSettingsMenu", false);
    GlobalSettings.SettingsData.Subscribe("ShowSettingsMenu", (value: boolean) => {
        ShowSettings = value;

        if (ShowSettings) {
            moduleViewComponent.$destroy();
        }
        else {
            settingComponent.$destroy();
        }
    });
</script>

<Navbar />

{#if ShowSettings}
    <Settings bind:this={settingComponent}/>
{:else}
    <ModuleView bind:this={moduleViewComponent} />
{/if}

<style lang="scss">
</style>