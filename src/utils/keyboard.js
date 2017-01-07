import { NUMBERS } from './keys';
const keyboard = (() => {

  function selectedVideoTrack(selectionMap, index) {
    let selectedVideoTracks = NUMBERS.filter((num, numIndex) => {
      let _keyState = selectionMap[num]
      if (index === numIndex && _keyState) {
        return true
      }
      return false
    })
    return !!selectedVideoTracks.length
  }

  return {
    selectedVideoTrack:selectedVideoTrack
  };
})();

export default keyboard
