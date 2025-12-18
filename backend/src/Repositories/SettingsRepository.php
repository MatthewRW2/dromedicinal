<?php

namespace App\Repositories;

/**
 * Repository para settings (configuración)
 */
class SettingsRepository extends BaseRepository
{
    protected string $table = 'settings';
    protected string $primaryKey = 'setting_key';

    /**
     * Obtener todos los settings como array key => value
     */
    public function getAllAsArray(): array
    {
        $sql = "SELECT setting_key, setting_value FROM settings";
        $rows = $this->db->fetchAll($sql);
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        return $settings;
    }

    /**
     * Obtener un setting por key
     */
    public function get(string $key, $default = null): ?string
    {
        $sql = "SELECT setting_value FROM settings WHERE setting_key = ?";
        $result = $this->db->fetchOne($sql, [$key]);
        return $result ? $result['setting_value'] : $default;
    }

    /**
     * Establecer un setting
     */
    public function set(string $key, ?string $value): void
    {
        $sql = "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)";
        $this->db->query($sql, [$key, $value]);
    }

    /**
     * Establecer múltiples settings
     */
    public function setMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            $this->set($key, $value);
        }
    }

    /**
     * Eliminar un setting
     */
    public function remove(string $key): bool
    {
        $affected = $this->db->delete('settings', 'setting_key = ?', [$key]);
        return $affected > 0;
    }

    /**
     * Verificar si un setting existe
     */
    public function has(string $key): bool
    {
        return $this->count('setting_key = ?', [$key]) > 0;
    }
}

