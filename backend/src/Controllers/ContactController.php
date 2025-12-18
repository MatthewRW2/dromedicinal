<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\ContactService;

/**
 * Controller de contacto
 */
class ContactController
{
    private ContactService $contactService;

    public function __construct()
    {
        $this->contactService = new ContactService();
    }

    /**
     * POST /public/contact
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'name' => 'required|string|min:2|max:120',
            'email' => 'nullable|email|max:160',
            'phone' => 'nullable|phone|max:40',
            'message' => 'required|string|min:10|max:2000',
            'source_page' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        // Validar que al menos haya email o teléfono
        $data = $validator->validated();
        if (empty($data['email']) && empty($data['phone'])) {
            $response->validationError([
                'contact' => 'Debe proporcionar un email o teléfono de contacto'
            ]);
            return;
        }

        $result = $this->contactService->store($data);

        if ($result['success']) {
            $response->created(['message' => $result['message']]);
        } else {
            $response->error($result['error'] ?? 'Error al enviar mensaje', 'CONTACT_ERROR');
        }
    }
}

