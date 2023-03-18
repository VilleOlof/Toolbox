<script lang="ts">
    import ModuleHandler from "./ModuleHandler.svelte";
    import RefreshNotification from "./RefreshNotification.svelte";

    import { InitPlugin } from "./DavinciResolve";
    InitPlugin();
</script>

<h1>Davinki</h1>

<ModuleHandler />
<RefreshNotification />

<style lang="scss">
</style>