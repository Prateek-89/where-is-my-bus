import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const devPort = Number(env.VITE_DEV_PORT) || 5173;
  const previewPort = Number(env.VITE_PREVIEW_PORT) || 4173;

  return {
    server: {
      host: env.VITE_DEV_HOST || 'localhost',
      port: devPort,
      strictPort: true, // Keeps Google OAuth origin stable
    },
    preview: {
      host: env.VITE_PREVIEW_HOST || 'localhost',
      port: previewPort,
      strictPort: true,
    },
  plugins: [
    tailwindcss(),
  ],
  };
});