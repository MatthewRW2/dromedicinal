<?php
/**
 * Script para crear usuario administrador inicial
 * 
 * Uso: php scripts/create-admin.php
 */

// Cargar configuración
require_once __DIR__ . '/../src/Config/config.php';

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = APP_ROOT . '/src/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Database;
use App\Helpers\Security;

echo "===========================================\n";
echo "  Crear Usuario Administrador - Dromedicinal\n";
echo "===========================================\n\n";

// Solicitar datos
echo "Nombre completo: ";
$name = trim(fgets(STDIN));

echo "Email: ";
$email = trim(fgets(STDIN));

echo "Contraseña (mín. 8 caracteres): ";
$password = trim(fgets(STDIN));

// Validaciones básicas
if (empty($name) || strlen($name) < 2) {
    echo "\n❌ Error: El nombre debe tener al menos 2 caracteres.\n";
    exit(1);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "\n❌ Error: El email no es válido.\n";
    exit(1);
}

if (strlen($password) < 8) {
    echo "\n❌ Error: La contraseña debe tener al menos 8 caracteres.\n";
    exit(1);
}

try {
    $db = Database::getInstance();
    
    // Verificar si el email ya existe
    $existing = $db->fetchOne("SELECT id FROM users WHERE email = ?", [$email]);
    if ($existing) {
        echo "\n❌ Error: Ya existe un usuario con ese email.\n";
        exit(1);
    }
    
    // Obtener rol admin
    $adminRole = $db->fetchOne("SELECT id FROM roles WHERE name = 'admin'");
    if (!$adminRole) {
        echo "\n❌ Error: No se encontró el rol 'admin'. Asegúrate de importar el schema SQL primero.\n";
        exit(1);
    }
    
    // Crear usuario
    $passwordHash = Security::hashPassword($password);
    
    $db->insert('users', [
        'name' => $name,
        'email' => $email,
        'password_hash' => $passwordHash,
        'role_id' => $adminRole['id'],
        'is_active' => 1
    ]);
    
    echo "\n✅ Usuario administrador creado exitosamente!\n";
    echo "   Email: {$email}\n";
    echo "   Rol: admin\n\n";
    echo "Ya puedes iniciar sesión en el panel de administración.\n";
    
} catch (Exception $e) {
    echo "\n❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
}

