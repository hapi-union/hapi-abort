const pkg = require('./package.json')
const convertJoiErrors = (details) => {
  const maps = {}
  const errors = []
  details.forEach(item => {
    const { message, path = [] } = item
    const field = path[0]
    if (!maps[field]) {
      maps[field] = true
      errors.push({
        field: field,
        message
      })
    }
  })
  return errors
}
exports.plugin = {
  pkg,
  register: (server, options = {}) => {
    const { assign = 'abort', convert = (request, h) => h.continue } = options
    class Abort extends Error {
      constructor (data = {}) {
        super()
        this.data = data
        this.isAbort = true
      }
    }
    if (assign) {
      server.ext('onPreAuth', (request, h) => {
        request[assign] = (data) => {
          return new Abort(data)
        }
        return h.continue
      })
    }
    server.ext('onPreResponse', (request, h) => {
      return convert(request, h, { convertJoiErrors })
    })
    server.expose('Abort', Abort)
  }
}
