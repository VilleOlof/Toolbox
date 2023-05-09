import { AppSettings } from "./AppSettings";

import { ChildProcess } from "child_process";
import { Common } from "./Common";
const { exec, execSync } = require('child_process');

export namespace FFmpeg {
    let Initialized: boolean = false;

    let _FFmpegPath: string = '';

    export const RunType = {
        FFmpeg: 'ffmpeg',
        FFprobe: 'ffprobe'
    } as const;
    export type RunType = typeof RunType[keyof typeof RunType];

    /**
     * Initializes the FFmpeg module.
     * This function is called in src\Main.ts
     * Not intended to be called by modules.
     */
    export function Init(): void {
        if (Initialized) return;

        _FFmpegPath = AppSettings.GetSetting('FFmpegPath', '');

        Initialized = true;
    }

    /**
     * Runs FFmpeg or FFprobe with the given arguments.
     * 
     * @param type The type of command to run. FFmpeg or FFprobe.
     * @param args The arguments to pass to the command.
     * @returns The child process of the command.
     * 
     * @example
     * 
     * ```typescript
     * import { FFmpeg } from './Lib/FFmpeg'
     * 
     * //Take a thumbnail from a video
     * FFmpeg.Run(FFmpeg.RunType.FFmpeg, 
     * '-ss', '00:25:00', //Time to take the thumbnail from
     * '-y', //Overwrite the file if it exists
     * '-i', '"...path/input.mp4"', //Input file
     * '-vframes', '1', //Take 1 frame
     * `"${Common.IO.GetTempDir()}thumbnail.jpg"` //Output file
     * );
     * ```
     */
    export function Run(type: RunType, ...args: string[]): ChildProcess {
        if (!Initialized) throw new Error('FFmpeg module not initialized.');
        if (_FFmpegPath === '') {
            PromptUserForPath();
            //Do a double check incase the user cancels the prompt.
            if (_FFmpegPath === '') return;
        }
        const ext = process.platform === 'win32' ? '.exe' : '';
        
        const command = `${_FFmpegPath}/${type}${ext}` + ' ' + args.join(' ');
        const FFprocess = exec(command);
        
        return FFprocess;
    };

    //Make both Run functions more 'general'.
    export function RunSync(type: RunType, ...args: string[]): string {
        if (!Initialized) throw new Error('FFmpeg module not initialized.');
        if (_FFmpegPath === '') {
            PromptUserForPath();
            //Do a double check incase the user cancels the prompt.
            if (_FFmpegPath === '') return;
        }
        const ext = process.platform === 'win32' ? '.exe' : '';
        
        const command = `${_FFmpegPath}/${type}${ext}` + ' ' + args.join(' ');
        const output = execSync(command);
        
        return output;
    }

    /**
     * Prompts the user to select the FFmpeg folder.
     */
    function PromptUserForPath(): void {
        const folder = Common.IO.Dialog({
            title: 'FFmpeg Folder Path',
            buttonLabel: 'Select Folder',
            properties: ['openDirectory']
        })[0];
        if (!folder) return;

        _FFmpegPath = folder;
        AppSettings.SetSetting('FFmpegPath', _FFmpegPath);
    }

    export namespace Util {

        /**
         * Grabs a thumbnail from a video.
         * 
         * @param videoPath The path to the video.
         * @param time The time to take the thumbnail from.
         * @param output The output path of the thumbnail.
         * @param overwrite Whether to overwrite the file if it exists.
         * @returns The output path of the thumbnail.
         * 
         * @example
         * 
         * ```typescript
         * import { FFmpeg } from './Lib/FFmpeg'
         * 
         * //Take a thumbnail from a video
         * FFmpeg.Util.GetVideoThumbnail(
         * '"...path/input.mp4"', //Input file
         * '00:25:00', //Time to take the thumbnail from
         * `"${Common.IO.GetTempDir()}thumbnail.jpg"` //Output file
         * );
         * ```
         */
        export function GetVideoThumbnail(videoPath: string, time: string, output?: string, overwrite: boolean = true): string {
            const videoFileName = Common.GetPathModule().basename(videoPath);
            output = output ? output : Common.IO.GetTempDir() + `${videoFileName}.jpg`;

            RunSync(RunType.FFmpeg,
                '-ss', time,
                overwrite ? '-y' : '',
                '-i', `"${videoPath}"`,
                '-vframes', '1',
                `"${output}"`
            );

            return output;
        }

        /**
         * Gets the frame count of a video.
         * 
         * @param videoPath The path to the video.
         * @returns The frame count of the video.
         * 
         * @example
         * 
         * ```typescript
         * import { FFmpeg } from './Lib/FFmpeg'
         * 
         * //Get the frame count of a video
         * const frameCount = FFmpeg.Util.GetFrameCount('"...path/input.mp4"');
         * ```
         */
        export function GetFrameCount(videoPath: string): number {
            const output = RunSync(RunType.FFprobe,
                '-v', 'error',
                '-select_streams', 'v:0',
                '-show_entries', 'stream=nb_frames',
                '-of', 'default=nokey=1:noprint_wrappers=1',
                `"${videoPath}"`
            );
            const frameCount = parseInt(output.toString());

            return frameCount;
        }

        /**
         * Gets the duration of a video.
         * 
         * @param videoPath The path to the video.
         * @returns The duration of the video.
         * 
         * @example
         * 
         * ```typescript
         * import { FFmpeg } from './Lib/FFmpeg'
         * 
         * //Get the duration of a video
         * const duration = FFmpeg.Util.GetDuration('"...path/input.mp4"');
         * ```
         */
        export function GetDuration(videoPath: string): number {
            const output = RunSync(RunType.FFprobe,
                '-v', 'error',
                '-select_streams', 'v:0',
                '-show_entries', 'stream=duration',
                '-of', 'default=nokey=1:noprint_wrappers=1',
                `"${videoPath}"`
            );
            const duration = parseFloat(output.toString());

            return duration;
        }

        /**
         * Gets the resolution of a video.
         * 
         * @param videoPath The path to the video.
         * @returns The resolution of the video.
         * 
         * @example
         * 
         * ```typescript
         * import { FFmpeg } from './Lib/FFmpeg'
         * 
         * //Get the resolution of a video
         * const resolution = FFmpeg.Util.GetVideoResolution('"...path/input.mp4"');
         * ```
         */
        export function GetVideoResolution(videoPath: string): {width: number, height: number} {
            const output = RunSync(RunType.FFprobe,
                '-v', 'error',
                '-select_streams', 'v:0',
                '-show_entries', 'stream=width,height',
                '-of', 'csv=s=x:p=0',
                `"${videoPath}"`
            );
            const resolution = output.toString().split('x');
            const width = parseInt(resolution[0]);
            const height = parseInt(resolution[1]);

            return {width, height};
        }

        /**
         * Converts a video to a different format.
         * 
         * @param videoPath the path to the video.
         * @param output the output path of the converted video.
         * @param overwrite whether to overwrite the file if it exists.
         * 
         * @example
         * 
         * ```typescript
         * import { FFmpeg } from './Lib/FFmpeg'
         * 
         * //Convert a video to a different format
         * FFmpeg.Util.ConvertVideo(
         * '"...path/input.mp4"', //Input file
         * `"${Common.IO.GetTempDir()}output.mkv"` //Output file
         * );
         * ```
         */
        export function ConvertVideo(videoPath: string, output: string, overwrite: boolean = true): void {
            RunSync(RunType.FFmpeg,
                '-i', `"${videoPath}"`,
                overwrite ? '-y' : '',
                `"${output}"`
            );
        }
    }
}