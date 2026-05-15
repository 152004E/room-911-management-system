-- =============================================================================
-- ROOM_911 — Seed Data de Prueba
-- Ejecutar en orden: 1) departments → 2) employees
-- =============================================================================

-- ─── Departamentos ────────────────────────────────────────────────────────────

INSERT INTO department (name, description, created_at) VALUES
  ('I+D',           'Investigación y Desarrollo de nuevos compuestos farmacéuticos.',   NOW()),
  ('Seguridad',     'Control de acceso, vigilancia y protocolos de seguridad física.',  NOW()),
  ('Producción',    'Fabricación y control de calidad en líneas de producción.',         NOW()),
  ('Logística',     'Gestión de inventario, distribución y cadena de suministro.',       NOW()),
  ('Administración','Recursos humanos, finanzas y gestión general de la organización.', NOW());


-- ─── Empleados ────────────────────────────────────────────────────────────────
-- Departamentos asignados (ids secuenciales según INSERT anterior):
--   1 → I+D  |  2 → Seguridad  |  3 → Producción  |  4 → Logística  |  5 → Administración

INSERT INTO employee (internal_id, first_name, last_name, email, phone_number, is_authorized, department_id, created_at) VALUES
  ('R9-0001', 'Elena',    'Navarro',    'elena.navarro@room911.com',    '+52-55-1001-0001', TRUE,  1, NOW()),
  ('R9-0002', 'Carlos',   'Mendoza',    'carlos.mendoza@room911.com',   '+52-55-1001-0002', TRUE,  2, NOW()),
  ('R9-0003', 'Laura',    'Montes',     'laura.montes@room911.com',     '+52-55-1001-0003', FALSE, 5, NOW()),
  ('R9-0004', 'Javier',   'Silva',      'javier.silva@room911.com',     '+52-55-1001-0004', FALSE, 3, NOW()),
  ('R9-0005', 'Mariana',  'Reyes',      'mariana.reyes@room911.com',    '+52-55-1001-0005', TRUE,  1, NOW()),
  ('R9-0006', 'Andrés',   'Castillo',   'andres.castillo@room911.com',  '+52-55-1001-0006', TRUE,  4, NOW()),
  ('R9-0007', 'Sofía',    'Torres',     'sofia.torres@room911.com',     '+52-55-1001-0007', TRUE,  2, NOW()),
  ('R9-0008', 'Miguel',   'Gutiérrez',  'miguel.gutierrez@room911.com', '+52-55-1001-0008', FALSE, 3, NOW()),
  ('R9-0009', 'Valentina','Ramos',      'valentina.ramos@room911.com',  '+52-55-1001-0009', TRUE,  1, NOW()),
  ('R9-0010', 'Roberto',  'Herrera',    'roberto.herrera@room911.com',  '+52-55-1001-0010', TRUE,  5, NOW());
