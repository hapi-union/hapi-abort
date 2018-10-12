const pkg = require('./package.json')
exports.plugin = {
  pkg,
  register: (server, options = {}) => {
    // const defaultConvert = (request, h) => {
    //   const { response } = request

    // }
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
      return convert(request, h)
    })
    server.expose('Abort', Abort)
  }
}
