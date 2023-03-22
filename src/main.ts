import './App.scss'
import App from './App.svelte'

import { InitPlugin } from './Lib/DavinciResolve'
InitPlugin();

import { LoadGlobalSettings } from './Lib/Settings'
LoadGlobalSettings();

const app = new App({
  target: document.getElementById('app'),
})

export default app
