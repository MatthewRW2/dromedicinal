<?php

namespace App\Helpers;

/**
 * Helper Slug - Generación de slugs URL-friendly
 */
class Slug
{
    /**
     * Generar slug a partir de texto
     */
    public static function generate(string $text): string
    {
        // Convertir a minúsculas
        $slug = mb_strtolower($text, 'UTF-8');
        
        // Reemplazar caracteres especiales del español
        $replacements = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'ä' => 'a', 'ë' => 'e', 'ï' => 'i', 'ö' => 'o', 'ü' => 'u',
            'à' => 'a', 'è' => 'e', 'ì' => 'i', 'ò' => 'o', 'ù' => 'u',
            'ñ' => 'n', 'ç' => 'c',
            'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u',
            'Ä' => 'a', 'Ë' => 'e', 'Ï' => 'i', 'Ö' => 'o', 'Ü' => 'u',
            'À' => 'a', 'È' => 'e', 'Ì' => 'i', 'Ò' => 'o', 'Ù' => 'u',
            'Ñ' => 'n', 'Ç' => 'c',
        ];
        
        $slug = strtr($slug, $replacements);
        
        // Remover caracteres especiales, mantener solo letras, números y espacios
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        
        // Reemplazar espacios y múltiples guiones por un solo guión
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        
        // Eliminar guiones al inicio y final
        $slug = trim($slug, '-');
        
        return $slug;
    }

    /**
     * Generar slug único verificando en la base de datos
     */
    public static function generateUnique(
        string $text, 
        string $table, 
        string $column = 'slug', 
        ?int $excludeId = null
    ): string {
        $baseSlug = self::generate($text);
        $slug = $baseSlug;
        $counter = 1;

        $db = \App\Core\Database::getInstance();

        while (true) {
            $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$column} = ?";
            $params = [$slug];
            
            if ($excludeId !== null) {
                $sql .= " AND id != ?";
                $params[] = $excludeId;
            }

            $result = $db->fetchOne($sql, $params);
            
            if ($result['count'] == 0) {
                return $slug;
            }

            $slug = $baseSlug . '-' . $counter;
            $counter++;

            // Prevenir bucle infinito
            if ($counter > 100) {
                $slug = $baseSlug . '-' . uniqid();
                break;
            }
        }

        return $slug;
    }
}

