
const crypto = require('crypto')

const clientMap = new Map()

const realtime = (request, response) => {
  const clientID = crypto.randomBytes(6).toString('hex')

  response.setHeader('Content-Type', 'text/event-stream')

  clientMap.set(clientID, response)

  // update clientList on each connectoin
  const clientMessage = JSON.stringify({
    client: {
      clientID
    },
    status: true,
    type: 'client'
  })

  for (let [key] of clientMap) {
    clientMap.get(key).write('data:' + clientMessage + '\n\n')
  }

  const deleteClient = () => {
    clientMap.delete(clientID)
  }

  request.on('aborted', deleteClient)
  // request.on('close', deleteClient)

  const connectMessage = JSON.stringify({
    clientID,
    status: true,
    type: 'connect'
  })

  response.write('data:' + connectMessage + '\n\n')

  // end the connection in 30 minutes
  setTimeout(async () => {
    const message = JSON.stringify({
      clientID,
      status: true,
      type: 'timeout'
    })

    await response.write('data:' + message + '\n\n')

    response.end()
  }, 1800000)
}

module.exports = { clientMap, realtime }
