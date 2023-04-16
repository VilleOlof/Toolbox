<script lang="ts">
    import ModuleQuickDrop from "./Components/ModuleQuickDrop.svelte";
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
            if (!moduleViewComponent) return;

            console.log("destroying moduleView, Opening settings");
            moduleViewComponent.$destroy();
        }
        else {
            if (!settingComponent) return;

            console.log("destroying settings, Opening moduleView");
            settingComponent.$destroy();
        }
    });
</script>

<ModuleQuickDrop />

<Navbar />

{#if ShowSettings}
    <Settings bind:this={settingComponent}/>
{:else}
    <ModuleView bind:this={moduleViewComponent} />
{/if}

<style lang="scss">
</style>