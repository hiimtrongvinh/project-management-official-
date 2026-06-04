const projectDetails = window.projectDetails || {};

export function renderTabVattuDuan(projectId, role) {
    const project = window.projectDetails?.[projectId];
    const projectMaterials = project && project.materials ? project.materials : [];
    const isClient = role === 'client';

    let totalMaterialsSell = 0;
    projectMaterials.forEach(item => {
        const sellPrice = item.priceBuy * (1 + item.markup / 100);
        totalMaterialsSell += sellPrice * item.quantity;
    });
    const laborFee = project?.profile?.laborFee || 0;
    const grandTotal = totalMaterialsSell + laborFee;
    const formattedLaborFee = laborFee ? new Intl.NumberFormat('vi-VN').format(laborFee) : '';

    const groupedData = projectMaterials.reduce((acc, item) => {
        if (!acc[item.supplier]) acc[item.supplier] = { status: item.status, items: [] };
        acc[item.supplier].items.push({ ...item, isMock: false });
        return acc;
    }, {});

    const statusBadge = (status) => {
        if (status === 'Đã giao hàng' || status === 'Hoàn thành') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'Đang giao') return 'bg-orange-50 text-orange-700 border-orange-200';
        if (status === 'Đã xác nhận') return 'bg-purple-50 text-purple-700 border-purple-200';
        if (status === 'Chờ chốt đơn' || status === 'Đang xử lý') return 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'Chưa đặt hàng') return 'bg-gray-100 text-gray-700 border-gray-200';
        if (status === 'Mới') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (status === 'Đã hủy') return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-gray-50 text-gray-600 border-gray-200';
    };

    const rowsHtml = isClient
        ? (projectMaterials.length > 0
            ? (projectMaterials.map(item => {
                const sellPrice = item.priceBuy * (1 + item.markup / 100);
                const totalSell = sellPrice * item.quantity;
                return `
                    <tr class="border-b border-gray-50 hover:bg-blue-50/30 transition text-sm text-gray-700 bg-white">
                        <td class="px-5 py-3.5 font-semibold text-gray-800 truncate" title="${item.name}">${item.name}</td>
                        <td class="px-4 py-3.5 text-center font-bold text-gray-700">${item.quantity}</td>
                        <td class="px-4 py-3.5 text-gray-600">${sellPrice.toLocaleString()}đ</td>
                        <td class="px-4 py-3.5 font-bold text-blue-600">${totalSell.toLocaleString()}đ</td>
                    </tr>`;
            }).join('') + `
                <tr class="border-b border-gray-100 bg-gray-50/30 font-semibold text-sm text-gray-700">
                    <td class="px-5 py-3 text-gray-800" colspan="3">Chi phí nhân công (e-Teck)</td>
                    <td class="px-4 py-3 font-bold text-blue-600">${laborFee.toLocaleString()}đ</td>
                </tr>
                <tr class="bg-blue-50/30 font-extrabold border-t-2 border-blue-100">
                    <td class="px-5 py-4 text-blue-800 text-sm" colspan="3">TỔNG CỘNG BÁO GIÁ</td>
                    <td class="px-4 py-4 text-blue-700 text-base font-black">${grandTotal.toLocaleString()}đ</td>
                </tr>
            `)
            : `<tr><td colspan="4" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                    <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i class="fas fa-box-open text-xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 font-semibold text-sm">Chưa có báo giá nào</p>
                </div>
            </td></tr>`)
        : (Object.keys(groupedData).length > 0
            ? (Object.entries(groupedData).map(([supplierName, group]) => {
                return `
                <tr class="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-y border-gray-100">
                    <td colspan="7" class="p-0">
                        <div class="flex justify-between items-center w-full px-5 py-3">
                            <span class="font-bold text-sm text-gray-700 flex items-center gap-2">
                                <i class="fas fa-truck text-blue-400 text-xs"></i>
                                NCC: <span class="text-blue-700">${supplierName}</span>
                            </span>
                            <div class="flex items-center gap-2.5">
                                <span class="text-xs font-bold px-3 py-1 rounded-full border ${statusBadge(group.status)}">${group.status}</span>
                                ${group.status === 'Chưa đặt hàng' ? `
                                    <button onclick="window.placeOrderForSupplier('${projectId}', '${supplierName}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all shadow-sm">
                                        <i class="fas fa-shopping-cart text-[9px]"></i> Đặt hàng
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </td>
                </tr>
                ${group.items.map(item => {
                    const pBuy = `${item.priceBuy.toLocaleString()}đ`;
                    const pTotalBuy = `${(item.priceBuy * item.quantity).toLocaleString()}đ`;
                    const pTotalSell = `${(item.priceBuy * (1 + item.markup / 100) * item.quantity).toLocaleString()}đ`;

                    return `
                        <tr class="border-b border-gray-50 hover:bg-blue-50/30 transition text-sm text-gray-700 bg-white group" data-id="${item.id}" data-price-buy="${item.priceBuy}">
                            <td class="px-5 py-3.5">
                                <p class="font-semibold text-gray-800 truncate hover:text-blue-600 transition cursor-pointer" title="${item.name}">${item.name}</p>
                            </td>
                            <td class="px-4 py-3.5 text-gray-600">${pBuy}</td>
                            <td class="px-4 py-3.5 text-center">
                                <input type="number" value="${item.quantity}" min="1" oninput="window.recalculateRow(this)" class="vattu-qty-input w-14 px-2 py-1 bg-gray-50 text-gray-800 focus:border-blue-400 border border-gray-200 rounded-lg text-center font-bold focus:outline-none text-sm transition-all">
                            </td>
                            <td class="vattu-total-buy px-4 py-3.5 font-medium text-gray-700">${pTotalBuy}</td>
                            <td class="px-4 py-3.5 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <input type="number" value="${item.markup}" min="0" max="100" oninput="window.recalculateRow(this)" class="vattu-markup-input w-12 px-1.5 py-1 bg-gray-50 text-blue-600 focus:border-blue-400 border border-gray-200 rounded-lg text-center font-bold focus:outline-none text-sm">
                                    <span class="text-blue-500 font-bold text-xs">%</span>
                                </div>
                            </td>
                            <td class="vattu-total-sell px-4 py-3.5 font-bold text-blue-600">${pTotalSell}</td>
                            <td class="px-2 py-3.5 text-center">
                                <button onclick="event.stopPropagation(); window.handleDeleteProjectItem('${projectId}', '${item.id}')" 
                                        class="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </td>
                        </tr>`;
                }).join('')}`;
            }).join('') + `
                <tr class="bg-gray-50/40 border-t border-gray-200 font-semibold text-sm">
                    <td class="px-5 py-3.5 text-gray-800" colspan="5">Chi phí nhân công (e-Teck)</td>
                    <td class="px-4 py-3.5 font-bold text-blue-600">
                        <div class="flex items-center gap-1 justify-start">
                            <input type="text" id="vattuProjectLaborFee" value="${formattedLaborFee}" 
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.'); window.recalculateGrandTotal()"
                                   class="w-32 px-2 py-1 bg-gray-50 text-blue-600 focus:border-blue-400 border border-gray-200 rounded-lg text-right font-extrabold focus:outline-none text-sm transition-all">
                            <span class="text-blue-500 font-bold text-xs">đ</span>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr class="bg-blue-50/30 font-extrabold border-t-2 border-blue-100">
                    <td class="px-5 py-4 text-blue-800 text-sm" colspan="5">Tổng cộng</td>
                    <td class="px-4 py-4 text-blue-700 text-base font-black" id="vattuGrandTotalCell">${grandTotal.toLocaleString()}đ</td>
                    <td></td>
                </tr>
            `)
            : `<tr><td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                    <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i class="fas fa-box-open text-xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 font-semibold text-sm">Chưa có vật tư nào</p>
                    <p class="text-gray-400 text-xs mt-1">Bấm "Chọn vật tư từ kho" để thêm</p>
                </div>
            </td></tr>`);

    let clientQuotationControlHtml = '';
    const clientQuotations = project?.clientQuotations || [];
    if (isClient) {
        const pendingQuo = clientQuotations.find(q => q.status === 'pending' || q.status === 'draft') || clientQuotations[0];
        if (pendingQuo) {
            const statusMap = {
                'approved': { text: 'Đã duyệt', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                'Đã duyệt': { text: 'Đã duyệt', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                'rejected': { text: 'Đã từ chối', class: 'bg-red-50 text-red-700 border-red-200' },
                'Từ chối': { text: 'Đã từ chối', class: 'bg-red-50 text-red-700 border-red-200' },
                'pending': { text: 'Chờ duyệt', class: 'bg-amber-50 text-amber-700 border-amber-200' },
                'Chờ duyệt': { text: 'Chờ duyệt', class: 'bg-amber-50 text-amber-700 border-amber-200' },
                'draft': { text: 'Bản nháp', class: 'bg-gray-50 text-gray-700 border-gray-200' },
            };
            const currentStatus = statusMap[pendingQuo.status] || { text: pendingQuo.status, class: 'bg-gray-50 text-gray-700 border-gray-200' };

            const documentsList = project?.documentsList || [];
            const docTypes = [
                {
                    key: 'contract',
                    doc: documentsList.find(d => d.file_name && d.file_name.includes('Hợp đồng kinh tế')),
                    title: 'Hợp đồng kinh tế song ngữ',
                    subtitle: 'Bilingual Purchasing Contract',
                    icon: 'fa-file-contract',
                    colorClass: 'bg-purple-50/50 border-purple-100 text-purple-700 hover:bg-purple-100/50',
                    badgeColor: 'bg-purple-100 text-purple-700',
                    ext: 'HTML'
                },
                {
                    key: 'handover',
                    doc: documentsList.find(d => d.file_name && d.file_name.includes('Biên bản bàn giao')),
                    title: 'Biên bản bàn giao & Bảo hành',
                    subtitle: 'Delivery Note & Warranty',
                    icon: 'fa-file-signature',
                    colorClass: 'bg-emerald-50/50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50',
                    badgeColor: 'bg-emerald-100 text-emerald-700',
                    ext: 'Excel'
                },
                {
                    key: 'acceptance',
                    doc: documentsList.find(d => d.file_name && d.file_name.includes('Biên bản nghiệm thu')),
                    title: 'Biên bản nghiệm thu',
                    subtitle: 'Acceptance Note',
                    icon: 'fa-clipboard-check',
                    colorClass: 'bg-teal-50/50 border-teal-100 text-teal-700 hover:bg-teal-100/50',
                    badgeColor: 'bg-teal-100 text-teal-700',
                    ext: 'Excel'
                },
                {
                    key: 'payment1',
                    doc: documentsList.find(d => d.file_name && d.file_name.includes('Đề nghị thanh toán đợt 1')),
                    title: 'Đề nghị thanh toán Đợt 1',
                    subtitle: 'Payment Request Phase 1 (40%)',
                    icon: 'fa-file-invoice-dollar',
                    colorClass: 'bg-blue-50/50 border-blue-100 text-blue-700 hover:bg-blue-100/50',
                    badgeColor: 'bg-blue-100 text-blue-700',
                    ext: 'Word'
                },
                {
                    key: 'payment2',
                    doc: documentsList.find(d => d.file_name && d.file_name.includes('Đề nghị thanh toán đợt 2')),
                    title: 'Đề nghị thanh toán Đợt 2',
                    subtitle: 'Payment Request Phase 2 (60%)',
                    icon: 'fa-file-invoice-dollar',
                    colorClass: 'bg-indigo-50/50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50',
                    badgeColor: 'bg-indigo-100 text-indigo-700',
                    ext: 'Word'
                }
            ];

            const activeDocs = docTypes.filter(d => d.doc);
            let docsGridHtml = '';

            if (activeDocs.length > 0) {
                const cardsHtml = activeDocs.map(d => {
                    const viewTitle = d.title.replace(/'/g, "\\'");
                    return `
                        <div class="${d.colorClass} border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all animate-fadeIn">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
                                    <i class="fas ${d.icon} text-base"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="font-extrabold text-gray-800 text-sm truncate">${d.title}</p>
                                    <p class="text-[10px] text-gray-400 font-medium truncate">${d.subtitle}</p>
                                    <div class="flex items-center gap-1.5 mt-1">
                                        <span class="px-2 py-0.5 rounded-full ${d.badgeColor} text-[9px] font-bold">Đã thiết lập</span>
                                        <span class="px-1.5 py-0.5 rounded-full bg-white/80 text-gray-500 text-[8px] font-bold uppercase border border-gray-200/50">${d.ext}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-1.5 flex-shrink-0 ml-2">
                                <button onclick="window.handleViewDocumentPreview('${projectId}', '${d.doc.file_path}', '${viewTitle}')" class="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1 border border-gray-200/60" title="Xem trực tuyến">
                                    <i class="fas fa-eye text-[10px]"></i> Xem
                                </button>
                                <a href="/${d.doc.file_path}" target="_blank" download class="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-xl transition-all shadow-sm border border-gray-200/60 flex items-center justify-center" title="Tải xuống tệp tin">
                                    <i class="fas fa-download text-xs"></i>
                                </a>
                            </div>
                        </div>
                    `;
                }).join('');

                docsGridHtml = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        ${cardsHtml}
                    </div>
                `;
            }

            clientQuotationControlHtml = `
                <div class="flex flex-col gap-2">
                    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <i class="fas fa-file-invoice-dollar"></i>
                            </div>
                            <div>
                                <p class="font-extrabold text-gray-800 text-sm">Báo giá của bạn</p>
                                <p class="text-xs text-gray-400 font-medium">Trạng thái: <span class="px-2 py-0.5 rounded-full border text-[10px] ${currentStatus.class}">${currentStatus.text}</span></p>
                            </div>
                        </div>
                        ${(pendingQuo.status === 'pending' || pendingQuo.status === 'draft') ? `
                            <div class="flex gap-2">
                                <button onclick="window.handleUpdateQuotationStatus('${projectId}', '${pendingQuo.id}', 'approved')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all">
                                    <i class="fas fa-check mr-1"></i> Duyệt báo giá
                                </button>
                                <button onclick="window.handleUpdateQuotationStatus('${projectId}', '${pendingQuo.id}', 'rejected')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all">
                                    <i class="fas fa-times mr-1"></i> Từ chối
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    ${docsGridHtml}
                </div>`;
        } else {
            clientQuotationControlHtml = `
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                    <p class="text-xs text-gray-400 italic">Chưa có báo giá khách hàng nào được gửi.</p>
                </div>`;
        }
    }

    const isSendQuoDisabled = project.currentStep !== 2;
    const isCreateContractDisabled = project.currentStep < 2;
    const isHandoverDisabled = project.currentStep < 3;
    const isAcceptanceDisabled = project.currentStep < 3;
    const isPayment1Disabled = !documentsList.some(d => d.file_name && d.file_name.includes('Hợp đồng kinh tế'));
    const isPayment2Disabled = !documentsList.some(d => d.file_name && d.file_name.includes('Hợp đồng kinh tế')) || !documentsList.some(d => d.file_name && d.file_name.includes('Biên bản nghiệm thu'));

    const controlsHtml = isClient
        ? ''
        : `<div class="flex flex-wrap justify-end items-center gap-2.5 pt-2 flex-shrink-0">
            <button onclick="saveVattuChanges('${projectId}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md">
                <i class="fas fa-save"></i> Lưu thay đổi
            </button>
            <button onclick="openSideDrawerChonVattu('${projectId}')" class="btn-primary text-xs px-4 py-2.5 flex items-center gap-2">
                <i class="fas fa-plus"></i> Chọn vật tư từ kho
            </button>
            <button onclick="window.handleSendQuotation('${projectId}')" 
                    ${isSendQuoDisabled ? 'disabled' : ''} 
                    class="${isSendQuoDisabled ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'} px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                <i class="fas fa-paper-plane"></i> Gửi báo giá ${project.currentStep > 2 ? '(Đã gửi)' : ''}
            </button>
            
            <!-- Dropdown Hồ sơ / Chứng từ -->
            <div class="relative inline-block text-left" id="docActionsDropdown">
                <button onclick="window.toggleDocDropdown(event)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md">
                    <i class="fas fa-file-alt"></i> Hồ sơ / Chứng từ <i class="fas fa-chevron-up text-[10px]"></i>
                </button>
                <div id="docDropdownMenu" class="hidden absolute right-0 bottom-full mb-2 w-64 rounded-2xl shadow-xl bg-white border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2 space-y-1">
                    <button onclick="window.handleCreateContract('${projectId}')" 
                            ${isCreateContractDisabled ? 'disabled' : ''} 
                            class="w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition hover:bg-slate-50 text-gray-700 ${isCreateContractDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}">
                        <i class="fas fa-file-contract w-4 text-purple-600 text-center"></i> Lập hợp đồng
                    </button>
                    <button onclick="window.handleCreateHandover('${projectId}')" 
                            ${isHandoverDisabled ? 'disabled' : ''} 
                            class="w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition hover:bg-slate-50 text-gray-700 ${isHandoverDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}">
                        <i class="fas fa-file-signature w-4 text-emerald-600 text-center"></i> Lập biên bản bàn giao (Excel)
                    </button>
                    <button onclick="window.handleCreateAcceptance('${projectId}')" 
                            ${isAcceptanceDisabled ? 'disabled' : ''} 
                            class="w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition hover:bg-slate-50 text-gray-700 ${isAcceptanceDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}">
                        <i class="fas fa-clipboard-check w-4 text-teal-600 text-center"></i> Lập biên bản nghiệm thu (Excel)
                    </button>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button onclick="window.handleCreatePaymentRequest('${projectId}', 1)" 
                            ${isPayment1Disabled ? 'disabled' : ''} 
                            class="w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition hover:bg-slate-50 text-gray-700 ${isPayment1Disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}">
                        <i class="fas fa-file-invoice-dollar w-4 text-blue-600 text-center"></i> ĐNTT Đợt 1 (40% - Word)
                    </button>
                    <button onclick="window.handleCreatePaymentRequest('${projectId}', 2)" 
                            ${isPayment2Disabled ? 'disabled' : ''} 
                            class="w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition hover:bg-slate-50 text-gray-700 ${isPayment2Disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}">
                        <i class="fas fa-file-invoice-dollar w-4 text-indigo-600 text-center"></i> ĐNTT Đợt 2 (60% - Word)
                    </button>
                </div>
            </div>
        </div>`;

    return `
    <div class="h-full flex flex-col justify-between overflow-hidden min-h-0 space-y-4 animate-fadeIn">
        ${clientQuotationControlHtml}
        <div class="flex-1 overflow-y-auto border border-gray-200 rounded-2xl custom-scrollbar min-h-0 bg-white shadow-sm">
            <table class="w-full text-left border-collapse table-fixed">
                <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide sticky top-0 z-10 border-b border-gray-200">
                    ${isClient ? `
                        <tr>
                            <th class="px-5 py-3.5 w-[50%]">Vật tư</th>
                            <th class="px-4 py-3.5 w-[15%] text-center">SL</th>
                            <th class="px-4 py-3.5 w-[15%]">Đơn giá bán</th>
                            <th class="px-4 py-3.5 w-[20%]">Thành tiền bán</th>
                        </tr>
                    ` : `
                        <tr>
                            <th class="px-5 py-3.5 w-[32%]">Vật tư</th>
                            <th class="px-4 py-3.5 w-[13%]">Đơn giá</th>
                            <th class="px-4 py-3.5 w-[10%] text-center">SL</th>
                            <th class="px-4 py-3.5 w-[14%]">Thành tiền</th>
                            <th class="px-4 py-3.5 w-[10%] text-center">Lợi nhuận</th>
                            <th class="px-4 py-3.5 w-[14%]">Báo giá KH</th>
                            <th class="px-2 py-3.5 w-[7%]"></th>
                        </tr>
                    `}
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
        ${controlsHtml}
    </div>`;
}

window.handleUpdateQuotationStatus = async function (projectId, quotationId, status) {
    const actionText = status === 'approved' ? 'phê duyệt' : 'từ chối';
    if (!await window.showConfirm(`Bạn có chắc muốn ${actionText} báo giá này?`)) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/quotation-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        const result = await res.json();
        if (result.success) {
            window.showToast(`✅ Đã ${actionText} báo giá thành công!`, 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role);
            const tabBtn = document.getElementById('tab-vattuduan');
            if (tabBtn) tabBtn.click();
        } else {
            window.showToast('❌ Thất bại: ' + (result.error?.message || 'Có lỗi xảy ra.'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    }
};

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200';
    if (url.startsWith('/uploads')) {
        return `${url}`;
    }
    return url;
};

window.openSideDrawerChonVattu = async function (projectId) {
    let warehouseMaterials = [];
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/materials', { headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        if (result.success) warehouseMaterials = result.data;
    } catch (err) { console.error('Lỗi tải vật tư:', err); }

    const drawer = document.createElement('div');
    drawer.id = "drawerChonVattu";
    drawer.className = "fixed inset-0 z-[120] overflow-hidden";

    const itemsListHtml = warehouseMaterials.slice(0, 15).map(m => {
        const escapedMaterial = JSON.stringify(m).replace(/'/g, "\\'").replace(/"/g, "&quot;");
        return `
        <div class="bg-white border border-gray-100 p-3 rounded-xl flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all group">
            <img src="${getImageUrl(m.image_url || m.image)}" alt="${m.name}" class="w-10 h-10 object-contain rounded-lg border border-gray-100 flex-shrink-0 p-1">
            <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-800 text-xs truncate group-hover:text-blue-600 transition-colors">${m.name}</p>
                <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">${m.brand || 'N/A'}</span>
                    <span class="text-xs font-bold text-blue-600">${(parseFloat(m.price) || 0).toLocaleString()}đ</span>
                </div>
            </div>
            <button onclick="window.addMaterialToProject('${projectId}', '${escapedMaterial}')" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all text-xs flex-shrink-0">
                <i class="fas fa-plus"></i>
            </button>
        </div>`;
    }).join('');

    drawer.innerHTML = `
        <div onclick="this.closest('.fixed').remove()" class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"></div>
        <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slideInRight border-l border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h4 class="text-sm font-extrabold text-gray-800">Kho vật tư</h4>
                    <p class="text-[10px] text-gray-400">${warehouseMaterials.length} sản phẩm</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center transition">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
            <div class="p-4 border-b border-gray-50">
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input type="text" placeholder="Tìm kiếm vật tư..." class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-xs focus:outline-none focus:border-blue-400 transition-all">
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">${itemsListHtml || '<p class="text-gray-400 text-center py-8 text-xs">Không có vật tư</p>'}</div>
            <div class="p-4 border-t border-gray-100">
                <button onclick="this.closest('.fixed').remove()" class="w-full btn-primary py-2.5 text-xs text-center">
                    Xong
                </button>
            </div>
        </div>`;
    document.body.appendChild(drawer);
};

window.addMaterialToProject = async function (projectId, materialStr) {
    try {
        const material = JSON.parse(materialStr.replace(/&quot;/g, '"'));
        const token = localStorage.getItem('token');
        const bodyData = {
            project_id: projectId,
            material_id: material.id,
            quantity: 1,
            markup: 10
        };

        const res = await fetch('/api/orders/project-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(bodyData)
        });
        const result = await res.json();
        if (result.success) {
            window.showToast(`✅ Đã thêm "${material.name}" vào dự án (Chưa đặt hàng)!`);
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role);
            const tabBtn = document.getElementById('tab-vattuduan');
            if (tabBtn) tabBtn.click();
        } else {
            window.showToast('❌ Thêm thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        console.error('Lỗi khi thêm vật tư:', err);
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    }
};

window.recalculateGrandTotal = function () {
    const trs = document.querySelectorAll('tr[data-id]');
    let totalMaterialsSell = 0;
    trs.forEach(tr => {
        const priceBuy = parseFloat(tr.getAttribute('data-price-buy') || 0);
        const qty = parseInt(tr.querySelector('.vattu-qty-input')?.value || 0);
        const markup = parseInt(tr.querySelector('.vattu-markup-input')?.value || 0);
        totalMaterialsSell += priceBuy * (1 + markup / 100) * qty;
    });
    const laborFeeInput = document.getElementById('vattuProjectLaborFee');
    const laborFee = laborFeeInput ? parseInt(laborFeeInput.value.replace(/[^0-9]/g, '')) || 0 : 0;

    const grandTotal = totalMaterialsSell + laborFee;
    const grandTotalCell = document.getElementById('vattuGrandTotalCell');
    if (grandTotalCell) grandTotalCell.textContent = grandTotal.toLocaleString() + 'đ';
};

window.recalculateRow = function (input) {
    const tr = input.closest('tr');
    if (!tr) return;

    const priceBuy = parseFloat(tr.getAttribute('data-price-buy') || 0);
    const qtyInput = tr.querySelector('.vattu-qty-input');
    const markupInput = tr.querySelector('.vattu-markup-input');

    const quantity = parseInt(qtyInput?.value || 1);
    const markup = parseInt(markupInput?.value || 0);

    const totalBuy = priceBuy * quantity;
    const totalSell = priceBuy * (1 + markup / 100) * quantity;

    const totalBuyTd = tr.querySelector('.vattu-total-buy');
    const totalSellTd = tr.querySelector('.vattu-total-sell');

    if (totalBuyTd) totalBuyTd.textContent = totalBuy.toLocaleString() + 'đ';
    if (totalSellTd) totalSellTd.textContent = totalSell.toLocaleString() + 'đ';
    window.recalculateGrandTotal();
};

window.saveVattuChanges = async function (projectId) {
    const trs = document.querySelectorAll('tr[data-id]');
    const laborFeeInput = document.getElementById('vattuProjectLaborFee');
    const laborFee = laborFeeInput ? parseInt(laborFeeInput.value.replace(/[^0-9]/g, '')) || 0 : 0;

    const token = localStorage.getItem('token');
    let hasError = false;

    // Hiển thị loading nhẹ
    const saveBtn = document.querySelector('button[onclick^="saveVattuChanges"]');
    const originalHtml = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    try {
        // Lưu labor_fee của dự án trước
        const projectRes = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ labor_fee: laborFee })
        });
        const projectResult = await projectRes.json();
        if (!projectResult.success) {
            hasError = true;
            console.error(`Lỗi cập nhật tiền công dự án:`, projectResult.error?.message);
        }

        const promises = Array.from(trs).map(async (tr) => {
            const id = tr.getAttribute('data-id');
            const qtyInput = tr.querySelector('.vattu-qty-input');
            const markupInput = tr.querySelector('.vattu-markup-input');

            const quantity = parseInt(qtyInput?.value || 1);
            const markup = parseInt(markupInput?.value || 0);

            const res = await fetch(`/api/orders/project-item/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity, markup })
            });
            const result = await res.json();
            if (!result.success) {
                hasError = true;
                console.error(`Lỗi cập nhật item ${id}:`, result.error?.message);
            }
        });

        await Promise.all(promises);

        if (hasError) {
            window.showToast('⚠️ Một số vật tư cập nhật bị lỗi. Vui lòng kiểm tra lại!', 'warning');
        } else {
            window.showToast('✅ Đã lưu tất cả thay đổi thành công!', 'success');
        }

        // Tải lại chi tiết dự án để cập nhật dữ liệu mới nhất
        if (typeof window.openProjectDetail === 'function') {
            const role = localStorage.getItem('authRole');
            await window.openProjectDetail(projectId, role, 'vattuduan');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalHtml;
        }
    }
};

window.placeOrderForSupplier = async function (projectId, supplierName) {
    const project = window.projectDetails?.[projectId];
    const projectMaterials = project && project.materials ? project.materials : [];

    // Filter unordered items for this supplier
    const unordered = projectMaterials.filter(item => item.supplier === supplierName && item.status === 'Chưa đặt hàng');
    if (unordered.length === 0) {
        window.showToast('Không có vật tư chưa đặt hàng nào cho nhà cung cấp này!', 'warning');
        return;
    }

    const supplierId = unordered[0].supplier_id;
    const itemsList = unordered.map(item => ({
        material_id: item.material_id,
        quantity: item.quantity,
        markup: item.markup
    }));

    const totalValue = unordered.reduce((sum, item) => sum + (item.priceBuy * item.quantity), 0);

    // Render custom modal dialog for receiver & address details
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/10 flex items-center justify-center z-[150] p-4 backdrop-blur-md";
    modal.id = "placeOrderModal";

    // Get project members as options
    const members = project?.profile?.members || [];
    const memberOptionsHtml = members.map(m => `
        <option value="${m.id}">${m.name} (${m.role || 'Thành viên'})</option>
    `).join('') || `
        <option value="">-- Chọn thành viên nhận hàng --</option>
    `;

    // Default address is the client's project address
    const defaultAddress = project?.client_address || 'Văn phòng dự án e-Teck';

    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-lg overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleIn">
        <div class="px-8 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex justify-between items-center relative z-10 flex-shrink-0">
            <div class="flex items-center gap-3">
                <i class="fas fa-shopping-cart text-lg"></i>
                <h3 class="text-lg font-black">Đặt hàng vật tư</h3>
            </div>
            <button onclick="document.getElementById('placeOrderModal').remove()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div class="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nhà cung cấp</p>
                <p class="text-base font-black text-blue-700">${supplierName}</p>
                <div class="mt-4 pt-3 border-t border-blue-100/50 flex justify-between items-center">
                    <span class="text-sm font-semibold text-gray-600">Tổng giá trị đơn hàng:</span>
                    <span class="text-lg font-black text-gray-800">${totalValue.toLocaleString('vi-VN')} <small class="text-xs font-normal">đ</small></span>
                </div>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Người nhận đại diện (e-Teck Staff)</label>
                    <div class="relative">
                        <select id="orderReceiverId" class="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-bold text-gray-700 cursor-pointer">
                            ${memberOptionsHtml}
                        </select>
                        <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Địa chỉ giao hàng (Delivery Address)</label>
                    <input type="text" id="orderDeliveryAddress" value="${defaultAddress}" 
                           placeholder="Nhập địa chỉ giao nhận vật tư..." 
                           class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-semibold text-gray-700 transition-all">
                </div>
            </div>
        </div>

        <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
            <button onclick="document.getElementById('placeOrderModal').remove()" class="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition">
                Hủy
            </button>
            <button id="btnConfirmPlaceOrder" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition">
                Xác nhận đặt hàng
            </button>
        </div>
    </div>`;

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);

    // Setup submit logic
    document.getElementById('btnConfirmPlaceOrder').onclick = async () => {
        const receiverId = document.getElementById('orderReceiverId').value;
        const address = document.getElementById('orderDeliveryAddress').value.trim();

        if (!receiverId) {
            window.showToast('Vui lòng chọn người nhận đại diện!', 'warning');
            return;
        }
        if (!address) {
            window.showToast('Vui lòng nhập địa chỉ giao hàng!', 'warning');
            return;
        }

        const confirmBtn = document.getElementById('btnConfirmPlaceOrder');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Đang gửi đơn...';

        try {
            const token = localStorage.getItem('token');
            const bodyData = {
                project_id: projectId,
                supplier_id: supplierId,
                receiver_id: receiverId,
                address: address,
                status: 'Mới',
                total_value: totalValue,
                items: itemsList
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            });
            const result = await res.json();

            modal.remove();

            if (result.success) {
                window.showToast('✅ Đã đặt hàng thành công! Đơn đặt hàng mới đã được gửi đến nhà cung cấp.', 'success');
                const role = localStorage.getItem('authRole');
                const { openProjectDetail } = await import('./chitietduan.js');
                await openProjectDetail(projectId, role);
                const tabBtn = document.getElementById('tab-vattuduan');
                if (tabBtn) tabBtn.click();
            } else {
                window.showToast('❌ Đặt hàng thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
            }
        } catch (err) {
            modal.remove();
            window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
        }
    };
};


window.handleDeleteProjectItem = async function (projectId, projectItemId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn xóa vật tư này khỏi dự án?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/project-item/${projectItemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Đã xóa vật tư thành công!', 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role);
            const tabBtn = document.getElementById('tab-vattuduan');
            if (tabBtn) tabBtn.click();
        } else {
            window.showToast('❌ Xóa thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    }
};

window.handleSendQuotation = async function (projectId) {
    if (!await window.showConfirm('Xác nhận gửi báo giá này cho Khách hàng? Dự án sẽ tự động chuyển sang Bước 3 (Xác nhận thỏa thuận).')) return;

    const sendBtn = document.querySelector('button[onclick^="window.handleSendQuotation"]');
    const originalHtml = sendBtn ? sendBtn.innerHTML : '';
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/send-quotation`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Đã gửi báo giá thành công tới khách hàng!', 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role, 'vattuduan');
        } else {
            window.showToast('❌ Gửi báo giá thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    } finally {
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalHtml;
        }
    }
};

window.handleCreateContract = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn lập Hợp đồng kinh tế song ngữ cho dự án này dựa trên danh mục vật tư hiện tại?')) return;

    const contractBtn = document.querySelector('button[onclick^="window.handleCreateContract"]');
    const originalHtml = contractBtn ? contractBtn.innerHTML : '';
    if (contractBtn) {
        contractBtn.disabled = true;
        contractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang khởi tạo...';
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/contract`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Đã khởi tạo Hợp đồng kinh tế song ngữ thành công!', 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role, 'vattuduan');
        } else {
            window.showToast('❌ Lập hợp đồng thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message);
    } finally {
        if (contractBtn) {
            contractBtn.disabled = false;
            contractBtn.innerHTML = originalHtml;
        }
    }
};

window.handleViewContract = function (projectId, filePath) {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/10 flex items-center justify-center z-[200] p-4 backdrop-blur-md";
    modal.id = "contractPreviewModal";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl h-[90vh] overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
        <div class="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex justify-between items-center relative z-10 flex-shrink-0">
            <div class="flex items-center gap-3">
                <i class="fas fa-file-contract text-xl"></i>
                <h3 class="text-base font-extrabold">Hợp đồng mua bán song ngữ - HD-${projectId}</h3>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="window.printContract()" class="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition">
                    <i class="fas fa-print"></i> In / Xuất PDF
                </button>
                <button onclick="document.getElementById('contractPreviewModal').remove()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="flex-1 overflow-y-auto p-2 bg-gray-100 flex justify-center custom-scrollbar">
            <iframe id="contractIframe" src="/${filePath}" style="width: 100%; height: 100%; border: none; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);"></iframe>
        </div>
    </div>`;

    window.printContract = function () {
        const iframe = document.getElementById('contractIframe');
        if (iframe) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }
    };

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.toggleDocDropdown = function (event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('docDropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

// Close dropdown on click outside
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('docDropdownMenu');
    const btn = document.querySelector('button[onclick^="window.toggleDocDropdown"]');
    if (dropdown && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

window.handleCreateHandover = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn lập Biên bản bàn giao kiêm bảo hành (Excel) cho dự án này dựa trên danh mục vật tư hiện tại?')) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/handover`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Đã lập Biên bản bàn giao kiêm bảo hành thành công!', 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role, 'vattuduan');
        } else {
            window.showToast('❌ Lập biên bản thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
    }
};

window.handleCreateAcceptance = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn lập Biên bản nghiệm thu (Excel) cho dự án này dựa trên danh mục vật tư hiện tại?')) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/acceptance`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Đã lập Biên bản nghiệm thu thành công!', 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role, 'vattuduan');
        } else {
            window.showToast('❌ Lập biên bản thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
    }
};

window.handleCreatePaymentRequest = async function (projectId, phase) {
    if (!await window.showConfirm(`Bạn có chắc chắn muốn lập Đề nghị thanh toán Đợt ${phase} (Word) cho dự án này?`)) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/payment-request`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phase })
        });
        const result = await res.json();
        if (result.success) {
            window.showToast(`✅ Đã lập Đề nghị thanh toán Đợt ${phase} thành công!`, 'success');
            const role = localStorage.getItem('authRole');
            const { openProjectDetail } = await import('./chitietduan.js');
            await openProjectDetail(projectId, role, 'vattuduan');
        } else {
            window.showToast('❌ Lập đề nghị thanh toán thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
    }
};

window.handleViewDocumentPreview = function (projectId, filePath, viewTitle) {
    const ext = filePath.split('.').pop().toLowerCase();
    if (ext === 'html') {
        window.handleViewContract(projectId, filePath);
    } else {
        const fileName = filePath.split('/').pop();
        window.previewDocument(filePath, fileName);
    }
};
