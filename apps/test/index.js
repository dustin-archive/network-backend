
const micro = require('micro')

// temporary comment data
const comments = [
  { comment: 'test', name: 'whaaaley' }
]

// const clients = new WeakMap()
// let clientID = 0

// const realtime = (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream')
//
//   const id = {
//     id: clientID++
//   }
//
//   clients.set(id, req)
//
//   const onClose = () => {
//     clients.delete(id)
//   }
//
//   req.on('close', onClose)
// }

const postComment = body => (req, res) => {
  comments.push({
    comment: body.comment,
    name: body.name
  })

  console.log(comments)

  return { message: 'message received' }
}

const fetchComments = () => {
  return { comments }
}

const handler = async (req, res) => {
  // set response headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')

  // handle preflighted requests
  if (req.method === 'OPTIONS') {
    micro.send(res, 200)
  }

  //
  // if (req.url === '/realtime') {
  //   return realtime(req, res)
  // }

  //
  if (req.method === 'POST') {
    const body = await micro.json(req)

    if (req.url === '/postComment') {
      return postComment(body)(req, res)
    }

    if (req.url === '/fetchComments') {
      return fetchComments()
    }
  }
}

const server = micro(handler)

server.listen(8080, () => {
  console.log('Listening on port 8080\n')
})
