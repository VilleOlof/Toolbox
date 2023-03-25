export namespace ResolveEnums {

    /**
     * All pages.
     * @enum {string}
     */
    export enum Pages {
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
    export enum TrackType {
        Audio = "audio",
        Video = "video",
        Subtitle = "subtitle"
    }

    /**
     * All timeline generators.
     * @enum {string}
     */
    export enum TimelineGenerator {
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
    export enum FusionGenerator {
        __Contours = 'Contours',
        __Noise_Gradient = 'Noise Gradient',
        __Paper = 'Paper',
        __Texture_Background = 'Texture Background',
    }
    
    /**
     * All title names.
     * @enum {string}
     */
    export enum TitleNames {
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
    export enum TimelineItemVersionType {
        Local = 0,
        Remote = 1
    }

    /**
     * All grade modes.
     * @enum {number}
     */
    export enum GradeMode {
        'No keyframes' = 0,
        'Source Timecode aligned' = 1,
        'Start Frames aligned' = 2
    }
    
    /**
     * All still export formats.
     * @enum {string}
     */
    export enum StillExportFormat {
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
    export enum ClipColor {
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
    export enum MarkerColor {
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
    export enum FlagColor {
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
    export enum DynamicZoomEaseSetting {
        DYNAMIC_ZOOM_EASE_LINEAR = 0,
        DYNAMIC_ZOOM_EASE_IN,
        DYNAMIC_ZOOM_EASE_OUT,
        DYNAMIC_ZOOM_EASE_IN_AND_OUT,
    };
    
    /**
     * All Composite Mode Settings.
     * @enum {number}
     */
    export enum CompositeModeSetting {
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
    export enum RetimeProcessSetting {
        RETIME_USE_PROJECT = 0,
        RETIME_NEAREST,
        RETIME_FRAME_BLEND,
        RETIME_OPTICAL_FLOW,
    };
    
    /**
     * All Motion Estimation Settings.
     * @enum {number}
     */
    export enum MotionEstimationSetting {
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
    export enum ScalingSetting {
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
    export enum ResizeFilterSetting {
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
    export enum TimelineExportType {
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
    export enum TimelineExportSubType {
        EXPORT_NONE,
        EXPORT_AAF_NEW,
        EXPORT_AAF_EXISTING,
        EXPORT_CDL,
        EXPORT_SDL,
        EXPORT_MISSING_CLIPS
    }
}