<script lang="ts">
    import ModuleHandler from "./Components/ModuleHandler.svelte";
    import ModuleView from "./Components/ModuleView.svelte";
    import Navbar from "./Components/Navbar.svelte";

    import Settings from "./Components/Settings.svelte";
    import { GlobalSettings } from "./Lib/Settings";

    let ShowSettings: boolean = false;
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

<!-- <Counter/> -->
<ModuleHandler/>

<style lang="scss">
</style>