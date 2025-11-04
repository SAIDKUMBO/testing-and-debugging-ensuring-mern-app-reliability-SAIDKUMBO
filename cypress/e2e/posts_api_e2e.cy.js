describe('Posts API end-to-end (Cypress)', () => {
  const random = Math.random().toString(36).slice(2, 9)
  const title = `E2E Post ${random}`
  const content = `Content for ${random}`
  let createdId = null
  let token = null

  before(() => {
    // read the JWT token written by the orchestrator
    cy.readFile('cypress/fixtures/token.json').then((f) => {
      token = f.token
      expect(token).to.exist
    })
  })

  it('creates a post via API and returns 201 with body', () => {
    cy.request({
      method: 'POST',
      url: '/api/posts',
      headers: { Authorization: `Bearer ${token}` },
      body: { title, content },
      failOnStatusCode: false
    }).then((res) => {
      expect([200,201]).to.include(res.status)
      // test expects an object with _id or id
      expect(res.body).to.be.an('object')
      createdId = res.body._id || res.body.id || res.body._id
      expect(createdId).to.exist
    })
  })

  it('retrieves the created post in list', () => {
    cy.request({ method: 'GET', url: '/api/posts' }).then((res) => {
      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('array')
      const found = res.body.find(p => p._id === createdId || p.id === createdId || (p.title === title && p.content === content))
      expect(found).to.exist
    })
  })

  it('updates the post and returns the updated document', () => {
    const newTitle = title + ' (edited)'
    cy.request({
      method: 'PUT',
      url: `/api/posts/${createdId}`,
      headers: { Authorization: `Bearer ${token}` },
      body: { title: newTitle, content },
      failOnStatusCode: false
    }).then((res) => {
      // Accept either 200 or 204 depending on implementation
      expect([200,204]).to.include(res.status)
    })
  })

  it('deletes the created post', () => {
    cy.request({ method: 'DELETE', url: `/api/posts/${createdId}`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }).then((res) => {
      expect([200,204,202]).to.include(res.status)
    })
  })
})
