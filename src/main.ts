import './App.scss'
import App from './App.svelte'
import { AppSettings } from './Lib/AppSettings';
import { Common } from './Lib/Common';

AppSettings.Init();

import { InitPlugin, ResolveFunctions } from './Lib/DavinciResolve'
InitPlugin();
ResolveFunctions.Initialize();

import { GlobalSettings } from './Lib/Settings'
GlobalSettings.LoadGlobalSettings();

//Keeping the plugin, otherwise we close the plugin.
setInterval(async () => {
  Common.LifeCyclePing(false);
}, 1000);

//This specific line is somehow always complaining.
//but it still works and its the default svelte app template.
/* @ts-ignore */
const app = new App({
  target: document.getElementById('app'),
})

export default app
