import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiRoutesPlugin(): Plugin {
  const handleApi = async (req: any, res: any, next: () => void) => {
    if (!req.url) return next();
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    
    if (url.pathname === '/api/bus') {
      try {
        req.query = Object.fromEntries(url.searchParams.entries());
        const { default: handler } = await import('./api/bus.js');
        await handler(req, res);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ state: 'unreachable', error: String(err) }));
      }
      return;
    }

    if (url.pathname === '/api/health') {
      try {
        req.query = Object.fromEntries(url.searchParams.entries());
        const { default: handler } = await import('./api/health.js');
        await handler(req, res);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ state: 'unreachable', error: String(err) }));
      }
      return;
    }

    next();
  };

  return {
    name: 'api-routes-plugin',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
