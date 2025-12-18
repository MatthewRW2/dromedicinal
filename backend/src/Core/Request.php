<?php

namespace App\Core;

/**
 * Clase Request - Encapsula la petición HTTP
 */
class Request
{
    private string $method;
    private string $uri;
    private array $query;
    private array $body;
    private array $headers;
    private array $files;
    private array $params = [];

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri = $this->parseUri();
        $this->query = $_GET;
        $this->body = [];
        $this->headers = $this->parseHeaders();
        $this->files = $_FILES;
    }

    /**
     * Parsear la URI de la petición
     */
    private function parseUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        
        // Remover query string
        if (($pos = strpos($uri, '?')) !== false) {
            $uri = substr($uri, 0, $pos);
        }
        
        // Remover el prefijo de la API si existe
        $uri = '/' . trim($uri, '/');
        
        // Si la URI comienza con /api/v1, removerlo
        if (strpos($uri, API_PREFIX) === 0) {
            $uri = substr($uri, strlen(API_PREFIX));
            if (empty($uri)) {
                $uri = '/';
            }
        }
        
        return $uri;
    }

    /**
     * Parsear headers HTTP
     */
    private function parseHeaders(): array
    {
        $headers = [];
        
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $name = str_replace('_', '-', substr($key, 5));
                $headers[$name] = $value;
            }
        }
        
        // Content-Type y Content-Length no tienen prefijo HTTP_
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['CONTENT-TYPE'] = $_SERVER['CONTENT_TYPE'];
        }
        if (isset($_SERVER['CONTENT_LENGTH'])) {
            $headers['CONTENT-LENGTH'] = $_SERVER['CONTENT_LENGTH'];
        }
        
        return $headers;
    }

    /**
     * Obtener el método HTTP
     */
    public function method(): string
    {
        return $this->method;
    }

    /**
     * Obtener la URI
     */
    public function uri(): string
    {
        return $this->uri;
    }

    /**
     * Obtener parámetro de query string
     */
    public function query(string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->query;
        }
        return $this->query[$key] ?? $default;
    }

    /**
     * Obtener parámetro del body
     */
    public function input(string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->body;
        }
        return $this->body[$key] ?? $default;
    }

    /**
     * Obtener todos los datos (body + query)
     */
    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    /**
     * Establecer el body (usado por JsonBodyMiddleware)
     */
    public function setBody(array $body): void
    {
        $this->body = $body;
    }

    /**
     * Obtener header
     */
    public function header(string $name, $default = null): ?string
    {
        $name = strtoupper(str_replace('-', '-', $name));
        return $this->headers[$name] ?? $default;
    }

    /**
     * Obtener todos los headers
     */
    public function headers(): array
    {
        return $this->headers;
    }

    /**
     * Obtener archivo subido
     */
    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    /**
     * Obtener todos los archivos
     */
    public function files(): array
    {
        return $this->files;
    }

    /**
     * Establecer parámetros de ruta
     */
    public function setParams(array $params): void
    {
        $this->params = $params;
    }

    /**
     * Obtener parámetro de ruta
     */
    public function param(string $key, $default = null)
    {
        return $this->params[$key] ?? $default;
    }

    /**
     * Obtener todos los parámetros de ruta
     */
    public function params(): array
    {
        return $this->params;
    }

    /**
     * Obtener la IP del cliente
     */
    public function ip(): string
    {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /**
     * Obtener el User Agent
     */
    public function userAgent(): string
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }

    /**
     * Verificar si es una petición JSON
     */
    public function isJson(): bool
    {
        $contentType = $this->header('CONTENT-TYPE', '');
        return strpos($contentType, 'application/json') !== false;
    }

    /**
     * Obtener el origen de la petición
     */
    public function origin(): ?string
    {
        return $this->header('ORIGIN');
    }

    /**
     * Solo obtener campos específicos del input
     */
    public function only(array $keys): array
    {
        $result = [];
        foreach ($keys as $key) {
            if (isset($this->body[$key])) {
                $result[$key] = $this->body[$key];
            }
        }
        return $result;
    }

    /**
     * Verificar si existe un campo en el input
     */
    public function has(string $key): bool
    {
        return isset($this->body[$key]) || isset($this->query[$key]);
    }
}

