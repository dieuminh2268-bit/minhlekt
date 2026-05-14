const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".sidebar-overlay");
const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const closeSidebar = () => {
  sidebar?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

overlay?.addEventListener("click", closeSidebar);

navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

const activateLink = () => {
  const current = sections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 140);

  if (!current) {
    return;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
};

const safelyActivateLink = () => {
  try {
    activateLink();
  } catch {
    // Navigation highlighting is decorative; case filtering should keep working.
  }
};

document.addEventListener("scroll", safelyActivateLink, { passive: true });
safelyActivateLink();

const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const caseCards = Array.from(document.querySelectorAll(".case-card"));
const caseGroups = Array.from(document.querySelectorAll(".case-group"));

const applyCaseFilter = (button) => {
  if (!button.classList.contains("filter-button")) {
    return;
  }

  const filter = button.dataset.filter;
  const caseSection = document.querySelector("#cases");

  filterButtons.forEach((item) => item.classList.toggle("active", item === button));
  caseGroups.forEach((group) => {
    const shouldShow = filter === "all" || group.dataset.caseGroup === filter;
    group.hidden = !shouldShow;
  });

  sidebar?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");

  if (caseSection) {
    caseSection.scrollIntoView({ block: "start" });
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    applyCaseFilter(button);
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  event.preventDefault();
  applyCaseFilter(button);
});

const caseReportToggles = Array.from(document.querySelectorAll(".case-report-toggle"));

const setReportState = (button, report, isExpanded) => {
  report.hidden = !isExpanded;
  button.setAttribute("aria-expanded", String(isExpanded));
  button.textContent = isExpanded ? "Thu gọn phân tích" : "Xem phân tích chi tiết";
};

caseReportToggles.forEach((button) => {
  const report = document.querySelector(`#${button.getAttribute("aria-controls")}`);

  if (!report || !report.classList.contains("case-full-report")) {
    return;
  }

  const bottomToggle = document.createElement("button");
  bottomToggle.className = "case-report-collapse";
  bottomToggle.type = "button";
  bottomToggle.textContent = "Thu gọn phân tích";
  bottomToggle.setAttribute("aria-label", "Thu gọn phân tích và quay lại đầu case");
  report.append(bottomToggle);

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    setReportState(button, report, !isExpanded);
  });

  bottomToggle.addEventListener("click", () => {
    setReportState(button, report, false);
    button.scrollIntoView({ block: "center" });
    button.focus();
  });
});

const skillDetails = {
  "voucher-checker": {
    kicker: "Skill 01",
    title: "Voucher Checker",
    intro: "Kiểm tra bộ chứng từ theo từng nghiệp vụ để xác định hồ sơ đã đủ căn cứ hạch toán, thanh toán và kê khai thuế hay chưa.",
    purpose: "Giúp kế toán phát hiện thiếu hợp đồng, nghiệm thu, hóa đơn, chứng từ thanh toán và bằng chứng nghiệp vụ trước khi ghi nhận chi phí.",
    actions: [
      "Phân loại nghiệp vụ và checklist chứng từ cần có.",
      "So hồ sơ hiện có với điều kiện thuế, kế toán và thanh toán.",
      "Nêu rủi ro bị loại chi phí, không khấu trừ VAT hoặc thiếu căn cứ nội bộ.",
    ],
    method: "Dùng NotebookLM làm nguồn checklist, chạy quy trình 4 bước: phân loại nghiệp vụ, tra checklist, kiểm chứng điều kiện thuế và trả báo cáo xử lý.",
    input: "Tình huống nghiệp vụ, hợp đồng, hóa đơn, thanh toán, nghiệm thu, file chứng từ.",
    output: "Kết luận đủ/thiếu hồ sơ, rủi ro chính và chứng từ cần bổ sung.",
    example: "Dịch vụ marketing 55 triệu có hóa đơn và chuyển khoản nhưng thiếu biên bản nghiệm thu.",
  },
  "tax-risk-reviewer": {
    kicker: "Skill 02",
    title: "Tax Risk Reviewer",
    intro: "Rà soát rủi ro thuế liên quan đến VAT, TNDN, TNCN, hóa đơn điện tử và điều kiện chi phí được trừ.",
    purpose: "Giúp kế toán nhận diện điểm có thể bị truy thu, loại chi phí hoặc không được khấu trừ trước khi kê khai và quyết toán.",
    actions: [
      "Kiểm điều kiện khấu trừ VAT và thanh toán không dùng tiền mặt.",
      "Đánh giá chi phí được trừ hoặc không được trừ khi tính TNDN.",
      "Cảnh báo sai sót về thời điểm hóa đơn, kê khai và hồ sơ giải trình.",
    ],
    method: "Dùng NotebookLM để kiểm chứng căn cứ VAT, TNDN, TNCN và hóa đơn trước khi kết luận; không tự bịa điều khoản, mức phạt hoặc kết luận pháp lý.",
    input: "Hóa đơn, hợp đồng, chứng từ thanh toán, bảng kê thuế, tình huống chi phí hoặc doanh thu.",
    output: "Danh sách rủi ro thuế, mức độ ảnh hưởng và hướng bổ sung hồ sơ.",
    example: "Hóa đơn đầu vào trên 20 triệu đã thanh toán tiền mặt, cần đánh giá rủi ro khấu trừ VAT.",
  },
  "account-reconciliation-assistant": {
    kicker: "Skill 09",
    title: "Account Reconciliation Assistant",
    intro: "Hỗ trợ đối chiếu số liệu giữa sổ cái, sổ chi tiết, sao kê ngân hàng, công nợ, hóa đơn, tồn kho và thuế.",
    purpose: "Giúp khoanh vùng chênh lệch số liệu trước khi khóa sổ, lập báo cáo hoặc giải trình nội bộ.",
    actions: [
      "So số dư đầu kỳ, phát sinh và số dư cuối kỳ giữa các nguồn.",
      "Tìm giao dịch trùng, thiếu, sai ngày, sai tài khoản hoặc chưa hạch toán.",
      "Đề xuất bảng reconciliation và bước kiểm tra tiếp theo.",
    ],
    method: "Nếu có file Excel/CSV, ưu tiên dùng code để chuẩn hóa dữ liệu, groupby/merge và tìm dòng lệch cụ thể trước khi đề xuất xử lý.",
    input: "Sổ cái, sổ chi tiết, sao kê ngân hàng, bảng công nợ, bảng kê hóa đơn, file Excel/CSV.",
    output: "Khoản lệch, nguyên nhân khả nghi, chứng từ cần kiểm và bút toán cần rà.",
    example: "Số dư sao kê ngân hàng cuối tháng lệch với TK 112 trên sổ cái.",
  },
  "ar-ap-aging-debt-control-reviewer": {
    kicker: "Skill 05",
    title: "AR/AP Aging & Debt Control Reviewer",
    intro: "Rà soát tuổi nợ phải thu/phải trả, công nợ quá hạn, công nợ âm và lịch thu chi theo đối tượng.",
    purpose: "Giúp kế toán kiểm soát dòng tiền, khoản phải thu khó thu, khoản phải trả đến hạn và công nợ bất thường trước khi khóa sổ.",
    actions: [
      "Tính aging bucket theo ngày hóa đơn, ngày đến hạn và số tiền còn lại.",
      "Phát hiện công nợ quá hạn, âm bất thường, dư Nợ/dư Có cùng đối tượng hoặc khoản treo lâu.",
      "Đề xuất xác nhận công nợ, cấn trừ, kế hoạch thu hồi/thanh toán và hồ sơ cần bổ sung.",
    ],
    method: "Kết hợp checklist công nợ với xử lý file Excel/CSV để tính tuổi nợ, phát hiện công nợ âm, khoản quá hạn và khoản cần xử lý trước khóa sổ.",
    input: "Bảng công nợ, sổ chi tiết 131/331, hóa đơn, hợp đồng, nghiệm thu, sao kê ngân hàng và lịch thanh toán.",
    output: "Danh sách khoản quá hạn/bất thường, mức ưu tiên xử lý, rủi ro thu hồi/thanh toán và hành động đề xuất.",
    example: "Khách hàng còn nợ 280 triệu quá hạn 55 ngày, chưa có biên bản xác nhận công nợ.",
  },
  "month-end-closing-assistant": {
    kicker: "Skill 11",
    title: "Month-End Closing Assistant",
    intro: "Chuẩn hóa checklist khóa sổ cuối tháng, quý, năm cho các khoản mục trọng yếu.",
    purpose: "Giúp kế toán không bỏ sót bút toán phân bổ, khấu hao, lương, thuế, công nợ, tồn kho và giá vốn.",
    actions: [
      "Tạo checklist khóa sổ theo từng nhóm tài khoản.",
      "Rà bút toán cuối kỳ và trạng thái chứng từ còn treo.",
      "Nhắc các điểm cần chốt trước khi lập báo cáo tài chính hoặc báo cáo quản trị.",
    ],
    method: "Hoạt động theo hai chế độ: checklist khi chưa có số liệu và review mode khi có BCĐSPS, sổ cái, NXT, bảng lương hoặc bảng kê hóa đơn.",
    input: "BCĐSPS, sổ cái, bảng phân bổ, bảng khấu hao, bảng lương, tồn kho, công nợ.",
    output: "Checklist việc cần làm, khoản mục cần rà và cảnh báo trước khi khóa kỳ.",
    example: "Cuối tháng cần kiểm tra phân bổ CCDC, khấu hao TSCĐ, lương và bút toán giá vốn.",
  },
  "financial-statement-reviewer": {
    kicker: "Skill 12",
    title: "Financial Statement Reviewer",
    intro: "Rà soát logic kế toán trên BCĐKT, KQKD, LCTT, BCĐSPS và biến động bất thường.",
    purpose: "Giúp phát hiện sai quan hệ tài khoản, số dư bất thường và điểm cần giải trình trước khi nộp BCTC.",
    actions: [
      "Kiểm tra số dư âm, sai tính chất và biến động lớn.",
      "So quan hệ giữa doanh thu, giá vốn, tồn kho, công nợ và thuế.",
      "Gợi ý khoản mục cần xem lại chứng từ hoặc bút toán.",
    ],
    method: "Ưu tiên đọc BCTC/BCĐSPS/Excel để tính biến động, so logic giữa báo cáo và lập danh sách điểm cần hỏi lại trước khi gửi/nộp.",
    input: "BCTC, BCĐSPS, sổ cái, báo cáo kết quả kinh doanh, bảng lưu chuyển tiền tệ.",
    output: "Danh sách bất thường, nguyên nhân có thể và bước rà chi tiết.",
    example: "Doanh thu tăng mạnh nhưng công nợ và dòng tiền không biến động tương ứng.",
  },
  "payroll-bhxh-tncn-assistant": {
    kicker: "Skill 08",
    title: "Payroll BHXH TNCN Assistant",
    intro: "Hỗ trợ kiểm tra hồ sơ lương, BHXH, BHYT, BHTN, TNCN và bút toán lương liên quan.",
    purpose: "Giúp kế toán giảm rủi ro thiếu hồ sơ lao động, sai bảo hiểm, sai thuế TNCN hoặc sai phân bổ chi phí lương.",
    actions: [
      "Rà bảng lương, hợp đồng lao động, chấm công và quyết định lương.",
      "Kiểm tra khoản chịu thuế, giảm trừ, bảo hiểm và tạm khấu trừ TNCN.",
      "Đề xuất bút toán lương, bảo hiểm và thuế cần kiểm.",
    ],
    method: "Dùng nguồn NotebookLM để kiểm chứng hồ sơ lương, BHXH và TNCN; không tự bịa tỷ lệ, hạn nộp, mức giảm trừ hoặc mức phạt nếu chưa có nguồn.",
    input: "Bảng lương, bảng chấm công, hợp đồng lao động, hồ sơ BHXH, dữ liệu TNCN.",
    output: "Rủi ro hồ sơ lương, thuế TNCN, bảo hiểm và bút toán cần điều chỉnh.",
    example: "Nhân sự thử việc có khấu trừ TNCN nhưng thiếu cam kết hoặc hồ sơ giảm trừ.",
  },
  "accounting-software-operator": {
    kicker: "Skill 04",
    title: "Accounting Software Operator",
    intro: "Hướng dẫn thao tác nghiệp vụ trên MISA/AMIS, HTKK, Thuế điện tử, hóa đơn điện tử và BHXH điện tử.",
    purpose: "Giúp chuyển yêu cầu kế toán thành từng bước thao tác phần mềm rõ ràng, giảm nhầm màn hình hoặc sai quy trình.",
    actions: [
      "Tách yêu cầu thành luồng thao tác từng bước.",
      "Nêu dữ liệu cần chuẩn bị trước khi nhập hoặc nộp.",
      "Cảnh báo điểm dễ sai khi lập tờ khai, xuất hóa đơn hoặc hạch toán.",
    ],
    method: "Trả lời theo checklist thao tác: chuẩn bị dữ liệu, thực hiện trên MISA/AMIS/HTKK/eTax/hóa đơn điện tử, rồi kiểm tra sổ hoặc thông báo sau thao tác.",
    input: "Tên phần mềm, nghiệp vụ cần làm, dữ liệu đang có, lỗi gặp phải hoặc mục tiêu thao tác.",
    output: "Các bước thao tác, dữ liệu cần nhập và điểm cần kiểm lại sau khi hoàn thành.",
    example: "Hướng dẫn nhập hóa đơn mua dịch vụ vào MISA và kiểm tra bút toán thuế VAT đầu vào.",
  },
  "inventory-cost-reviewer": {
    kicker: "Skill 06",
    title: "Inventory Cost Reviewer",
    intro: "Rà soát nhập xuất tồn, giá vốn, âm kho và bất thường của TK 156/152/155/632.",
    purpose: "Giúp phát hiện sai lệch tồn kho, sai mã hàng, xuất trước nhập sau hoặc ghi nhận giá vốn không hợp lý.",
    actions: [
      "So nhập xuất tồn với sổ cái và bút toán giá vốn.",
      "Lọc mã hàng âm kho, tồn bất thường hoặc giá vốn biến động mạnh.",
      "Đề xuất kiểm chứng từ nhập, xuất, hóa đơn và phương pháp tính giá.",
    ],
    method: "Nếu có file NXT, sổ kho hoặc sổ cái, ưu tiên dùng code để phát hiện tồn âm, lệch NXT, sai kỳ, hàng đi đường và giá vốn bất thường.",
    input: "Báo cáo nhập xuất tồn, sổ kho, sổ cái TK 156/152/155/632, hóa đơn và phiếu kho.",
    output: "Danh sách mã hàng/rủi ro cần rà, nguyên nhân khả nghi và hướng điều chỉnh.",
    example: "Một mã hàng âm kho nhưng TK 632 vẫn phát sinh giá vốn trong kỳ.",
  },
  "fixed-asset-prepaid-expense-reviewer": {
    kicker: "Skill 07",
    title: "Fixed Asset & Prepaid Expense Reviewer",
    intro: "Rà soát TSCĐ, CCDC, chi phí trả trước, khấu hao, phân bổ và hồ sơ tăng giảm tài sản.",
    purpose: "Giúp kế toán kiểm soát nguyên giá, ngày đưa vào sử dụng, thời gian khấu hao/phân bổ và chứng từ đi kèm trước khi khóa sổ.",
    actions: [
      "Phân loại nghiệp vụ thành TSCĐ, CCDC, chi phí trả trước, sửa chữa lớn hoặc thanh lý.",
      "Đối chiếu hồ sơ với hóa đơn, hợp đồng, nghiệm thu, bàn giao, biên bản đưa vào sử dụng và bảng phân bổ.",
      "Cảnh báo trích khấu hao sai kỳ, phân bổ quá hạn, thiếu hồ sơ hoặc ghi nhận sai TK 211/214/242/153.",
    ],
    method: "Kiểm theo logic phân loại 211/213/153/242, ngày đưa vào sử dụng, thời gian khấu hao/phân bổ và hồ sơ chứng minh trước khi khóa sổ.",
    input: "Hóa đơn, hợp đồng, nghiệm thu/bàn giao, biên bản đưa vào sử dụng, bảng khấu hao, bảng phân bổ 242 và sổ cái liên quan.",
    output: "Kết luận đủ/thiếu hồ sơ, rủi ro kế toán-thuế, tài khoản cần rà và hướng bổ sung chứng từ.",
    example: "Mua máy móc 500 triệu chưa VAT, đã thanh toán nhưng thiếu nghiệm thu và ngày đưa vào sử dụng.",
  },
  "accounting-error-fixer": {
    kicker: "Skill 10",
    title: "Accounting Error Fixer",
    intro: "Khoanh vùng và đề xuất xử lý sai sót kế toán như sai tài khoản, sai kỳ, sai số tiền, sai thuế hoặc trùng chứng từ.",
    purpose: "Giúp kế toán có quy trình tìm lỗi và phương án điều chỉnh thay vì sửa theo cảm tính.",
    actions: [
      "Phân loại lỗi theo tài khoản, kỳ, số tiền, thuế, chứng từ hoặc đối tượng.",
      "Đề xuất chứng từ và báo cáo cần đối chiếu để xác nhận lỗi.",
      "Gợi ý hướng điều chỉnh hoặc bút toán đảo/sửa phù hợp với tình huống.",
    ],
    method: "Bắt đầu từ loại sai sót và trạng thái kỳ báo cáo, sau đó đánh giá ảnh hưởng đến sổ kế toán, tờ khai thuế, BCTC, công nợ, tồn kho hoặc giá vốn.",
    input: "Mô tả lỗi, bút toán, sổ cái, chứng từ liên quan, kỳ phát sinh và báo cáo bị ảnh hưởng.",
    output: "Nguyên nhân khả nghi, bước kiểm chứng và hướng xử lý kế toán.",
    example: "Bỏ sót hóa đơn mua nguyên vật liệu 200 triệu từ năm trước, cần đánh giá trọng yếu và hướng hạch toán bổ sung.",
  },
  "legal-researcher": {
    kicker: "Skill 13",
    title: "Legal Researcher",
    intro: "Tra cứu và tóm tắt căn cứ pháp luật để hỗ trợ kết luận kế toán, thuế và hồ sơ.",
    purpose: "Giúp câu trả lời nghiệp vụ có căn cứ rõ hơn, đồng thời tách phần tra cứu pháp lý khỏi phần kết luận kế toán.",
    actions: [
      "Xác định văn bản, điều khoản hoặc nhóm quy định cần tra.",
      "Tóm tắt điểm áp dụng vào tình huống thực tế.",
      "Nêu phần còn cần kiểm chứng nếu nguồn chưa đủ hoặc quy định có thay đổi.",
    ],
    method: "Chạy theo hướng nghiên cứu 4 bước: phân rã câu hỏi, tra NotebookLM theo nguồn phù hợp, kiểm chứng lại căn cứ và nêu rõ vùng xám pháp lý.",
    input: "Câu hỏi pháp lý, loại thuế/nghiệp vụ, thời kỳ áp dụng và nguồn văn bản hiện có.",
    output: "Tóm tắt căn cứ, phạm vi áp dụng và lưu ý khi dùng cho kết luận nghiệp vụ.",
    example: "Tra điều kiện thanh toán không dùng tiền mặt để khấu trừ VAT đầu vào.",
  },
  "accounting-entry-assistant": {
    kicker: "Skill 03",
    title: "Accounting Entry Assistant",
    intro: "Hỗ trợ định khoản nghiệp vụ kế toán, giải thích tài khoản nợ/có, logic ghi nhận và lưu ý thuế liên quan.",
    purpose: "Giúp kế toán chuyển tình huống thực tế thành bút toán rõ ràng, có căn cứ và dễ kiểm tra lại khi phỏng vấn hoặc làm việc.",
    actions: [
      "Xác định bản chất nghiệp vụ và tài khoản liên quan.",
      "Đề xuất bút toán nợ/có, số tiền trước thuế, VAT và thanh toán.",
      "Nêu hồ sơ cần kèm theo và điểm dễ sai khi hạch toán.",
    ],
    method: "Xác định bản chất nghiệp vụ trước, sau đó tách số tiền, VAT, công nợ/thanh toán; khi rủi ro cao thì chuyển sang skill chứng từ, thuế, TSCĐ hoặc lương chuyên sâu.",
    input: "Mô tả nghiệp vụ, số tiền, VAT, hình thức thanh toán, chứng từ và kỳ phát sinh.",
    output: "Bút toán đề xuất, giải thích tài khoản, lưu ý thuế và chứng từ cần kiểm.",
    example: "Mua CCDC 24 triệu chưa VAT, dùng 12 tháng, cần định khoản mua và phân bổ hàng tháng.",
  },
};

const skillCards = Array.from(document.querySelectorAll("[data-skill-id]"));
const skillDetailFields = {
  kicker: document.querySelector("#skill-detail-kicker"),
  title: document.querySelector("#skill-detail-title"),
  intro: document.querySelector("#skill-detail-intro"),
  purpose: document.querySelector("#skill-detail-purpose"),
  actions: document.querySelector("#skill-detail-actions"),
  method: document.querySelector("#skill-detail-method"),
  input: document.querySelector("#skill-detail-input"),
  output: document.querySelector("#skill-detail-output"),
  example: document.querySelector("#skill-detail-example"),
};

const renderActionList = (actions) => {
  if (!skillDetailFields.actions) {
    return;
  }

  skillDetailFields.actions.innerHTML = actions.map((action) => `<li>${action}</li>`).join("");
};

const selectSkill = (skillId) => {
  const detail = skillDetails[skillId];

  if (!detail) {
    return;
  }

  skillCards.forEach((card) => {
    const isActive = card.dataset.skillId === skillId;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-selected", String(isActive));
  });

  skillDetailFields.kicker.textContent = detail.kicker;
  skillDetailFields.title.textContent = detail.title;
  skillDetailFields.intro.textContent = detail.intro;
  skillDetailFields.purpose.textContent = detail.purpose;
  skillDetailFields.method.textContent = detail.method;
  skillDetailFields.input.textContent = detail.input;
  skillDetailFields.output.textContent = detail.output;
  skillDetailFields.example.textContent = detail.example;
  renderActionList(detail.actions);
};

skillCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectSkill(card.dataset.skillId);
  });
});
