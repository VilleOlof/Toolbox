import { ResolveFunctions } from "./DavinciResolve";
import { GlobalSettings } from "./Settings";


export module SharedModuleLogic {
    export module MarkerTool {

        const _Settings = GlobalSettings.GetInstance("MarkerTool");

        function GetPlayHeadFrame(timeline?: Timeline): number {
            let currentTimeline: Timeline = timeline ?? ResolveFunctions.GetCurrentTimeline();
            if (!currentTimeline) return 0;
    
            let playHead: string = currentTimeline.GetCurrentTimecode();
    
            let playHeadFrame: number = ResolveFunctions.ConvertTimecodeToFrames(playHead);
    
            playHeadFrame -= currentTimeline.GetStartFrame();
    
            return playHeadFrame;
        }

        export function CheckIfMarkerExists(markerData: string): boolean {
            let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
            if (!timeline) return false;
            let markers = timeline.GetMarkers();
    
            for (const [frameID, MarkerData] of Object.entries(markers)) {
                if (MarkerData.customData == markerData) return true;
            }
    
            return false;
        }

        export const StartMarkerData: string = "MarkerTool-StartMarker";
        export function CreateStartMarker(): void {
            let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
            if (!timeline) return;
    
            let playHeadPosition = GetPlayHeadFrame(timeline);
    
            if (CheckIfMarkerExists(StartMarkerData)) timeline.DeleteMarkerByCustomData(StartMarkerData);
    
            const StartColor = _Settings.GetSettingValue("Start Marker Color");
            
            timeline.AddMarker(
                playHeadPosition,
                StartColor,
                "Start Marker",
                "A Generated Marker By The MarkerTool Module",
                1,
                StartMarkerData
            );
        }

        export const EndMarkerData: string = "MarkerTool-EndMarker";
        export function CreateEndMarker(): void {
            let timeline: Timeline = ResolveFunctions.GetCurrentTimeline();
            if (!timeline) return;
    
            let playHeadPosition = GetPlayHeadFrame(timeline);
    
            if (CheckIfMarkerExists(EndMarkerData))  timeline.DeleteMarkerByCustomData(EndMarkerData);
            
            const EndColor = _Settings.GetSettingValue("End Marker Color");

            timeline.AddMarker(
                playHeadPosition,
                EndColor,
                "End Marker",
                "A Generated Marker By The MarkerTool Module",
                1,
                EndMarkerData
            );
        }
    }
}