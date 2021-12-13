import Fastify from 'fastify'
import requestTiming from 'fastify-request-timing'

import { box as boxClasses } from '@fabric-ds/component-classes'

import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { Box } from '@fabric-ds/vue'

const server = Fastify({ logger: true })
server.register(requestTiming)

const listings = [
  { id: 1, title: 'I am a title', description: 'I am a description of some object' },
  { id: 2, title: 'I am a title', description: 'I am a description of some object' },
  { id: 3, title: 'I am a title', description: 'I am a description of some object' }
]

// JS IMPLEMENTATION
const getListing = ({ title, description }) => `
  <div class="${boxClasses.box}">
    <h3>${title}</h3>
    <p>${description}</p>
  </div>
`
server.get('/js', async (req, reply) => {
  const html = listings.map(getListing).join('')
  reply.send(html)
})

// VUE IMPLEMENTATION
const layout = {
  template: `
    <f-box v-for="listing in listings">
      <h3>{{ listing.title }}</h3>
      <p>{{ listing.description }}</p>
    </f-box>
  `,
  props: {
    listings: Array
  }
}
server.get('/vue', async (req, reply) => {
  const app = createSSRApp(layout, { listings })
  app.use(Box)
  const html = await renderToString(app)
  reply.send(html)
})

server.listen(8080)
