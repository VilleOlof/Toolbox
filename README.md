# Toolbox

A Davinci Resolve plugin that provides a modular toolbox for creating custom tools.  
This plugin runs with Electron, and uses Svelte for the UI and custom modules.  

With Svelte as the framework, it provides an easy way to drag and drop modules into the ./modules folder  
and have them automatically added to the toolbox (after a refresh, which the plugin will auto-detect).  

If any new dependencies are added alongside a new module, they will need to be added to the ./package.json file.  
And then run `npm install` to install the new dependencies.  
After that, run `npm run build` to build the project with the new dependencies.  

There is an example module in the ./modules folder, which can be used as a template for creating new modules.  
It is recommended to copy the example module and rename it to the name of the new module.  

There is a [Specs](./Specs.md) file that contains the specs for the plugin.  
And some other information about things.  

## Install

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
