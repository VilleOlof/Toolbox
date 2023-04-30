<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import ModuleQuickDrop from "./Components/ModuleQuickDrop.svelte";
    import ModuleView from "./Components/ModuleView.svelte";
    import Navbar from "./Components/Navbar.svelte";

    import Settings from "./Components/Settings.svelte";
    import { GlobalSettings } from "./Lib/Settings";
    import { AppSettings } from "./Lib/AppSettings";
    import Update from "./Components/Update.svelte";

    let settingComponent;
    let moduleViewComponent;

    let ShowSettings: boolean = GlobalSettings.SettingsData.Get("ShowSettingsMenu", false);
    GlobalSettings.SettingsData.Subscribe("ShowSettingsMenu", (value: boolean) => {
        ShowSettings = value;

        if (ShowSettings) {
            if (!moduleViewComponent) return;

            if (AppSettings.GetSetting('Debug', false)) console.log("destroying moduleView, Opening settings");
            moduleViewComponent.$destroy();
        }
        else {
            if (!settingComponent) return;

            if (AppSettings.GetSetting('Debug', false)) console.log("destroying settings, Opening moduleView");
            settingComponent.$destroy();
        }
    });
</script>

<ModuleQuickDrop />

<Navbar />

{#if ShowSettings}
    <div in:fly="{{ y: -200, duration: 500 }}" out:fade>
        <Settings bind:this={settingComponent}/>
    </div>
{:else}
    <ModuleView bind:this={moduleViewComponent} />
{/if}

<Update />

<style lang="scss">
</style>