<?php

namespace App\Helpers;

/**
 * Helper Files - Manejo seguro de archivos y uploads
 */
class Files
{
    /**
     * Subir imagen de forma segura
     */
    public static function uploadImage(
        array $file,
        string $directory,
        ?int $maxSize = null
    ): array {
        $maxSize = $maxSize ?? UPLOAD_MAX_SIZE;

        // Verificar errores de upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'error' => self::getUploadErrorMessage($file['error'])
            ];
        }

        // Verificar tamaño
        if ($file['size'] > $maxSize) {
            return [
                'success' => false,
                'error' => 'El archivo excede el tamaño máximo permitido (' . self::formatBytes($maxSize) . ')'
            ];
        }

        // Verificar tipo MIME real
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif'
        ];

        if (!array_key_exists($mimeType, $allowedMimes)) {
            return [
                'success' => false,
                'error' => 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WEBP, GIF'
            ];
        }

        // Verificar extensión permitida
        $extension = $allowedMimes[$mimeType];
        if (!in_array($extension, UPLOAD_ALLOWED_TYPES)) {
            return [
                'success' => false,
                'error' => 'Extensión de archivo no permitida'
            ];
        }

        // Crear directorio si no existe
        $uploadPath = UPLOAD_PATH . '/' . trim($directory, '/');
        if (!is_dir($uploadPath)) {
            if (!mkdir($uploadPath, 0755, true)) {
                return [
                    'success' => false,
                    'error' => 'No se pudo crear el directorio de destino'
                ];
            }
        }

        // Generar nombre único seguro
        $filename = self::generateSafeFilename($extension);
        $fullPath = $uploadPath . '/' . $filename;

        // Mover archivo
        if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
            return [
                'success' => false,
                'error' => 'No se pudo guardar el archivo'
            ];
        }

        // Establecer permisos
        chmod($fullPath, 0644);

        return [
            'success' => true,
            'filename' => $filename,
            'path' => trim($directory, '/') . '/' . $filename,
            'full_path' => $fullPath,
            'mime_type' => $mimeType,
            'size' => $file['size']
        ];
    }

    /**
     * Eliminar archivo
     */
    public static function delete(string $path): bool
    {
        $fullPath = UPLOAD_PATH . '/' . ltrim($path, '/');
        
        if (file_exists($fullPath) && is_file($fullPath)) {
            return unlink($fullPath);
        }
        
        return false;
    }

    /**
     * Verificar si un archivo existe
     */
    public static function exists(string $path): bool
    {
        $fullPath = UPLOAD_PATH . '/' . ltrim($path, '/');
        return file_exists($fullPath) && is_file($fullPath);
    }

    /**
     * Generar nombre de archivo seguro y único
     */
    public static function generateSafeFilename(string $extension): string
    {
        return bin2hex(random_bytes(16)) . '.' . $extension;
    }

    /**
     * Obtener URL pública de un archivo
     */
    public static function getPublicUrl(string $path): string
    {
        return APP_URL . '/storage/uploads/' . ltrim($path, '/');
    }

    /**
     * Formatear bytes a formato legible
     */
    public static function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        return round($bytes / (1024 ** $pow), $precision) . ' ' . $units[$pow];
    }

    /**
     * Obtener mensaje de error de upload
     */
    private static function getUploadErrorMessage(int $errorCode): string
    {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por el servidor',
            UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario',
            UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
            UPLOAD_ERR_NO_FILE => 'No se seleccionó ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal del servidor',
            UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en disco',
            UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida',
        ];

        return $errors[$errorCode] ?? 'Error desconocido al subir el archivo';
    }

    /**
     * Crear directorio de uploads si no existe
     */
    public static function ensureUploadDirectories(): void
    {
        $directories = [
            UPLOAD_PATH,
            UPLOAD_PATH . '/products',
            UPLOAD_PATH . '/promotions',
            UPLOAD_PATH . '/categories',
        ];

        foreach ($directories as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            
            // Crear .gitkeep
            $gitkeep = $dir . '/.gitkeep';
            if (!file_exists($gitkeep)) {
                file_put_contents($gitkeep, '');
            }
        }
    }
}

