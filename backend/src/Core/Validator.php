<?php

namespace App\Core;

/**
 * Clase Validator - Validación de datos
 */
class Validator
{
    private array $data;
    private array $rules;
    private array $errors = [];
    private array $validated = [];

    /**
     * Mensajes de error personalizados
     */
    private array $messages = [
        'required' => 'El campo :field es obligatorio',
        'string' => 'El campo :field debe ser texto',
        'numeric' => 'El campo :field debe ser numérico',
        'integer' => 'El campo :field debe ser un número entero',
        'email' => 'El campo :field debe ser un email válido',
        'min' => 'El campo :field debe tener al menos :param caracteres',
        'max' => 'El campo :field no debe exceder :param caracteres',
        'min_value' => 'El campo :field debe ser mayor o igual a :param',
        'max_value' => 'El campo :field debe ser menor o igual a :param',
        'in' => 'El campo :field tiene un valor no permitido',
        'url' => 'El campo :field debe ser una URL válida',
        'boolean' => 'El campo :field debe ser verdadero o falso',
        'date' => 'El campo :field debe ser una fecha válida',
        'datetime' => 'El campo :field debe ser una fecha y hora válida',
        'unique' => 'El valor del campo :field ya está en uso',
        'exists' => 'El valor del campo :field no existe',
        'array' => 'El campo :field debe ser una lista',
        'slug' => 'El campo :field solo puede contener letras, números y guiones',
        'phone' => 'El campo :field debe ser un número de teléfono válido',
    ];

    public function __construct(array $data, array $rules)
    {
        $this->data = $data;
        $this->rules = $rules;
    }

    /**
     * Crear instancia y validar
     */
    public static function make(array $data, array $rules): self
    {
        $validator = new self($data, $rules);
        $validator->validate();
        return $validator;
    }

    /**
     * Ejecutar validación
     */
    public function validate(): bool
    {
        $this->errors = [];
        $this->validated = [];

        foreach ($this->rules as $field => $ruleString) {
            $rules = is_array($ruleString) ? $ruleString : explode('|', $ruleString);
            $value = $this->getValue($field);
            
            // Verificar si el campo es nullable
            $isNullable = in_array('nullable', $rules);
            
            // Si es nullable y el valor está vacío, saltar validaciones
            if ($isNullable && $this->isEmpty($value)) {
                $this->validated[$field] = null;
                continue;
            }

            $hasError = false;

            foreach ($rules as $rule) {
                if ($rule === 'nullable') continue;
                
                $result = $this->applyRule($field, $value, $rule);
                
                if ($result === false) {
                    $hasError = true;
                    break;
                }
            }

            if (!$hasError) {
                $this->validated[$field] = $value;
            }
        }

        return empty($this->errors);
    }

    /**
     * Obtener valor del campo (soporta notación de punto)
     */
    private function getValue(string $field)
    {
        $keys = explode('.', $field);
        $value = $this->data;

        foreach ($keys as $key) {
            if (!is_array($value) || !array_key_exists($key, $value)) {
                return null;
            }
            $value = $value[$key];
        }

        return $value;
    }

    /**
     * Verificar si un valor está vacío
     */
    private function isEmpty($value): bool
    {
        return $value === null || $value === '' || $value === [];
    }

    /**
     * Aplicar una regla de validación
     */
    private function applyRule(string $field, $value, string $rule): bool
    {
        // Extraer parámetros de la regla (ej: min:3, in:a,b,c)
        $parts = explode(':', $rule, 2);
        $ruleName = $parts[0];
        $param = $parts[1] ?? null;

        switch ($ruleName) {
            case 'required':
                if ($this->isEmpty($value)) {
                    $this->addError($field, 'required');
                    return false;
                }
                break;

            case 'string':
                if (!is_string($value) && !$this->isEmpty($value)) {
                    $this->addError($field, 'string');
                    return false;
                }
                break;

            case 'numeric':
                if (!is_numeric($value) && !$this->isEmpty($value)) {
                    $this->addError($field, 'numeric');
                    return false;
                }
                break;

            case 'integer':
                if (!$this->isEmpty($value) && !filter_var($value, FILTER_VALIDATE_INT) && $value !== 0 && $value !== '0') {
                    $this->addError($field, 'integer');
                    return false;
                }
                break;

            case 'email':
                if (!$this->isEmpty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, 'email');
                    return false;
                }
                break;

            case 'min':
                if (!$this->isEmpty($value) && is_string($value) && mb_strlen($value) < (int)$param) {
                    $this->addError($field, 'min', $param);
                    return false;
                }
                break;

            case 'max':
                if (!$this->isEmpty($value) && is_string($value) && mb_strlen($value) > (int)$param) {
                    $this->addError($field, 'max', $param);
                    return false;
                }
                break;

            case 'min_value':
                if (!$this->isEmpty($value) && is_numeric($value) && $value < (float)$param) {
                    $this->addError($field, 'min_value', $param);
                    return false;
                }
                break;

            case 'max_value':
                if (!$this->isEmpty($value) && is_numeric($value) && $value > (float)$param) {
                    $this->addError($field, 'max_value', $param);
                    return false;
                }
                break;

            case 'in':
                $allowed = explode(',', $param);
                if (!$this->isEmpty($value) && !in_array($value, $allowed, true)) {
                    $this->addError($field, 'in');
                    return false;
                }
                break;

            case 'url':
                if (!$this->isEmpty($value) && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->addError($field, 'url');
                    return false;
                }
                break;

            case 'boolean':
                if (!$this->isEmpty($value) && !is_bool($value) && !in_array($value, [0, 1, '0', '1', true, false], true)) {
                    $this->addError($field, 'boolean');
                    return false;
                }
                break;

            case 'date':
                if (!$this->isEmpty($value)) {
                    $d = \DateTime::createFromFormat('Y-m-d', $value);
                    if (!$d || $d->format('Y-m-d') !== $value) {
                        $this->addError($field, 'date');
                        return false;
                    }
                }
                break;

            case 'datetime':
                if (!$this->isEmpty($value)) {
                    $d = \DateTime::createFromFormat('Y-m-d H:i:s', $value);
                    if (!$d || $d->format('Y-m-d H:i:s') !== $value) {
                        // Intentar formato ISO
                        $d = \DateTime::createFromFormat('Y-m-d\TH:i:s', $value);
                        if (!$d) {
                            $this->addError($field, 'datetime');
                            return false;
                        }
                    }
                }
                break;

            case 'array':
                if (!$this->isEmpty($value) && !is_array($value)) {
                    $this->addError($field, 'array');
                    return false;
                }
                break;

            case 'slug':
                if (!$this->isEmpty($value) && !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $value)) {
                    $this->addError($field, 'slug');
                    return false;
                }
                break;

            case 'phone':
                if (!$this->isEmpty($value) && !preg_match('/^[0-9+\-\s()]{7,20}$/', $value)) {
                    $this->addError($field, 'phone');
                    return false;
                }
                break;
        }

        return true;
    }

    /**
     * Agregar error de validación
     */
    private function addError(string $field, string $rule, $param = null): void
    {
        $message = $this->messages[$rule] ?? "El campo :field no es válido";
        $message = str_replace(':field', $field, $message);
        
        if ($param !== null) {
            $message = str_replace(':param', $param, $message);
        }

        $this->errors[$field] = $message;
    }

    /**
     * Verificar si la validación falló
     */
    public function fails(): bool
    {
        return !empty($this->errors);
    }

    /**
     * Verificar si la validación pasó
     */
    public function passes(): bool
    {
        return empty($this->errors);
    }

    /**
     * Obtener errores de validación
     */
    public function errors(): array
    {
        return $this->errors;
    }

    /**
     * Obtener datos validados
     */
    public function validated(): array
    {
        return $this->validated;
    }

    /**
     * Obtener solo campos específicos de los datos validados
     */
    public function only(array $keys): array
    {
        return array_intersect_key($this->validated, array_flip($keys));
    }
}

