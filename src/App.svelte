<script lang="ts">
    import Counter from "../modules/Counter.svelte";
    import ModuleHandler from "./Components/ModuleHandler.svelte";
    import ModuleView from "./Components/ModuleView.svelte";
    import Navbar from "./Components/Navbar.svelte";

    import Settings from "./Components/Settings.svelte";

    export let settings: boolean = true;
</script>

<Navbar />
    
{#if settings}
    <Settings />
{:else}
    <ModuleView />
{/if}

<!-- <Counter/> -->
<ModuleHandler/>

<style lang="scss">
</style>