import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        build: {
            outDir: path.join(__dirname, 'build'),
            chunkSizeWarningLimit: 1600,
        },
        define: {
            'import.meta.env.VITE_APP_BACKEND_ENDPOINT': JSON.stringify(env.VITE_APP_BACKEND_ENDPOINT),
            'import.meta.env.VITE_APP_BACKEND_API': JSON.stringify(env.VITE_APP_BACKEND_API),
        },
        plugins: [react()],
    };
});
