
const clientMap = new Map()
let clientID = 0

const realtime = (request, response) => {
  response.setHeader('Content-Type', 'text/event-stream')

  clientMap.set(clientID, response)

  request.on('close', () => {
    clientMap.delete(clientID)
  })

  const message = JSON.stringify({
    clientID,
    status: true,
    type: 'connection'
  })

  response.write('data:' + message + '\n\n')

  ++clientID
}

module.exports = { clientMap, realtime }
