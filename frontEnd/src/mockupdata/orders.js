export const mockOrders = [
    {
        id: "PO-2026-001",
        projectName: "Trung tâm Tư vấn tuyển sinh - ĐH Hàng Hải (VMU)",
        status: "Mới",
        totalAmount: 45000000,
        orderDate: "10/05/2026",
        expectedDate: "15/05/2026",
        receiver: "Nguyễn Trọng Vinh - 0987.868.142",
        address: "Khu A, Đại học Hàng hải Việt Nam, Lạch Tray, Hải Phòng",
        items: [
            { sku: "VT-NBS3100-24P", name: "Switch Ruijie RG-NBS3100-24GT4SFP-P", qty: 2, price: 7850000 },
            { sku: "VT-CS-CAT6-BL", name: "Cáp mạng Commscope Cat6 UTP", qty: 10, price: 3450000 }
        ]
    },
    {
        id: "PO-2026-002",
        projectName: "Văn phòng làm việc Vinh Quang - Khu công nghiệp Nam Cầu Kiền",
        status: "Đang giao",
        totalAmount: 12500000,
        orderDate: "08/05/2026",
        expectedDate: "12/05/2026",
        receiver: "Trần Văn A - 0904.123.456",
        address: "Lô CN1, KCN Nam Cầu Kiền, Thủy Nguyên, Hải Phòng",
        items: [
            { sku: "VT-ES105GD", name: "Switch Reyee RG-ES105GD", qty: 5, price: 350000 },
            { sku: "VT-RACK-6U", name: "Tủ Rack 6U-D400 e-Teck", qty: 3, price: 650000 }
        ]
    }
];