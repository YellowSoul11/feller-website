import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Preview builds (GitHub Pages) set BASE_PATH and SITE_URL. They point share tags at the preview URL
// and add noindex, so the preview never competes with the real domain in search.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (globalThis as any).process?.env ?? {};
const base = env.BASE_PATH || '/';
const siteUrl = env.SITE_URL;

const previewMeta = (): Plugin => ({
  name: 'preview-meta',
  transformIndexHtml(html) {
    if (!siteUrl) return html;
    return html
      .replaceAll('https://fellermarketing.com/', siteUrl)
      .replace('<head>', '<head>\n    <meta name="robots" content="noindex" />');
  },
});

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), previewMeta()],
  server: { port: 5173, strictPort: true },
});
