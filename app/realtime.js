
const crypto = require('crypto')

//
//
//

const clientMap = new Map()
const commentList = [
  {
    message: 'You\'re now connected.',
    name: 'server'
  }
]

//
//
//

const appendComment = data => {
  commentList.push(data.comment)
}

//
//
//

const getClientList = () => {
  const clientList = []

  for (let [key, value] of clientMap) {
    clientList.push({ id: key, name: value.name })
  }

  const clientListMessage = JSON.stringify({
    clientList,
    status: true,
    type: 'clientList'
  })

  for (let [key] of clientMap) {
    clientMap.get(key).response.write('data:' + clientListMessage + '\n\n')
  }
}

//
//
//

const realtime = (request, response) => {
  //
  //
  //

  const clientID = crypto.randomBytes(6).toString('hex')

  //
  //
  //

  response.setHeader('Content-Type', 'text/event-stream')

  //
  // store the connection
  //

  clientMap.set(clientID, { response })

  //
  // send clientID
  //

  const connectMessage = JSON.stringify({
    clientID,
    status: true,
    type: 'connect'
  })

  response.write('data:' + connectMessage + '\n\n')

  //
  // send initial clientList
  //

  // const clientList = []
  //
  // for (let [key] of clientMap) {
  //   clientList.push({ id: key })
  // }
  //
  // const clientListMessage = JSON.stringify({
  //   clientList,
  //   status: true,
  //   type: 'clientList'
  // })
  //
  // response.write('data:' + clientListMessage + '\n\n')

  //
  // send initial commentList
  //

  const commentListMessage = JSON.stringify({
    commentList,
    status: true,
    type: 'commentList'
  })

  response.write('data:' + commentListMessage + '\n\n')

  //
  // send clientList when a user joins
  //

  getClientList()

  //
  //
  //

  request.on('aborted', () => {
    clientMap.delete(clientID)
  })

  request.on('close', () => {
    getClientList()
  })

  // console.log(process.memoryUsage())

  //
  // end the connection in 30 minutes
  //

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

module.exports = { appendComment, clientMap, getClientList, realtime }
