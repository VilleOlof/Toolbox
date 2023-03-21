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

	let test = new DataStore('test');
	let nodeRef: HTMLDivElement;
</script>
  
<button on:click={increment}>
	count is {count}
</button>

<div bind:this={nodeRef}>
	<h3>Hey I'm a component</h3>
	<button on:click={() => nodeRef.parentNode.removeChild(nodeRef)}>
	  Remove me
	</button>
  </div>