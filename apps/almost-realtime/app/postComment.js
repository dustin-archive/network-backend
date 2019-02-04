
const postComment = ({ body, clientMap, comments }) => {
  const comment = {
    clientID: body.clientID,
    comment: body.comment,
    name: body.name
  }

  comments.push(comment)

  const message = JSON.stringify({
    comment,
    status: true,
    type: 'comment'
  })

  console.log(comments)

  for (let [key] of clientMap) {
    clientMap.get(key).write('data:' + message + '\n\n')
  }

  // clients.get(body.clientID).write('data:' + message + '\n\n')

  return {
    message: 'message received',
    status: true
  }
}

module.exports = postComment
