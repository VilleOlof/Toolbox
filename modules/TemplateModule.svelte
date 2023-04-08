<script lang="ts">
    import { Resolve } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    //Change this to the name of your module
    const componentID: string = "TemplateModule";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    // Here goes your actual code:

</script>


<!-- This main tag needs to have the same component ID as the registration ID-->
<main id={componentID}>

</main>


<style lang="scss">

</style>

<!--This template module wont be dynamically imported-->