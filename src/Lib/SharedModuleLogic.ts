import { Common } from "./Common";
import { ResolveFunctions } from "./DavinciResolve";
import { GlobalSettings } from "./Settings";


export module SML {
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

    export module Shared {
        export module Function {
            export const Subscription = {
                "QuickActions.Run": "QuickActions.Run",
                "QuickRender.Render": "QuickRender.Render",
                "QuickRender.AddRenderJob": "QuickRender.AddRenderJob",
                "ImageClipboard.Paste": "ImageClipboard.Paste",
            } as const;
            export type Subscription = typeof Subscription[keyof typeof Subscription];
    
            type CallbackData = {
                function: Function,
                type: string | Subscription
            }
            let Callbacks: { [key: string]: CallbackData } = {};
    
            export function Add(event: string | Subscription, callback: Function): void {
                if (!Subscription[event]) return;
                const eventID = `${event}-${Common.GetRandomHash(8, true)}`
    
                Callbacks[eventID] = {} as CallbackData;
                Callbacks[eventID].function = callback;
                Callbacks[eventID].type = event;
            }
    
            export function Run(event: string | Subscription, ...args: any[]): void {
                if (!Subscription[event]) return;
                for (const [_, callbackData] of Object.entries(Callbacks)) {
                    if (callbackData.type == event) callbackData.function(...args);
                }
            }
        }

        export module Data {
            export const DataKeys = {
                "QuickActions.Profiles": "QuickActions.Profiles",
            } as const;
            export type DataKeys = typeof DataKeys[keyof typeof DataKeys];

            let _Data: { [key: string]: any } = {};

            export function Set(key: string | DataKeys, data: any): void {
                _Data[key] = data;
            }

            export function Get(key: string | DataKeys, defaultValue: any): any {
                if (!_Data[key]) return defaultValue;
                return _Data[key];
            }
        }
    }
}