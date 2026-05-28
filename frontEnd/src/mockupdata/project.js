export const mockProjects = [
    {
        id: "PRJ01",
        title: "Lắp đặt hạ tầng mạng - Regina Miracle Factory",
        progress: 75,
        deadline: "20/05/2026",
        tasks: "15/20",
        status: "Triển khai lắp đặt"
    },
    {
        id: "PRJ02",
        title: "Nâng cấp Camera giám sát - Samsung Electronics",
        progress: 93,
        deadline: "30/04/2026",
        tasks: "28/30",
        status: "Bàn giao và nghiệm thu"
    },
    {
        id: "PRJ03",
        title: "Triển khai Wifi diện rộng - Deep C Industrial Zone",
        progress: 20,
        deadline: "15/06/2026",
        tasks: "2/10",
        status: "Khảo sát và lập kế hoạch"
    },
    {
        id: "PRJ04",
        title: "Hệ thống ELV & Camera - LG Display Hải Phòng",
        progress: 8,
        deadline: "10/05/2026",
        tasks: "1/12",
        status: "Mua thiết bị và lập báo giá"
    },
    {
        id: "PRJ05",
        title: "Bảo trì định kỳ Server - Haengsung Electronics",
        progress: 50,
        deadline: "05/05/2026",
        tasks: "5/10",
        status: "Kí hợp đồng/đơn đặt hàng"
    },
    {
        id: "PRJ06",
        title: "Hệ thống tổng đài IP - Menkar Co., Ltd",
        progress: 100,
        deadline: "15/04/2026",
        tasks: "8/8",
        status: "Hoàn thành"
    }
];

export const projectDetails = {
    "PRJ01": {
        // --- Dữ liệu cho Tab Hồ sơ ---
        profile: {
            title: "Lắp đặt hạ tầng mạng - Regina Miracle Factory",
            description: "Cung cấp & lắp đặt Palo Alto Firewall, Cisco L3/L2 Switches, phụ kiện cho Nhà máy D. Đảm bảo kết nối ổn định cho dây chuyền sản xuất mới.",
            category: "An ninh, kiểm soát truy cập",
            startDate: "05/05/2026",
            endDate: "20/05/2026",
            status: "Triển khai lắp đặt",
            progress: 75,
            completedTasks: 15, // Số công việc đã hoàn thành
            totalTasks: 20, // Tổng số công việc
            members: [
                { name: "Phan Hoàng Nam", role: "Trưởng nhóm" },
                { name: "Lê Minh Tú", role: "Kỹ thuật trưởng" },
                { name: "Nguyễn Đức Mạnh", role: "Kỹ thuật viên" },
                { name: "Đặng Thanh Tùng", role: "Giám sát an toàn" },
                { name: "Bùi Xuân Bách", role: "Cấu hình mạng" }
            ],
            documents: ["HopdongRegina.pdf", "SodomangD.dwg", "Baogiathietbi.xlsx", "Bien_ban_khao_sat.pdf"]
        },
        currentStep: 2,
        // --- Dữ liệu cho Tab Phân công việc ---
        assignments: [
            {
                step: "Bước 1: Khảo sát và lập kế hoạch",
                tasks: [
                    {
                        title: "Khảo sát site và lập sơ đồ hạ tầng",
                        assignee: "Phan Hoàng Nam",
                        deadline: "10/04/2026",
                        file: "SodositeD.dwg",
                        status: "Đã duyệt"
                    },
                    {
                        title: "Lập bản dự toán khối lượng (BOQ)",
                        assignee: "Lê Minh Tú",
                        deadline: "12/04/2026",
                        file: "BOQ-Regina.xlsx",
                        status: "Đã duyệt"
                    }
                ]
            },
            {
                step: "Bước 2: Mua thiết bị và lập báo giá",
                tasks: [
                    {
                        title: "Liên hệ nhà cung cấp vật tư, thiết bị",
                        assignee: "Bùi Xuân Bách",
                        deadline: "15/04/2026",
                        file: "BOM-Regina.xlsx",
                        status: "Đã nộp"
                    }
                ]
            },
            {
                step: "Bước 3: Xác nhận thỏa thuận",
                tasks: [
                    {}
                ]
            },
            {
                step: "Bước 4: Triển khai lắp đặt",
                tasks: [
                    {}
                ]
            },
            {
                step: "Bước 5: Bàn giao và nghiệm thu",
                tasks: [
                    {}
                ]
            },
            {
                step: "Bước 6: Thanh toán",
                tasks: [
                    {}
                ]
            }
        ]
    }
};