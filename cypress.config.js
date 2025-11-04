const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // The default baseUrl used by tests. Adjust if your server runs on a different port.
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed in future
      return config
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})
