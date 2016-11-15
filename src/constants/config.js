// TODO: define logic behind difference between:
// - assets that loaded and
// - assets that are bundled // eg: `require()`
// bundled path doesn't change whereas loaded assets path might

export const REMOTE_ASSETS_DIR = process.env.REMOTE_ASSETS_DIR+'assets/'
export const ASSETS_DIR = process.env.ASSETS_DIR+'assets/'
export const JSON_DIR = `${ASSETS_DIR}json/`;
export const AUDIO_DIR = `${REMOTE_ASSETS_DIR}audio/`;
export const IMAGE_DIR = `${REMOTE_ASSETS_DIR}image/`;
export const SVG_DIR = `${REMOTE_ASSETS_DIR}svg/`;

//TOUR
export const FILTER_ONLY_MP3 = true
export const TIME_ON_LOCATION_COVER = 10000

//deux-tube
export const PLAYBAR_SEEK_DISTANCE = 0.05
export const PLAYBAR_SEEK_DISTANCE_LOOP = 0.01
export const VIDEO_WIDTH = 640
export const VIDEO_HEIGHT = 360
export const VERBOSE = false
export const MAX_RESOLUTION = '240p'
export const RECORDING_FRAME_FMT = 'image/jpeg'
export const RECORDING_FRAME_Q = 0.8
export const RECORDING_FRAME_EXT = '.webp'

export const AUDIO_CHUNKS_TO_LOAD = 3


