<script lang="ts">
    import { onMount } from 'svelte';
    import modules from '../../module_list.json'
    import moduleIgnores from '../../module_ignore.json'

    let moduleImports: Function[] = []
    modules.forEach(module => {
        if (moduleIgnores.includes(module)) return;
        moduleImports.push(async function() {
            return (await import(/* @vite-ignore*/ `../../modules/${module}.svelte`)).default
        });
    });

    function AddModulesAsComponents(imports: Function[], div: HTMLDivElement): void {
        imports.forEach(async rawComponent => {
            const component = await rawComponent();

            new component({
                target: div,
                class: 'module',
            });
        });
    }

    onMount(() => {
        AddModulesAsComponents(moduleImports, (document.getElementById('modules') as HTMLDivElement));
    });
</script>

<div id=modules>
    <!--here to keep the css style-->
    <div class="module"></div>
</div>

<style lang="scss">
    :global(.module) {
        max-width: 50px;
        max-height: 50px;
        color: red;
    }
</style>