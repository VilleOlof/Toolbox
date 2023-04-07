<script lang="ts">
	import DataStore from '../src/Stores/DataStore';
	import { Settings, SettingTypes, GlobalSettings } from '../src/Lib/Settings';
	import { ModuleHandler } from '../src/Lib/ModuleHandler';
	import { onMount } from 'svelte';

	const componentID: string = "Counter";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

	const settings: Settings = GlobalSettings.GetInstance(componentID);
	settings.RegisterSetting(
		'increment',
		'The value increment', 
		1,
		SettingTypes.Type.Numeric,
		<SettingTypes.Numeric>{
			Min: 1,
			Max: 10,
			Step: 1,
			Placeholder: 'Increment'
		}, false
	);
	//settings.Set('increment', 2);

	let incrementValue: number = settings.GetSettingValue('increment');

	//###############################

	let Data = new DataStore(componentID);

	Data.Subscribe('count', (count) => {
		console.log('count changed to', count);
	});

	let count: number = Data.Get('count', 0);
	const increment = () => {
		incrementValue = settings.GetSettingValue('increment');
		count += incrementValue;
		Data.Set('count', count);
	}
</script>
  
<main id={componentID}>
	<button on:click={increment}>
		count is {count}
	</button>
</main>