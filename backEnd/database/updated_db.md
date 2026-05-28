# THIẾT KẾ CƠ SỞ DỮ LIỆU - E-TECK PROJECT MANAGEMENT SYSTEM

Dưới đây là chi tiết thiết kế 15 bảng dữ liệu đã được chuẩn hóa (áp dụng snake_case, danh từ số nhiều, và các kiểu dữ liệu tối ưu như BIGINT cho tiền tệ, TIMESTAMP cho log/noti).

### 1. Bảng Tài khoản (`accounts`)
*Bảng trung tâm quản lý định danh, thông tin đăng nhập và trạng thái truy cập toàn hệ thống.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã tài khoản tự động tăng (Khóa chính) |
| `email` | VARCHAR(100) | unique, not null | Email dùng để đăng nhập hệ thống |
| `password_hash` | VARCHAR(255) | not null | Mật khẩu người dùng (đã được băm mã hóa) |
| `role` | VARCHAR(20) | not null | Vai trò hệ thống: `admin`, `staff`, `client`, `supplier` |
| `status` | VARCHAR(20) | default 'active' | Trạng thái tài khoản: `active`, `locked`, `inactive` |
| `created_at` | TIMESTAMP | default now() | Thời gian khởi tạo tài khoản |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật thông tin tài khoản gần nhất |

### 2. Bảng Nhân sự (`staffs`)
*Lưu trữ thông tin chi tiết về đội ngũ nhân sự nội bộ của công ty e-Teck.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh nhân viên (Khóa chính) |
| `account_id` | INT | FK → accounts(id), unique, not null | Mã liên kết với tài khoản hệ thống (Khóa ngoại) |
| `name` | VARCHAR(100) | not null | Họ và tên đầy đủ của nhân sự |
| `department` | VARCHAR(100) | not null | Phòng ban công tác |
| `position` | VARCHAR(100) | | Chức vụ cụ thể |
| `phone` | VARCHAR(15) | not null | Số điện thoại liên hệ |
| `avatar` | VARCHAR(255) | | Đường dẫn URL lưu trữ ảnh đại diện |

### 3. Bảng Khách hàng (`clients`)
*Quản lý thông tin các đối tác, khách hàng thuê e-Teck thực hiện dự án.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh khách hàng (Khóa chính) |
| `account_id` | INT | FK → accounts(id), unique, not null | Mã liên kết với tài khoản hệ thống (Khóa ngoại) |
| `type` | VARCHAR(50) | not null | Phân loại: `Doanh nghiệp`, `Tổ chức`, `Cá nhân` |
| `id_number` | VARCHAR(50) | not null | Mã số thuế doanh nghiệp hoặc số CCCD |
| `name` | VARCHAR(255) | not null | Tên khách hàng hoặc tên tổ chức |
| `phone` | VARCHAR(20) | not null | Số điện thoại liên hệ |
| `address` | VARCHAR(255) | not null | Địa chỉ trụ sở văn phòng hoặc thường trú |

### 4. Bảng Nhà cung cấp (`suppliers`)
*Quản lý thông tin đối tác cung ứng vật tư, trang thiết bị công nghệ.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh nhà cung cấp (Khóa chính) |
| `account_id` | INT | FK → accounts(id), unique, not null | Mã liên kết với tài khoản hệ thống (Khóa ngoại) |
| `id_number` | VARCHAR(50) | not null | Mã số thuế của nhà cung cấp |
| `name` | VARCHAR(255) | not null | Tên đầy đủ của đơn vị nhà cung cấp |
| `phone` | VARCHAR(20) | not null | Số điện thoại liên hệ |
| `address` | VARCHAR(255) | not null | Địa chỉ văn phòng giao dịch hoặc kho bãi |

### 5. Bảng Dự án (`projects`)
*Lưu trữ thông tin tổng quan, danh mục phân loại, tiến độ và trạng thái dự án.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh dự án (Khóa chính) |
| `title` | VARCHAR(255) | not null | Tên gọi chi tiết của dự án |
| `description` | TEXT | | Bản mô tả hoặc phạm vi công việc của dự án |
| `category` | VARCHAR(100) | not null | Phân loại dự án |
| `start_date` | DATE | default (CURRENT_DATE) | Ngày dự án bắt đầu thực hiện |
| `deadline` | DATE | not null | Hạn chót hoàn thành dự án |
| `client_id` | VARCHAR(10) | FK → clients(id) | Mã khách hàng sở hữu dự án (Khóa ngoại) |
| `current_step` | INT | default 0 | Mã số bước tiến độ hiện tại (Giá trị từ 0 đến 7) |
| `budget` | BIGINT | | Tổng mức ngân sách/Giá trị dự toán của dự án (VNĐ) |
| `created_by` | INT | FK → accounts(id) | Mã tài khoản khởi tạo dự án |
| `created_at` | TIMESTAMP | default now() | Thời gian khởi tạo dự án |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật thông tin dự án gần nhất |

### 6. Bảng Thành viên dự án (`project_members`)
*Bảng trung gian thiết lập danh sách nhân sự tham gia dự án.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã định danh bản ghi tự tăng (Khóa chính) |
| `project_id` | VARCHAR(10) | FK → projects(id) ON DELETE CASCADE | Mã dự án liên kết (Khóa ngoại) |
| `staff_id` | VARCHAR(10) | FK → staffs(id) | Mã nhân sự được phân công (Khóa ngoại) |
| `role` | VARCHAR(100) | | Vai trò trong dự án |
| `joined_at` | TIMESTAMP | default now() | Thời điểm tham gia dự án |

### 7. Bảng Công việc (`tasks`)
*Quản lý danh sách các đầu việc phân rã từ dự án.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã công việc tự động tăng (Khóa chính) |
| `project_id` | VARCHAR(10) | FK → projects(id) ON DELETE CASCADE | Thuộc dự án nào (Khóa ngoại) |
| `step` | INT | not null | Thuộc bước nghiệp vụ số mấy của dự án |
| `title` | VARCHAR(255) | not null | Tiêu đề ngắn gọn của đầu việc |
| `description` | TEXT | not null | Chi tiết yêu cầu công việc |
| `deadline` | DATE | not null | Hạn chót hoàn thành |
| `status` | VARCHAR(50) | default 'Chưa nộp' | Trạng thái công việc |
| `priority` | VARCHAR(20) | default 'Trung bình' | Mức độ ưu tiên |
| `assignee_id` | VARCHAR(10) | FK → staffs(id) | Nhân sự phụ trách thực hiện (Khóa ngoại) |
| `created_at` | TIMESTAMP | default now() | Thời gian tạo công việc |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật trạng thái gần nhất |

### 8. Bảng Tài liệu (`project_documents`)
*Kho lưu trữ tập trung tài liệu dự án và tệp nộp sản phẩm.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã định danh tài liệu tự tăng (Khóa chính) |
| `project_id` | VARCHAR(10) | FK → projects(id) ON DELETE CASCADE | Thuộc dự án nào (Khóa ngoại) |
| `task_id` | INT | FK → tasks(id) ON DELETE SET NULL | Cột liên kết tài liệu nộp của công việc (có thể NULL) |
| `file_name` | VARCHAR(255) | not null | Tên tệp tin hiển thị |
| `file_path` | VARCHAR(500) | not null | Đường dẫn lưu trữ vật lý trên server |
| `created_by` | INT | FK → accounts(id) | Mã tài khoản tải lên (Khóa ngoại) |
| `created_at` | TIMESTAMP | default now() | Thời điểm tải tài liệu lên |

### 9. Bảng Bình luận (`task_comments`)
*Quản lý trao đổi và phản hồi trên từng công việc.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã định danh bình luận (Khóa chính) |
| `task_id` | INT | FK → tasks(id) ON DELETE CASCADE | Gắn tại thẻ công việc nào (Khóa ngoại) |
| `content` | TEXT | not null | Nội dung bình luận, trao đổi |
| `created_by` | INT | FK → accounts(id) | Tài khoản người bình luận (Khóa ngoại) |
| `created_at` | TIMESTAMP | default now() | Thời gian gửi bình luận |

### 10. Bảng Vật tư (`materials`)
*Lưu trữ danh mục các thiết bị, vật tư từ các nhà cung cấp.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh vật tư (Khóa chính) |
| `sku` | VARCHAR(50) | unique, not null | Mã định danh thương mại cá biệt (Mã SKU) |
| `name` | VARCHAR(255) | not null | Tên chi tiết của vật tư |
| `brand` | VARCHAR(100) | | Thương hiệu hoặc hãng sản xuất |
| `category` | VARCHAR(100) | not null | Phân loại nhóm vật tư |
| `unit` | VARCHAR(20) | not null | Đơn vị tính |
| `price` | BIGINT | not null | Đơn giá gốc nhập vào từ NCC (VNĐ) |
| `status` | VARCHAR(50) | default 'Sẵn sàng' | Trạng thái cung ứng |
| `image_url` | VARCHAR(500) | | Đường dẫn URL hiển thị hình ảnh |
| `supplier_id` | VARCHAR(10) | FK → suppliers(id) | Mã nhà cung cấp (Khóa ngoại) |
| `specs` | TEXT | | Thông số kỹ thuật |
| `description` | TEXT | | Mô tả thêm |
| `created_at` | TIMESTAMP | default now() | Thời gian thêm vật tư |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật gần nhất |

### 11. Bảng Đơn hàng (`orders`)
*Số hóa quy trình gửi đơn đặt hàng tới nhà cung cấp.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(10) | PK | Mã định danh đơn hàng (Khóa chính) |
| `project_id` | VARCHAR(10) | FK → projects(id) | Thuộc kế hoạch vật tư của dự án nào (Khóa ngoại) |
| `supplier_id` | VARCHAR(10) | FK → suppliers(id) | Gửi tới nhà cung cấp nào (Khóa ngoại) |
| `order_date` | DATE | default (CURRENT_DATE) | Ngày chứng từ đặt hàng (PO Date) |
| `expected_date` | DATE | | Hạn giao hàng dự kiến |
| `receiver_id` | VARCHAR(10) | FK → staffs(id) | Nhân sự nhận hàng (Khóa ngoại) |
| `address` | VARCHAR(255) | not null | Địa chỉ nhận hàng |
| `status` | VARCHAR(50) | default 'Mới' | Trạng thái đơn hàng |
| `total_value` | BIGINT | | Tổng giá trị đơn hàng (VNĐ) |
| `note` | TEXT | | Ghi chú |
| `created_at` | TIMESTAMP | default now() | Thời gian tạo đơn hàng trên hệ thống |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật gần nhất |

### 12. Bảng Mặt hàng (`project_items`)
*Bảng trung gian bóc tách vật tư cho dự án và gắn vào đơn đặt hàng.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã định danh mặt hàng (Khóa chính) |
| `project_id` | VARCHAR(10) | FK → projects(id) ON DELETE CASCADE | Mã dự án (Khóa ngoại) |
| `order_id` | VARCHAR(10) | FK → orders(id) ON DELETE SET NULL | Thuộc đơn hàng nào (Khóa ngoại) |
| `material_id` | VARCHAR(10) | FK → materials(id) | Mã vật tư (Khóa ngoại) |
| `quantity` | INT | default 1 | Số lượng dự toán/đặt mua |
| `markup` | INT | default 10 | Biên lợi nhuận dự kiến (%) |
| `created_at` | TIMESTAMP | default now() | Thời gian bóc tách |
| `updated_at` | TIMESTAMP | default now() ON UPDATE now() | Thời gian cập nhật gần nhất |

### 13. Bảng Danh mục hệ thống (`categories`)
*Lưu trữ cấu hình tĩnh, ánh xạ các trạng thái nghiệp vụ và nhãn phân loại.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã định danh (Khóa chính) |
| `group_name` | VARCHAR(100) | not null | Tên nhóm danh mục |
| `value` | VARCHAR(255) | not null | Giá trị hiển thị |
| `sort_order` | INT | default 0 | Thứ tự sắp xếp |
| `created_at` | TIMESTAMP | default now() | Thời gian khởi tạo |

### 14. Bảng Nhật ký hoạt động (`activity_logs`)
*Lưu vết audit log hệ thống.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã bản ghi nhật ký (Khóa chính) |
| `user_id` | INT | FK → accounts(id) ON DELETE CASCADE | Mã tài khoản thao tác (Khóa ngoại) |
| `action` | VARCHAR(100) | not null | Tên hành động |
| `entity_type` | VARCHAR(50) | | Loại đối tượng bị tác động |
| `entity_id` | VARCHAR(50) | | Mã đối tượng bị tác động |
| `details` | JSON | | Dữ liệu biến động lưu dạng JSON |
| `created_at` | TIMESTAMP | default now() | Thời gian ghi nhận thao tác |

### 15. Bảng Thông báo (`notifications`)
*Quản lý thông báo đẩy thời gian thực.*

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, auto_increment | Mã thông báo (Khóa chính) |
| `user_id` | INT | FK → accounts(id) ON DELETE CASCADE | Mã tài khoản nhận thông báo (Khóa ngoại) |
| `type` | VARCHAR(50) | not null | Phân loại thông báo |
| `title` | VARCHAR(255) | not null | Tiêu đề thông báo |
| `message` | TEXT | | Nội dung chi tiết |
| `related_id` | VARCHAR(10) | | Mã thực thể liên quan để truy cập nhanh |
| `is_read` | BOOLEAN | default FALSE | Trạng thái đã xem |
| `created_at` | TIMESTAMP | default now() | Thời gian phát thông báo |