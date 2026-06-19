-- ============================================================
-- e-Teck Project Management System - Database Schema (UPDATED)
-- MySQL (XAMPP) - Database: eteck_project_management
-- ============================================================

CREATE DATABASE IF NOT EXISTS eteck_project_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eteck_project_management;

-- ============================================================
-- DROP TABLES (reverse order for foreign key dependencies)
-- ============================================================

DROP TABLE IF EXISTS task_history;
DROP TABLE IF EXISTS task_notes;
DROP TABLE IF EXISTS quotation_items;
DROP TABLE IF EXISTS quotations;
DROP TABLE IF EXISTS project_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS task_comments;
DROP TABLE IF EXISTS project_documents;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS staffs;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS accounts;

-- ============================================================
-- TABLE: accounts (central linking table)
-- ============================================================

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: staffs
-- ============================================================

CREATE TABLE staffs (
  id VARCHAR(10) PRIMARY KEY,
  account_id INT UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  phone VARCHAR(15) NOT NULL,
  avatar VARCHAR(255),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: clients
-- ============================================================

CREATE TABLE clients (
  id VARCHAR(10) PRIMARY KEY,
  account_id INT UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: suppliers
-- ============================================================

CREATE TABLE suppliers (
  id VARCHAR(10) PRIMARY KEY,
  account_id INT UNIQUE NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: projects
-- ============================================================

CREATE TABLE projects (
  id VARCHAR(10) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  start_date DATE DEFAULT (CURRENT_DATE),
  deadline DATE NOT NULL,
  client_id VARCHAR(10),
  current_step INT DEFAULT 0,
  quotation_status VARCHAR(20) DEFAULT 'pending',
  budget BIGINT,
  labor_fee BIGINT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: project_members
-- ============================================================

CREATE TABLE project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(10) NOT NULL,
  staff_id VARCHAR(10) NOT NULL,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_project_staff (project_id, staff_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staffs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: tasks
-- ============================================================

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(10) NOT NULL,
  step INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  deadline DATE NULL,
  status VARCHAR(50) DEFAULT 'Chưa nộp',
  priority VARCHAR(20) DEFAULT 'Trung bình',
  assignee_id VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES staffs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: project_documents
-- ============================================================

CREATE TABLE project_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(10) NOT NULL,
  task_id INT DEFAULT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: task_comments
-- ============================================================

CREATE TABLE task_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  content TEXT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: materials
-- ============================================================

CREATE TABLE materials (
  id VARCHAR(10) PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'Sẵn sàng',
  image_url VARCHAR(500),
  supplier_id VARCHAR(10),
  specs TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: orders
-- ============================================================

CREATE TABLE orders (
  id VARCHAR(10) PRIMARY KEY,
  project_id VARCHAR(10) NOT NULL,
  supplier_id VARCHAR(10) NOT NULL,
  order_date DATE DEFAULT (CURRENT_DATE),
  expected_date DATE,
  receiver_id VARCHAR(10),
  address VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Mới',
  total_value BIGINT,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (receiver_id) REFERENCES staffs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: project_items
-- ============================================================

CREATE TABLE project_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(10) NOT NULL,
  order_id VARCHAR(10) DEFAULT NULL,
  material_id VARCHAR(10) NOT NULL,
  quantity INT DEFAULT 1,
  markup INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (material_id) REFERENCES materials(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: categories
-- ============================================================

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: activity_logs
-- ============================================================

CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: notifications
-- ============================================================

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_id VARCHAR(10),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_orders_project_id ON orders(project_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_project_items_project_id ON project_items(project_id);
CREATE INDEX idx_project_items_order_id ON project_items(order_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Seed: accounts
-- Password hash is bcrypt of 'admin123' with 10 salt rounds
-- For demo, all accounts use the same password hash
-- ------------------------------------------------------------

-- bcrypt hash of 'admin123'
SET @pwd_hash = '$2a$10$H977FiAWoQx5bkrZjjo20u.Sj7ApFUCrDRoMgnxu28XQsszdY9PSS';

-- bcrypt hash of 'nhansu123'
SET @staff_pwd_hash = '$2a$10$6F/M/wbD4XeETdOVd0vTC.XfwgEcM8GACQaYeeF3ktBi52NEY.4P.';

-- bcrypt hash of 'khachhang123'
SET @client_pwd_hash = '$2a$10$yj13o0z12JtAE0diwt7Vk.4lx.7rccp1uovKriITFneLvQ6Wbgydi';

-- bcrypt hash of 'nhacungcap123'
SET @supplier_pwd_hash = '$2a$10$qdtfaQCAJ2wh7WC3coTHOeEvJF.YdN0wGsCvPAgJbn7Pv4/KCU.mi';

INSERT INTO accounts (id, email, password_hash, role, status) VALUES
-- Admin accounts
(1, 'admin@eteck.vn', @pwd_hash, 'admin', 'active'),
(2, 'anh.ht@eteck.vn', @pwd_hash, 'admin', 'active'),
(3, 'dieu.plh@eteck.vn', @pwd_hash, 'admin', 'active'),
(4, 'khoi.dtm@eteck.vn', @pwd_hash, 'admin', 'active'),
-- Staff accounts
(5, 'linh.ntk@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(6, 'quan.dm@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(7, 'nam.lh@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(8, 'thao.btp@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(9, 'thanh.tc@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(10, 'chi.vm@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
(11, 'vinh.nt@eteck.vn', @staff_pwd_hash, 'staff', 'active'),
-- Client accounts
(12, 'contact@reginamiracle.vn', @client_pwd_hash, 'client', 'active'),
(13, 'info@greatstar.com.vn', @client_pwd_hash, 'client', 'active'),
(14, 'infra@haengsung.com', @client_pwd_hash, 'client', 'active'),
(15, 'admin.hp@lgdisplay.com', @client_pwd_hash, 'client', 'active'),
(16, 'office@samsung.com', @client_pwd_hash, 'client', 'active'),
(17, 'management@deepc.vn', @client_pwd_hash, 'client', 'active'),
-- Supplier accounts
(18, 'sale@vnpt.vn', @supplier_pwd_hash, 'supplier', 'active'),
(19, 'contact@viettel.com.vn', @supplier_pwd_hash, 'supplier', 'active'),
(20, 'info@menkar.vn', @supplier_pwd_hash, 'supplier', 'active'),
(21, 'cskh@fpt.vn', @supplier_pwd_hash, 'supplier', 'active'),
(22, 'info@capdien.vn', @supplier_pwd_hash, 'supplier', 'active'),
(23, 'info@techlinks.vn', @supplier_pwd_hash, 'supplier', 'active'),
(24, 'lienhe@hitron.com', @supplier_pwd_hash, 'supplier', 'active');

-- ------------------------------------------------------------
-- Seed: staffs
-- ------------------------------------------------------------

INSERT INTO staffs (id, account_id, name, department, position, phone, avatar) VALUES
('NV001', 1, 'Admin System', 'Ban Giám đốc', 'Quản lý', '0900000000', NULL),
('NV002', 2, 'Hoàng Thế Anh', 'Ban Giám đốc', 'Quản lý', '0988123456', NULL),
('NV003', 3, 'Phan Lê Hoàng Diệu', 'Phòng Quản trị và Kế toán', 'Quản lý', '0904332211', NULL),
('NV004', 4, 'Đỗ Trí Minh Khôi', 'Phòng Quản trị và Kế toán', 'Quản lý', '0936998877', NULL),
('NV005', 5, 'Nguyễn Trần Khánh Linh', 'Phòng Kinh doanh', 'Nhân viên', '0912009988', NULL),
('NV006', 6, 'Đặng Minh Quân', 'Phòng Kỹ thuật', 'Nhân viên', '0345678901', NULL),
('NV007', 7, 'Lê Hải Nam', 'Phòng Kỹ thuật', 'Nhân viên', '0868112233', NULL),
('NV008', 8, 'Bùi Trần Phương Thảo', 'Phòng Kinh doanh', 'Nhân viên', '0707554433', NULL),
('NV009', 9, 'Trịnh Công Thành', 'Phòng Kỹ thuật', 'Nhân viên', '0945667788', NULL),
('NV010', 10, 'Vũ Mai Chi', 'Phòng Kinh doanh', 'Nhân viên', '0888123789', NULL),
('NV011', 11, 'Nguyễn Trọng Vinh', 'Phòng Kỹ thuật', 'Nhân viên', '0335736204', NULL);

-- ------------------------------------------------------------
-- Seed: clients
-- ------------------------------------------------------------

INSERT INTO clients (id, account_id, type, id_number, name, phone, address) VALUES
('KH001', 12, 'Doanh nghiệp', '0201889595', 'Regina Miracle International Vietnam', '02253123456', 'Khu Công nghiệp VSIP Hải Phòng'),
('KH002', 13, 'Doanh nghiệp', '0100109106', 'GreatStar Industrial Vietnam', '02253123456', 'Khu Công nghiệp Nam Cầu Kiền, Hải Phòng'),
('KH003', 14, 'Doanh nghiệp', '0304556677', 'Haengsung Electronics Vietnam', '02253999888', 'Khu Công nghiệp Tràng Duệ, Hải Phòng'),
('KH004', 15, 'Doanh nghiệp', '0202334455', 'LG Display Vietnam HaiPhong', '02253777666', 'Khu Công nghiệp Tràng Duệ, Hải Phòng'),
('KH005', 16, 'Doanh nghiệp', '0315443322', 'Samsung Engineering LSP', '02253555444', 'Long Sơn, Bà Rịa - Vũng Tàu'),
('KH006', 17, 'Tổ chức', '031094001234', 'Ban Quản lý Khu Công nghiệp DEEP C', '0912345678', 'Hải Phòng & Quảng Ninh');

-- ------------------------------------------------------------
-- Seed: suppliers
-- ------------------------------------------------------------

INSERT INTO suppliers (id, account_id, id_number, name, phone, address) VALUES
('NC001', 18, '0100686174', 'VNPT Hải Phòng', '18001166', 'Số 4 Lạch Tray, Ngô Quyền, Hải Phòng'),
('NC002', 19, '0100109106', 'Viettel Hải Phòng', '18008098', 'Tòa nhà Viettel, Lê Hồng Phong, Hải Phòng'),
('NC003', 20, '0202030405', 'Công ty TNHH Menkar', '02253505550', 'Số 447 Quán Rẽ, Mỹ Đức, An Lão, Hải Phòng'),
('NC004', 21, '0201987654', 'FPT Telecom Hải Phòng', '0869020999', 'KCN Tràng Duệ, An Dương, Hải Phòng'),
('NC005', 22, '0201112233', 'Công ty TNHH Dây cáp điện Hải Phòng', '0904392288', 'Hồng Bàng, Hải Phòng'),
('NC006', 23, '0203334445', 'Công ty TNHH Giải Pháp Techlink', '0982001363', 'Lê Chân, Hải Phòng'),
('NC007', 24, '0204445556', 'Công Ty TNHH Công Nghệ Hitron Việt Nam', '02253123456', 'Số 15, đường 17, KCN VSIP, Thủy Nguyên, Hải Phòng');

-- ------------------------------------------------------------
-- Seed: projects
-- ------------------------------------------------------------

INSERT INTO projects (id, title, description, category, start_date, deadline, client_id, current_step, budget, created_by) VALUES
('PRJ01', 'Lắp đặt hạ tầng mạng - Regina Miracle Factory', 'Cung cấp & lắp đặt Palo Alto Firewall, Cisco L3/L2 Switches, phụ kiện cho Nhà máy D. Đảm bảo kết nối ổn định cho dây chuyền sản xuất mới.', 'Hạ tầng mạng', '2026-05-05', '2026-05-20', 'KH001', 3, 45000000, 1),
('PRJ02', 'Nâng cấp Camera giám sát - Samsung Electronics', 'Nâng cấp toàn bộ hệ thống camera giám sát từ analog sang IP Camera AI cho khu vực sản xuất.', 'An ninh giám sát', '2026-03-01', '2026-04-30', 'KH005', 4, 90000000, 1),
('PRJ03', 'Triển khai Wifi diện rộng - Deep C Industrial Zone', 'Triển khai hệ thống Wifi mesh phủ sóng toàn bộ khu công nghiệp DEEP C giai đoạn 2.', 'Hạ tầng mạng', '2026-04-01', '2026-06-15', 'KH006', 1, 50000000, 1),
('PRJ04', 'Hệ thống ELV & Camera - LG Display Hải Phòng', 'Lắp đặt hệ thống ELV (Extra Low Voltage) và camera chống cháy nổ cho khu vực bồn chứa hóa chất.', 'An ninh giám sát', '2026-03-15', '2026-05-10', 'KH004', 2, 18900000, 1),
('PRJ05', 'Bảo trì định kỳ Server - Haengsung Electronics', 'Bảo trì định kỳ hệ thống Server, NAS Synology và cập nhật Microsoft License cho năm 2026.', 'Bảo trì hệ thống', '2026-02-01', '2026-05-05', 'KH003', 2, 8500000, 1),
('PRJ06', 'Hệ thống tổng đài IP - Menkar Co., Ltd', 'Triển khai hệ thống tổng đài IP nội bộ cho văn phòng công ty Menkar.', 'Viễn thông', '2026-01-10', '2026-04-15', 'KH002', 5, 25000000, 1);

-- ------------------------------------------------------------
-- Seed: project_members
-- ------------------------------------------------------------

INSERT INTO project_members (project_id, staff_id, role) VALUES
-- PRJ01 members
('PRJ01', 'NV002', 'Trưởng nhóm'),
('PRJ01', 'NV006', 'Kỹ thuật viên'),
('PRJ01', 'NV007', 'Kỹ thuật viên'),
('PRJ01', 'NV009', 'Giám sát an toàn'),
('PRJ01', 'NV005', 'Cấu hình mạng'),
-- PRJ02 members
('PRJ02', 'NV002', 'Trưởng nhóm'),
('PRJ02', 'NV009', 'Kỹ thuật viên'),
('PRJ02', 'NV010', 'Kỹ thuật viên'),
-- PRJ03 members
('PRJ03', 'NV007', 'Trưởng nhóm'),
('PRJ03', 'NV006', 'Kỹ thuật viên'),
('PRJ03', 'NV008', 'Kinh doanh'),
-- PRJ04 members
('PRJ04', 'NV009', 'Trưởng nhóm'),
('PRJ04', 'NV006', 'Kỹ thuật viên'),
('PRJ04', 'NV007', 'Kỹ thuật viên'),
-- PRJ05 members
('PRJ05', 'NV006', 'Trưởng nhóm'),
('PRJ05', 'NV009', 'Kỹ thuật viên'),
-- PRJ06 members
('PRJ06', 'NV002', 'Trưởng nhóm'),
('PRJ06', 'NV005', 'Kinh doanh'),
('PRJ06', 'NV007', 'Kỹ thuật viên');

-- ------------------------------------------------------------
-- Seed: tasks
-- ------------------------------------------------------------

INSERT INTO tasks (id, project_id, step, title, description, deadline, status, priority, assignee_id) VALUES
-- PRJ01 tasks (Step 1 - all approved)
(1, 'PRJ01', 1, 'Khảo sát site và lập sơ đồ hạ tầng', 'Khảo sát hiện trạng hạ tầng mạng Nhà máy D và lập sơ đồ bố trí thiết bị.', '2026-04-10', 'Đã duyệt', 'Cao', 'NV002'),
(2, 'PRJ01', 1, 'Lập bản dự toán khối lượng (BOQ)', 'Lập bảng dự toán khối lượng vật tư và thiết bị cần thiết cho dự án.', '2026-04-12', 'Đã duyệt', 'Cao', 'NV005'),
-- PRJ01 tasks (Step 2)
(3, 'PRJ01', 2, 'Liên hệ nhà cung cấp vật tư, thiết bị', 'Liên hệ các NCC để lấy báo giá thiết bị Cisco, Palo Alto và phụ kiện.', '2026-04-15', 'Đã nộp', 'Trung bình', 'NV005'),
-- PRJ01 tasks (Step 3 - current step)
(4, 'PRJ01', 3, 'Cấu hình chia VLAN cho Switch L3 và Firewall', 'Cấu hình chia VLAN cho hệ thống Switch L3 và Firewall Palo Alto', '2026-03-26', 'Chưa nộp', 'Cao', 'NV006'),
(5, 'PRJ01', 3, 'Kéo cáp mạng tầng 2 và tầng 3', 'Kéo cáp Cat6 UTP từ tủ Rack chính đến các điểm mạng tầng 2 và 3.', '2026-04-20', 'Đã duyệt', 'Trung bình', 'NV007'),
(6, 'PRJ01', 3, 'Lắp đặt tủ Rack và Patch Panel', 'Lắp đặt tủ Rack 42U và Patch Panel 24 port tại phòng Server.', '2026-04-18', 'Đã duyệt', 'Trung bình', 'NV009'),
-- PRJ03 tasks
(7, 'PRJ03', 1, 'Khảo sát vùng phủ sóng KCN DEEP C', 'Khảo sát và đo đạc vùng phủ sóng hiện tại, xác định điểm chết.', '2026-04-15', 'Đã duyệt', 'Cao', 'NV007'),
(8, 'PRJ03', 1, 'Báo cáo tiến độ kéo cáp quang trục chính', 'Báo cáo tiến độ kéo cáp quang trục chính và lắp đặt tủ ODF', '2026-03-22', 'Đã nộp', 'Trung bình', 'NV006'),
-- PRJ04 tasks
(9, 'PRJ04', 1, 'Khảo sát khu vực bồn chứa hóa chất', 'Khảo sát vị trí lắp đặt camera chống cháy nổ tại khu vực bồn chứa.', '2026-03-25', 'Đã duyệt', 'Cao', 'NV009'),
(10, 'PRJ04', 2, 'Lắp đặt và hiệu chỉnh góc quét Camera', 'Lắp đặt và hiệu chỉnh góc quét Camera chống cháy nổ khu vực bồn chứa', '2026-03-25', 'Cần sửa', 'Cao', 'NV009'),
-- PRJ05 tasks
(11, 'PRJ05', 1, 'Kiểm tra tình trạng Server hiện tại', 'Kiểm tra tình trạng phần cứng và phần mềm Server hiện tại.', '2026-02-15', 'Đã duyệt', 'Trung bình', 'NV006'),
(12, 'PRJ05', 2, 'Cập nhật Microsoft License', 'Cập nhật Microsoft License và kiểm tra định kỳ hệ thống NAS Synology', '2026-03-01', 'Đã duyệt', 'Cao', 'NV006'),
(13, 'PRJ05', 2, 'Lập hợp đồng bảo trì năm 2026', 'Soạn thảo hợp đồng bảo trì định kỳ cho năm 2026 với Haengsung.', '2026-03-15', 'Đã nộp', 'Trung bình', 'NV005'),
-- PRJ06 tasks (all approved - project completed)
(14, 'PRJ06', 1, 'Khảo sát hạ tầng viễn thông Menkar', 'Khảo sát hạ tầng viễn thông hiện tại và nhu cầu tổng đài IP.', '2026-01-20', 'Đã duyệt', 'Cao', 'NV007'),
(15, 'PRJ06', 2, 'Lập báo giá thiết bị tổng đài IP', 'Lập báo giá thiết bị tổng đài IP Grandstream cho Menkar.', '2026-01-30', 'Đã duyệt', 'Trung bình', 'NV005'),
(16, 'PRJ06', 2, 'Ký hợp đồng triển khai', 'Hoàn tất ký kết hợp đồng triển khai tổng đài IP.', '2026-02-10', 'Đã duyệt', 'Cao', 'NV005'),
(17, 'PRJ06', 3, 'Lắp đặt tổng đài IP và cấu hình', 'Lắp đặt thiết bị tổng đài IP và cấu hình extension cho các phòng ban.', '2026-03-01', 'Đã duyệt', 'Cao', 'NV007'),
(18, 'PRJ06', 4, 'Nghiệm thu và bàn giao hệ thống', 'Nghiệm thu hệ thống tổng đài IP và bàn giao cho khách hàng.', '2026-03-15', 'Đã duyệt', 'Cao', 'NV002'),
(19, 'PRJ06', 5, 'Thanh toán và đóng dự án', 'Hoàn tất thanh toán và đóng dự án.', '2026-04-01', 'Đã duyệt', 'Trung bình', 'NV005'),
(20, 'PRJ06', 5, 'Lập hồ sơ bảo hành', 'Lập hồ sơ bảo hành và hướng dẫn sử dụng cho khách hàng.', '2026-04-05', 'Đã duyệt', 'Thấp', 'NV007');

-- ------------------------------------------------------------
-- Seed: project_documents
-- ------------------------------------------------------------

INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by) VALUES
-- General project documents
('PRJ01', NULL, 'HopdongRegina.pdf', 'uploads/HopdongRegina.pdf', 1),
('PRJ01', NULL, 'SodomangD.dwg', 'uploads/SodomangD.dwg', 2),
('PRJ01', NULL, 'Baogiathietbi.xlsx', 'uploads/Baogiathietbi.xlsx', 5),
('PRJ01', NULL, 'Bien_ban_khao_sat.pdf', 'uploads/Bien_ban_khao_sat.pdf', 2),
('PRJ04', NULL, 'SodoVitriCamera.dwg', 'uploads/SodoVitriCamera.dwg', 9),
('PRJ06', NULL, 'contract-menkar.pdf', 'uploads/contract-menkar.pdf', 5),
('PRJ06', NULL, 'acceptance-menkar.pdf', 'uploads/acceptance-menkar.pdf', 2),
-- Task submission documents
('PRJ01', 1, 'SodositeD.dwg', 'uploads/SodositeD.dwg', 2),
('PRJ01', 2, 'BOQ-Regina.xlsx', 'uploads/BOQ-Regina.xlsx', 5),
('PRJ01', 3, 'BOM-Regina.xlsx', 'uploads/BOM-Regina.xlsx', 5),
('PRJ01', 5, 'report-cable-t2t3.pdf', 'uploads/report-cable-t2t3.pdf', 7),
('PRJ01', 6, 'rack-install-report.pdf', 'uploads/rack-install-report.pdf', 9),
('PRJ03', 7, 'survey-deepc.pdf', 'uploads/survey-deepc.pdf', 7),
('PRJ03', 8, 'BienbanNghiemthuSite.pdf', 'uploads/BienbanNghiemthuSite.pdf', 6),
('PRJ04', 9, 'survey-lgd-tank.pdf', 'uploads/survey-lgd-tank.pdf', 9),
('PRJ04', 10, 'SodoVitriCamera.dwg', 'uploads/SodoVitriCamera.dwg', 9),
('PRJ05', 11, 'server-check-report.pdf', 'uploads/server-check-report.pdf', 6),
('PRJ05', 12, 'XacnhanlicenseMS2026.pdf', 'uploads/XacnhanlicenseMS2026.pdf', 6),
('PRJ05', 13, 'contract-haengsung-2026.pdf', 'uploads/contract-haengsung-2026.pdf', 5),
('PRJ06', 14, 'survey-menkar.pdf', 'uploads/survey-menkar.pdf', 7),
('PRJ06', 15, 'quotation-menkar-ip.xlsx', 'uploads/quotation-menkar-ip.xlsx', 5),
('PRJ06', 16, 'contract-menkar.pdf', 'uploads/contract-menkar.pdf', 5),
('PRJ06', 17, 'install-menkar-pbx.pdf', 'uploads/install-menkar-pbx.pdf', 7),
('PRJ06', 18, 'acceptance-menkar.pdf', 'uploads/acceptance-menkar.pdf', 2),
('PRJ06', 19, 'payment-menkar.pdf', 'uploads/payment-menkar.pdf', 5),
('PRJ06', 20, 'warranty-menkar.pdf', 'uploads/warranty-menkar.pdf', 7);

-- ------------------------------------------------------------
-- Seed: task_comments
-- ------------------------------------------------------------

INSERT INTO task_comments (task_id, content, created_by) VALUES
(4, 'Cần xác nhận lại VLAN ID với bộ phận IT của khách hàng trước khi cấu hình.', 6),
(4, 'Đã liên hệ IT Regina, VLAN ID: 10 (Office), 20 (Production), 30 (Guest).', 2),
(10, 'Camera số 04 cần chỉnh góc quét sang phải 15 độ theo yêu cầu reviewer.', 9),
(8, 'Đã hoàn thành kéo cáp quang trục chính 80%, còn lại đoạn từ tủ ODF-3 đến ODF-5.', 6),
(10, 'Góc camera số 04 hơi bị khuất, em chỉnh lại sang hướng tay phải 15 độ nhé.', 2);

-- ------------------------------------------------------------
-- Seed: materials
-- ------------------------------------------------------------

INSERT INTO materials (id, sku, name, brand, category, unit, price, status, image_url, supplier_id, specs, description) VALUES
-- NC001: VNPT Hải Phòng
('M001', 'VT-VNPT-1FO', 'Cáp quang 1FO bọc chặt VNPT', 'VNPT', 'Cáp & Dây dẫn', 'mét', 3500, 'Sẵn sàng', 'https://vienthongnet.com/wp-content/uploads/Cuon-cap-boc-chat-1fo.jpg', 'NC001', '1 Sợi quang Singlemode, có dây gia cường hợp kim, bọc ruột gà chống gập gãy.', 'Phù hợp chạy luồn cống ngầm hoặc kéo nhánh cho hệ thống mạng LAN/WAN nội bộ khu công nghiệp.'),
('M002', 'VT-VNPT-WF6', 'Modem quang GPON iGate VNPT', 'VNPT', 'Thiết bị mạng', 'cái', 1250000, 'Sẵn sàng', 'https://www.vnpt-technology.vn/storage/photos/shares/ONT/020H%20black%20(2).png', 'NC001', 'Chuẩn AX3000, Băng tần kép 2.4/5GHz, 4 cổng Gigabit LAN.', 'Thiết bị đầu cuối mạng quang (ONT) cao cấp do VNPT Technology sản xuất, chịu tải 40-50 thiết bị.'),
('M003', 'VT-VNPT-POE8', 'Switch PoE 8 Port chuyên dụng', 'TP-Link', 'Thiết bị mạng', 'cái', 2100000, 'Hết hàng', 'https://tanphat.com.vn/media/lib/01-11-2023/switchtp-linktl-sg1008p-2.jpg', 'NC001', '8 Port Gigabit PoE+ 802.3at/af, tổng công suất 120W, 2 Uplink SFP.', 'Cấp nguồn trực tiếp qua cáp mạng cho hệ thống Camera IP hoặc Access Point công suất cao.'),
-- NC002: Viettel Hải Phòng
('M004', 'VT-VTL-2FO', 'Cáp quang 2FO Viettel cường lực', 'Viettel', 'Cáp & Dây dẫn', 'mét', 4200, 'Sẵn sàng', 'https://fasttel.vn/wp-content/uploads/2022/04/cap-quang-2fo-ong-long-2-1.jpg', 'NC002', 'Cáp treo số 8, 2 lõi quang Singlemode, dây treo thép cường lực mạ kẽm.', 'Sử dụng kéo mạng ngoài trời qua các cột điện nội bộ trong KCN.'),
('M005', 'VT-VTL-CAM', 'Camera IP Viettel vCam', 'Viettel', 'Thiết bị mạng', 'cái', 950000, 'Sẵn sàng', 'https://viettel-digital.com/wp-content/uploads/2022/01/Camera-HC3-02.jpg', 'NC002', 'Độ phân giải 2MP (1080p), hỗ trợ AI phát hiện chuyển động, lưu trữ Cloud.', 'Giải pháp an ninh thông minh kết nối trực tiếp với hạ tầng mạng Viettel.'),
-- NC003: Công ty TNHH Menkar
('M006', 'VT-DRAY-2962', 'Router Draytek Vigor 2962', 'Draytek', 'Thiết bị mạng', 'cái', 6500000, 'Sẵn sàng', 'https://npp.com.vn/wp-content/uploads/2023/11/2962-600x600.jpg', 'NC003', '1 Port 2.5G WAN/LAN, 1 Port SFP, 2 Port Gigabit LAN. Khả năng chịu tải 300 user.', 'Thiết bị cân bằng tải (Load Balancing) cao cấp, định tuyến mạng chính cho phân xưởng.'),
('M007', 'VT-RUI-3100-24', 'Switch Ruijie RG-NBS3100-24GT4SFP', 'Ruijie', 'Thiết bị mạng', 'bộ', 4600000, 'Sẵn sàng', 'https://vuhoangtelecom.vn/wp-content/uploads/2024/05/poe-switch-24-cong-ruijie-rg-nbs3100-24gt4sfp-p-v2-1.jpg', 'NC003', '24 Port 10/100/1000Mbps, 4 Port SFP quang Gigabit, Quản lý Cloud L2.', 'Switch chia mạng tốc độ cao có khả năng cấu hình VLAN và quản trị qua Ruijie Cloud.'),
('M008', 'VT-TMC-10U', 'Tủ Rack 10U D600', 'TMC', 'Phụ kiện', 'chiếc', 2350000, 'Sẵn sàng', 'https://www.tmcrack.vn/vn/wp-content/uploads/2017/07/10-12u-den.jpg', 'NC003', 'Kích thước H625 x W550 x D600mm. Thép SPCC 1.2mm, sơn tĩnh điện.', 'Tủ mạng treo tường hoặc để sàn, đi kèm quạt tản nhiệt và ổ cắm nguồn 6 port.'),
-- NC004: FPT Telecom Hải Phòng
('M009', 'VT-RUCK-R320', 'Access Point RUCKUS R320', 'Ruckus', 'Thiết bị mạng', 'cái', 8200000, 'Sẵn sàng', 'https://s3.amazonaws.com/ruckus-support/public/product_images/255/large/18122_R320_GLAM_LF.png', 'NC004', 'Wifi 5 802.11ac Wave 2, 2x2:2, Công nghệ BeamFlex+ chống nhiễu.', 'Thiết bị phát Wifi chuyên dụng cho môi trường mật độ cao, chịu tải lên đến 256 client.'),
('M010', 'VT-ARU-AP11', 'Access Point Aruba Instant On AP11', 'Aruba', 'Thiết bị mạng', 'cái', 2450000, 'Sẵn sàng', NULL, 'NC004', 'Băng tần kép 2.4/5GHz (1167 Mbps), quản lý miễn phí qua App Aruba.', 'Giải pháp phát sóng Wifi ổn định dành cho văn phòng và khu vực sảnh chờ.'),
-- NC005: Công ty TNHH Dây cáp điện Hải Phòng
('M011', 'VT-COM-CAT6', 'Cáp mạng Commscope Cat6 UTP', 'Commscope', 'Cáp & Dây dẫn', 'thùng', 3450000, 'Sẵn sàng', 'https://viethansecurity.com/media/product/3881_cap_mang_amp_commscope_cat6_chinh_hang__.jpg', 'NC005', 'Cáp mạng băng thông 250MHz, lõi đồng 23AWG có lõi chữ thập phân tách. 305m/thùng.', 'Hệ thống cáp truyền tải tốc độ Gigabit ổn định, độ bền 20 năm.'),
('M012', 'VT-PANA-32A', 'Aptomat 2 cực 32A', 'Panasonic', 'Thiết bị điện', 'cái', 155000, 'Sẵn sàng', NULL, 'NC005', 'MCB 2P 32A, dòng cắt 6kA, tự động ngắt khi quá tải hoặc ngắn mạch.', 'Aptomat tổng bảo vệ hệ thống tủ điện viễn thông.'),
-- NC006: Techlink
('M013', 'VT-CIS-C1000-24', 'Switch Cisco C1000-24T-4G-L', 'Cisco', 'Thiết bị mạng', 'bộ', 12500000, 'Sẵn sàng', 'https://thietbimangcisco.vn/images/product/goc/goc_1580873563.jpg', 'NC006', '24 Cổng 10/100/1000 Gigabit, 4 Cổng SFP 1G uplink. Switch Layer 2 được quản lý.', 'Thiết bị chia mạng lõi ổn định tuyệt đối dành cho hệ thống doanh nghiệp FDI.'),
('M014', 'VT-COM-PATCH24', 'Patch panel 24 port Commscope', 'Commscope', 'Phụ kiện', 'bộ', 2500000, 'Sẵn sàng', NULL, 'NC006', 'Thanh đấu nối cáp mạng 24 cổng RJ45 Cat6, chuẩn 19 inch gắn tủ Rack.', 'Làm gọn và quản lý đầu cáp mạng tập trung tại tủ trung tâm.'),
-- NC007: Hitron
('M015', 'VT-ODF-4P', 'ODF 4 port Gắn rack', 'No Brand', 'Phụ kiện', 'cái', 610000, 'Sẵn sàng', 'https://vienthongxanh.cdn.vccloud.vn/wp-content/uploads/2017/02/ODF-48Fo_3.jpg', 'NC007', 'Hộp phối quang ODF 4FO, vỏ thép sơn tĩnh điện, đầy đủ khay hàn, ống co nhiệt và Adapter SC.', 'Bảo vệ mối hàn quang kết nối từ đường cáp trục vào thiết bị.'),
('M016', 'VT-FIBER-TOOL', 'Bộ dụng cụ thi công quang', 'Hitron', 'Phụ kiện', 'bộ', 1250000, 'Sẵn sàng', NULL, 'NC007', 'Gồm dao cắt sợi quang FC-6S, kìm tuốt cáp, bút soi quang 10km, đồng hồ đo công suất.', 'Trang bị cho kỹ thuật viên e-Teck đi thi công thực địa.');

-- ------------------------------------------------------------
-- Seed: orders
-- ------------------------------------------------------------

INSERT INTO orders (id, project_id, supplier_id, order_date, expected_date, receiver_id, address, status, total_value, note) VALUES
('PO001', 'PRJ01', 'NC006', '2026-04-16', '2026-04-25', 'NV002', 'Khu Công nghiệp VSIP Hải Phòng', 'Hoàn thành', 35000000, 'Đơn hàng mua thiết bị Cisco và phụ kiện cáp.'),
('PO002', 'PRJ03', 'NC001', '2026-04-02', '2026-04-10', 'NV007', 'Hải Phòng & Quảng Ninh', 'Mới', 12000000, 'Yêu cầu báo giá cáp quang và modem GPON.');

-- ------------------------------------------------------------
-- Seed: project_items
-- ------------------------------------------------------------

INSERT INTO project_items (project_id, order_id, material_id, quantity, markup) VALUES
-- Items for PRJ01 (linked to PO001)
('PRJ01', 'PO001', 'M013', 2, 14),
('PRJ01', 'PO001', 'M014', 4, 82),
-- Items for PRJ01 (not yet ordered / general planning)
('PRJ01', NULL, 'M011', 2, 15),
-- Items for PRJ03 (linked to PO002)
('PRJ03', 'PO002', 'M001', 2000, 10),
('PRJ03', 'PO002', 'M002', 4, 10),
-- Items for PRJ04 (planned)
('PRJ04', NULL, 'M005', 12, 15);

-- ------------------------------------------------------------
-- Seed: categories
-- ------------------------------------------------------------

INSERT INTO categories (group_name, value, sort_order) VALUES
('departments', 'Ban Giám đốc', 1),
('departments', 'Phòng Quản trị và Kế toán', 2),
('departments', 'Phòng Kinh doanh', 3),
('departments', 'Phòng Kỹ thuật', 4),
('priorities', 'Thấp', 1),
('priorities', 'Trung bình', 2),
('priorities', 'Cao', 3),
('taskStatuses', 'Chưa nộp', 1),
('taskStatuses', 'Đã nộp', 2),
('taskStatuses', 'Cần sửa', 3),
('taskStatuses', 'Đã duyệt', 4),
('projectTypes', 'Hạ tầng mạng', 1),
('projectTypes', 'An ninh giám sát', 2),
('projectTypes', 'Bảo trì hệ thống', 3),
('projectTypes', 'Viễn thông', 4),
('projectTypes', 'Giải pháp ELV', 5),
('projectStatuses', 'Chờ phê duyệt', 1),
('projectStatuses', 'Khảo sát và lập kế hoạch', 2),
('projectStatuses', 'Mua thiết bị và lập báo giá', 3),
('projectStatuses', 'Xác nhận thỏa thuận', 4),
('projectStatuses', 'Triển khai lắp đặt', 5),
('projectStatuses', 'Bàn giao và nghiệm thu', 6),
('projectStatuses', 'Hoàn thành', 7);

-- ------------------------------------------------------------
-- Seed: activity_logs
-- ------------------------------------------------------------

INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'project_created', 'project', 'PRJ01', '{"title": "Lắp đặt hạ tầng mạng - Regina Miracle Factory"}'),
(1, 'project_created', 'project', 'PRJ02', '{"title": "Nâng cấp Camera giám sát - Samsung Electronics"}'),
(1, 'project_created', 'project', 'PRJ03', '{"title": "Triển khai Wifi diện rộng - Deep C Industrial Zone"}'),
(1, 'project_created', 'project', 'PRJ04', '{"title": "Hệ thống ELV & Camera - LG Display Hải Phòng"}'),
(1, 'project_created', 'project', 'PRJ05', '{"title": "Bảo trì định kỳ Server - Haengsung Electronics"}'),
(1, 'project_created', 'project', 'PRJ06', '{"title": "Hệ thống tổng đài IP - Menkar Co., Ltd"}'),
(1, 'member_added', 'project', 'PRJ01', '{"staff_id": "NV002", "role": "Trưởng nhóm"}'),
(1, 'task_created', 'task', '1', '{"title": "Khảo sát site và lập sơ đồ hạ tầng"}'),
(2, 'task_submitted', 'task', '1', '{"file": "SodositeD.dwg"}'),
(1, 'task_approved', 'task', '1', '{"status": "Đã duyệt"}'),
(5, 'task_submitted', 'task', '3', '{"file": "BOM-Regina.xlsx"}'),
(2, 'task_reviewed', 'task', '10', '{"status": "Cần sửa", "feedback": "Góc camera số 04 hơi bị khuất"}'),
(1, 'quotation_created', 'quotation', '1', '{"project": "PRJ01", "type": "client", "amount": 45000000}'),
(1, 'quotation_approved', 'quotation', '1', '{"status": "approved"}'),
(1, 'user_login', 'account', '1', '{"email": "admin@eteck.vn"}');

-- ------------------------------------------------------------
-- Seed: notifications
-- ------------------------------------------------------------

INSERT INTO notifications (user_id, type, title, message, related_id, is_read) VALUES
(6, 'task_assigned', 'Bạn được phân công công việc mới', 'Bạn được phân công công việc "Cấu hình chia VLAN cho Switch L3 và Firewall" trong dự án PRJ01.', '4', 0),
(9, 'revision_requested', 'Công việc cần sửa lại', 'Công việc "Lắp đặt và hiệu chỉnh góc quét Camera" cần được chỉnh sửa theo góp ý.', '10', 0),
(6, 'deadline_reminder', 'Công việc sắp đến hạn', 'Công việc "Cấu hình chia VLAN cho Switch L3 và Firewall" sắp đến hạn (26/03/2026).', '4', 0),
(2, 'task_submitted', 'Công việc đã được nộp', 'Nguyễn Trần Khánh Linh đã nộp công việc "Liên hệ nhà cung cấp vật tư, thiết bị".', '3', 1),
(7, 'task_assigned', 'Bạn được phân công công việc mới', 'Bạn được phân công công việc "Kéo cáp mạng tầng 2 và tầng 3" trong dự án PRJ01.', '5', 1),
(1, 'project_deadline', 'Dự án sắp đến hạn', 'Dự án "Bảo trì định kỳ Server - Haengsung Electronics" sắp đến hạn (05/05/2026).', 'PRJ05', 0),
(5, 'task_approved', 'Công việc đã được duyệt', 'Công việc "Lập bản dự toán khối lượng (BOQ)" đã được duyệt.', '2', 1),
(2, 'task_submitted', 'Công việc đã được nộp', 'Đặng Minh Quân đã nộp công việc "Báo cáo tiến độ kéo cáp quang trục chính".', '8', 0);

-- ============================================================
-- END OF SCHEMA AND SEED DATA
-- ============================================================
