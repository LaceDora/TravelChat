// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allow connections from the ngrok public hostname and enable HMR over the tunnel
    host: true,
    cors: true,
    // replace below with your current ngrok URL if it changes
    origin: "https://claretta-chequered-shavonda.ngrok-free.dev",
  },
});
