import Q from 'bluebird'
import xhr from 'xhr-request'

const Xhr = Q.promisify(xhr)
export default () => {
  return Xhr(`${process.env.ASSETS_DIR}deux-tube-presets.json?z=${Math.random()}`, {json: true})
}
