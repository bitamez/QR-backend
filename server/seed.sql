-- Updated Seed Script for your Supabase Schema

-- 1. Insert Admins
INSERT INTO admins (username, email, password_hash, role) 
VALUES ('super_admin', 'bitaaaa2004@gmail.com', '$2b$10$EP0c.rM6G933dF2GZ5o/7OP86VzW6Fz0Y9bEx51tU5B1HjH2Y2H7K', 'super_admin');

-- 2. Insert Organizations
INSERT INTO organizations (name, email, phone, address, latitude, longitude) VALUES 
('Acme Corp', 'contact@acmecorp.com', '555-0100', 'Metropolis Center', 24.4539, 54.3773);

-- 3. Insert Branches
INSERT INTO branches (organization_id, name, address, latitude, longitude) VALUES 
(1, 'Downtown Branch', 'Street 1, Metropolis', 24.4539, 54.3773),
(1, 'Mall Branch', 'Unit 44, Metro Mall', 24.4600, 54.3800);

-- 4. Insert Roles
INSERT INTO roles (role_name, description) VALUES 
('manager', 'Branch/Org Manager'),
('coordinator', 'Support Coordinator');

-- 5. Insert Users
INSERT INTO users (organization_id, name, email, phone, password_hash, role_id) VALUES 
(1, 'John Smith', 'manager@acmecorp.com', '555-0101', '$2b$10$EP0c.rM6G933dF2GZ5o/7OP86VzW6Fz0Y9bEx51tU5B1HjH2Y2H7K', 1);

-- 6. Insert Services (Linked to Organization)
INSERT INTO services (organization_id, name, description) VALUES 
(1, 'Customer Support', 'General help and inquiries'),
(1, 'Technical Repair', 'Device fixing and analysis');

-- 7. Insert QR Codes (Links to branches/services)
INSERT INTO qr_codes (organization_id, branch_id, service_id, code_value, description) VALUES 
(1, 1, 1, 'QR-DOWNTOWN-SUP', 'Support at Downtown'),
(1, 1, 2, 'QR-DOWNTOWN-REP', 'Repairs at Downtown'),
(1, 2, 1, 'QR-MALL-SUP', 'Support at Mall');

-- 8. Insert Feedbacks (Plural!)
INSERT INTO feedbacks (qr_code_id, rating, comment, user_id) VALUES 
(1, 5, 'Perfect service!', 1),
(1, 4, 'Very good experience.', 1),
(2, 2, 'Repair took too long today.', 1);
