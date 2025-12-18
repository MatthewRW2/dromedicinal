<?php

namespace App\Services;

use App\Repositories\ContactRepository;

/**
 * Service de contacto
 */
class ContactService
{
    private ContactRepository $contactRepo;

    public function __construct()
    {
        $this->contactRepo = new ContactRepository();
    }

    /**
     * Guardar mensaje de contacto
     */
    public function store(array $data): array
    {
        // Sanitizar datos
        $data['name'] = trim($data['name']);
        $data['email'] = !empty($data['email']) ? trim($data['email']) : null;
        $data['phone'] = !empty($data['phone']) ? trim($data['phone']) : null;
        $data['message'] = trim($data['message']);
        $data['source_page'] = $data['source_page'] ?? null;
        $data['status'] = 'NEW';

        $id = $this->contactRepo->create($data);

        return [
            'success' => true,
            'message' => 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.'
        ];
    }

    /**
     * Obtener mensajes con paginación
     */
    public function getMessages(int $page = 1, int $perPage = 20, ?string $status = null): array
    {
        return $this->contactRepo->getMessages($page, $perPage, $status);
    }

    /**
     * Marcar como leído
     */
    public function markAsRead(int $id): bool
    {
        return $this->contactRepo->markAsRead($id);
    }

    /**
     * Archivar mensaje
     */
    public function archive(int $id): bool
    {
        return $this->contactRepo->archive($id);
    }

    /**
     * Obtener estadísticas
     */
    public function getStats(): array
    {
        return $this->contactRepo->getStats();
    }
}

