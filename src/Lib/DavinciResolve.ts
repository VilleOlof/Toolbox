import { AppSettings } from "./AppSettings";
import { Common } from "./Common";
import { ResolveEnums } from "./ResolveEnums";

let PluginID: string;
//const WorkflowIntegration = require('../src/Lib/WorkflowIntegration.node'); //Runs from the /dist directory
const WorkflowIntegration = require('../../../Developer/Workflow Integrations/Examples/SamplePlugin/WorkflowIntegration.node');

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

    /**
     * Converrts timecode to frames
     * 
     * @param timecode the timecode to convert
     * @param framerate the framerate to use (defaults to the current timeline framerate)
     * @returns {number} the frames
     */
    public static ConvertTimecodeToFrames(timecode: string, framerate?: number): number {
        let timecodeArray: string[] = timecode.split(":");

        if (!framerate) framerate = this.GetTimelineFramerate();

        let hours: number = parseInt(timecodeArray[0]);
        let minutes: number = parseInt(timecodeArray[1]);
        let seconds: number = parseInt(timecodeArray[2]);
        let frames: number = parseInt(timecodeArray[3]);

        frames += seconds * framerate;
        frames += minutes * framerate * 60;
        frames += hours * framerate * 60 * 60;

        return frames;
    }

    /**
     * Converts frames to timecode
     * 
     * @param frames the frames to convert
     * @param framerate the framerate to use (defaults to the current timeline framerate)
     * @returns {string} the timecode
     */
    public static ConvertFramesToTimecode(frames: number, framerate?: number): string {
        if (!framerate) framerate = this.GetTimelineFramerate();

        let hours: number = 0;
        let minutes: number = 0;
        let seconds: number = 0;

        while (frames >= framerate * 60 * 60) {
            frames -= framerate * 60 * 60;
            hours++;
        }

        while (frames >= framerate * 60) {
            frames -= framerate * 60;
            minutes++;
        }

        while (frames >= framerate) {
            frames -= framerate;
            seconds++;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
    }

    /**
     * Checks if a marker exists
     * and optionally returns the marker object if it does
     * 
     * @param markerData The customdata of the marker
     * @param getFrameID Whether or not to return the frame of the marker (or kinda the entire object)
     * @returns {ResolveFunctions.CheckMarker} 
     */
    public static CheckIfMarkerExists(markerData: string, getFrameID: boolean = false): ResolveFunctions.CheckMarker {
        let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
        let markers = timeline.GetMarkers();

        for (const [frameID, MarkerData] of Object.entries(markers)) {
            if (MarkerData.customData == markerData) {
                if (getFrameID) {
                    let markerData = MarkerData;
                    markerData.frameId = parseInt(frameID);
                    return {Exists: true, MarkerData: markerData};
                }
                else return {Exists: true};
            }
        }

        return {Exists: false};
    }

    /**
     * Returns the frame of a marker
     * 
     * @param markerData The customdata of the marker
     * @param timeline The timeline (optional, will use the current timeline if not provided)
     * @returns The frame of the marker
     */
    public static GetMarkerFrameID(markerData: string, timeline?: Timeline): number {
        let currentTimeline: Timeline = timeline ?? ResolveFunctions.GetCurrentTimeline();
        let markers = currentTimeline.GetMarkers();

        for (const [frameID, MarkerData] of Object.entries(markers)) {
            if (MarkerData.customData == markerData) return parseInt(frameID);
        }

        return -1;
    }

    /**
     * Gets the current timeline framerate
     * 
     * @param timeline The timeline (optional, will use the current timeline if not provided)
     * @returns The current timeline framerate
     */
    public static GetTimelineFramerate(timeline?: Timeline): number {
        const currentTimeline = timeline ?? ResolveFunctions.GetCurrentTimeline();
        return parseInt(currentTimeline.GetSetting("timelineFrameRate"));
    }

    /**
     * A quick way to get the current timeline on any track
     * Uses binary search and other optimizations to find the current timeline item.
     * 
     * @param trackType The track type to search in
     * @param tracks What tracks to search in
     * @param timeline The timeline (optional, will use the current timeline if not provided)
     * @param itemCallback A callback upon finding the item(s) (optional)
     * @returns The current timeline item(s)
     */
    public static GetTimelineItem(trackType: ResolveEnums.TrackType = ResolveEnums.TrackType.Video, tracks: number[] | number = 1, timeline?: Timeline, itemCallback?: ResolveFunctions.TimelineItemCallback): TimelineItem | TimelineItem[] {
        const returnItems: TimelineItem[] = [];
        const currentTimeline = timeline ?? ResolveFunctions.GetCurrentTimeline();

        //check if tracks is an array, if not, make it an array
        let userInputTracks: number[] = []
        if (!Array.isArray(tracks)) userInputTracks = [tracks];
        else userInputTracks = tracks;

        const StartFrame = 0;
        const timelineStartFrame =  currentTimeline.GetStartFrame()

        const EndFrame = currentTimeline.GetEndFrame() - timelineStartFrame;

        const Playhead = this.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode()) - timelineStartFrame;

        const timelineTracks = currentTimeline.GetTrackCount(trackType);
        //Take the lowest number of tracks between the tracks array and the timeline tracks
        let tracksToLoop = userInputTracks.length //> timelineTracks ? timelineTracks : userInputTracks.length;
        if (userInputTracks.length > timelineTracks) {
            tracksToLoop = timelineTracks;
        }
        
        for (let trackIndex = 0; trackIndex < tracksToLoop; trackIndex++) {
            const trackItems = currentTimeline.GetItemListInTrack(trackType, userInputTracks[trackIndex]);
            if (trackItems.length <= 0) continue; //no items in the track, continue to the next track

            const averageFramesPerItem = (EndFrame - StartFrame) / trackItems.length;

            const educatedGuessItem = trackItems[Math.floor(Playhead / averageFramesPerItem)];

            //found the item directly
            if (this.CheckIfFrameIsOnItem(Playhead, educatedGuessItem)) {
                if (itemCallback === undefined) returnItems.push(educatedGuessItem);
                else {
                    itemCallback(educatedGuessItem, trackIndex);
                }
                continue;
            }

            //special case where can we can find the item if the length is 2 or 3
            //TODO: Some bugs with this, need to fix
            // if (trackItems.length == 2) {
            //     const firstItem = trackItems[0];
            //     let returnItem = trackItems[1];
            //     console.log(firstItem, returnItem, trackItems)

            //     if (Playhead <= firstItem.GetEnd()) returnItem = firstItem;
                
            //     if (itemCallback === undefined) returnItems.push(returnItem);
            //     else {
            //         itemCallback(returnItem, trackIndex);
            //     }
            //     continue;
            // }
            // else if (trackItems.length == 3) {
            //     const middleItem = trackItems[1];

            //     const middleStart = middleItem.GetStart();
            //     const middleEnd = middleItem.GetEnd();

            //     if (Playhead >= middleStart && Playhead <= middleEnd) {
            //         if (itemCallback === undefined) returnItems.push(middleItem);
            //         else {
            //             itemCallback(middleItem, trackIndex);
            //         }
            //         continue;
            //     }

            //     else if (Playhead < middleStart) return trackItems[0];
            //     else if (Playhead > middleEnd) return trackItems[2];
            // }
            
            //then we do a binary search to find the item
            let left = 0;
            let right = trackItems.length - 1;
            let middle = Math.floor((left + right) / 2);

            const PlayheadStart = Playhead + timelineStartFrame;

            while (left <= right) {
                const middleItem = trackItems[middle];

                const middleStart = middleItem.GetStart();
                const middleEnd = middleItem.GetEnd();

                if (PlayheadStart >= middleStart && PlayheadStart <= middleEnd) {
                    if (itemCallback === undefined) {
                        returnItems.push(middleItem);
                    }
                    else {
                        itemCallback(middleItem, trackIndex);
                    }
                    break;
                }
                
                else if (PlayheadStart < middleStart) right = middle - 1;
                else if (PlayheadStart > middleEnd) left = middle + 1;

                middle = Math.floor((left + right) / 2);
            }
            
        }

        if (returnItems.length == 0) return undefined;
        else if (returnItems.length == 1) return returnItems[0];

        return returnItems;
    }

    /**
     * Checks if the frame is inside an item
     * 
     * @param frame the frame to check with
     * @param item the item to check against
     * @returns If its inside or not
     */
    private static CheckIfFrameIsOnItem(frame: number, item: TimelineItem): boolean {
        if (!item) return false;
        return frame >= item.GetStart() && frame <= item.GetEnd();
    }

    /**
     * Gets a media folder object by name
     * Currently only restricted to root > subfolders directly, and no subfolders of subfolders
     * 
     * @param folderName The name of the folder
     * @returns The folder object
     */
    public static GetMediaFolder(folderName: string): Folder {
        const mediapool = this.GetCurrentProject().GetMediaPool();
        const rootSubFolders = mediapool.GetRootFolder().GetSubFolderList();

        for (let i = 0; i < rootSubFolders.length; i++) {
            const folder = rootSubFolders[i];

            if (folder.GetName() == folderName) return folder;
        }
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

    /**
     * The return object for the CheckIfMarkerExists function
     */
    export type CheckMarker = {
        Exists: boolean,
        MarkerData?: Marker
    }

    /**
     * The callback for the GetTimelineItem function
     */
    export type TimelineItemCallback = (item: TimelineItem, trackIndex: number) => void;
}