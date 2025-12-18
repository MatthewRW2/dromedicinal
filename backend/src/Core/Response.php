<?php

namespace App\Core;

/**
 * Clase Response - Encapsula la respuesta HTTP
 */
class Response
{
    private int $statusCode = 200;
    private array $headers = [];
    private $body = null;
    private bool $sent = false;

    public function __construct()
    {
        $this->headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    /**
     * Establecer código de estado HTTP
     */
    public function status(int $code): self
    {
        $this->statusCode = $code;
        return $this;
    }

    /**
     * Establecer un header
     */
    public function header(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        return $this;
    }

    /**
     * Establecer múltiples headers
     */
    public function headers(array $headers): self
    {
        foreach ($headers as $name => $value) {
            $this->headers[$name] = $value;
        }
        return $this;
    }

    /**
     * Enviar respuesta JSON exitosa
     */
    public function json($data = null, array $meta = null): self
    {
        $response = [
            'data' => $data,
            'meta' => $meta,
            'error' => null
        ];
        
        $this->body = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $this;
    }

    /**
     * Enviar respuesta de error
     */
    public function error(string $message, string $code = 'ERROR', array $details = null, int $status = 400): self
    {
        $this->statusCode = $status;
        
        $response = [
            'data' => null,
            'meta' => null,
            'error' => [
                'code' => $code,
                'message' => $message,
                'details' => $details
            ]
        ];
        
        $this->body = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $this;
    }

    /**
     * Respuesta de éxito sin contenido
     */
    public function noContent(): self
    {
        $this->statusCode = 204;
        $this->body = null;
        return $this;
    }

    /**
     * Respuesta de creación exitosa
     */
    public function created($data = null): self
    {
        $this->statusCode = 201;
        return $this->json($data);
    }

    /**
     * Error de validación
     */
    public function validationError(array $errors): self
    {
        return $this->error(
            'Error de validación',
            'VALIDATION_ERROR',
            $errors,
            422
        );
    }

    /**
     * Error de autenticación
     */
    public function unauthorized(string $message = 'No autorizado'): self
    {
        return $this->error($message, 'UNAUTHORIZED', null, 401);
    }

    /**
     * Error de permisos
     */
    public function forbidden(string $message = 'Acceso denegado'): self
    {
        return $this->error($message, 'FORBIDDEN', null, 403);
    }

    /**
     * Error de recurso no encontrado
     */
    public function notFound(string $message = 'Recurso no encontrado'): self
    {
        return $this->error($message, 'NOT_FOUND', null, 404);
    }

    /**
     * Error interno del servidor
     */
    public function serverError(string $message = 'Error interno del servidor'): self
    {
        return $this->error($message, 'SERVER_ERROR', null, 500);
    }

    /**
     * Rate limit excedido
     */
    public function tooManyRequests(string $message = 'Demasiadas solicitudes'): self
    {
        return $this->error($message, 'TOO_MANY_REQUESTS', null, 429);
    }

    /**
     * Enviar la respuesta
     */
    public function send(): void
    {
        if ($this->sent) {
            return;
        }

        $this->sent = true;

        // Establecer código de estado
        http_response_code($this->statusCode);

        // Establecer headers
        foreach ($this->headers as $name => $value) {
            header("$name: $value");
        }

        // Enviar body si existe
        if ($this->body !== null) {
            echo $this->body;
        }
    }

    /**
     * Verificar si la respuesta ya fue enviada
     */
    public function isSent(): bool
    {
        return $this->sent;
    }

    /**
     * Obtener el código de estado actual
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * Obtener el body actual
     */
    public function getBody()
    {
        return $this->body;
    }
}

