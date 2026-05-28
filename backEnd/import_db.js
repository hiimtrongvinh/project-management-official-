const fs = require('fs');
const path = require('path');
const { query } = require('./config/database');

async function importDb() {
  console.log('=== Kích hoạt import database tự động ===');
  try {
    let sqlPath = path.join(__dirname, 'database', 'updated_schema.sql');
    if (!fs.existsSync(sqlPath)) {
      sqlPath = path.join(__dirname, 'database', 'upated_schema.sql');
    }
    
    console.log('Đang đọc file:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Loại bỏ comment và tách các câu lệnh SQL
    const cleanSql = sql
      .replace(/--.*$/gm, '') // Xóa single line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Xóa block comments
      
    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Tìm thấy ${statements.length} câu lệnh SQL.`);

    // Tắt kiểm tra khóa ngoại tạm thời để xóa/tạo bảng không bị ràng buộc ngoại chặn
    await query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('Đã tắt kiểm tra khóa ngoại (FOREIGN_KEY_CHECKS = 0).');

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await query(stmt);
      } catch (err) {
        // Một số lệnh SET hoặc USE có thể có cảnh báo nhẹ, ta log lỗi nếu nghiêm trọng
        if (!stmt.toLowerCase().startsWith('set') && !stmt.toLowerCase().startsWith('use')) {
          console.error(`Lỗi ở câu lệnh số ${i + 1}:`);
          console.error(stmt.slice(0, 100) + '...');
          console.error('Chi tiết lỗi:', err.message);
        }
      }
    }

    // Bật lại kiểm tra khóa ngoại
    await query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Đã bật lại kiểm tra khóa ngoại (FOREIGN_KEY_CHECKS = 1).');
    console.log('=== Import Database hoàn tất thành công! ===');
  } catch (err) {
    console.error('Lỗi import thất bại:', err);
  }
  process.exit(0);
}

importDb();
