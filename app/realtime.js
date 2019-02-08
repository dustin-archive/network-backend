
const crypto = require('crypto')

const clientMap = new Map()
const commentList = [
  {
    clientID: null,
    comment: 'You\'re now connected.',
    name: 'server'
  }
]

const appendCommentList = data => {
  commentList.push(...data.commentList)
}

const realtime = (request, response) => {
  const clientID = crypto.randomBytes(6).toString('hex')

  response.setHeader('Content-Type', 'text/event-stream')

  //
  // store the connection
  //

  clientMap.set(clientID, response)

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

  const clientList = []

  for (let [key] of clientMap) {
    clientList.push({ id: key })
  }

  const clientListMessage = JSON.stringify({
    clientList,
    status: true,
    type: 'clientList'
  })

  response.write('data:' + clientListMessage + '\n\n')

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
  //
  //

  const deleteClient = () => {
    clientMap.delete(clientID)
  }

  request.on('aborted', deleteClient)
  // request.on('close', deleteClient)

  // console.log(process.memoryUsage())

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

module.exports = { clientMap, realtime, appendCommentList }
