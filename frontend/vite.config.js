import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // We will run our app on port 3000
    open: true, // Automatically open the browser when we start the server

    // --- Enterprise Best Practice: Proxy API requests to the backend ---
    // This prevents CORS errors during development and simplifies API calls.
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
