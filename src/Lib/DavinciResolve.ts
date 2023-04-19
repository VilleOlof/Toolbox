import { AppSettings } from "./AppSettings";
import { Common } from "./Common";
import { ResolveWorkerHandler } from "./ResolveWorkerHandler";

let PluginID: string;
const WorkflowIntegration = require('../src/Lib/WorkflowIntegration.node'); //Runs from the /dist directory

/**
 * The Resolve API
 * Read the Documentation & Types At [[ResolveAPI.d.ts]]
 */
export let Resolve: Resolve;

/**
 * Initializes the Plugin in Resolve
 * This should be called by the Plugin at startup
 */
export function InitPlugin(): boolean {
    PluginID = AppSettings.GetSetting("PluginID", "");

    const isInitialized = WorkflowIntegration.Initialize(PluginID);
    console.log(`Plugin initialized: ${isInitialized}`);

    Resolve = WorkflowIntegration.GetResolve();
    //ResolveWorkerHandler.Init();

    return isInitialized;
}

/**
 * Gets the PluginID
 * 
 * @returns {string} The PluginID
 */
export function GetPluginID(): string {
    return PluginID;
}

/**
 * Quits Resolve
 * And cleans up the Plugin
 */
export function QuitResolve(): void {
    WorkflowIntegration.CleanUp();
    Resolve.Quit();
}

/**
 * Cleans up the Plugin
 */
export function PluginCleanUp(): void {
    WorkflowIntegration.CleanUp();
}

/**
 * Quits the Plugin  
 * And saves the current window size and position
 * 
 * @param quitResolve Whether or not to quit Resolve
 */
export function AppQuit(quitResolve: boolean = false): void {
    AppSettings.SetSetting('WindowSize', {
        width: window.innerWidth,
        height: window.innerHeight
    })

    const position = Common.Electron.GetCurrentWindow().getPosition();
    AppSettings.SetSetting('WindowPosition', {
        x: position[0],
        y: position[1]
    });

    if (quitResolve) {
        QuitResolve();
    }
    else {
        PluginCleanUp();
    }

    Common.Electron.GetCurrentWindow().close();
}

/**
 * A collection of useful functions for interacting with the Resolve API  
 * This is the preferred way to interact with the Resolve API if you can.  
 * 
 * Instead of every module having to check the current SubscribeTypes.  
 * this class will keep track of the SubscribeTypes.  
 * and notify subscribers when the current SubscribeTypes changes.  
 * 
 * You can also ForceUpdate the current SubscribeTypes if you really need the active one.
 */
export class ResolveFunctions {

    /**
     * Whether or not the ResolveFunctions class has been initialized
     */
    private static _IsInitialized: boolean = false;

    /**
     * The interval that updates the current SubscribeTypes
     */
    private static _DataLoop: NodeJS.Timer;

    /**
     * The Resolve ProjectManager
     */
    private static ProjectManager: ProjectManager;
    
    /**
     * The current Resolve Page
     */
    private static CurrentPage: ResolveEnums.Pages;

    /**
     * The current Resolve Project
     */
    private static CurrentProject: Project;

    /**
     * The current Resolve Timeline
     */
    private static CurrentTimeline: Timeline;

    /**
     * Gets the ProjectManager
     * Calls Resolve directly, so it will always be up to date
     * 
     * @returns {ProjectManager} The ProjectManager
     * 
     * @example
     * 
     * ```ts
     * let projectManager: ProjectManager = ResolveFunctions.GetProjectManager();
     * ```
     */
    public static GetProjectManager(): ProjectManager {
        this.ProjectManager = Resolve.GetProjectManager();
        return this.ProjectManager;
    }

    /**
     * Gets the current Resolve Page
     * Calls Resolve directly, so it will always be up to date
     * 
     * @returns {ResolveEnums.Pages} The current Resolve Page
     * 
     * @example
     * 
     * ```ts
     * let currentPage: ResolveEnums.Pages = ResolveFunctions.GetCurrentPage();
     * ```
     */
    public static GetCurrentPage(): ResolveEnums.Pages {
        this.CurrentPage = Resolve.GetCurrentPage();
        return this.CurrentPage;
    }

    /**
     * Gets the current Project
     * Calls Resolve directly, so it will always be up to date
     * 
     * @returns {Project} The current Project
     * 
     * @example
     * 
     * ```ts
     * let currentProject: Project = ResolveFunctions.GetCurrentProject();
     * ```
     */
    public static GetCurrentProject(): Project {
        this.ProjectManager = this.GetProjectManager();
        this.CurrentProject = this.ProjectManager.GetCurrentProject();
        return this.CurrentProject;
    }

    /**
     * Gets the current Timeline
     * Calls Resolve directly, so it will always be up to date
     * 
     * @returns {Timeline} The current Timeline
     * 
     * @example
     * 
     * ```ts
     * let currentTimeline: Timeline = ResolveFunctions.GetCurrentTimeline();
     * ```
     */
    public static GetCurrentTimeline(fetchNewProject: boolean = true): Timeline {
        if (fetchNewProject) this.GetCurrentProject();
        this.CurrentTimeline = this.CurrentProject.GetCurrentTimeline();
        return this.CurrentTimeline;
    }
    
    /**
     * Force updates the current Resolve Page  
     * Private, use ForceUpdateSubscribeType instead.  
     * 
     * Notifies subscribers if the current page has changed  
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.ForceUpdateCurrentPage();
     * ```
     */
    private static ForceUpdateCurrentPage(notify: boolean = true): void {
        if (!ResolveFunctions.CurrentPage) return;
        let oldPage: ResolveEnums.Pages = ResolveFunctions?.CurrentPage;
        ResolveFunctions.CurrentPage = this.GetCurrentPage() ?? ResolveFunctions.CurrentPage;

        if (oldPage !== ResolveFunctions.CurrentPage && notify) {
            this.NotifySubscribers<ResolveEnums.Pages>(ResolveFunctions.SubscribeTypes.Pages, ResolveFunctions.CurrentPage);
        }
    }

    //Program doesnt like switching projects ("Unable to find proxy object for proxyId:####" on GetName())
    /**
     * Force updates the current Resolve Project  
     * Private, use ForceUpdateSubscribeType instead.
     * 
     * Notifies subscribers if the current project has changed  
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.ForceUpdateCurrentProject();
     * ```
     */
    private static ForceUpdateCurrentProject(notify: boolean = true): void {
        if (!ResolveFunctions.CurrentProject) return;
        let oldProjectName: string = ResolveFunctions?.CurrentProject?.GetName() ?? "";
        ResolveFunctions.CurrentProject = this.GetCurrentProject() ?? ResolveFunctions.CurrentProject;

        if (oldProjectName !== ResolveFunctions.CurrentProject.GetName() && notify) {
            this.NotifySubscribers<Project>(ResolveFunctions.SubscribeTypes.Project, ResolveFunctions.CurrentProject);
        }
    }

    /**
     * Force updates the current Resolve Timeline  
     * Private, use ForceUpdateSubscribeType instead.
     * 
     * Notifies subscribers if the current timeline has changed
     * 
     * @param {boolean} [notify=true] Whether or not to notify subscribers
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.ForceUpdateCurrentTimeline();
     * ```
     */
    private static ForceUpdateCurrentTimeline(notify: boolean = true): void {
        if (!ResolveFunctions.CurrentTimeline) return;
        let oldTimelineName: string = ResolveFunctions?.CurrentTimeline?.GetName() ?? "";
        ResolveFunctions.CurrentTimeline = this.GetCurrentTimeline() ?? ResolveFunctions.CurrentTimeline;

        if (oldTimelineName !== ResolveFunctions.CurrentTimeline.GetName() && notify) {
            this.NotifySubscribers<Timeline>(ResolveFunctions.SubscribeTypes.Timeline, ResolveFunctions.CurrentTimeline);
        }
    }

    /**
     * Initializes the ResolveFunctions class
     * This should never be called by a module consumer
     * 
     * This is called by the Plugin at startup
     * 
     * @returns {boolean} Whether or not the ResolveFunctions class was initialized
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.Initialize();
     * ```
     */
    public static Initialize(): boolean {
        if (!ResolveFunctions._IsInitialized) {
            ResolveFunctions._IsInitialized = true;

            ResolveFunctions.ProjectManager = Resolve.GetProjectManager();
            ResolveFunctions.ForceUpdateCurrentPage();
            ResolveFunctions.ForceUpdateCurrentProject();
            ResolveFunctions.ForceUpdateCurrentTimeline();

            let DelaySeconds: number = AppSettings.GetNestedSetting(1, "ResolveFunctions", "UpdateLoop_DelaySeconds");
            this._DataLoop = ResolveFunctions.UpdateDataLoop(DelaySeconds);
        }

        return ResolveFunctions._IsInitialized;
    }

    /**
     * Stops the interval that updates the current SubscribeTypes
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.StopUpdateDataLoop();
     * ```
     */
    public static StopUpdateDataLoop(): void {
        clearInterval(this._DataLoop);
    }

    /**
     * Starts the interval that updates the current SubscribeTypes
     * Only updates the SubscribeTypes that have subscribers
     * 
     * @param {number} [delaySeconds=1] The delay between updates
     * 
     * @returns {NodeJS.Timer} The interval that updates the current SubscribeTypes
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.UpdateDataLoop();
     * ```
     */
    private static UpdateDataLoop(delaySeconds: number = 1): NodeJS.Timer {
        const SubscribeTypeKeys: string[] = Object.keys(ResolveFunctions.SubscribeTypes);

        const dataLoop: NodeJS.Timer = setInterval(() => {
            SubscribeTypeKeys.forEach((SubscribeTypeKey: string) => {
                if (this.CheckIfSubscribeTypeExists(ResolveFunctions.SubscribeTypes[SubscribeTypeKey])) {
                    this.ForceUpdateSubscribeType(ResolveFunctions.SubscribeTypes[SubscribeTypeKey]);
                }
            });

            //TODO
            if (!Resolve.GetVersionString()) {
                // @ts-ignore // it thinks that 'remote' is not a property of 'electron'
                const app = require('electron').remote.app;
                QuitResolve();

                app.relaunch();
                app.exit();
            }

        }, delaySeconds * 1000);

        return dataLoop;
    }

    /**
     * Force updates the current SubscribeTypes
     * 
     * @param SubscribeType The SubscribeTypes to update
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.ForceUpdateSubscribeType(ResolveFunctions.SubscribeTypes.Pages);
     * ```
     */
    public static ForceUpdateSubscribeType(SubscribeType: ResolveFunctions.SubscribeTypes, notify: boolean = true): void {
        switch (SubscribeType) {
            case ResolveFunctions.SubscribeTypes.Pages:
                ResolveFunctions.ForceUpdateCurrentPage(notify);
                break;
            case ResolveFunctions.SubscribeTypes.Project:
                ResolveFunctions.ForceUpdateCurrentProject(notify);
                break;
            case ResolveFunctions.SubscribeTypes.Timeline:
                ResolveFunctions.ForceUpdateCurrentTimeline(notify);
                break;
        }
    }

    /**
     * A collection of subscribers to the current SubscribeTypes change
     */
    private static _ChangeCallbacks: {[key: string]: ((object: any) => void)[]} = {};

    /**
     * Checks if a SubscribeTypes exists in the _ChangeCallbacks collection
     * 
     * @param SubscribeType The SubscribeTypes to check
     * @returns {boolean} Whether or not the SubscribeTypes exists in the _ChangeCallbacks collection
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.CheckIfSubscribeTypeExists(ResolveFunctions.SubscribeTypes.Pages);
     * ```
     */
    private static CheckIfSubscribeTypeExists(SubscribeType: ResolveFunctions.SubscribeTypes): boolean {
        return ResolveFunctions._ChangeCallbacks[SubscribeType] ? true : false;
    }

    /**
     * Subscribes to the current SubscribeTypes change
     * 
     * @param SubscribeType The SubscribeTypes of change to subscribe to
     * @param callback The callback to call when the current SubscribeTypes changes
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.SubscribeToChange<ResolveEnums.Pages>(ResolveFunctions.SubscribeTypes.Pages, (page: ResolveEnums.Pages) => {
     *    console.log(`Page changed to ${page}`);
     * });
     * ```
     */
    public static SubscribeToChange<T>(SubscribeType: ResolveFunctions.SubscribeTypes, callback: (object: T) => void): void {
        if (!this.CheckIfSubscribeTypeExists(SubscribeType)) ResolveFunctions._ChangeCallbacks[SubscribeType] = [];
        ResolveFunctions._ChangeCallbacks[SubscribeType].push(callback);
    }

    /**
     * Unsubscribes from the current SubscribeTypes change
     * 
     * @param SubscribeType The SubscribeTypes of change to unsubscribe from
     * @param callback The callback to unsubscribe
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.UnsubscribeToChange<Timeline>(ResolveFunctions.SubscribeTypes.Timeline, (timeline: Timeline) => {
     *   console.log(`Timeline changed to ${timeline.GetName()}`);
     * });
     * ```
     */
    public static UnsubscribeToChange<T>(SubscribeType: ResolveFunctions.SubscribeTypes, callback: (object: T) => void): void {
        ResolveFunctions._ChangeCallbacks[SubscribeType].splice(ResolveFunctions._ChangeCallbacks[SubscribeType].indexOf(callback), 1);
    }

    /**
     * Notifies subscribers of the current SubscribeTypes change
     * 
     * @param SubscribeType The SubscribeTypes of change to notify subscribers of
     * @param object The current SubscribeTypes
     * 
     * @example
     * 
     * ```ts
     * ResolveFunctions.NotifySubscribers<Timeline>(ResolveFunctions.SubscribeTypes.Timeline, ResolveFunctions.CurrentTimeline);
     * ```
     */
    private static NotifySubscribers<T>(SubscribeType: any, object: T): void {
        if (!this.CheckIfSubscribeTypeExists(SubscribeType)) return;
        ResolveFunctions._ChangeCallbacks[SubscribeType].forEach(callback => callback(object));
    }

    public static ConvertTimecodeToFrames(timecode: string): number {
        let timecodeArray: string[] = timecode.split(":");
        let frames: number = 0;

        frames += parseInt(timecodeArray[0]) * 60 * 25;
        frames += parseInt(timecodeArray[1]) * 25;
        frames += parseInt(timecodeArray[2]);

        return frames;
    }
}

/**
 * ResolveFunction Enums & Types
 */
export module ResolveFunctions {

    /**
     * The SubscribeTypes that can be subscribed to via ResolveFunctions
     */
    export enum SubscribeTypes {
        Pages = "Pages",
        Project = "Project",
        Timeline = "Timeline"
    }
}