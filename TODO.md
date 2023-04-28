# Davinki Toolbox TODO  

Internal TODO list for Davinki Toolbox.
And list of priorities.

## High Priority  

- Improve Dev Version (And make it public)  
- Export/Import AppSettings/Data/Settings *(Move to own folder?)*  
- Updater.js (Check for updates, and update source files)  
- Shutdown Plugin if Davinci Is closed (If possible, BG thread, ping pong?)  
- Update DataStore to be more like Settings in terms of data loading.  
- Add an indicator in moduleView that shortcuts are enabled/disabled.

## Other Stuff  

- Add more modules and hence, features  
- Quickly change themes?  
- Convert to SvelteKit? (Tauri would be best but doubt that will work with resolve)  
- Remake settings in more svelte like way?  
- Find a way to save window size, position and such but not in AppSettings? (or have critical constant information in another file)
- Click and remove in the "Add Module" dropdown, when a module is placed already it becomes a "- ModuleName"

## Bugs

- Modules get stuck when dragging a module into a different sized containers drag corner
- Things get a bit weird when switching projects while having the moduleView open (or even just switching timeline in some cases)
- Update not overwriting Appsettings in some scenario? (Maybe just a one time thing)
