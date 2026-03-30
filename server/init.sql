-- ER Diagram to PostgreSQL Schema (Optimized for Supabase)

CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    branch_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    service_id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(organization_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by BIGINT REFERENCES users(user_id),
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qr_codes (
    qr_code_id BIGSERIAL PRIMARY KEY, 
    organization_id BIGINT REFERENCES organizations(organization_id) ON DELETE CASCADE, 
    branch_id BIGINT REFERENCES branches(branch_id) ON DELETE SET NULL, 
    service_id BIGINT REFERENCES services(service_id) ON DELETE SET NULL,
    code_value VARCHAR(255) UNIQUE NOT NULL, 
    description TEXT, 
    active BOOLEAN DEFAULT TRUE, 
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES branches(branch_id), -- Links manager to a specific branch
    name VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255), -- Added for dashboard login support
    device_hash VARCHAR(255) UNIQUE,
    role_id INT REFERENCES roles(role_id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by BIGINT REFERENCES users(user_id),
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks (
    feedback_id BIGSERIAL PRIMARY KEY,
    qr_code_id BIGINT REFERENCES qr_codes(qr_code_id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    device_hash VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'super_admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
