import './App.scss'
import App from './App.svelte'

import { InitPlugin } from './Lib/DavinciResolve'
InitPlugin();

import { GlobalSettings } from './Lib/Settings'
GlobalSettings.LoadGlobalSettings();

const app = new App({
  target: document.getElementById('app'),
})

export default app
