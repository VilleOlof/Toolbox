const PluginID = 'com.villeolof.toolbox';
const WorkflowIntegration = require('../src/Lib/WorkflowIntegration.node'); //Runs from the /dist directory

export let Resolve: Resolve;

export function InitPlugin(): boolean {
    const isInitialized = WorkflowIntegration.Initialize(PluginID);
    console.log(`Plugin initialized: ${isInitialized}`);

    Resolve = WorkflowIntegration.GetResolve();

    return isInitialized;
}

/**
 * A collection of useful functions for interacting with the Resolve API  
 * This is the preferred way to interact with the Resolve API if you can.  
 * 
 * type = Page, Project, Timeline, etc. 
 * Instead of every module having to check the current type.  
 * this class will keep track of type.  
 * and notify subscribers when the current type changes.  
 * 
 * You can also ForceUpdate the current type if you really need the active one.
 * 
 * @export
 * @class ResolveFunctions
 * @example
 * 
 * ```ts
 *  ResolveFunctions.SubscribeToChange<ResolveEnums.Pages>("PageChange", (page: ResolveEnums.Pages) => {
 *      console.log(`Page changed to ${page}`);
 *  });
 * 
 *  ResolveFunctions.SubscribeToChange<Timeline>("TimelineChange", (project: Timeline) => {
 *      console.log(`Timeline changed to ${project.GetName()}`);
 *  });
 * ```
 */
export class ResolveFunctions {

    /**
     * Whether or not the ResolveFunctions class has been initialized
     */
    private static _IsInitialized: boolean = false;

    /**
     * The interval that updates the current type
     */
    private static _DataLoop: NodeJS.Timer;

    /**
     * The Resolve ProjectManager
     */
    public static ProjectManager: ProjectManager;
    
    /**
     * The current Resolve Page
     */
    public static CurrentPage: ResolveEnums.Pages;

    /**
     * The current Resolve Project
     */
    public static CurrentProject: Project;

    /**
     * The current Resolve Timeline
     */
    public static CurrentTimeline: Timeline;
    
    /**
     * Force updates the current Resolve Page  
     * 
     * Notifies subscribers if the current page has changed  
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     */
    public static ForceUpdateCurrentPage(notify: boolean = true): void {
        let oldPage: ResolveEnums.Pages = ResolveFunctions.CurrentPage;
        ResolveFunctions.CurrentPage = Resolve.GetCurrentPage() ?? ResolveFunctions.CurrentPage;

        if (oldPage !== ResolveFunctions.CurrentPage && notify) {
            this.NotifySubscribers<ResolveEnums.Pages>("PageChange", ResolveFunctions.CurrentPage);
        }
    }

    //Program doesnt like switching projects ("Unable to find proxy object for proxyId:####" on GetName())
    /**
     * Force updates the current Resolve Project  
     * 
     * Notifies subscribers if the current project has changed  
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     */
    public static ForceUpdateCurrentProject(notify: boolean = true): void {
        let oldProjectName: string = ResolveFunctions.CurrentProject?.GetName() ?? "";
        ResolveFunctions.CurrentProject = this.ProjectManager.GetCurrentProject() ?? ResolveFunctions.CurrentProject;

        if (oldProjectName !== ResolveFunctions.CurrentProject.GetName() && notify) {
            this.NotifySubscribers<Project>("ProjectChange", ResolveFunctions.CurrentProject);
        }
    }

    /**
     * Force updates the current Resolve Timeline
     * 
     * Notifies subscribers if the current timeline has changed
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     */
    public static ForceUpdateCurrentTimeline(notify: boolean = true): void {
        let oldTimelineName: string = ResolveFunctions.CurrentTimeline?.GetName() ?? "";
        ResolveFunctions.CurrentTimeline = this.CurrentProject.GetCurrentTimeline() ?? ResolveFunctions.CurrentTimeline;

        if (oldTimelineName !== ResolveFunctions.CurrentTimeline.GetName() && notify) {
            this.NotifySubscribers<Timeline>("TimelineChange", ResolveFunctions.CurrentTimeline);
        }
    }

    /**
     * Initializes the ResolveFunctions class
     * This should never be called by a module consumer
     * 
     * This is called by the Plugin at startup
     * 
     * @returns {boolean} Whether or not the ResolveFunctions class was initialized
     */
    public static Initialize(): boolean {
        if (!ResolveFunctions._IsInitialized) {
            ResolveFunctions._IsInitialized = true;

            ResolveFunctions.ProjectManager = Resolve.GetProjectManager();
            ResolveFunctions.ForceUpdateCurrentPage();
            ResolveFunctions.ForceUpdateCurrentProject();
            ResolveFunctions.ForceUpdateCurrentTimeline();

            this._DataLoop = ResolveFunctions.UpdateDataLoop(1);
        }

        return ResolveFunctions._IsInitialized;
    }

    /**
     * Stops the interval that updates the current type
     */
    public static StopUpdateDataLoop(): void {
        clearInterval(this._DataLoop);
    }

    /**
     * Starts the interval that updates the current type
     * 
     * @param {number} [delaySeconds=1] The delay between updates
     * 
     * @returns {NodeJS.Timer} The interval that updates the current type
     */
    private static UpdateDataLoop(delaySeconds: number): NodeJS.Timer {
        const dataLoop: NodeJS.Timer = setInterval(() => {
            ResolveFunctions.ForceUpdateCurrentPage();
            ResolveFunctions.ForceUpdateCurrentProject();
            ResolveFunctions.ForceUpdateCurrentTimeline();
        }, delaySeconds * 1000);

        return dataLoop;
    }

    /**
     * A collection of subscribers to the current type change
     */
    private static _ChangeCallbacks: {[key: string]: ((object: any) => void)[]} = {};

    /**
     * Subscribes to the current type change
     * 
     * @param SubscribeType The type of change to subscribe to
     * @param callback The callback to call when the current type changes
     */
    public static SubscribeToChange<T>(SubscribeType: "PageChange" | "ProjectChange" | "TimelineChange", callback: (object: T) => void): void {
        if (!ResolveFunctions._ChangeCallbacks[SubscribeType]) ResolveFunctions._ChangeCallbacks[SubscribeType] = [];
        ResolveFunctions._ChangeCallbacks[SubscribeType].push(callback);
    }

    /**
     * Unsubscribes from the current type change
     * 
     * @param SubscribeType The type of change to unsubscribe from
     * @param callback The callback to unsubscribe
     */
    public static UnsubscribeToChange<T>(SubscribeType: "PageChange" | "ProjectChange" | "TimelineChange", callback: (object: T) => void): void {
        ResolveFunctions._ChangeCallbacks[SubscribeType].splice(ResolveFunctions._ChangeCallbacks[SubscribeType].indexOf(callback), 1);
    }

    /**
     * Notifies subscribers of the current type change
     * 
     * @param SubscribeType The type of change to notify subscribers of
     * @param object The current type
     */
    private static NotifySubscribers<T>(SubscribeType: any, object: T): void {
        if (!ResolveFunctions._ChangeCallbacks[SubscribeType]) return;
        ResolveFunctions._ChangeCallbacks[SubscribeType].forEach(callback => callback(object));
    }
}