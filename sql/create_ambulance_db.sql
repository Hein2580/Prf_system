CREATE DATABASE emsm;
\c emsm;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS ops;
CREATE SCHEMA IF NOT EXISTS app;

SET search_path = app, ops, public;

-- Countries
CREATE SEQUENCE seq_country_id;
CREATE TABLE country (
    country_id INT8 DEFAULT nextval('seq_country_id') NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    description VARCHAR(100) NOT NULL,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_country PRIMARY KEY (country_id),
    CONSTRAINT unq_country_code UNIQUE (country_code),
    CONSTRAINT unq_country_description UNIQUE (description)
);

-- User Roles
CREATE SEQUENCE seq_user_role_id;
CREATE TABLE user_role (
    user_role_id INT4 DEFAULT nextval('seq_user_role_id') NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    permissions JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_user_role PRIMARY KEY (user_role_id),
    CONSTRAINT unq_role_name UNIQUE (role_name)
);

-- Trip Types
CREATE SEQUENCE seq_trip_type_id;
CREATE TABLE trip_type (
    trip_type_id INT4 DEFAULT nextval('seq_trip_type_id') NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    priority_level INT2 DEFAULT 3,
    color_code VARCHAR(7),
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_trip_type PRIMARY KEY (trip_type_id),
    CONSTRAINT unq_trip_type_name UNIQUE (type_name)
);

-- Trip Status Types
CREATE SEQUENCE seq_trip_status_id;
CREATE TABLE trip_status (
    trip_status_id INT4 DEFAULT nextval('seq_trip_status_id') NOT NULL,
    status_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status_order INT2,
    color_code VARCHAR(7),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_trip_status PRIMARY KEY (trip_status_id),
    CONSTRAINT unq_trip_status_name UNIQUE (status_name)
);

-- Maintenance Types
CREATE SEQUENCE seq_maintenance_type_id;
CREATE TABLE maintenance_type (
    maintenance_type_id INT4 DEFAULT nextval('seq_maintenance_type_id') NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    estimated_cost DECIMAL(10,2),
    frequency_days INT4,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_maintenance_type PRIMARY KEY (maintenance_type_id),
    CONSTRAINT unq_maintenance_type_name UNIQUE (type_name)
);

-- Question Types
CREATE SEQUENCE seq_question_type_id;
CREATE TABLE question_type (
    question_type_id INT4 DEFAULT nextval('seq_question_type_id') NOT NULL,
    description VARCHAR(50) NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_question_type PRIMARY KEY (question_type_id),
    CONSTRAINT unq_description_question_type UNIQUE (description)
);

-- Questions
CREATE SEQUENCE seq_question_id;
CREATE TABLE question (
    question_id INT8 DEFAULT nextval('seq_question_id') NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_question PRIMARY KEY (question_id)
);

-- Questionnaire Types
CREATE SEQUENCE seq_questionnaire_type_id;
CREATE TABLE questionnaire_type (
    questionnaire_type_id INT8 DEFAULT nextval('seq_questionnaire_type_id') NOT NULL,
    description VARCHAR(50) NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_questionnaire_type PRIMARY KEY (questionnaire_type_id),
    CONSTRAINT unq_description_questionnaire_type UNIQUE (description)
);

-- Questionnaires
CREATE SEQUENCE seq_questionnaire_id;
CREATE TABLE questionnaire (
    questionnaire_id INT8 DEFAULT nextval('seq_questionnaire_id') NOT NULL,
    questionnaire_type_id INT8 NOT NULL,
    question_id INT8 NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_questionnaire PRIMARY KEY (questionnaire_id),
    CONSTRAINT fk_questionnaire_type FOREIGN KEY (questionnaire_type_id) REFERENCES questionnaire_type (questionnaire_type_id),
    CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES question (question_id)
);

-- Industries
CREATE SEQUENCE seq_industry_id;
CREATE TABLE industry (
    industry_id INT8 DEFAULT nextval('seq_industry_id') NOT NULL,
    description VARCHAR(50) NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_industry PRIMARY KEY (industry_id),
    CONSTRAINT unq_description_industry UNIQUE (description)
);

-- Companies
CREATE SEQUENCE seq_company_id;
CREATE TABLE company (
    company_id INT8 DEFAULT nextval('seq_company_id') NOT NULL,
    description VARCHAR(50) NOT NULL,
    industry_id INT8 NOT NULL,
    jdata JSONB NOT NULL,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_company PRIMARY KEY (company_id),
    CONSTRAINT unq_description_company UNIQUE (description),
    CONSTRAINT fk_company_industry FOREIGN KEY (industry_id) REFERENCES industry (industry_id)
);

-- Users
CREATE SEQUENCE seq_user_id;
CREATE TABLE users (
    user_id INT8 DEFAULT nextval('seq_user_id') NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    employee_id VARCHAR(20),
    user_role_id INT4 NOT NULL,
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    certification_level VARCHAR(50),
    certification_expiry DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT unq_username UNIQUE (username),
    CONSTRAINT unq_email UNIQUE (email),
    CONSTRAINT unq_employee_id UNIQUE (employee_id),
    CONSTRAINT fk_user_role FOREIGN KEY (user_role_id) REFERENCES user_role (user_role_id)
);

-- Ambulances
CREATE SEQUENCE seq_ambulance_id;
CREATE TABLE ambulance (
    ambulance_id INT8 DEFAULT nextval('seq_ambulance_id') NOT NULL,
    call_sign VARCHAR(20) NOT NULL,
    vehicle_number VARCHAR(20),
    make VARCHAR(50),
    model VARCHAR(50),
    year INT4,
    vin VARCHAR(17),
    license_plate VARCHAR(20),
    purchase_date DATE,
    service_date DATE,
    last_inspection DATE,
    next_inspection DATE,
    current_mileage DECIMAL(10,1),
    fuel_capacity DECIMAL(6,2),
    fuel_type VARCHAR(20) DEFAULT 'Diesel',
    status VARCHAR(20) DEFAULT 'Available',
    location VARCHAR(100),
    home_station VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_ambulance PRIMARY KEY (ambulance_id),
    CONSTRAINT unq_call_sign UNIQUE (call_sign),
    CONSTRAINT unq_vehicle_number UNIQUE (vehicle_number),
    CONSTRAINT unq_vin UNIQUE (vin),
    CONSTRAINT unq_license_plate UNIQUE (license_plate)
);

-- Ambulance Assignments
CREATE SEQUENCE seq_ambulance_assignment_id;
CREATE TABLE ambulance_assignment (
    assignment_id INT8 DEFAULT nextval('seq_ambulance_assignment_id') NOT NULL,
    ambulance_id INT8 NOT NULL,
    user_id INT8 NOT NULL,
    assigned_date DATE NOT NULL,
    unassigned_date DATE,
    assignment_type VARCHAR(20) DEFAULT 'Primary',
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_ambulance_assignment PRIMARY KEY (assignment_id),
    CONSTRAINT fk_ambulance_assignment_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance (ambulance_id),
    CONSTRAINT fk_ambulance_assignment_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Patients
CREATE SEQUENCE seq_patient_id;
CREATE TABLE patient (
    patient_id INT8 DEFAULT nextval('seq_patient_id') NOT NULL,
    id_number VARCHAR(50),
    passport_no VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(20),
    address TEXT,
    medical_aid_number VARCHAR(50),
    medical_aid_scheme VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT,
    medical_conditions TEXT,
    medications TEXT,
    country_id INT8,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_patient PRIMARY KEY (patient_id),
    CONSTRAINT unq_id_number UNIQUE (id_number),
    CONSTRAINT unq_passport_no UNIQUE (passport_no),
    CONSTRAINT fk_patient_country FOREIGN KEY (country_id) REFERENCES country (country_id)
);

-- Trip Log
CREATE SEQUENCE seq_trip_log_id;
CREATE TABLE trip_log (
    trip_log_id INT8 DEFAULT nextval('seq_trip_log_id') NOT NULL,
    ambulance_id INT8 NOT NULL,
    trip_type_id INT4 NOT NULL,
    trip_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    driver_id INT8 NOT NULL,
    attendant_id INT8,
    supervisor_id INT8,
    trainee_id INT8,
    patient_id INT8,
    pickup_location TEXT,
    destination TEXT,
    hospital_destination VARCHAR(100),
    start_mileage DECIMAL(10,1),
    end_mileage DECIMAL(10,1),
    total_kilometers DECIMAL(10,1),
    fuel_level_start DECIMAL(5,2),
    fuel_level_end DECIMAL(5,2),
    fuel_used DECIMAL(6,2),
    vehicle_condition VARCHAR(20) DEFAULT 'Good',
    defects TEXT,
    purpose TEXT,
    trip_notes TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    current_status VARCHAR(20) DEFAULT 'Started',
    priority_level INT2 DEFAULT 3,
    incident_number VARCHAR(50),
    dispatch_time TIMESTAMP,
    enroute_time TIMESTAMP,
    onscene_time TIMESTAMP,
    hospital_time TIMESTAMP,
    available_time TIMESTAMP,
    completion_time TIMESTAMP,
    total_duration_minutes INT4,
    response_time_minutes INT4,
    transport_time_minutes INT4,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_trip_log PRIMARY KEY (trip_log_id),
    CONSTRAINT fk_trip_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance (ambulance_id),
    CONSTRAINT fk_trip_type FOREIGN KEY (trip_type_id) REFERENCES trip_type (trip_type_id),
    CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES users (user_id),
    CONSTRAINT fk_trip_attendant FOREIGN KEY (attendant_id) REFERENCES users (user_id),
    CONSTRAINT fk_trip_supervisor FOREIGN KEY (supervisor_id) REFERENCES users (user_id),
    CONSTRAINT fk_trip_trainee FOREIGN KEY (trainee_id) REFERENCES users (user_id),
    CONSTRAINT fk_trip_patient FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
);

-- Trip Status History
CREATE SEQUENCE seq_trip_status_history_id;
CREATE TABLE trip_status_history (
    history_id INT8 DEFAULT nextval('seq_trip_status_history_id') NOT NULL,
    trip_log_id INT8 NOT NULL,
    trip_status_id INT4 NOT NULL,
    status_time TIMESTAMP NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    notes TEXT,
    created_by INT8,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_trip_status_history PRIMARY KEY (history_id),
    CONSTRAINT fk_trip_status_history_trip FOREIGN KEY (trip_log_id) REFERENCES trip_log (trip_log_id),
    CONSTRAINT fk_trip_status_history_status FOREIGN KEY (trip_status_id) REFERENCES trip_status (trip_status_id),
    CONSTRAINT fk_trip_status_history_user FOREIGN KEY (created_by) REFERENCES users (user_id)
);

-- Maintenance Records
CREATE SEQUENCE seq_maintenance_record_id;
CREATE TABLE maintenance_record (
    maintenance_id INT8 DEFAULT nextval('seq_maintenance_record_id') NOT NULL,
    ambulance_id INT8 NOT NULL,
    maintenance_type_id INT4 NOT NULL,
    maintenance_date DATE NOT NULL,
    odometer_reading DECIMAL(10,1),
    cost DECIMAL(10,2),
    vendor VARCHAR(100),
    technician_name VARCHAR(100),
    work_description TEXT,
    parts_replaced TEXT,
    next_service_date DATE,
    next_service_mileage DECIMAL(10,1),
    warranty_expiry DATE,
    invoice_number VARCHAR(50),
    performed_by INT8,
    approved_by INT8,
    status VARCHAR(20) DEFAULT 'Completed',
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_maintenance_record PRIMARY KEY (maintenance_id),
    CONSTRAINT fk_maintenance_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance (ambulance_id),
    CONSTRAINT fk_maintenance_type FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_type (maintenance_type_id),
    CONSTRAINT fk_maintenance_performed_by FOREIGN KEY (performed_by) REFERENCES users (user_id),
    CONSTRAINT fk_maintenance_approved_by FOREIGN KEY (approved_by) REFERENCES users (user_id)
);

-- Fuel Records
CREATE SEQUENCE seq_fuel_record_id;
CREATE TABLE fuel_record (
    fuel_id INT8 DEFAULT nextval('seq_fuel_record_id') NOT NULL,
    ambulance_id INT8 NOT NULL,
    fuel_date DATE NOT NULL,
    fuel_time TIME,
    odometer_reading DECIMAL(10,1),
    fuel_amount DECIMAL(8,2) NOT NULL,
    fuel_cost DECIMAL(10,2),
    cost_per_liter DECIMAL(6,2),
    fuel_station VARCHAR(100),
    fuel_type VARCHAR(20) DEFAULT 'Diesel',
    tank_full BOOLEAN DEFAULT FALSE,
    receipt_number VARCHAR(50),
    filled_by INT8,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_fuel_record PRIMARY KEY (fuel_id),
    CONSTRAINT fk_fuel_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance (ambulance_id),
    CONSTRAINT fk_fuel_filled_by FOREIGN KEY (filled_by) REFERENCES users (user_id)
);

-- Checklists
CREATE SEQUENCE seq_checklist_id;
CREATE TABLE checklist (
    checklist_id INT8 DEFAULT nextval('seq_checklist_id') NOT NULL,
    ambulance_id INT8 NOT NULL,
    checklist_date DATE NOT NULL,
    checklist_time TIME,
    shift_start BOOLEAN DEFAULT TRUE,
    performed_by INT8 NOT NULL,
    supervisor_id INT8,
    overall_status VARCHAR(20) DEFAULT 'Pass',
    defects_found TEXT,
    corrective_actions TEXT,
    equipment_status JSONB,
    vehicle_status JSONB,
    medical_supplies JSONB,
    safety_equipment JSONB,
    communication_equipment JSONB,
    signature_data TEXT,
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_checklist PRIMARY KEY (checklist_id),
    CONSTRAINT fk_checklist_ambulance FOREIGN KEY (ambulance_id) REFERENCES ambulance (ambulance_id),
    CONSTRAINT fk_checklist_performed_by FOREIGN KEY (performed_by) REFERENCES users (user_id),
    CONSTRAINT fk_checklist_supervisor FOREIGN KEY (supervisor_id) REFERENCES users (user_id)
);

-- PRF (Patient Report Forms)
CREATE SEQUENCE seq_prf_id;
CREATE TABLE prf (
    prf_id INT8 DEFAULT nextval('seq_prf_id') NOT NULL,
    trip_log_id INT8,
    patient_id INT8,
    prf_number VARCHAR(50),
    incident_date DATE NOT NULL,
    incident_time TIME,
    call_received_time TIME,
    dispatch_time TIME,
    arrival_time TIME,
    departure_time TIME,
    hospital_arrival_time TIME,
    incident_location TEXT,
    incident_type VARCHAR(100),
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    past_medical_history TEXT,
    medications TEXT,
    allergies TEXT,
    physical_examination JSONB,
    vital_signs JSONB,
    procedures_performed JSONB,
    medications_administered JSONB,
    patient_condition_on_arrival VARCHAR(50),
    patient_condition_on_departure VARCHAR(50),
    transport_priority VARCHAR(20),
    receiving_hospital VARCHAR(100),
    receiving_physician VARCHAR(100),
    crew_signature TEXT,
    physician_signature TEXT,
    created_by INT8 NOT NULL,
    approved_by INT8,
    status VARCHAR(20) DEFAULT 'Draft',
    jdata JSONB,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_prf PRIMARY KEY (prf_id),
    CONSTRAINT fk_prf_trip FOREIGN KEY (trip_log_id) REFERENCES trip_log (trip_log_id),
    CONSTRAINT fk_prf_patient FOREIGN KEY (patient_id) REFERENCES patient (patient_id),
    CONSTRAINT fk_prf_created_by FOREIGN KEY (created_by) REFERENCES users (user_id),
    CONSTRAINT fk_prf_approved_by FOREIGN KEY (approved_by) REFERENCES users (user_id),
    CONSTRAINT unq_prf_number UNIQUE (prf_number)
);

-- Audit Log
CREATE SEQUENCE seq_audit_log_id;
CREATE TABLE audit_log (
    audit_id INT8 DEFAULT nextval('seq_audit_log_id') NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT8 NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by INT8,
    change_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_audit_log PRIMARY KEY (audit_id),
    CONSTRAINT fk_audit_changed_by FOREIGN KEY (changed_by) REFERENCES users (user_id)
);

-- System Settings
CREATE SEQUENCE seq_system_setting_id;
CREATE TABLE system_setting (
    setting_id INT8 DEFAULT nextval('seq_system_setting_id') NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    modified_by INT8,
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts TIMESTAMP,
    CONSTRAINT pk_system_setting PRIMARY KEY (setting_id),
    CONSTRAINT unq_setting_key UNIQUE (setting_key),
    CONSTRAINT fk_setting_modified_by FOREIGN KEY (modified_by) REFERENCES users (user_id)
);

-- Indexes
CREATE INDEX idx_trip_log_date ON trip_log (trip_date);
CREATE INDEX idx_trip_log_ambulance ON trip_log (ambulance_id);
CREATE INDEX idx_trip_log_driver ON trip_log (driver_id);
CREATE INDEX idx_trip_log_status ON trip_log (status);
CREATE INDEX idx_trip_log_type ON trip_log (trip_type_id);
CREATE INDEX idx_trip_log_patient ON trip_log (patient_id);
CREATE INDEX idx_users_role ON users (user_role_id);
CREATE INDEX idx_users_active ON users (is_active);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_ambulance_status ON ambulance (status);
CREATE INDEX idx_ambulance_active ON ambulance (is_active);
CREATE INDEX idx_maintenance_ambulance ON maintenance_record (ambulance_id);
CREATE INDEX idx_maintenance_date ON maintenance_record (maintenance_date);
CREATE INDEX idx_maintenance_type ON maintenance_record (maintenance_type_id);
CREATE INDEX idx_fuel_ambulance ON fuel_record (ambulance_id);
CREATE INDEX idx_fuel_date ON fuel_record (fuel_date);
CREATE INDEX idx_audit_table ON audit_log (table_name);
CREATE INDEX idx_audit_record ON audit_log (record_id);
CREATE INDEX idx_audit_timestamp ON audit_log (create_ts);
CREATE INDEX idx_patient_id_number ON patient (id_number);
CREATE INDEX idx_patient_passport ON patient (passport_no);
CREATE INDEX idx_patient_name ON patient (first_name, last_name);
CREATE INDEX idx_prf_incident_date ON prf (incident_date);
CREATE INDEX idx_prf_patient ON prf (patient_id);
CREATE INDEX idx_prf_trip ON prf (trip_log_id);

-- Default data
INSERT INTO user_role (role_name, description, permissions) VALUES
('Administrator', 'Full system access', '{"all": true}'),
('Supervisor', 'Supervisory access', '{"manage_trips": true, "manage_users": false, "view_reports": true}'),
('Paramedic', 'Paramedic access', '{"create_trips": true, "update_trips": true, "view_own_trips": true}'),
('EMT', 'EMT access', '{"create_trips": true, "update_trips": true, "view_own_trips": true}'),
('Dispatcher', 'Dispatch access', '{"create_trips": true, "update_trips": true, "view_all_trips": true}'),
('Driver', 'Driver access', '{"create_trips": true, "update_trips": true, "view_own_trips": true}');

INSERT INTO trip_type (type_name, description, priority_level, color_code) VALUES
('Emergency Call', 'Emergency medical response', 1, '#f44336'),
('Non-Emergency Transport', 'Scheduled patient transport', 3, '#2196f3'),
('Interfacility Transfer', 'Transfer between medical facilities', 2, '#ff9800'),
('Standby', 'Standby at events or locations', 4, '#9c27b0'),
('Training', 'Training exercises', 5, '#4caf50'),
('Maintenance', 'Vehicle maintenance trips', 5, '#607d8b'),
('Fuel Run', 'Fuel procurement', 5, '#795548');

INSERT INTO trip_status (status_name, description, status_order, color_code) VALUES
('Started', 'Trip initiated', 1, '#4caf50'),
('Dispatched', 'Dispatched to scene', 2, '#ff9800'),
('En Route', 'En route to scene', 3, '#2196f3'),
('On Scene', 'Arrived at scene', 4, '#9c27b0'),
('At Hospital', 'At hospital', 5, '#4caf50'),
('Available', 'Available for service', 6, '#607d8b'),
('Completed', 'Trip completed', 7, '#2196f3'),
('Cancelled', 'Trip cancelled', 8, '#f44336');

INSERT INTO maintenance_type (type_name, description, estimated_cost, frequency_days) VALUES
('Fuel', 'Fuel fill-up', 800.00, 7),
('Oil Change', 'Engine oil change', 500.00, 90),
('Tire Rotation', 'Tire rotation and inspection', 300.00, 180),
('Brake Service', 'Brake system service', 1500.00, 365),
('Battery', 'Battery replacement', 800.00, 730),
('Inspection', 'Annual vehicle inspection', 1200.00, 365),
('Repair', 'General repairs', 2000.00, 0),
('Other', 'Other maintenance', 0.00, 0);

INSERT INTO country (country_code, description) VALUES
('ZA', 'South Africa'),
('US', 'United States'),
('GB', 'United Kingdom'),
('CA', 'Canada'),
('AU', 'Australia'),
('DE', 'Germany'),
('FR', 'France'),
('JP', 'Japan'),
('CN', 'China'),
('IN', 'India');

INSERT INTO industry (description, jdata) VALUES
('Emergency Medical Services', '{"type": "healthcare", "category": "emergency"}'),
('Healthcare', '{"type": "healthcare", "category": "general"}'),
('Transportation', '{"type": "logistics", "category": "transport"}'),
('Government', '{"type": "public", "category": "government"}'),
('Technology', '{"type": "technology", "category": "software"}');

INSERT INTO system_setting (setting_key, setting_value, setting_type, description) VALUES
('default_fuel_type', 'Diesel', 'string', 'Default fuel type for vehicles'),
('default_currency', 'ZAR', 'string', 'Default currency for costs'),
('maintenance_alert_days', '30', 'integer', 'Days before maintenance due to alert'),
('fuel_alert_percentage', '25', 'integer', 'Fuel percentage threshold for alerts'),
('max_trip_duration_hours', '24', 'integer', 'Maximum trip duration in hours'),
('system_timezone', 'Africa/Johannesburg', 'string', 'System timezone'),
('enable_gps_tracking', 'true', 'boolean', 'Enable GPS tracking for vehicles'),
('enable_notifications', 'true', 'boolean', 'Enable system notifications'),
('prf_auto_numbering', 'true', 'boolean', 'Auto-generate PRF numbers'),
('prf_number_format', 'PRF-{YYYY}-{MM}-{####}', 'string', 'PRF number format template'),
('default_response_time_target', '8', 'integer', 'Target response time in minutes'),
('fuel_efficiency_tracking', 'true', 'boolean', 'Track fuel efficiency per vehicle'),
('maintenance_reminder_emails', 'true', 'boolean', 'Send maintenance reminder emails'),
('trip_report_retention_days', '2555', 'integer', 'Trip report retention period (7 years)'),
('backup_frequency_hours', '24', 'integer', 'Database backup frequency in hours');

INSERT INTO question_type (description, jdata) VALUES
('Multiple Choice', '{"type": "multiple_choice", "options": [], "required": false}'),
('Text Input', '{"type": "text", "max_length": 255, "required": false}'),
('Number Input', '{"type": "number", "min": null, "max": null, "required": false}'),
('Date Input', '{"type": "date", "required": false}'),
('Time Input', '{"type": "time", "required": false}'),
('Yes/No', '{"type": "boolean", "required": false}'),
('Rating Scale', '{"type": "rating", "scale": 5, "required": false}'),
('Long Text', '{"type": "textarea", "max_length": 1000, "required": false}');

-- Views
CREATE VIEW v_active_trips AS
SELECT 
    tl.trip_log_id,
    tl.trip_date,
    tl.start_time,
    a.call_sign AS ambulance,
    tt.type_name AS trip_type,
    u.first_name || ' ' || u.last_name AS driver_name,
    tl.destination,
    tl.current_status,
    tl.status,
    tl.priority_level,
    tl.incident_number,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - tl.create_ts))/60 AS minutes_elapsed
FROM trip_log tl
JOIN ambulance a ON tl.ambulance_id = a.ambulance_id
JOIN trip_type tt ON tl.trip_type_id = tt.trip_type_id
JOIN users u ON tl.driver_id = u.user_id
WHERE tl.status = 'Active';

CREATE VIEW v_maintenance_due AS
SELECT 
    a.ambulance_id,
    a.call_sign,
    a.make,
    a.model,
    a.current_mileage,
    a.next_inspection,
    CASE 
        WHEN a.next_inspection <= CURRENT_DATE THEN 'OVERDUE'
        WHEN a.next_inspection <= CURRENT_DATE + INTERVAL '30 days' THEN 'DUE SOON'
        ELSE 'OK'
    END AS maintenance_status,
    a.next_inspection - CURRENT_DATE AS days_until_due
FROM ambulance a
WHERE a.is_active = TRUE
ORDER BY a.next_inspection ASC;

CREATE VIEW v_daily_trip_summary AS
SELECT 
    tl.trip_date,
    COUNT(*) AS total_trips,
    COUNT(CASE WHEN tl.status = 'Active' THEN 1 END) AS active_trips,
    COUNT(CASE WHEN tl.status = 'Completed' THEN 1 END) AS completed_trips,
    COUNT(CASE WHEN tl.status = 'Cancelled' THEN 1 END) AS cancelled_trips,
    SUM(COALESCE(tl.total_kilometers, 0)) AS total_kilometers,
    SUM(COALESCE(tl.fuel_used, 0)) AS total_fuel_used,
    AVG(COALESCE(tl.response_time_minutes, 0)) AS avg_response_time
FROM trip_log tl
GROUP BY tl.trip_date
ORDER BY tl.trip_date DESC;

-- Functions
CREATE OR REPLACE FUNCTION generate_prf_number() RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    prf_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(prf_number FROM 'PRF-[0-9]{4}-[0-9]{2}-([0-9]+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM prf 
    WHERE prf_number LIKE 'PRF-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-%';
    
    prf_number := 'PRF-' || 
                  EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' ||
                  LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0') || '-' ||
                  LPAD(next_number::TEXT, 4, '0');
    
    RETURN prf_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_trip_duration(start_ts TIMESTAMP, end_ts TIMESTAMP) RETURNS INTEGER AS $$
BEGIN
    IF start_ts IS NULL OR end_ts IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN EXTRACT(EPOCH FROM (end_ts - start_ts))::INTEGER / 60;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, create_ts)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, create_ts)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_values, create_ts)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.update_ts = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_update_ts BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_ambulance_update_ts BEFORE UPDATE ON ambulance FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_trip_log_update_ts BEFORE UPDATE ON trip_log FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_maintenance_record_update_ts BEFORE UPDATE ON maintenance_record FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_fuel_record_update_ts BEFORE UPDATE ON fuel_record FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_patient_update_ts BEFORE UPDATE ON patient FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_prf_update_ts BEFORE UPDATE ON prf FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_checklist_update_ts BEFORE UPDATE ON checklist FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 