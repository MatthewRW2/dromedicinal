<?php
require_once __DIR__ . '/../src/Config/config.php';

spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = APP_ROOT . '/src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    if (file_exists($file)) require $file;
});

use App\Repositories\UserRepository;
use App\Helpers\Security;

$userRepo = new UserRepository();
$user = $userRepo->findByEmailWithRole('admin@dromedicinal.com');

if (!$user) {
    echo "❌ Usuario no encontrado\n";
    exit(1);
}

echo "✅ Usuario encontrado:\n";
echo "   ID: {$user['id']}\n";
echo "   Email: {$user['email']}\n";
echo "   Activo: " . ($user['is_active'] ? 'Sí' : 'No') . "\n";
echo "   Rol: {$user['role_name']}\n\n";

// Probar contraseña
$password = 'Admin123!';
$isValid = Security::verifyPassword($password, $user['password_hash']);

if ($isValid) {
    echo "✅ Contraseña válida!\n";
} else {
    echo "❌ Contraseña inválida\n";
    echo "   Hash actual: {$user['password_hash']}\n";
    echo "\n   Generando nuevo hash...\n";
    $newHash = Security::hashPassword($password);
    echo "   Nuevo hash: {$newHash}\n";
    echo "\n   Ejecuta en SQL:\n";
    echo "   UPDATE users SET password_hash = '{$newHash}' WHERE email = 'admin@dromedicinal.com';\n";
}