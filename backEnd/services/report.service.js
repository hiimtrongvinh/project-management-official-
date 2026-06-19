const { query } = require('../config/database');
const ExcelJS = require('exceljs');

/**
 * Report Service - Provides aggregated data for dashboard reporting
 */
const ReportService = {
  /**
   * Get general stats for the dashboard with role-based filtering.
   * Admin sees all, Staff sees only assigned projects/tasks.
   * @param {number} userId - Account ID
   * @param {string} role - User role
   * @returns {Promise<Object>}
   */
  async getDashboardStats(userId, role) {
    // Staff: lấy staff_id từ account_id, lọc theo project_members
    let projectFilter = '';
    let taskFilter = '';
    const params = [];

    if (role === 'staff') {
      const staffRows = await query('SELECT id FROM staffs WHERE account_id = ?', [userId]);
      if (staffRows.length === 0) {
        return {
          projects: { total: 0, completed: 0, active: 0, byStage: [] },
          tasks: { 'Chưa nộp': 0, 'Đã nộp': 0, 'Cần sửa': 0, 'Đã duyệt': 0 },
          budget: { approved: 0, pending: 0 }
        };
      }
      const staffId = staffRows[0].id;
      projectFilter = ' WHERE p.id IN (SELECT project_id FROM project_members WHERE staff_id = ?)';
      taskFilter = ' WHERE t.project_id IN (SELECT project_id FROM project_members WHERE staff_id = ?)';
      params.push(staffId);
    }

    // 1. Projects stats
    const projectStats = await query(`
      SELECT 
        COUNT(*) as totalProjects,
        SUM(CASE WHEN p.current_step = 6 THEN 1 ELSE 0 END) as completedProjects,
        SUM(CASE WHEN p.current_step < 6 THEN 1 ELSE 0 END) as activeProjects
      FROM projects p${projectFilter}
    `, params);

    // 2. Projects by stage
    const projectsByStage = await query(`
      SELECT 
        CASE p.current_step
          WHEN 1 THEN 'Khảo sát và lập kế hoạch'
          WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
          WHEN 3 THEN 'Triển khai lắp đặt'
          WHEN 4 THEN 'Bàn giao và nghiệm thu'
          WHEN 5 THEN 'Thanh toán'
          WHEN 6 THEN 'Hoàn thành'
          WHEN -1 THEN 'Đã từ chối'
          ELSE 'Chờ phê duyệt'
        END as stage,
        COUNT(*) as count 
      FROM projects p${projectFilter}
      GROUP BY p.current_step
    `, params);

    // 3. Tasks stats
    const taskStats = await query(`
      SELECT 
        t.status,
        COUNT(*) as count 
      FROM tasks t${taskFilter}
      GROUP BY t.status
    `, params);

    // 4. Budget statistics (approved vs pending budget from projects table)
    const budgetStats = await query(`
      SELECT 
        SUM(CASE WHEN p.quotation_status = 'approved' THEN COALESCE(p.budget, 0) ELSE 0 END) as approvedBudget,
        SUM(CASE WHEN p.quotation_status = 'pending' THEN COALESCE(p.budget, 0) ELSE 0 END) as pendingBudget
      FROM projects p${projectFilter}
    `, params);

    return {
      projects: {
        total: projectStats[0].totalProjects || 0,
        completed: projectStats[0].completedProjects || 0,
        active: projectStats[0].activeProjects || 0,
        byStage: projectsByStage
      },
      tasks: taskStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, { 'Chưa nộp': 0, 'Đã nộp': 0, 'Cần sửa': 0, 'Đã duyệt': 0 }),
      budget: {
        approved: parseFloat(budgetStats[0].approvedBudget || 0),
        pending: parseFloat(budgetStats[0].pendingBudget || 0)
      }
    };
  },

  /**
   * Export project and task progress details to an Excel stream
   * @param {Object} res - Express Response object
   */
  async exportProgressExcel(res) {
    // 1. Lấy dữ liệu tất cả dự án
    const projects = await query(`
      SELECT p.id, p.title, p.category, p.start_date, p.deadline as end_date,
             CASE p.current_step
               WHEN 1 THEN 'Khảo sát và lập kế hoạch'
               WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
               WHEN 3 THEN 'Triển khai lắp đặt'
               WHEN 4 THEN 'Bàn giao và nghiệm thu'
               WHEN 5 THEN 'Thanh toán'
               WHEN 6 THEN 'Hoàn thành'
               WHEN -1 THEN 'Đã từ chối'
               ELSE 'Chờ phê duyệt'
             END as status,
             COALESCE(ROUND((SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') / NULLIF((SELECT COUNT(*) FROM tasks t2 WHERE t2.project_id = p.id), 0) * 100), 0) as progress,
             c.name as client_name,
             (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') as approved_tasks
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `);

    // 2. Lấy dữ liệu tất cả công việc (tasks)
    const tasks = await query(`
      SELECT t.id, t.title, t.status, t.deadline, t.project_id,
             p.title as project_title,
             s.name as assignee_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN staffs s ON t.assignee_id = s.id
      ORDER BY t.project_id ASC, t.created_at DESC
    `);

    // 3. Tạo workbook và các sheet
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'e-Teck Projects';
    workbook.lastModifiedBy = 'e-Teck Projects';
    workbook.created = new Date();

    // --- SHEET 1: TIẾN ĐỘ DỰ ÁN ---
    const wsProjects = workbook.addWorksheet('Tiến độ dự án');
    
    // Thiết lập các cột cho sheet dự án
    wsProjects.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Mã dự án', key: 'id', width: 15 },
      { header: 'Tên dự án', key: 'title', width: 35 },
      { header: 'Khách hàng', key: 'client_name', width: 30 },
      { header: 'Phân loại', key: 'category', width: 25 },
      { header: 'Trạng thái', key: 'status', width: 25 },
      { header: 'Tiến độ (%)', key: 'progress', width: 15 },
      { header: 'Bắt đầu', key: 'start_date', width: 15 },
      { header: 'Hạn hoàn thành', key: 'end_date', width: 15 },
      { header: 'Tổng số việc', key: 'total_tasks', width: 15 },
      { header: 'Việc đã duyệt', key: 'approved_tasks', width: 15 },
      { header: 'Thành viên', key: 'member_count', width: 12 },
      { header: 'Tình trạng', key: 'deadline_status', width: 15 }
    ];

    // Định dạng Header Row
    const headerRow = wsProjects.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Segoe UI', size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F46E5' } // Indigo 600
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Điền dữ liệu vào sheet dự án
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    projects.forEach((p, idx) => {
      const isOverdue = p.end_date && new Date(p.end_date) < now && p.status !== 'Hoàn thành';
      const deadlineStatus = isOverdue ? 'Quá hạn' : (p.status === 'Hoàn thành' ? 'Đúng hạn (Xong)' : (p.end_date ? 'Đang thực hiện' : 'Chưa đặt'));
      
      const row = wsProjects.addRow({
        stt: idx + 1,
        id: p.id,
        title: p.title,
        client_name: p.client_name || '---',
        category: p.category || '---',
        status: p.status,
        progress: p.progress / 100, // Định dạng % trong Excel
        start_date: p.start_date ? new Date(p.start_date) : null,
        end_date: p.end_date ? new Date(p.end_date) : null,
        total_tasks: p.total_tasks,
        approved_tasks: p.approved_tasks,
        member_count: p.member_count,
        deadline_status: deadlineStatus
      });

      row.height = 20;

      row.getCell('progress').numFmt = '0%';
      row.getCell('start_date').numFmt = 'dd/mm/yyyy';
      row.getCell('end_date').numFmt = 'dd/mm/yyyy';

      const statusCell = row.getCell('deadline_status');
      if (deadlineStatus === 'Quá hạn') {
        statusCell.font = { color: { argb: 'DC2626' }, bold: true };
      } else if (deadlineStatus === 'Đúng hạn (Xong)') {
        statusCell.font = { color: { argb: '16A34A' }, bold: true };
      }
    });

    // Thêm border và alignment cho tất cả các ô dữ liệu
    wsProjects.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Segoe UI', size: 10 };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          };
          if (['stt', 'id', 'category', 'status', 'progress', 'start_date', 'end_date', 'total_tasks', 'approved_tasks', 'member_count', 'deadline_status'].includes(wsProjects.columns[colNumber - 1].key)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
      }
    });

    // --- SHEET 2: CHI TIẾT CÔNG VIỆC ---
    const wsTasks = workbook.addWorksheet('Chi tiết công việc');
    wsTasks.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Mã dự án', key: 'project_id', width: 15 },
      { header: 'Tên dự án', key: 'project_title', width: 30 },
      { header: 'Tên công việc', key: 'title', width: 35 },
      { header: 'Người thực hiện', key: 'assignee_name', width: 25 },
      { header: 'Trạng thái', key: 'status', width: 20 },
      { header: 'Hạn hoàn thành', key: 'deadline', width: 18 },
      { header: 'Tình trạng', key: 'task_status', width: 15 }
    ];

    const headerRowTasks = wsTasks.getRow(1);
    headerRowTasks.height = 25;
    headerRowTasks.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Segoe UI', size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3B82F6' } // Blue 500
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    tasks.forEach((t, idx) => {
      const isOverdue = t.deadline && new Date(t.deadline) < now && t.status !== 'Đã duyệt';
      const taskStatus = isOverdue ? 'Quá hạn' : (t.status === 'Đã duyệt' ? 'Hoàn thành' : (t.deadline ? 'Đang thực hiện' : 'Chưa đặt'));

      const row = wsTasks.addRow({
        stt: idx + 1,
        project_id: t.project_id,
        project_title: t.project_title || '---',
        title: t.title,
        assignee_name: t.assignee_name || 'Chưa giao',
        status: t.status,
        deadline: t.deadline ? new Date(t.deadline) : null,
        task_status: taskStatus
      });

      row.height = 20;
      row.getCell('deadline').numFmt = 'dd/mm/yyyy';

      const statusCell = row.getCell('task_status');
      if (taskStatus === 'Quá hạn') {
        statusCell.font = { color: { argb: 'DC2626' }, bold: true };
      } else if (taskStatus === 'Hoàn thành') {
        statusCell.font = { color: { argb: '16A34A' }, bold: true };
      }
    });

    wsTasks.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Segoe UI', size: 10 };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          };
          if (['stt', 'project_id', 'status', 'deadline', 'task_status'].includes(wsTasks.columns[colNumber - 1].key)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Bao_cao_tien_do_du_an.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
};

module.exports = ReportService;
