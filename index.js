
const micro = require('micro')

const { clientMap, realtime } = require('./app/realtime')
const fetchClientList = require('./app/fetchClientList')
const fetchComments = require('./app/fetchComments')
const postComment = require('./app/postComment')

// temporary
const comments = [
  {
    clientID: null,
    comment: 'You\'re now connected.',
    name: 'server'
  }
]

const handler = async (request, response) => {
  // set response headers
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Access-Control-Allow-Origin,X-HTTP-Method-Override,Content-Type,Authorization,Accept')
  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')

  // handle preflighted requests
  if (request.method === 'OPTIONS') {
    micro.send(response, 200)
  }

  //
  if (request.url === '/realtime') {
    return realtime(request, response)
  }

  //
  if (request.method === 'POST') {
    const body = await micro.json(request)

    if (request.url === '/postComment') {
      return postComment({ body, clientMap, comments })
    }

    if (request.url === '/fetchComments') {
      return fetchComments({ comments })
    }

    if (request.url === '/fetchClientList') {
      return fetchClientList({ clientList })
    }
  }
}

const server = micro(handler)

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000\n')
})
