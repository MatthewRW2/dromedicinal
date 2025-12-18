-- Script para actualizar datos de contacto de Dromedicinal
-- Ejecutar en phpMyAdmin o desde la línea de comandos

USE dromedicinal_web;

-- Actualizar dirección
UPDATE settings 
SET setting_value = 'Av. 70 # 79-16, Engativá, Bogotá, Cundinamarca'
WHERE setting_key = 'address';

-- Actualizar WhatsApp
UPDATE settings 
SET setting_value = '573134243625'
WHERE setting_key = 'whatsapp_number';

-- Actualizar email de contacto
UPDATE settings 
SET setting_value = 'contacto@dromedicinal.com'
WHERE setting_key = 'contact_email';

-- Agregar teléfono si no existe (el frontend lo necesita)
-- Formato: sin código de país, con espacio
INSERT INTO settings (setting_key, setting_value) 
VALUES ('phone', '313 4243625')
ON DUPLICATE KEY UPDATE setting_value = '313 4243625';

-- Agregar business_hours combinado si no existe (el frontend lo necesita)
INSERT INTO settings (setting_key, setting_value) 
VALUES ('business_hours', 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m. | Domingos y Festivos: 8:30 a.m. – 8:30 p.m.')
ON DUPLICATE KEY UPDATE setting_value = 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m. | Domingos y Festivos: 8:30 a.m. – 8:30 p.m.';

-- Verificar cambios
SELECT setting_key, setting_value 
FROM settings 
WHERE setting_key IN ('address', 'whatsapp_number', 'contact_email', 'phone', 'business_hours')
ORDER BY setting_key;

