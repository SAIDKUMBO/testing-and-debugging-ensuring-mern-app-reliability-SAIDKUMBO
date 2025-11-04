// Custom Cypress commands can go here. Keep minimal for now.

// Example: a convenience command to create a post via API
Cypress.Commands.add('createPost', (post) => {
  return cy.request({ method: 'POST', url: '/api/posts', body: post })
})
