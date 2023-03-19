import './App.scss'
import App from './App.svelte'

import { InitPlugin } from './Lib/DavinciResolve'
InitPlugin()

const app = new App({
  target: document.getElementById('app'),
})

export default app
