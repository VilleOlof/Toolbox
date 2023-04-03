<script lang="ts">
    import ModuleView from "./Components/ModuleView.svelte";
    import Navbar from "./Components/Navbar.svelte";

    import Settings from "./Components/Settings.svelte";
    import { GlobalSettings } from "./Lib/Settings";

    let ShowSettings: boolean = GlobalSettings.SettingsData.Get("ShowSettingsMenu", false);
    GlobalSettings.SettingsData.Subscribe("ShowSettingsMenu", (value: boolean) => {
        ShowSettings = value;
    });
</script>

<Navbar />

{#if ShowSettings}
    <Settings />
{:else}
    <ModuleView />
{/if}

<style lang="scss">
</style>