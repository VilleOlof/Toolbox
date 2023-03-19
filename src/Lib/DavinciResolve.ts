const PluginID = 'com.villeolof.toolbox';
const WorkflowIntegration = require('../src/Lib/WorkflowIntegration.node'); //Runs from the /dist directory

export let Resolve: Resolve;

export function InitPlugin(): boolean {
    const isInitialized = WorkflowIntegration.Initialize(PluginID);
    console.log(`Plugin initialized: ${isInitialized}`);

    Resolve = WorkflowIntegration.GetResolve();

    return isInitialized;
}