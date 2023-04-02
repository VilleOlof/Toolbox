import './App.scss'
import App from './App.svelte'

import { InitPlugin, ResolveFunctions } from './Lib/DavinciResolve'
InitPlugin();
ResolveFunctions.Initialize();

import { GlobalSettings } from './Lib/Settings'
GlobalSettings.LoadGlobalSettings();

const app = new App({
  target: document.getElementById('app'),
})

export default app
