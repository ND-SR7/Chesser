import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-styled-components', { displayName: true, fileName: false }]],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000, // old CRA port
    open: true,
  },
  build: {
    outDir: 'build', // old CRA output folder name
  },
});
