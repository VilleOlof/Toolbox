<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { fade, slide } from "svelte/transition";

    const path = require("path");

    const componentID: string = "QuickActions";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large,
            "An advanced module for doing mundane tasks quickly\n" +
            "Import Media, Add Tracks, Apply LUT and more by clicking one button!"
        );

        profileNameChangeInput.value = CurrentProfile;
    });

    let defaultProfile = {}

    let _Settings = GlobalSettings.GetInstance(componentID);

    const showActionArrows: boolean = _Settings.RegisterSetting("Show Action Arrows", "To show or not to show the arrows that moves actions", true, SettingTypes.Type.Checkbox);

    let _Datastore = new DataStore(componentID);

    let _profiles = _Datastore.Get<Profiles>("Profiles", { "New Profile": defaultProfile});
    if (Object.keys(_profiles).length == 0) _profiles["New Profile"] = defaultProfile; //ensures that there is always at least one profile.

    $: _Datastore.Set("Profiles", _profiles); //ensures that the datastore is updated when the profiles are updated

    let CurrentProfile: string = _Datastore.Get<string>("CurrentProfile", "Default");
    $: _Datastore.Set("CurrentProfile", CurrentProfile);

    if (!Object.keys(_profiles).includes(CurrentProfile)) CurrentProfile = Object.keys(_profiles)[0];

    let originPlayheadFrame: number;

    type Profile = {
        //Action UUID
        [key: string]: Action,
    }

    type Profiles = {
        //Profile Name
        [key: string]: Profile
    }

    type Action = {
        Minimized: boolean,
        Name: string,
        // Action name, action value
        Parameters: {[key: string]: any}
    }

    type ActionInput = {
        type: "string" | "number" | "boolean" | "dropdown" | "file",
        value: any //string | number | boolean,
        dropdownOptions?: Array<string>,
    }

    type ActionName = string;
    type ValueName = string;
    const ActionValueLookup: {[key: ActionName]: {[key: ValueName]: ActionInput}} = {
        "Add Track": {
            "Name": {
                type: "string",
                value: "New Track",
            },
            "Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "Add Until X": {
                type: "number",
                value: -1
            }
        },
        "Delete Tracks": {
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "Name": {
                type: "string",
                value: "",
            },
        },
        "Create Timeline": {
            "Name": {
                type: "string",
                value: "New Timeline",
            },
        },
        "Import Media": {
            "Timeline Or Mediapool": {
                type: "dropdown",
                value: "Mediapool",
                dropdownOptions: ["Timeline", "Mediapool"],
            },
            "Default Path": {
                type: "file",
                value: "",
            },
            "File Or Folder": {
                type: "dropdown",
                value: "File",
                dropdownOptions: ["File", "Folder"],
            },
            "Start Frame": {
                type: "number",
                value: 0,
            },
            "Origin Frame": {
                type: "dropdown",
                value: "Relative",
                dropdownOptions: ["Relative", "Start"]
            },
            "Clip Color": {
                type: "dropdown",
                value: "None",
                dropdownOptions: Object.keys(ResolveEnums.ClipColor).concat("None"),
            },
            "Track (If Timeline)": {
                type: "number",
                value: 1,
            },
            "Media Bin Name |?": {
                type: "string",
                value: "Content",
            },
            "Return To Origin": {
                type: "boolean",
                value: true
            }
        },
        "From Mediapool": {
            "Clip Name (Incl. Ext)": {
                type: "string",
                value: "New Clip.mp4",
            },
            "Bin Name": {
                type: "string",
                value: "Content",
            },
            "Track": {
                type: "number",
                value: 1,
            },
            "Start Frame": {
                type: "number",
                value: 0,
            },
            "Origin Frame": {
                type: "dropdown",
                value: "Relative",
                dropdownOptions: ["Relative", "Start"]
            },
        },
        "Apply LUT": {
            "File Path": {
                type: "file",
                value: "",
            },
            "File Or Folder": {
                type: "dropdown",
                value: "File",
                dropdownOptions: ["File", "Folder"],
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1",
            }
        },
        "Add Bin": {
            "Name": {
                type: "string",
                value: "New Bin",
            }
        },
        "Goto Bin": {
            "Name": {
                type: "string",
                value: "New Bin",
            }
        },
        "Add Marker": {
            "Name": {
                type: "string",
                value: "New Marker",
            },
            "Color": {
                type: "dropdown",
                value: "Blue",
                dropdownOptions: Object.keys(ResolveEnums.ClipColor),
            },
            "Duration (Frames)": {
                type: "number",
                value: 1,
            },
            "Position (Frames) |?": {
                type: "number",
                value: 0,
            },
            "Use Playhead": {
                type: "boolean",
                value: true,
            }
        },
        "New Compound": {
            "Tracks: (1,2,3)": {
                type: "string",
                value: "1",
            },
            "Name": {
                type: "string",
                value: "New Compound Clip",
            }
        },
        "Insert Generator": {
            "Generator": {
                type: "dropdown",
                value: "Solid Color",
                dropdownOptions: Object.values(ResolveEnums.TimelineGenerator),
            }
        },
        "Insert Title": {
            "Title": {
                type: "dropdown",
                value: "Text",
                dropdownOptions: Object.values(ResolveEnums.TitleNames),
            }
        },
        "Move Playhead": {
            "Move To": {
                type: "dropdown",
                value: "Origin",
                dropdownOptions: ["Relative", "Start", "Origin", "Start Of Clip", "End Of Clip"]
            },
            "Frame Offset": {
                type: "number",
                value: 0,
            },
            "Track": {
                type: "number",
                value: 1,
            }
        },
        "Switch Page": {
            "Page": {
                type: "dropdown",
                value: "Edit",
                dropdownOptions: Object.keys(ResolveEnums.Pages)
            }
        },
        "Lock Track": {
            "Tracks (1,2,3)": {
                type: "string",
                value: "1",
            },
            "Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "Lock": {
                type: "boolean",
                value: true,
            }
        },
        "Rename Track": {
            "Track": {
                type: "number",
                value: 1,
            },
            "Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "New Name": {
                type: "string",
                value: "New Track"
            }
        },
        "Delay": {
            "Seconds": {
                type: "number",
                value: 1,
            }
        },
        "Clip Position": {
            "Pan": {
                type: "number",
                value: 0,
            },
            "Tilt": {
                type: "number",
                value: 0,
            },
            "Anchor X": {
                type: "number",
                value: 0,
            },
            "Anchor Y": {
                type: "number",
                value: 0,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            }
        },
        "Clip Zoom": {
            "Zoom X": {
                type: "number",
                value: 1,
            },
            "Zoom Y": {
                type: "number",
                value: 1,
            },
            "Pitch": {
                type: "number",
                value: 0,
            },
            "Yaw": {
                type: "number",
                value: 0,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            }
        },
        "Clip Rotation": {
            "Rotation": {
                type: "number",
                value: 0,
            },
            "Flip X": {
                type: "boolean",
                value: false,
            },
            "Flip Y": {
                type: "boolean",
                value: false,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            }
        },
        "Clip Crop": {
            "Crop Left": {
                type: "number",
                value: 0,
            },
            "Crop Right": {
                type: "number",
                value: 0,
            },
            "Crop Top": {
                type: "number",
                value: 0,
            },
            "Crop Bottom": {
                type: "number",
                value: 0,
            },
            "Crop Softness": {
                type: "number",
                value: 0,
            },
            "Crop Retain": {
                type: "boolean",
                value: false,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            }
        },
        "Clip Opacity": {
            "Opacity": {
                type: "number",
                value: 100,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            }
        },
        "Clip Color": {
            "Color": {
                type: "dropdown",
                value: "Blue",
                dropdownOptions: Object.values(ResolveEnums.ClipColor),
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Track Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            }
        },
        "Disable Clip": {
            "Disabled": {
                type: "boolean",
                value: true,
            },
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Track Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            }
        },
        "Delete Clip": {
            "Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Track Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            }
        },
        "Duplicate Clip": {
            "Origin Track": {
                type: "number",
                value: 1,
            },
            "Destination Track": {
                type: "number",
                value: 2,
            },
            "Frame Offset": {
                type: "number",
                value: 0,
            },
            "Origin Track Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "Return To Origin": {
                type: "boolean",
                value: true
            }
        },
        "Rename Media Item": {
            "Track": {
                type: "number",
                value: 1
            },
            "Track Type": {
                type: "dropdown",
                value: "Video",
                dropdownOptions: Object.keys(ResolveEnums.TrackType),
            },
            "New Name": {
                type: "string",
                value: "Renamed Clip"
            }
        },
        "Link Clips": {
            "Video Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Audio Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Linked?": {
                type: "boolean",
                value: true
            }
        },
        "Cut Item": {
            "Video Track": {
                type: "number",
                value: 1
            },
            "Audio Tracks (1,2,3)": {
                type: "string",
                value: "1"
            },
            "Frame Offset": {
                type: "number",
                value: 0,
            }
        },
        "Run Profile": {
            "Profile Name": {
                type: "string",
                value: "New Profile"
            }
        }
    }

    let ActionFunctions = {
        "Add Track": (trackName: string, trackType: ResolveEnums.TrackType, addUntilX: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            if (addUntilX != -1) {
                for (let i = 0; i < addUntilX; i++) {
                    const trackCount = currentTimeline.GetTrackCount(trackType);
                    if (trackCount <= i) {
                        if (trackType.toLowerCase() == ResolveEnums.TrackType.Audio) currentTimeline.AddTrack(trackType.toLowerCase(), "stereo")
                        else currentTimeline.AddTrack(trackType.toLowerCase());
                    }
                }
            }
            else {
                if (trackType.toLowerCase() == ResolveEnums.TrackType.Audio) currentTimeline.AddTrack(trackType.toLowerCase(), "stereo")
                else currentTimeline.AddTrack(trackType.toLowerCase());
            }

            const trackCount = currentTimeline.GetTrackCount(trackType);
            currentTimeline.SetTrackName(trackType, trackCount, trackName);
        },
        "Delete Tracks": (tracks: string, trackType: ResolveEnums.TrackType, trackName: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            if (trackName !== "") {
                const trackCount = currentTimeline.GetTrackCount(trackType);
                for (let i = 1; i <= trackCount; i++) {
                    const CurrenttrackName = currentTimeline.GetTrackName(trackType, i);
                    if (CurrenttrackName == trackName) {
                        currentTimeline.DeleteTrack(trackType, i);
                        break;
                    }
                }
            }
            else {
                const trackArray = tracks.split(",").map(Number);

                for (let trackIndex = 0; trackIndex < trackArray.length; trackIndex++) {
                    const actualTrackIndex = trackArray[trackIndex];
                    currentTimeline.DeleteTrack(trackType, actualTrackIndex);
                }
            }
        },
        "Create Timeline": (timelineName: string) => { // Only gets an error if an existing timeline with the same name exists.
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();
            currentMediapool.CreateEmptyTimeline(timelineName);
        },
        "Import Media": (importType: "Timeline" | "Mediapool", defaultPath: string, fileOrFolder: "File" | "Folder", startFrame:number = 0, originFrame: "Relative" | "Start", clipColor: ResolveEnums.ClipColor = ResolveEnums.ClipColor.Blue, trackIndex: number, mediapoolBinName: string, returnToOrigin: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const currentProject = ResolveFunctions.GetCurrentProject();
            const currentMediapool = currentProject.GetMediaPool();

            const playheadTimecode = currentTimeline.GetCurrentTimecode();

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

                if (returnToOrigin) currentTimeline.SetCurrentTimecode(playheadTimecode);
            }
        },
        //Maybe make better? carries a lot of similar code to 'Import Media' above
        "From Mediapool": (clipName: string, binName: string, track: number, startFrame: number, originFrame: 'Relative' | 'Start') => {
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
        "Duplicate Clip": (originTrack: number, destTrack: number, frameOffset: number, originTrackType: ResolveEnums.TrackType, returnToOrigin: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();

            const playhead = currentTimeline.GetCurrentTimecode();
            const selectedItem = ResolveFunctions.GetTimelineItem(originTrackType, originTrack, currentTimeline) as TimelineItem;
            if (!selectedItem) return;
            const mediaReference = selectedItem.GetMediaPoolItem();

            const clipInfo: ClipInfo = {
                mediaPoolItem: mediaReference,
                startFrame: selectedItem.GetLeftOffset(),
                endFrame: selectedItem.GetRightOffset() - 1,

                trackIndex: destTrack,
                recordFrame: (selectedItem.GetStart() + frameOffset)
            }

            currentMediapool.AppendToTimeline([clipInfo]);

            if (returnToOrigin) currentTimeline.SetCurrentTimecode(playhead);
        },
        "Apply LUT": (filePath: string, fileOrFolder: "File" | "Folder", tracks: string) => {
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

            const compoundClip = currentTimeline.CreateCompoundClip(timelineItems);

            const compoundMediaReference = compoundClip.GetMediaPoolItem();
            compoundMediaReference.SetClipProperty('Clip Name', compoundClipName);
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
        "Move Playhead": (moveTo: "Relative" | "Start" | "Origin" | "Start Of Clip" | "End Of Clip", frameOffset: number, track: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            let timecode: string = "";
            switch (moveTo) {
                case 'Relative': {
                    let currentFrame = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
                    currentFrame += frameOffset;
                    timecode = ResolveFunctions.ConvertFramesToTimecode(currentFrame);
                    break;
                }
                case 'Start': {
                    let startFrame = currentTimeline.GetStartFrame();
                    startFrame += frameOffset;
                    timecode = ResolveFunctions.ConvertFramesToTimecode(startFrame);
                    break;
                }
                case 'Origin': {
                    if (!originPlayheadFrame) return;
                    originPlayheadFrame += frameOffset;
                    timecode = ResolveFunctions.ConvertFramesToTimecode(originPlayheadFrame);
                    break;
                }
                case 'Start Of Clip': {
                    const currentClip = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, track, currentTimeline) as TimelineItem;
                    if (!currentClip) return;

                    let startFrame = currentClip.GetStart();
                    startFrame += frameOffset;

                    timecode = ResolveFunctions.ConvertFramesToTimecode(startFrame);
                    break;
                }
                case 'End Of Clip': {
                    const currentClip = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, track, currentTimeline) as TimelineItem;
                    if (!currentClip) return;

                    let startFrame = currentClip.GetEnd();
                    startFrame += frameOffset;

                    timecode = ResolveFunctions.ConvertFramesToTimecode(startFrame);
                    break;
                }
            }

            currentTimeline.SetCurrentTimecode(timecode);
        },
        "Switch Page": (page: ResolveEnums.Pages) => {
            if (page == 'none') return;
            Resolve.OpenPage(page);
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
            if (items.length == 0 || items === undefined) return;

            currentTimeline.DeleteClips(items);
        },
        "Rename Media Item": (track: number, trackType: ResolveEnums.TrackType, newName: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const item = ResolveFunctions.GetTimelineItem(trackType, track, currentTimeline) as TimelineItem;
            const mediaReference = item.GetMediaPoolItem();
            if (!mediaReference) return;

            mediaReference.SetClipProperty("Clip Name", newName);
        },
        "Link Clips": (VideoTracks: string, AudioTracks: string, linked: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const VideoTrackNumbers = VideoTracks.split(",").map(Number);
            let VideoItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, VideoTrackNumbers, currentTimeline) as TimelineItem[];
            if (!Array.isArray(VideoItems)) {
                VideoItems = [VideoItems];
            }
            if (!VideoItems) return;

            const AudioTrackNumbers = AudioTracks.split(",").map(Number);
            let AudioItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Audio, AudioTrackNumbers, currentTimeline) as TimelineItem[];
            if (!Array.isArray(AudioItems)) {
                AudioItems = [AudioItems];
            }
            if (!AudioItems) return;

            let TotalItems: TimelineItem[] = [];
            for (let i = 0; i < VideoItems.length; i++) {
                TotalItems.push(VideoItems[i])
            }
            for (let j = 0; j < AudioItems.length; j++) {
                TotalItems.push(AudioItems[j])
            }

            currentTimeline.SetClipsLinked(TotalItems, linked);
        },
        "Cut Item": (videoTrack: number, audioTracks: string, frameOffset: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) {
                console.warn("No timeline selected");
                return;
            }

            const trackNumbers = audioTracks.split(",").map(Number);
            console.log(trackNumbers);

            const videoItem = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, [videoTrack], currentTimeline) as TimelineItem;
            const audioItems = trackNumbers[0] != 0 ? ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Audio, trackNumbers, currentTimeline) as TimelineItem[] : [];

            const cutItems: ResolveFunctions.CutItems = {
                video: videoItem,
                audio: audioItems ?? [],
                trackToAppend: videoTrack
            }
            let playhead = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
            let currentFrame = playhead;

            currentFrame -= 1; // CurrentFrame is one frame too high.
            currentFrame += frameOffset;
            currentFrame -= videoItem.GetStart();

            // const timelineFrameRate = ResolveFunctions.GetTimelineFramerate(currentTimeline);
            // const mediaFPS = parseInt(videoItem.GetMediaPoolItem().GetClipProperty('FPS') as string);
            // currentFrame = currentFrame / (timelineFrameRate / mediaFPS);

            //console.log(cutItems, [currentFrame]);
            ResolveFunctions.CutTimelineItem(cutItems, [currentFrame]);

            currentTimeline.SetCurrentTimecode(ResolveFunctions.ConvertFramesToTimecode(playhead));
        },
        "Run Profile": (profileName: string) => {
            const profileActions = _profiles[profileName];
            if (!profileActions) return;

            RunActions(profileName);
        }
    }

    function UpdateDatastore(): void {
        _profiles = _profiles;
    }

    let NewActionDropdown: string;
    function AddNewAction(): void {
        let parameters: {[key: string]: any} = {};
        for (const [actionName, actionInput] of Object.entries(ActionValueLookup[NewActionDropdown])) {
            parameters[actionName] = actionInput.value;
        }

        const newAction: Action = {
            Minimized: false,
            Name: NewActionDropdown,
            Parameters: parameters
        }
        _profiles[CurrentProfile][Common.GetRandomHash(8)] = newAction;
        UpdateDatastore();
    }

    function DeleteAction(actionUUID: string): void {
        for (const [UUID, action] of Object.entries(_profiles[CurrentProfile])) {
            if (UUID == actionUUID) {
                delete _profiles[CurrentProfile][UUID];
            }
        }
        UpdateDatastore();
    }

    function AddNewProfile(): void {
        if (Object.keys(_profiles).includes("New Profile")) return;

        _profiles["New Profile"] = {}
        UpdateDatastore();
    }

    let showConfirm = false;
    function RemoveProfile(): void {
        delete _profiles[CurrentProfile];

        if (Object.keys(_profiles).length == 0 || CurrentProfile == undefined) {
            AddNewProfile();
        }

        CurrentProfile = Object.keys(_profiles)[0];
        profileNameChangeInput.value = CurrentProfile
        UpdateDatastore();
    }

    function RunActions(profileName?: string): void {
        const currentTimeline = ResolveFunctions.GetCurrentTimeline();
        originPlayheadFrame = undefined;
        if (currentTimeline) {
            originPlayheadFrame = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
        }
        profileName = profileName ?? CurrentProfile;
        
        for (const [UUID, action] of Object.entries(_profiles[profileName])) {
            const actionFunction = ActionFunctions[action.Name];
            const params = Object.values(action.Parameters);
            console.log(action.Name, params);
            actionFunction(...params);
        }
    }

    let profileNameChangeInput: HTMLInputElement;
    function UpdateProfileKeyName(): void {
        if (!profileNameChangeInput) return;

        _profiles[profileNameChangeInput.value] = _profiles[CurrentProfile];
        delete _profiles[CurrentProfile];

        CurrentProfile = profileNameChangeInput.value

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
    
    function ChooseFileButton(file: boolean, folder: boolean, valueName: string, actionValue: string, parameters: {[key: string]: any}): void {
        const mediaImportCase: string = parameters["File Or Folder"] ?? undefined;
        if (mediaImportCase == "File") {
            file = true;
            folder = false;
        }
        else if (mediaImportCase == "Folder") {
            file = false;
            folder = true;
        }

        const result = ChooseFile(file, folder);
        if (result.length == 0) return;

        parameters[valueName] = result[0];
        UpdateDatastore();
    }

    function MoveActionInList(upOrDown: 'Back' | 'Forward', SelectedAction: string): void {
        const action = _profiles[CurrentProfile][SelectedAction];
        const actionKeys = Object.keys(_profiles[CurrentProfile]);
        const actionIndex = actionKeys.indexOf(SelectedAction);

        if (upOrDown == 'Back') {
            if (actionIndex == 0) return;

            let actionToSwap = _profiles[CurrentProfile][actionKeys[actionIndex - 1]];
            _profiles[CurrentProfile][actionKeys[actionIndex - 1]] = action;
            _profiles[CurrentProfile][actionKeys[actionIndex]] = actionToSwap;
        }
        else if (upOrDown == 'Forward') {
            if (actionIndex == actionKeys.length - 1) return;

            let actionToSwap = _profiles[CurrentProfile][actionKeys[actionIndex + 1]];
            _profiles[CurrentProfile][actionKeys[actionIndex + 1]] = action;
            _profiles[CurrentProfile][actionKeys[actionIndex]] = actionToSwap;
        }

        UpdateDatastore();
    }

    function RunSpecificAction(actionName: string, UUID: string): void {
        const currentTimeline = ResolveFunctions.GetCurrentTimeline();
        originPlayheadFrame = undefined;
        if (currentTimeline) {
            originPlayheadFrame = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
        }

        const actionFunction = ActionFunctions[actionName];
        const params = Object.values(_profiles[CurrentProfile][UUID].Parameters);
        console.log(actionName, params);
        actionFunction(...params);
    }
</script>


<main id={componentID}>
    <div id="top">
        <div id=topTitle>
            <h1>Quick Actions</h1>
            <select id="actionProfiles" bind:value={CurrentProfile} on:change={() => {profileNameChangeInput.value = CurrentProfile}}>
                {#each Object.keys(_profiles) as profile}
                    <option value={profile}>{profile}</option>
                {/each}
            </select>
        </div>

        <div id=profileNameContainer>
            <p>Profile Name:</p>
            <input type="text" bind:this={profileNameChangeInput} on:input={UpdateProfileKeyName} />
        </div>

        <div id=topButtons>
            <div>
                <button class=buttonStyle on:click={AddNewProfile}>Add New</button>
                <button class=buttonStyle on:click={() => { showConfirm = true }}>Remove Profile</button>
            </div>
        
            <div>
                <button class=buttonStyle on:click={() => { RunActions() }}>Run Actions</button>
            </div>
        </div>
    </div>

    <div id="actionList">

        <div id="autoGen">
            {#each Object.entries(_profiles[CurrentProfile]) as [UUID, action]}
                <div class="action" id={`action-${UUID}`} transition:slide|local>
                    <div class=actionHeader transition:fade>
                        <div id=actionHeaderLeft>
                            {#if showActionArrows}
                                <div id="moveContainer">
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="arrowUpContainer" on:click={() => { MoveActionInList('Back', UUID) }} ><img src="../src/assets/arrowUp.svg" alt="Up"></div>
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="arrowDownContainer" on:click={() => { MoveActionInList('Forward', UUID) }} ><img src="../src/assets/arrowDown.svg" alt="Up"></div>
                                </div>
                            {/if}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <h2 on:click={() => { RunSpecificAction(action.Name, UUID) }}>{action.Name}</h2>
                        </div>
                        <div>
                            <button class="buttonStyle" on:click={() => { action.Minimized = !action.Minimized}}>{action.Minimized ? "Expand" : "Minimize"}</button>
                            <button class=buttonStyle id=DeleteAction on:click={() => { DeleteAction(UUID)}}><b>-</b></button>
                        </div>
                    </div>

                    {#if !action.Minimized}
                        <div class="actionInputs" transition:slide|local>
                            {#each Object.entries(ActionValueLookup[action.Name]) as [valueName, actionInput]}

                                <div class="actionInput">
                                    <label for={valueName}>{valueName}</label>
                                    <div>
                                        {#if actionInput.type == "string"}
                                            <input type="text" bind:value={action.Parameters[valueName]} />
                                        {:else if actionInput.type == "number"}
                                            <input type="number" bind:value={action.Parameters[valueName]} />
                                        {:else if actionInput.type == "boolean"}
                                            <input type="checkbox" bind:checked={action.Parameters[valueName]} />
                                        {:else if actionInput.type == "dropdown"}
                                            <select bind:value={action.Parameters[valueName]}>
                                                {#each actionInput["dropdownOptions"] as option}
                                                    <option value={option}>{option}</option>
                                                {/each}
                                            </select>
                                        {:else if actionInput.type == "file"}
                                            <input type="text" bind:value={action.Parameters[valueName]}>
                                            <button class=buttonStyle on:click={() => { ChooseFileButton(true, false, valueName, actionInput.value, action.Parameters) }}>.../</button>
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
                {#each Object.keys(ActionValueLookup) as actionKey}
                    <option value={actionKey}>{actionKey}</option>
                {/each}
            </select>
            <button class=buttonStyle on:click={AddNewAction}>Add New Action</button>
        </div>

    </div>

    {#if showConfirm}
        <div class="confirmContainer">
            <div class="confirmBox">
                <h1>Are you sure you want to delete this profile?</h1>
                <div>
                    <button class=buttonStyle on:click={() => { showConfirm = false }}>Cancel</button>
                    <button class=buttonStyle on:click={() => { RemoveProfile(); showConfirm = false }}>Delete</button>
                </div>
            </div>
        </div>
    {/if}

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

        transition: background-color 0.2s ease-in-out;
    }

    .actionHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        h2 {
            margin: 0;
            font-size: 1rem;
            margin-left: 0.25rem;

            white-space: nowrap;

            &:hover {
                color: darken(Colors.$TextColor, 25%);

                cursor: pointer;
            }

            transition: color 0.2s;
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

    #moveContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        overflow: hidden;

        img {
            width: 1.4rem;
            height: 1.4rem;

            cursor: pointer;
            
            filter: invert(Colors.$IconInvertPercentage);

            &:hover {
                filter: invert(Colors.$IconInvertPercentage - 50%);
            }

            transition: filter 0.2s;
        }

        #arrowUpContainer {
            width: 1.2rem;
            height: 1.2rem;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #arrowDownContainer {
            @extend #arrowUpContainer;
        }
    }

    #actionHeaderLeft {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

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

    .confirmContainer {
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        z-index: 100;
    }

    .confirmBox {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.75rem;

        padding: 0.5rem;

        max-width: 17rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        text-align: center;

        & > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            & > button {
                margin-left: 0.5rem;
            }
        }
    }

</style>