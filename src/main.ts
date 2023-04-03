import './App.scss'
import App from './App.svelte'

import { InitPlugin, ResolveFunctions } from './Lib/DavinciResolve'
InitPlugin();
ResolveFunctions.Initialize();

import { GlobalSettings } from './Lib/Settings'
GlobalSettings.LoadGlobalSettings();

//This specific line is somehow always complaining.
//but it still works and its the default svelte app template.
/* @ts-ignore */
const app = new App({
  target: document.getElementById('app'),
})

export default app
