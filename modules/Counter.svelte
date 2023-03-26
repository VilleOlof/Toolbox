<script lang="ts">
	import DataStore from '../src/Stores/DataStore';
	import { Settings, SettingTypes } from '../src/Lib/Settings';

	const settings = new Settings('Counter');
	settings.RegisterSetting(
		'increment',
		'The value increment', 
		1,
		SettingTypes.Type.Text
	);
	//settings.Set('increment', 2);

	let incrementValue = settings.GetSettingInfo('increment').Value;

	//###############################

	let Data = new DataStore('Counter');

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
  
<button on:click={increment}>
	count is {count}
</button>