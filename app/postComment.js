
const { appendCommentList, clientMap } = require('./realtime')

const postComment = ({ body }) => {
  const comment = {
    clientID: body.clientID,
    comment: body.comment,
    name: body.name
  }

  appendCommentList({ commentList: [comment] })

  const message = JSON.stringify({
    comment,
    status: true,
    type: 'comment'
  })

  for (let [key] of clientMap) {
    clientMap.get(key).write('data:' + message + '\n\n')
  }

  return {
    message: 'message received',
    status: true
  }
}

module.exports = postComment
