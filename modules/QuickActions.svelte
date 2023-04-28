<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";

    const path = require("path");

    const componentID: string = "QuickActions";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "An advanced module for doing mundane tasks quickly\n" +
            "Import Media, Add Tracks, Apply LUT and more by clicking one button!"
        );
    });

    let defaultProfile = {
        name: "New Profile",
        actions: [],
    }

    //let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let _profiles = _Datastore.Get<ProfileObject>("Profiles", { "New Profile": defaultProfile});
    if (Object.keys(_profiles).length == 0) _profiles["New Profile"] = defaultProfile; //ensures that there is always at least one profile.

    $: _Datastore.Set("Profiles", _profiles); //ensures that the datastore is updated when the profiles are updated

    let CurrentProfile: string = _Datastore.Get<string>("CurrentProfile", "Default");
    $: _Datastore.Set("CurrentProfile", CurrentProfile);

    if (!Object.keys(_profiles).includes(CurrentProfile)) CurrentProfile = Object.keys(_profiles)[0];

    type Profile = {
        name: string,
        actions: Array<Action>,
    }
    type ProfileObject = {
        [key: string]: Profile,
    }

    type Action = {
        name: string,
        function: string,
        values: Array<ActionInput>,
        Minimized: boolean,
        UUID: string,
    }

    type ActionInput = {
        name: string,
        type: "string" | "number" | "boolean" | "dropdown" | "file",
        value: any //string | number | boolean,
        dropdownOptions?: Array<string>,
    }

    const Actions: Action[] = [
        {
            name: "Add Track",
            function: "Add Track",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Track",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Delete Track",
            function: "Delete Track",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Track",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Create Timeline",
            function: "Create Timeline",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Timeline",
                },
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Import Media",
            function: "Import Media",
            values: [
                {
                    name: "Timeline Or Mediapool",
                    type: "dropdown",
                    value: "Mediapool",
                    dropdownOptions: ["Timeline", "Mediapool"],
                },
                {
                    name: "Default Path",
                    type: "file",
                    value: "",
                },
                {
                    name: "File Or Folder",
                    type: "dropdown",
                    value: "File",
                    dropdownOptions: ["File", "Folder"],
                },
                {
                    name: "Start Frame",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Origin Frame",
                    type: "dropdown",
                    value: "Relative",
                    dropdownOptions: ["Relative", "Start"]
                },
                {
                    name: "Clip Color",
                    type: "dropdown",
                    value: "None",
                    dropdownOptions: Object.keys(ResolveEnums.ClipColor).concat("None"),
                },
                {
                    name: "Track (If Timeline)",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Media Bin Name |?",
                    type: "string",
                    value: "Content",
                },
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "From Mediapool",
            function: "Import From Mediapool",
            values: [
                {
                    name: "Clip Name (Incl. Ext)",
                    type: "string",
                    value: "New Clip.mp4",
                },
                {
                    name: "Bin Name",
                    type: "string",
                    value: "Content",
                },
                {
                    name: "Track",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Start Frame",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Origin Frame",
                    type: "dropdown",
                    value: "Relative",
                    dropdownOptions: ["Relative", "Start"]
                },
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Apply LUT",
            function: "Apply LUT",
            values: [
                {
                    name: "File Path",
                    type: "file",
                    value: "",
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Add Bin",
            function: "Add Bin",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Bin",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Goto Bin",
            function: "Goto Bin",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Bin",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Add Marker",
            function: "Add Marker",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Marker",
                },
                {
                    name: "Color",
                    type: "dropdown",
                    value: "Blue",
                    dropdownOptions: Object.keys(ResolveEnums.ClipColor),
                },
                {
                    name: "Duration (Frames)",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Position (Frames) |?",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Use Playhead",
                    type: "boolean",
                    value: true,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "New Compound",
            function: "New Compound",
            values: [
                {
                    name: "Tracks: (1,2,3)",
                    type: "string",
                    value: "1",
                },
                {
                    name: "Name",
                    type: "string",
                    value: "New Compound Clip",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Insert Generator",
            function: "Insert Generator",
            values: [
                {
                    name: "Generator",
                    type: "dropdown",
                    value: "Solid Color",
                    dropdownOptions: Object.values(ResolveEnums.TimelineGenerator),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Insert Title",
            function: "Insert Title",
            values: [
                {
                    name: "Title",
                    type: "dropdown",
                    value: "Text",
                    dropdownOptions: Object.values(ResolveEnums.TitleNames),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Lock Track",
            function: "Lock Track",
            values: [
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                },
                {
                    name: "Lock",
                    type: "boolean",
                    value: true,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Rename Track",
            function: "Rename Track",
            values: [
                {
                    name: "Track",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                },
                {
                    name: "New Name",
                    type: "string",
                    value: "New Track"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Delay",
            function: "Delay",
            values: [
                {
                    name: "Seconds",
                    type: "number",
                    value: 1,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Position",
            function: "Clip Position",
            values: [
                {
                    name: "Pan",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Tilt",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Anchor X",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Anchor Y",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Zoom",
            function: "Clip Zoom",
            values: [
                {
                    name: "Zoom X",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Zoom Y",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Pitch",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Yaw",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Rotation",
            function: "Clip Rotation",
            values: [
                {
                    name: "Rotation",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Flip X",
                    type: "boolean",
                    value: false,
                },
                {
                    name: "Flip Y",
                    type: "boolean",
                    value: false,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Crop",
            function: "Clip Crop",
            values: [
                {
                    name: "Crop Left",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Right",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Top",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Bottom",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Softness",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Retain",
                    type: "boolean",
                    value: false,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Opacity",
            function: "Clip Opacity",
            values: [
                {
                    name: "Opacity",
                    type: "number",
                    value: 100,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Color",
            function: "Clip Color",
            values: [
                {
                    name: "Color",
                    type: "dropdown",
                    value: "Blue",
                    dropdownOptions: Object.values(ResolveEnums.ClipColor),
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                },
                {
                    name: "Track Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Disable Clip",
            function: "Disable Clip",
            values: [
                {
                    name: "Disabled",
                    type: "boolean",
                    value: true,
                },
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                },
                {
                    name: "Track Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Delete Clip",
            function: "Delete Clip",
            values: [
                {
                    name: "Tracks (1,2,3)",
                    type: "string",
                    value: "1"
                },
                {
                    name: "Track Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Duplicate Clip",
            function: "Duplicate Clip",
            values: [
                {
                    name: "Origin Track",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Destination Track",
                    type: "number",
                    value: 2,
                },
                {
                    name: "Frame Offset",
                    type: "number",
                    value: 0,
                }
            ],
            Minimized: false,
            UUID: ""
        }
    ]

    let ActionFunctions = {
        "Add Track": (trackName: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            currentTimeline.AddTrack(trackType.toLowerCase(), "mono");

            const trackCount = currentTimeline.GetTrackCount(trackType);
            currentTimeline.SetTrackName(trackType, trackCount, trackName);
        },
        "Delete Track": (trackName: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackCount = currentTimeline.GetTrackCount(trackType);
            for (let i = 1; i <= trackCount; i++) {
                const CurrenttrackName = currentTimeline.GetTrackName(trackType, i);
                if (CurrenttrackName == trackName) {
                    currentTimeline.DeleteTrack(trackType, i);
                    break;
                }
            }
        },
        "Create Timeline": (timelineName: string) => { // Only gets an error if an existing timeline with the same name exists.
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();
            currentMediapool.CreateEmptyTimeline(timelineName);
        },
        "Import Media": (importType: "Timeline" | "Mediapool", defaultPath: string, fileOrFolder: "File" | "Folder", startFrame:number = 0, originFrame: "Relative" | "Start", clipColor: ResolveEnums.ClipColor = ResolveEnums.ClipColor.Blue, trackIndex?: number, mediapoolBinName?: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const currentProject = ResolveFunctions.GetCurrentProject();
            const currentMediapool = currentProject.GetMediaPool();

            if (defaultPath == "") {
                defaultPath = ChooseFile(true, false)[0];
            }
            else if (path.extname(defaultPath) == "") { //if default path is a folder, open a file with that location
                defaultPath = ChooseFile(true, false, defaultPath)[0];
            }

            //user refused to give me a path, me sad :(
            if (defaultPath == "") {
                return;
            }

            //Set the bin
            if (mediapoolBinName != "") {
                let bin = ResolveFunctions.GetMediaFolder(mediapoolBinName);
                if (bin == null) {
                    bin = currentMediapool.AddSubFolder(currentMediapool.GetRootFolder(), mediapoolBinName);
                }
                currentMediapool.SetCurrentFolder(bin);
            }
            else {
                currentMediapool.SetCurrentFolder(currentMediapool.GetRootFolder());
            }

            const importedItem = currentMediapool.ImportMedia([defaultPath])[0];
            /* @ts-ignore //'None' is added */
            if (clipColor != 'None') importedItem.SetClipColor(clipColor);

            if (importType == "Timeline") {
                let recordFrame: number;
                if (originFrame == "Relative") {
                    const playhead = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
                    recordFrame = playhead + startFrame;
                    console.log(recordFrame, playhead, startFrame);
                }
                else {
                    recordFrame = currentTimeline.GetStartFrame() + startFrame;
                }

                const clipInfo: ClipInfo = {
                    mediaPoolItem: importedItem,
                    startFrame: parseInt(importedItem.GetClipProperty("Start") as string),
                    endFrame: parseInt(importedItem.GetClipProperty("End") as string),

                    trackIndex: trackIndex,
                    recordFrame: recordFrame
                }

                currentMediapool.AppendToTimeline([clipInfo]);
            }
        },
        //Maybe make better? carries a lot of similar code to 'Import Media' above
        "Import From Mediapool": (clipName: string, binName: string, track: number, startFrame: number, originFrame: 'Relative' | 'Start') => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();

            if (binName != "") {
                let bin = ResolveFunctions.GetMediaFolder(binName);
                if (bin == null) {
                    bin = currentMediapool.AddSubFolder(currentMediapool.GetRootFolder(), binName);
                }
                currentMediapool.SetCurrentFolder(bin);
            }
            else {
                currentMediapool.SetCurrentFolder(currentMediapool.GetRootFolder());
            }

            const currentItems = currentMediapool.GetCurrentFolder().GetClipList();
            let importedItem: MediaPoolItem;

            for (let i = 0; i < currentItems.length; i++) {
                if (currentItems[i].GetName() == clipName) {
                    importedItem = currentItems[i];
                    break;
                }
            }
            if (!importedItem) {
                console.warn("No clip with name " + clipName + " found in bin " + binName);
                return;
            }

            let recordFrame: number;
            if (originFrame == "Relative") {
                const playhead = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
                recordFrame = playhead + startFrame;
                console.log(recordFrame, playhead, startFrame);
            }
            else {
                recordFrame = currentTimeline.GetStartFrame() + startFrame;
            }

            const clipInfo: ClipInfo = {
                mediaPoolItem: importedItem,
                startFrame: parseInt(importedItem.GetClipProperty("Start") as string),
                endFrame: parseInt(importedItem.GetClipProperty("End") as string),

                trackIndex: track,
                recordFrame: recordFrame
            }

            currentMediapool.AppendToTimeline([clipInfo]);
        },
        "Duplicate Clip": (originTrack: number, destTrack: number, frameOffset: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();

            const selectedItem = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, originTrack, currentTimeline) as TimelineItem;
            const mediaReference = selectedItem.GetMediaPoolItem();

            const clipInfo: ClipInfo = {
                mediaPoolItem: mediaReference,
                startFrame: parseInt(mediaReference.GetClipProperty("Start") as string),
                endFrame: parseInt(mediaReference.GetClipProperty("End") as string),

                trackIndex: destTrack,
                recordFrame: (selectedItem.GetStart() + frameOffset)
            }

            currentMediapool.AppendToTimeline([clipInfo]);

        },
        "Apply LUT": (filePath: string, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackArray = tracks.split(",").map(Number);
            const timelineItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackArray, currentTimeline) as TimelineItem[];

            if (filePath == "") {
                filePath = ChooseFile(true, false)[0];
            }

            currentTimeline.ApplyGradeFromDRX(filePath, 0, timelineItems);
        },
        "Add Bin": (binName: string) => {
            const projectManager = Resolve.GetProjectManager();
            projectManager.GotoRootFolder();

            const mediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();
            const ParentFolder = mediapool.GetRootFolder();

            mediapool.AddSubFolder(ParentFolder, binName);
        },
        "Goto Bin": (binName: string) => {
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();

            if (binName != "") {
                let bin = ResolveFunctions.GetMediaFolder(binName);
                if (bin == null) {
                    bin = currentMediapool.AddSubFolder(currentMediapool.GetRootFolder(), binName);
                }
                currentMediapool.SetCurrentFolder(bin);
            }
            else {
                currentMediapool.SetCurrentFolder(currentMediapool.GetRootFolder());
            }
        },
        "Add Marker": (markerName: string, markerColor: ResolveEnums.MarkerColor, markerDuration: number, markerPosition: number, usePlayhead: boolean) => { // Works but only with certain colors, only (Blue, Green, Pink, Purple, Yellow), The rest 11 wont appear
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            //god forgive me for nesting ternary operators
            markerPosition = markerPosition ? markerPosition : usePlayhead ? (ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode()) - currentTimeline.GetStartFrame()) : 0;
            currentTimeline.AddMarker(markerPosition, markerColor, markerName, "Generated Marker From Quick Actions", markerDuration);
        },
        "New Compound": (tracks: string, compoundClipName: string) => { //Works but maybe should implement audio too.
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);
            let timelineItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline) as TimelineItem[];

            if (!Array.isArray(timelineItems)) {
                timelineItems = [timelineItems];
            }

            currentTimeline.CreateCompoundClip(timelineItems, compoundClipName);
        },
        "Insert Generator": (generator: ResolveEnums.TimelineGenerator) => { //Just some of them work, ("BT.2111 Color Bar HLG Narrow", "BT.2111 Color Bar PQ Full", "BT.2111 Color Bar PQ Narrow") doesnt get inserted
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            currentTimeline.InsertGeneratorIntoTimeline(generator);
        },
        "Insert Title": (title: ResolveEnums.TitleNames) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            currentTimeline.InsertTitleIntoTimeline(title);
        },
        "Lock Track": (tracks: string, trackType: ResolveEnums.TrackType, Lock: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);
            const trackCount = currentTimeline.GetTrackCount(trackType);

            for (let i = 1; i <= trackCount; i++) {
                if (trackNumbers.includes(i)) {
                    currentTimeline.SetTrackLock(trackType, i, Lock);
                }
            }
        },
        "Rename Track": (track: number, trackType: ResolveEnums.TrackType, newName: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            currentTimeline.SetTrackName(trackType, track, newName);
        },
        "Delay": (seconds: number) => {
            const start = Date.now();
            let now = start;
            console.log(`I dont know why, but if i remove this console.log, the loop finishes instantly, sooo take this random number: ${now}`)
            while (now - start < (seconds*1000)) {
                now = Date.now();
            }
        },
        "Clip Position": (Pan: number, Tilt: number, AnchorX: number, AnchorY: number, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline, (item) => {
                item.SetProperty("Pan", Pan);
                item.SetProperty("Tilt", Tilt);
                if (AnchorX != 0) item.SetProperty("AnchorPointX", AnchorX);
                if (AnchorY != 0) item.SetProperty("AnchorPointY", AnchorY);
            });
        },
        "Clip Zoom": (ZoomX: number, ZoomY: number, Pitch: number, Yaw: number, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline, (item) => {
                item.SetProperty("ZoomX", ZoomX);
                item.SetProperty("ZoomY", ZoomY);
                item.SetProperty("Pitch", Pitch);
                item.SetProperty("Yaw", Yaw);
            });
        },
        "Clip Rotation": (Rotation: number, FlipX: boolean, FlipY: boolean, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline, (item) => {
                item.SetProperty("RotationAngle", Rotation);
                item.SetProperty("FlipX", FlipX);
                item.SetProperty("FlipY", FlipY);
            });
        },
        "Clip Crop": (CropLeft: number, CropRight: number, CropTop: number, CropBottom: number, CropSoftness: number, CropRetain: boolean, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline, (item) => {
                item.SetProperty("CropLeft", CropLeft);
                item.SetProperty("CropRight", CropRight);
                item.SetProperty("CropTop", CropTop);
                item.SetProperty("CropBottom", CropBottom);
                item.SetProperty("CropSoftness", CropSoftness);
                item.SetProperty("CropRetain", CropRetain);
            });
        },
        "Clip Opacity": (opacity: number, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline, (item) => {
                item.SetProperty("Opacity", opacity);
            });
        },
        "Clip Color": (color: ResolveEnums.ClipColor, tracks: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(trackType, trackNumbers, currentTimeline, (item) => {
                item.SetClipColor(color);
            });
        },
        "Disable Clip": (state: boolean, tracks: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            ResolveFunctions.GetTimelineItem(trackType, trackNumbers, currentTimeline, (item) => {
                item.SetClipEnabled(!state);
            });
        },
        "Delete Clip": (tracks: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = tracks.split(",").map(Number);

            let items = ResolveFunctions.GetTimelineItem(trackType, trackNumbers, currentTimeline) as TimelineItem[];
            if (!Array.isArray(items)) {
                items = [items];
            }

            currentTimeline.DeleteClips(items);
        }
    }

    function UpdateDatastore(): void {
        _profiles = _profiles;
    }

    let NewActionDropdown: string;
    function AddNewAction(): void {
        const newAction = Actions.find(action => action.name == NewActionDropdown);
        const clonedAction = JSON.parse(JSON.stringify(newAction));
        clonedAction.UUID = Common.GetRandomHash(8);
        _profiles[CurrentProfile].actions.push(clonedAction);
        UpdateDatastore();
    }

    function DeleteAction(actionUUID: string): void {
        _profiles[CurrentProfile].actions = _profiles[CurrentProfile].actions.filter(action => action.UUID != actionUUID);
        UpdateDatastore();
    }

    function AddNewProfile(): void {
        if (Object.keys(_profiles).includes("New Profile")) return;

        _profiles["New Profile"] = {
            name: "New Profile",
            actions: []
        }
        UpdateDatastore();
    }

    function RemoveProfile(): void {
        delete _profiles[CurrentProfile];

        if (Object.keys(_profiles).length == 0 || CurrentProfile == undefined) {
            AddNewProfile();
        }

        CurrentProfile = Object.keys(_profiles)[0];
        UpdateDatastore();
    }

    function RunActions(): void {
        _profiles[CurrentProfile].actions.forEach(action => {
            const actionFunction = ActionFunctions[action.function];
            const actionValues = action.values.map(value => value.value);
            console.log(action.function, actionValues);
            actionFunction(...actionValues);
        });
    }

    function UpdateProfileKeyName(): void {
        _profiles[_profiles[CurrentProfile].name] = _profiles[CurrentProfile];
        const oldProfileName = CurrentProfile;
        CurrentProfile = _profiles[CurrentProfile].name;
        delete _profiles[oldProfileName];
        UpdateDatastore();
    }

    function ChooseFile(file: boolean, folder: boolean, defaultPath: string = ""): string[] {
        let _properties: any = [] // {FileDialogOptions}
        if (file) _properties.push("openFile");
        if (folder) _properties.push("openDirectory");

        const dialogResult = Common.IO.Dialog({
            title: `Choose a ${file ? "file" : "folder"}`,
            buttonLabel: "Choose",
            defaultPath: defaultPath,
            properties: _properties
        });
        
        return dialogResult;
    }
    
    function ChooseFileButton(file: boolean, folder: boolean, _action: Action, actionInput: ActionInput): void {
        const importMediaCaseValue = _action.values.find(value => value.name == "File Or Folder");
        if (importMediaCaseValue.value == "File") {
            file = true;
            folder = false;
        }
        else if (importMediaCaseValue.value = "Folder") {
            file = false;
            folder = true;
        }

        const result = ChooseFile(file, folder);
        if (result.length == 0) return;

        // Really Ugly, but it works
        _profiles[CurrentProfile].actions.find(action => action.UUID == _action.UUID).values.find(value => value.name == actionInput.name).value = result[0];
        UpdateDatastore();
    }

</script>


<main id={componentID}>
    <div id="top">
        <div id=topTitle>
            <h1>Quick Actions</h1>
            <select id="actionProfiles" bind:value={CurrentProfile}>
                {#each Object.keys(_profiles) as profile}
                    <option value={profile}>{profile}</option>
                {/each}
            </select>
        </div>

        <div id=profileNameContainer>
            <p>Profile Name:</p>
            <input type="text" bind:value={_profiles[CurrentProfile].name} on:change={UpdateProfileKeyName} />
        </div>

        <div id=topButtons>
            <div>
                <button class=buttonStyle on:click={AddNewProfile}>Add New</button>
                <button class=buttonStyle on:click={RemoveProfile}>Remove Profile</button>
            </div>
        
            <div>
                <button class=buttonStyle on:click={RunActions}>Run Actions</button>
            </div>
        </div>
    </div>

    <div id="actionList">

        <div id="autoGen">
            {#each _profiles[CurrentProfile].actions as action}
                <div class="action" transition:slide|local>
                    <div class=actionHeader>
                        <h2>{action.name}</h2>
                        <div>
                            <button class="buttonStyle" on:click={() => { action.Minimized = !action.Minimized}}>{action.Minimized ? "Expand" : "Minimize"}</button>
                            <button class=buttonStyle id=DeleteAction on:click={() => { DeleteAction(action.UUID)}}><b>-</b></button>
                        </div>
                    </div>

                    {#if !action.Minimized}
                        <div class="actionInputs" transition:slide|local>
                            {#each action.values as value}
                                <div class="actionInput">
                                    <label for={value.name}>{value.name}</label>
                                    <div>
                                        {#if value.type == "string"}
                                            <input type="text" bind:value={value.value} />
                                        {:else if value.type == "number"}
                                            <input type="number" bind:value={value.value} />
                                        {:else if value.type == "boolean"}
                                            <input type="checkbox" bind:checked={value.value} />
                                        {:else if value.type == "dropdown"}
                                            <select bind:value={value.value}>
                                                {#each value.dropdownOptions as option}
                                                    <option value={option}>{option}</option>
                                                {/each}
                                            </select>
                                        {:else if value.type == "file"}
                                            <input type="text" bind:value={value.value}>
                                            <button class=buttonStyle on:click={() => { ChooseFileButton(true, false, action, value) }}>.../</button>
                                        {/if}
                                    </div>
                                </div>

                            {/each}
                        </div>
                        
                    {/if}
                </div>

            {/each}
        </div>

        <div class="lineBreak"></div>

        <div id="addAction">
            <select id="actionDropdown" bind:value={NewActionDropdown}>
                {#each Actions as action}
                    <option value={action.name}>{action.name}</option>
                {/each}
            </select>
            <button class=buttonStyle on:click={AddNewAction}>Add New Action</button>
        </div>

    </div>

</main>


<style lang="scss">
    @use "../src/scss/Colors";

    main {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #actionList {
        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        width: 98%;
        min-height: 1rem;

        margin: 0.25rem;

        border-radius: 0.3rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #autoGen {
        width: 98%;
    }

    .action {
        background-color: darken(Colors.$BackgroundColor, 2%);

        border-radius: 0.25rem;
        padding: 0.25rem;
    }

    .actionHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        h2 {
            margin: 0;
            font-size: 1rem;
            margin-left: 0.75rem;

            white-space: nowrap;
        }

        button {
            font-size: 0.75rem;
        }
    }

    .actionInputs {
        margin-top: 0.5rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background-color: darken(Colors.$BackgroundColor, 4%);
    }

    .actionInput {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        width: 98%;
        padding: 0.2rem;

        select {
            @extend #actionProfiles;
        }

        input {
            min-width: 2rem;
            max-width: 5.5rem;
        }

        //margin-left: 0.5rem;
        white-space: nowrap;
    }

    #top {
        width: 100%;

        & > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            padding: 0.5rem;
        }

        h1 {
            margin: 0;
            font-size: 1.5rem;
            opacity: 0.5;
        }
    }

    #actionProfiles {
        min-width: 5rem;
        max-width: 7rem;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.25rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }

        transition: background-color 0.1s ease-in-out;
    }

    #profileNameContainer {
        margin: 0;

        & > p {
            margin: 0;
            font-size: 1rem;
            opacity: 0.5;
        }
    }

    input {
        margin-left: 0.5rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        transition: background-color 0.1s ease-in-out;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    #addAction {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        padding: 0.5rem;

        & > button {
            margin-left: 1rem;
        }
    }

    #actionDropdown {
        @extend #actionProfiles;

        min-width: 10rem;

        &:focus, &:hover {
            background-color: darken(Colors.$BackgroundColor, 3%);
        }
    }


    .buttonStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    .lineBreak {
        width: 90%;
        height: 0.2rem;

        background-color: Colors.$ColumnColor;
        opacity: 0.75;

        margin-bottom: 0.25rem;
        margin-top: 0.25rem;

        transition: background-color 0.1s ease-in-out;
    }

    #DeleteAction {
        padding: 0.2rem 0;
        min-width: 2rem;
    }

</style>