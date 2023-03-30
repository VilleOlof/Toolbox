<script lang="ts">
	import DataStore from '../src/Stores/DataStore';
	import { Settings, SettingTypes, GlobalSettings } from '../src/Lib/Settings';

	const componentID: string = "Counter";

	const settings: Settings = GlobalSettings.GetInstance(componentID);
	settings.RegisterSetting(
		'increment',
		'The value increment', 
		1,
		SettingTypes.Type.Text,
		{
			MinLength: 1,
			MaxLength: 5,
			Placeholder: 'Enter a number',
			Pattern: '[0-9]+',
			List: ["1", "2", "3", "4", "5"]
		}
	);
	//settings.Set('increment', 2);

	let incrementValue = settings.GetSettingInfo('increment').Value;

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
  
<button on:click={increment}>
	count is {count}
</button>