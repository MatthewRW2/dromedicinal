<?php

namespace App\Repositories;

use App\Core\Database;

/**
 * BaseRepository - Clase base para repositorios
 */
abstract class BaseRepository
{
    protected Database $db;
    protected string $table;
    protected string $primaryKey = 'id';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Obtener todos los registros
     */
    public function all(array $orderBy = []): array
    {
        $sql = "SELECT * FROM {$this->table}";
        
        if (!empty($orderBy)) {
            $orderParts = [];
            foreach ($orderBy as $column => $direction) {
                $orderParts[] = "{$column} {$direction}";
            }
            $sql .= " ORDER BY " . implode(', ', $orderParts);
        }

        return $this->db->fetchAll($sql);
    }

    /**
     * Buscar por ID
     */
    public function find(int $id): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Buscar por columna
     */
    public function findBy(string $column, $value): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$column} = ?";
        return $this->db->fetchOne($sql, [$value]);
    }

    /**
     * Buscar múltiples por columna
     */
    public function findAllBy(string $column, $value, array $orderBy = []): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$column} = ?";
        
        if (!empty($orderBy)) {
            $orderParts = [];
            foreach ($orderBy as $col => $direction) {
                $orderParts[] = "{$col} {$direction}";
            }
            $sql .= " ORDER BY " . implode(', ', $orderParts);
        }

        return $this->db->fetchAll($sql, [$value]);
    }

    /**
     * Crear registro
     */
    public function create(array $data): int
    {
        return $this->db->insert($this->table, $data);
    }

    /**
     * Actualizar registro
     */
    public function update(int $id, array $data): bool
    {
        $affected = $this->db->update($this->table, $data, "{$this->primaryKey} = ?", [$id]);
        return $affected > 0;
    }

    /**
     * Eliminar registro
     */
    public function delete(int $id): bool
    {
        $affected = $this->db->delete($this->table, "{$this->primaryKey} = ?", [$id]);
        return $affected > 0;
    }

    /**
     * Verificar si existe
     */
    public function exists(int $id): bool
    {
        return $this->db->count($this->table, "{$this->primaryKey} = ?", [$id]) > 0;
    }

    /**
     * Contar registros
     */
    public function count(string $where = '1=1', array $params = []): int
    {
        return $this->db->count($this->table, $where, $params);
    }

    /**
     * Paginación
     */
    public function paginate(
        int $page = 1,
        int $perPage = 24,
        string $where = '1=1',
        array $params = [],
        array $orderBy = []
    ): array {
        $offset = ($page - 1) * $perPage;
        $total = $this->count($where, $params);
        
        $sql = "SELECT * FROM {$this->table} WHERE {$where}";
        
        if (!empty($orderBy)) {
            $orderParts = [];
            foreach ($orderBy as $column => $direction) {
                $orderParts[] = "{$column} {$direction}";
            }
            $sql .= " ORDER BY " . implode(', ', $orderParts);
        }
        
        $sql .= " LIMIT {$perPage} OFFSET {$offset}";

        $items = $this->db->fetchAll($sql, $params);

        return [
            'items' => $items,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage)
            ]
        ];
    }

    /**
     * Query personalizada
     */
    public function query(string $sql, array $params = []): array
    {
        return $this->db->fetchAll($sql, $params);
    }

    /**
     * Query que retorna un solo registro
     */
    public function queryOne(string $sql, array $params = []): ?array
    {
        return $this->db->fetchOne($sql, $params);
    }
}

