<script lang="ts">
	import DataStore from '../src/Stores/DataStore';

	let _settings = new DataStore('Counter');

	_settings.Subscribe('count', (count) => {
		console.log('count changed to', count);
	});

	let count: number = _settings.Get('count');
	const increment = () => {
		count += 1;
		_settings.Set('count', count);
	}
</script>
  
<button on:click={increment}>
	count is {count}
</button>