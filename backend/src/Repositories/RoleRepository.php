<?php

namespace App\Repositories;

/**
 * Repository para roles
 */
class RoleRepository extends BaseRepository
{
    protected string $table = 'roles';

    /**
     * Obtener todos los roles
     */
    public function all(array $orderBy = []): array
    {
        return parent::all(['name' => 'ASC']);
    }

    /**
     * Buscar rol por nombre
     */
    public function findByName(string $name): ?array
    {
        return $this->findBy('name', $name);
    }
}

