<script lang="ts">
    import { onMount } from 'svelte';
    import modules from '../module_list.json'

    let moduleImports: Function[] = []
    modules.forEach(module => {
        moduleImports.push(async function() {
            return (await import(/* @vite-ignore*/ `../modules/${module}.svelte`)).default
        });
    });

    function AddModulesAsComponents(imports: Function[], div: HTMLDivElement): void {
        imports.forEach(async rawComponent => {
            const component = await rawComponent();

            new component({
                target: div
            });
        });
    }

    onMount(() => {
        AddModulesAsComponents(moduleImports, (document.getElementById('modules') as HTMLDivElement));
    });
</script>

<div id=modules></div>

<style lang="scss">
</style>