-- Script para limpiar la base de datos
-- CUIDADO: Este script eliminará TODOS los datos de las tablas

-- Eliminar todos los registros de las tablas
DELETE FROM posts;
DELETE FROM projects;

-- Reiniciar los contadores de views (opcional)
-- ALTER SEQUENCE IF EXISTS posts_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS projects_id_seq RESTART WITH 1;

-- Verificar que las tablas estén vacías
SELECT COUNT(*) as posts_count FROM posts;
SELECT COUNT(*) as projects_count FROM projects;

NOTIFY pgrst, 'reload schema';
