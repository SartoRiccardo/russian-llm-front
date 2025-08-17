import { defineConfig } from 'cypress';
import { config } from 'dotenv';

config();
export default defineConfig({
  env: { ...process.env },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
});
