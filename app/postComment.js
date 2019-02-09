
const { appendComment, clientMap, getClientList } = require('./realtime')

const postComment = data => {
  const { clientID, comment } = data

  appendComment({ comment })

  //
  // update name from the latest comment
  //

  const { name, response } = clientMap.get(clientID)

  if (name !== comment.name) {
    clientMap.set(clientID, { name: comment.name, response })

    getClientList()
  }

  //
  // send the comment to all clients
  //

  const message = JSON.stringify({
    comment,
    status: true,
    type: 'comment'
  })

  for (let [key] of clientMap) {
    clientMap.get(key).response.write('data:' + message + '\n\n')
  }

  //
  // send response
  //

  return {
    message: '/postComment ok',
    status: true
  }
}

module.exports = postComment
