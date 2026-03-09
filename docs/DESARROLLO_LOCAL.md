# Desarrollo local - Dromedicinal

Para que el frontend (Next.js) y el backend (PHP) funcionen juntos en tu máquina, **debes tener ambos en ejecución**.

## Orden recomendado

### 1. Iniciar el backend (PHP API)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend
php -S localhost:8000 server.php
```

Deberías ver algo como:

```
PHP 8.x Development Server (http://localhost:8000) started
```

**Importante:** Deja esta terminal abierta. Si la cierras, el backend se detiene y el frontend mostrará "Error de conexión".

Para comprobar que el backend responde:

- Navegador: [http://localhost:8000/api/v1/public/settings](http://localhost:8000/api/v1/public/settings)
- O en otra terminal: `curl http://localhost:8000/api/v1/public/settings`

### 2. Iniciar el frontend (Next.js)

En **otra** terminal:

```bash
cd frontend
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000).

## Si usas XAMPP en lugar del servidor PHP integrado

1. Configura un Virtual Host o coloca el backend en `htdocs` y accede por algo como:  
   `http://localhost/dromedicinal/backend/public/`
2. Crea en el frontend un archivo `.env.local` con la URL correcta de la API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost/dromedicinal/backend/public/api/v1
```

(Reemplaza la ruta por la que uses en tu XAMPP.)

3. Reinicia el frontend (`npm run dev`) después de cambiar `.env.local`.

## Resumen de puertos

| Servicio   | URL                      | Puerto |
|-----------|---------------------------|--------|
| Backend   | http://localhost:8000     | 8000   |
| Frontend  | http://localhost:3000     | 3000   |

Si el frontend muestra **"Error de conexión: No se pudo conectar con el servidor"**, casi siempre significa que el backend no está corriendo. Inicia el backend con `php -S localhost:8000 server.php` dentro de la carpeta `backend`.
