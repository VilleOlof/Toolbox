<!-- markdownlint-disable-next-line -->
<img src="./src/assets/Logo.png" width="600" alt="Davinki Toolbox">

----

A Davinci Resolve plugin that provides a modular toolbox for creating custom tools.  
This plugin runs with Electron, and uses Svelte for the UI and custom modules.  

With Svelte as the framework, it provides an easy way to drag and drop modules into the ./modules folder  
and have them automatically added to the toolbox (after a refresh, which the plugin will auto-detect).  

With a built in easy to use settings & data storage system.  
It makes it easy for custom modules to integrate with the plugins settings menu.  

This wouldnt be possible without help from Stamsite,  
who helped a ton with feature requests, testing, and general feedback.

This plugin is still in early development, and my personal biggest project yet.  
So there might be some bugs and issues.  
If you find any, please report them in the [Issues](https://github.com/VilleOlof/Toolbox/issues) section.  

## Default Modules

- **[Timecode](./modules/Timecode.svelte)**  
    A simple module that displays the current timecode of the timeline.  
- **[Counter](./modules/Counter.svelte)**  
    Two counters that can be used to count up or down.  
    They also have a combined sum and difference counter.  
- **[Notes](./modules/Notes.svelte)**  
    Allows you to write notes and save them between sessions (Or not!).  
- **[Folders](./modules/Folders.svelte)**  
    A small module that allows you to bind folders to colorful icon buttons.  
    This is useful for quickly opening common used folders.  
    Hover over an icon to see the folder path and modify it.  

## Installation  

**Requires: Node.js / NPM**  
Go to the [Releases](https://github.com/VilleOlof/Toolbox/releases/)  
And download the latest installer for your platform.  

Run the installer and if everything went well.  
You should just be able to run the plugin inside Davinci Resolve:  
`DaVinci Resolve > Workspace > Workflow Integrations > Toolbox`  

*MacOS & Linux installers havent been tested yet, so they might not work.*  
If you for some reason can't use the installer, you can also install the [plugin manually](#manual-installation).  

## Custom Modules

To create your own custom made modules.  
You can copy the template module in ./modules and rename the file to the name of your module.  
This template module has most of the common in-house imports and code required for a module.  

Module names can't contain spaces, and should be in PascalCase to match the file name.  

Every module consists of a componentID which the plugin uses to identify the module.  
The component HTML should be wrapped in a main tag with the componentID as the id.  
**Note: componentID must be the same as the filename (excluding extension)**

```HTML
<main id={componentID}>
    <!-- Here goes your HTML-->
</main>
```

And the module should register itself with the module size (Large or Small) and the componentID.  
This should happen in the `onMount` function.  

```js
import { ModuleHandler } from '../src/Lib/ModuleHandler';
onMount(() => {
    ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
});
```

These two parts are the only required parts of a module.  
But as mentioned above, you can just copy the template module and rename it.  

If any new dependencies are added alongside a new module, they will need to be added to the ./package.json file.  
And then run `npm install` to install the new dependencies.  
After that, run `npm run build` to build the project with the new dependencies.  

Modules also have full access to the [Davinci Resolve API](./src/Lib/ResolveAPI.d.ts), The file system and other Node.js modules.  

Note: Going to the settings page acts like a soft-refresh.  
Any temporary data that is stored in the module will be lost.  
It will destroy the component and re-create it.  
So you only need to load the settings data once at the start of the module life cycle.  

### Module Settings

### Module Data

### Common

## Docs  

There is no read-made docs, they have to be generated from source.  

Run the following command in the root directory of the project:  

```bash
npm run docs
```

This will generate the docs in the ./docs folder.  
And then you can spin up a local server to view the docs.  
With the following command:

```bash
npm run docs:serve
```

## Custom Theme

If you want to change the theme or colors used in the plugin.  
You can edit the Sass color variables in [_Colors](./src/scss/_Colors.scss) file.  
And then rebuild the project with `npm run build`.

## Manual Installation

**Requires: Node.js / NPM**  
Copy the repository to your local machine.  
And put the folder in the following directory:  

`%ProgramData%\Blackmagic Design\DaVinci Resolve\Support\Workflow Integration Plugins\Toolbox`  
*(Note that neither `\Workflow Integration Plugins\` nor `\Toolbox` exist, so you will need to create them)*  

Run the following command in the root directory of the project:  

```bash  
npm install  
npm run build  
```  

This will install all the dependencies and build the project.  

And then you can run the plugin inside Davinci Resolve:  
`DaVinci Resolve > Workspace > Workflow Integrations > Toolbox`  

*Since Davinci Resolve looks for a folder with a manifest.xml file inside of it.  
It is currently recommended to just have the entire project folder inside the plugin folder.*  
