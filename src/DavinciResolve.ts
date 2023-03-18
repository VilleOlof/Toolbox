const PluginID = 'com.villeolof.toolbox';

const WorkflowIntegration = require('../WorkflowIntegration.node');

export function InitPlugin(): boolean {
    const isInitialized = WorkflowIntegration.Initialize(PluginID);
    console.log(`Plugin initialized: ${isInitialized}`);

    return isInitialized;
}

export function GetResolve(): Resolve {
    const resolve = WorkflowIntegration.GetResolve();

    return resolve;
}