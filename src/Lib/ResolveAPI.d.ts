//Davinci Resolve Version: 18.1.5

// Some undocumented detailed types were taken from: https://gist.github.com/bradcordeiro/2f00120fad252a1b2bffcb882c9c941b
// **Undocumented** types were taken from: https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=113040

/**
 * Enum types for DaVinci Resolve related things.
 */
declare namespace ResolveEnums {

    /**
     * All pages.
     * @enum {string}
     */
    declare enum Pages {
        Media = "media",
        Cut = "cut",
        Edit = "edit",
        Fusion = "fusion",
        Color = "color",
        Fairlight = "fairlight",
        Deliver = "deliver",
        None = "none",
    }

    /**
     * All track types.
     * @enum {string}
     */
    declare enum TrackType {
        Audio = "audio",
        Video = "video",
        Subtitle = "subtitle"
    }

    /**
     * All timeline generators.
     * @enum {string}
     */
    declare enum TimelineGenerator {
        __10_Step = '10 Step',
        __100mV_Steps = '100mV Steps',
        __BT2111_Color_Bar_HLG_Narrow = 'BT.2111 Color Bar HLG Narrow',
        __BT2111_Color_Bar_PQ_Full = 'BT.2111 Color Bar PQ Full',
        __BT2111_Color_Bar_PQ_Narrow = 'BT.2111 Color Bar PQ Narrow',
        __EBU_Color_Bar = 'EBU Color Bar',
        __Four_Color_Gradient = 'Four Color Gradient',
        __Grey_Scale = 'Grey Scale',
        __SMPTE_Color_Bar = 'SMPTE Color Bar',
        __Solid_Color = 'Solid Color',
        __Window = 'Window',
        __YCbCr_Ramp = 'YCbCr Ramp'
    }
    
    /**
     * All fusion generators.
     * @enum {string}
     */
    declare enum FusionGenerator {
        __Contours = 'Contours',
        __Noise_Gradient = 'Noise Gradient',
        __Paper = 'Paper',
        __Texture_Background = 'Texture Background',
    }
    
    /**
     * All title names.
     * @enum {string}
     */
    declare enum TitleNames {
        __Left_Lower_Third = 'Left Lower Third',
        __Middle_Lower_Third = 'Middle Lower Third',
        __Right_Lower_Third = 'Right Lower Third',
        __Scroll = 'Scroll',
        __Text = 'Text'
    }
    
    /**
     * All timeline item version types.
     * @enum {number}
     */
    declare enum TimelineItemVersionType {
        Local = 0,
        Remote = 1
    }

    /**
     * All grade modes.
     * @enum {number}
     */
    declare enum GradeMode {
        'No keyframes' = 0,
        'Source Timecode aligned' = 1,
        'Start Frames aligned' = 2
    }
    
    /**
     * All still export formats.
     * @enum {string}
     */
    declare enum StillExportFormat {
        DPX = 'dpx',
        CIN = 'cin',
        TIF = 'tif',
        JPG = 'jpg',
        PNG = 'png',
        PPM = 'ppm',
        BMP = 'bmp',
        XPM = 'xpm',
    }
    
    /**
     * All clip colors.
     * @enum {string}
     */
    declare enum ClipColor {
        Apricot = "Apricot",
        Beige = "Beige",
        Blue = "Blue",
        Brown = "Brown",
        Chocolate = "Chocolate",
        Green = "Green",
        Lime = "Lime",
        Navy = "Navy",
        Olive = "Olive",
        Orange = "Orange",
        Pink = "Pink",
        Purple = "Purple",
        Tan = "Tan",
        Teal = "Teal",
        Violet = "Violet",
        Yellow = "Yellow",
    }
    
    /**
     * All marker colors.
     * @enum {string}
     */
    declare enum MarkerColor {
        Blue = "Blue",
        Cocoa = "Cocoa",
        Cream = "Cream",
        Cyan = "Cyan",
        Fushsia = "Fushsia",
        Green = "Green",
        Lavender = "Lavender",
        Lemon = "Lemon",
        Mint = "Mint",
        Pink = "Pink",
        Purple = "Purple",
        Red = "Red",
        Rose = "Rose",
        Sand = "Sand",
        Sky = "Sky",
        Yellow = "Yellow",
    }
    
    /**
     * All flag colors.
     * @enum {string}
     */
    declare enum FlagColor {
        Blue = "Blue",
        Cocoa = "Cocoa",
        Cream = "Cream",
        Cyan = "Cyan",
        Fushsia = "Fushsia",
        Green = "Green",
        Lavender = "Lavender",
        Lemon = "Lemon",
        Mint = "Mint",
        Pink = "Pink",
        Purple = "Purple",
        Red = "Red",
        Rose = "Rose",
        Sand = "Sand",
        Sky = "Sky",
        Yellow = "Yellow",
    }

    /**
     * All Dynamic Zoom Ease Settings.
     * @enum {number}
     */
    declare enum DynamicZoomEaseSetting {
        DYNAMIC_ZOOM_EASE_LINEAR = 0,
        DYNAMIC_ZOOM_EASE_IN,
        DYNAMIC_ZOOM_EASE_OUT,
        DYNAMIC_ZOOM_EASE_IN_AND_OUT,
    };
    
    /**
     * All Composite Mode Settings.
     * @enum {number}
     */
    declare enum CompositeModeSetting {
        COMPOSITE_NORMAL = 0,
        COMPOSITE_ADD,
        COMPOSITE_SUBTRACT,
        COMPOSITE_DIFF,
        COMPOSITE_MULTIPLY,
        COMPOSITE_SCREEN,
        COMPOSITE_OVERLAY,
        COMPOSITE_HARDLIGHT,
        COMPOSITE_SOFTLIGHT,
        COMPOSITE_DARKEN,
        COMPOSITE_LIGHTEN,
        COMPOSITE_COLOR_DODGE,
        COMPOSITE_COLOR_BURN,
        COMPOSITE_EXCLUSION,
        COMPOSITE_HUE,
        COMPOSITE_SATURATE,
        COMPOSITE_COLORIZE,
        COMPOSITE_LUMA_MASK,
        COMPOSITE_DIVIDE,
        COMPOSITE_LINEAR_DODGE,
        COMPOSITE_LINEAR_BURN,
        COMPOSITE_LINEAR_LIGHT,
        COMPOSITE_VIVID_LIGHT,
        COMPOSITE_PIN_LIGHT,
        COMPOSITE_HARD_MIX,
        COMPOSITE_LIGHTER_COLOR,
        COMPOSITE_DARKER_COLOR,
        COMPOSITE_FOREGROUND,
        COMPOSITE_ALPHA,
        COMPOSITE_INVERTED_ALPHA,
        COMPOSITE_LUM,
        COMPOSITE_INVERTED_LUM,
    };
    
    /**
     * All Retime Process Settings.
     * @enum {number}
     */
    declare enum RetimeProcessSetting {
        RETIME_USE_PROJECT = 0,
        RETIME_NEAREST,
        RETIME_FRAME_BLEND,
        RETIME_OPTICAL_FLOW,
    };
    
    /**
     * All Motion Estimation Settings.
     * @enum {number}
     */
    declare enum MotionEstimationSetting {
        MOTION_EST_USE_PROJECT = 0,
        MOTION_EST_STANDARD_FASTER,
        MOTION_EST_STANDARD_BETTER,
        MOTION_EST_ENHANCED_FASTER,
        MOTION_EST_ENHANCED_BETTER,
        MOTION_EST_SPEED_WRAP,
    };
    
    /**
     * All Scaling Settings.
     * @enum {number}
     */
    declare enum ScalingSetting {
        SCALE_USE_PROJECT = 0,
        SCALE_CROP,
        SCALE_FIT,
        SCALE_FILL,
        SCALE_STRETCH,
    };
    
    /**
     * All Resize Filter Settings.
     * @enum {number}
     */
    declare enum ResizeFilterSetting {
        RESIZE_FILTER_USE_PROJECT = 0,
        RESIZE_FILTER_SHARPER,
        RESIZE_FILTER_SMOOTHER,
        RESIZE_FILTER_BICUBIC,
        RESIZE_FILTER_BILINEAR,
        RESIZE_FILTER_BESSEL,
        RESIZE_FILTER_BOX,
        RESIZE_FILTER_CATMULL_ROM,
        RESIZE_FILTER_CUBIC,
        RESIZE_FILTER_GAUSSIAN,
        RESIZE_FILTER_LANCZOS,
        RESIZE_FILTER_MITCHELL,
        RESIZE_FILTER_NEAREST_NEIGHBOR,
        RESIZE_FILTER_QUADRATIC,
        RESIZE_FILTER_SINC,
        RESIZE_FILTER_LINEAR,
    };
    
    /**
     * All Timeline Export Types.
     * @enum {number}
     */
    declare enum TimelineExportType {
        EXPORT_AAF,
        EXPORT_DRT,
        EXPORT_EDL,
        EXPORT_FCP_7_XML,
        EXPORT_FCPXML_1_3,
        EXPORT_FCPXML_1_4,
        EXPORT_FCPXML_1_5,
        EXPORT_FCPXML_1_6,
        EXPORT_FCPXML_1_7,
        EXPORT_FCPXML_1_8,
        EXPORT_FCPXML_1_9,
        EXPORT_FCPXML_1_10,
        EXPORT_HDR_10_PROFILE_A,
        EXPORT_HDR_10_PROFILE_B,
        EXPORT_TEXT_CSV,
        EXPORT_TEXT_TAB,
        EXPORT_DOLBY_VISION_VER_2_9,
        EXPORT_DOLBY_VISION_VER_4_0,
    }
    
    /**
     * All Timeline Export Sub Types.
     * @enum {number}
     */
    declare enum TimelineExportSubType {
        EXPORT_NONE,
        EXPORT_AAF_NEW,
        EXPORT_AAF_EXISTING,
        EXPORT_CDL,
        EXPORT_SDL,
        EXPORT_MISSING_CLIPS
    }
}

/**
 * dbInfo is a type that is used to specify the database type and name.
 * and optionally the IP address of the database server.
 */
declare type dbInfo = {
    DbType: 'Disk' | 'PostgreSQL';
    DbName: string;
    IpAdress?: string = '127.0.0.1';
}

/**
 * A Render preset type.
 */
declare type Preset = string;

/**
 * A Render job.
 */
declare type RenderJob = {
    AudioCodec: string
    AudioSampleRate: number
    VideoFormat: string
    IsExportAudio: boolean
    ExportAlpha: boolean
    FormatHeight: number
    FrameRate: string
    VideoCodec: string
    FormatWidth: number
    MarkOut: number
    JobId: string
    MarkIn: number
    TargetDir: string
    IsExportVideo: boolean
    AudioBitDepth: number
    TimelineName: string
    OutputFilename: string
    PixelAspectRatio: number
    RenderMode: string
    PresetName: string
    RenderJobName: string
};

/**
 * Settings for rendering.
 */
declare type RenderSettings = {

    /**
     * (when set True, the settings MarkIn and MarkOut are ignored)
     */
    SelectAllFrames?: boolean;

    MarkIn?: number;
    MarkOut?: number;

    TargetDir?: string;
    CustomName?: string;

    /**
     * 0 - Prefix, 1 - Suffix.
     */
    UniqueFilenameStyle?: 0 | 1;

    ExportVideo?: boolean;
    ExportAudio?: boolean;

    FormatWidth?: number;
    FormatHeight?: number;

    /**
     * (examples: 23.976, 24)
     */
    FrameRate?: number;

    /**
     * (for SD resolution: “16_9” or “4_3”) (other resolutions: “square” or “cinemascope”)
     */
    PixelAspectRatio?: string

    /**
     * possible values for current codec (if applicable):  
     * * 0 (int) - will set quality to automatic  
     * * [1 -> MAX] (int) - will set input bit rate
     * * [“Least”, “Low”, “Medium”, “High”, “Best”] (String) - will set input quality level
     */
    VideoQuality?: 0 | 1 | Number.MAX_SAFE_INTEGER |"Least" | "Low" | "Medium" | "High" | "Best";

    /**
     * (example: “aac”)
     */
    AudioCodec?: string;

    AudioBitDepth?: number;
    AudioSampleRate?: number;

    /**
     * (example: “Same as Project”, “AstroDesign”)
     */
    ColorSpaceTag?: string;

    /**
     * (example: “Same as Project”, “ACEScct”)
     */
    GammaTag?: string;

    ExportAlpha?: boolean;

    /**
     *  (example: “Main10”). Can only be set for H.264 and H.265.
     */
    EncodingProfile?: string;

    /**
     * Can only be set for H.264
     */
    MultiPassEncode?: boolean;

    /**
     * 0 - Premultipled, 1 - Straight. Can only be set if “ExportAlpha” is true.
     */
    AlphaMode?: 0 | 1;

    /**
     * Only supported by QuickTime and MP4 formats.
     */
    NetworkOptimization?: boolean;
};

/**
 * A Render format.
 */
declare type RenderFormat = {
    Format: string;
    FileExtension: string;
};

/**
 * A Render codec.
 */
declare type RenderCodec = {
    CodecDescription: string;
    CodecName: string;
};

/**
 * The status of a render job.
 */
declare type RenderJobStatus = {
    CompletionPercentage: number
    JobStatus: 'Ready' | 'Rendering' | 'Cancelled' | 'Complete' | 'Failed',
    TimeTakenToRenderInMs?: number
    EstimatedTimeRemainingInMs?: number
    Error?: string
};

/**
 * Resolution type.
 */
declare type Resolution = {
    width: number;
    height: number;
};

/**
 * Clip Information
 */
declare type ClipInfo = {
    mediaPoolItem: MediaPoolItem;
    startFrame: number;
    endFrame: number;
    mediaType?: number = 1 | 2;
    
    //**Undocumented**//
    trackIndex?: number;
    recordFrame?: number;
}

/**
 * Timeline Import Options
 */
declare type TimelineImportOptions = {
    timelineName: string;
    importSourceClips: boolean;
    sourceClipsPath: string;
    sourceClipsFolders: Folder[];
    interlaceProcessing: boolean;
}

/**
 * Type for a marker.
 */
declare type Marker = {
    frameId: number;
    color: MarkerColor;
    name: string;
    note: string;
    duration: number;
    customData: string;
};

/**
 * CDL type.
 */
declare type CDL = {
    NodeIndex: string;
    Slope: string
    Offset: string;
    Power: string;
    Saturation: string;
}

/**
 * A Take.
 */
declare type Take = {
    startFrame: number;
    endFrame: number;
    mediaPoolItem: MediaPoolItem;
}

/**
 * Properties for a timeline item.
 */
declare type TimelineItemProperties = {
    Pan: number;
    Tilt: number;

    ZoomX: number;
    ZoomY: number;

    /**
     * If ZoomX and ZoomY are linked together.
     */
    ZoomGang: boolean;

    RotationAngle: number;

    AnchorPointX: number;
    AnchorPointY: number;

    Pitch: number;
    Yaw: number;

    FlipX: boolean;
    FlipY: boolean;

    CropLeft: number;
    CropRight: number;
    CropTop: number;
    CropBottom: number;
    CropSoftness: number;
    CropRetain: boolean;

    DynamicZoomEase: DynamicZoomEaseSetting;

    CompositeMode: CompositeModeSetting;

    Opacity: number;

    Distortion: number;

    RetimeProcess: RetimeProcessSetting;

    MotionEstimation: MotionEstimationSetting;

    Scaling: ScalingSetting;

    ResizeFilter: ResizeFilterSetting;
};

/**
 * Properties for a Project.
 * Most Properties are Readonly.
 */
declare type ProjectProperties = { 
    audioCaptureNumChannels: string,
    audioOutputHasTimecode: string,
    audioPlayoutNumChannels: string,
    colorAcesGamutCompressType: string,
    colorAcesIDT: string,
    colorAcesNodeLUTProcessingSpace: string,
    colorAcesODT: string,
    colorGalleryStillsLocation: string,
    colorGalleryStillsNamingCustomPattern: string,
    colorGalleryStillsNamingEnabled: string,
    colorGalleryStillsNamingPattern: string,
    colorGalleryStillsNamingWithStillNumber: string,
    colorKeyframeDynamicsEndProfile: string,
    colorKeyframeDynamicsStartProfile: string,
    colorLuminanceMixerDefaultZero: string,
    colorScienceMode: string,
    colorSpaceInput: string,
    colorSpaceInputGamma: string,
    colorSpaceOutput: string,
    colorSpaceOutputGamma: string,
    colorSpaceOutputGamutMapping: string,
    colorSpaceOutputGamutSaturationKnee: string,
    colorSpaceOutputGamutSaturationMax: string,
    colorSpaceOutputToneLuminanceMax: string,
    colorSpaceOutputToneMapping: string,
    colorSpaceTimeline: string,
    colorSpaceTimelineGamma: string,
    colorUseBGRPixelOrderForDPX: string, 
    colorUseContrastSCurve: string,
    colorUseLegacyLogGrades: string, 
    colorUseLocalVersionsAsDefault: string,
    colorUseStereoConvergenceForEffects: string,
    colorVersion10Name: string,
    colorVersion1Name: string,
    colorVersion2Name: string,
    colorVersion3Name: string,
    colorVersion4Name: string,
    colorVersion5Name: string,
    colorVersion6Name: string,
    colorVersion7Name: string,
    colorVersion8Name: string,
    colorVersion9Name: string,
    graphicsWhiteLevel: string, 
    hdr10PlusControlsOn: string,
    hdrDolbyControlsOn: string, 
    hdrDolbyMasterDisplay: string,
    hdrDolbyVersion: string, 
    hdrMasteringLuminanceMax: string, 
    hdrMasteringOn: string,
    imageDeinterlaceQuality: string,
    imageEnableFieldProcessing: string,
    imageMotionEstimationMode: string,
    imageMotionEstimationRange: string,
    imageResizeMode: string,
    imageResizingGamma: string,
    imageRetimeInterpolation: string,
    inputDRT: string,
    inputDRTSatRolloffLimit: string,
    inputDRTSatRolloffStart: string,
    isAutoColorManage: string, 
    limitAudioMeterAlignLevel: string, 
    limitAudioMeterDisplayMode: string,
    limitAudioMeterHighLevel: string, 
    limitAudioMeterLoudnessScale: string,
    limitAudioMeterLowLevel: string, 
    limitAudioMeterLUFS: string, 
    limitBroadcastSafeLevels: string,
    limitBroadcastSafeOn: string,
    limitSubtitleCaptionDurationSec: string,
    limitSubtitleCPL: string, 
    outputDRT: string,
    outputDRTSatRolloffLimit: string, 
    outputDRTSatRolloffStart: string, 
    perfAutoRenderCacheAfterTime: string,
    perfAutoRenderCacheComposite: string, 
    perfAutoRenderCacheEnable: string, 
    perfAutoRenderCacheFuEffect: string, 
    perfAutoRenderCacheTransition: string, 
    perfCacheClipsLocation: string,
    perfOptimisedCodec: string,
    perfOptimisedMediaOn: string,
    perfOptimizedResolutionRatio: string,
    perfProxyMediaMode: string, 
    perfProxyResolutionRatio: string,
    perfRenderCacheCodec: string,
    perfRenderCacheMode: string, 
    rcmPresetMode: string,
    separateColorSpaceAndGamma: string, 
    superScale: SuperScaleSetting,
    superScaleNoiseReduction: string,
    superScaleSharpness: string,
    timelineDropFrameTimecode: string,
    timelineFrameRate: number,
    timelineFrameRateMismatchBehavior: string,
    timelineInputResMismatchBehavior: string,
    timelineInputResMismatchCustomPreset: string,
    timelineInputResMismatchUseCustomPreset: string,
    timelineInterlaceProcessing: string,
    timelineOutputPixelAspectRatio: string,
    timelineOutputResMatchTimelineRes: string,
    timelineOutputResMismatchBehavior: string,
    timelineOutputResMismatchCustomPreset: string,
    timelineOutputResMismatchUseCustomPreset: string, 
    timelineOutputResolutionHeight: string,
    timelineOutputResolutionWidth: string, 
    timelinePixelAspectRatio: string,
    timelinePlaybackFrameRate: string, 
    timelineResolutionHeight: string, 
    timelineResolutionWidth: string, 
    timelineSaveThumbsInProject: string, 
    timelineWorkingLuminance: string,
    timelineWorkingLuminanceMode: string,
    useCATransform: string, 
    useColorSpaceAwareGradingTools: string,
    useInverseDRT: string, 
    videoCaptureCodec: string,
    videoCaptureFormat: string,
    videoCaptureIngestHandles: string, 
    videoCaptureLocation: string,
    videoCaptureMode: string,
    videoDataLevels: string,
    videoDataLevelsRetainSubblockAndSuperWhiteData: string 
    videoDeckAdd32Pulldown: string,
    videoDeckBitDepth: string,
    videoDeckFormat: string,
    videoDeckNonAutoEditFrames: string,
    videoDeckOutputSyncSource: string,
    videoDeckPrerollSec: string,
    videoDeckSDIConfiguration: string,
    videoDeckUse444SDI: string,
    videoDeckUseAudoEdit: string,
    videoDeckUseStereoSDI: string,
    videoMonitorBitDepth: string, 
    videoMonitorFormat: string,
    videoMonitorMatrixOverrideFor422SDI: string,
    videoMonitorScaling: string,
    videoMonitorSDIConfiguration: string,
    videoMonitorUse444SDI: string, 
    videoMonitorUseHDROverHDMI: string, 
    videoMonitorUseLevelA: string,
    videoMonitorUseMatrixOverrideFor422SDI: string,
    videoMonitorUseStereoSDI: string, 
    videoPlayoutAudioFramesOffset: string, 
    videoPlayoutBatchHeadDuration: string, 
    videoPlayoutBatchTailDuration: string,
    videoPlayoutLTCFramesOffset: string, 
    videoPlayoutMode: string,
    videoPlayoutShowLTC: string,
    videoPlayoutShowSourceTimecode: string, 
};

/**
 * Properties of a media pool item
 */
declare type MediaPoolItemProperties = {
    'Alpha mode': string
    'Audio Bit Depth': string
    'Audio Ch': string
    'Audio Codec': string
    'Audio Offset': string
    'Bit Depth': string
    'Camera #': string
    'Clip Color': ClipColor
    'Clip Name': string
    'Data Level': string
    'Date Added': string
    'Date Created': string
    'Date Modified': string
    'Drop frame': string
    'Enable Deinterlacing': string
    'End TC': string
    'Field Dominance': string
    'File Name': string
    'File Path': string
    'Good Take': string
    'H-FLIP': string
    'Input Color Space': string
    'Input LUT': string
    'Input Sizing Preset': string
    'Noise Reduction': string
    'Offline Reference': string
    'Proxy Media Path': string
    'Reel Name': string
    'Roll/Card': string
    'S3D Sync': string,
    'Sample Rate': string
    'Slate TC': string
    'Start KeyKode': string
    'Start TC': string
    'Super Scale': 0 | 1 | 2 | 3 | 4,
    'Synced Audio': string
    'V-FLIP': string
    'Video Codec': string
    Angle: string
    Comments: string
    Description: string
    Duration: string
    End: string
    Flags: FlagColor[]
    Format: string
    FPS: number,
    Frames: string
    IDT: string
    In: string
    Keyword: string
    Out: string
    PAR: string
    Proxy: string
    Resolution: string
    Scene: string
    Sharpness: string
    Shot: string
    Start: string
    Take: string
    Type: string
    Usage: string
};

/**
 * The main Resolve object.
 */
declare type Resolve = {

    /**
     * Returns the Fusion object. Starting point for Fusion scripts.
     * 
     * @example
     * ```ts
     * const fusion: Fusion = resolve.Fusion();
     * ```
    */
    Fusion(): Fusion;

    /**
     * Returns the media storage object to query and act on media locations.
     * 
     * @example
     * ```ts
     * const mediaStorage: MediaStorage = resolve.GetMediaStorage();
     * ```
    */
    GetMediaStorage(): MediaStorage;

    /**
     * Returns the project manager object for currently open database.
     * 
     * @example
     * ```ts
     * const projectManager: ProjectManager = resolve.GetProjectManager();
     * ```
    */
    GetProjectManager(): ProjectManager;

    /**
     * Switches to indicated page in DaVinci Resolve
     * @param pageName Name of the page to switch to.
     * 
     * @example
     * ```ts
     * resolve.OpenPage(ResolveEnums.Pages.Edit);
     * ```
    */
    OpenPage(pageName: ResolveEnums.Pages): boolean;

    /**
     * Returns the page currently displayed in the main window.
     * 
     * @example
     * ```ts
     * const currentPage: ResolveEnums.Pages = resolve.GetCurrentPage();
     * ```
    */
    GetCurrentPage(): ResolveEnums.Pages;

    /**
     * Returns product name.
     * 
     * @example
     * ```ts
     * const productName: string = resolve.GetProductName();
     * ```
    */
    GetProductName(): string;

    /**
     * Returns list of product version fields in [major, minor, patch, build, suffix] format.
     * 
     * @example
     * ```ts
     * const version: number[] = resolve.GetVersion();
     * ```
    */
    GetVersion(): number[];

    /**
     * Returns product version in “major.minor.patch[suffix].build” format.
     * 
     * @example
     * ```ts
     * const versionString: string = resolve.GetVersionString();
     * ```
    */
    GetVersionString(): string;

    /**
     * Loads UI layout from saved preset named ‘presetName’.
     * @param presetName Name of the preset to load.
     * 
     * @example
     * ```ts
     * resolve.LoadLayoutPreset('MyLayout');
     * ```
    */
    LoadLayoutPreset(presetName: string): boolean;

    /**
     * Overwrites preset named ‘presetName’ with current UI layout.
     * @param presetName Name of the preset to update.
     * 
     * @example
     * ```ts
     * resolve.UpdateLayotPreset('MyLayout');
     * ```
    */
    UpdateLayotPreset(presetName: string): boolean;

    /**
     * Exports preset named ‘presetName’ to path ‘presetFilePath’.
     * @param presetName Name of the preset to export.
     * 
     * @example
     * ```ts
     * resolve.ExportLayoutPreset('MyLayout', 'C:\\MyLayout\\');
     * ```
    */
    ExportLayoutPreset(presetName: string, presetFilePath: string): boolean;

    /**
     * Deletes preset named ‘presetName’.
     * @param presetName Name of the preset to delete.
     * 
     * @example
     * ```ts
     * resolve.DeleteLayoutPreset('MyLayout');
     * ```
    */
    DeleteLayoutPreset(presetName: string): boolean;

    /**
     * Saves current UI layout as a preset named ‘presetName’.
     * @param presetName Name of the preset to save.
     * 
     * @example
     * ```ts
     * resolve.SaveLayoutPreset('MyLayout');
     * ```
    */
    SaveLayoutPreset(presetName: string): boolean;

    /**
     * Imports preset from path ‘presetFilePath’. The optional argument ‘presetName’ specifies how the preset shall be named. If not specified, the preset is named based on the filename.
     * @param presetFilePath Path to the preset file.
     * @param presetName Name of the preset to import.
     * 
     * @example
     * ```ts
     * resolve.ImportLayoutPresets('C:\\MyLayout\\');
     * ```
    */
    ImportLayoutPresets(presetFilePath: string, presetName?: string): boolean;

    /**
     * Quits the Resolve App.
     * 
     * @example
     * ```ts
     * resolve.Quit();
     * ```
    */
    Quit(): void;

    /**
     * **Undocumented**
     */
    GetShowAllVideoFrames(): boolean;

    /**
     * **Undocumented**
     * 
     * @param enabled
     */
    SetShowAllVideoFrames(enabled: boolean): boolean;

    /**
     * **Undocumented**
     */
    GetSourceViewerMode(): boolean;

    /**
     * **Undocumented**
     * 
     * @param enabled 
     */
    SetSourceViewerMode(mode: string): boolean;
};

declare type ProjectManager = {

    /**
     * Archives project to provided file path with the configuration as provided by the optional arguments
     * 
     * @param projectName Name of the project to archive
     * @param filePath Path to the archive file
     * @param isArchiveSrcMedia Archive source media
     * @param isArchiveRenderCache Archive render cache
     * @param isArchiveProxyMedia Archive proxy media
     * 
     * @example
     * ```ts
     * projectManager.ArchiveProject('MyProject', 'C:\\MyProject\\MyProject.drp');
     * ```
     */
    ArchiveProject(projectName: string, filePath: string, isArchiveSrcMedia: boolean = true, isArchiveRenderCache: boolean = true, isArchiveProxyMedia: boolean = false): void;

    /**
     * Creates and returns a project if projectName (string) is unique, and None if it is not.
     * 
     * @param projectName Name of the project to create
     * 
     * @example
     * ```ts
     * const project: Project = projectManager.CreateProject('MyProject');
     */
    CreateProject(projectName: string): Project;
    
    /**
     * Delete project in the current folder if not currently loaded
     */
    DeleteProject(projectName: string): boolean;
    
    /**
     * Loads and returns the project with name = projectName (string) if there is a match found, and None if there is no matching Project.
     */
    LoadProject(projectName: string): Project;
    
    /**
     * Returns the currently loaded Resolve project.
     */
    GetCurrentProject(): Project;
    
    /**
     * Saves the currently loaded project with its own name. Returns True if successful.
     */
    SaveProject(): boolean;
    
    /**
     * Closes the specified project without saving.
     */
    CloseProject(project: string): boolean;

    /**
     * Creates a folder if folderName (string) is unique.
     */
    CreateFolder(folderName: string): boolean;
    
    /**
     * Deletes the specified folder if it exists. Returns True in case of success.
     */
    DeleteFolder(folderName: string): boolean;
    
    /**
     * Returns a list of project names in current folder.
     */
    GetProjectListInCurrentFolder(): string[];
    
    /**
     * Returns a list of folder names in current folder.
     */
    GetFolderListInCurrentFolder(): string[];
    
    /**
     * Opens root folder in database.
     */
    GotoRootFolder(): boolean;
    
    /**
     * Opens parent folder of current folder in database if current folder has parent.
     */
    GotoParentFolder(): boolean;
        
    /**
     * Returns the current folder name.
     */
    GetCurrentFolder(): string;
        
    /**
     * Opens folder under given name.
     */
    OpenFolder(folderName: string): boolean;
    
    /** 
     * Imports a project from the file path provided. Returns True if successful.
     */
    ImportProject(filePath: string, projectName: string | undefined = undefined): boolean;
        
    /**
     * Exports project to provided file path, including stills and LUTs if withStillsAndLUTs is True (enabled by default). Returns True in case of success.
     */
    ExportProject(projectName: string, filePath: string, withStillsAndLUTs: boolean = true): boolean;
        
    /**
     * Restores a project from the file path provided. Returns True if successful.
     */
    RestoreProject(filePath: string, projectName: string | undefined =  undefined): boolean;
    
    /**
     * Returns a dictionary (with keys ‘DbType’, ‘DbName’ and optional ‘IpAddress’) corresponding to the current database connection
     */
    GetCurrentDatabase(): dbInfo;
        
    /**
     * Returns a list of dictionary items (with keys ‘DbType’, ‘DbName’ and optional ‘IpAddress’) corresponding to all the databases added to Resolve
     */
    GetDatabaseList(): dbInfo[];
        
    /**
     * Switches current database connection to the database specified by the keys below, and closes any open project.  
    
        See dbInfo type for more information.
     */
    SetCurrentDatabase(dbInfo: dbInfo): boolean;
};

declare type Project = {

    /**
     * Returns the Media Pool object.
     */
    GetMediaPool(): MediaPool;
    
    /**
     * Returns the number of timelines currently present in the project.
     */
    GetTimelineCount(): number;
    
    /**
     * Returns timeline at the given index, 1 <= idx <= project.GetTimelineCount()
     */
    GetTimelineByIndex(idx: number): Timeline;
    
    /**
     * Returns the currently loaded timeline.
     */
    GetCurrentTimeline(): Timeline;
    
    /**
     * Sets given timeline as current timeline for the project. Returns True if successful.
     */
    SetCurrentTimeline(timeline: Timeline): boolean;

    /**
     * Returns the Gallery object.
     */
    GetGallery(): Gallery;

    /**
     * Returns project name.
     */
    GetName(): string;

    /**
     * Sets project name if given projectname (string) is unique.
     */
    SetName(projectName: string): boolean;

    /**
     * Returns a list of presets and their information.
     */
    GetPresetList(): Preset[];

    /**
     * Sets preset by given presetName (string) into project.
     */
    SetPreset(presetName: string): boolean;

    /**
     * Adds a render job based on current render settings to the render queue. Returns a unique job id (string) for the new render job.
     */
    AddRenderJob(): string;

    /**
     * Deletes render job for input job id (string).
     */
    DeleteRenderJob(jobId: string): boolean;

    /**
     * Deletes all render jobs in the queue.
     */
    DeleteAllRenderJobs(): boolean;

    /**
     * Returns a list of render jobs and their information.
     */
    GetRenderJobList(): RenderJob[];

    /**
     * Returns a list of render presets and their information.
     */
    GetRenderPresetList(): Preset[];

    /**
     * Starts rendering jobs indicated by the input job ids.
     */
    StartRendering(...jobIds: string[]): boolean;

    /**
     * Starts rendering jobs indicated by the input job ids.  
     * Note: The optional “isInteractiveMode”, when set, enables error feedback in the UI during rendering.
     */
    StartRendering(...jobIds: string[], isInteractiveMode: boolean = false): boolean;

    /**
     * Starts rendering all queued render jobs.  
     * Note: The optional “isInteractiveMode”, when set, enables error feedback in the UI during rendering.
     */
    StartRendering(isInteractiveMode: boolean = false): boolean;

    /**
     * Stops any current render processes.
     */
    StopRendering(): boolean;

    /**
     * Returns True if rendering is in progress.
     */
    IsRenderingInProgress(): boolean;

    /**
     * Sets a preset as current preset for rendering if presetName (string) exists.
     */
    LoadRenderPreset(presetName: string): boolean;

    /**
     * Creates new render preset by given name if presetName(string) is unique.
     */
    SaveAsNewRenderPreset(presetName: string): boolean;

    /**
     * Sets given settings for rendering. Settings is a dict, with support for the keys:
     */
    SetRenderSettings(settings: RenderSettings): boolean;

    /**
     * Returns a dict with job status and completion percentage of the job by given jobId (string).
     */
    GetRenderJobStatus(jobId: string): RenderJobStatus;

    /**
     * Returns value of project setting (indicated by settingName, string).
     */
    GetSetting(settingName: string): string;

    /**
     * Sets the project setting (indicated by settingName, string) to the value (settingValue, string).
     */
    SetSetting(settingName: string, settingValue: string): boolean;

    /**
     * Returns a dict (format -> file extension) of available render formats.
     */
    GetRenderFormats(): RenderFormat[];

    /**
     * Returns a dict (codec description -> codec name) of available codecs for given render format (string).
     */
    GetRenderCodecs(renderFormat: string): RenderCodec[];

    /**
     * Returns a dict with currently selected format ‘format’ and render codec ‘codec’.
     */
    GetCurrentRenderFormatAndCodec(): [RenderFormat, RenderCodec];

    /**
     * Sets given render format (string) and render codec (string) as options for rendering.
     */
    SetCurrentRenderFormatAndCodec(format: RenderFormat, codec: RenderCodec): boolean;

    /**
     * Returns the render mode: 0 - Individual clips, 1 - Single clip.
     */
    GetCurrentRenderMode(): number;

    /**
     * Sets the render mode. Specify renderMode = 0 for Individual clips, 1 for Single clip.
     */
    SetCurrentRenderMode(renderMode: number): boolean;

    /**
     * Returns list of resolutions applicable for the given render format (string) and render codec (string).  

    Returns full list of resolutions if no argument is provided. Each element in the list is a dictionary with 2 keys “Width” and “Height”.
     */
    GetRenderResolutions(format: RenderFormat, codec: RenderCodec): Resolution[];
    
    /**
     * Refreshes LUT List
     */
    RefreshLUTList(): boolean;

    /**
     * **Undocumented**
     */
    GetPlaybackSpeed(): number;

    /**
     * **Undocumented**
     * 
     * @param uniqueID 
     */
    GetTimelineFromUniqueID(uniqueID: string): Timeline;

};
declare type MediaStorage = {

    /**
     * Returns list of folder paths corresponding to mounted volumes displayed in Resolve’s Media Storage.
     */
    GetMountedVolumeList(): string[];
    
    /**
     * Returns list of folder paths in the given absolute folder path.
     */
    GetSubFolderList(folderPath: string): string[];
    
    /**
     * Returns true if folder is stale in collaboration mode, false otherwise
     */
    GetIsFolderStale(): boolean;
    
    /**
     * Returns list of media and file listings in the given absolute folder path. Note that media listings may be logically consolidated entries.
     */
    GetFileList(folderPath: string): string[];
    
    /**
     * Expands and displays given file/folder path in Resolve’s Media Storage.
     */
    RevealInStorage(path: string): boolean;
    
    /**
     * Adds specified file/folder paths from Media Storage into current Media Pool folder. Input is one or more file/folder paths. Returns a list of the MediaPoolItems created.
     */
    AddItemListToMediaPool(...items: string[]): MediaPoolItem[];
    
    /**
     * Adds specified file/folder paths from Media Storage into current Media Pool folder. Input is an array of file/folder paths. Returns a list of the MediaPoolItems created.
     */
    AddItemListToMediaPool(items: string[]): MediaPoolItem[];
    
    /**
     * Adds specified media files as mattes for the specified MediaPoolItem. StereoEye is an optional argument for specifying which eye to add the matte to for stereo clips (“left” or “right”). Returns True if successful.
     */
    AddClipMattesToMediaPool(MediaPoolItem: MediaPoolItem, paths: string[], steroEye: 'left' | 'right'): MediaPoolItem[];
    
    /**
     * Adds specified media files as timeline mattes in current media pool folder. Returns a list of created MediaPoolItems.
     */
    AddTimelineMattesToMediaPool(paths: string[]): MediaPoolItem[];
};

declare type MediaPool = {

    /**
     * Returns root Folder of Media Pool
     */
    GetRootFolder(): Folder;
    
    /**
     * Adds new subfolder under specified Folder object with the given name.
     */
    AddSubFolder(folder: Folder, name: string): Folder;
    
    /**
     * Updates the folders in collaboration mode
     */
    RefreshFolders(): void;
    
    /**
     * Adds new timeline with given name.
     */
    CreateEmptyTimeline(name: string): Timeline;
    
    /**
     * Appends specified MediaPoolItem objects in the current timeline. Returns the list of appended timelineItems.
     */
    AppendToTimeline(...clips: MediaPoolItem[]): TimelineItem[];
    
    /**
     * Appends specified MediaPoolItem objects in the current timeline. Returns the list of appended timelineItems.
     */
    AppendToTimeline(clips: MediaPoolItem[]): TimelineItem[];
    
    /**
     * Appends list of clipInfos specified as clipInfo
     * (Look at the clipInfo type for more information)
     * Returns the list of appended timelineItems.
     */
    AppendToTimeline(...clipInfo: ClipInfo): TimelineItem[];
    
    /**
     * Creates new timeline with specified name, and appends the specified MediaPoolItem objects.
     */
    CreateTimelineFromClips(name: string, ...clips: MediaPoolItem[]): Timeline;
    
    /**
     * Creates new timeline with specified name, and appends the specified MediaPoolItem objects.
     */
    CreateTimelineFromClips(name: string, clips: MediaPoolItem[]): Timeline;
    
    /**
     * Creates new timeline with specified name, appending the list of clipInfos specified as the clipInfo type.
     */
    CreateTimelineFromClips(name: string, clipInfo: ClipInfo[]): Timeline;
    
    /**
     * Creates timeline based on parameters within given file and optional importOptions type.
     * Check out the TimelineImportOptions type for more information.
     */
    ImportTimelineFromFile(filePath: string, importOptions?: TimelineImportOptions): Timeline;
    
    /**
     * Deletes specified timelines in the media pool.
     */
    DeleteTimelines(timelines: Timeline[]): boolean;
    
    /**
     * Returns currently selected Folder.
     */
    GetCurrentFolder(): Folder;
    
    /**
     * Sets current folder by given Folder.
     */
    SetCurrentFolder(Folder: Folder): boolean;
    
    /**
     * Deletes specified clips or timeline mattes in the media pool
     */
    DeleteClips(clips: MediaPoolItem[]): boolean;
    
    /**
     * Deletes specified subfolders in the media pool
     */
    DeleteFolders(folders: Folder[]): boolean;
    
    /**
     * Moves specified clips to target folder.
     */
    MoveClips(clips: MediaPoolItem[], targetFolder: Folder): boolean;
    
    /**
     * Moves specified folders to target folder.
     */
    MoveFolders(folders: Folder[], targetFolder: Folder): boolean;
    
    /**
     * Get mattes for specified MediaPoolItem, as a list of paths to the matte files.
     */
    GetClipMatteList(clip: MediaPoolItem): string[];
    
    /**
     * Get mattes in specified Folder, as list of MediaPoolItems.
     */
    GetTimelineMatteList(Folder: Folder): MediaPoolItem[];
    
    /**
     * Delete mattes based on their file paths, for specified MediaPoolItem. Returns True on success.
     */
    DeleteClipMattes(clip: MediaPoolItem, paths: string[]): boolean;
    
    /**
     * Update the folder location of specified media pool clips with the specified folder pat
     */
    RelinkClips(clips: MediaPoolItem[], folderPath: string): boolean;
    
    /**
     * Unlink specified media pool clips.
     */
    UnlinkClips(clips: MediaPoolItem[]): boolean;
    
    /**
     * Imports specified file/folder paths into current Media Pool folder. Input is an array of file/folder paths. Returns a list of the MediaPoolItems created.
     */
    ImportMedia(items: string[]): MediaPoolItem[];
    
    /**
     * Imports file path(s) into current Media Pool folder as specified in list of clipInfo type. Returns a list of the MediaPoolItems created. Each clipInfo gets imported as one MediaPoolItem unless ‘Show Individual Frames’ is turned on.
     */
    ImportMedia(clipInfo: ClipInfo[]): MediaPoolItem[];
    
    /**
     * Exports metadata of specified clips to ‘fileName’ in CSV format. If no clips are specified, all clips from media pool will be used.
     */
    ExportMetadata(fileName: string, clips: MediaPoolItem[]): boolean;
};

declare type Folder = {
    
    /**
     * Returns a list of clips (items) within the folder.
     */
    GetClipList(): MediaPoolItem[];
    
    /**
     * Returns the media folder name.
     */
    GetName(): string;
    
    /**
     * Returns a list of subfolders in the folder.
     */
    GetSubFolderList(): Folder[];
};

declare type MediaPoolItem = {
    
    /**
     * Returns the clip name.
     */
    GetName(): string;
    
    /**
     * Returns the metadata value for the key ‘metadataType’. If no argument is specified, a dict of all set metadata properties is returned.
     */
    GetMetadata(metadataType?: string): string | {[key: string]: string};
    
    /**
     * Sets the given metadata to metadataValue (string). Returns True if successful.
     */
    SetMetadata(metadataType: string, metadataValue: string): boolean;
    
    /**
     * Sets the item metadata with specified ‘metadata’ dict. Returns True if successful.
     */
    SetMetadata(metadata: {[key: string]: string}): boolean;
    
    /**
     * Returns the unique ID for the MediaPoolItem.
     */
    GetMediaId(): string;
    
    /**
     * Creates a new marker at given frameId position and with given marker information. ‘customData’ is optional and helps to attach user specific data to the marker.
     */
    AddMarker(frameId: number, color: MarkerColor, name: string, note: string, duration: number, customData?: string): boolean;
    
    /**
     * Returns a dict (frameId -> {information}) of all markers and dicts with their information.
     */
    GetMarkers(): {[key: number]: Marker};
    
    /**
     * Returns marker {information} for the first matching marker with specified customData.
     */
    GetMarkerByCustomData(customData: string): Marker;
    
    /**
     * Updates customData (string) for the marker at given frameId position.
     * CustomData is not exposed via UI and is useful for scripting developer to attach any user specific data to markers.
     */
    UpdateMarkerCustomData(frameId: number, customData: string): boolean
    
    /**
     * Returns customData string for the marker at given frameId position.
     */
    GetMarkerCustomData(frameId: number): string;
    
    /**
     * Delete all markers of the specified color from the media pool item. “All” as argument deletes all color markers.
     */
    DeleteMarkersByColor(color: MarkerColor): boolean;
    
    /**
     * Delete marker at frame number from the media pool item.
     */
    DeleteMarkerAtFrame(frameNum: number): boolean;
    
    /**
     * Delete first matching marker with specified customData.
     */
    DeleteMarkerByCustomData(customData: string): boolean;
    
    /**
     * Adds a flag with given color (string).
     */
    AddFlag(color: FlagColor): boolean;
    
    /**
     * Returns a list of flag colors assigned to the item.
     */
    GetFlagList(): FlagColor[];
    
    /**
     * Clears the flag of the given color if one exists. An “All” argument is supported and clears all flags.
     */
    ClearFlags(color: FlagColor | 'All'): boolean;
    
    /**
     * Returns the item color as a string.
     */
    GetClipColor(): ClipColor;
    
    /**
     * Sets the item color based on the colorName (string).
     */
    SetClipColor(color: ClipColor): boolean;
    
    /**
     * Clears the item color.
     */
    ClearClipColor(): boolean;
    
    /**
     * Returns the property value for the key ‘propertyName’.
     * 
     * If no argument is specified, a dict of all clip properties is returned. Check the section below for more information.
     */
    GetClipProperty(propertyName?: string): string | MediaPoolItemProperties;
    
    /**
     * Sets the given property to propertyValue (string).
     */
    SetClipProperty(propertyName: string, propertyValue: string): boolean;
    
    /**
     * Links proxy media located at path specified by arg ‘proxyMediaFilePath’ with the current clip. ‘proxyMediaFilePath’ should be absolute clip path.
     */
    LinkProxyMedia(proxyMediaFilePath: string): boolean
    
    /**
     * Unlinks any proxy media associated with clip.
     */
    UnlinkProxyMedia(): boolean
    
    /**
     * Replaces the underlying asset and metadata of MediaPoolItem with the specified absolute clip path.
     */
    ReplaceClip(filePath: string): boolean;
};

declare type Timeline = {
    
    /**
     * Returns the timeline name.
     */
    GetName(): string;
    
    /**
     * Sets the timeline name if timelineName (string) is unique. Returns True if successful.
     */
    SetName(timelineName: string): boolean;
    
    /**
     * Returns the frame number at the start of timeline.
     */
    GetStartFrame(): number;
    
    /**
     * Returns the frame number at the end of timeline.
     */
    GetEndFrame(): number;
    
    /**
     * Set the start timecode of the timeline to the string ‘timecode’. Returns true when the change is successful, false otherwise.
     */
    SetStartTimecode(timecode: string)
    
    /**
     * Returns the start timecode for the timeline.
     */
    GetStartTimecode(): string;
    
    /**
     * Returns the number of tracks for the given track type.
     */
    GetTrackCount(trackType: ResolveEnums.TrackType): number;
    
    /**
     * Returns a list of timeline items on that track (based on trackType and index). 1 <= index <= GetTrackCount(trackType).
     */
    GetItemListInTrack(trackType: ResolveEnums.TrackType, index: number): TimelineItem[];
    
    /**
     * Creates a new marker at given frameId position and with given marker information. ‘customData’ is optional and helps to attach user specific data to the marker.
     */
    AddMarker(frameId: number, color: MarkerColor, name: string, note: string, duration: number, customData?: string): boolean;
    
    /**
     * Returns a dict (frameId -> {information}) of all markers and dicts with their information.
     */
    GetMarkers(): {[key: number]: Marker};
    
    /**
     * Returns marker {information} for the first matching marker with specified customData.
     */
    GetMarkerByCustomData(customData: string): Marker;
    
    /**
     * Updates customData (string) for the marker at given frameId position. CustomData is not exposed via UI and is useful for scripting developer to attach any user specific data to markers.
     */
    UpdateMarkerCustomData(frameId: number, customData: string): boolean
    
    /**
     * Returns customData string for the marker at given frameId position.
     */
    GetMarkerCustomData(frameId: number): string;
    
    /**
     * Deletes all timeline markers of the specified color. An “All” argument is supported and deletes all timeline markers.
     */
    DeleteMarkersByColor(color: MarkerColor): boolean;
    
    /**
     * Deletes the timeline marker at the given frame number.
     */
    DeleteMarkerAtFrame(frameNum: number): boolean;
    
    /**
     * Delete first matching marker with specified customData.
     */
    DeleteMarkerByCustomData(customData: string): boolean;
    
    /**
     * Loads a still from given file path (string) and applies grade to Timeline Items with gradeMode.
     */
    ApplyGradeFromDRX(path: string, gradeMode: GradeMode, ...items: TimelineItem[]): boolean;
    
    /**
     * Loads a still from given file path (string) and applies grade to Timeline Items with gradeMode.
     */
    ApplyGradeFromDRX(path: string, gradeMode: GradeMode, items: TimelineItem[]): boolean;
    
    /**
     * Returns a string timecode representation for the current playhead position, while on Cut, Edit, Color, Fairlight and Deliver pages.
     */
    GetCurrentTimecode(): string;
    
    /**
     * Sets current playhead position from input timecode for Cut, Edit, Color, Fairlight and Deliver pages.
     */
    SetCurrentTimecode(timecode: string): boolean;
    
    /**
     * Returns the current video timeline item.
     */
    GetCurrentVideoItem(): TimelineItem;
    
    /**
     * Returns a dict (keys “width”, “height”, “format” and “data”) with data containing raw thumbnail image data (RGB 8-bit image data encoded in base64 format) for current media in the Color Page.
     */
    GetCurrentClipThumbnailImage(): {width: number, height: number, format: string, data: Uint8Array};
    
    /**
     * Returns the track name for track indicated by trackType and index. 1 <= trackIndex <= GetTrackCount(trackType).
     */
    GetTrackName(trackType: ResolveEnums.TrackType, trackIndex: number): string;
    
    /**
     * Sets the track name (string) for track indicated by trackType and index. 1 <= trackIndex <= GetTrackCount(trackType).
     */
    SetTrackName(trackType: ResolveEnums.TrackType, trackIndex: number, name: string): boolean;
    
    /**
     * Duplicates the timeline and returns the created timeline, with the (optional) timelineName, on success.
     */
    DuplicateTimeline(timelineName: string): Timeline;
    
    /**
     * Creates a compound clip of input timeline items with an optional clipInfo map: {“startTimecode” : “00:00:00:00”, “name” : “Compound Clip 1”}. It returns the created timeline item.
     */
    CreateCompoundClip(timelineItems: TimelineItem[], clipInfo: ClipInfo): TimelineItem;
    
    /**
     * Creates a Fusion clip of input timeline items. It returns the created timeline item.
     */
    CreateFusionClip(timelineItems: TimelineItem[]): TimelineItem;
    
    /**
     * Imports timeline items from an AAF file and optional importOptions dict into the timeline, with support for the keys:
     * * “autoImportSourceClipsIntoMediaPool”: Bool, specifies if source clips should be imported into media pool, True by default
     * * “ignoreFileExtensionsWhenMatching”: Bool, specifies if file extensions should be ignored when matching, False by default
     * * “linkToSourceCameraFiles”: Bool, specifies if link to source camera files should be enabled, False by default
     * * “useSizingInfo”: Bool, specifies if sizing information should be used, False by default
     * * “importMultiChannelAudioTracksAsLinkedGroups”: Bool, specifies if multi-channel audio tracks should be imported as linked groups, False by default
     * * “insertAdditionalTracks”: Bool, specifies if additional tracks should be inserted, True by default
     * * “insertWithOffset”: string, specifies insert with offset value in timecode format - defaults to “00:00:00:00”, applicable if “insertAdditionalTracks” is False
     * * “sourceClipsPath”: string, specifies a filesystem path to search for source clips if the media is inaccessible in their original path and if “ignoreFileExtensionsWhenMatching” is True
     * * “sourceClipsFolders”: string, list of Media Pool folder objects to search for source clips if the media is not present in current folder
     */
    ImportIntoTimeline(filePath: string, importOptions: {[key: string]: string}): boolean; // maybe add type on importOptions
    
    /**
     * Exports timeline to ‘fileName’ as per input exportType & exportSubtype format.
     */
    Export(fileName: string, exportType: TimelineExportType, exportSubtype: TimelineExportSubType): boolean;
    
    /**
     * Returns value of timeline setting (indicated by settingName : string).
     */
    GetSetting(settingName?: string): string;
    
    /**
     * Sets timeline setting (indicated by settingName : string) to the value (settingValue : string).
     */
    SetSetting(settingName: string, settingValue: string): boolean;
    
    /**
     * Inserts a generator (indicated by generatorName : TimelineGenerator) into the timeline.
     */
    InsertGeneratorIntoTimeline(generatorName: TimelineGenerator): TimelineItem;
    
    /**
     * Inserts a Fusion generator (indicated by generatorName : FusionGenerator) into the timeline.
     */
    InsertFusionGeneratorIntoTimeline(generatorName: FusionGenerator): TimelineItem;
    
    /**
     * Inserts a Fusion composition into the timeline.
     */
    InsertFusionCompositionIntoTimeline(): TimelineItem;
    
    /**
     * Inserts an OFX generator (indicated by generatorName : string) into the timeline.
     */
    InsertOFXGeneratorIntoTimeline(generatorName: string): TimelineItem;
    
    /**
     * Inserts a title (indicated by titleName : TitleNames) into the timeline.
     */
    InsertTitleIntoTimeline(titleName: TitleNames): TimelineItem;
    
    /**
     * Inserts a Fusion title (indicated by titleName : string) into the timeline.
     */
    InsertFusionTitleIntoTimeline(titleName: string): TimelineItem;
    
    /**
     * Grabs still from the current video clip. Returns a GalleryStill object.
     */
    GrabStill(): GalleryStill;
    
    /**
     * Grabs stills from all the clips of the timeline at ‘stillFrameSource’ (1 - First frame, 2 - Middle frame). Returns the list of GalleryStill objects.
     */
    GrabAllStills(stillFrameSource: 1 | 2): GalleryStill[];

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param audioChannelSubType 
     */
    AddTrack(trackType: ResolveEnums.TrackType, audioChannelSubType: string): boolean;

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param trackIndex 
     */
    DeleteTrack(trackType: ResolveEnums.TrackType, trackIndex: number): boolean;

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param trackIndex 
     * @param enabled 
     */
    SetTrackEnable(trackType: ResolveEnums.TrackType, trackIndex: number, enabled: boolean): boolean;

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param trackIndex 
     */
    GetIsTrackEnabled(trackType: ResolveEnums.TrackType, trackIndex: number): boolean;

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param trackIndex 
     * @param locked 
     */
    SetTrackLock(trackType: ResolveEnums.TrackType, trackIndex: number, locked: boolean): boolean;

    /**
     * **Undocumented**
     * 
     * @param trackType 
     * @param trackIndex 
     */
    GetIsTrackLocked(trackType: ResolveEnums.TrackType, trackIndex: number): boolean;

    /**
     * **Undocumented**
     * 
     * @param items 
     * @param linked 
     */
    SetClipsLinked(items: [], linked: boolean): boolean;

    /**
     * **Undocumented**
     * 
     * @param items 
     */
    DeleteClips(items: []): boolean;
};

declare type TimelineItem = {
    
    /**
     * Returns the item name.
     */
    GetName(): string;
    
    /**
     * Returns the item duration.
     */
    GetDuration(): number;
    
    /**
     * Returns the end frame position on the timeline.
     */
    GetEnd(): number;
    
    /**
     * Returns number of Fusion compositions associated with the timeline item.
     */
    GetFusionCompCount(): number;
    
    /**
     * Returns the Fusion composition object based on given index. 1 <= compIndex <= timelineItem.GetFusionCompCount()
     */
    GetFusionCompByIndex(compIndex: number): FusionComp;
    
    /**
     * Returns a list of Fusion composition names associated with the timeline item.
     */
    GetFusionCompNameList(): string[];
    
    /**
     * Returns the Fusion composition object based on given name.
     */
    GetFusionCompByName(compName: string): FusionComp;
    
    /**
     * Returns the maximum extension by frame for clip from left side.
     */
    GetLeftOffset(): number;
    
    /**
     * Returns the maximum extension by frame for clip from right side.
     */
    GetRightOffset(): number;
    
    /**
     * Returns the start frame position on the timeline.
     */
    GetStart(): number;
    
    /**
     * Sets the value of property “propertyKey” to value “propertyValue”
     */
    SetProperty(propertyKey: string, propertyValue: string): boolean;
    
    /**
     * returns the value of the specified key if no key is specified, the method returns TimelineItemProperties
     */
    GetProperty(propertyKey?: string): number | TimelineItemProperties
    
    /**
     * Creates a new marker at given frameId position and with given marker information. ‘customData’ is optional and helps to attach user specific data to the marker.
     */
    AddMarker(frameId: number, color: MarkerColor, name: string, note: string, duration: number, customData?: string): boolean;
    
    /**
     * Returns a dict (frameId -> {information}) of all markers and dicts with their information.
     */
    GetMarkers(): {[key: number]: Marker};
    
    /**
     * Returns marker {information} for the first matching marker with specified customData.
     */
    GetMarkerByCustomData(customData: string): Marker;
    
    /**
     * Updates customData (string) for the marker at given frameId position. CustomData is not exposed via UI and is useful for scripting developer to attach any user specific data to markers.
     */
    UpdateMarkerCustomData(frameId: number, customData: string): boolean
    
    /**
     * Returns customData string for the marker at given frameId position.
     */
    GetMarkerCustomData(frameId: number): string;
    
    /**
     * Delete all markers of the specified color from the timeline item. “All” as argument deletes all color markers.
     */
    DeleteMarkersByColor(color: MarkerColor): boolean;
    
    /**
     * Delete marker at frame number from the timeline item.
     */
    DeleteMarkerAtFrame(frameNum: number): boolean;
    
    /**
     * Delete first matching marker with specified customData.
     */
    DeleteMarkerByCustomData(customData: string): boolean;
    
    /**
     * Adds a flag with given color (string).
     */
    AddFlag(color: FlagColor): boolean;
    
    /**
     * Returns a list of flag colors assigned to the item.
     */
    GetFlagList(): FlagColor[];
    
    /**
     * Clear flags of the specified color. An “All” argument is supported to clear all flags.
     */
    ClearFlags(color: FlagColor): boolean;
    
    /**
     * Returns the item color as a string.
     */
    GetClipColor(): ClipColor;
    
    /**
     * Sets the item color based on the colorName (string).
     */
    SetClipColor(color: ClipColor): boolean;
    
    /**
     * Clears the item color.
     */
    ClearClipColor(): boolean;
    
    /**
     * Adds a new Fusion composition associated with the timeline item.
     */
    AddFusionComp(): FusionComp;
    
    /**
     * Imports a Fusion composition from given file path by creating and adding a new composition for the item.
     */
    ImportFusionComp(path: string): FusionComp;
    
    /**
     * Exports the Fusion composition based on given index to the path provided.
     */
    ExportFusionComp(path: string, compIndex: number): boolean;
    
    /**
     * Deletes the named Fusion composition.
     */
    DeleteFusionCompByName(compName: string): boolean;
    
    /**
     * Loads the named Fusion composition as the active composition.
     */
    LoadFusionCompByName(compName: string): boolean;
    
    /**
     * Renames the Fusion composition identified by oldName.
     */
    RenameFusionCompByName(oldName: string, newName: string): boolean;
    
    /**
     * Adds a new color version for a video clipbased on versionType (TimelineItemVersionType).
     */
    AddVersion(versionName: string, versionType: TimelineItemVersionType): boolean;
    
    /**
     * Returns the current version of the video clip. The returned value will have the keys versionName and versionType(0 - local, 1 - remote).
     */
    GetCurrentVersion(): {[key: string]: string};
    
    /**
     * Deletes a color version by name and versionType (TimelineItemVersionType).
     */
    DeleteVersionByName(versionName: string, versionType: TimelineItemVersionType): boolean;
    
    /**
     * Loads a named color version as the active version. versionType: TimelineItemVersionType.
     */
    LoadVersionByName(versionName: string, versionType: TimelineItemVersionType): boolean;
    
    /**
     * Renames the color version identified by oldName and versionType (TimelineItemVersionType).
     */
    RenameVersionByName(oldName: string, newName: string, versionType: TimelineItemVersionType): boolean;
    
    /**
     * Returns a list of all color versions for the given versionType (TimelineItemVersionType).
     */
    GetVersionNameList(versionType: TimelineItemVersionType): string[];
    
    /**
     * Returns the media pool item corresponding to the timeline item if one exists.
     */
    GetMediaPoolItem(): MediaPoolItem;
    
    /**
     * Returns a dict (offset -> value) of keyframe offsets and respective convergence values.
     */
    GetStereoConvergenceValues(): {[key: number]: number};
    
    /**
     * For the LEFT eye -> returns a dict (offset -> dict) of keyframe offsets and respective floating window params. Value at particular offset includes the left, right, top and bottom floating window values.
     */
    GetStereoLeftFloatingWindowParams(): {[key: number]: number};
    
    /**
     * For the RIGHT eye -> returns a dict (offset -> dict) of keyframe offsets and respective floating window params. Value at particular offset includes the left, right, top and bottom floating window values.
     */
    GetStereoRightFloatingWindowParams(): {[key: number]: number};
    
    /**
     * Sets LUT on the node mapping the node index provided, 1 <= nodeIndex <= total number of nodes. The lutPath can be an absolute path, or a relative path (based off custom LUT paths or the master LUT path). The operation is successful for valid lut paths that Resolve has already discovered (see Project.RefreshLUTList).
     */
    SetLUT(nodeIndex: number, lutPath: string): boolean;
    
    /**
     * Keys of map are: (see CDL type), where 1 <= NodeIndex <= total number of nodes.
     */
    SetCDL(map: CDL): boolean;
    
    /**
     * Adds mediaPoolItem as a new take. Initializes a take selector for the timeline item if needed. By default, the full clip extents is added. startFrame (int) and endFrame (int) are optional arguments used to specify the extents.
     */
    AddTake(mediaPoolItem: MediaPoolItem, startFrame: number, endFrame: number): boolean;
    
    /**
     * Returns the index of the currently selected take, or 0 if the clip is not a take selector.
     */
    GetSelectedTakeIndex(): number;
    
    /**
     * Returns the number of takes in take selector, or 0 if the clip is not a take selector.
     */
    GetTakesCount(): number;
    
    /**
     * Returns a dict (keys “startFrame”, “endFrame” and “mediaPoolItem”) with take info for specified index.
     */
    GetTakeByIndex(idx: number): Take;
    
    /**
     * Deletes a take by index, 1 <= idx <= number of takes.
     */
    DeleteTakeByIndex(idx: number): boolean;
    
    /**
     * Selects a take by index, 1 <= idx <= number of takes.
     */
    SelectTakeByIndex(idx: number): boolean;
    
    /**
     * Finalizes take selection.
     */
    FinalizeTake(): boolean;
    
    /**
     * Copies the current grade to all the items in tgtTimelineItems list. Returns True on success and False if any error occured.
     */
    CopyGrades(...tgtTimelineItems: TimelineItem[]): boolean;
    
    /**
     * Updates sidecar file for BRAW clips or RMD file for R3D clips.
     */
    UpdateSidecar(): boolean;

    /**
     * Applies ARRI CDL and LUT. Returns True if successful, False otherwise.
     */
    ApplyArriCdlLut(): boolean;

    /**
     * Sets clip enabled based on argument.
     * 
     * @param enabled the enabled status
     */
    SetClipEnabled(enabled: boolean): boolean;

    /**
     * Gets clip enabled status.
     */
    GetClipEnabled(): boolean;

    /**
     * Returns the label of the node at nodeIndex.
     * 
     * @param nodeIndex the node index
     */
    GetNodeLabel(nodeIndex: number): string

    /**
     * Loads user defined data burn in preset for clip when supplied presetName (string). Returns true if successful.
     * 
     * @param presetName the preset name
     */
    LoadBurnInPreset(presetName: string): boolean;

    /**
     * **Undocumented**
     * 
     * @param nodeIndex 
     * @param locked 
     */
    SetNodeLocked(nodeIndex: number, locked: boolean): boolean;

    /**
     * **Undocumented**
     */
    ResetCurrentVersion(): boolean;

    /**
     * **Undocumented**
     * 
     * @param nodeIndex 
     */
    ResetNode(nodeIndex: number): boolean;

    /**
     * **Undocumented**
     * 
     * @param nodeIndex 
     */
    SetNodeActive(nodeIndex: number): boolean;
};

declare type Gallery = {
    
    /**
     * Returns the name of the GalleryStillAlbum object ‘galleryStillAlbum’.
     */
    GetAlbumName(galleryStillAlbum: GalleryStillAlbum): string;
    
    /**
     * Sets the name of the GalleryStillAlbum object ‘galleryStillAlbum’ to ‘albumName’.
     */
    SetAlbumName(galleryStillAlbum: GalleryStillAlbum, albumName: string): boolean;
    
    /**
     * Returns current album as a GalleryStillAlbum object.
     */
    GetCurrentStillAlbum(): GalleryStillAlbum;
    
    /**
     * Sets current album to GalleryStillAlbum object ‘galleryStillAlbum’.
     */
    SetCurrentStillAlbum(galleryStillAlbum: GalleryStillAlbum): boolean;
    
    /**
     * Returns the gallery albums as a list of GalleryStillAlbum objects.
     */
    GetGalleryStillAlbums(): GalleryStillAlbum[];
};

declare type GalleryStillAlbum = {
    
    /**
     * Returns the list of GalleryStill objects in the album.
     */
    GetStills(): GalleryStill[];
    
    /**
     * Returns the label of the galleryStill.
     */
    GetLabel(galleryStill: GalleryStill): string;
    
    /**
     * Sets the new ‘label’ to GalleryStill object ‘galleryStill’.
     */
    SetLabel(galleryStill: GalleryStill, label: string): boolean;
    
    /**
     * Exports list of GalleryStill objects ‘[galleryStill]’ to directory ‘folderPath’, with filename prefix ‘filePrefix’, using file format ‘format’ (supported formats: see StillExportFormat type).
     */
    ExportStills(galleryStill: GalleryStill[], folderPath: string, filePrefix: string, format: StillExportFormat): boolean;
    
    /**
     * Deletes specified list of GalleryStill objects ‘[galleryStill]’.
     */
    DeleteStills(galleryStill: GalleryStill[]): boolean;
};

declare type GalleryStill = {};
declare type FusionComp = {};
