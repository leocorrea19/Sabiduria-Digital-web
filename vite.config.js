import { defineConfig } from 'vite';
import { resolve } from 'path';

export default {
    server: {
        port: "2222",
    },
    css: {
        devSourcemap: true,
    },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            input: {
                avanzado: resolve('views/avanzado.html'),
                donacion: resolve('views/donacion.html'),
                foro: resolve('views/foro.html'),
                principiantes: resolve('views/principiantes.html'),
                sesion: resolve('views/sesion.html'),
                inicio: resolve('index.html')
            }
        }
    }
};