(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const ot={departments:"Phòng ban/Nhóm",priorities:"Mức độ ưu tiên",taskStatuses:"Trạng thái công việc",projectTypes:"Phân loại dự án",projectStatuses:"Trạng thái dự án"};let He={};async function rt(){try{const e=localStorage.getItem("token"),t=await(await fetch("http://localhost:3000/api/categories",{headers:{Authorization:`Bearer ${e}`}})).json();t.success&&(He=t.data)}catch(e){console.error("Lỗi tải danh mục:",e)}}function lt(e){return`
    <div class="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-xl group transition-all hover:bg-gray-100" data-id="${e.id}">
        <span class="text-base font-medium text-gray-700">${e.value}</span>
        <div class="flex gap-3 opacity-0 group-hover:opacity-100 transition">
            <button onclick="editItem(${e.id}, '${e.value.replace(/'/g,"\\'")}')" class="text-blue-600 hover:text-blue-700 text-xs"><i class="fas fa-pen"></i></button>
            <button onclick="deleteItem(${e.id})" class="text-red-600 hover:text-red-700 text-xs"><i class="fas fa-trash"></i></button>
        </div>
    </div>`}function it(e,a,t){const n=a.map(lt).join("");return`
    <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 break-inside-avoid mb-5">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">${e}</h2>
            <button onclick="addItem('${t}')" class="text-blue-600 hover:text-blue-700"><i class="fas fa-plus-circle text-xl"></i></button>
        </div>
        <div class="space-y-2" id="${t}-list">
            ${n}
        </div>
    </div>`}function ct(){return`
    <div class="max-w-7xl mx-auto h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Quản lý danh mục</h1>
        </div>
        <div id="categoryContainer" class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-5">
            <div class="text-gray-400 text-center py-10">Đang tải danh mục...</div>
        </div>
    </div>`}async function X(){await rt();const e=document.getElementById("categoryContainer");if(!e)return;let a="";for(const[t,n]of Object.entries(ot)){const s=He[t]||[];a+=it(n,s,t)}e.innerHTML=a}window.editItem=async(e,a)=>{var n;const t=prompt("Nhập giá trị mới:",a);if(!(!t||t.trim()===""||t.trim()===a))try{const s=localStorage.getItem("token"),r=await(await fetch(`http://localhost:3000/api/categories/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({value:t.trim()})})).json();r.success?X():alert("❌ Lỗi: "+(((n=r.error)==null?void 0:n.message)||"Không thể sửa"))}catch(s){alert("❌ Lỗi kết nối: "+s.message)}};window.deleteItem=async e=>{var a;if(confirm("Bạn có chắc muốn xóa mục này?"))try{const t=localStorage.getItem("token"),s=await(await fetch(`http://localhost:3000/api/categories/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).json();s.success?X():alert("❌ Lỗi: "+(((a=s.error)==null?void 0:a.message)||"Không thể xóa"))}catch(t){alert("❌ Lỗi kết nối: "+t.message)}};window.addItem=async e=>{var t;const a=prompt("Nhập mục mới:");if(!(!a||a.trim()===""))try{const n=localStorage.getItem("token"),o=await(await fetch("http://localhost:3000/api/categories",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({group_name:e,value:a.trim()})})).json();o.success?X():alert("❌ Lỗi: "+(((t=o.error)==null?void 0:t.message)||"Không thể thêm"))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};const dt=["Chờ phê duyệt","Khảo sát và lập kế hoạch","Mua thiết bị và lập báo giá","Xác nhận thỏa thuận","Triển khai lắp đặt","Bàn giao và nghiệm thu","Thanh toán","Hoàn thành"],Se={"Chờ phê duyệt":{bg:"bg-rose-50",text:"text-rose-700",border:"border-rose-200",dot:"bg-rose-500"},"Khảo sát và lập kế hoạch":{bg:"bg-indigo-50",text:"text-indigo-700",border:"border-indigo-200",dot:"bg-indigo-500"},"Mua thiết bị và lập báo giá":{bg:"bg-amber-50",text:"text-amber-700",border:"border-amber-200",dot:"bg-amber-500"},"Xác nhận thỏa thuận":{bg:"bg-cyan-50",text:"text-cyan-700",border:"border-cyan-200",dot:"bg-cyan-500"},"Triển khai lắp đặt":{bg:"bg-blue-50",text:"text-blue-700",border:"border-blue-200",dot:"bg-blue-500"},"Bàn giao và nghiệm thu":{bg:"bg-purple-50",text:"text-purple-700",border:"border-purple-200",dot:"bg-purple-500"},"Thanh toán":{bg:"bg-orange-50",text:"text-orange-700",border:"border-orange-200",dot:"bg-orange-500"},"Hoàn thành":{bg:"bg-emerald-50",text:"text-emerald-700",border:"border-emerald-200",dot:"bg-emerald-500"}};let fe=[];async function me(){try{const e=localStorage.getItem("token"),a=await fetch("http://localhost:3000/api/projects?limit=100",{headers:{Authorization:`Bearer ${e}`}}),t=await a.json();a.ok&&t.success&&(fe=t.data,oe(fe))}catch(e){console.error("Lỗi tải danh sách dự án:",e)}}window.fetchProjectsFromServer=me;function ut(){return`
    <div class="max-w-7xl mx-auto animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col lg:flex-row lg:flex-nowrap justify-between items-start lg:items-center gap-4 animate-fadeInDown">
            <!-- Left: Title & Description -->
            <div class="flex items-center gap-4 flex-shrink-0">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-rocket text-blue-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Quản lý dự án</h1>
                </div>
            </div>

            <!-- Middle: Sleek Stats Pill Badges centered horizontally -->
            <div class="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 flex-grow" id="projectStats"></div>

            <!-- Right: Action Buttons aligned beautifully -->
            ${window.getAuthRole&&window.getAuthRole()==="admin"?`
            <div class="flex flex-wrap lg:flex-nowrap items-center gap-3 flex-shrink-0 justify-end">
                <button onclick="exportExcel()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                    <i class="fas fa-file-excel"></i> Xuất Excel
                </button>
                <button onclick="addProject()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                    <i class="fas fa-plus"></i> Thêm dự án
                </button>
            </div>`:""}
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 relative z-20 animate-fadeInUp backdrop-blur-sm">
            <div class="flex flex-wrap gap-3 items-center">
                <div class="flex-1 min-w-[260px] relative group">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="text" id="searchDuan" oninput="handleProjectFilter()" 
                           placeholder="Tìm kiếm dự án theo tên..." 
                           class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
                </div>
                <div class="relative">
                    <select id="filterDeadline" onchange="handleProjectFilter()" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-medium cursor-pointer min-w-[160px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả hạn chót</option>
                        <option value="quahan">🔴 Quá hạn</option>
                        <option value="homnay">🟡 Hôm nay</option>
                        <option value="tuannay">🔵 Tuần này</option>
                        <option value="thangnay">🟢 Tháng này</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
                <div class="relative">
                    <select id="filterStatus" onchange="handleProjectFilter()" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-medium cursor-pointer min-w-[190px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả trạng thái</option>
                        ${dt.map(a=>`<option value="${a}">${a}</option>`).join("")}
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
            </div>
        </div>

        <!-- Project Cards Grid -->
        <div id="projectCards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
    </div>`}function oe(e=null){if(e===null){me();return}pt(e);const a=document.getElementById("projectCards");if(!a)return;if(e.length===0){a.innerHTML=`
        <div class="col-span-full py-20 text-center animate-fadeIn">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-folder-open text-3xl text-gray-300"></i>
            </div>
            <p class="text-gray-500 font-semibold text-lg">Không tìm thấy dự án nào</p>
            <p class="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo dự án mới</p>
        </div>`;return}let t="";e.forEach((n,s)=>{const o=Se[n.status]||Se["Khảo sát và lập kế hoạch"],r=n.member_count||0,l=n.end_date?new Date(n.end_date).toLocaleDateString("vi-VN"):"Chưa đặt",i=n.total_tasks||0,c=n.approved_tasks||0,d=n.progress||0,p=n.end_date&&new Date(n.end_date)<new Date&&n.status!=="Hoàn thành",u=p?"bg-red-500":d>=75?"bg-emerald-500":d>=40?"bg-blue-500":"bg-amber-500";let g="";const h=typeof n.members_json=="string"?JSON.parse(n.members_json||"[]"):n.members_json||[],b=["bg-blue-500","bg-emerald-500","bg-purple-500","bg-amber-500","bg-pink-500"];h.slice(0,4).forEach((x,f)=>{if(x.avatar)g+=`<div class="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 overflow-hidden shadow-sm shadow-gray-200/50" title="${x.name}">
                    <img src="http://localhost:3000${x.avatar}" alt="${x.name}" class="w-full h-full object-cover">
                </div>`;else{const v=x.name?x.name.charAt(0).toUpperCase():"?";g+=`<div class="w-8 h-8 ${b[f%b.length]} rounded-full border-2 border-white flex items-center justify-center -ml-2 first:ml-0 shadow-sm text-xs text-white font-bold" title="${x.name}">
                    ${v}
                </div>`}}),r>4&&(g+=`<div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center -ml-2 text-[10px] font-bold text-gray-600 shadow-sm">+${r-4}</div>`),t+=`
        <div onclick="openProjectDetail('${n.id}')" 
             class="bg-white rounded-3xl p-6 border border-transparent hover:border-blue-200 transition-all cursor-pointer hover:shadow-md group animate-fadeInUp relative"
             style="animation-delay: ${s*.05}s; animation-fill-mode: both;">
            
            <h3 class="font-bold text-lg mb-2 line-clamp-2 min-h-[52px] text-gray-800 group-hover:text-blue-700 transition-colors">${n.title}</h3>
            
            <div class="flex items-center mb-4">
                <div class="flex">
                    ${g||'<span class="text-xs text-gray-400">Chưa có thành viên</span>'}
                </div>
            </div>

            <div class="flex items-center justify-between mb-4">
                <span class="px-4 py-1 text-xs font-bold ${o.bg} ${o.text} border ${o.border} rounded-xl">
                    ${n.status}
                </span>
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                    <span>${l}</span>
                </div>
            </div>

            <div class="mb-4">
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full ${u} rounded-full transition-all duration-700" style="width: ${d}%"></div>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm font-bold">
                <span class="${p?"text-red-600":"text-blue-600"}">${d}% hoàn thành</span>
                <span class="text-gray-400 font-medium">${c}/${i} công việc</span>
            </div>
        </div>`}),a.className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",a.innerHTML=t,typeof Sortable<"u"&&Sortable.create(a,{animation:250,ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",easing:"cubic-bezier(0.25, 1, 0.5, 1)",delay:150,delayOnTouchOnly:!0})}function pt(e){const a=document.getElementById("projectStats");if(!a)return;const t=e.length,n=e.filter(r=>r.status!=="Hoàn thành").length,s=e.filter(r=>r.status==="Hoàn thành").length,o=e.filter(r=>r.end_date&&new Date(r.end_date)<new Date&&r.status!=="Hoàn thành").length;a.innerHTML=`
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span>Tổng: <strong class="text-gray-800 ml-0.5">${t}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Đang thực hiện: <strong class="text-amber-800 ml-0.5">${n}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Hoàn thành: <strong class="text-emerald-800 ml-0.5">${s}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700 transition-all hover:bg-red-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
            <span>Quá hạn: <strong class="text-red-800 ml-0.5">${o}</strong></span>
        </div>
    `}window.handleProjectFilter=function(){var o,r,l;const e=((o=document.getElementById("searchDuan"))==null?void 0:o.value.toLowerCase().trim())||"",a=((r=document.getElementById("filterStatus"))==null?void 0:r.value.trim())||"",t=((l=document.getElementById("filterDeadline"))==null?void 0:l.value)||"",n=new Date;n.setHours(0,0,0,0);const s=fe.filter(i=>{const c=i.title.toLowerCase().includes(e),d=a===""||i.status.trim()===a;let p=!0;if(t!=="")if(!i.end_date)p=!1;else{const u=new Date(i.end_date);if(u.setHours(0,0,0,0),t==="quahan")p=u<n&&i.status.trim()!=="Hoàn thành";else if(t==="homnay")p=u.getTime()===n.getTime();else if(t==="tuannay"){const g=n.getDay()===0?7:n.getDay(),h=new Date(n);h.setDate(n.getDate()+(7-g)),p=u>=n&&u<=h}else t==="thangnay"&&(p=u.getMonth()===n.getMonth()&&u.getFullYear()===n.getFullYear())}return c&&d&&p});oe(s)};window.addProject=async function(){let e=[];try{const n=localStorage.getItem("token"),o=await(await fetch("http://localhost:3000/api/users/clients?limit=100",{headers:{Authorization:`Bearer ${n}`}})).json();e=o.success?o.data:[]}catch(n){console.error("Lỗi tải khách hàng:",n)}const a=new Date().toISOString().split("T")[0],t=document.createElement("div");t.id="addProjectModal",t.className="fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4",t.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col p-8 animate-scaleUp">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-2xl font-extrabold text-gray-800">Tạo dự án mới</h3>
                <p class="text-sm text-gray-400 mt-0.5">Điền thông tin để khởi tạo dự án</p>
            </div>
            <button onclick="document.getElementById('addProjectModal').remove()" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <i class="fas fa-times text-gray-500"></i>
            </button>
        </div>

        <form id="newProjectForm" class="space-y-4" onsubmit="submitNewProject(event)">
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Tên dự án *</label>
                <input type="text" id="newProjTitle" required placeholder="Nhập tên dự án..." 
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 transition-all">
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Khách hàng</label>
                <select id="newProjClient" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                    <option value="">Chọn khách hàng...</option>
                    ${e.map(n=>`<option value="${n.id}">${n.name}</option>`).join("")}
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Phân loại</label>
                <select id="newProjCategory" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                    <option value="Phần mềm">Phần mềm</option>
                    <option value="Xây dựng">Xây dựng</option>
                    <option value="An ninh, kiểm soát truy cập">An ninh, kiểm soát truy cập</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Mô tả dự án</label>
                <textarea id="newProjDesc" placeholder="Mô tả tóm tắt..." 
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 h-20 resize-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-600 mb-1.5">Ngày bắt đầu</label>
                    <input type="date" id="newProjStart" min="${a}" onchange="const endEl = document.getElementById('newProjEnd'); endEl.min = this.value; if (endEl.value && endEl.value < this.value) { endEl.value = this.value; }" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-600 mb-1.5">Ngày hoàn thành</label>
                    <input type="date" id="newProjEnd" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                </div>
            </div>
            <div class="pt-4 flex gap-3">
                <button type="button" onclick="document.getElementById('addProjectModal').remove()" 
                        class="flex-1 btn-ghost border border-gray-200 py-3.5 text-center">Hủy</button>
                <button type="submit" class="flex-1 btn-primary py-3.5 text-center">
                     <i class="fas fa-rocket mr-2"></i>Tạo dự án
                </button>
            </div>
        </form>
    </div>`,t.onclick=n=>{n.target===t&&t.remove()},document.body.appendChild(t)};window.submitNewProject=async function(e){var l;e.preventDefault();const a=document.getElementById("newProjTitle").value.trim(),t=document.getElementById("newProjClient").value,n=document.getElementById("newProjCategory").value,s=document.getElementById("newProjDesc").value.trim(),o=document.getElementById("newProjStart").value||null,r=document.getElementById("newProjEnd").value||null;try{const i=localStorage.getItem("token"),d=await(await fetch("http://localhost:3000/api/projects",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({title:a,clientId:t||null,category:n,description:s,startDate:o,endDate:r})})).json();d.success?(alert("✅ Dự án đã được tạo thành công!"),document.getElementById("addProjectModal").remove(),me()):alert("❌ Tạo dự án thất bại: "+(((l=d.error)==null?void 0:l.message)||"Lỗi không xác định"))}catch(i){alert("❌ Lỗi kết nối: "+i.message)}};window.requestProjectApproval=function(){alert("⏳ Tính năng gửi yêu cầu phê duyệt dự án!")};window.exportExcel=async function(){try{const e=localStorage.getItem("token"),a=await fetch("http://localhost:3000/api/reports/export-progress",{headers:{Authorization:`Bearer ${e}`}});if(!a.ok){a.status===403?alert("❌ Bạn không có quyền xuất Excel báo cáo!"):alert("❌ Lỗi xuất báo cáo tiến độ: "+a.statusText);return}const t=await a.blob(),n=window.URL.createObjectURL(t),s=document.createElement("a");s.href=n,s.download=`Bao_cao_tien_do_du_an_${new Date().toISOString().slice(0,10)}.xlsx`,document.body.appendChild(s),s.click(),document.body.removeChild(s),window.URL.revokeObjectURL(n)}catch(e){alert("❌ Lỗi kết nối: "+e.message)}};let _=[],re=1;const te=10;function gt(){return setTimeout(()=>{window.fetchTasksFromServer(),window.fetchFilterProjects()},0),`
    <div class="max-w-7xl mx-auto h-full animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-clipboard-check text-emerald-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Quản lý công việc</h1>
                </div>
            </div>
            <!-- Stats Badges -->
            <div class="flex items-center gap-3" id="taskStatsBar"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <!-- Sidebar Filters -->
            <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                    <!-- Search -->
                    <div class="p-4 border-b border-gray-100">
                        <div class="relative group">
                            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                            <input type="text" id="searchTask" oninput="handleTaskFilter()" placeholder="Tìm kiếm công việc..." 
                                   class="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm text-sm font-medium transition-all placeholder:text-gray-400">
                        </div>
                        <button onclick="clearAllTaskFilters()" 
                                class="w-full mt-3 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-xs border border-gray-200 hover:border-red-200">
                            <i class="fas fa-filter-circle-xmark"></i> Xóa tất cả bộ lọc
                        </button>
                    </div>

                    <!-- Status Filter -->
                    <div class="p-4 border-b border-gray-100">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-circle-dot text-blue-400"></i> Trạng thái
                        </h3>
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="chưa nộp" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                                <span class="text-sm font-medium text-gray-700">Chưa nộp</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="đã nộp" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span class="text-sm font-medium text-gray-700">Đã nộp</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="cần sửa" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-orange-500 focus:ring-orange-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-orange-400"></span>
                                <span class="text-sm font-medium text-gray-700">Cần sửa</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="đã duyệt" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span class="text-sm font-medium text-gray-700">Đã duyệt</span>
                            </label>
                        </div>
                    </div>

                    <!-- Deadline Filter -->
                    <div class="p-4 border-b border-gray-100">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-clock text-amber-400"></i> Hạn chót
                        </h3>
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-red-50 transition-colors">
                                <input type="checkbox" value="quahan" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-red-500 focus:ring-red-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow"></span>
                                <span class="text-sm font-medium text-red-600">Quá hạn</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="homnay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                                <span class="text-sm font-medium text-gray-700">Hôm nay</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="tuannay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-blue-300"></span>
                                <span class="text-sm font-medium text-gray-700">Tuần này</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="thangnay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
                                <span class="text-sm font-medium text-gray-700">Tháng này</span>
                            </label>
                        </div>
                    </div>

                    <!-- Project Filter -->
                    <div class="p-4">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-folder text-purple-400"></i> Dự án
                        </h3>
                        <div id="filterProjectsList" class="space-y-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                            <div class="flex items-center gap-2 py-2 px-2">
                                <div class="w-4 h-4 bg-gray-100 rounded skeleton"></div>
                                <div class="h-3 bg-gray-100 rounded flex-1 skeleton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task List -->
            <div class="lg:col-span-9 flex flex-col gap-3" id="taskListContainer">
                <div class="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm animate-fadeIn">
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                        <i class="fas fa-spinner fa-spin text-gray-300 text-lg"></i>
                    </div>
                    <p class="text-sm text-gray-400 font-medium">Đang tải danh sách công việc...</p>
                </div>
            </div>
        </div>
    </div>`}function ie(e=[],a=re){const t=document.getElementById("taskListContainer");if(!t)return;if(ht(e),e.length===0){t.innerHTML=`
            <div class="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm animate-fadeIn">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <i class="fas fa-inbox text-2xl text-gray-300"></i>
                </div>
                <p class="text-gray-600 font-bold text-base">Không tìm thấy công việc</p>
                <p class="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác</p>
            </div>`;return}const n=Math.ceil(e.length/te);a>n&&(a=n),a<1&&(a=1),re=a;const s=(a-1)*te,o=e.slice(s,s+te);window._currentFilteredTasks=e;let r='<div class="space-y-3">';if(r+=o.map((l,i)=>{const c=ft(l),d=l.project_title||l.project||"Dự án e-Teck",p=l.description||l.title,u=l.deadline?new Date(l.deadline).toLocaleDateString("vi-VN"):"Không có hạn",g=l.deadline&&new Date(l.deadline)<new Date&&l.status!=="Đã duyệt";return`
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-${c.color}-200 transition-all duration-300 animate-fadeInUp group relative overflow-hidden"
             style="animation-delay: ${i*.04}s; animation-fill-mode: both;">
            
            <!-- Left color accent -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${c.color}-400 to-${c.color}-600 rounded-l-2xl"></div>
            
            <div class="flex items-start gap-4 pl-3">
                <!-- Status Icon Circle -->
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-${c.color}-50 to-${c.color}-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-${c.color}-100 group-hover:scale-110 transition-transform">
                    <i class="fas ${c.icon} text-${c.color}-500"></i>
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <!-- Project name -->
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md">${d}</span>
                        ${g?'<span class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 animate-pulse-slow"><i class="fas fa-exclamation-triangle mr-0.5"></i>QUÁ HẠN</span>':""}
                    </div>
                    
                    <!-- Task title -->
                    <h3 class="font-bold text-[15px] text-gray-800 leading-snug mb-2.5 group-hover:text-${c.color}-700 transition-colors">${p}</h3>
                    
                    <!-- Feedback if exists -->
                    ${l.status==="Cần sửa"&&l.feedback?`
                    <div class="mb-3 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2.5 rounded-xl flex gap-2.5 items-start border border-orange-100">
                        <div class="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i class="fas fa-comment text-orange-500 text-[9px]"></i>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed"><span class="font-bold text-gray-800">${l.reviewer_name||"Người duyệt"}:</span> ${l.feedback}</p>
                    </div>`:""}

                    <!-- Meta info row -->
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="flex items-center gap-1.5 text-xs font-medium ${g?"text-red-500":"text-gray-400"}">
                            <i class="far fa-calendar-alt text-[10px]"></i> ${u}
                        </span>
                        <span class="status-chip ${c.chipClass} text-[10px]">${l.status}</span>
                        ${l.file_path?`
                        <a href="http://localhost:3000${l.file_path}" target="_blank" onclick="event.stopPropagation()" class="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-all">
                            <i class="fas fa-file-alt text-[10px]"></i> Xem báo cáo
                        </a>`:""}
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                    ${c.actions}
                </div>
            </div>
        </div>`}).join(""),r+="</div>",n>1){r+=`
        <div class="flex items-center justify-between mt-6 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <span class="text-xs text-gray-400 font-medium pl-2">Hiển thị ${s+1}-${Math.min(s+te,e.length)} / ${e.length} công việc</span>
            <div class="flex items-center gap-1">
                <button onclick="window.goToTaskPage(${a-1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${a<=1?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${a<=1?"disabled":""}>
                    <i class="fas fa-chevron-left text-xs"></i>
                </button>`;for(let l=1;l<=n;l++){if(n>7&&l>3&&l<n-1&&Math.abs(l-a)>1){(l===4||l===n-2)&&(r+='<span class="text-gray-300 text-xs px-1">•••</span>');continue}r+=`<button onclick="window.goToTaskPage(${l})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${l===a?"bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm":"text-gray-500 hover:bg-gray-100"}">${l}</button>`}r+=`
                <button onclick="window.goToTaskPage(${a+1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${a>=n?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${a>=n?"disabled":""}>
                    <i class="fas fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>`}t.innerHTML=r}function ht(e){const a=document.getElementById("taskStatsBar");if(!a)return;const t=e.length,n=e.filter(l=>l.status.toLowerCase()==="chưa nộp").length,s=e.filter(l=>l.status.toLowerCase()==="đã nộp").length,o=e.filter(l=>l.status.toLowerCase()==="cần sửa").length,r=e.filter(l=>l.status.toLowerCase()==="đã duyệt").length;a.innerHTML=`
        <div class="flex flex-wrap items-center justify-end gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 cursor-default">
                <span>Tổng: <strong>${t}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Chưa nộp: <strong>${n}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Đã nộp: <strong>${s}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Cần sửa: <strong>${o}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Đã duyệt: <strong>${r}</strong></span>
            </div>
        </div>
    `}window.fetchTasksFromServer=async function(){try{const e=localStorage.getItem("token"),t=await(await fetch("http://localhost:3000/api/tasks/my-tasks",{headers:{Authorization:`Bearer ${e}`}})).json();t.success&&(_=t.data,window.renderTaskCards(_))}catch(e){console.error("Lỗi tải danh sách công việc:",e)}};window.fetchFilterProjects=async function(){try{const e=localStorage.getItem("token"),a=await fetch("http://localhost:3000/api/projects?limit=100",{headers:{Authorization:`Bearer ${e}`}}),t=await a.json();if(a.ok&&t.success){const n=t.data,s=[...new Set(n.map(r=>r.title))],o=document.getElementById("filterProjectsList");o&&(s.length===0?o.innerHTML='<p class="text-gray-400 text-xs italic py-2 px-2">Không có dự án nào</p>':o.innerHTML=s.map(r=>`
                    <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-purple-50 transition-colors">
                        <input type="checkbox" value="${r}" onchange="handleTaskFilter()" class="filter-project-checkbox rounded border-gray-300 text-purple-500 focus:ring-purple-400 w-4 h-4 flex-shrink-0"> 
                        <span class="text-xs font-medium text-gray-600 leading-tight truncate">${r}</span>
                    </label>`).join(""))}}catch(e){console.error("Lỗi tải danh sách dự án cho bộ lọc:",e)}};window.handleTaskFilter=function(){var r;const e=((r=document.getElementById("searchTask"))==null?void 0:r.value.toLowerCase().trim())||"",a=Array.from(document.querySelectorAll(".filter-status-checkbox:checked")).map(l=>l.value.toLowerCase().trim()),t=Array.from(document.querySelectorAll(".filter-deadline-checkbox:checked")).map(l=>l.value),n=Array.from(document.querySelectorAll(".filter-project-checkbox:checked")).map(l=>l.value.toLowerCase().trim()),s=new Date;s.setHours(0,0,0,0);const o=_.filter(l=>{const i=l.project_title||l.project||"",c=l.description||l.title||"",d=i.toLowerCase().includes(e)||c.toLowerCase().includes(e),p=a.length===0||a.includes(l.status.toLowerCase().trim()),u=n.length===0||n.includes(i.toLowerCase().trim());let g=!0;if(t.length>0&&l.deadline){const h=new Date(l.deadline);h.setHours(0,0,0,0),g=t.some(b=>{if(b==="quahan")return h<s&&l.status!=="Đã duyệt";if(b==="homnay")return h.getTime()===s.getTime();if(b==="tuannay"){const x=s.getDay()===0?7:s.getDay(),f=new Date(s);return f.setDate(s.getDate()+(7-x)),h>=s&&h<=f}return b==="thangnay"?h.getMonth()===s.getMonth()&&h.getFullYear()===s.getFullYear():!1})}return d&&p&&u&&g});re=1,ie(o,1)};window.clearAllTaskFilters=function(){const e=document.getElementById("searchTask");e&&(e.value=""),document.querySelectorAll(".filter-status-checkbox, .filter-deadline-checkbox, .filter-project-checkbox").forEach(a=>{a.checked=!1}),re=1,ie(_,1)};function ft(e){switch(e.status.toLowerCase().trim()){case"chưa nộp":return{color:"amber",icon:"fa-clock",chipClass:"status-chip-orange",actions:`<button onclick="openSubmitTaskModal('${e.id}')" class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-amber-200 hover:shadow-md hover:shadow-amber-300">
                    <i class="fas fa-upload mr-1.5"></i>Nộp mới
                </button>`};case"đã nộp":return{color:"blue",icon:"fa-paper-plane",chipClass:"status-chip-blue",actions:`<button onclick="xemLaiCongViec('${e.id}')" class="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300">
                    <i class="fas fa-eye mr-1.5"></i>Xem báo cáo
                </button>`};case"cần sửa":return{color:"orange",icon:"fa-exclamation-circle",chipClass:"status-chip-orange",actions:`<button onclick="openSubmitTaskModal('${e.id}')" class="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-300">
                    <i class="fas fa-redo mr-1.5"></i>Nộp lại
                </button>`};case"đã duyệt":return{color:"emerald",icon:"fa-check-circle",chipClass:"status-chip-green",actions:`<button onclick="xemLaiCongViec('${e.id}')" class="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300">
                    <i class="fas fa-eye mr-1.5"></i>Xem báo cáo
                </button>`};default:return{color:"gray",icon:"fa-circle",chipClass:"status-chip-gray",actions:""}}}window.openSubmitTaskModal=function(e){const a=document.createElement("div");a.className="fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4",a.id="submitTaskModal",a.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scaleUp overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-cloud-upload-alt text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Nộp kết quả công việc</h2>
                    <p class="text-xs text-purple-100/70">Tải lên file báo cáo và ghi chú tiến độ</p>
                </div>
            </div>
        </div>
        
        <form id="formSubmitTask" onsubmit="handleTaskSubmit(event, '${e}')" class="p-6">
            <div class="mb-5">
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">File kết quả *</label>
                <div class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group" onclick="this.querySelector('input').click()">
                    <div class="w-14 h-14 bg-gray-100 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                        <i class="fas fa-cloud-upload-alt text-xl text-gray-300 group-hover:text-purple-500 transition-colors"></i>
                    </div>
                    <p class="text-sm text-gray-500 font-semibold" id="uploadFileName">Kéo thả hoặc bấm để chọn file</p>
                    <p class="text-[10px] text-gray-400 mt-1">PDF, DOCX, ZIP, hình ảnh (tối đa 10MB)</p>
                    <input type="file" id="submitTaskFile" required class="hidden" onchange="document.getElementById('uploadFileName').textContent = this.files[0]?.name || 'Chọn file...'">
                </div>
            </div>
            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ghi chú tiến độ</label>
                <textarea id="submitTaskNote" rows="3" placeholder="Mô tả ngắn gọn kết quả công việc..." class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:shadow-sm bg-gray-50/50 text-sm resize-none transition-all"></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200 transition-all">
                    <i class="fas fa-paper-plane mr-1.5"></i>Xác nhận nộp
                </button>
            </div>
        </form>
    </div>`,a.onclick=t=>{t.target===a&&a.remove()},document.body.appendChild(a)};window.handleTaskSubmit=async function(e,a){var o;e.preventDefault();const t=document.getElementById("submitTaskFile"),n=document.getElementById("submitTaskNote");if(!t.files[0])return;const s=new FormData;s.append("file",t.files[0]),s.append("note",n.value);try{const r=localStorage.getItem("token"),i=await(await fetch(`http://localhost:3000/api/tasks/${a}/submit`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:s})).json();i.success?(alert("✅ Đã nộp báo cáo thành công!"),(o=document.getElementById("submitTaskModal"))==null||o.remove(),window.fetchTasksFromServer()):alert("❌ Lỗi: "+i.error.message)}catch(r){console.error("Lỗi khi nộp công việc:",r),alert("❌ Có lỗi xảy ra khi nộp công việc.")}};window.xemLaiCongViec=e=>{const a=_.find(r=>r.id===e);if(!a)return;const t=a.deadline?new Date(a.deadline).toLocaleDateString("vi-VN"):"Không có",n=document.createElement("div");n.className="fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4",n.id="viewReportModal";let s="";if(a.file_path){const r=a.file_path.split("/").pop();s=`
        <div class="mt-1 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div class="flex items-center gap-2.5 overflow-hidden flex-1">
                <i class="fas fa-file-alt text-blue-500 text-lg flex-shrink-0"></i>
                <span class="text-xs font-bold text-gray-700 truncate" title="${r}">${r}</span>
            </div>
            <a href="http://localhost:3000${a.file_path}" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ml-2">
                <i class="fas fa-download mr-1"></i> Tải về
            </a>
        </div>`}else s='<p class="text-xs text-gray-400 italic">Không có file đính kèm</p>';let o="";a.feedback&&(o=`
        <div class="mb-5 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100">
            <span class="block text-xs font-bold text-orange-600 mb-1 uppercase tracking-wider">Phản hồi của người duyệt</span>
            <p class="text-sm font-semibold text-gray-700 leading-relaxed">${a.feedback}</p>
        </div>`),n.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scaleUp overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-eye text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Báo cáo công việc</h2>
                    <p class="text-xs text-teal-100/70">Chi tiết thông tin nộp báo cáo & duyệt kết quả</p>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <!-- Task Info -->
            <div class="mb-5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <span class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Thông tin công việc</span>
                <h3 class="text-sm font-bold text-gray-800 leading-snug mb-2">${a.title||a.description}</h3>
                <div class="flex flex-wrap gap-2.5 items-center">
                    <span class="text-xs font-semibold text-gray-500">Hạn chót: <span class="text-gray-700">${t}</span></span>
                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span class="status-chip ${a.status.toLowerCase()==="đã duyệt"?"status-chip-green":"status-chip-blue"} text-[10px]">${a.status}</span>
                </div>
            </div>

            <!-- Feedback if exists -->
            ${o}

            <!-- Report content -->
            <div class="mb-5">
                <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nội dung báo cáo / ghi chú nộp bài</label>
                <div class="bg-gray-50/50 px-4 py-3.5 border border-gray-100 rounded-xl">
                    <p class="text-sm font-semibold text-gray-700 leading-relaxed">${a.submit_note||a.description||"Không có ghi chú"}</p>
                </div>
            </div>

            <!-- Attached File -->
            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">File đính kèm kết quả</label>
                ${s}
            </div>

            <!-- Footer Buttons -->
            <div class="flex justify-end">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Đóng</button>
            </div>
        </div>
    </div>`,n.onclick=r=>{r.target===n&&n.remove()},document.body.appendChild(n)};window.renderTaskCards=ie;window.handleTaskFilter=handleTaskFilter;window.clearAllTaskFilters=clearAllTaskFilters;window.goToTaskPage=function(e){var t;const a=window._currentFilteredTasks||_;ie(a,e),(t=document.getElementById("taskListContainer"))==null||t.scrollIntoView({behavior:"smooth",block:"start"})};let G=[],Le=1;const U=12;function xt(){const e="appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer",a=["Ban Giám đốc","Phòng Quản trị và Kế toán","Phòng Kinh doanh","Phòng Kỹ thuật"];return`
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-users text-blue-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Quản lý nhân sự</h1>
                </div>
            </div>
            ${window.getAuthRole&&window.getAuthRole()==="admin"?`
            <button onclick="addStaff()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm nhân sự
            </button>`:""}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[280px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchStaff" oninput="handleStaffFilter()" 
                       placeholder="Tìm kiếm theo tên, mã NV hoặc email..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterDept" onchange="handleStaffFilter()" class="${e}">
                <option value="">Tất cả phòng ban</option>
                ${a.map(t=>`<option value="${t}">${t}</option>`).join("")}
            </select>
            <select id="filterRole" onchange="handleStaffFilter()" class="${e}">
                <option value="">Tất cả vai trò</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Nhân viên">Nhân viên</option>
            </select>
            <select id="filterStatus" onchange="handleStaffFilter()" class="${e}">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        <th class="px-4 py-3 text-left font-semibold w-16">Ảnh</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-24">Mã NV</th>
                        <th class="px-4 py-3 text-left font-semibold">Họ tên</th>
                        <th class="px-4 py-3 text-left font-semibold">Phòng ban</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-28">Vai trò</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Email</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-32">Điện thoại</th>
                        <th class="px-4 py-3 text-center font-semibold whitespace-nowrap w-28">Trạng thái</th>
                        ${window.getAuthRole&&window.getAuthRole()==="admin"?'<th class="px-4 py-3 text-center font-semibold whitespace-nowrap w-24">Thao tác</th>':""}
                    </tr>
                </thead>
                <tbody id="staffTableBody" class="divide-y">
                    <tr><td colspan="9" class="px-4 py-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải danh sách nhân sự...</td></tr>
                </tbody>
            </table>
        </div>
    </div>`}async function ye(){var e;try{const a=localStorage.getItem("token"),t=await fetch("http://localhost:3000/api/users/staff?limit=100",{headers:{Authorization:`Bearer ${a}`}}),n=await t.json();t.ok&&n.success?(G=n.data.map(s=>({staffID:s.id,name:s.name,department:s.department,role:s.position||(s.role==="admin"?"Quản lý":"Nhân viên"),email:s.email,phone:s.phone,avatar:s.avatar||null,status:s.account_status||"active"})),F(G)):console.error("Không thể tải danh sách nhân sự:",(e=n.error)==null?void 0:e.message)}catch(a){console.error("Lỗi kết nối tải nhân sự:",a)}}function F(e=null,a=Le){if(e===null){ye();return}const t=Math.ceil(e.length/U);a>t&&t>0&&(a=t),a<1&&(a=1),Le=a;const n=(a-1)*U,s=e.slice(n,n+U);window._currentFilteredStaffs=e;let o="";e.length===0?o='<tr><td colspan="9" class="px-4 py-10 text-center text-gray-500">Không tìm thấy nhân sự nào phù hợp điều kiện.</td></tr>':s.forEach(l=>{const i=l.avatar?`<img src="http://localhost:3000${l.avatar}" alt="${l.name}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-100">`:`<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">${l.name.charAt(0).toUpperCase()}</div>`,c=l.status==="active",d=c?'<span class="px-2.5 py-0.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Hoạt động</span>':'<span class="px-2.5 py-0.5 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>',p=c?"text-red-600 hover:text-red-800":"text-emerald-600 hover:text-emerald-800",u=c?"fa-lock":"fa-lock-open",g=c?"Khóa tài khoản":"Mở khóa tài khoản";o+=`
            <tr class="hover:bg-gray-50 transition-colors text-sm text-gray-800">
                <td class="px-4 py-3">${i}</td>
                <td class="px-4 py-3 whitespace-nowrap text-gray-500 font-medium">${l.staffID}</td>
                <td class="px-4 py-3 font-semibold text-gray-800 leading-snug">
                    <div class="max-w-[150px] break-words">${l.name}</div>
                </td>
                <td class="px-4 py-3 text-gray-700 leading-snug">
                    <div class="max-w-[160px] break-words">${l.department}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 font-semibold text-xs rounded-lg bg-blue-50 text-blue-600 border border-blue-100"> ${l.role} </span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                    <div class="max-w-[140px] truncate" whitespace-nowrap title="${l.email}">${l.email}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">${l.phone}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap">${d}</td>
                <td class="px-4 py-5">
                    ${window.getAuthRole&&window.getAuthRole()==="admin"?`<div class="flex justify-center gap-3 whitespace-nowrap">
                        <button onclick="editStaff('${l.staffID}')" class="text-blue-600 hover:text-blue-700" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockStaff('${l.staffID}', '${l.status}')" class="${p}" title="${g}"><i class="fas ${u}"></i></button>
                    </div>`:""}
                </td> 
            </tr>`});const r=document.getElementById("staffTableBody");r&&(r.innerHTML=o),bt(e.length,t,a)}function bt(e,a,t){var l;let n=document.getElementById("staffPagination");if(!n){const i=(l=document.querySelector("#staffTableBody"))==null?void 0:l.closest(".bg-white");if(i)n=document.createElement("div"),n.id="staffPagination",n.className="px-6 py-4 border-t border-gray-100 flex items-center justify-between",i.appendChild(n);else return}if(a<=1){n.innerHTML=`<span class="text-xs text-gray-400">${e} nhân sự</span><div></div>`;return}const s=(t-1)*U+1,o=Math.min(t*U,e);let r="";r+=`<button onclick="window.goToStaffPage(${t-1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t<=1?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t<=1?"disabled":""}><i class="fas fa-chevron-left text-xs"></i></button>`;for(let i=1;i<=a;i++){if(a>7&&i>3&&i<a-1&&Math.abs(i-t)>1){(i===4||i===a-2)&&(r+='<span class="text-gray-300 text-xs px-1">•••</span>');continue}r+=`<button onclick="window.goToStaffPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i===t?"bg-blue-600 text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}">${i}</button>`}r+=`<button onclick="window.goToStaffPage(${t+1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t>=a?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t>=a?"disabled":""}><i class="fas fa-chevron-right text-xs"></i></button>`,n.innerHTML=`
        <span class="text-xs text-gray-400 font-medium">Hiển thị ${s}-${o} / ${e} nhân sự</span>
        <div class="flex items-center gap-1">${r}</div>`}window.goToStaffPage=function(e){const a=window._currentFilteredStaffs||G;F(a,e)};window.handleStaffFilter=function(){const e=document.getElementById("searchStaff").value.toLowerCase(),a=document.getElementById("filterDept").value,t=document.getElementById("filterRole").value,n=document.getElementById("filterStatus").value,s=G.filter(o=>{const r=o.name.toLowerCase().includes(e)||o.staffID.toLowerCase().includes(e)||o.email.toLowerCase().includes(e),l=a===""||o.department===a,i=t===""||o.role===t,c=n===""||o.status===n;return r&&l&&i&&c});F(s,1)};window.addStaff=function(){Ne()};window.editStaff=function(e){const a=G.find(t=>t.staffID===e);a&&Ne(a)};window.lockStaff=async function(e,a){var o;const t=a==="active",n=t?"khóa":"mở khóa",s=t?"locked":"active";if(confirm(`Bạn có chắc chắn muốn ${n} tài khoản nhân viên ${e} không?`))try{const r=localStorage.getItem("token"),l=await fetch(`http://localhost:3000/api/users/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({status:s})}),i=await l.json();l.ok&&i.success?(alert(`✅ Đã ${n} nhân viên thành công!`),ye()):alert(`❌ Lỗi khi ${n}: `+(((o=i.error)==null?void 0:o.message)||"Có lỗi xảy ra"))}catch(r){console.error("Lỗi khi kết nối đến máy chủ:",r)}};function Ne(e=null){const a=!!e,t=a?"Sửa thông tin nhân sự":"Thêm nhân sự mới",n=e?e.staffID:"",s=e?e.name:"",o=e?e.email:"",r=e?e.phone:"",l=e?e.department:"",i=e?e.role:"Nhân viên",c=e?e.avatar:"",p=["Ban Giám đốc","Phòng Quản trị và Kế toán","Phòng Kinh doanh","Phòng Kỹ thuật"].map(h=>`<option value="${h}" ${l===h?"selected":""}>${h}</option>`).join(""),u=a?"readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '":"required class='w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800'",g=document.createElement("div");g.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",g.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${t}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
                <button type="button" onclick="handleSaveStaff(this, '${n}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                    <i class="fas fa-save text-sm"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20 overflow-y-auto max-h-[75vh]">
            <form id="formStaffModal" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Avatar Upload -->
                <div class="md:col-span-2 flex items-center gap-6 pb-4 border-b border-gray-100 mb-2">
                    <div class="relative group">
                        <div id="staffAvatarPreview" class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden cursor-pointer"
                             onclick="document.getElementById('staffAvatarInput').click()">
                            ${s?c?`<img src="http://localhost:3000${c}" class="w-full h-full object-cover">`:s.charAt(0).toUpperCase():'<i class="fas fa-user text-xl"></i>'}
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow cursor-pointer"
                             onclick="document.getElementById('staffAvatarInput').click()">
                            <i class="fas fa-camera"></i>
                        </div>
                        <input type="file" id="staffAvatarInput" accept="image/png,image/jpeg" class="hidden" onchange="previewStaffAvatar(this)">
                    </div>
                    <div>
                        <p class="font-bold text-gray-800 text-lg">${a?s:"Ảnh đại diện"}</p>
                        <p class="text-sm text-gray-400">Bấm vào ảnh để thay đổi (PNG, JPG, tối đa 5MB)</p>
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Mã nhân viên <span class="text-red-500">*</span></label>
                    <input type="text" name="staffID" value="${n}" ${u}>
                </div>

                ${a?"":ae("Mật khẩu ban đầu","password","password","")}

                ${ae("Họ và tên","text","name",s)}
                ${ae("Email","email","email",o)}
                ${ae("Điện thoại","text","phone",r)}
                
                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Phòng ban <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <select name="department" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-700 outline-none appearance-none cursor-pointer">
                            <option value="" disabled ${l?"":"selected"}></option>
                            ${p}
                        </select>
                        <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Vai trò <span class="text-red-500">*</span></label>
                    <div class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-50/50 flex gap-8">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="role" value="Nhân viên" ${i==="Nhân viên"?"checked":""} class="w-4 h-4 accent-blue-600 cursor-pointer">
                            <span class="font-bold text-gray-700">Nhân viên</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="role" value="Quản lý" ${i==="Quản lý"?"checked":""} class="w-4 h-4 accent-blue-600 cursor-pointer">
                            <span class="font-bold text-gray-700">Quản lý</span>
                        </label>
                    </div>
                </div>

            </form>
        </div>
    </div>`,g.onclick=h=>{h.target===g&&g.remove()},document.body.appendChild(g)}function ae(e,a,t,n,s){return`
    <div class="flex flex-col space-y-2">
        <label class="text-sm font-bold text-gray-600 ml-1">${e} <span class="text-red-500">*</span></label>
        <input type="${a}" name="${t}" value="${n}" required
               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
    </div>`}window.handleSaveStaff=async function(e,a){var d,p;const t=document.getElementById("formStaffModal");if(!t.checkValidity()){t.reportValidity();return}const n=new FormData(t),s={};n.forEach((u,g)=>{s[g]=u});const o=!!a,r=localStorage.getItem("token"),l=o?`http://localhost:3000/api/users/${a}`:"http://localhost:3000/api/users/staff",i=o?"PUT":"POST",c={email:s.email,name:s.name,phone:s.phone,department:s.department,position:s.role,status:s.status};o?s.password&&(c.password=s.password):(c.id=s.staffID,c.password=s.password);try{const u=await fetch(l,{method:i,headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(c)}),g=await u.json();if(u.ok&&g.success){const h=document.getElementById("staffAvatarInput"),b=o?a:((d=g.data)==null?void 0:d.id)||s.staffID;if(h&&h.files[0]&&b){const x=new FormData;x.append("avatar",h.files[0]),await fetch(`http://localhost:3000/api/users/${b}/avatar`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:x})}alert(`✅ ${o?"Cập nhật":"Thêm mới"} nhân sự thành công!`),e.closest(".fixed").remove(),ye()}else alert(`❌ Có lỗi xảy ra: ${((p=g.error)==null?void 0:p.message)||"Không thể lưu thông tin."}`)}catch(u){console.error("Lỗi khi kết nối đến máy chủ:",u),alert("❌ Lỗi kết nối máy chủ.")}};window.previewStaffAvatar=function(e){const a=document.getElementById("staffAvatarPreview");if(e.files&&e.files[0]&&a){const t=new FileReader;t.onload=function(n){a.innerHTML=`<img src="${n.target.result}" class="w-full h-full object-cover">`},t.readAsDataURL(e.files[0])}};let Y=[],Ie=1;const V=12;function mt(){const e="appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer",a=["Doanh nghiệp","Tổ chức","Cá nhân"],t=window.getAuthRole&&window.getAuthRole()==="admin";return window.__canManageClient=t,`
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-user-tie text-indigo-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Quản lý khách hàng</h1>
                </div>
            </div>
            ${t?`
            <button onclick="addClient()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm khách hàng
            </button>`:""}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[300px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchClient" oninput="handleClientFilter()" 
                       placeholder="Tìm kiếm tên, mã, MST, email, SĐT..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterType" onchange="handleClientFilter()" class="${e}">
                <option value="">Tất cả loại khách hàng</option>
                ${a.map(n=>`<option value="${n}">${n}</option>`).join("")}
            </select>
            <select id="filterStatus" onchange="handleClientFilter()" class="${e}">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-20">Mã KH</th>
                        <th class="px-2.5 py-3 text-left">Tên khách hàng</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-24">Phân loại</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-28">Mã định danh</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-28">Điện thoại</th>
                        <th class="px-2.5 py-3 text-left">Email</th>
                        <th class="px-2.5 py-3 text-left">Địa chỉ</th>
                        <th class="px-2.5 py-3 text-center whitespace-nowrap w-24">Trạng thái</th>
                        ${t?'<th class="px-2.5 py-3 text-center whitespace-nowrap w-24">Thao tác</th>':""}
                    </tr>
                </thead>
                <tbody id="clientTableBody" class="divide-y divide-gray-100">
                    <tr><td colspan="${t?9:8}" class="px-4 py-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải danh sách khách hàng...</td></tr>
                </tbody>
            </table>
        </div>
    </div>`}async function ve(){var e;try{const a=localStorage.getItem("token"),t=await fetch("http://localhost:3000/api/users/clients?limit=100",{headers:{Authorization:`Bearer ${a}`}}),n=await t.json();t.ok&&n.success?(Y=n.data.map(s=>({clientID:s.id,name:s.name,type:s.type,idNumber:s.id_number,phone:s.phone,email:s.email,address:s.address,status:s.account_status||"active"})),K(Y)):console.error("Không thể tải danh sách khách hàng:",(e=n.error)==null?void 0:e.message)}catch(a){console.error("Lỗi kết nối tải khách hàng:",a)}}function K(e=null,a=Ie){if(e===null){ve();return}const t=window.__canManageClient,n=Math.ceil(e.length/V);a>n&&n>0&&(a=n),a<1&&(a=1),Ie=a;const s=(a-1)*V,o=e.slice(s,s+V);window._currentFilteredClients=e;let r="";e.length===0?r=`<tr><td colspan="${t?9:8}" class="px-4 py-12 text-center text-gray-500 text-sm italic">Không tìm thấy khách hàng phù hợp.</td></tr>`:o.forEach(i=>{const c=i.status==="active",d=c?'<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Hoạt động</span>':'<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>',p=c?"text-red-600 hover:text-red-800":"text-emerald-600 hover:text-emerald-800",u=c?"fa-lock":"fa-lock-open",g=c?"Khóa tài khoản":"Mở khóa tài khoản";r+=`
            <tr class="hover:bg-blue-50/30 transition-colors text-sm text-gray-800">
                <td class="px-2.5 py-3 whitespace-nowrap text-gray-500 font-medium">${i.clientID}</td>
                <td class="px-2.5 py-3 font-semibold text-gray-800 leading-snug">
                    <div class="max-w-[200px] break-words">${i.name}</div>
                </td>
                <td class="px-2.5 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 font-semibold text-[12px] rounded bg-blue-50 text-blue-600 border border-blue-100">
                        ${i.type}
                    </span>
                </td>
                <td class="px-2.5 py-3 text-gray-600 whitespace-nowrap">${i.idNumber}</td>
                <td class="px-2.5 py-3 whitespace-nowrap">${i.phone}</td>
                <td class="px-2.5 py-3 text-gray-600">
                    <div class="max-w-[170px] truncate" title="${i.email}">${i.email}</div>
                </td>
                <td class="px-2.5 py-3 text-gray-600 leading-snug">
                    <div class="max-w-[280px] break-words">${i.address}</div>
                </td>
                <td class="px-2.5 py-3 text-center whitespace-nowrap">${d}</td>
                ${t?`<td class="px-2.5 py-3 text-center">
                    <div class="flex justify-center gap-3">
                        <button onclick="editClient('${i.clientID}')" class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockClient('${i.clientID}', '${i.status}')" class="${p}" title="${g}"><i class="fas ${u}"></i></button>
                    </div>
                </td>`:""}
            </tr>`});const l=document.getElementById("clientTableBody");l&&(l.innerHTML=r),yt(e.length,n,a)}function yt(e,a,t){var l;let n=document.getElementById("clientPagination");if(!n){const i=(l=document.querySelector("#clientTableBody"))==null?void 0:l.closest(".bg-white");if(i)n=document.createElement("div"),n.id="clientPagination",n.className="px-6 py-4 border-t border-gray-100 flex items-center justify-between",i.appendChild(n);else return}if(a<=1){n.innerHTML=`<span class="text-xs text-gray-400">${e} khách hàng</span><div></div>`;return}const s=(t-1)*V+1,o=Math.min(t*V,e);let r="";r+=`<button onclick="window.goToClientPage(${t-1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t<=1?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t<=1?"disabled":""}><i class="fas fa-chevron-left text-xs"></i></button>`;for(let i=1;i<=a;i++){if(a>7&&i>3&&i<a-1&&Math.abs(i-t)>1){(i===4||i===a-2)&&(r+='<span class="text-gray-300 text-xs px-1">•••</span>');continue}r+=`<button onclick="window.goToClientPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i===t?"bg-blue-600 text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}">${i}</button>`}r+=`<button onclick="window.goToClientPage(${t+1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t>=a?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t>=a?"disabled":""}><i class="fas fa-chevron-right text-xs"></i></button>`,n.innerHTML=`
        <span class="text-xs text-gray-400 font-medium">Hiển thị ${s}-${o} / ${e} khách hàng</span>
        <div class="flex items-center gap-1">${r}</div>`}window.goToClientPage=function(e){const a=window._currentFilteredClients||Y;K(a,e)};window.handleClientFilter=function(){const e=document.getElementById("searchClient").value.toLowerCase(),a=document.getElementById("filterType").value,t=document.getElementById("filterStatus").value,n=Y.filter(s=>{const o=s.name.toLowerCase().includes(e)||s.clientID.toLowerCase().includes(e)||s.email.toLowerCase().includes(e)||s.phone.includes(e)||s.idNumber.includes(e),r=a===""||s.type===a,l=t===""||s.status===t;return o&&r&&l});K(n,1)};window.addClient=function(){Ae()};window.editClient=function(e){const a=Y.find(t=>t.clientID===e);a&&Ae(a)};window.lockClient=async function(e,a){var o;const t=a==="active",n=t?"khóa":"mở khóa",s=t?"locked":"active";if(confirm(`Bạn có chắc chắn muốn ${n} tài khoản khách hàng ${e} không?`))try{const r=localStorage.getItem("token"),l=await fetch(`http://localhost:3000/api/users/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({status:s})}),i=await l.json();l.ok&&i.success?(alert(`✅ Đã ${n} khách hàng thành công!`),ve()):alert(`❌ Lỗi khi ${n}: `+(((o=i.error)==null?void 0:o.message)||"Có lỗi xảy ra"))}catch(r){console.error("Lỗi khi kết nối đến máy chủ:",r)}};function Ae(e=null){const a=!!e,t=a?"Sửa thông tin khách hàng":"Thêm khách hàng mới",n=e?e.clientID:"",s=e?e.name:"",o=e?e.type:"",r=e?e.idNumber:"",l=e?e.phone:"",i=e?e.email:"",c=e?e.address:"",p=["Doanh nghiệp","Tổ chức","Cá nhân"].map(h=>`<option value="${h}" ${o===h?"selected":""}>${h}</option>`).join(""),u=a?"readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '":"required class='w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800'",g=document.createElement("div");g.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",g.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${t}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-500 px-4 py-2 hover:text-gray-700 font-semibold transition">Hủy</button>
                <button type="button" onclick="handleSaveClient(this, '${n}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-semibold hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                    <i class="fas fa-save"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20">
            <form id="formClientModal" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Mã khách hàng <span class="text-red-500">*</span></label>
                    <input type="text" name="clientID" value="${n}" ${u}>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Phân loại <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <select name="type" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 outline-none appearance-none cursor-pointer">
                            <option value="" disabled ${o?"":"selected"}></option>
                            ${p}
                        </select>
                        <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                ${pe("Mã định danh (MST/CCCD)","text","idNumber",r)}

                <div class="flex flex-col space-y-2 md:col-span-3">
                    <label class="text-base font-semibold text-gray-600 ml-1">Tên khách hàng <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${s}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

                ${pe("Số điện thoại","text","phone",l)}
                
                <div class="flex flex-col space-y-2 ${a?"md:col-span-1":""}">
                    <label class="text-base font-semibold text-gray-600 ml-1">Email <span class="text-red-500">*</span></label>
                    <input type="email" name="email" value="${i}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

                ${a?"":pe("Mật khẩu ban đầu","password","password","")}
                
                <div class="flex flex-col space-y-2 md:col-span-3">
                    <label class="text-base font-semibold text-gray-600 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                    <input type="text" name="address" value="${c}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

            </form>
        </div>
    </div>`,g.onclick=h=>{h.target===g&&g.remove()},document.body.appendChild(g)}function pe(e,a,t,n,s){return`
    <div class="flex flex-col space-y-2">
        <label class="text-base font-semibold text-gray-600 ml-1">${e} <span class="text-red-500">*</span></label>
        <input type="${a}" name="${t}" value="${n}" required
               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
    </div>`}window.handleSaveClient=async function(e,a){var d;const t=document.getElementById("formClientModal");if(!t.checkValidity()){t.reportValidity();return}const n=new FormData(t),s={};n.forEach((p,u)=>{s[u]=p});const o=!!a,r=localStorage.getItem("token"),l=o?`http://localhost:3000/api/users/${a}`:"http://localhost:3000/api/users/client",i=o?"PUT":"POST",c={email:s.email,name:s.name,phone:s.phone,address:s.address,type:s.type,id_number:s.idNumber};o||(c.id=s.clientID,c.password=s.password);try{const p=await fetch(l,{method:i,headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(c)}),u=await p.json();p.ok&&u.success?(alert(`✅ ${o?"Cập nhật":"Thêm mới"} khách hàng thành công!`),e.closest(".fixed").remove(),ve()):alert(`❌ Có lỗi xảy ra: ${((d=u.error)==null?void 0:d.message)||"Không thể lưu thông tin."}`)}catch(p){console.error("Lỗi khi kết nối đến máy chủ:",p),alert("❌ Lỗi kết nối máy chủ.")}};let W=[],Pe=1;const Q=12;async function ce(){try{const e=localStorage.getItem("token"),a=await fetch("http://localhost:3000/api/users/suppliers?limit=100",{headers:{Authorization:`Bearer ${e}`}}),t=await a.json();a.ok&&t.success&&(W=t.data,O(W))}catch(e){console.error("Lỗi tải danh sách nhà cung cấp:",e)}}window.fetchSuppliersFromServer=ce;function vt(){return`
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-truck-loading text-purple-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Quản lý nhà cung cấp</h1>
                </div>
            </div>
            ${window.getAuthRole&&window.getAuthRole()==="admin"?`
            <button onclick="addSupplier()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm nhà cung cấp
            </button>`:""}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[300px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchSupplier" oninput="handleSupplierFilter()" 
                       placeholder="Tìm kiếm tên đơn vị, MST, email, SĐT..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterStatus" onchange="handleSupplierFilter()" class="appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-xs font-bold uppercase">
                        <th class="px-3 py-3 text-left whitespace-nowrap w-24">Mã NCC</th>
                        <th class="px-3 py-3 text-left">Tên đơn vị</th>
                        <th class="px-3 py-3 text-left whitespace-nowrap w-32">Mã số thuế</th>
                        <th class="px-3 py-3 text-left whitespace-nowrap w-32">Điện thoại</th>
                        <th class="px-3 py-3 text-left">Email</th>
                        <th class="px-3 py-3 text-left">Địa chỉ</th>
                        <th class="px-3 py-3 text-center whitespace-nowrap w-24">Trạng thái</th>
                        ${window.getAuthRole&&window.getAuthRole()==="admin"?'<th class="px-3 py-3 text-center whitespace-nowrap w-28">Thao tác</th>':""}
                    </tr>
                </thead>
                <tbody id="supplierTableBody" class="divide-y divide-gray-100"></tbody>
            </table>
        </div>
    </div>`}function O(e=null,a=Pe){if(e===null){ce();return}const t=Math.ceil(e.length/Q);a>t&&t>0&&(a=t),a<1&&(a=1),Pe=a;const n=(a-1)*Q,s=e.slice(n,n+Q);window._currentFilteredSuppliers=e;let o="";e.length===0?o=`<tr><td colspan="${window.getAuthRole&&window.getAuthRole()==="admin"?8:7}" class="px-4 py-12 text-center text-gray-500 text-sm italic">Không tìm thấy nhà cung cấp phù hợp.</td></tr>`:s.forEach(l=>{const i=l.account_status==="active",c=i?'<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">Hoạt động</span>':'<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>',d=i?"text-red-600 hover:text-red-800":"text-green-600 hover:text-green-800",p=i?"fa-lock":"fa-lock-open",u=i?"Khóa tài khoản":"Mở khóa tài khoản";o+=`
            <tr class="hover:bg-blue-50/30 transition-colors text-sm text-gray-800">
                <td class="px-3 py-3 whitespace-nowrap text-gray-500 font-medium">${l.id}</td>
                <td class="px-3 py-3 font-bold text-gray-800 leading-snug">
                    <div class="max-w-[180px] break-words">${l.name}</div>
                </td>
                <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${l.id_number||""}</td>
                <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${l.phone||""}</td>
                <td class="px-3 py-3 text-gray-600">
                    <div class="max-w-[150px] truncate" title="${l.email||""}">${l.email||""}</div>
                </td>
                <td class="px-3 py-3 text-gray-600 leading-snug">
                    <div class="max-w-[250px] break-words">${l.address||""}</div>
                </td>
                <td class="px-3 py-3 text-center whitespace-nowrap">${c}</td>
                ${window.getAuthRole&&window.getAuthRole()==="admin"?`<td class="px-3 py-3 text-center">
                    <div class="flex justify-center gap-3">
                        <button onclick="editSupplier('${l.id}')" class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockSupplier('${l.id}', '${l.account_status}')" class="${d}" title="${u}"><i class="fas ${p}"></i></button>
                    </div>
                </td>`:""}
            </tr>`});const r=document.getElementById("supplierTableBody");r&&(r.innerHTML=o),wt(e.length,t,a)}function wt(e,a,t){var l;let n=document.getElementById("supplierPagination");if(!n){const i=(l=document.querySelector("#supplierTableBody"))==null?void 0:l.closest(".bg-white");if(i)n=document.createElement("div"),n.id="supplierPagination",n.className="px-6 py-4 border-t border-gray-100 flex items-center justify-between",i.appendChild(n);else return}if(a<=1){n.innerHTML=`<span class="text-sm text-gray-400">${e} nhà cung cấp</span><div></div>`;return}const s=(t-1)*Q+1,o=Math.min(t*Q,e);let r="";r+=`<button onclick="window.goToSupplierPage(${t-1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t<=1?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t<=1?"disabled":""}><i class="fas fa-chevron-left text-xs"></i></button>`;for(let i=1;i<=a;i++){if(a>7&&i>3&&i<a-1&&Math.abs(i-t)>1){(i===4||i===a-2)&&(r+='<span class="text-gray-300 text-xs px-1">•••</span>');continue}r+=`<button onclick="window.goToSupplierPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition ${i===t?"bg-blue-600 text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}">${i}</button>`}r+=`<button onclick="window.goToSupplierPage(${t+1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t>=a?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t>=a?"disabled":""}><i class="fas fa-chevron-right text-xs"></i></button>`,n.innerHTML=`
        <span class="text-sm text-gray-400 font-medium">Hiển thị ${s}-${o} / ${e} nhà cung cấp</span>
        <div class="flex items-center gap-1">${r}</div>`}window.goToSupplierPage=function(e){const a=window._currentFilteredSuppliers||W;O(a,e)};window.handleSupplierFilter=function(){const e=document.getElementById("searchSupplier").value.toLowerCase().trim(),a=document.getElementById("filterStatus").value,t=W.filter(n=>{const s=(n.name||"").toLowerCase().includes(e)||(n.id||"").toLowerCase().includes(e)||(n.email||"").toLowerCase().includes(e)||(n.phone||"").includes(e)||(n.id_number||"").includes(e),o=n.account_status||"active";return s&&(a===""||o===a)});O(t,1)};window.addSupplier=function(){_e()};window.editSupplier=function(e){const a=W.find(t=>t.id===e);a&&_e(a)};window.lockSupplier=async function(e,a){var o;const t=a==="active",n=t?"khóa":"mở khóa",s=t?"locked":"active";if(confirm(`Bạn có chắc chắn muốn ${n} tài khoản nhà cung cấp ${e} không?`))try{const r=localStorage.getItem("token"),l=await fetch(`http://localhost:3000/api/users/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({status:s})}),i=await l.json();l.ok&&i.success?(alert(`✅ Đã ${n} nhà cung cấp thành công!`),ce()):alert(`❌ Lỗi khi ${n}: `+(((o=i.error)==null?void 0:o.message)||"Có lỗi xảy ra"))}catch(r){console.error("Lỗi khi kết nối đến máy chủ:",r)}};function _e(e=null){const a=!!e,t=a?"Sửa thông tin nhà cung cấp":"Thêm nhà cung cấp mới",n=e?e.id:"",s=e?e.name:"",o=e?e.id_number:"",r=e?e.phone:"",l=e?e.email:"",i=e?e.address:"",c=a?"readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '":"readonly placeholder='Tự động tạo' class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '",d=document.createElement("div");d.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",d.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${t}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-500 px-4 py-2 hover:text-gray-700 font-semibold transition">Hủy</button>
                <button type="button" onclick="handleSaveSupplier(this, '${n}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-semibold hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                    <i class="fas fa-save"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20">
            <form id="formSupplierModal" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Mã nhà cung cấp</label>
                    <input type="text" name="supplierID" value="${n}" ${c}>
                </div>

                ${ne("Mã số thuế","text","id_number",o,!0)}

                <div class="flex flex-col space-y-2 md:col-span-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Tên nhà cung cấp <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${s}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>
                
                ${ne("Điện thoại","text","phone",r,!0)}
                ${ne("Email","email","email",l,!a)}

                ${a?"":ne("Mật khẩu ban đầu","password","password","",!0)}
                ${a?"":"<div></div>"}
                
                <div class="flex flex-col space-y-2 md:col-span-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                    <input type="text" name="address" value="${i}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

            </form>
        </div>
    </div>`,d.onclick=p=>{p.target===d&&d.remove()},document.body.appendChild(d)}function ne(e,a,t,n,s){return`
    <div class="flex flex-col space-y-2">
        <label class="text-base font-semibold text-gray-600 ml-1">${e} ${s?'<span class="text-red-500">*</span>':""}</label>
        <input type="${a}" name="${t}" value="${n}" ${s?"required":""}
               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
    </div>`}window.handleSaveSupplier=async function(e,a){var o;const t=document.getElementById("formSupplierModal");if(!t.reportValidity())return;const n=new FormData(t),s={};n.forEach((r,l)=>{l!=="supplierID"&&(s[l]=r)});try{const r=localStorage.getItem("token");let l;a?l=await fetch(`http://localhost:3000/api/users/${a}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(s)}):l=await fetch("http://localhost:3000/api/users/supplier",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(s)});const i=await l.json();l.ok&&i.success?(alert("✅ Thông tin nhà cung cấp đã được lưu thành công!"),e.closest(".fixed").remove(),ce()):alert("❌ Lỗi: "+(((o=i.error)==null?void 0:o.message)||"Không thể lưu thông tin nhà cung cấp"))}catch(r){console.error("Lỗi lưu nhà cung cấp:",r),alert("❌ Có lỗi xảy ra khi lưu thông tin.")}};function kt(){return setTimeout(Fe,0),`
    <div id="taikhoanNSContainer" class="max-w-5xl mx-auto animate-fadeIn">
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                    <i class="fas fa-spinner fa-spin text-gray-300"></i>
                </div>
                <p class="text-gray-400 font-medium text-sm">Đang tải thông tin tài khoản...</p>
            </div>
        </div>
    </div>`}async function Fe(){var a;const e=document.getElementById("taikhoanNSContainer");if(e)try{const t=localStorage.getItem("token"),s=await(await fetch("http://localhost:3000/api/auth/profile",{headers:{Authorization:`Bearer ${t}`}})).json();if(!s.success)throw new Error(((a=s.error)==null?void 0:a.message)||"Không thể lấy thông tin");const o=s.data,r=o.name||"---",l=o.staff_id||"---",i=o.department||"---",c=o.position||(o.role==="admin"?"Quản lý":"Nhân viên"),d=o.phone||"---",p=o.email||"---",u=o.avatar||"",g=o.role,h=u?`<img src="http://localhost:3000${u}" alt="${r}" class="w-full h-full object-cover">`:`<span class="text-3xl font-bold text-blue-600">${r.charAt(0).toUpperCase()}</span>`,b=g==="admin"?'<span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">Admin</span>':'<span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Nhân viên</span>';e.innerHTML=`
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex flex-1 items-center gap-5">
                <!-- Avatar -->
                <div class="relative group">
                    <div id="profileAvatarDisplay" class="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm cursor-pointer animate-scaleUp"
                         onclick="document.getElementById('profileAvatarInput').click()">
                        ${h}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] border-2 border-white shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                         onclick="document.getElementById('profileAvatarInput').click()">
                        <i class="fas fa-camera"></i>
                    </div>
                    <input type="file" id="profileAvatarInput" accept="image/png,image/jpeg" class="hidden" onchange="window.handleProfileAvatarUpload(this, '${l}')">
                </div>
                
                <!-- Info -->
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <h1 class="text-xl font-extrabold text-gray-800 tracking-tight leading-none">${r}</h1>
                        ${b}
                    </div>
                    <p class="text-gray-500 font-semibold text-xs">${i} • ${c}</p>
                    <p class="text-gray-400 font-medium text-[11px] mt-0.5">${p}</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
                <button onclick="window.toggleProfileEdit()" id="btnEditProfile" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all text-xs font-bold">
                    <i class="fas fa-pen text-xs"></i> Chỉnh sửa
                </button>
                <button onclick="logout()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all text-xs font-bold">
                    <i class="fas fa-sign-out-alt text-xs"></i> Đăng xuất
                </button>
            </div>
        </div>

        <!-- Content Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Profile Info Card -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeInUp" style="animation-delay: 0.1s; animation-fill-mode: both;">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-bold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-user-circle text-blue-500"></i> Thông tin cá nhân
                    </h3>
                    <span class="text-xs text-gray-400 font-medium">${l}</span>
                </div>
                
                <div id="profileInfoContent" class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                            <p class="text-base font-semibold text-gray-800" id="displayName">${r}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <p class="text-base font-semibold text-gray-800">${p}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                            <p class="text-base font-semibold text-gray-800" id="displayPhone">${d}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phòng ban</label>
                            <p class="text-base font-semibold text-gray-800" id="displayDept">${i}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chức vụ</label>
                            <p class="text-base font-semibold text-gray-800">${c}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vai trò hệ thống</label>
                            <p class="text-base font-semibold text-gray-800">${g==="admin"?"Quản trị viên":"Nhân viên"}</p>
                        </div>
                    </div>
                </div>

                <!-- Edit Form (hidden by default) -->
                <div id="profileEditForm" class="p-6 hidden">
                    <form id="formEditProfile" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                            <input type="text" name="name" value="${r}" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <input type="email" value="${p}" disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                            <input type="text" name="phone" value="${d!=="---"?d:""}" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phòng ban</label>
                            <select name="department" ${g!=="admin"?'disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed"':'class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium"'}>
                                <option value="Ban Giám đốc" ${i==="Ban Giám đốc"?"selected":""}>Ban Giám đốc</option>
                                <option value="Phòng Quản trị và Kế toán" ${i==="Phòng Quản trị và Kế toán"?"selected":""}>Phòng Quản trị và Kế toán</option>
                                <option value="Phòng Kinh doanh" ${i==="Phòng Kinh doanh"?"selected":""}>Phòng Kinh doanh</option>
                                <option value="Phòng Kỹ thuật" ${i==="Phòng Kỹ thuật"?"selected":""}>Phòng Kỹ thuật</option>
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chức vụ</label>
                            <input type="text" name="position" value="${c!=="---"?c:""}" ${g!=="admin"?'disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed"':'class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium"'}>
                        </div>
                        <div class="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onclick="window.toggleProfileEdit()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                            <button type="button" onclick="window.saveProfileChanges('${l}')" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg transition-all">
                                <i class="fas fa-save mr-1.5"></i>Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-5 animate-fadeInUp" style="animation-delay: 0.2s; animation-fill-mode: both;">
                <!-- Security Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
                            <i class="fas fa-shield-alt text-emerald-500"></i> Bảo mật
                        </h3>
                    </div>
                    <div class="p-5 space-y-3">
                        <button onclick="window.showChangePasswordModal()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all group">
                            <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <i class="fas fa-key text-blue-600 text-sm"></i>
                            </div>
                            <div class="text-left">
                                <p class="text-sm font-bold text-gray-700">Đổi mật khẩu</p>
                                <p class="text-[10px] text-gray-400">Cập nhật mật khẩu đăng nhập</p>
                            </div>
                            <i class="fas fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Activity Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
                            <i class="fas fa-clock text-amber-500"></i> Hoạt động
                        </h3>
                    </div>
                    <div class="p-5 space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <p class="text-xs text-gray-600">Đang hoạt động</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                            <p class="text-xs text-gray-500">Đăng nhập lần cuối: Hôm nay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`}catch(t){e.innerHTML=`<div class="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100"><i class="fas fa-exclamation-circle mr-2"></i>Lỗi: ${t.message}</div>`}}window.toggleProfileEdit=function(){const e=document.getElementById("profileInfoContent"),a=document.getElementById("profileEditForm"),t=document.getElementById("btnEditProfile");e&&a&&(!a.classList.contains("hidden")?(a.classList.add("hidden"),e.classList.remove("hidden"),t&&(t.innerHTML='<i class="fas fa-pen text-xs"></i> Chỉnh sửa')):(a.classList.remove("hidden"),e.classList.add("hidden"),t&&(t.innerHTML='<i class="fas fa-times text-xs"></i> Hủy chỉnh sửa')))};window.saveProfileChanges=async function(e){var r;const a=document.getElementById("formEditProfile");if(!a)return;const t=new FormData(a),n={name:t.get("name"),phone:t.get("phone")},s=a.querySelector('[name="department"]');s&&!s.disabled&&(n.department=s.value);const o=a.querySelector('[name="position"]');o&&!o.disabled&&(n.position=o.value);try{const l=localStorage.getItem("token"),c=await(await fetch(`http://localhost:3000/api/users/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`},body:JSON.stringify(n)})).json();c.success?(alert("✅ Cập nhật thông tin thành công!"),Fe()):alert("❌ Lỗi: "+(((r=c.error)==null?void 0:r.message)||"Không thể cập nhật"))}catch(l){alert("❌ Lỗi kết nối: "+l.message)}};window.handleProfileAvatarUpload=async function(e,a){var s;if(!e.files||!e.files[0])return;const t=document.getElementById("profileAvatarDisplay");if(t){const o=new FileReader;o.onload=r=>{t.innerHTML=`<img src="${r.target.result}" class="w-full h-full object-cover">`},o.readAsDataURL(e.files[0])}const n=new FormData;n.append("avatar",e.files[0]);try{const o=localStorage.getItem("token"),l=await(await fetch(`http://localhost:3000/api/users/${a}/avatar`,{method:"POST",headers:{Authorization:`Bearer ${o}`},body:n})).json();l.success?alert("✅ Đã cập nhật ảnh đại diện!"):alert("❌ Lỗi: "+(((s=l.error)==null?void 0:s.message)||"Không thể upload"))}catch(o){alert("❌ Lỗi kết nối: "+o.message)}};window.showChangePasswordModal=function(){const e=document.createElement("div");e.className="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4",e.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scaleUp overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-key text-white"></i>
                </div>
                <div>
                    <h3 class="text-lg font-extrabold text-white">Đổi mật khẩu</h3>
                    <p class="text-xs text-blue-100/70">Nhập mật khẩu mới để cập nhật</p>
                </div>
            </div>
        </div>
        <form id="formChangePassword" class="p-6 space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Mật khẩu hiện tại</label>
                <input type="password" name="currentPassword" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                <input type="password" name="newPassword" required minlength="6" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                <input type="password" name="confirmPassword" required minlength="6" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transition-all">
                    <i class="fas fa-check mr-1.5"></i>Xác nhận
                </button>
            </div>
        </form>
    </div>`,e.onclick=a=>{a.target===e&&e.remove()},document.body.appendChild(e),e.querySelector("form").onsubmit=async a=>{var o;a.preventDefault();const t=new FormData(a.target),n=t.get("newPassword"),s=t.get("confirmPassword");if(n!==s){alert("❌ Mật khẩu xác nhận không khớp!");return}try{const r=localStorage.getItem("token"),i=await(await fetch("http://localhost:3000/api/auth/change-password",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({currentPassword:t.get("currentPassword"),newPassword:n})})).json();i.success?(alert("✅ Đổi mật khẩu thành công!"),e.remove()):alert("❌ Lỗi: "+(((o=i.error)==null?void 0:o.message)||"Không thể đổi mật khẩu"))}catch(r){alert("❌ Lỗi kết nối: "+r.message)}}};function I(){return`
    <footer class="w-full bg-blue-50 border-t border-blue-100 py-8 text-[15px] text-gray-600">
        <div class="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <div class="flex flex-col">
                <div class="flex items-center gap-3 text-blue-700 font-bold text-2xl mb-2">
                    <span>📈</span> e-Teck Projects
                </div>
                <p class="font-bold text-gray-800 uppercase text-base mb-0.5">Hệ thống đặt hàng & quản lý dự án</p>
                <p class="text-base mb-1">Công ty TNHH Đào tạo & Tích hợp Công nghệ e-Teck</p>
                <p class="text-[11px] text-gray-400 font-bold uppercase mt-1">
                    &copy; 2026 E-TECK PROJECTS. ALL RIGHTS RESERVED.
                </p>
            </div>
            
            <div class="space-y-1.5">
                <p class="flex items-center gap-3">
                    <i class="fas fa-map-marker-alt w-5 text-blue-500 text-center"></i> 
                    Số 24 Đoàn Kết, An Đồng, Hải Phòng
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-phone-alt w-5 text-blue-500 text-center"></i> 
                    0225.3601.496 / 0987.868.142
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-envelope w-5 text-blue-500 text-center"></i> 
                    admin@e-teck.vn
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-clock w-5 text-blue-500 text-center"></i> 
                    8:00 - 22:00 (Thứ Hai - Chủ nhật)
                </p>
            </div>
        </div>
    </footer>`}let $=[],E=0,ge=null,N="all";const $t={task_assigned:{icon:"fa-user-plus",color:"text-blue-500",bg:"bg-blue-50"},task_submitted:{icon:"fa-paper-plane",color:"text-purple-500",bg:"bg-purple-50"},task_approved:{icon:"fa-check-circle",color:"text-emerald-500",bg:"bg-emerald-50"},task_rejected:{icon:"fa-exclamation-circle",color:"text-orange-500",bg:"bg-orange-50"},task_deadline_warning:{icon:"fa-clock",color:"text-amber-500",bg:"bg-amber-50"},task_overdue:{icon:"fa-exclamation-triangle",color:"text-red-500",bg:"bg-red-50"},quotation_sent_to_client:{icon:"fa-file-invoice-dollar",color:"text-indigo-500",bg:"bg-indigo-50"},quotation_sent_to_supplier:{icon:"fa-truck",color:"text-cyan-500",bg:"bg-cyan-50"},order_status_updated:{icon:"fa-sync-alt",color:"text-teal-500",bg:"bg-teal-50"},project_created:{icon:"fa-folder-plus",color:"text-blue-500",bg:"bg-blue-50"},project_step_advanced:{icon:"fa-arrow-right",color:"text-indigo-500",bg:"bg-indigo-50"},project_completed:{icon:"fa-trophy",color:"text-emerald-500",bg:"bg-emerald-50"},project_deadline_warning:{icon:"fa-calendar-times",color:"text-amber-500",bg:"bg-amber-50"},client_request_new:{icon:"fa-inbox",color:"text-violet-500",bg:"bg-violet-50"}};function Tt(e){return $t[e]||{icon:"fa-bell",color:"text-gray-500",bg:"bg-gray-50"}}function Ct(e){const a=new Date,t=new Date(e),n=Math.floor((a-t)/1e3);return n<60?"Vừa xong":n<3600?`${Math.floor(n/60)} phút trước`:n<86400?`${Math.floor(n/3600)} giờ trước`:`${Math.floor(n/86400)} ngày trước`}function jt(){return`
    <div class="relative" id="notificationBellWrapper">
      <button onclick="window.navigateTo('thongbao')" 
              class="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all group"
              title="Thông báo">
        <i class="fas fa-bell text-gray-500 group-hover:text-blue-600 transition-colors"></i>
        <span id="notiBadge" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce-sm">0</span>
      </button>
    </div>`}function St(){const e=localStorage.getItem("authRole")||"staff";return setTimeout(()=>{typeof window.initNotificationPage=="function"&&window.initNotificationPage()},50),e==="client"?`
    <div class="flex flex-col mt-0 -mx-8 min-h-screen bg-gray-50/50"> 
      ${P({activeLabel:"Thông báo",tabs:[{label:"Dự án",iconClass:"fas fa-briefcase text-lg",onClick:"navigateTo('CTTkhachhang')"},{label:"Tạo yêu cầu",iconClass:"fas fa-plus",onClick:"navigateTo('taoyeucau')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanKH')"}]})}
      <main class="max-w-4xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
        ${he()}
      </main>
      ${I()}
    </div>`:e==="supplier"?`
    <div class="flex flex-col mt-0 -mx-8 min-h-screen bg-gray-50/50">
      ${P({activeLabel:"Thông báo",tabs:[{label:"Vật tư",iconClass:"fas fa-truck text-lg",onClick:"navigateTo('CTTnhacungcap')"},{label:"Đơn hàng",iconClass:"fas fa-clipboard-list",onClick:"navigateTo('donhang')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanNCC')"}]})}
      <main class="max-w-4xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
        ${he()}
      </main>
      ${I()}
    </div>`:`
    <div class="max-w-5xl mx-auto py-2">
      ${he()}
    </div>`}function he(){return`
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-scaleIn">
      <div class="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
            <i class="fas fa-bell text-blue-500 text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              Thông báo của bạn
              <span id="pageNotiCount" class="hidden text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">0</span>
            </h2>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
          <button onclick="window.markAllNotiReadPage()" class="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
            <i class="fas fa-check-double"></i> Đọc tất cả
          </button>
          <button onclick="window.deleteAllNotiPage()" class="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
            <i class="fas fa-trash-alt"></i> Xóa tất cả
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="px-6 md:px-8 py-3.5 border-b border-gray-50 bg-white flex gap-6">
        <button onclick="window.changeNotiFilter('all')" id="filter-all" class="text-sm font-bold text-blue-600 border-b-2 border-blue-500 pb-1.5 transition-all">Tất cả</button>
        <button onclick="window.changeNotiFilter('unread')" id="filter-unread" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-1.5 transition-all">Chưa đọc</button>
        <button onclick="window.changeNotiFilter('read')" id="filter-read" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-1.5 transition-all">Đã đọc</button>
      </div>

      <!-- Notifications List -->
      <div id="pageNotiList" class="divide-y divide-slate-100 min-h-[300px]">
        <div class="py-20 text-center text-slate-300 font-medium text-sm">Đang tải thông báo...</div>
      </div>
    </div>`}async function xe(){N="all",await Lt()}async function Lt(){try{const e=localStorage.getItem("token");if(!e)return;const t=await(await fetch("http://localhost:3000/api/notifications",{headers:{Authorization:`Bearer ${e}`}})).json();if(t.success){$=t.data||[],q();const n=$.filter(o=>!o.is_read).length,s=document.getElementById("pageNotiCount");s&&(n>0?(s.textContent=n,s.classList.remove("hidden")):s.classList.add("hidden"))}}catch(e){console.error("[Notification] Page fetch error:",e.message)}}function q(){const e=document.getElementById("pageNotiList");if(!e)return;let a=$;if(N==="unread"?a=$.filter(t=>!t.is_read):N==="read"&&(a=$.filter(t=>t.is_read)),a.length===0){let t="Không có thông báo nào.";N==="unread"&&(t="Bạn không có thông báo chưa đọc."),N==="read"&&(t="Bạn không có thông báo đã đọc."),e.innerHTML=`
      <div class="py-24 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <i class="fas fa-bell-slash text-2xl text-slate-300"></i>
        </div>
        <p class="text-slate-400 text-sm font-semibold">${t}</p>
      </div>`;return}e.innerHTML=a.map(t=>{const n=Tt(t.type),s=t.is_read?"bg-white opacity-70 hover:opacity-100":"bg-blue-50/10 border-l-4 border-blue-500 pl-4 md:pl-5",o=t.is_read?"":'<div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1.5 flex-shrink-0"></div>';return`
      <div class="group/noti flex items-start gap-4 px-6 md:px-8 py-4 md:py-5 hover:bg-gray-50 transition-all cursor-pointer relative ${s}"
           onclick="window.handlePageNotiClick(${t.id}, '${t.related_type||""}', '${t.related_id||""}')">
        <div class="w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <i class="fas ${n.icon} ${n.color} text-sm"></i>
        </div>
        <div class="flex-1 min-w-0 pr-4">
          <h4 class="${t.is_read?"text-gray-700 font-bold":"text-gray-900 font-extrabold"} text-sm md:text-base leading-snug break-words">${t.title}</h4>
          <p class="text-xs md:text-sm text-gray-500 mt-1 break-words leading-relaxed">${t.message||""}</p>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <i class="far fa-clock"></i> ${Ct(t.created_at)}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 self-center flex-shrink-0">
          ${o}
          <button onclick="window.deletePageNoti(event, ${t.id})"
                  class="opacity-0 group-hover/noti:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 rounded-xl hover:bg-gray-100"
                  title="Xóa thông báo">
            <i class="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>`}).join("")}window.changeNotiFilter=function(e){N=e,["all","unread","read"].forEach(t=>{const n=document.getElementById("filter-"+t);n&&(t===e?n.className="text-sm font-bold text-blue-600 border-b-2 border-blue-500 pb-1.5 transition-all":n.className="text-sm font-medium text-slate-400 hover:text-slate-600 pb-1.5 transition-all")}),q()};window.handlePageNotiClick=async function(e,a,t){try{const n=localStorage.getItem("token");await fetch(`http://localhost:3000/api/notifications/${e}/read`,{method:"PUT",headers:{Authorization:`Bearer ${n}`}}),$=$.map(s=>s.id===e?{...s,is_read:!0}:s),q(),M()}catch{}if(a==="project"&&t){const n=localStorage.getItem("authRole");window.openProjectDetail(t,n)}};window.deletePageNoti=async function(e,a){e.stopPropagation();try{const t=localStorage.getItem("token");(await(await fetch(`http://localhost:3000/api/notifications/${a}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).json()).success&&($=$.filter(o=>o.id!==a),q(),M())}catch(t){console.error("[Notification] Page Delete error:",t.message)}};window.markAllNotiReadPage=async function(){try{const e=localStorage.getItem("token");await fetch("http://localhost:3000/api/notifications/read-all",{method:"PUT",headers:{Authorization:`Bearer ${e}`}}),$=$.map(a=>({...a,is_read:!0})),q(),M()}catch{}};window.deleteAllNotiPage=async function(){if(confirm("Bạn có chắc chắn muốn xóa tất cả thông báo không?"))try{const e=localStorage.getItem("token"),a=$.map(t=>fetch(`http://localhost:3000/api/notifications/${t.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${e}`}}));await Promise.all(a),$=[],q(),M()}catch(e){console.error("[Notification] Clear all error:",e.message)}};async function M(){try{const e=localStorage.getItem("token");if(!e)return;const t=await(await fetch("http://localhost:3000/api/notifications/unread-count",{headers:{Authorization:`Bearer ${e}`}})).json();t.success&&(E=t.data.count,It())}catch(e){console.error("[Notification] Count error:",e.message)}}function It(){const e=document.getElementById("notiBadge");e&&(E>0?(e.textContent=E>99?"99+":E,e.classList.remove("hidden")):e.classList.add("hidden"));const a=document.getElementById("sidebarNotiBadge");a&&(E>0?(a.textContent=E>99?"99+":E,a.classList.remove("hidden")):a.classList.add("hidden"))}function Ke(){M(),ge&&clearInterval(ge),ge=setInterval(M,3e4),document.addEventListener("visibilitychange",()=>{document.hidden||M()})}function P({logoIcon:e="📈",activeLabel:a,tabs:t=[]}){const n=t.map(s=>{const r=s.label===a||s.active===!0?"text-blue-700 font-bold text-base border-b-4 border-blue-600 pb-2 transition":"text-blue-700 hover:text-blue-800 text-base border-b-4 border-transparent pb-2 transition";return`
        <button onclick="${s.onClick}" class="${r}">
          <span class="inline-flex items-center gap-2">
            <i class="${s.iconClass}"></i> ${s.label}
          </span>
        </button>`}).join(`
`);return setTimeout(()=>Ke(),0),`
    <header class="sticky top-0 z-50 bg-blue-50 border-b border-blue-100 py-4 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="text-3xl filter">${e}</div>
          <div>
            <h1 class="text-2xl font-bold text-blue-700 leading-none">e-Teck Projects</h1>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6">
            ${n}
          </div>

          ${jt()}

          <button onclick="logout()" class="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-base flex items-center gap-2 transition">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  `}function Pt(){return setTimeout(()=>window.toggleEditNCC(!1),0),`
    <div class="flex flex-col min-h-screen -mt-8 -mx-8 bg-gray-50/50">
      ${P({activeLabel:"Tài khoản",tabs:[{label:"Vật tư",iconClass:"fas fa-truck text-lg",onClick:"navigateTo('CTTnhacungcap')"},{label:"Đơn hàng",iconClass:"fas fa-clipboard-list",onClick:"navigateTo('donhang')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanNCC')"}]})}
      <main id="nccProfileWrapper" class="max-w-6xl mx-auto w-full px-8 py-20 flex-1"></main>
      ${I()}
    </div>`}window.toggleEditNCC=async function(e){var c;const a=document.getElementById("nccProfileWrapper");if(!a)return;if(!window.cachedProfile){a.innerHTML='<div class="flex items-center justify-center h-64"><p class="text-gray-500 font-medium">Đang tải...</p></div>';try{const d=localStorage.getItem("token"),u=await(await fetch("http://localhost:3000/api/auth/profile",{headers:{Authorization:`Bearer ${d}`}})).json();if(u.success)window.cachedProfile=u.data;else throw new Error(((c=u.error)==null?void 0:c.message)||"Không thể lấy thông tin")}catch(d){a.innerHTML=`<div class="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">Lỗi: ${d.message}</div>`;return}}const t=window.cachedProfile,n=(t==null?void 0:t.name)||"---",s=(t==null?void 0:t.supplier_id)||"---",o=(t==null?void 0:t.id_number)||"---",r=(t==null?void 0:t.phone)||"---",l=(t==null?void 0:t.address)||"---",i=(t==null?void 0:t.email)||"---";e?a.innerHTML=`
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Cập nhật thông tin</h1>
                <div class="flex gap-4">
                    <button onclick="toggleEditNCC(false)" class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition">
                        Hủy
                    </button>
                    <button onclick="saveNCCProfile()" class="bg-blue-600 text-white hover:bg-blue-700 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition shadow-sm">
                        <i class="fas fa-save"></i> Lưu thay đổi
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <form id="formEditNCCProfile" class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                    
                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Tên nhà cung cấp <span class="text-red-500">*</span></label>
                        <input type="text" name="name" value="${n!=="---"?n:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã nhà cung cấp</label>
                        <input type="text" value="${s!=="---"?s:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed ">
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">MST / Số định danh <span class="text-red-500">*</span></label>
                        <input type="text" value="${o!=="---"?o:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Điện thoại <span class="text-red-500">*</span></label>
                        <input type="text" name="phone" value="${r!=="---"?r:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50  text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Email <span class="text-red-500">*</span></label>
                        <input type="email" value="${i!=="---"?i:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>

                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                        <input type="text" name="address" value="${l!=="---"?l:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50  text-gray-800">
                    </div>
                </form>
            </div>`:a.innerHTML=`
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>
                <div class="flex gap-4">
                    <button onclick="window.showChangePasswordModal()" class="bg-gray-800 hover:bg-black text-white px-10 py-3.5 rounded-2xl font-normal text-base flex items-center gap-2 transition">
                        <i class="fas fa-key"></i> Đổi mật khẩu
                    </button>
                    <button onclick="toggleEditNCC(true)" class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition">
                        <i class="fas fa-edit"></i> Cập nhật thông tin
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 pt-2">
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Tên nhà cung cấp</p>
                        <p class=" text-xl text-gray-800">${n}</p>
                    </div>
                    <div class="md:col-span-1">
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã nhà cung cấp</p>
                        <p class="text-xl text-gray-800">${s}</p>
                    </div>

                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">MST / Số định danh</p>
                        <p class="text-xl text-gray-800">${o}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Điện thoại</p>
                        <p class="text-xl text-gray-800">${r}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Email</p>
                        <p class="text-lg text-gray-800">${i}</p>
                    </div>
                    
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Địa chỉ</p>
                        <p class="text-lg text-gray-800 leading-relaxed">${l}</p>
                    </div>
                    
                </div>
            </div>`};window.saveNCCProfile=async function(){var n;const e=document.getElementById("formEditNCCProfile");if(!e.checkValidity()){e.reportValidity();return}const a=new FormData(e),t={name:a.get("name"),phone:a.get("phone"),address:a.get("address")};try{const s=localStorage.getItem("token"),r=await(await fetch("http://localhost:3000/api/auth/profile",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(t)})).json();r.success?(window.cachedProfile=r.data,alert("✅ Thông tin tài khoản đã được cập nhật thành công!"),window.toggleEditNCC(!1)):alert("❌ Cập nhật thất bại: "+(((n=r.error)==null?void 0:n.message)||"Lỗi không xác định"))}catch(s){alert("❌ Lỗi kết nối: "+s.message)}};let le=[];const be=e=>e?e.startsWith("/uploads")?`http://localhost:3000${e}`:e:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200";async function Z(){try{const e=localStorage.getItem("token"),a=localStorage.getItem("supplierId");let t="http://localhost:3000/api/materials?limit=100";a&&(t+=`&supplierId=${a}`);const n=await fetch(t,{headers:{Authorization:`Bearer ${e}`}}),s=await n.json();n.ok&&s.success&&(le=s.data,we(le,"supplier"))}catch(e){console.error("Lỗi tải danh sách vật tư:",e)}}window.fetchSupplierMaterialsFromServer=Z;function Bt(){return setTimeout(Z,50),`
    <div class="flex flex-col mt-0 -mx-8 min-h-screen bg-gray-50/50">
        ${P({activeLabel:"Vật tư",tabs:[{label:"Vật tư",iconClass:"fas fa-truck text-lg",onClick:"navigateTo('CTTnhacungcap')"},{label:"Đơn hàng",iconClass:"fas fa-clipboard-list",onClick:"navigateTo('donhang')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanNCC')"}]})}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Quản lý vật tư</h2>
                <button onclick="addMaterial()" class="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition shadow-md font-bold">
                    <i class="fas fa-plus"></i> Thêm vật tư mới
                </button>
            </div>

            <div class="flex flex-wrap gap-4 mb-8">
                <div class="flex-1 min-w-[300px] relative">
                    <input type="text" id="searchMaterial" oninput="handleMaterialFilter('supplier')" 
                           placeholder="Tìm kiếm tên, mã vật tư..."
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 pl-14 bg-white shadow-sm">
                    <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>

                <div class="min-w-[240px] relative group">
                    <select id="filterStatus" onchange="handleMaterialFilter('supplier')" 
                            class="w-full appearance-none px-6 pr-14 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-white shadow-sm cursor-pointer text-gray-600 transition-all">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Sẵn sàng">Sẵn sàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                        <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                </div>

                <div class="min-w-[240px] relative group">
                    <select id="filterCategory" onchange="handleMaterialFilter('supplier')" 
                            class="w-full appearance-none px-6 pr-14 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-white shadow-sm cursor-pointer text-gray-600 transition-all">
                        <option value="">Tất cả phân loại</option>
                        <option value="Thiết bị mạng">Thiết bị mạng</option>
                        <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                        <option value="Phụ kiện">Phụ kiện</option>
                        <option value="Thiết bị điện">Thiết bị điện</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="materialCards"></div>
        </main>
        ${I()}
    </div>`}function we(e=[],a="staff"){const t=document.getElementById("materialCards");if(t){if(e.length===0){t.innerHTML=`
        <div class="col-span-full py-20 text-center animate-fadeIn">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <i class="fas fa-box-open text-2xl text-gray-300"></i>
            </div>
            <p class="text-gray-600 font-bold text-base">Không tìm thấy vật tư nào</p>
            <p class="text-gray-400 text-xs mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>`;return}t.innerHTML=e.map((n,s)=>{const o=n.status==="Sẵn sàng"?"bg-emerald-50 text-emerald-700 border-emerald-200":n.status==="Hết hàng"?"bg-orange-50 text-orange-700 border-orange-200":"bg-red-50 text-red-700 border-red-200";let r="";if(a==="staff"){const d=n.supplier_name||n.supplier_id||"Chưa rõ NCC";r=`<p class="text-xs text-gray-400 font-medium truncate" title="${d}"><i class="fas fa-truck text-[10px] mr-1 text-gray-300"></i>${d}</p>`}const l=typeof n.price=="string"?parseFloat(n.price):n.price||0,i=be(n.image_url||n.image),c=n.unit||n.uom||"cái";return`
        <div onclick="openMaterialDetail('${n.id}', '${a}')" 
             class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex gap-5 cursor-pointer group animate-fadeInUp relative overflow-hidden"
             style="animation-delay: ${s*.04}s; animation-fill-mode: both;">
            
            <!-- Hover accent -->
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
            
            <!-- Image -->
            <div class="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center group-hover:border-purple-100 transition-colors">
                <img src="${i}" alt="${n.name}" class="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500">
            </div>
            
            <!-- Content -->
            <div class="flex-1 flex flex-col justify-center min-w-0">
                <h3 class="font-bold text-gray-800 text-base line-clamp-1 mb-1 leading-snug group-hover:text-purple-700 transition-colors">${n.name}</h3>
                ${r}
                <div class="flex flex-wrap gap-1.5 items-center mt-2">
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-md border border-gray-200">${n.sku}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-md border border-blue-100">${n.category}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold ${o} rounded-md border">${n.status}</span>
                </div>
                <p class="text-lg font-extrabold text-purple-700 mt-2">
                    ${l.toLocaleString("vi-VN")}đ <span class="text-xs font-medium text-gray-400">/ ${c}</span>
                </p>
            </div>
            
            <!-- Arrow -->
            <div class="flex items-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <i class="fas fa-chevron-right text-purple-300 text-sm"></i>
            </div>
        </div>`}).join("")}}window.openMaterialDetail=function(e,a,t=!1){let n=le.find(c=>String(c.id)===String(e));if(!n&&window._allMaterialsCache&&(n=window._allMaterialsCache.find(c=>String(c.id)===String(e))),!n)return;const s=document.getElementById("materialDetailModal");s&&s.remove();const o=a==="supplier",r=n.supplier_name||"Đang cập nhật";let l="";o&&!t?l=`
            <button onclick="openMaterialDetail('${n.id}', '${a}', true)" class="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                <i class="fas fa-edit text-sm"></i> Sửa
            </button>
            <button onclick="window.handleDeleteMaterial('${n.id}')" class="bg-white border border-red-100 text-red-500 px-5 py-2.5 rounded-2xl font-bold hover:bg-red-50 transition flex items-center gap-2">
                <i class="fas fa-trash-alt text-sm"></i> Xóa
            </button>
        `:t&&(l=`
            <button type="button" onclick="openMaterialDetail('${n.id}', '${a}', false)" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
            <button type="button" onclick="handleUpdateMaterial(this)" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                <i class="fas fa-save text-sm"></i> Lưu thay đổi
            </button>
        `);const i=document.createElement("div");i.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",i.id="materialDetailModal",t?i.innerHTML=`
        <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
            <div class="px-10 py-5 flex justify-between items-center bg-white sticky top-0 z-10">
                <div class="flex-1 mr-10">
                    <input type="text" name="name" form="formEditMaterial" required
                           class="w-full text-2xl font-bold text-gray-800 focus:outline-none bg-transparent border-transparent focus:border-blue-200 transition-all" 
                           value="${n.name}">
                </div>
                <div class="flex items-center gap-2">
                    ${l}
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-10 bg-gray-50/20">
                <form id="formEditMaterial" data-material-id="${n.id}" class="grid grid-cols-1 md:grid-cols-5 gap-10 items-stretch">
                    
                    <div class="md:col-span-2 flex flex-col gap-6">
                        <div class="flex-1 bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[220px] hover:border-blue-300 transition-all cursor-pointer relative group"
                             onclick="document.getElementById('editMaterialImgInput').click()">
                            <input type="file" name="image" id="editMaterialImgInput" class="hidden" accept="image/*" onchange="previewMaterialImage(this, 'editMaterialImgPreview', 'editImgPreviewText')">
                            <img id="editMaterialImgPreview" src="${be(n.image_url||n.image)}" alt="${n.name}" class="absolute inset-0 w-full h-full object-contain p-4 opacity-40 group-hover:opacity-20 transition-opacity rounded-[32px]">
                            <div id="editImgPreviewText" class="text-center z-10">
                                <i class="fas fa-camera text-gray-700 text-3xl mb-2 group-hover:text-blue-600 transition-colors"></i>
                                <p class="text-base font-bold text-gray-700">Thay ảnh mới</p>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50/50 px-6 py-5 rounded-[24px] border border-blue-100 flex items-center justify-between shadow-sm">
                            <label class="text-blue-600 text-base whitespace-nowrap">Đơn giá</label>
                            <div class="flex items-center gap-2 flex-1 justify-end ml-4">
                                <input type="text" name="price" value="${n.price.toLocaleString("vi-VN")}" oninput="formatCurrency(this)" class="w-full min-w-[80px] text-right font-black text-blue-700 focus:outline-none bg-transparent text-3xl" required>
                                <span class="text-lg font-bold text-blue-700">đ</span>
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-3">
                        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                            <div class="space-y-4">
                                ${A("Mã vật tư","text","sku",!0,n.sku)}
                                ${A("Thương hiệu","text","brand",!1,n.brand)}
                                
                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Phân loại</span>
                                    <select name="category" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                        <option value="Thiết bị mạng" ${n.category==="Thiết bị mạng"?"selected":""}>Thiết bị mạng</option>
                                        <option value="Cáp & Dây dẫn" ${n.category==="Cáp & Dây dẫn"?"selected":""}>Cáp & Dây dẫn</option>
                                        <option value="Phụ kiện" ${n.category==="Phụ kiện"?"selected":""}>Phụ kiện</option>
                                        <option value="Thiết bị điện" ${n.category==="Thiết bị điện"?"selected":""}>Thiết bị điện</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>

                                <div class="flex items-start">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Thông số</span>
                                    <textarea name="specs" rows="2" 
                                              class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base">${n.specs||""}</textarea>
                                </div>
                                ${A("Đơn vị tính","text","unit",!0,n.unit)}

                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Trạng thái</span>
                                    <select name="status" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none outline-none text-base appearance-none cursor-pointer">
                                        <option value="Sẵn sàng" ${n.status==="Sẵn sàng"?"selected":""}>Sẵn sàng</option>
                                        <option value="Hết hàng" ${n.status==="Hết hàng"?"selected":""}>Hết hàng</option>
                                        <option value="Ngừng cung cấp" ${n.status==="Ngừng cung cấp"?"selected":""}>Ngừng cung cấp</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>
                                
                                ${o?"":`
                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Nhà cung cấp</span>
                                    <select name="supplierCode" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                        <option value="" disabled>Chọn nhà cung cấp</option>
                                        ${db.suppliers.map(c=>`<option value="${c.supplierID}" ${n.supplierCode===c.supplierID?"selected":""}>${c.name}</option>`).join("")}
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>`}

                                <div class="flex items-start">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Mô tả</span>
                                    <textarea name="description" rows="2" 
                                              class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base">${n.description||""}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>`:i.innerHTML=`
        <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
            <!-- Header with gradient -->
            <div class="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-5 flex justify-between items-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div class="relative z-10 flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-cube text-white"></i>
                    </div>
                    <h2 class="text-lg font-extrabold text-white truncate">${n.name}</h2>
                </div>
                <div class="flex items-center gap-2 relative z-10">
                    ${l}
                    <button onclick="this.closest('.fixed').remove()" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition ml-1">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-8 bg-gray-50/30 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                    
                    <!-- Left: Image + Price -->
                    <div class="md:col-span-2 flex flex-col gap-5">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[200px]">
                            <img src="${be(n.image_url||n.image)}" alt="${n.name}" class="max-w-full max-h-[180px] object-contain">
                        </div>
                        
                        <div class="bg-gradient-to-r from-purple-50 to-violet-50 px-5 py-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                            <span class="text-purple-600 text-sm font-bold">Đơn giá</span>
                            <span class="text-2xl font-extrabold text-purple-700">${n.price.toLocaleString("vi-VN")} <span class="text-base">đ</span></span>
                        </div>

                        <!-- Status badge -->
                        <div class="flex items-center gap-2">
                            <span class="status-chip ${n.status==="Sẵn sàng"?"status-chip-green":n.status==="Hết hàng"?"status-chip-orange":"status-chip-red"} text-xs">
                                ${n.status}
                            </span>
                        </div>
                    </div>

                    <!-- Right: Details -->
                    <div class="md:col-span-3">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chi tiết</h3>
                            <div class="space-y-4">
                                ${D("Mã vật tư",n.sku)}
                                ${D("Thương hiệu",n.brand)}
                                ${D("Phân loại",n.category)}
                                ${D("Thông số kỹ thuật",n.specs||"Chưa cập nhật")}
                                ${D("Đơn vị tính",n.unit)}
                                ${o?"":D("Nhà cung cấp",r)}
                                ${D("Mô tả",n.description||"Chưa có mô tả")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,i.onclick=c=>{c.target===i&&i.remove()},document.body.appendChild(i)};function D(e,a){return`
    <div class="flex pb-3 last:border-0 last:pb-0 items-start border-b border-gray-50">
        <span class="w-36 flex-shrink-0 text-gray-400 font-bold text-xs uppercase tracking-wide pt-0.5">${e}</span>
        <span class="text-gray-800 text-sm leading-relaxed font-medium">${a||'<span class="text-gray-300 italic">—</span>'}</span>
    </div>`}window.handleMaterialFilter=function(e){var o,r,l;const a=((o=document.getElementById("searchMaterial"))==null?void 0:o.value.toLowerCase().trim())||"",t=((r=document.getElementById("filterCategory"))==null?void 0:r.value)||"",n=((l=document.getElementById("filterStatus"))==null?void 0:l.value)||"",s=le.filter(i=>{const c=(i.supplier_name||"").toLowerCase(),d=i.name.toLowerCase().includes(a)||(i.sku||"").toLowerCase().includes(a)||c.includes(a),p=t===""||i.category===t,u=n===""||i.status===n;return d&&p&&u});we(s,e)};window.addMaterial=function(){const a=localStorage.getItem("authRole")==="supplier",t=document.createElement("div");t.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",t.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-5 flex justify-between items-center bg-white sticky top-0 z-10">
            <div class="flex-1 mr-10">
                <input type="text" name="name" form="formAddMaterial" required
                       class="w-full text-2xl font-bold text-gray-800 focus:outline-none bg-transparent border-transparent focus:border-blue-200 transition-all" 
                       value="Tên vật tư mới">
            </div>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
                <button type="button" onclick="handleCreateMaterial(this)" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                    <i class="fas fa-plus-circle text-sm"></i> Tạo mới
                </button>
            </div>
        </div>

        <div class="p-8 bg-gray-50/20">
            <form id="formAddMaterial" class="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
                
                <div class="md:col-span-2 flex flex-col gap-4">
                    <div class="aspect-square bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-6 flex flex-col items-center justify-center hover:border-blue-300 transition-all cursor-pointer group"
                         onclick="document.getElementById('materialImgInput').click()">
                        <input type="file" name="image" id="materialImgInput" class="hidden" accept="image/*" onchange="previewMaterialImage(this, 'materialImgPreview', 'imgPreviewContainer')">
                        <div id="imgPreviewContainer" class="text-center">
                            <i class="fas fa-camera text-gray-200 text-3xl mb-2 group-hover:text-blue-400 transition-colors"></i>
                            <p class="text-base font-bold text-gray-300">Tải hình ảnh lên</p>
                        </div>
                        <img id="materialImgPreview" class="hidden w-full h-full object-contain rounded-xl">
                    </div>
                    
                    <div class="bg-blue-50/50 px-5 py-4 rounded-[24px] border border-blue-100 flex items-center justify-between shadow-sm">
                        <label class="text-blue-600 text-base font-bold whitespace-nowrap">Đơn giá</label>
                        <div class="flex items-center gap-2 flex-1 justify-end ml-4">
                            <input type="text" name="price" oninput="formatCurrency(this)" class="w-full min-w-[80px] text-right font-black text-blue-700 focus:outline-none bg-transparent text-3xl" required>
                            <span class="text-sm font-bold text-blue-400">đ</span>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-3">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                        <div class="space-y-3">
                            ${A("Mã vật tư","text","sku",!0)}
                            ${A("Thương hiệu","text","brand")}
                            
                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Phân loại</span>
                                <select name="category" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                    <option value="Thiết bị mạng">Thiết bị mạng</option>
                                    <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                                    <option value="Phụ kiện">Phụ kiện</option>
                                    <option value="Thiết bị điện">Thiết bị điện</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>

                            <div class="flex items-start">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Thông số</span>
                                <textarea name="specs" rows="2" 
                                          class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base"></textarea>
                            </div>
                            ${A("Đơn vị","text","unit",!0)}

                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Trạng thái</span>
                                <select name="status" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none  outline-none text-base appearance-none cursor-pointer">
                                    <option value="Sẵn sàng" selected>Sẵn sàng</option>
                                    <option value="Hết hàng">Hết hàng</option>
                                    <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                            
                            ${a?"":`
                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Nhà cung cấp</span>
                                <select name="supplierCode" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer" required>
                                    <option value="" disabled selected>Chọn nhà cung cấp</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>`}

                            <div class="flex items-start">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Mô tả</span>
                                <textarea name="description" rows="2" 
                                          class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>`,t.onclick=n=>{n.target===t&&t.remove()},document.body.appendChild(t)};window.formatCurrency=window.formatCurrency||function(e){let a=e.value.replace(/\D/g,"");a!==""?e.value=parseInt(a,10).toLocaleString("vi-VN"):e.value=""};window.previewMaterialImage=function(e,a="materialImgPreview",t="imgPreviewContainer"){const n=document.getElementById(a),s=document.getElementById(t);if(e.files&&e.files[0]){const o=new FileReader;o.onload=function(r){s&&s.classList.add("hidden"),n&&(n.src=r.target.result,n.classList.remove("hidden","opacity-40","group-hover:opacity-20"))},o.readAsDataURL(e.files[0])}};function A(e,a,t,n=!1,s=""){return`
    <div class="flex pb-2 items-center">
        <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">${e} ${n?'<span class="text-red-400">*</span>':""}</span>
        <input type="${a}" name="${t}" value="${s}" ${n?"required":""} 
               class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none text-gray-800 text-base">
    </div>`}window.handleCreateMaterial=async function(e){var l;const a=document.getElementById("formAddMaterial");if(!a.checkValidity()){a.reportValidity();return}const t=new FormData(a),n=e.closest(".fixed"),s=n?n.querySelector('input[name="name"]'):null;s?t.set("name",s.value):t.set("name","Tên vật tư mới");const o=(t.get("price")||"0").replace(/\./g,"").replace(/,/g,"");t.set("price",parseFloat(o)||0),t.get("supplierCode")&&t.set("supplier_id",t.get("supplierCode")),t.delete("supplierCode");const r=document.getElementById("materialImgInput");r&&r.files[0]&&t.set("image",r.files[0]);try{const i=localStorage.getItem("token"),d=await(await fetch("http://localhost:3000/api/materials",{method:"POST",headers:{Authorization:`Bearer ${i}`},body:t})).json();d.success?(alert("✅ Thêm vật tư mới thành công!"),e.closest(".fixed").remove(),Z()):alert("❌ Lỗi: "+(((l=d.error)==null?void 0:l.message)||"Không thể tạo vật tư"))}catch(i){alert("❌ Lỗi kết nối: "+i.message)}};window.handleUpdateMaterial=async function(e){var i;const a=document.getElementById("formEditMaterial");if(!a.checkValidity()){a.reportValidity();return}const t=a.dataset.materialId,n=new FormData(a),s=e.closest(".fixed"),o=s?s.querySelector('input[name="name"]'):null;o&&n.set("name",o.value);const r=(n.get("price")||"0").replace(/\./g,"").replace(/,/g,"");n.set("price",parseFloat(r)||0);const l=document.getElementById("editMaterialImgInput");l&&l.files[0]&&n.set("image",l.files[0]);try{const c=localStorage.getItem("token"),p=await(await fetch(`http://localhost:3000/api/materials/${t}`,{method:"PUT",headers:{Authorization:`Bearer ${c}`},body:n})).json();p.success?(alert("✅ Cập nhật vật tư thành công!"),e.closest(".fixed").remove(),Z()):alert("❌ Lỗi: "+(((i=p.error)==null?void 0:i.message)||"Không thể cập nhật"))}catch(c){alert("❌ Lỗi kết nối: "+c.message)}};window.handleDeleteMaterial=async function(e){var a;if(confirm("Bạn có chắc chắn muốn xóa vật tư này?"))try{const t=localStorage.getItem("token"),s=await(await fetch(`http://localhost:3000/api/materials/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).json();if(s.success){alert("✅ Đã xóa vật tư thành công!");const o=document.getElementById("materialDetailModal");o&&o.remove(),Z()}else alert("❌ Lỗi: "+(((a=s.error)==null?void 0:a.message)||"Không thể xóa"))}catch(t){alert("❌ Lỗi kết nối: "+t.message)}};let Oe=1;const J=12;let se=[];function Dt(){return setTimeout(async()=>{await window.loadSupplierFilterOptions(),window.fetchMaterials("staff")},0),`
    <div class="flex flex-col min-h-screen animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-boxes text-violet-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-800 tracking-tight">Danh sách vật tư</h1>
                </div>
            </div>
            <!-- Stats Badges -->
            <div class="flex items-center gap-3" id="materialStatsBar"></div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 relative z-20 animate-fadeInUp">
            <div class="flex flex-wrap gap-3 items-center">
                <div class="flex-1 min-w-[260px] relative group">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors"></i>
                    <input type="text" id="searchMaterial" oninput="window.fetchMaterials('staff')" 
                           placeholder="Tìm kiếm tên hoặc mã vật tư..."
                           class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
                </div>
                <div class="relative">
                    <select id="filterSupplier" onchange="window.fetchMaterials('staff')" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[170px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả NCC</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
                <div class="relative">
                    <select id="filterStatus" onchange="window.fetchMaterials('staff')" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[150px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Sẵn sàng">Sẵn sàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                        <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
                <div class="relative">
                    <select id="filterCategory" onchange="window.fetchMaterials('staff')" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[160px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả phân loại</option>
                        <option value="Thiết bị mạng">Thiết bị mạng</option>
                        <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                        <option value="Phụ kiện">Phụ kiện</option>
                        <option value="Thiết bị điện">Thiết bị điện</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
            </div>
        </div>

        <!-- Material Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5" id="materialCards"></div>
        
        <!-- Pagination -->
        <div id="materialPagination" class="mt-6"></div>
    </div>`}window.fetchMaterials=async function(e="staff"){var r,l,i,c;const a=((r=document.getElementById("searchMaterial"))==null?void 0:r.value)||"",t=((l=document.getElementById("filterSupplier"))==null?void 0:l.value)||"",n=((i=document.getElementById("filterStatus"))==null?void 0:i.value)||"",s=((c=document.getElementById("filterCategory"))==null?void 0:c.value)||"",o=new URLSearchParams;a&&o.append("search",a),t&&o.append("supplierId",t),n&&o.append("status",n),s&&o.append("category",s);try{const d=localStorage.getItem("token"),u=await(await fetch(`http://localhost:3000/api/materials?${o.toString()}`,{headers:{Authorization:`Bearer ${d}`}})).json();u.success&&(se=u.data,window._allMaterialsCache=u.data,Oe=1,qe(se,e,1),Et(se))}catch(d){console.error("Lỗi khi tải danh sách vật tư:",d)}};function qe(e,a,t){const n=Math.ceil(e.length/J);t>n&&n>0&&(t=n),t<1&&(t=1),Oe=t;const s=(t-1)*J,o=e.slice(s,s+J);we(o,a),Mt(e.length,n,t,a)}function Et(e){const a=document.getElementById("materialStatsBar");if(!a)return;const t=e.length,n=e.filter(o=>o.status==="Sẵn sàng").length,s=e.filter(o=>o.status==="Hết hàng").length;a.innerHTML=`
        <div class="flex flex-wrap items-center justify-end gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 cursor-default">
                <span>Tổng: <strong>${t}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Sẵn sàng: <strong>${n}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Hết hàng: <strong>${s}</strong></span>
            </div>
        </div>
    `}function Mt(e,a,t,n){const s=document.getElementById("materialPagination");if(!s)return;if(a<=1){s.innerHTML=`<div class="text-center text-xs text-gray-400 py-2">${e} vật tư</div>`;return}const o=(t-1)*J+1,r=Math.min(t*J,e);let l="";l+=`<button onclick="window.goToMaterialPage(${t-1}, '${n}')" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t<=1?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t<=1?"disabled":""}><i class="fas fa-chevron-left text-xs"></i></button>`;for(let i=1;i<=a;i++){if(a>7&&i>3&&i<a-1&&Math.abs(i-t)>1){(i===4||i===a-2)&&(l+='<span class="text-gray-300 text-xs px-1">•••</span>');continue}l+=`<button onclick="window.goToMaterialPage(${i}, '${n}')" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i===t?"bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}">${i}</button>`}l+=`<button onclick="window.goToMaterialPage(${t+1}, '${n}')" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${t>=a?"text-gray-300 cursor-not-allowed":"text-gray-600 hover:bg-gray-100"}" ${t>=a?"disabled":""}><i class="fas fa-chevron-right text-xs"></i></button>`,s.innerHTML=`
        <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between">
            <span class="text-xs text-gray-400 font-medium pl-2">Hiển thị ${o}-${r} / ${e} vật tư</span>
            <div class="flex items-center gap-1">${l}</div>
        </div>`}window.goToMaterialPage=function(e,a){var t;qe(se,a,e),(t=document.getElementById("materialCards"))==null||t.scrollIntoView({behavior:"smooth",block:"start"})};window.loadSupplierFilterOptions=async function(){const e=document.getElementById("filterSupplier");if(e)try{const a=localStorage.getItem("token"),n=await(await fetch("http://localhost:3000/api/users/suppliers?limit=100",{headers:{Authorization:`Bearer ${a}`}})).json();if(n.success){let s='<option value="">Tất cả NCC</option>';n.data.forEach(o=>{s+=`<option value="${o.id}">${o.name}</option>`}),e.innerHTML=s}}catch(a){console.error("Lỗi khi tải danh sách nhà cung cấp cho bộ lọc:",a)}};const Ht="modulepreload",Nt=function(e){return"/"+e},Be={},R=function(a,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(t.map(i=>{if(i=Nt(i),i in Be)return;Be[i]=!0;const c=i.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${d}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":Ht,c||(p.as="script"),p.crossOrigin="",p.href=i,l&&p.setAttribute("nonce",l),document.head.appendChild(p),c)return new Promise((u,g)=>{p.addEventListener("load",u),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${i}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return a().catch(o)})};function At(e){if(!e.includes("/"))return e;const a=e.split("/");return a.length===3?`${a[2]}-${a[1]}-${a[0]}`:e}function Re(e,a=!1){var y;const t=(y=window.projectDetails)==null?void 0:y[e];if(!t)return'<div class="text-red-500 font-bold p-6">Dự án không tồn tại!</div>';const{profile:n}=t,s=n.client||"Không có",o=n.category||"Chưa phân loại",r=n.budget||"Chưa có",l=n.startDate||"--/--/----",i=n.endDate||"--/--/----",c=n.status||"Khởi tạo",d=n.progress!==void 0?n.progress:0,p=t.taskInfo||"0/0",g=localStorage.getItem("authRole")==="client",h=a?`<textarea id="editProjectDescription" class="w-full text-gray-700 font-normal text-[15px] leading-snug border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 bg-gray-50/50 resize-none h-[60px] transition-shadow shadow-sm custom-scrollbar" placeholder="Nhập mô tả dự án...">${n.description||""}</textarea>`:`<p class="text-gray-600 font-normal text-base leading-relaxed text-justify h-[60px] overflow-y-auto custom-scrollbar">${n.description||"Chưa có mô tả chi tiết."}</p>`,b=a?`<div class="relative flex-1 ml-2 max-w-[320px]">
            <select id="editProjectClient" class="w-full px-3 py-1.5 pr-8 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] outline-none appearance-none cursor-pointer transition-shadow shadow-sm font-normal">
                <option value="">Chọn khách hàng...</option>
                ${(window.cachedClients||[]).map(k=>`<option value="${k.id}" ${k.name===s?"selected":""}>${k.name}</option>`).join("")}
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
           </div>`:`<span class="text-gray-700 text-base ml-1.5 font-semibold">${s}</span>`,x=a?`<div class="relative w-full ml-2">
            <select id="editProjectCategory" class="w-full px-3 py-1.5 pr-8 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] outline-none appearance-none cursor-pointer transition-shadow shadow-sm font-normal">
                <option value="Phần mềm" ${o==="Phần mềm"?"selected":""}>Phần mềm</option>
                <option value="Xây dựng" ${o==="Xây dựng"?"selected":""}>Xây dựng</option>
                <option value="An ninh, kiểm soát truy cập" ${o==="An ninh, kiểm soát truy cập"?"selected":""}>An ninh, kiểm soát truy cập</option>
                <option value="Khác" ${o==="Khác"?"selected":""}>Khác</option>
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
           </div>`:`<span class="text-gray-600 font-normal text-base ml-1.5 truncate block font-semibold">${o}</span>`,f=r.toString().replace(/[^0-9]/g,""),v=f?new Intl.NumberFormat("vi-VN").format(f):"",C=a?`<div class="relative w-full ml-2 flex items-center">
            <input type="text" id="editProjectBudget" value="${v}" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')"
                   class="w-full px-3 py-1.5 pr-7 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] transition-shadow shadow-sm font-normal" placeholder="VD: 100.000.000" />
            <span class="absolute right-3 text-gray-500 text-[15px] font-medium pointer-events-none">đ</span>
           </div>`:`<span class="text-gray-600 font-normal text-base ml-1.5 font-semibold">${r}</span>`,m=a?`<div class="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 rounded-xl px-2 py-1.5 focus-within:border-blue-500 transition-all shadow-sm ml-2 flex-1 min-w-0">
            <span class="text-gray-600 font-normal text-[15px] whitespace-nowrap">${l}</span>
            <span class="text-gray-400 text-[15px]">-</span>
            <input type="date" id="editProjectEndDate" value="${At(i)}" class="bg-transparent outline-none text-gray-800 cursor-pointer font-medium text-[15px] w-full min-w-0" />
           </div>`:`<span class="text-gray-600 font-normal text-base ml-1.5 whitespace-nowrap font-semibold">${l} – ${i}</span>`,j=g?"":`
    <div onclick="window.showAddMemberModal('${e}')" class="flex-shrink-0 flex flex-col items-center group cursor-pointer min-w-fit">
        <div class="w-14 h-14 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm">
            <i class="fas fa-plus text-xl"></i>
        </div>
        <p class="text-sm font-bold text-blue-600 leading-tight whitespace-nowrap px-2 mt-1 text-center">Thêm mới</p>
        <p class="text-xs text-gray-400 font-medium whitespace-nowrap text-center">Nhân sự</p>
    </div>`;return`
    <div class="h-full flex flex-col space-y-4 bg-white rounded-3xl p-6 text-gray-700 animate-fadeIn">
        
        <div class="grid grid-cols-12 gap-8 flex-shrink-0 items-start">
            
            <div class="col-span-8 flex flex-col justify-between h-full py-0.5">
                <div class="flex flex-col mb-2.5">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Mô tả dự án</h3>
                    ${h}
                </div>
                <div class="flex items-center mt-auto">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Khách hàng:</span>
                    ${b}
                </div>
            </div>
            
            <div class="col-span-4 flex flex-col space-y-2.5">
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1.5">Trạng thái - tiến độ</h3>
                    <div class="flex justify-between items-center gap-3">
                        <div class="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-semibold flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            ${c}
                        </div>
                        <span class="text-base font-bold text-blue-600 flex-shrink-0">${d}%</span>
                    </div>
                </div>
                
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100/30">
                    <div class="h-full bg-yellow-400 transition-all duration-500" style="width: ${d}%"></div>
                </div>

                <div class="text-sm font-medium text-gray-400 pl-1">
                    Đã hoàn thành ${p} công việc
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-8 py-1 flex-shrink-0 items-center mt-2">
            
            <div class="col-span-8 grid grid-cols-5 gap-4">
                <div class="flex items-center col-span-3">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Phân loại:</span>
                    ${x}
                </div>
                <div class="flex items-center col-span-2">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Ngân sách:</span>
                    ${C}
                </div>
            </div>

            <div class="col-span-4 flex items-center">
                <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Thời gian:</span>
                ${m}
            </div>
        </div>

        <div class="flex-1 flex flex-col space-y-4 min-h-0 pt-2">
            <div class="flex flex-col flex-shrink-0">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Nhân sự thực hiện</h3>
                <div class="flex items-start gap-6 overflow-x-auto pb-1 custom-scrollbar">
                    ${n.members.map(k=>_t(e,k.id,k.name,k.role,k.avatar)).join("")}
                    ${a?j:g?"":j} 
                </div>
            </div>

            <div class="flex flex-col flex-shrink-0 pt-3 border-t border-gray-100/40">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Tài liệu đính kèm</h3>
                <div class="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                    ${n.documents&&n.documents.length>0?n.documents.map(k=>Ft(k)).join(""):'<span class="text-xs text-gray-400 italic">Chưa có tài liệu</span>'}
                </div>
            </div>
        </div>

    </div>`}function _t(e,a,t,n,s,o,r){const i=localStorage.getItem("authRole")==="admin"&&a?`
        <div onclick="event.stopPropagation(); window.handleDeleteMember('${e}', '${a}')" 
             class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center border border-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 cursor-pointer">
            <i class="fas fa-times"></i>
        </div>`:"",c=["bg-blue-500","bg-emerald-500","bg-purple-500","bg-amber-500","bg-pink-500"],d=c[t.charCodeAt(0)%c.length],p=s?`<img src="http://localhost:3000${s}" alt="${t}" class="w-full h-full object-cover">`:`<span class="text-lg font-bold text-white">${t.charAt(0).toUpperCase()}</span>`;return`
    <div class="flex-shrink-0 flex flex-col items-center group cursor-pointer min-w-fit">
        <div class="${s?"w-14 h-14 rounded-2xl overflow-hidden relative shadow-sm":`w-14 h-14 ${d} rounded-2xl flex items-center justify-center relative shadow-sm`}">
            ${p}
            ${i}
        </div>
        <p class="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap px-2 mt-1 text-center truncate">${t}</p>
        <p class="text-xs text-gray-500 font-medium whitespace-nowrap text-center">${n}</p>
    </div>`}function Ft(e){return`<div class="flex-shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
        <i class="fas fa-file text-blue-500"></i>${e}
    </div>`}async function Kt(){try{const e=localStorage.getItem("token"),t=await(await fetch("http://localhost:3000/api/users/staff?limit=100",{headers:{Authorization:`Bearer ${e}`}})).json();return t.success?t.data:[]}catch(e){return console.error(e),[]}}async function ze(e){const a=document.getElementById("projectDetailModal");a&&a.remove();const t=localStorage.getItem("authRole"),{openProjectDetail:n}=await R(async()=>{const{openProjectDetail:s}=await Promise.resolve().then(()=>z);return{openProjectDetail:s}},void 0);await n(e,t)}window.showAddMemberModal=async function(e){var l,i,c;const a=await Kt(),n=(((c=(i=(l=window.projectDetails)==null?void 0:l[e])==null?void 0:i.profile)==null?void 0:c.members)||[]).map(d=>d.id),o=a.filter(d=>!n.includes(d.id)&&d.account_status==="active").map(d=>`<option value="${d.id}">${d.name} (${d.position||""})</option>`).join(""),r=document.createElement("div");r.className="fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4",r.innerHTML=`
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i class="fas fa-user-plus"></i>
            </div>
            <h3 class="text-lg font-extrabold text-gray-800">Thêm nhân sự</h3>
        </div>
        <form id="formAddMember" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Chọn nhân sự</label>
                <select name="staffId" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                    <option value="">-- Chọn nhân sự --</option>
                    ${o}
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Vai trò</label>
                <input type="text" name="role" required placeholder="Nhập vai trò (VD: Kỹ thuật viên)..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-semibold text-gray-800">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Thêm</button>
            </div>
        </form>
    </div>`,document.body.appendChild(r),r.onclick=d=>{d.target===r&&r.remove()},r.querySelector("form").onsubmit=async d=>{var g;d.preventDefault();const p=new FormData(d.target),u={staffId:p.get("staffId"),role:p.get("role")};try{const h=localStorage.getItem("token"),x=await(await fetch(`http://localhost:3000/api/projects/${e}/members`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify(u)})).json();x.success?(r.remove(),await ze(e)):alert("❌ Lỗi: "+(((g=x.error)==null?void 0:g.message)||"Không thể thêm nhân sự"))}catch(h){alert("❌ Lỗi kết nối: "+h.message)}}};window.handleDeleteMember=async function(e,a){var t;if(confirm("Bạn có chắc muốn xóa nhân sự này khỏi dự án?"))try{const n=localStorage.getItem("token"),o=await(await fetch(`http://localhost:3000/api/projects/${e}/members/${a}`,{method:"DELETE",headers:{Authorization:`Bearer ${n}`}})).json();o.success?await ze(e):alert("❌ Lỗi: "+(((t=o.error)==null?void 0:t.message)||"Không thể xóa nhân sự"))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};function Ue(e){var c,d,p;const a=(c=window.projectDetails)==null?void 0:c[e],t=localStorage.getItem("authRole");if(!a)return'<div class="text-red-500 font-bold p-6">Dự án không tồn tại!</div>';(a.clientQuotations||[]).some(u=>u.status==="approved"||u.status==="Đã duyệt");const s=[{name:"Khảo sát và lập kế hoạch",icon:"fa-clipboard-list",color:"indigo"},{name:"Mua thiết bị và lập báo giá",icon:"fa-shopping-cart",color:"amber"},{name:"Xác nhận thỏa thuận",icon:"fa-handshake",color:"cyan"},{name:"Triển khai lắp đặt",icon:"fa-tools",color:"blue"},{name:"Bàn giao và nghiệm thu",icon:"fa-clipboard-check",color:"purple"},{name:"Thanh toán",icon:"fa-money-bill-wave",color:"emerald"}],o=a.currentStep||1,r=s.map((u,g)=>{const h=g+1,b=a.assignments?a.assignments.find(y=>y.step&&y.step.includes(`Bước ${h}:`)):null,x=b&&b.tasks?b.tasks.filter(y=>y.title&&String(y.title).trim()!==""):[],f=x.length>0;let v="pending",C="bg-gray-200 border-gray-300",m="bg-gray-50",j="text-gray-400";return h<o?(v="completed",C="bg-emerald-500 border-emerald-500 shadow-emerald-200",m="bg-emerald-50/50",j="text-emerald-600"):h===o&&(v="active",C="bg-blue-500 border-blue-500 shadow-blue-200 animate-glow",m="bg-blue-50/50",j="text-blue-600"),`
        <div class="relative animate-fadeInUp" style="animation-delay: ${g*.08}s; animation-fill-mode: both;">
            <!-- Timeline connector -->
            ${h<6?`<div class="absolute left-[19px] top-[48px] bottom-0 w-0.5 ${h<o?"bg-emerald-200":"bg-gray-200"}"></div>`:""}
            
            <!-- Step Header -->
            <div class="flex items-center gap-3 mb-3 ${m} rounded-xl p-3 border border-transparent hover:border-gray-200 transition-all group">
                <div class="relative z-10 w-10 h-10 rounded-xl ${C} border-2 flex items-center justify-center shadow-sm flex-shrink-0 transition-all">
                    ${v==="completed"?'<i class="fas fa-check text-white text-sm"></i>':`<i class="fas ${u.icon} ${v==="active"?"text-white":j} text-sm"></i>`}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-800 text-sm">Bước ${h}: ${u.name}</h3>
                    <p class="text-xs text-gray-400 font-medium">${x.length} công việc ${v==="completed"?"• Hoàn thành":v==="active"?"• Đang thực hiện":""}</p>
                </div>
                ${t!=="client"?`<button onclick="window.addNewTaskInline('${e}', ${h})" 
                        class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all text-xs">
                    <i class="fas fa-plus"></i>
                </button>`:""}
            </div>

            <!-- Tasks Container (Drag & Drop) -->
            <div class="ml-[19px] pl-6 border-l-2 ${h<o?"border-emerald-100":h===o?"border-blue-100":"border-gray-100"} pb-4">
                <div class="space-y-2 task-sortable-list" data-step="${h}" data-project="${e}">
                    ${f?x.map(y=>qt(y.id,y.title,y.assignee,y.deadline,y.file,y.status,e)).join(""):`<div class="py-3 px-4 text-center text-gray-300 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        <i class="fas fa-inbox mr-1"></i> Kéo thả công việc vào đây hoặc bấm + để thêm
                    </div>`}
                </div>
            </div>
        </div>`}).join("");return t==="admin"&&(((d=a.profile)==null?void 0:d.status)==="Hoàn thành"||o===6||`${o}${((p=s[o-1])==null?void 0:p.name)||""}`),`
    <div class="h-full flex flex-col space-y-4 overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        ${`
    <div class="flex items-center gap-3 mb-4">
        <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 progress-bar" style="width: ${Math.round((o-1)/6*100)}%"></div>
        </div>
        <span class="text-xs font-bold text-gray-500">${o}/6</span>
    </div>`}
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            ${r}
        </div>
    </div>`}function Ot(e){if(!e)return{bg:"bg-gray-100",text:"text-gray-600",icon:"fa-circle",chipClass:"status-chip-gray"};switch(e.toLowerCase()){case"đã duyệt":return{bg:"bg-emerald-50",text:"text-emerald-700",icon:"fa-check-circle",chipClass:"status-chip-green"};case"đã nộp":return{bg:"bg-blue-50",text:"text-blue-700",icon:"fa-paper-plane",chipClass:"status-chip-blue"};case"cần sửa":return{bg:"bg-orange-50",text:"text-orange-700",icon:"fa-exclamation-circle",chipClass:"status-chip-orange"};default:return{bg:"bg-gray-50",text:"text-gray-600",icon:"fa-clock",chipClass:"status-chip-gray"}}}function qt(e,a,t,n,s,o,r){const l=localStorage.getItem("authRole"),i=l==="staff",c=l==="client",d=Ot(o);let p="";return c||(p+=`
            <button onclick="event.stopPropagation(); window.showEditTaskModal('${r}', '${e}')" title="Sửa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all opacity-0 group-hover:opacity-100">
                <i class="fas fa-pen text-[10px]"></i>
            </button>
            <button onclick="event.stopPropagation(); window.handleDeleteTask('${r}', '${e}')" title="Xóa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all opacity-0 group-hover:opacity-100">
                <i class="fas fa-trash text-[10px]"></i>
            </button>`),o==="Đã nộp"&&!c&&!i&&(p+=`
            <button onclick="event.stopPropagation(); window.handleApproveTaskDirect('${r}', '${e}')" title="Duyệt trực tiếp" 
                    class="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                <i class="fas fa-check text-[10px]"></i>
            </button>
            <button onclick="event.stopPropagation(); window.showReworkTaskModal('${r}', '${e}')" title="Yêu cầu làm lại / Bình luận" 
                    class="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                <i class="fas fa-redo text-[10px]"></i>
            </button>`),i&&(o==="Chưa nộp"||o==="Cần sửa")&&(p+=`
            <button onclick="event.stopPropagation(); window.showSubmitTaskModal('${r}', '${e}')" title="Nộp báo cáo" 
                    class="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all">
                <i class="fas fa-upload text-[10px]"></i>
            </button>`),`
    <div class="group ${d.bg} p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing hover:shadow-md relative" data-task-id="${e}">
        <div class="flex items-center gap-3">
            <div class="drag-handle flex-shrink-0 text-gray-300">
                <i class="fas fa-grip-vertical text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-gray-800 truncate">${a}</p>
                <div class="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                    <span class="flex items-center gap-1"><i class="fas fa-user-circle text-blue-400"></i>${t}</span>
                    <span class="flex items-center gap-1"><i class="far fa-calendar text-gray-300"></i>${n}</span>
                    ${s?`<a href="http://localhost:3000${s}" target="_blank" onclick="event.stopPropagation()" class="text-blue-500 hover:underline flex items-center gap-1"><i class="fas fa-paperclip"></i>Tài liệu</a>`:""}
                </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
                <span class="status-chip ${d.chipClass} text-[10px] px-2 py-0.5">${o}</span>
                ${p}
            </div>
        </div>
    </div>`}setTimeout(()=>{var e;if(typeof Sortable<"u"){const t=localStorage.getItem("authRole")==="client",n=document.querySelector(".task-sortable-list"),s=n?n.dataset.project:"",o=(e=window.projectDetails)==null?void 0:e[s];(o?o.clientQuotations||[]:[]).some(i=>i.status==="approved"||i.status==="Đã duyệt");const l=t;document.querySelectorAll(".task-sortable-list").forEach(i=>{Sortable.create(i,{group:"tasks",animation:200,ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",handle:".drag-handle",easing:"cubic-bezier(0.25, 1, 0.5, 1)",disabled:l,onEnd:function(c){console.log("Task moved:",c.item.dataset.taskId,"to step:",c.to.dataset.step)}})})}},100);async function L(e){const a=document.getElementById("projectDetailModal");a&&a.remove();const t=localStorage.getItem("authRole"),{openProjectDetail:n}=await R(async()=>{const{openProjectDetail:o}=await Promise.resolve().then(()=>z);return{openProjectDetail:o}},void 0);await n(e,t);const s=document.getElementById("tab-phancong");s&&s.click()}function ke(e){if(!e||!e.includes("/"))return e;const a=e.split("/");return a.length===3?`${a[2]}-${a[1]}-${a[0]}`:e}window.showAddTaskModal=async function(e,a){var c,d,p;const t=(c=window.projectDetails)==null?void 0:c[e],s=(((d=t==null?void 0:t.profile)==null?void 0:d.members)||[]).map(u=>`<option value="${u.id}">${u.name} (${u.role||""})</option>`).join(""),o=new Date().toISOString().split("T")[0],r=ke((p=t==null?void 0:t.profile)==null?void 0:p.startDate),l=r&&r>o?r:o,i=document.createElement("div");i.className="fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4",i.innerHTML=`
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white">
                <i class="fas fa-plus"></i>
            </div>
            <div>
                <h3 class="text-lg font-extrabold text-gray-800">Thêm công việc mới</h3>
                <p class="text-xs text-gray-400">Bước ${a}</p>
            </div>
        </div>
        <form id="formAddTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tiêu đề</label>
                <input type="text" name="title" required placeholder="Nhập tiêu đề công việc..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Mô tả</label>
                <textarea name="description" placeholder="Mô tả chi tiết..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2"></textarea>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Người thực hiện</label>
                <select name="assignee_id" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                    <option value="">-- Chọn nhân sự --</option>
                    ${s}
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Hạn hoàn thành</label>
                <input type="date" name="deadline" min="${l}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Thêm công việc</button>
            </div>
        </form>
    </div>`,document.body.appendChild(i),i.onclick=u=>{u.target===i&&i.remove()},i.querySelector("form").onsubmit=async u=>{var b;u.preventDefault();const g=new FormData(u.target),h={project_id:e,step:a,title:g.get("title"),description:g.get("description"),assignee_id:g.get("assignee_id")||null,deadline:g.get("deadline")||null};try{const x=localStorage.getItem("token"),v=await(await fetch("http://localhost:3000/api/tasks",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${x}`},body:JSON.stringify(h)})).json();v.success?(i.remove(),L(e)):alert("❌ Lỗi: "+(((b=v.error)==null?void 0:b.message)||"Không thể thêm công việc"))}catch(x){alert("❌ Lỗi kết nối: "+x.message)}}};window.showEditTaskModal=async function(e,a){var t,n,s;try{const o=localStorage.getItem("token"),l=await(await fetch(`http://localhost:3000/api/tasks/project/${e}`,{headers:{Authorization:`Bearer ${o}`}})).json(),i=l.success?l.data.find(f=>f.id===a):null;if(!i){alert("Không tìm thấy thông tin công việc!");return}const c=(t=window.projectDetails)==null?void 0:t[e],p=(((n=c==null?void 0:c.profile)==null?void 0:n.members)||[]).map(f=>`<option value="${f.id}" ${f.id===i.assignee_id?"selected":""}>${f.name} (${f.role||""})</option>`).join(""),u=new Date().toISOString().split("T")[0],g=ke((s=c==null?void 0:c.profile)==null?void 0:s.startDate),h=g&&g>u?g:u,b=i.deadline?new Date(i.deadline).toISOString().substring(0,10):"",x=document.createElement("div");x.className="fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4",x.innerHTML=`
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <i class="fas fa-edit"></i>
                </div>
                <h3 class="text-lg font-extrabold text-gray-800">Chỉnh sửa công việc</h3>
            </div>
            <form id="formEditTask" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tiêu đề</label>
                    <input type="text" name="title" required value="${i.title||""}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Mô tả</label>
                    <textarea name="description" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2">${i.description||""}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Người thực hiện</label>
                    <select name="assignee_id" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                        <option value="">-- Chọn nhân sự --</option>
                        ${p}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Hạn hoàn thành</label>
                    <input type="date" name="deadline" value="${b}" min="${h}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                </div>
                <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                    <button type="submit" class="btn-primary text-sm px-5 py-2">Lưu thay đổi</button>
                </div>
            </form>
        </div>`,document.body.appendChild(x),x.onclick=f=>{f.target===x&&x.remove()},x.querySelector("form").onsubmit=async f=>{var y;f.preventDefault();const v=new FormData(f.target),C={title:v.get("title"),description:v.get("description"),assignee_id:v.get("assignee_id")||null,deadline:v.get("deadline")||null},j=await(await fetch(`http://localhost:3000/api/tasks/${a}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(C)})).json();j.success?(x.remove(),L(e)):alert("❌ Lỗi: "+(((y=j.error)==null?void 0:y.message)||"Không thể cập nhật"))}}catch(o){alert("❌ Lỗi kết nối: "+o.message)}};window.handleDeleteTask=async function(e,a){var t;if(confirm("Bạn có chắc muốn xóa công việc này?"))try{const n=localStorage.getItem("token"),o=await(await fetch(`http://localhost:3000/api/tasks/${a}`,{method:"DELETE",headers:{Authorization:`Bearer ${n}`}})).json();o.success?L(e):alert("❌ Lỗi: "+(((t=o.error)==null?void 0:t.message)||"Không thể xóa"))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};window.handleApproveTaskDirect=async function(e,a){var t;if(confirm("Xác nhận phê duyệt nhanh công việc này?"))try{const n=localStorage.getItem("token"),s={status:"Đã duyệt",feedback:"Phê duyệt hoàn thành công việc."},r=await(await fetch(`http://localhost:3000/api/tasks/${a}/review`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify(s)})).json();r.success?(alert("✅ Đã phê duyệt công việc thành công!"),L(e)):alert("❌ Lỗi: "+(((t=r.error)==null?void 0:t.message)||"Không thể phê duyệt"))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};window.showReworkTaskModal=function(e,a){const t=document.createElement("div");t.className="fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4",t.innerHTML=`
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <i class="fas fa-redo-alt"></i>
            </div>
            <div>
                <h3 class="text-lg font-extrabold text-gray-800">Yêu cầu sửa đổi</h3>
                <p class="text-xs text-gray-400">Bình luận và chỉ rõ nội dung cần làm lại</p>
            </div>
        </div>
        <form id="formReworkTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Ý kiến bình luận / Yêu cầu chi tiết</label>
                <textarea name="feedback" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="4" placeholder="Nhập ý kiến bình luận cần chỉnh sửa..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5">
                    <i class="fas fa-paper-plane"></i> Gửi yêu cầu
                </button>
            </div>
        </form>
    </div>`,document.body.appendChild(t),t.onclick=n=>{n.target===t&&t.remove()},t.querySelector("form").onsubmit=async n=>{var r;n.preventDefault();const o={status:"Cần sửa",feedback:new FormData(n.target).get("feedback")};try{const l=localStorage.getItem("token"),c=await(await fetch(`http://localhost:3000/api/tasks/${a}/review`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`},body:JSON.stringify(o)})).json();c.success?(t.remove(),L(e)):alert("❌ Lỗi: "+(((r=c.error)==null?void 0:r.message)||"Không thể gửi yêu cầu"))}catch(l){alert("❌ Lỗi kết nối: "+l.message)}}};window.showSubmitTaskModal=function(e,a){const t=document.createElement("div");t.className="fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4",t.innerHTML=`
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h3 class="text-lg font-extrabold text-gray-800">Nộp báo cáo kết quả</h3>
        </div>
        <form id="formSubmitTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tài liệu đính kèm</label>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer" onclick="this.querySelector('input').click()">
                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-300 mb-2"></i>
                    <p class="text-xs text-gray-500 font-medium">Kéo thả hoặc bấm để chọn file</p>
                    <input type="file" name="file" required class="hidden" onchange="this.closest('div').querySelector('p').textContent = this.files[0]?.name || 'Chọn file...'">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Ghi chú</label>
                <textarea name="note" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2" placeholder="Ghi chú thêm..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Nộp kết quả</button>
            </div>
        </form>
    </div>`,document.body.appendChild(t),t.onclick=n=>{n.target===t&&t.remove()},t.querySelector("form").onsubmit=async n=>{var o;n.preventDefault();const s=new FormData(n.target);try{const r=localStorage.getItem("token"),i=await(await fetch(`http://localhost:3000/api/tasks/${a}/submit`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:s})).json();i.success?(t.remove(),L(e)):alert("❌ Lỗi: "+(((o=i.error)==null?void 0:o.message)||"Không thể nộp"))}catch(r){alert("❌ Lỗi kết nối: "+r.message)}}};window.handleAdvanceStep=async function(e,a){var t;if(confirm(`Bạn có chắc muốn chuyển dự án sang Bước ${a}?`))try{const n=localStorage.getItem("token"),o=await(await fetch(`http://localhost:3000/api/projects/${e}/status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({step:a})})).json();o.success?(alert(`✅ Đã chuyển sang Bước ${a}!`),L(e)):alert("❌ Chuyển bước thất bại: "+(((t=o.error)==null?void 0:t.message)||"Có công việc chưa được phê duyệt."))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};window.handleCloseProject=async function(e){var a;if(confirm("Bạn có chắc chắn muốn hoàn thành dự án này?"))try{const t=localStorage.getItem("token"),s=await(await fetch(`http://localhost:3000/api/projects/${e}/close`,{method:"PUT",headers:{Authorization:`Bearer ${t}`}})).json();s.success?(alert("✅ Dự án đã hoàn thành!"),L(e)):alert("❌ Hoàn thành thất bại: "+(((a=s.error)==null?void 0:a.message)||"Có lỗi xảy ra."))}catch(t){alert("❌ Lỗi kết nối: "+t.message)}};window.addNewTaskInline=async function(e,a){var u,g,h,b,x;const t=(u=window.projectDetails)==null?void 0:u[e];if(!t)return;const n=document.querySelector(`.task-sortable-list[data-step="${a}"][data-project="${e}"]`);if(!n)return;const s=n.querySelector(".inline-add-task-card");if(s){(g=s.querySelector(".inline-task-title"))==null||g.focus();return}const o=n.querySelector(".border-dashed");o&&(o.style.display="none");const l=(((h=t==null?void 0:t.profile)==null?void 0:h.members)||[]).map(f=>`<option value="${f.id}">${f.name} (${f.role||""})</option>`).join(""),i=new Date().toISOString().split("T")[0],c=ke((b=t==null?void 0:t.profile)==null?void 0:b.startDate),d=c&&c>i?c:i,p=document.createElement("div");p.className="inline-add-task-card bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-md space-y-3 animate-scaleUp mt-2",p.innerHTML=`
        <div class="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <i class="fas fa-plus-circle"></i> Tạo công việc mới (Bước ${a})
        </div>
        <div>
            <input type="text" placeholder="Nhập tiêu đề công việc..." 
                   class="inline-task-title w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-gray-50/50 font-bold text-gray-800">
        </div>
        <div>
            <textarea placeholder="Mô tả công việc (không bắt buộc)..." 
                      class="inline-task-desc w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600 resize-none" rows="1.5"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div>
                <label class="block text-[10px] font-black text-gray-400 mb-1 uppercase">Người phụ trách</label>
                <select class="inline-task-assignee w-full px-2.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600">
                    <option value="">-- Chọn nhân sự --</option>
                    ${l}
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-black text-gray-400 mb-1 uppercase">Hạn hoàn thành</label>
                <input type="date" min="${d}" 
                       class="inline-task-deadline w-full px-2.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600">
            </div>
        </div>
        <div class="flex justify-end gap-2 text-xs font-bold pt-1">
            <button onclick="window.cancelInlineTask(this)" 
                    class="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">Hủy</button>
            <button onclick="window.saveInlineTask('${e}', ${a}, this)" 
                    class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"><i class="fas fa-save"></i> Thêm</button>
        </div>
    `,n.appendChild(p),(x=p.querySelector(".inline-task-title"))==null||x.focus(),p.scrollIntoView({behavior:"smooth",block:"nearest"})};window.cancelInlineTask=function(e){const a=e.closest(".task-sortable-list");if(e.closest(".inline-add-task-card").remove(),a&&!(a.querySelectorAll(".group[data-task-id]").length>0)){const n=a.querySelector(".border-dashed");n&&(n.style.display="block")}};window.saveInlineTask=async function(e,a,t){var g;const n=t.closest(".inline-add-task-card"),s=n.querySelector(".inline-task-title"),o=n.querySelector(".inline-task-desc"),r=n.querySelector(".inline-task-assignee"),l=n.querySelector(".inline-task-deadline"),i=(s==null?void 0:s.value.trim())||"";if(!i){alert("❌ Tiêu đề công việc không được để trống!"),s==null||s.focus();return}const c=(o==null?void 0:o.value.trim())||"",d=(r==null?void 0:r.value)||null,p=(l==null?void 0:l.value)||null,u=t.innerHTML;t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i>';try{const h=localStorage.getItem("token"),b={project_id:e,step:a,title:i,description:c,assignee_id:d,deadline:p},f=await(await fetch("http://localhost:3000/api/tasks",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify(b)})).json();f.success?(n.remove(),L(e)):(alert("❌ Lỗi: "+(((g=f.error)==null?void 0:g.message)||"Không thể thêm công việc")),t.disabled=!1,t.innerHTML=u)}catch(h){alert("❌ Lỗi kết nối: "+h.message),t.disabled=!1,t.innerHTML=u}};function Rt(e,a){var p;const t=(p=window.projectDetails)==null?void 0:p[e],n=t&&t.materials?t.materials:[],s=a==="client",o=n.reduce((u,g)=>(u[g.supplier]||(u[g.supplier]={status:g.status,items:[]}),u[g.supplier].items.push({...g,isMock:!1}),u),{}),r=u=>u==="Đã giao hàng"||u==="Hoàn thành"?"bg-emerald-50 text-emerald-700 border-emerald-200":u==="Chờ chốt đơn"||u==="Đang xử lý"?"bg-amber-50 text-amber-700 border-amber-200":u==="Chưa đặt hàng"?"bg-gray-100 text-gray-700 border-gray-200":u==="Mới"?"bg-blue-50 text-blue-700 border-blue-200":"bg-gray-50 text-gray-600 border-gray-200",l=s?n.length>0?n.map(u=>{const g=u.priceBuy*(1+u.markup/100),h=g*u.quantity;return`
                    <tr class="border-b border-gray-50 hover:bg-blue-50/30 transition text-sm text-gray-700 bg-white">
                        <td class="px-5 py-3.5 font-semibold text-gray-800 truncate" title="${u.name}">${u.name}</td>
                        <td class="px-4 py-3.5 text-center font-bold text-gray-700">${u.quantity}</td>
                        <td class="px-4 py-3.5 text-gray-600">${g.toLocaleString()}đ</td>
                        <td class="px-4 py-3.5 font-bold text-blue-600">${h.toLocaleString()}đ</td>
                    </tr>`}).join(""):`<tr><td colspan="4" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                    <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i class="fas fa-box-open text-xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 font-semibold text-sm">Chưa có báo giá nào</p>
                </div>
            </td></tr>`:Object.keys(o).length>0?Object.entries(o).map(([u,g])=>`
                <tr class="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-y border-gray-100">
                    <td colspan="7" class="p-0">
                        <div class="flex justify-between items-center w-full px-5 py-3">
                            <span class="font-bold text-sm text-gray-700 flex items-center gap-2">
                                <i class="fas fa-truck text-blue-400 text-xs"></i>
                                NCC: <span class="text-blue-700">${u}</span>
                            </span>
                            <div class="flex items-center gap-2.5">
                                <span class="text-xs font-bold px-3 py-1 rounded-full border ${r(g.status)}">${g.status}</span>
                                ${g.status==="Chưa đặt hàng"?`
                                    <button onclick="window.placeOrderForSupplier('${e}', '${u}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all shadow-sm">
                                        <i class="fas fa-shopping-cart text-[9px]"></i> Đặt hàng
                                    </button>
                                `:""}
                            </div>
                        </div>
                    </td>
                </tr>
                ${g.items.map(h=>{const b=`${h.priceBuy.toLocaleString()}đ`,x=`${(h.priceBuy*h.quantity).toLocaleString()}đ`,f=`${(h.priceBuy*(1+h.markup/100)*h.quantity).toLocaleString()}đ`;return`
                        <tr class="border-b border-gray-50 hover:bg-blue-50/30 transition text-sm text-gray-700 bg-white group" data-id="${h.id}" data-price-buy="${h.priceBuy}">
                            <td class="px-5 py-3.5">
                                <p class="font-semibold text-gray-800 truncate hover:text-blue-600 transition cursor-pointer" title="${h.name}">${h.name}</p>
                            </td>
                            <td class="px-4 py-3.5 text-gray-600">${b}</td>
                            <td class="px-4 py-3.5 text-center">
                                <input type="number" value="${h.quantity}" min="1" oninput="window.recalculateRow(this)" class="vattu-qty-input w-14 px-2 py-1 bg-gray-50 text-gray-800 focus:border-blue-400 border border-gray-200 rounded-lg text-center font-bold focus:outline-none text-sm transition-all">
                            </td>
                            <td class="vattu-total-buy px-4 py-3.5 font-medium text-gray-700">${x}</td>
                            <td class="px-4 py-3.5 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <input type="number" value="${h.markup}" min="0" max="100" oninput="window.recalculateRow(this)" class="vattu-markup-input w-12 px-1.5 py-1 bg-gray-50 text-blue-600 focus:border-blue-400 border border-gray-200 rounded-lg text-center font-bold focus:outline-none text-sm">
                                    <span class="text-blue-500 font-bold text-xs">%</span>
                                </div>
                            </td>
                            <td class="vattu-total-sell px-4 py-3.5 font-bold text-blue-600">${f}</td>
                            <td class="px-2 py-3.5 text-center">
                                <button onclick="event.stopPropagation(); window.handleDeleteProjectItem('${e}', '${h.id}')" 
                                        class="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </td>
                        </tr>`}).join("")}`).join(""):`<tr><td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                    <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i class="fas fa-box-open text-xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 font-semibold text-sm">Chưa có vật tư nào</p>
                    <p class="text-gray-400 text-xs mt-1">Bấm "Chọn vật tư từ kho" để thêm</p>
                </div>
            </td></tr>`;let i="";const c=(t==null?void 0:t.clientQuotations)||[];if(s){const u=c.find(g=>g.status==="pending"||g.status==="draft")||c[0];if(u){const h={approved:{text:"Đã duyệt",class:"bg-emerald-50 text-emerald-700 border-emerald-200"},"Đã duyệt":{text:"Đã duyệt",class:"bg-emerald-50 text-emerald-700 border-emerald-200"},rejected:{text:"Đã từ chối",class:"bg-red-50 text-red-700 border-red-200"},"Từ chối":{text:"Đã từ chối",class:"bg-red-50 text-red-700 border-red-200"},pending:{text:"Chờ duyệt",class:"bg-amber-50 text-amber-700 border-amber-200"},"Chờ duyệt":{text:"Chờ duyệt",class:"bg-amber-50 text-amber-700 border-amber-200"},draft:{text:"Bản nháp",class:"bg-gray-50 text-gray-700 border-gray-200"}}[u.status]||{text:u.status,class:"bg-gray-50 text-gray-700 border-gray-200"};i=`
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div>
                            <p class="font-extrabold text-gray-800 text-sm">Báo giá của bạn</p>
                            <p class="text-xs text-gray-400 font-medium">Trạng thái: <span class="px-2 py-0.5 rounded-full border text-[10px] ${h.class}">${h.text}</span></p>
                        </div>
                    </div>
                    ${u.status==="pending"||u.status==="draft"?`
                        <div class="flex gap-2">
                            <button onclick="window.handleUpdateQuotationStatus('${e}', '${u.id}', 'approved')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all">
                                <i class="fas fa-check mr-1"></i> Duyệt báo giá
                            </button>
                            <button onclick="window.handleUpdateQuotationStatus('${e}', '${u.id}', 'rejected')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all">
                                <i class="fas fa-times mr-1"></i> Từ chối
                            </button>
                        </div>
                    `:""}
                </div>`}else i=`
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                    <p class="text-xs text-gray-400 italic">Chưa có báo giá khách hàng nào được gửi.</p>
                </div>`}const d=s?"":`<div class="flex flex-wrap justify-end items-center gap-2.5 pt-2 flex-shrink-0">
            <button onclick="saveVattuChanges('${e}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md">
                <i class="fas fa-save"></i> Lưu thay đổi
            </button>
            <button onclick="openSideDrawerChonVattu('${e}')" class="btn-primary text-xs px-4 py-2.5 flex items-center gap-2">
                <i class="fas fa-plus"></i> Chọn vật tư từ kho
            </button>
            <button onclick="alert('Đã gửi báo giá cho khách hàng.')" class="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                <i class="fas fa-paper-plane"></i> Gửi báo giá
            </button>
            <button onclick="alert('Đang khởi tạo hợp đồng.')" class="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                <i class="fas fa-file-contract"></i> Lập hợp đồng
            </button>
            <button onclick="alert('Đã tạo đơn đặt hàng.')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                <i class="fas fa-truck-loading"></i> Xác nhận đơn
            </button>
        </div>`;return`
    <div class="h-full flex flex-col justify-between overflow-hidden min-h-0 space-y-4 animate-fadeIn">
        ${i}
        <div class="flex-1 overflow-y-auto border border-gray-200 rounded-2xl custom-scrollbar min-h-0 bg-white shadow-sm">
            <table class="w-full text-left border-collapse table-fixed">
                <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide sticky top-0 z-10 border-b border-gray-200">
                    ${s?`
                        <tr>
                            <th class="px-5 py-3.5 w-[50%]">Vật tư</th>
                            <th class="px-4 py-3.5 w-[15%] text-center">SL</th>
                            <th class="px-4 py-3.5 w-[15%]">Đơn giá bán</th>
                            <th class="px-4 py-3.5 w-[20%]">Thành tiền bán</th>
                        </tr>
                    `:`
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
                <tbody>${l}</tbody>
            </table>
        </div>
        ${d}
    </div>`}window.handleUpdateQuotationStatus=async function(e,a,t){var s;const n=t==="approved"?"phê duyệt":"từ chối";if(confirm(`Bạn có chắc muốn ${n} báo giá này?`))try{const o=localStorage.getItem("token"),l=await(await fetch(`http://localhost:3000/api/projects/${e}/quotation-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({status:t})})).json();if(l.success){alert(`✅ Đã ${n} báo giá thành công!`);const i=localStorage.getItem("authRole"),{openProjectDetail:c}=await R(async()=>{const{openProjectDetail:p}=await Promise.resolve().then(()=>z);return{openProjectDetail:p}},void 0);await c(e,i);const d=document.getElementById("tab-vattuduan");d&&d.click()}else alert("❌ Thất bại: "+(((s=l.error)==null?void 0:s.message)||"Có lỗi xảy ra."))}catch(o){alert("❌ Lỗi kết nối: "+o.message)}};const zt=e=>e?e.startsWith("/uploads")?`http://localhost:3000${e}`:e:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200";window.openSideDrawerChonVattu=async function(e){let a=[];try{const s=localStorage.getItem("token"),r=await(await fetch("http://localhost:3000/api/materials",{headers:{Authorization:`Bearer ${s}`}})).json();r.success&&(a=r.data)}catch(s){console.error("Lỗi tải vật tư:",s)}const t=document.createElement("div");t.id="drawerChonVattu",t.className="fixed inset-0 z-[120] overflow-hidden";const n=a.slice(0,15).map(s=>{const o=JSON.stringify(s).replace(/'/g,"\\'").replace(/"/g,"&quot;");return`
        <div class="bg-white border border-gray-100 p-3 rounded-xl flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all group">
            <img src="${zt(s.image_url||s.image)}" alt="${s.name}" class="w-10 h-10 object-contain rounded-lg border border-gray-100 flex-shrink-0 p-1">
            <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-800 text-xs truncate group-hover:text-blue-600 transition-colors">${s.name}</p>
                <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">${s.brand||"N/A"}</span>
                    <span class="text-xs font-bold text-blue-600">${(parseFloat(s.price)||0).toLocaleString()}đ</span>
                </div>
            </div>
            <button onclick="window.addMaterialToProject('${e}', '${o}')" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all text-xs flex-shrink-0">
                <i class="fas fa-plus"></i>
            </button>
        </div>`}).join("");t.innerHTML=`
        <div onclick="this.closest('.fixed').remove()" class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"></div>
        <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slideInRight border-l border-gray-100">
            <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h4 class="text-sm font-extrabold text-gray-800">Kho vật tư</h4>
                    <p class="text-[10px] text-gray-400">${a.length} sản phẩm</p>
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
            <div class="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">${n||'<p class="text-gray-400 text-center py-8 text-xs">Không có vật tư</p>'}</div>
            <div class="p-4 border-t border-gray-100">
                <button onclick="this.closest('.fixed').remove()" class="w-full btn-primary py-2.5 text-xs text-center">
                    Xong
                </button>
            </div>
        </div>`,document.body.appendChild(t)};window.addMaterialToProject=async function(e,a){var t;try{const n=JSON.parse(a.replace(/&quot;/g,'"')),s=localStorage.getItem("token"),o={project_id:e,material_id:n.id,quantity:1,markup:10},l=await(await fetch("http://localhost:3000/api/orders/project-item",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(o)})).json();if(l.success){alert(`✅ Đã thêm "${n.name}" vào dự án (Chưa đặt hàng)!`);const i=localStorage.getItem("authRole"),{openProjectDetail:c}=await R(async()=>{const{openProjectDetail:p}=await Promise.resolve().then(()=>z);return{openProjectDetail:p}},void 0);await c(e,i);const d=document.getElementById("tab-vattuduan");d&&d.click()}else alert("❌ Thêm thất bại: "+(((t=l.error)==null?void 0:t.message)||"Lỗi không xác định"))}catch(n){console.error("Lỗi khi thêm vật tư:",n),alert("❌ Lỗi kết nối: "+n.message)}};window.recalculateRow=function(e){const a=e.closest("tr");if(!a)return;const t=parseFloat(a.getAttribute("data-price-buy")||0),n=a.querySelector(".vattu-qty-input"),s=a.querySelector(".vattu-markup-input"),o=parseInt((n==null?void 0:n.value)||1),r=parseInt((s==null?void 0:s.value)||0),l=t*o,i=t*(1+r/100)*o,c=a.querySelector(".vattu-total-buy"),d=a.querySelector(".vattu-total-sell");c&&(c.textContent=l.toLocaleString()+"đ"),d&&(d.textContent=i.toLocaleString()+"đ")};window.saveVattuChanges=async function(e){const a=document.querySelectorAll("tr[data-id]");if(a.length===0)return;const t=localStorage.getItem("token");let n=!1;const s=document.querySelector('button[onclick^="saveVattuChanges"]'),o=s?s.innerHTML:"";s&&(s.disabled=!0,s.innerHTML='<i class="fas fa-spinner fa-spin"></i> Đang lưu...');try{const r=Array.from(a).map(async l=>{var b;const i=l.getAttribute("data-id"),c=l.querySelector(".vattu-qty-input"),d=l.querySelector(".vattu-markup-input"),p=parseInt((c==null?void 0:c.value)||1),u=parseInt((d==null?void 0:d.value)||0),h=await(await fetch(`http://localhost:3000/api/orders/project-item/${i}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({quantity:p,markup:u})})).json();h.success||(n=!0,console.error(`Lỗi cập nhật item ${i}:`,(b=h.error)==null?void 0:b.message))});if(await Promise.all(r),alert(n?"⚠️ Một số vật tư cập nhật bị lỗi. Vui lòng kiểm tra lại!":"✅ Đã lưu tất cả thay đổi thành công!"),typeof window.openProjectDetail=="function"){const l=localStorage.getItem("authRole");await window.openProjectDetail(e,l,"vattuduan")}}catch(r){alert("❌ Lỗi kết nối: "+r.message)}finally{s&&(s.disabled=!1,s.innerHTML=o)}};window.placeOrderForSupplier=async function(e,a){var i,c;const t=(i=window.projectDetails)==null?void 0:i[e],s=(t&&t.materials?t.materials:[]).filter(d=>d.supplier===a&&d.status==="Chưa đặt hàng");if(s.length===0){alert("Không có vật tư chưa đặt hàng nào cho nhà cung cấp này!");return}const o=s[0].supplier_id,r=s.map(d=>({material_id:d.material_id,quantity:d.quantity,markup:d.markup})),l=s.reduce((d,p)=>d+p.priceBuy*p.quantity,0);if(confirm(`Xác nhận đặt hàng nhóm vật tư này từ nhà cung cấp ${a}?
Tổng giá trị: ${l.toLocaleString()}đ`))try{const d=localStorage.getItem("token"),p={project_id:e,supplier_id:o,address:"Văn phòng dự án e-Teck",status:"Mới",total_value:l,items:r},g=await(await fetch("http://localhost:3000/api/orders",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(p)})).json();if(g.success){alert("✅ Đã đặt hàng thành công! Đơn đặt hàng mới đã được gửi đến nhà cung cấp.");const h=localStorage.getItem("authRole"),{openProjectDetail:b}=await R(async()=>{const{openProjectDetail:f}=await Promise.resolve().then(()=>z);return{openProjectDetail:f}},void 0);await b(e,h);const x=document.getElementById("tab-vattuduan");x&&x.click()}else alert("❌ Đặt hàng thất bại: "+(((c=g.error)==null?void 0:c.message)||"Lỗi không xác định"))}catch(d){alert("❌ Lỗi kết nối: "+d.message)}};window.handleDeleteProjectItem=async function(e,a){var t;if(confirm("Bạn có chắc chắn muốn xóa vật tư này khỏi dự án?"))try{const n=localStorage.getItem("token"),o=await(await fetch(`http://localhost:3000/api/orders/project-item/${a}`,{method:"DELETE",headers:{Authorization:`Bearer ${n}`}})).json();if(o.success){alert("✅ Đã xóa vật tư thành công!");const r=localStorage.getItem("authRole"),{openProjectDetail:l}=await R(async()=>{const{openProjectDetail:c}=await Promise.resolve().then(()=>z);return{openProjectDetail:c}},void 0);await l(e,r);const i=document.getElementById("tab-vattuduan");i&&i.click()}else alert("❌ Xóa thất bại: "+(((t=o.error)==null?void 0:t.message)||"Lỗi không xác định"))}catch(n){alert("❌ Lỗi kết nối: "+n.message)}};window.projectDetails=window.projectDetails||{};const De=window.projectDetails;window.isProjectEditMode=!1;async function ee(e,a,t="hoso"){window.isProjectEditMode=!1;try{const f=localStorage.getItem("token"),C=await(await fetch(`http://localhost:3000/api/projects/${e}`,{headers:{Authorization:`Bearer ${f}`}})).json();if(!C.success){alert("Không thể tải chi tiết dự án!");return}const m=C.data,y=await(await fetch(`http://localhost:3000/api/tasks/project/${e}`,{headers:{Authorization:`Bearer ${f}`}})).json(),k=y.success?y.data:[];try{const B=await(await fetch("http://localhost:3000/api/users/clients?limit=100",{headers:{Authorization:`Bearer ${f}`}})).json();window.cachedClients=B.success?B.data:[]}catch{window.cachedClients=[]}let je=[],ue=[],Ye=[];try{const B=await(await fetch(`http://localhost:3000/api/orders/project/${e}`,{headers:{Authorization:`Bearer ${f}`}})).json();(B.success?B.data:[]).forEach(S=>{const tt=S.supplier_name||S.supplier_id||"Nhà cung cấp",at=S.status==="Hoàn thành"?"Đã giao hàng":S.status==="Đang xử lý"?"Chờ chốt đơn":S.status==="Chưa đặt hàng"?"Chưa đặt hàng":S.status==="Mới"?"Mới":"Yêu cầu báo giá";S.items&&S.items.length>0&&S.items.forEach(H=>{const nt=parseFloat(H.material_price||0),st=parseInt(H.markup||10);je.push({id:H.id,name:H.material_name||"Vật tư không tên",priceBuy:nt,quantity:parseInt(H.quantity||1),markup:st,supplier:tt,supplier_id:S.supplier_id,status:at,material_id:H.material_id})})})}catch(w){console.error("Lỗi tải đơn hàng/vật tư:",w)}m.current_step===3?ue.push({id:`BG-${e}`,status:"pending",project_title:m.title}):m.current_step>=4&&ue.push({id:`BG-${e}`,status:"approved",project_title:m.title});const We=[1,2,3,4,5,6].map(w=>{const B=k.filter(T=>T.step===w).map(T=>({id:T.id,title:T.title||T.description||"Không có tiêu đề",assignee:T.assignee_name||"Chưa phân công",deadline:T.deadline?new Date(T.deadline).toLocaleDateString("vi-VN"):"Không có",file:T.file_path||"",status:T.status||"Chưa nộp"}));return{step:`Bước ${w}:`,tasks:B}}),Ze=k.length,et=k.filter(w=>w.status==="Đã duyệt").length;De[e]={id:e,currentStep:m.current_step||1,profile:{title:m.title,description:m.description||"Chưa có mô tả chi tiết.",category:m.category||"Chưa phân loại",startDate:m.start_date?new Date(m.start_date).toLocaleDateString("vi-VN"):"--/--/----",endDate:m.end_date?new Date(m.end_date).toLocaleDateString("vi-VN"):"--/--/----",status:m.status||"Khởi tạo",progress:m.progress||0,client:m.client_name||"Không có",clientId:m.client_id||null,budget:m.budget?`${m.budget.toLocaleString()}đ`:"Chưa có",members:m.members?m.members.map(w=>({id:w.staff_id||w.id,name:w.staff_name||w.name,role:w.role||"Thành viên",avatar:w.avatar||null})):[],documents:[]},assignments:We,materials:je,taskInfo:`${et}/${Ze}`,clientQuotations:ue,supplierQuotations:Ye}}catch(f){console.error("Lỗi tải chi tiết dự án:",f),alert("❌ Đã xảy ra lỗi khi đồng bộ dữ liệu dự án từ máy chủ.");return}const n=De[e],s=n.profile.title,o=a||localStorage.getItem("authRole"),r=o==="client";(n.clientQuotations||[]).some(f=>f.status==="approved"||f.status==="Đã duyệt"),["Khảo sát và lập kế hoạch","Mua thiết bị và lập báo giá","Xác nhận thỏa thuận","Triển khai lắp đặt","Bàn giao và nghiệm thu","Thanh toán"][(n.currentStep||1)-1];const c=o==="admin",d=n.currentStep===0,p=c?`
        <div id="modal-action-buttons" class="flex items-center gap-2">
            ${d?`
            <button onclick="window.approveProject('${e}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-sm transition-all animate-pulse">
                <i class="fas fa-check text-xs"></i> Phê duyệt dự án
            </button>
            `:""}
            <button onclick="window.toggleEditProject(true, '${e}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm transition-all">
                <i class="fas fa-edit text-xs"></i> Sửa
            </button>
            <button onclick="window.deleteProject('${e}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm transition-all">
                <i class="fas fa-trash text-xs"></i> Xóa
            </button>
        </div>`:"",u=document.getElementById("projectDetailModal");u&&u.remove();const g=document.createElement("div");g.id="projectDetailModal",g.className="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4 animate-fadeIn";const b=[{id:"hoso",label:"Hồ sơ",icon:"fa-file-alt"},{id:"phancong",label:r?"Tiến độ":"Phân công",icon:"fa-tasks"},{id:"vattuduan",label:r?"Báo giá":"Vật tư",icon:"fa-boxes"}].map(f=>`
        <button onclick="switchTab(this, '${f.id}', '${e}')" id="tab-${f.id}" 
                class="tab-button flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${f.id===t?"bg-blue-50 text-blue-600":"text-gray-400 hover:text-gray-600 hover:bg-gray-50"}">
            <i class="fas ${f.icon} text-xs"></i> ${f.label}
        </button>
    `).join("");g.innerHTML=`
    <div class="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl flex overflow-hidden relative animate-scaleUp border border-gray-100">
        <div class="flex-1 flex flex-col h-full overflow-hidden">
            <div class="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div class="flex items-center gap-4 flex-1 min-w-0 mr-6">
                    <div class="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <i class="fas fa-project-diagram text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 id="projectTitleContainer" class="text-lg font-extrabold text-gray-800 truncate w-full">${s}</h2>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${p}
                    <button onclick="document.getElementById('projectDetailModal').remove()" 
                            class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="px-6 py-2 border-b border-gray-50 bg-gray-50/50 flex-shrink-0 flex flex-wrap justify-between items-center gap-3">
                <div class="flex items-center gap-1">${b}</div>
            </div>

            <!-- Content -->
            <div class="flex-1 px-6 py-5 bg-gray-50/30 overflow-hidden flex flex-col">
                <div id="modalContent" class="flex-1 overflow-hidden animate-fadeIn"></div>
            </div>
        </div>
    </div>`,document.body.appendChild(g),g.onclick=f=>{f.target===g&&g.remove()};const x=document.getElementById(`tab-${t}`)||document.getElementById("tab-hoso");window.switchTab(x,t,e)}window.toggleEditProject=function(e,a){window.isProjectEditMode=e;const t=document.getElementById("modal-action-buttons");t&&(e?t.innerHTML=`
                <button onclick="window.toggleEditProject(false, '${a}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-sm transition-all">
                    <i class="fas fa-times text-xs"></i> Hủy
                </button>
                <button onclick="window.saveProject('${a}')" class="flex items-center gap-2 px-4 py-2 rounded-xl gradient-success text-white font-bold text-sm transition-all shadow-md hover:shadow-lg">
                    <i class="fas fa-save text-xs"></i> Lưu
                </button>`:t.innerHTML=`
                <button onclick="window.toggleEditProject(true, '${a}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm transition-all">
                    <i class="fas fa-edit text-xs"></i> Sửa
                </button>
                <button onclick="window.deleteProject('${a}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm transition-all">
                    <i class="fas fa-trash text-xs"></i> Xóa
                </button>`);const n=document.getElementById("projectTitleContainer");if(n)if(e){const o=n.innerText.trim();n.innerHTML=`<input id="editProjectTitle" type="text" value="${o}" class="w-full text-lg font-extrabold text-gray-800 focus:outline-none bg-transparent border-b-2 border-blue-400 py-1 transition-all">`}else{const o=document.getElementById("editProjectTitle"),r=o?o.value.trim():n.innerText.trim();n.innerHTML=r}const s=document.getElementById("tab-hoso");s&&window.switchTab(s,"hoso",a)};window.saveProject=async function(e){var i,c,d,p,u,g,h;const a=(i=document.getElementById("editProjectTitle"))==null?void 0:i.value.trim(),t=(c=document.getElementById("editProjectDescription"))==null?void 0:c.value.trim(),n=(d=document.getElementById("editProjectClient"))==null?void 0:d.value,s=(p=document.getElementById("editProjectCategory"))==null?void 0:p.value,o=((u=document.getElementById("editProjectBudget"))==null?void 0:u.value)||"",r=o.replace(/[^0-9]/g,"")?parseInt(o.replace(/[^0-9]/g,"")):null,l=((g=document.getElementById("editProjectEndDate"))==null?void 0:g.value)||null;if(!a){alert("❌ Tiêu đề dự án không được để trống!");return}try{const b=localStorage.getItem("token"),f=await(await fetch(`http://localhost:3000/api/projects/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`},body:JSON.stringify({title:a,description:t,clientId:n||null,category:s,budget:r,endDate:l})})).json();f.success?(alert("✅ Đã lưu thông tin dự án!"),window.toggleEditProject(!1,e),await ee(e),typeof window.fetchProjectsFromServer=="function"&&window.fetchProjectsFromServer()):alert("❌ Cập nhật thất bại: "+(((h=f.error)==null?void 0:h.message)||"Lỗi không xác định"))}catch(b){alert("❌ Lỗi kết nối: "+b.message)}};function $e(e,a,t){document.querySelectorAll(".tab-button").forEach(o=>{o.classList.remove("bg-blue-50","text-blue-600"),o.classList.add("text-gray-400")}),e&&(e.classList.add("bg-blue-50","text-blue-600"),e.classList.remove("text-gray-400"));const n=document.getElementById("modalContent");if(!n)return;const s=localStorage.getItem("authRole");if(a==="hoso"){const o=window.renderHoso||Re;if(typeof o=="function")try{n.innerHTML=o(t,window.isProjectEditMode)}catch(r){console.error("Lỗi renderHoso:",r),n.innerHTML=`<div class="text-red-500 p-6 font-bold">Lỗi hiển thị hồ sơ: ${r.message}</div>`}}else if(a==="phancong"){const o=window.renderPhancong||Ue;if(typeof o=="function")try{n.innerHTML=o(t,s)}catch(r){console.error("Lỗi renderPhancong:",r),n.innerHTML=`<div class="text-red-500 p-6 font-bold">Lỗi hiển thị phân công: ${r.message}</div>`}else console.error("renderPhancongFn is not a function"),n.innerHTML='<div class="text-red-500 p-6 font-bold">Không tìm thấy hàm hiển thị phân công!</div>'}else if(a==="vattuduan"){const o=window.renderTabVattuDuan||Rt;if(typeof o=="function")try{n.innerHTML=o(t,s)}catch(r){console.error("Lỗi renderTabVattuDuan:",r),n.innerHTML=`<div class="text-red-500 p-6 font-bold">Lỗi hiển thị vật tư dự án: ${r.message}</div>`}}}window.switchTab=$e;window.openProjectDetail=ee;window.deleteProject=async function(e){var a;if(confirm("Bạn có chắc chắn muốn xóa dự án này? Thao tác này không thể hoàn tác."))try{const t=localStorage.getItem("token"),s=await(await fetch(`http://localhost:3000/api/projects/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).json();if(s.success){alert("✅ Dự án đã được xóa!");const o=document.getElementById("projectDetailModal");o&&o.remove(),typeof window.fetchProjectsFromServer=="function"&&window.fetchProjectsFromServer()}else alert("❌ Xóa thất bại: "+(((a=s.error)==null?void 0:a.message)||"Lỗi không xác định"))}catch(t){alert("❌ Lỗi kết nối: "+t.message)}};window.approveProject=async function(e){var a;if(confirm("Bạn có chắc chắn muốn phê duyệt dự án này và chuyển sang giai đoạn Khảo sát và lập kế hoạch (bước 1)?"))try{const t=localStorage.getItem("token"),s=await(await fetch(`http://localhost:3000/api/projects/${e}/status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({step:1})})).json();s.success?(alert("✅ Phê duyệt dự án thành công!"),await ee(e),typeof window.fetchProjectsFromServer=="function"&&window.fetchProjectsFromServer()):alert("❌ Phê duyệt thất bại: "+(((a=s.error)==null?void 0:a.message)||"Lỗi không xác định"))}catch(t){alert("❌ Lỗi kết nối: "+t.message)}};const z=Object.freeze(Object.defineProperty({__proto__:null,openProjectDetail:ee,switchTab:$e},Symbol.toStringTag,{value:"Module"}));function Ut(){return setTimeout(()=>{window.fetchDashboardReport()},0),`
    <div class="max-w-7xl mx-auto animate-fadeIn space-y-6">
        <!-- Header -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-7 shadow-xl animate-fadeInDown">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div class="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
            <div class="absolute top-1/3 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-float"></div>
            
            <div class="relative z-10 flex justify-between items-center">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <i class="fas fa-chart-pie text-white"></i>
                        </div>
                        <span class="text-blue-100 text-xs font-semibold tracking-wide uppercase">Analytics</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-white tracking-tight">Báo cáo & Thống kê</h1>
                    <p class="text-blue-100/70 font-medium text-sm mt-0.5">Tổng quan hiệu suất và tiến độ dự án</p>
                </div>
                <button onclick="window.fetchDashboardReport()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all text-sm font-bold">
                    <i class="fas fa-sync-alt text-xs"></i> Làm mới
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-4 relative z-20">
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.05s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><i class="fas fa-folder text-blue-500"></i></div>
                    <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
                <p id="statTotalProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Tổng dự án</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.1s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><i class="fas fa-bolt text-amber-500"></i></div>
                </div>
                <p id="statActiveProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Đang thực hiện</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.15s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><i class="fas fa-check-double text-emerald-500"></i></div>
                </div>
                <p id="statCompletedProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Hoàn thành</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.2s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><i class="fas fa-coins text-purple-500"></i></div>
                </div>
                <p id="statApprovedBudget" class="text-lg font-extrabold text-gray-800">0 ₫</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Doanh thu duyệt</p>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Donut Chart: Task Status -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.25s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-tasks text-blue-400"></i> Trạng thái công việc</h3>
                <div class="flex items-center justify-center" id="donutChartContainer">
                    <div class="w-40 h-40 rounded-full bg-gray-100 animate-pulse-slow"></div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-4" id="donutLegend"></div>
            </div>

            <!-- Bar Chart: Tasks per Project -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 animate-fadeInUp" style="animation-delay:0.3s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-indigo-400"></i> Công việc theo dự án</h3>
                <div id="barChartContainer" class="h-48 flex items-end gap-3 px-2">
                    <div class="flex-1 bg-gray-100 rounded-t-lg animate-pulse-slow h-full"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Budget Progress -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.35s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2"><i class="fas fa-wallet text-emerald-400"></i> Ngân sách & Báo giá</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-500">Đã duyệt</span>
                        <span id="budgetApprovedText" class="text-sm font-bold text-emerald-600">0 ₫</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-500">Chờ duyệt</span>
                        <span id="budgetPendingText" class="text-sm font-bold text-amber-600">0 ₫</span>
                    </div>
                    <div class="pt-3 border-t border-gray-100">
                        <div class="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
                            <span>Tỉ lệ duyệt</span>
                            <span id="approvedRatioText">0%</span>
                        </div>
                        <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div id="approvedRatioBar" class="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-700 progress-bar" style="width:0%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task Status Bars -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.4s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2"><i class="fas fa-list-check text-amber-400"></i> Chi tiết trạng thái</h3>
                <div class="space-y-3" id="taskChartContainer"></div>
            </div>
        </div>
    </div>`}function Vt(e){const a=document.getElementById("donutChartContainer"),t=document.getElementById("donutLegend");if(!a)return;const n=[{label:"Chưa nộp",count:e["Chưa nộp"]||0,color:"#F59E0B"},{label:"Đã nộp",count:e["Đã nộp"]||0,color:"#3B82F6"},{label:"Cần sửa",count:e["Cần sửa"]||0,color:"#EF4444"},{label:"Đã duyệt",count:e["Đã duyệt"]||0,color:"#10B981"}],s=n.reduce((c,d)=>c+d.count,0)||1,o=60,r=2*Math.PI*o;let l=0,i="";n.forEach(c=>{const p=c.count/s*r;i+=`<circle cx="80" cy="80" r="${o}" fill="none" stroke="${c.color}" stroke-width="20" 
                    stroke-dasharray="${p} ${r-p}" 
                    stroke-dashoffset="${-l}" 
                    class="transition-all duration-700" style="transform-origin: center;"/>`,l+=p}),a.innerHTML=`
        <div class="relative">
            <svg width="160" height="160" viewBox="0 0 160 160" class="-rotate-90">
                ${i}
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                    <p class="text-2xl font-extrabold text-gray-800">${s}</p>
                    <p class="text-[10px] text-gray-400 font-medium">Công việc</p>
                </div>
            </div>
        </div>`,t&&(t.innerHTML=n.map(c=>`
            <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${c.color}"></div>
                <span class="text-xs text-gray-600 font-medium">${c.label} (${c.count})</span>
            </div>`).join(""))}function Qt(e){const a=document.getElementById("barChartContainer");if(!a||!e||e.length===0){a&&(a.innerHTML='<p class="text-xs text-gray-400 text-center w-full py-10">Không có dữ liệu</p>');return}const t=Math.max(...e.map(s=>s.total_tasks||1),1),n=["from-blue-400 to-blue-600","from-indigo-400 to-indigo-600","from-purple-400 to-purple-600","from-cyan-400 to-cyan-600","from-emerald-400 to-emerald-600","from-amber-400 to-amber-600"];a.innerHTML=e.slice(0,8).map((s,o)=>{const r=Math.max((s.total_tasks||0)/t*100,8),l=n[o%n.length];return`
        <div class="flex-1 flex flex-col items-center gap-1.5 group">
            <span class="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">${s.total_tasks||0}</span>
            <div class="w-full bg-gradient-to-t ${l} rounded-t-lg transition-all duration-500 hover:opacity-80 relative" style="height:${r}%">
                <div class="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span class="text-[9px] font-medium text-gray-400 text-center leading-tight max-w-full truncate px-0.5" title="${s.title}">${s.title.split(" ").slice(0,2).join(" ")}</span>
        </div>`}).join("")}window.fetchDashboardReport=async function(){try{const e=localStorage.getItem("token"),t=await(await fetch("http://localhost:3000/api/reports/dashboard",{headers:{Authorization:`Bearer ${e}`}})).json();if(t.success){const n=t.data;document.getElementById("statTotalProjects").innerText=n.projects.total,document.getElementById("statActiveProjects").innerText=n.projects.active,document.getElementById("statCompletedProjects").innerText=n.projects.completed,document.getElementById("statApprovedBudget").innerText=new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n.budget.approved),document.getElementById("budgetPendingText").innerText=new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n.budget.pending),document.getElementById("budgetApprovedText").innerText=new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n.budget.approved);const s=n.budget.approved+n.budget.pending,o=s>0?Math.round(n.budget.approved/s*100):0;document.getElementById("approvedRatioText").innerText=`${o}%`,document.getElementById("approvedRatioBar").style.width=`${o}%`,Vt(n.tasks),Jt(n.tasks);const l=await(await fetch("http://localhost:3000/api/projects?limit=10",{headers:{Authorization:`Bearer ${e}`}})).json();l.success&&Qt(l.data)}}catch(e){console.error("Lỗi khi tải báo cáo:",e)}};function Jt(e){const a=document.getElementById("taskChartContainer");if(!a)return;const t=Object.values(e).reduce((s,o)=>s+o,0)||1,n=[{label:"Đã duyệt",count:e["Đã duyệt"]||0,color:"bg-emerald-500",bg:"bg-emerald-100"},{label:"Đã nộp",count:e["Đã nộp"]||0,color:"bg-blue-500",bg:"bg-blue-100"},{label:"Chưa nộp",count:e["Chưa nộp"]||0,color:"bg-amber-500",bg:"bg-amber-100"},{label:"Cần sửa",count:e["Cần sửa"]||0,color:"bg-red-500",bg:"bg-red-100"}];a.innerHTML=n.map(s=>{const o=Math.round(s.count/t*100);return`
        <div class="flex items-center gap-3">
            <span class="text-xs font-medium text-gray-600 w-16 text-right">${s.label}</span>
            <div class="flex-1 ${s.bg} h-2.5 rounded-full overflow-hidden">
                <div class="${s.color} h-full rounded-full transition-all duration-700" style="width:${o}%"></div>
            </div>
            <span class="text-xs font-bold text-gray-500 w-8">${s.count}</span>
        </div>`}).join("")}function Ve(){return`
    <div class="h-full flex items-center justify-center -mt-4">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl flex overflow-hidden border border-gray-100">
            
            <div class="hidden md:flex w-2/5 bg-blue-600 p-8 flex-col justify-between text-white relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
                <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-700 rounded-full opacity-50 blur-2xl"></div>

                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-3xl shadow-md">📈</div>
                        <div>
                            <h1 class="text-3xl font-bold ">e-Teck</h1>
                            <p class="text-orange-400 text-sm font-bold  -mt-1">Projects</p>
                        </div>
                    </div>
                    <h2 class="text-3xl font-bold uppercase leading-snug mb-3">Cổng thông tin<br>Khách hàng</h2>
                    <p class="text-blue-100 text-base leading-relaxed">
                        Quản lý dự án, theo dõi tiến độ <br> và nhận báo giá chuyên nghiệp từ e-Teck.
                    </p>
                </div>
                
                <div onclick="window.goToLogin()" class="relative z-10 cursor-pointer flex items-center gap-2 text-blue-100 hover:text-white transition w-fit px-4 py-2.5 rounded-xl hover:bg-blue-700 bg-blue-600/50 backdrop-blur-sm">
                    <i class="fas fa-arrow-left"></i> <span>Quay lại đăng nhập</span>
                </div>
            </div>
            
            <div class="w-full md:w-3/5 p-8 flex flex-col justify-center bg-gray-50/50">
                <div class="mb-5">
                    <h3 class="text-2xl font-bold text-gray-800 ">Đăng ký tài khoản</h3>
                    <p class="text-gray-500 text-sm mt-1">Vui lòng khai báo chính xác và đầy đủ các thông tin sau:</p>
                </div>
                
                <div class="grid grid-cols-2 gap-x-5 gap-y-4">
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Loại khách hàng</label>
                        <div class="relative">
                            <select id="reg-type" class="appearance-none w-full px-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm text-gray-700 cursor-pointer">
                                <option value="Cá nhân">👤 Cá nhân</option>
                                <option value="Doanh nghiệp">🏢 Doanh nghiệp</option>
                                <option value="Tổ chức sự nghiệp">🏛️ Tổ chức sự nghiệp</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <i class="fas fa-chevron-down text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Mã định danh/mã số thuế</label>
                        <input type="text" id="reg-id" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Tên khách hàng *</label>
                        <input type="text" id="reg-name" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Email liên hệ *</label>
                        <input type="email" id="reg-email" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                        <input type="tel" id="reg-phone" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                        <input type="text" id="reg-address" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm" >
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu *</label>
                        <input type="password" id="reg-password" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm" >
                    </div>
                    
                    <div class="col-span-1 flex items-end">
                        <button onclick="window.handleDangKyKhachHang()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 h-[46px] flex justify-center items-center gap-2">
                            <span>Đăng ký</span> <i class="fas fa-arrow-right text-sm"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>`}async function Xt(){var l;const e=document.getElementById("reg-name").value.trim(),a=document.getElementById("reg-type").value,t=document.getElementById("reg-id").value.trim(),n=document.getElementById("reg-email").value.trim(),s=document.getElementById("reg-phone").value.trim(),o=document.getElementById("reg-address").value.trim(),r=document.getElementById("reg-password").value.trim();if(!e||!n||!r){alert("Vui lòng điền đầy đủ Tên, Email và Mật khẩu!");return}try{const c=await(await fetch("http://localhost:3000/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:n,password:r,type:a,id_number:t,phone:s,address:o})})).json();c.success?(alert(`✅ Đăng ký thành công!

Bạn có thể đăng nhập ngay với email: ${n}`),Qe()):alert("❌ Đăng ký thất bại: "+(((l=c.error)==null?void 0:l.message)||"Lỗi không xác định"))}catch(i){alert("❌ Lỗi kết nối: "+i.message)}}function Qe(){typeof window.initApp=="function"?window.initApp():window.location.reload()}window.renderDangKyKhachHang=Ve;window.goToLogin=Qe;window.handleDangKyKhachHang=Xt;let Ee=[];async function Je(){try{const e=localStorage.getItem("token"),a=await fetch("http://localhost:3000/api/projects?limit=100",{headers:{Authorization:`Bearer ${e}`}}),t=await a.json();if(a.ok&&t.success){Ee=t.data||[];const n=document.getElementById("clientProjectsGrid");n&&(n.innerHTML=Yt(Ee))}}catch(e){console.error("Lỗi tải danh sách dự án của khách hàng:",e)}}window.fetchClientProjectsFromServer=Je;function Gt(){return setTimeout(Je,50),`
    <div class="flex flex-col mt-0 -mx-8 min-h-screen bg-gray-50/50"> 
        ${P({activeLabel:"Dự án",tabs:[{label:"Dự án",iconClass:"fas fa-briefcase text-lg",onClick:"navigateTo('CTTkhachhang')"},{label:"Tạo yêu cầu",iconClass:"fas fa-plus",onClick:"navigateTo('taoyeucau')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanKH')"}]})}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 ">Dự án của tôi</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="clientProjectsGrid">
                <div class="col-span-full py-12 text-center text-gray-400">Đang tải danh sách dự án...</div>
            </div>
        </main>
      ${I()}
    </div>`}function Yt(e){if(e.length===0)return'<div class="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">Bạn chưa có dự án nào trong hệ thống.</div>';let a="";return e.forEach(t=>{const n=t.member_count||0,s=typeof t.members_json=="string"?JSON.parse(t.members_json||"[]"):t.members_json||[],o=["bg-blue-500","bg-emerald-500","bg-purple-500","bg-amber-500","bg-pink-500"];let r="";s.slice(0,4).forEach((d,p)=>{if(d.avatar)r+=`
                <div class="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 overflow-hidden shadow-sm" title="${d.name}">
                    <img src="http://localhost:3000${d.avatar}" alt="${d.name}" class="w-full h-full object-cover">
                </div>`;else{const u=d.name?d.name.charAt(0).toUpperCase():"?";r+=`
                <div class="w-8 h-8 ${o[p%o.length]} rounded-full border-2 border-white flex items-center justify-center -ml-2 first:ml-0 shadow-sm text-xs text-white font-bold" title="${d.name}">
                    ${u}
                </div>`}});const l=t.end_date?new Date(t.end_date).toLocaleDateString("vi-VN"):"Không có",i=t.total_tasks||0,c=t.approved_tasks||0;a+=`
        <div onclick="window.openProjectDetail('${t.id}', 'client')" class="bg-white rounded-3xl p-6 border border-transparent hover:border-blue-200 transition-all cursor-pointer hover:shadow-md group">
            <h3 class="font-bold text-lg mb-2 line-clamp-2 min-h-[52px] text-gray-800 group-hover:text-blue-700 transition-colors">${t.title}</h3>
            
            <div class="flex items-center mb-4">
                <div class="flex">
                    ${r}
                    ${n>4?`
                        <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center -ml-2 text-[10px] font-bold text-gray-600 ">
                            +${n-4}
                        </div>
                    `:""}
                </div>
            </div>

            <div class="flex items-center justify-between mb-4">
                <span class="px-4 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-xl">
                    ${t.status}
                </span>
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                    <span>${l}</span>
                </div>
            </div>

            <div class="mb-4">
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-600 rounded-full transition-all duration-700" style="width: ${t.progress}%"></div>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm font-bold">
                <span class="text-blue-600">${t.progress}% hoàn thành</span>
                <span class="text-gray-400 font-medium">${c}/${i} công việc</span>
            </div>
        </div>`}),a}window.addRequest=function(){alert("Hệ thống sẽ cập nhật Form gửi yêu cầu dự án trong phiên bản tới!")};function Wt(){return setTimeout(()=>window.toggleEditKH(!1),0),`
    <div class="flex flex-col -mt-8 -mx-8 min-h-screen bg-gray-50/50">
        ${P({activeLabel:"Tài khoản",tabs:[{label:"Dự án",iconClass:"fas fa-briefcase text-lg",onClick:"navigateTo('CTTkhachhang')"},{label:"Tạo yêu cầu",iconClass:"fas fa-plus",onClick:"navigateTo('taoyeucau')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanKH')"}]})}
        <main id="khProfileWrapper" class="max-w-6xl mx-auto w-full px-8 py-20 flex-1"></main>
        ${I()}
    </div>`}window.toggleEditKH=async function(e){var p;const a=document.getElementById("khProfileWrapper");if(!a)return;if(!window.cachedKHProfile){a.innerHTML='<div class="flex items-center justify-center h-64"><p class="text-gray-500 font-medium">Đang tải...</p></div>';try{const u=localStorage.getItem("token"),h=await(await fetch("http://localhost:3000/api/auth/profile",{headers:{Authorization:`Bearer ${u}`}})).json();if(h.success)window.cachedKHProfile=h.data;else throw new Error(((p=h.error)==null?void 0:p.message)||"Không thể lấy thông tin")}catch(u){a.innerHTML=`<div class="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">Lỗi: ${u.message}</div>`;return}}const t=window.cachedKHProfile,s=["Doanh nghiệp","Tổ chức","Cá nhân"].map(u=>`<option value="${u}" ${t.type===u?"selected":""}>${u}</option>`).join(""),o=(t==null?void 0:t.name)||"---",r=(t==null?void 0:t.client_id)||"---",l=(t==null?void 0:t.id_number)||"---",i=(t==null?void 0:t.phone)||"---",c=(t==null?void 0:t.address)||"---",d=(t==null?void 0:t.email)||"---";e?a.innerHTML=`
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Cập nhật thông tin</h1>
                <div class="flex gap-4 text-base font-normal">
                    <button onclick="toggleEditKH(false)" class="bg-gray-100 text-gray-600 px-8 py-3.5 rounded-2xl hover:bg-gray-200 transition font-bold">
                        Hủy
                    </button>
                    <button onclick="saveKHProfile()" class="bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition flex items-center gap-2 font-bold shadow-sm">
                        <i class="fas fa-save"></i> Lưu thay đổi
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <form id="formEditKHProfile" class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Tên khách hàng<span class="text-red-500">*</span></label>
                        <input type="text" name="name" value="${o!=="---"?o:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Phân loại <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <select name="type" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 outline-none appearance-none cursor-pointer">
                                <option value="" disabled ${t.type?"":"selected"}></option>
                                ${s}
                            </select>
                            <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã khách hàng</label>
                        <input type="text" value="${r!=="---"?r:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã định danh (MST/CCCD) <span class="text-red-500">*</span></label>
                        <input type="text" value="${l!=="---"?l:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Điện thoại <span class="text-red-500">*</span></label>
                        <input type="text" name="phone" value="${i!=="---"?i:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>

                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Địa chỉ<span class="text-red-500">*</span></label>
                        <input type="text" name="address" value="${c!=="---"?c:""}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Email<span class="text-red-500">*</span></label>
                        <input type="email" value="${d!=="---"?d:""}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                </form>
            </div>`:a.innerHTML=`
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>
                <div class="flex gap-4 text-base font-normal">
                    <button onclick="window.showChangePasswordModal()" class="bg-gray-800 text-white px-8 py-3.5 rounded-2xl hover:bg-black transition flex items-center gap-2">
                        <i class="fas fa-key"></i> Đổi mật khẩu
                    </button>
                    <button onclick="toggleEditKH(true)" class="bg-blue-50 text-blue-600 px-8 py-3.5 rounded-2xl hover:bg-blue-100 transition flex items-center gap-2 font-bold">
                        <i class="fas fa-edit"></i> Cập nhật thông tin
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                    <div class="md:col-span-2">
                        <p class="text-gray-500 text-sm font-bold mb-1">Tên khách hàng</p>
                        <p class="text-xl text-gray-800">${o}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Phân loại</p>
                        <p class="text-xl text-gray-800">${t.type||"---"}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã khách hàng</p>
                        <p class="text-xl text-gray-800">${r}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã định danh (MST/CCCD)</p>
                        <p class="text-xl text-gray-800">${l}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Điện thoại</p>
                        <p class="text-xl text-gray-800">${i}</p>
                    </div>
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Địa chỉ</p>
                        <p class="text-lg text-gray-800 leading-relaxed">${c}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Email</p>
                        <p class="text-lg text-gray-800">${d}</p>
                    </div>
                </div>
            </div>`};window.saveKHProfile=async function(){var n;const e=document.getElementById("formEditKHProfile");if(!e.checkValidity()){e.reportValidity();return}const a=new FormData(e),t={name:a.get("name"),type:a.get("type"),phone:a.get("phone"),address:a.get("address")};try{const s=localStorage.getItem("token"),r=await(await fetch("http://localhost:3000/api/auth/profile",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(t)})).json();r.success?(window.cachedKHProfile=r.data,alert("✅ Thông tin tài khoản đã được cập nhật thành công!"),window.toggleEditKH(!1)):alert("❌ Cập nhật thất bại: "+(((n=r.error)==null?void 0:n.message)||"Lỗi không xác định"))}catch(s){alert("❌ Lỗi kết nối: "+s.message)}};function Zt(){return`
    <div class="flex flex-col mt-0 -mx-8"> 
        ${P({activeLabel:"Tạo yêu cầu",tabs:[{label:"Dự án",iconClass:"fas fa-briefcase text-lg",onClick:"navigateTo('CTTkhachhang')"},{label:"Tạo yêu cầu",iconClass:"fas fa-plus",onClick:"navigateTo('taoyeucau')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanKH')"}]})}

    <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12">            
            <div class="flex justify-between items-end mb-6">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800">Tạo yêu cầu mới</h2>
                </div>
                <button type="submit" form="formTaoYeuCau" class="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                        <i class="fas fa-paper-plane text-sm"></i> Gửi yêu cầu
                </button>
            </div>

            <form id="formTaoYeuCau" onsubmit="handleSubmitRequest(event)" class="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6">
                    
                    <div class="md:col-span-2 space-y-6">
                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Tiêu đề yêu cầu <span class="text-red-500">*</span></label>
                            <input type="text" required name="title" 
                                   class="w-full px-6 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all text-gray-800 font-bold">
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Mô tả nhu cầu <span class="text-red-500">*</span></label>
                            <textarea required name="description" rows="6"  
                                      class="w-full px-6 py-4 border border-gray-100 rounded-[32px] focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all resize-none text-gray-800 text-base"></textarea>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Phân loại dịch vụ <span class="text-red-500">*</span></label>
                            <div class="relative group">
                                <select required name="serviceType" class="w-full appearance-none px-6 pr-12 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 cursor-pointer font-bold text-gray-700 transition-all">
                                    <option value="" disabled selected></option>
                                    <option value="Thiết bị mạng">Thiết bị mạng</option>
                                    <option value="Hệ thống điện">Hệ thống điện</option>
                                    <option value="Bảo trì">Bảo trì</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Hạn chót mong muốn</label>
                            <input type="date" name="deadline" 
                                   class="w-full px-6 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all font-bold text-gray-800">
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Ngân sách dự kiến</label>
                            <div class="relative">
                                <input type="text" name="budget" oninput="formatCurrency(this)"
                                       class="w-full px-6 pr-16 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all font-bold text-gray-800">
                                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pt-8 border-t border-gray-50 space-y-4">
                    <div class="flex justify-between items-center px-1">
                        <label class="text-base font-bold text-gray-400">Tài liệu đính kèm</label>
                        <button type="button" onclick="document.getElementById('fileInput').click()" class="text-blue-600 font-bold text-sm hover:text-blue-800 transition">+ Thêm tệp tin</button>
                    </div>
                    
                    <div class="min-h-[70px] p-5 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200" id="fileContainer">
                        <input type="file" id="fileInput" class="hidden" multiple onchange="handleFileSelect(this)">
                        <div id="fileList" class="flex flex-wrap gap-3 w-full">
                            <p id="noFileText" class="text-gray-300 italic text-sm w-full text-center py-2">Chưa có tài liệu nào được đính kèm.</p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
      ${I()}
    </div>`}window.formatCurrency=window.formatCurrency||function(e){let a=e.value.replace(/\D/g,"");a!==""?e.value=parseInt(a,10).toLocaleString("vi-VN"):e.value=""};window.handleFileSelect=function(e){const a=document.getElementById("fileList"),t=document.getElementById("noFileText");a&&(e.files.length>0&&t&&t.classList.add("hidden"),Array.from(e.files).forEach(n=>{const s="file-"+Math.random().toString(36).substr(2,9),o=document.createElement("div");o.id=s,o.className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-700 animate-fadeIn hover:border-blue-200 transition-all",o.innerHTML=`
            <i class="fas fa-file text-blue-500"></i>
            <span class="max-w-[180px] truncate">${n.name}</span>
            <button type="button" class="ml-1 text-gray-300 hover:text-red-500 transition-colors" onclick="removeFile('${s}')">
                <i class="fas fa-times-circle"></i>
            </button>
        `,a.appendChild(o)}),e.value="")};window.removeFile=function(e){const a=document.getElementById(e);a&&a.remove();const t=document.getElementById("fileList"),n=document.getElementById("noFileText");t&&t.children.length===1&&n&&n.classList.remove("hidden")};window.handleSubmitRequest=async function(e){var o;e.preventDefault();const a=document.getElementById("formTaoYeuCau"),t=new FormData(a),n=(t.get("budget")||"0").replace(/\./g,"").replace(/,/g,""),s={title:t.get("title"),description:t.get("description"),serviceType:t.get("serviceType"),deadline:t.get("deadline")||null,budget:parseFloat(n)||0};try{const r=localStorage.getItem("token"),i=await(await fetch("http://localhost:3000/api/projects/request",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(s)})).json();i.success?(alert("✅ Yêu cầu đã được gửi đến e-Teck thành công!"),typeof navigateTo=="function"&&navigateTo("CTTkhachhang")):alert("❌ Lỗi: "+(((o=i.error)==null?void 0:o.message)||"Không thể gửi yêu cầu"))}catch(r){alert("❌ Lỗi kết nối: "+r.message)}};function Xe(e){return{Mới:"bg-blue-100 text-blue-700","Đã xác nhận":"bg-purple-100 text-purple-700","Đang giao":"bg-orange-100 text-orange-700","Hoàn thành":"bg-green-100 text-green-700"}[e]||"bg-gray-100 text-gray-700"}function ea(e){return e||"Mới"}function ta(e){return e||"Mới"}function aa(){return setTimeout(na,0),`
    <div class="flex flex-col mt-0 -mx-8 min-h-screen">
        ${P({activeLabel:"Đơn hàng",tabs:[{label:"Vật tư",iconClass:"fas fa-truck text-lg",onClick:"navigateTo('CTTnhacungcap')"},{label:"Đơn hàng",iconClass:"fas fa-clipboard-list",onClick:"navigateTo('donhang')"},{label:"Tài khoản",iconClass:"fas fa-user-circle text-lg",onClick:"navigateTo('taikhoanNCC')"}]})}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Danh sách đơn hàng</h2>
                <div class="flex gap-3">
                    <button onclick="alert('In danh sách đơn hàng')" class="bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
                        <i class="fas fa-print"></i> Xuất báo cáo
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 mb-8">
                <div class="flex-1 min-w-[300px] relative">
                    <input type="text" id="searchOrder" oninput="handleOrderFilter()" 
                           placeholder="Tìm theo mã PO hoặc tên dự án..." 
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 pl-14 bg-white shadow-sm">
                    <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div class="min-w-[200px] relative">
                    <select id="filterStatus" onchange="handleOrderFilter()" 
                            class="w-full appearance-none px-6 pr-12 py-4 border border-gray-200 rounded-3xl focus:outline-none bg-white shadow-sm cursor-pointer font-bold text-gray-600">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Mới">Mới</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="orderCards">
                <div class="col-span-full py-12 text-center text-gray-400 font-medium">Đang tải danh sách đơn hàng...</div>
            </div>
        </main>

        ${I()}
    </div>`}async function na(){var a;const e=document.getElementById("orderCards");if(e)try{const t=localStorage.getItem("token"),s=await(await fetch("http://localhost:3000/api/orders/my-orders",{headers:{Authorization:`Bearer ${t}`}})).json();if(!s.success)throw new Error(((a=s.error)==null?void 0:a.message)||"Không thể lấy đơn hàng");const o=s.data||[];window.cachedOrders=o.map(r=>{const l=new Date(r.expected_date||r.created_at),i=isNaN(l.getTime())?"---":l.toLocaleDateString("vi-VN");return{id:r.id,dbId:r.id,projectName:r.project_title||"Dự án chưa rõ",totalAmount:parseFloat(r.total_value||0),expectedDate:i,status:ea(r.status),address:r.address||"Kho tổng e-Teck, Hải Phòng",receiver:r.receiver_name||"Phòng Vật tư e-Teck",items:(r.items||[]).map(c=>({name:c.material_name||c.name||"Vật tư",sku:c.material_sku||c.sku||"SKU-NONE",qty:c.quantity||0,price:parseFloat(c.material_price||c.price||0)}))}}),Te(window.cachedOrders)}catch(t){e.innerHTML=`<div class="col-span-full py-12 text-center text-red-500 font-bold">Lỗi: ${t.message}</div>`}}function Te(e=[]){const a=document.getElementById("orderCards");if(a){if(e.length===0){a.innerHTML='<div class="col-span-full py-12 text-center text-gray-400 font-medium">Không tìm thấy đơn hàng nào phù hợp.</div>';return}a.innerHTML=e.map(t=>`
        <div onclick="openOrderDetail('${t.id}')" 
             class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-6 cursor-pointer group">
            <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-2xl flex-shrink-0">
                <i class="fas fa-file-invoice-dollar"></i>
            </div>

            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-black text-gray-800 text-xl">${t.id}</h3>
                    <span class="px-3 py-1 ${Xe(t.status)} rounded-xl text-xs font-bold uppercase tracking-widest">
                        ${t.status}
                    </span>
                </div>
                <p class="text-gray-500 text-base font-medium line-clamp-2 mb-2">${t.projectName}</p>
                
                <div class="pt-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400 font-bold whitespace-nowrap">Tổng giá trị:</span>
                        <span class="text-xl font-black text-blue-700 whitespace-nowrap">${t.totalAmount.toLocaleString("vi-VN")} <small class="text-sm font-normal">đ</small></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400 font-bold whitespace-nowrap">Hạn giao:</span>
                        <span class="text-xl font-black text-gray-800 whitespace-nowrap">${t.expectedDate}</span>
                    </div>
                </div>
            </div>
        </div>`).join("")}}window.openOrderDetail=function(e){if(!window.cachedOrders)return;const a=window.cachedOrders.find(s=>s.id===e);if(!a)return;let t="";a.status==="Mới"?t=`<button onclick="updateOrderStatus('${a.id}', 'Đã xác nhận')" class="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2"><i class="fas fa-check-circle"></i> Xác nhận đơn</button>`:a.status==="Đã xác nhận"?t=`<button onclick="updateOrderStatus('${a.id}', 'Đang giao')" class="bg-orange-500 text-white hover:bg-orange-600 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2"><i class="fas fa-truck"></i> Giao hàng</button>`:a.status==="Đang giao"&&(t=`<button onclick="updateOrderStatus('${a.id}', 'Hoàn thành')" class="bg-green-600 text-white hover:bg-green-700 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2"><i class="fas fa-check-double"></i> Hoàn thành</button>`);const n=document.createElement("div");n.className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm",n.id="orderDetailModal",n.innerHTML=`
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-6xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
                <div class="flex items-center gap-4">
                    <h2 class="text-3xl font-black text-gray-800">${a.id}</h2>
                    <span class="px-4 py-1.5 ${Xe(a.status)} rounded-xl text-xs font-black uppercase tracking-widest">${a.status}</span>
                </div>
                <p class="text-gray-400 font-bold text-base mt-1.5">${a.projectName}</p>
            </div>
            
            <div class="flex items-center gap-4">
                ${t}
                <div class="w-[1px] h-8 bg-gray-100 mx-1"></div>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-300 w-10 h-10 rounded-xl hover:bg-gray-50 hover:text-gray-500 transition">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto px-10 pb-10 pt-2 bg-gray-50/20">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 class="text-base font-black text-gray-400 mb-6">Danh mục vật tư</h4>
                        <table class="w-full text-left">
                            <thead class="text-sm text-gray-400 font-black border-b border-gray-50">
                                <tr>
                                    <th class="pb-4">Vật tư</th>
                                    <th class="pb-4 text-center">SL</th>
                                    <th class="pb-4 text-right">Đơn giá</th>
                                    <th class="pb-4 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                ${a.items.map(s=>`
                                    <tr>
                                        <td class="py-5 pr-4">
                                            <p class="font-bold text-gray-800 text-lg leading-tight">${s.name}</p>
                                            <p class="text-xs text-gray-400 uppercase font-bold mt-1.5">${s.sku}</p>
                                        </td>
                                        <td class="py-5 text-center font-bold text-blue-600 text-lg">${s.qty}</td>
                                        <td class="py-5 text-right font-medium text-gray-500 text-base">${s.price.toLocaleString("vi-VN")}</td>
                                        <td class="py-5 text-right font-black text-gray-800 text-lg">${(s.qty*s.price).toLocaleString("vi-VN")}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                        
                        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span class="text-base font-bold text-gray-400 ">Tổng thanh toán:</span>
                            <span class="text-4xl font-black text-blue-700">${a.totalAmount.toLocaleString("vi-VN")} <small class="text-base font-normal">VNĐ</small></span>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 class="text-base font-black text-gray-400 mb-6">Thông tin giao nhận</h4>
                        <div class="space-y-6">
                            <div class="flex gap-4">
                                <i class="fas fa-map-pin text-blue-500 mt-1 text-lg"></i>
                                <div>
                                    <p class="text-sm font-black text-gray-400 mb-1.5">Địa chỉ nhận</p>
                                    <p class="text-base font-bold text-gray-800 leading-snug">${a.address}</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <i class="fas fa-user-circle text-blue-500 mt-1 text-lg"></i>
                                <div>
                                    <p class="text-sm font-black text-gray-400 mb-1.5">Đại diện e-Teck</p>
                                    <p class="text-base font-bold text-gray-800">${a.receiver}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.print()" class="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-sm">
                        <i class="fas fa-print"></i> In đơn đặt hàng
                    </button>
                    <p class="text-xs text-gray-400 text-center mt-5 font-medium italic">Vui lòng in PO kèm theo bộ chứng từ khi giao hàng.</p>
                </div>
            </div>
        </div>
    </div>`,n.onclick=s=>{s.target===n&&n.remove()},document.body.appendChild(n)};window.updateOrderStatus=async function(e,a){var s;if(!window.cachedOrders)return;const t=window.cachedOrders.find(o=>o.id===e);if(!t)return;const n=ta(a);try{const o=localStorage.getItem("token"),l=await(await fetch(`http://localhost:3000/api/orders/${t.dbId}/status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({status:n})})).json();if(l.success){t.status=a;const i=document.getElementById("orderDetailModal");i&&i.remove(),handleOrderFilter(),setTimeout(()=>{openOrderDetail(e)},50)}else alert("❌ Cập nhật thất bại: "+(((s=l.error)==null?void 0:s.message)||"Lỗi không xác định"))}catch(o){alert("❌ Lỗi kết nối: "+o.message)}};window.handleOrderFilter=function(){var n,s;if(!window.cachedOrders)return;const e=((n=document.getElementById("searchOrder"))==null?void 0:n.value.toLowerCase().trim())||"",a=((s=document.getElementById("filterStatus"))==null?void 0:s.value)||"",t=window.cachedOrders.filter(o=>{const r=o.id.toLowerCase().includes(e)||o.projectName.toLowerCase().includes(e),l=a===""||o.status===a;return r&&l});Te(t)};window.renderOrderCards=Te;function sa(){return`
    <div id="loginScreen" class="min-h-screen flex items-center justify-center relative overflow-hidden">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
            <!-- Animated gradient orbs -->
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-float" style="animation-delay: 3s;"></div>
            
            <!-- Grid pattern overlay -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
            
            <!-- Floating particles -->
            <div class="absolute top-[10%] left-[15%] w-2 h-2 bg-blue-400/40 rounded-full animate-float" style="animation-duration: 4s;"></div>
            <div class="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-float" style="animation-duration: 5s; animation-delay: 1s;"></div>
            <div class="absolute bottom-[30%] left-[10%] w-1 h-1 bg-cyan-400/60 rounded-full animate-float" style="animation-duration: 3.5s; animation-delay: 2s;"></div>
            <div class="absolute top-[60%] right-[10%] w-2.5 h-2.5 bg-blue-300/30 rounded-full animate-float" style="animation-duration: 6s; animation-delay: 0.5s;"></div>
            <div class="absolute bottom-[15%] right-[35%] w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-float" style="animation-duration: 4.5s; animation-delay: 3s;"></div>
            <div class="absolute top-[40%] left-[5%] w-1 h-1 bg-cyan-300/50 rounded-full animate-float" style="animation-duration: 5.5s; animation-delay: 1.5s;"></div>
            <div class="absolute top-[80%] left-[40%] w-2 h-2 bg-blue-400/30 rounded-full animate-float" style="animation-duration: 4s; animation-delay: 2.5s;"></div>
            <div class="absolute top-[5%] left-[60%] w-1.5 h-1.5 bg-indigo-300/40 rounded-full animate-float" style="animation-duration: 3s; animation-delay: 4s;"></div>
        </div>

        <!-- Login Card -->
        <div class="relative z-10 w-full max-w-md mx-4 animate-scaleUp">
            <!-- Glass card -->
            <div class="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-3xl p-8 shadow-2xl shadow-black/20">
                
                <!-- Logo & Brand -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4 animate-bounce-sm">
                        <i class="fas fa-chart-line text-white text-2xl"></i>
                    </div>
                    <h1 class="text-3xl font-extrabold text-white tracking-tight">e-Teck</h1>
                    <p class="text-blue-400 text-sm font-semibold -mt-0.5">Projects Management</p>
                    <p class="text-white/40 text-xs mt-2">Hệ thống đặt hàng & quản lý dự án</p>
                </div>

                <!-- Login Form -->
                <div class="space-y-4">
                    <!-- Email Input -->
                    <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative flex items-center">
                            <i class="fas fa-envelope absolute left-4 text-white/30 group-focus-within:text-blue-400 transition-colors"></i>
                            <input id="username" type="text" placeholder="Email đăng nhập"
                                class="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.1] transition-all text-sm font-medium">
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative flex items-center">
                            <i class="fas fa-lock absolute left-4 text-white/30 group-focus-within:text-blue-400 transition-colors"></i>
                            <input id="password" type="password" placeholder="Mật khẩu"
                                class="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.1] transition-all text-sm font-medium">
                        </div>
                    </div>

                    <!-- Login Button -->
                    <button id="btnLogin"
                        class="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-right-to-bracket"></i>
                            Đăng nhập
                        </span>
                        <!-- Button glow effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </div>

                <!-- Divider -->
                <div class="flex items-center gap-3 my-6">
                    <div class="flex-1 h-px bg-white/10"></div>
                    <span class="text-white/30 text-xs font-medium">hoặc</span>
                    <div class="flex-1 h-px bg-white/10"></div>
                </div>

                <!-- Register Link -->
                <div class="text-center">
                    <p class="text-white/40 text-xs mb-1">Chưa có tài khoản?</p>
                    <a onclick="window.goToDangKyKhachHang()"
                        class="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold cursor-pointer transition-colors">
                        <i class="fas fa-user-plus text-xs"></i>
                        Đăng ký ngay (Khách hàng)
                    </a>
                </div>
            </div>

            <!-- Bottom text -->
            <p class="text-center text-white/20 text-[10px] mt-6 font-medium">
                © 2026 e-Teck Technology • Công ty TNHH Đào tạo và Tích hợp Công nghệ
            </p>
        </div>
    </div>
    `}async function Me(){var s,o,r;const e=(((s=document.getElementById("username"))==null?void 0:s.value)||"").trim(),a=(((o=document.getElementById("password"))==null?void 0:o.value)||"").trim();if(!e||!a){alert("Vui lòng nhập đầy đủ Email và Mật khẩu.");return}const t=document.getElementById("btnLogin"),n=t.innerHTML;t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Đang xử lý...',t.disabled=!0;try{const l=await fetch("http://localhost:3000/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:a})}),i=await l.json();if(l.ok&&i.success){localStorage.setItem("token",i.data.token),localStorage.setItem("authEmail",i.data.user.email),localStorage.setItem("authRole",i.data.user.role),localStorage.setItem("authAccId",String(i.data.user.id)),localStorage.setItem("authLoggedInAt",new Date().toISOString());try{const d=await(await fetch("http://localhost:3000/api/auth/profile",{headers:{Authorization:`Bearer ${i.data.token}`}})).json();if(d.success){const p=d.data;p.supplier_id&&localStorage.setItem("supplierId",String(p.supplier_id)),p.client_id&&localStorage.setItem("clientId",String(p.client_id)),p.staff_id&&localStorage.setItem("staffId",String(p.staff_id)),p.name&&localStorage.setItem("authName",p.name)}}catch(c){console.error("Không thể tải thông tin hồ sơ chi tiết:",c)}t.innerHTML='<i class="fas fa-check"></i> Thành công!',t.classList.remove("from-blue-500","to-indigo-600"),t.classList.add("from-emerald-500","to-emerald-600"),setTimeout(()=>{typeof window.initApp=="function"&&window.initApp()},500)}else{t.innerHTML=n,t.disabled=!1;const c=t.closest(".backdrop-blur-xl");c&&(c.style.animation="shake 0.5s ease-in-out",setTimeout(()=>c.style.animation="",500)),alert("❌ Đăng nhập thất bại: "+(((r=i.error)==null?void 0:r.message)||"Sai tài khoản hoặc mật khẩu."))}}catch(l){t.innerHTML=n,t.disabled=!1,console.error("Lỗi khi kết nối đến máy chủ:",l),alert("❌ Có lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại Back-end.")}}function oa(){const e=document.getElementById("btnLogin");e&&e.addEventListener("click",Me),document.addEventListener("keydown",function(t){const n=document.getElementById("loginScreen");t.key==="Enter"&&n&&(t.preventDefault(),Me())})}function ra(){return!!localStorage.getItem("authEmail")}function de(){return localStorage.getItem("authRole")}function la(){localStorage.clear(),console.log("🔒 Đã đăng xuất khỏi hệ thống."),typeof window.initApp=="function"&&window.initApp()}window.renderDanhmuc=ct;window.renderDuan=ut;window.renderCongviec=gt;window.renderTaikhoanNS=kt;window.renderTaikhoanNCC=Pt;window.renderCTTnhacungcap=Bt;window.renderHoso=Re;window.renderPhancong=Ue;window.renderBaocao=Ut;window.renderDangKyKhachHang=Ve;window.renderNhansu=xt;window.renderStaffTable=F;window.renderCTTkhachhang=Gt;window.renderTaikhoanKH=Wt;window.getAuthRole=de;window.renderTaoyeucau=Zt;window.renderDonhang=aa;window.renderVattu=Dt;window.openProjectDetail=ee;window.switchTab=$e;window.renderQLkhachhang=mt;window.renderClientTable=K;window.renderQLnhacungcap=vt;window.renderSupplierTable=O;window.renderThongbao=St;window.initNotificationPage=xe;window.logout=la;function Ge(){return`
    <div id="mainApp" class="h-screen flex overflow-hidden">
        <div class="sidebar sticky top-0 w-64 flex-shrink-0 p-5 flex flex-col h-screen overflow-y-auto custom-scrollbar">
            <div class="flex items-center gap-3 px-3 mb-10">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <i class="fas fa-chart-line text-blue-400 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-white tracking-tight">e-Teck</h1>
                    <p class="text-blue-400 text-xs font-semibold -mt-0.5 tracking-wide">Projects</p>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                <a href="/duan" onclick="event.preventDefault(); navigateTo('duan')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-duan">
                    <i class="fas fa-briefcase w-5 text-center"></i> Dự án
                </a>
                <a href="/congviec" onclick="event.preventDefault(); navigateTo('congviec')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-congviec">
                    <i class="fas fa-tasks w-5 text-center"></i> Công việc
                </a>
                ${de()==="admin"?`
                <a href="/nhansu" onclick="event.preventDefault(); navigateTo('nhansu')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-nhansu">
                    <i class="fas fa-users w-5 text-center"></i> Nhân sự
                </a>
                <a href="/QLkhachhang" onclick="event.preventDefault(); navigateTo('QLkhachhang')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-QLkhachhang">
                    <i class="fas fa-handshake w-5 text-center"></i> Khách hàng
                </a>
                <a href="/QLnhacungcap" onclick="event.preventDefault(); navigateTo('QLnhacungcap')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-QLnhacungcap">
                    <i class="fas fa-truck w-5 text-center"></i> Nhà cung cấp
                </a>
                <a href="/vattu" onclick="event.preventDefault(); navigateTo('vattu')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-vattu">
                    <i class="fas fa-box-open w-5 text-center"></i> Vật tư
                </a>
                `:""}
                <a href="/thongbao" onclick="event.preventDefault(); navigateTo('thongbao')" class="nav-link flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-thongbao">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-bell w-5 text-center"></i> <span>Thông báo</span>
                    </div>
                    <span id="sidebarNotiBadge" class="hidden min-w-[18px] h-[18px] px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                </a>
                <a href="/taikhoanNS" onclick="event.preventDefault(); navigateTo('taikhoanNS')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-taikhoanNS">
                    <i class="fas fa-user-circle w-5 text-center"></i> ${localStorage.getItem("authName")||"Tài khoản"}
                </a>
            </nav>
            <div class="mt-auto space-y-2">
                <div onclick="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <i class="fas fa-sign-out-alt w-5 text-center"></i><span>Đăng xuất</span>
                </div>
            </div>
        </div>

        <div class="flex-1 p-8 overflow-y-auto bg-gray-50/80" id="contentArea"></div>
    </div>
    `}window.initApp=function(){const a=document.getElementById("appRoot");if(!ra())window.history.replaceState(null,"","/login"),a.innerHTML=sa(),oa();else{a.innerHTML=Ge(),Ke(),window.addEventListener("popstate",ia);const t=window.location.pathname.replace("/","");if(t&&t!=="login"&&t!=="")Ce(t);else{const n=de();n==="client"?window.navigateTo("CTTkhachhang"):n==="supplier"?window.navigateTo("CTTnhacungcap"):window.navigateTo("duan")}}};function ia(){const e=window.location.pathname.replace("/","");e&&e!=="login"&&Ce(e)}function Ce(e){document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("nav-active","bg-blue-50"));const a=document.getElementById("nav-"+e);a&&a.classList.add("nav-active","bg-blue-50");const t=document.querySelector(".sidebar"),n=document.getElementById("contentArea");if(!n)return;const s=["client","supplier"].includes(de());t&&(s||["CTTkhachhang","taikhoanKH","CTTnhacungcap","taikhoanNCC","taoyeucau","donhang"].includes(e)?(t.classList.add("hidden"),n.classList.remove("p-8"),n.classList.add("p-0")):(t.classList.remove("hidden"),n.classList.remove("p-0"),n.classList.add("p-8")));const r=window["render"+e.charAt(0).toUpperCase()+e.slice(1)];typeof r=="function"&&(n.innerHTML=r(),e==="duan"&&typeof oe=="function"&&setTimeout(oe,50),e==="nhansu"&&typeof F=="function"&&setTimeout(F,50),e==="QLkhachhang"&&typeof K=="function"&&setTimeout(K,50),e==="QLnhacungcap"&&typeof O=="function"&&setTimeout(O,50),e==="CTTnhacungcap"&&typeof renderMaterialCards=="function"&&setTimeout(renderMaterialCards,50),e==="vattu"&&typeof renderMaterialCards=="function"&&setTimeout(renderMaterialCards,50),e==="danhmuc"&&typeof X=="function"&&setTimeout(X,50),e==="thongbao"&&typeof xe=="function"&&setTimeout(xe,50))}window.navigateTo=function(a){window.history.pushState(null,"","/"+a),Ce(a)};window.goToDangKyKhachHang=function(){const a=document.getElementById("appRoot");if(!a)return;window.history.pushState(null,"","/dangky"),a.innerHTML=Ge();const t=document.querySelector(".sidebar");t&&t.classList.add("hidden");const n=document.getElementById("contentArea");n&&(n.classList.remove("p-8"),n.classList.add("p-0"),n.innerHTML=window.renderDangKyKhachHang?window.renderDangKyKhachHang():"<p>Lỗi tải trang đăng ký</p>")};console.log("%c✅ e-Teck Projects Demo đã sẵn sàng!","color: #1e40af; font-weight: bold");window.initApp();
