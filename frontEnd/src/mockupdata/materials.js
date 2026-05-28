export const mockMaterials = [
    // --- NC001: VNPT Hải Phòng  ---
    {
        id: "M001", sku: "VT-VNPT-1FO", name: "Cáp quang 1FO bọc chặt VNPT", brand: "VNPT", category: "Cáp & Dây dẫn", uom: "mét", price: 3500, status: "Sẵn sàng",
        image: "https://vienthongnet.com/wp-content/uploads/Cuon-cap-boc-chat-1fo.jpg", supplierCode: "NC001",
        specs: "1 Sợi quang Singlemode, có dây gia cường hợp kim, bọc ruột gà chống gập gãy.",
        description: "Phù hợp chạy luồn cống ngầm hoặc kéo nhánh cho hệ thống mạng LAN/WAN nội bộ khu công nghiệp."
    },
    {
        id: "M002", sku: "VT-VNPT-WF6", name: "Modem quang GPON iGate VNPT", brand: "VNPT", category: "Thiết bị mạng", uom: "cái", price: 1250000, status: "Sẵn sàng",
        image: "https://www.vnpt-technology.vn/storage/photos/shares/ONT/020H%20black%20(2).png", supplierCode: "NC001",
        specs: "Chuẩn AX3000, Băng tần kép 2.4/5GHz, 4 cổng Gigabit LAN.",
        description: "Thiết bị đầu cuối mạng quang (ONT) cao cấp do VNPT Technology sản xuất, chịu tải 40-50 thiết bị."
    },
    {
        id: "M003", sku: "VT-VNPT-POE8", name: "Switch PoE 8 Port chuyên dụng", brand: "TP-Link", category: "Thiết bị mạng", uom: "cái", price: 2100000, status: "Hết hàng",
        image: "https://tanphat.com.vn/media/lib/01-11-2023/switchtp-linktl-sg1008p-2.jpg", supplierCode: "NC001",
        specs: "8 Port Gigabit PoE+ 802.3at/af, tổng công suất 120W, 2 Uplink SFP.",
        description: "Cấp nguồn trực tiếp qua cáp mạng cho hệ thống Camera IP hoặc Access Point công suất cao."
    },
    {
        id: "M004", sku: "VT-VNPT-BOX", name: "SmartBox 2 VNPT (Android TV)", brand: "VNPT", category: "Thiết bị mạng", uom: "bộ", price: 1450000, status: "Sẵn sàng",
        image: "https://www.vnpt-technology.vn/storage/photos/shares/01_prd_vnpt_technology/prd/SMARTBOX/smb-2/800x800-smb-2-01.png", supplierCode: "NC001",
        specs: "CPU Quad-core, RAM 2GB, ROM 16GB, Android TV 10, Hỗ trợ 4K.",
        description: "Giải mã tín hiệu truyền hình, giải trí và họp trực tuyến cho các phòng họp doanh nghiệp."
    },
    {
        id: "M005", sku: "VT-VNPT-MESH", name: "Bộ phát Wifi Mesh VNPT", brand: "VNPT", category: "Thiết bị mạng", uom: "cái", price: 950000, status: "Sẵn sàng",
        image: "https://www.vnpt-technology.vn/storage/photos/shares/AnhSP_new/EW302S/800x800_1.png", supplierCode: "NC001",
        specs: "Wifi 5 AC1200, Roaming liền mạch chuẩn 802.11k/v, 2 cổng LAN Gigabit.",
        description: "Mở rộng vùng phủ sóng mạng không dây cho nhà xưởng mà không bị gián đoạn tín hiệu."
    },

    // --- NC002: Viettel Hải Phòng ---
    {
        id: "M006", sku: "VT-VTL-2FO", name: "Cáp quang 2FO Viettel cường lực", brand: "Viettel", category: "Cáp & Dây dẫn", uom: "mét", price: 4200, status: "Sẵn sàng",
        image: "https://fasttel.vn/wp-content/uploads/2022/04/cap-quang-2fo-ong-long-2-1.jpg", supplierCode: "NC002",
        specs: "Cáp treo số 8, 2 lõi quang Singlemode, dây treo thép cường lực mạ kẽm.",
        description: "Sử dụng kéo mạng ngoài trời qua các cột điện nội bộ trong KCN."
    },
    {
        id: "M007", sku: "VT-VTL-H196A", name: "Home Wifi Viettel H196A", brand: "ZTE", category: "Thiết bị mạng", uom: "cái", price: 850000, status: "Ngừng cung cấp",
        image: "https://viettel-digital.com/wp-content/uploads/2024/03/ZTE-H196A-01.jpg", supplierCode: "NC002",
        specs: "Chuẩn AC1200, Anten ngầm 3dBi, hỗ trợ cấu hình EasyMesh.",
        description: "Hệ thống Home Wifi đời cũ của Viettel, hiện đã ngừng kinh doanh để chuyển sang chuẩn Wifi 6."
    },
    {
        id: "M008", sku: "VT-VTL-MODEM", name: "Modem Wifi 2 băng tần Viettel", brand: "Huawei", category: "Thiết bị mạng", uom: "cái", price: 1100000, status: "Sẵn sàng",
        image: "https://media.vietteltelecom.vn/upload/ckfinder/images/Homewifi/modem-Wifi-Viettel-ZTE-ZXHN-F670L-va-F670Y-gan-giong-nhau.jpg", supplierCode: "NC002",
        specs: "Dual-band 2.4/5GHz, 4 cổng Gigabit, quang chuẩn APC.",
        description: "Thiết bị cấp đường truyền chính từ trạm trạm Viettel vào doanh nghiệp."
    },
    {
        id: "M009", sku: "VT-VTL-CAM", name: "Camera IP Viettel vCam", brand: "Viettel", category: "Thiết bị mạng", uom: "cái", price: 950000, status: "Sẵn sàng",
        image: "https://viettel-digital.com/wp-content/uploads/2022/01/Camera-HC3-02.jpg", supplierCode: "NC002",
        specs: "Độ phân giải 2MP (1080p), hỗ trợ AI phát hiện chuyển động, lưu trữ Cloud.",
        description: "Giải pháp an ninh thông minh kết nối trực tiếp với hạ tầng mạng Viettel."
    },

    // --- NC003: Công ty TNHH Menkar ---
    {
        id: "M010", sku: "VT-DRAY-2962", name: "Router Draytek Vigor 2962", brand: "Draytek", category: "Thiết bị mạng", uom: "cái", price: 6500000, status: "Sẵn sàng",
        image: "https://npp.com.vn/wp-content/uploads/2023/11/2962-600x600.jpg", supplierCode: "NC003",
        specs: "1 Port 2.5G WAN/LAN, 1 Port SFP, 2 Port Gigabit LAN. Khả năng chịu tải 300 user.",
        description: "Thiết bị cân bằng tải (Load Balancing) cao cấp, định tuyến mạng chính cho phân xưởng."
    },
    {
        id: "M011", sku: "VT-RUI-3100-24", name: "Switch Ruijie RG-NBS3100-24GT4SFP", brand: "Ruijie", category: "Thiết bị mạng", uom: "bộ", price: 4600000, status: "Sẵn sàng",
        image: "https://vuhoangtelecom.vn/wp-content/uploads/2024/05/poe-switch-24-cong-ruijie-rg-nbs3100-24gt4sfp-p-v2-1.jpg", supplierCode: "NC003",
        specs: "24 Port 10/100/1000Mbps, 4 Port SFP quang Gigabit, Quản lý Cloud L2.",
        description: "Switch chia mạng tốc độ cao có khả năng cấu hình VLAN và quản trị qua Ruijie Cloud."
    },
    {
        id: "M012", sku: "VT-RUI-3100-8P", name: "Switch PoE Ruijie RG-NBS3100-8GT2SFP-P", brand: "Ruijie", category: "Thiết bị mạng", uom: "bộ", price: 3450000, status: "Sẵn sàng",
        image: "https://wifi.com.vn/media/product/2634_switch_ruijie_nbs3100_8gt2sfp_00.jpg", supplierCode: "NC003",
        specs: "8 Port PoE/PoE+ (125W), 2 Port SFP. Hỗ trợ chống sét 6KV.",
        description: "Thiết bị chuyển mạch cấp nguồn chuyên dụng cho hệ thống Wifi Access Point của nhà máy."
    },
    {
        id: "M013", sku: "VT-GNC-2111S", name: "Bộ chuyển đổi quang điện GNC-2111S-20A/B", brand: "GNetCom", category: "Thiết bị mạng", uom: "bộ", price: 1500000, status: "Sẵn sàng",
        image: "https://cdn.hstatic.net/products/200000593419/gnc-2111s-20b__2__0e4efc067026486eb522a530eac8cccb.jpg", supplierCode: "NC003",
        specs: "Tốc độ 10/100/1000Mbps, 1 sợi quang (WDM), khoảng cách 20km.",
        description: "Dùng để chuyển đổi tín hiệu từ cáp quang sang cáp đồng LAN RJ45 tại các tủ nhánh."
    },
    {
        id: "M014", sku: "VT-TMC-10U", name: "Tủ Rack 10U D600", brand: "TMC", category: "Phụ kiện", uom: "chiếc", price: 2350000, status: "Sẵn sàng",
        image: "https://www.tmcrack.vn/vn/wp-content/uploads/2017/07/10-12u-den.jpg", supplierCode: "NC003",
        specs: "Kích thước H625 x W550 x D600mm. Thép SPCC 1.2mm, sơn tĩnh điện.",
        description: "Tủ mạng treo tường hoặc để sàn, đi kèm quạt tản nhiệt và ổ cắm nguồn 6 port."
    },

    // --- NC004: FPT Telecom Hải Phòng ---
    {
        id: "M015", sku: "VT-RUCK-R320", name: "Access Point RUCKUS R320", brand: "Ruckus", category: "Thiết bị mạng", uom: "cái", price: 8200000, status: "Sẵn sàng",
        image: "https://s3.amazonaws.com/ruckus-support/public/product_images/255/large/18122_R320_GLAM_LF.png?1548885764", supplierCode: "NC004",
        specs: "Wifi 5 802.11ac Wave 2, 2x2:2, Công nghệ BeamFlex+ chống nhiễu.",
        description: "Thiết bị phát Wifi chuyên dụng cho môi trường mật độ cao, chịu tải lên đến 256 client."
    },
    {
        id: "M016", sku: "VT-ARU-AP11", name: "Access Point Aruba Instant On AP11", brand: "Aruba", category: "Thiết bị mạng", uom: "cái", price: 2450000, status: "Sẵn sàng",
        image: "https://down-vn.img.susercontent.com/file/d767776ffa86a6a0c943b08c708dc35b.webp", supplierCode: "NC004",
        specs: "Băng tần kép 2.4/5GHz (1167 Mbps), quản lý miễn phí qua App Aruba.",
        description: "Giải pháp phát sóng Wifi ổn định dành cho văn phòng và khu vực sảnh chờ."
    },
    {
        id: "M017", sku: "VT-FPT-PLAY", name: "FPT Play Box+", brand: "FPT", category: "Thiết bị mạng", uom: "bộ", price: 1690000, status: "Sẵn sàng",
        image: "https://fptbox.store/wp-content/uploads/2020/06/fpt-box-2020.png", supplierCode: "NC004",
        specs: "Hệ điều hành Android TV 10, Điều khiển giọng nói Tiếng Việt.",
        description: "Cung cấp nền tảng truyền hình và giải trí trình chiếu màn hình lớn cho doanh nghiệp."
    },
    {
        id: "M018", sku: "VT-FPT-MESH", name: "AC1200 FPT Mesh Access Point", brand: "FPT", category: "Thiết bị mạng", uom: "cái", price: 1200000, status: "Hết hàng",
        image: "https://fptwifi.com.vn/wp-content/uploads/access-point-ac1200C.png", supplierCode: "NC004",
        specs: "Băng thông 1200Mbps, tạo mạng lưới Wifi hợp nhất tự động chuyển vùng.",
        description: "Đồng bộ hạ tầng viễn thông FPT, giúp phủ sóng các khu vực sóng yếu."
    },
    {
        id: "M019", sku: "VT-FPT-CAM", name: "FPT Camera IQ", brand: "FPT", category: "Thiết bị mạng", uom: "cái", price: 1300000, status: "Sẵn sàng",
        image: "https://fpt-camera.vn/wp-content/uploads/2025/04/fpt-camera-iq4s.png", supplierCode: "NC004",
        specs: "Cảm biến Sony 1080p, kháng nước IP66, lưu trữ Cloud FPT an toàn.",
        description: "Camera giám sát tích hợp AI nhận diện khuôn mặt."
    },

    // --- NC005: Công ty TNHH Dây cáp điện Hải Phòng (Vật tư phụ, điện, cáp) ---
    {
        id: "M020", sku: "VT-CAD-2X25", name: "Dây điện 2x2.5 Cadisun", brand: "Cadisun", category: "Cáp & Dây dẫn", uom: "mét", price: 26500, status: "Sẵn sàng",
        image: "https://media.meta.vn/Data/image/2025/03/15/day-dien-doi-cadisun-vctfk-2x2-5mm2.jpg", supplierCode: "NC005",
        specs: "Cáp đồng bọc PVC, tiết diện lõi 2x2.5mm2, chống cháy lan.",
        description: "Kéo đường cấp nguồn AC 220V cho các tủ Rack tại phân xưởng."
    },
    {
        id: "M021", sku: "VT-VINA-4FO", name: "Cáp quang Vinacap 4FO SingleMode", brand: "Vinacap", category: "Cáp & Dây dẫn", uom: "mét", price: 8800, status: "Sẵn sàng",
        image: "https://vienthongxanh.cdn.vccloud.vn/wp-content/uploads/2024/09/Cap-quang-dem-chat-1FO-2FO-HDPRO-Day-dep-trong-nha-Single-mode-1000x1000.jpg", supplierCode: "NC005",
        specs: "Cáp quang luồn cống ống lỏng, 4 sợi quang, có màng ngăn nước phi kim loại.",
        description: "Truyền tải tín hiệu quang trục chính (Backbone) giữa các xưởng sản xuất."
    },
    {
        id: "M022", sku: "VT-COM-CAT5E", name: "Cáp mạng Commscope Cat5e UTP", brand: "Commscope", category: "Cáp & Dây dẫn", uom: "thùng", price: 2850000, status: "Sẵn sàng",
        image: "https://viethansecurity.com/media/product/9190_day_cap_mang_chong_nhieu_amp_commscope_cat_5e_ftp_avt.jpg", supplierCode: "NC005",
        specs: "Cáp mạng 4 đôi không chống nhiễu, lõi đồng đặc 24AWG. Chiều dài 305m/thùng.",
        description: "Kéo dây mạng LAN nội bộ tới các máy tính và máy in văn phòng."
    },
    {
        id: "M023", sku: "VT-COM-CAT6", name: "Cáp mạng Commscope Cat6 UTP", brand: "Commscope", category: "Cáp & Dây dẫn", uom: "thùng", price: 3450000, status: "Sẵn sàng",
        image: "https://viethansecurity.com/media/product/3881_cap_mang_amp_commscope_cat6_chinh_hang__.jpg", supplierCode: "NC005",
        specs: "Cáp mạng băng thông 250MHz, lõi đồng 23AWG có lõi chữ thập phân tách. 305m/thùng.",
        description: "Hệ thống cáp truyền tải tốc độ Gigabit ổn định, độ bền 20 năm."
    },
    {
        id: "M024", sku: "VT-SINO-D25", name: "Ống cứng SP D25", brand: "Sino", category: "Phụ kiện", uom: "mét", price: 11700, status: "Sẵn sàng",
        image: "https://hecico.com.vn/wp-content/uploads/2021/07/sino-d25.png", supplierCode: "NC005",
        specs: "Ống luồn dây điện PVC chống cháy D25mm, chịu lực nén cao.",
        description: "Bảo vệ cáp quang, cáp mạng và dây nguồn khi đi dọc vách tường."
    },
    {
        id: "M025", sku: "VT-PANA-32A", name: "Aptomat 2 cực 32A", brand: "Panasonic", category: "Thiết bị điện", uom: "cái", price: 155000, status: "Sẵn sàng",
        image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/468/866/products/attomat32a.png?v=1756374996767", supplierCode: "NC005",
        specs: "MCB 2P 32A, dòng cắt 6kA, tự động ngắt khi quá tải hoặc ngắn mạch.",
        description: "Aptomat tổng bảo vệ hệ thống tủ điện viễn thông."
    },

    // --- NC006: Techlink (Cisco, Patch Panel) ---
    {
        id: "M026", sku: "VT-CIS-C1000-24", name: "Switch Cisco C1000-24T-4G-L", brand: "Cisco", category: "Thiết bị mạng", uom: "bộ", price: 12500000, status: "Sẵn sàng",
        image: "https://thietbimangcisco.vn/images/product/goc/goc_1580873563.jpg", supplierCode: "NC006",
        specs: "24 Cổng 10/100/1000 Gigabit, 4 Cổng SFP 1G uplink. Switch Layer 2 được quản lý.",
        description: "Thiết bị chia mạng lõi ổn định tuyệt đối dành cho hệ thống doanh nghiệp FDI."
    },
    {
        id: "M027", sku: "VT-CIS-C1000-8P", name: "Switch Cisco C1000-8P-E-2G-L", brand: "Cisco", category: "Thiết bị mạng", uom: "bộ", price: 8500000, status: "Sẵn sàng",
        image: "https://www.metapoint.in/assets/upload_images/product/1626953869_11.png", supplierCode: "NC006",
        specs: "8 Cổng Gigabit PoE (67W), 2 Cổng SFP/RJ45 combo. Tản nhiệt không quạt (Fanless).",
        description: "Switch PoE chia nhánh để lắp Access Point Aruba hoặc Cisco."
    },
    {
        id: "M028", sku: "VT-COM-PATCH24", name: "Patch panel 24 port Commscope", brand: "Commscope", category: "Phụ kiện", uom: "bộ", price: 2500000, status: "Sẵn sàng",
        image: "https://vienthongxanh.cdn.vccloud.vn/wp-content/uploads/2017/07/Patch-Panel-24-Port-COMMSCOPE-CAT6-760237040-1.jpg", supplierCode: "NC006",
        specs: "Thanh đấu nối cáp mạng 24 cổng RJ45 Cat6, chuẩn 19 inch gắn tủ Rack, kèm thanh quản lý cáp.",
        description: "Làm gọn và quản lý đầu cáp mạng tập trung tại tủ trung tâm."
    },
    {
        id: "M029", sku: "VT-COM-RJ45", name: "Hạt mạng RJ45 Commscope Cat6", brand: "Commscope", category: "Phụ kiện", uom: "hộp", price: 550000, status: "Hết hàng",
        image: "https://vienthongquangthang.com/wp-content/uploads/2021/07/dau-bam-mang-commscope-cat6-1-1200x1200.jpg", supplierCode: "NC006",
        specs: "Đầu nối RJ45 Cat6 bọc kim loại chống nhiễu, chân mạ vàng 50 micron (100 hạt/hộp).",
        description: "Dùng để bấm các đầu nối cáp mạng tiếp xúc cao."
    },
    {
        id: "M030", sku: "VT-COM-CORD3M", name: "Dây nhảy mạng Patch cord 3m", brand: "Commscope", category: "Cáp & Dây dẫn", uom: "sợi", price: 95000, status: "Sẵn sàng",
        image: "https://newstartech.com.vn/wp-content/uploads/2023/06/cat6-2m.jpg", supplierCode: "NC006",
        specs: "Dây nhảy cáp đồng Cat6 đúc sẵn, dài 3 mét, lõi nhiều sợi mềm dẻo.",
        description: "Nối tín hiệu từ Patch panel xuống Switch mạng."
    },

    // --- NC007: Hitron (Phụ kiện quang) ---
    {
        id: "M031", sku: "VT-ODF-4P", name: "ODF 4 port Gắn rack", brand: "No Brand", category: "Phụ kiện", uom: "cái", price: 610000, status: "Sẵn sàng",
        image: "https://vienthongxanh.cdn.vccloud.vn/wp-content/uploads/2017/02/ODF-48Fo_3.jpg", supplierCode: "NC007",
        specs: "Hộp phối quang ODF 4FO, vỏ thép sơn tĩnh điện, đầy đủ khay hàn, ống co nhiệt và Adapter SC.",
        description: "Bảo vệ mối hàn quang kết nối từ đường cáp trục vào thiết bị."
    },
    {
        id: "M032", sku: "VT-FIBER-SC-LC", name: "Dây nhảy quang SingleMode SC-LC", brand: "No Brand", category: "Phụ kiện", uom: "chiếc", price: 95000, status: "Sẵn sàng",
        image: "https://vienthongquangthang.com/wp-content/uploads/2021/06/day-nhay-quang-singlemode-sc-lc-upc-day-don-1-1200x1200.jpg", supplierCode: "NC007",
        specs: "Dây quang màu vàng, dài 3 mét, 1 đầu SC cắm ODF, 1 đầu LC cắm module SFP.",
        description: "Kết nối quang học tốc độ cao từ hộp ODF đến Switch tổng."
    },
    {
        id: "M033", sku: "VT-MEDIA-1000", name: "Bộ chuyển đổi quang điện 1G", brand: "GFiber", category: "Thiết bị mạng", uom: "chiếc", price: 1725000, status: "Sẵn sàng",
        image: "https://thietbivienthong.vn/wp-content/uploads/2025/07/Bo-chuyen-doi-quang-dien-1G-SFP-Media-Converter-GF-MCGE-SFP-5.jpg", supplierCode: "NC007",
        specs: "Tốc độ 1Gbps, khoảng cách 20km, giao diện quang SC, giao diện điện RJ45.",
        description: "Tương thích 100% với các hệ thống hạ tầng quang cũ của nhà máy."
    },
    {
        id: "M034", sku: "VT-FIBER-DROP", name: "Dây thuê bao cáp quang 4FO (ống lỏng)", brand: "No Brand", category: "Cáp & Dây dẫn", uom: "mét", price: 6500, status: "Ngừng cung cấp",
        image: "https://thietbivienthong.vn/wp-content/uploads/2024/11/day-thue-bao-quang-4Fo-dem-chat-cap-quang-4FO-boc-chat-1.jpg", supplierCode: "NC007",
        specs: "Cáp quang dẹt 4 sợi, lõi ống lỏng bảo vệ sợi quang tốt hơn.",
        description: "Mã sản phẩm cũ, đang được thay thế dần bởi Cáp Vinacap."
    },
    {
        id: "M035", sku: "VT-FIBER-TOOL", name: "Bộ dụng cụ thi công quang", brand: "Hitron", category: "Phụ kiện", uom: "bộ", price: 1250000, status: "Sẵn sàng",
        image: "https://phuongdung.com/upload/baiviet/bodungcuthicongcapquang5mon1601634309-7150.jpg", supplierCode: "NC007",
        specs: "Gồm dao cắt sợi quang FC-6S, kìm tuốt cáp, bút soi quang 10km, đồng hồ đo công suất.",
        description: "Trang bị cho kỹ thuật viên e-Teck đi thi công thực địa."
    }
];