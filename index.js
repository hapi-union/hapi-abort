const pkg = require('./package.json')
exports.plugin = {
  pkg,
  register: (server, options = {}) => {
    const { assign = 'abort', flag = 'abortFlag' } = options
    class Abort extends Error {
      constructor (data = {}) {
        super()
        this.data = data
        this[flag] = true
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
      const { response } = request
      if (response.isBoom && response[flag]) {
        return request.response.data
      }
      return h.continue
    })
    server.expose('Abort', Abort)
  }
}
