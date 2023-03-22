<script lang="ts">
	import DataStore from '../src/Stores/DataStore';
	import { Settings, SettingsType } from '../src/Lib/Settings';

	const settings = new Settings('Counter');
	settings.RegisterSetting(
		'increment',
		'The value increment', 
		1,
		SettingsType.Numeric
	);
	
	settings.RegisterSetting(
		'testslider',
		'a slide info test', 
		5,
		SettingsType.Slider,
		{ Min: 0, Max: 10, Step: 1 }
	);

	//settings.Set('increment', 2);

	const incrementValue = settings.Get('increment').Value;

	//###############################

	let Data = new DataStore('Counter');

	Data.Subscribe('count', (count) => {
		console.log('count changed to', count);
	});

	let count: number = Data.Get('count', 0);
	const increment = () => {
		count += incrementValue;
		Data.Set('count', count);
	}
</script>
  
<button on:click={increment}>
	count is {count}
</button>