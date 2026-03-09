<?php
/**
 * Script para corregir el hash de la contraseña del administrador
 */

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

use App\Core\Database;
use App\Helpers\Security;

$db = Database::getInstance();

// Contraseña por defecto
$password = 'Admin123!';
$email = 'admin@dromedicinal.com';

// Generar nuevo hash
$newHash = Security::hashPassword($password);

echo "Actualizando hash de contraseña para: {$email}\n";
echo "Nuevo hash: {$newHash}\n\n";

// Actualizar en la base de datos
$db->update('users', [
    'password_hash' => $newHash,
    'updated_at' => date('Y-m-d H:i:s')
], 'email = ?', [$email]);

echo "✅ Hash actualizado correctamente\n\n";

// Verificar
$user = $db->fetchOne("SELECT email, password_hash FROM users WHERE email = ?", [$email]);
$isValid = Security::verifyPassword($password, $user['password_hash']);

if ($isValid) {
    echo "✅ Verificación exitosa: La contraseña funciona correctamente\n";
} else {
    echo "❌ Error: La contraseña no funciona\n";
    exit(1);
}
