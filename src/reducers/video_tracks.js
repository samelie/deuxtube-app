import { Record } from 'immutable';
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  MAX_RESOLUTION,
  VERBOSE,
} from '../constants/config';
/**
 * Record is like a class, but immutable and with default values.
 * https://facebook.github.io/immutable-js/docs/#/Record
 */
/*const InitialState = Record({
  media: Record({
    audio: Record({

    })
  })
});*/

const InitialState = Record({
  tracks: [{
    id: 'videoOne',
    noAutoStart: false,
    videoWidth: VIDEO_WIDTH,
    videoHeight: VIDEO_HEIGHT,
    verbose: VERBOSE,
    noVideoCanvas: true,
    elAttributes: {
      muted: true
    },
    extensions: ['loop', 'musicVideo'],
    //extensions: ['shuffle'],
    video: true,
    quality: {
      resolution: MAX_RESOLUTION,
      chooseBest: false,
    },
    playlists: [
      'PLuTh1a1eg5vZ1PnDQIiolbphrhaX07hxR',
      //'PLFFC0DE5C257B32AF',
      //'PLONlV9FPbFJXohQ4BavJgHrtrTJKuSct4',
      //'PLRQ2jIXShfkZcTp4rsP8uJotv6fOZas_v',
      //'PLuTh1a1eg5vbCa-G0APvdzFqFosBpgmqi',
      //'PLS_gQd8UB-hIynOqgxmApPU6nCRjIBd2y',
      //'PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV',
      //'PLqi-HJej8buehtiukZnuRoL9yiRJfEBRQ'
    ],
    forcePlaylistUpdate: true
  }, {
    id: 'videoTwo',
    noAutoStart: false,
    videoWidth: VIDEO_WIDTH,
    videoHeight: VIDEO_HEIGHT,
    verbose: VERBOSE,
    noVideoCanvas: true,
    elAttributes: {
      muted: true
    },
    extensions: ['loop'],
    //extensions: ['shuffle'],
    video: true,
    quality: {
      resolution: MAX_RESOLUTION,
      chooseBest: false,
    },
    playlists: [
      'PLZRcgvIPIUuXiXOSVc3QU-Qi96w_63Pz4',
      //'PLZRcgvIPIUuVGLl0qf6-NXxIk2L4GdxaO'
      //'PLRQ2jIXShfkZcTp4rsP8uJotv6fOZas_v',
      //'PLZRcgvIPIUuW22caHjgZZAvTnH3QhvPNY'
      //'PLZRcgvIPIUuXpCwC7vNlO05wR8wsBakNO'
      //'PLZRcgvIPIUuVGLl0qf6-NXxIk2L4GdxaO',
      //'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
      //'PLqi-HJej8bufOfvfQWK6qJRhagFEJPeGk'
      //'PLBm5UHsvUTFphuF0ClFFqE7M_G0iPu4FT',
      //'PLuTh1a1eg5vY3PeMoaPs_X_0HqKgsOnDO',
      //'PLL-b-neHTAtMy8gpvq3Ld94id0Xl5KI1j',
      //'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
      //'PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV'
    ],
    forcePlaylistUpdate: true

  }]
});

const initialState = new InitialState;

/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function videoTracks(state = initialState, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
