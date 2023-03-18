<script lang="ts">
    import ModuleHandler from "./ModuleHandler.svelte";
    import RefreshNotification from "./RefreshNotification.svelte";

    const WorkflowIntegration = require('../WorkflowIntegration.node');
    const isInitialized = WorkflowIntegration.Initialize('com.villeolof.toolbox');

    if (isInitialized) {
        const resolve: Resolve = WorkflowIntegration.GetResolve();
        console.log(`Davinci Resolve version: ${resolve.GetVersionString()}`)
    }
</script>

<h1>Davinki</h1>

<ModuleHandler />
<RefreshNotification />

<style lang="scss">
    h1 {
        color: rgb(255, 255, 255);
    }
</style>