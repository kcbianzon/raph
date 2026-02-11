/* =========================================
   1. UTILITIES & CONFIG
   ========================================= */

function logError(msg, err) {
  console.error(msg, err);
  const box = document.getElementById("debug-log");
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<strong>⚠️ ERROR:</strong> ${msg}<br><br>${err ? err.message : ""}`;
  }
}

function parseDate(label) {
  if (!label) return { year: "2025", month: "December" };
  const parts = label.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return { year: year, month: months[monthIndex] || "January" };
}

function getRing(pct, colorClass) {
  const dash = (pct / 100) * 62.8;
  const empty = pct === 0;
  const stroke = empty
    ? "#eee"
    : colorClass === "green"
      ? "#2FAA68"
      : "#CE4049";
  const opacity = empty ? 0.3 : 1;
  return `
    <svg class="ring-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" class="ring-bg"></circle>
      <circle cx="12" cy="12" r="10" class="ring-val" 
        stroke="${stroke}" stroke-dasharray="${dash} 62.8" style="opacity:${opacity}"></circle>
    </svg>`;
}

// FIX: Added 'img' for icons and 'short' for KPI labels
const META = {
  "Location & Neighbourhood": {
    code: "loc",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "ic-loc",
    img: "location.png",
    title: "Location",
    short: "Location",
  },
  Cleanliness: {
    code: "cln",
    colorClass: "c-teal",
    textClass: "t-teal",
    icon: "ic-cln",
    img: "cleanliness.png",
    title: "Cleanliness",
    short: "Cleanliness",
  },
  "Room Comfort": {
    code: "room",
    colorClass: "c-purple",
    textClass: "t-purple",
    icon: "ic-bed",
    img: "comfort.png",
    title: "Room",
    short: "Room",
  },
  "Hotel Amenities & Atmosphere": {
    code: "amen",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "ic-gym",
    img: "amenities.png",
    title: "Amenities",
    short: "Amenities",
  },
  "Food & Beverage": {
    code: "fnb",
    colorClass: "c-pink",
    textClass: "t-pink",
    icon: "ic-fnb",
    img: "food.png",
    title: "F & B",
    short: "F&B",
  },
  "Guest Experience & Service": {
    code: "srv",
    colorClass: "c-orange",
    textClass: "t-orange",
    icon: "ic-srv",
    img: "guest.png",
    title: "Service",
    short: "Service",
  },
  "Value for Money": {
    code: "val",
    colorClass: "c-gold",
    textClass: "t-gold",
    icon: "ic-val",
    img: "money.png",
    title: "Value",
    short: "Value",
  },
};

/* =========================================
   2. RENDER FUNCTIONS
   ========================================= */

function renderKPICard(cat, containerId) {
  // 1. Calculate Percentages (Avoid NaN with || 1)
  const total = cat.total || 1;
  // Use Math.round to ensure clean numbers
  const posPct = Math.round((cat.positive / total) * 100);
  const negPct = Math.round((cat.negative / total) * 100);
  const neuPct = Math.round((cat.neutral / total) * 100);

  // 2. Map Metadata (Icon & Title)
  const metaKey =
    Object.keys(META).find((k) => k.includes(cat.title)) || cat.title;
  const meta = META[metaKey] || {
    img: "check.png",
    short: cat.title.split(" ")[0],
  };

  // 3. Circle Geometry (Total 100)
  // Green (Positive) starts at 12 o'clock (0).
  // Yellow (Neutral) follows Green.
  // Red (Negative) follows Yellow.
  const greenDash = `${posPct}, 100`;
  const yellowDash = `${neuPct}, 100`;
  const yellowOffset = -posPct;
  const redDash = `${negPct}, 100`;
  const redOffset = -(posPct + neuPct);

  // 4. Generate HTML with Explicit Labels
  // We place labels absolutely: Pos (Right/Green), Neg (Left/Red), Neu (Bottom/Yellow)
  const html = `
    <div class="kpi-card">
      <div class="kpi-head">
        <span class="cat-label">
          <img src="assets/${meta.img}" class="tiny-icon" onerror="this.style.display='none'" /> 
          ${meta.short}
        </span>
        <span class="kpi-goal">Goal: 8</span>
      </div>
      <div class="kpi-chart-wrap">
        ${posPct > 0 ? `<span class="kpi-lbl" style="top: 35%; right: -25px; color:#2FAA68; font-size:11px; font-weight:800;">${posPct}%</span>` : ""}
        
        ${negPct > 0 ? `<span class="kpi-lbl" style="top: 35%; left: -25px; color:#CE4049; font-size:11px; font-weight:800;">${negPct}%</span>` : ""}
        
        ${neuPct > 0 ? `<span class="kpi-lbl" style="bottom: -15px; left: 50%; transform:translateX(-50%); color:#EFB82C; font-size:11px; font-weight:800;">${neuPct}%</span>` : ""}

        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2FAA68" stroke-width="3" stroke-dasharray="${greenDash}" />
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#EFB82C" stroke-width="3" stroke-dasharray="${yellowDash}" stroke-dashoffset="${yellowOffset}" />
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#CE4049" stroke-width="3" stroke-dasharray="${redDash}" stroke-dashoffset="${redOffset}" />
        </svg>
        <div class="kpi-score">${cat.score}</div>
      </div>
    </div>`;

  const container = document.getElementById(containerId);
  if (container) container.innerHTML += html;
}

function renderCategoryPage7(catData, weeklyData, countData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const meta = META[catData.category] || { icon: "ic-loc" };
  const scores = weeklyData[catData.category] || [null, null, null, null, null];
  const reviewCount =
    countData && countData[catData.category]
      ? countData[catData.category]
      : catData.count_total || 0;

  let dotClass = "dot-hollow";
  if (reviewCount > 15) dotClass = "dot-green";
  else if (reviewCount > 5) dotClass = "dot-gold";

  let tableRows = `
    <tr>
      <th style="text-align:left; color:#999; font-weight:400; font-size:12px; padding:8px;">Performance</th>
      <th style="font-weight:400; font-size:12px; color:#999;">Week 1</th>
      <th style="font-weight:400; font-size:12px; color:#999;">Week 2</th>
      <th style="font-weight:400; font-size:12px; color:#999;">Week 3</th>
      <th style="font-weight:400; font-size:12px; color:#999;">Week 4</th>
      <th style="font-weight:400; font-size:12px; color:#999;">Week 5</th>
      <th style="color:#4472C4; letter-spacing:1px; text-transform:uppercase; font-size:10px; font-weight:700;">...... Goal</th>
    </tr>
    <tr>
      <td style="color:#666; font-size:12px; padding:8px;">Score</td>`;

  let points = [];
  scores.forEach((s, i) => {
    let cls = "";
    let val = "-";
    if (s !== null) {
      val = s;
      if (s >= 8) cls = "txt-green";
      else if (s >= 6) cls = "txt-orange";
      else cls = "txt-red";
      const x = 30 + i * 50;
      const y = (10 - s) * 15;
      points.push([x, y]);
    }
    tableRows += `<td class="${cls}" style="text-align:center;">${val}</td>`;
  });
  tableRows += `<td class="txt-black" style="text-align:center;">8</td></tr>`;

  let pathLine = getSmoothPath(points);
  let pathFill = "";
  if (points.length > 0) {
    const last = points[points.length - 1];
    const first = points[0];
    pathFill = `${pathLine} L ${last[0]},80 L ${first[0]},80 Z`;
  }

  const iconPos =
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRl_9WLZWz8V74FWrJkf6BmE7-mvIdfnRe83Nzg8QXHvRiPMR9y";
  const iconNeg =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-FaAWkfFJ7f1vh26wXTHzlttDvPblpLkHGuVbIRkOioC3NvXp";

  const html = `
    <div class="cat-block" style="margin-bottom: 50px;">
      <div class="cat-header-row">
        <div class="cat-gold-line"></div>
        <div class="cat-title-text"><i class="icon ${meta.icon}"></i> ${catData.category}</div>
        <div class="cat-separator"></div>
        <div class="cat-reviews-text"><span class="${dotClass}"></span> Reviews: ${reviewCount}</div>
      </div>
      <div style="font-size: 13px; color: #555; margin-bottom: 20px; line-height:1.5;">
        <span style="color:#666;">Comment:</span> ${catData.trend}
      </div>
      <div class="viz-row" style="display: flex; gap: 20px; align-items: flex-start;">
        <div class="chart-container-smooth">
          <svg viewBox="0 0 280 80" style="width:100%; height:100%; overflow:visible;">
             <defs>
               <linearGradient id="gradBlue${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" style="stop-color:#4472C4;stop-opacity:0.2" />
                 <stop offset="100%" style="stop-color:#4472C4;stop-opacity:0" />
               </linearGradient>
             </defs>
             <line x1="10" y1="30" x2="270" y2="30" stroke="#4472C4" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />
             <path d="${pathFill}" fill="url(#gradBlue${containerId})" stroke="none" />
             <path d="${pathLine}" fill="none" stroke="#4472C4" stroke-width="2" />
          </svg>
        </div>
        <table class="data-table" style="flex: 1; border: 1px solid #eee; margin-left:10px; border-collapse:collapse;">${tableRows}</table>
      </div>
      <div style="display:flex; gap:20px; margin-top:15px;">
         <div style="flex:1; background:rgba(47, 170, 104, 0.08); padding:12px; border-radius:6px; font-size:13px; color:#333; display:flex; gap:10px; align-items:flex-start;">
            <img src="${iconPos}" class="icon-img-sm"><div style="line-height:1.4;">${catData.positive}</div>
         </div>
         <div style="flex:1; background:rgba(206, 64, 73, 0.08); padding:12px; border-radius:6px; font-size:13px; color:#333; display:flex; gap:10px; align-items:flex-start;">
            <img src="${iconNeg}" class="icon-img-sm"><div style="line-height:1.4;">${catData.negative}</div>
         </div>
      </div>
    </div>`;

  if (container) container.innerHTML += html;
}

function renderSolutionItem(item, containerId) {
  const meta = META[item.category] || {
    color: "c-blue",
    icon: "",
    title: item.category,
  };
  const html = `
    <div class="sol-item">
      <div class="sol-icon-circle ${meta.color}"><div class="sol-icon-inner ${meta.icon}"></div></div>
      <div class="sol-content"><div class="sol-title">${meta.title}</div><div class="sol-text">${item.action}</div></div>
    </div>`;
  const el = document.getElementById(containerId);
  if (el) el.innerHTML += html;
}

function getSmoothPath(points) {
  if (points.length < 2) return "";
  const line = (pA, pB) => {
    const lX = pB[0] - pA[0],
      lY = pB[1] - pA[1];
    return {
      length: Math.sqrt(Math.pow(lX, 2) + Math.pow(lY, 2)),
      angle: Math.atan2(lY, lX),
    };
  };
  const controlPoint = (cur, prev, next, rev) => {
    const p = prev || cur,
      n = next || cur;
    const o = line(p, n);
    const angle = o.angle + (rev ? Math.PI : 0),
      length = o.length * 0.2;
    const x = cur[0] + Math.cos(angle) * length,
      y = cur[1] + Math.sin(angle) * length;
    return [x, y];
  };
  const command = (p, i, a) => {
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], p);
    const [cpeX, cpeY] = controlPoint(p, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${p[0]},${p[1]}`;
  };
  return points.reduce(
    (acc, p, i, a) =>
      i === 0 ? `M ${p[0]},${p[1]}` : `${acc} ${command(p, i, a)}`,
    "",
  );
}

function renderReport(data) {
  window.REPORT_DATA = data;
  const idsToClear = [
    "cat-container-1",
    "cat-container-2",
    "sol-list-1",
    "sol-list-2",
    "list-positives",
    "list-negatives",
  ];
  idsToClear.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  let name =
    data.hotel_name ||
    (data.data_overview
      ? data.data_overview.hotel_name
      : "Excelsior Hotel Gallia");
  document.getElementById("cover-hotel-name").innerHTML = name.replace(
    /,/g,
    ",<br>",
  );
  const dateObj = parseDate(data.period_label);
  document.getElementById("cover-year").textContent = dateObj.year;
  document.getElementById("cover-month").textContent = dateObj.month;
  document
    .querySelectorAll(".date-placeholder")
    .forEach((el) => (el.textContent = `${dateObj.month}, ${dateObj.year}`));

  if (data.data_overview)
    document.getElementById("total-reviews").textContent =
      data.data_overview.total_reviews;

  if (data.sentiment_summary) {
    const s = data.sentiment_summary;
    const total = s.positive + s.neutral + s.negative;
    document.getElementById("sent-pos").textContent = s.positive;
    document.getElementById("sent-neu").textContent = s.neutral;
    document.getElementById("sent-neg").textContent = s.negative;
    if (total > 0) {
      document.getElementById("ratio-pos").textContent = (
        (s.positive / total) *
        100
      ).toFixed(1);
      document.getElementById("ratio-neu").textContent = (
        (s.neutral / total) *
        100
      ).toFixed(1);
      document.getElementById("ratio-neg").textContent = (
        (s.negative / total) *
        100
      ).toFixed(1);
    }
  }

  if (data.insights) {
    document.getElementById("txt-highlight").textContent =
      data.insights.highlight;
    document.getElementById("txt-issue").textContent = data.insights.issue;
    document.getElementById("txt-trend").textContent =
      data.insights.trend_insights;
    const posCont = document.getElementById("list-positives");
    const negCont = document.getElementById("list-negatives");
    if (data.insights.strengths)
      data.insights.strengths.slice(0, 5).forEach((item, i) => {
        posCont.innerHTML += `<div class="list-item"><span class="item-num">${i + 1}</span><span>${item.phrase}</span></div>`;
      });
    if (data.insights.improvements)
      data.insights.improvements.slice(0, 5).forEach((item, i) => {
        negCont.innerHTML += `<div class="list-item"><span class="item-num">${i + 1}</span><span>${item.phrase}</span></div>`;
      });
  }

  const weeklyData = {};
  const countData = data.category_counts || {};
  if (data.insights && data.insights.category_summary)
    data.insights.category_summary.forEach(
      (c) => (weeklyData[c.category] = [null, null, null, null, null]),
    );
  const trends =
    data.weekly_category_trend ||
    (data.insights ? data.insights.weekly_category_trend : null);
  if (trends) {
    trends.forEach((week, wIdx) => {
      week.category_scores.forEach((cs) => {
        if (weeklyData[cs.category] && wIdx < 5)
          weeklyData[cs.category][wIdx] = cs.score;
      });
    });
  }

  const p7Cats = [
    "Location & Neighbourhood",
    "Cleanliness",
    "Room Comfort",
    "Hotel Amenities & Atmosphere",
  ];
  p7Cats.forEach((name) => {
    const cat = data.insights.category_summary.find((c) => c.category === name);
    if (cat) renderCategoryPage7(cat, weeklyData, countData, "cat-container-1");
  });

  const p8Cats = [
    "Food & Beverage",
    "Guest Experience & Service",
    "Value for Money",
  ];
  p8Cats.forEach((name) => {
    const cat = data.insights.category_summary.find((c) => c.category === name);
    if (cat) renderCategoryPage7(cat, weeklyData, countData, "cat-container-2");
  });

  if (data.solution) {
    if (data.solution.overall)
      document.getElementById("mgmt-focus-text").innerText =
        data.solution.overall;
    if (data.solution.category_solutions) {
      const list = data.solution.category_solutions.filter(
        (i) => i.action !== "-",
      );
      list
        .slice(0, 5)
        .forEach((item) => renderSolutionItem(item, "sol-list-1"));
      list.slice(5).forEach((item) => renderSolutionItem(item, "sol-list-2"));
    }
  }

  const contact = data.contact_info || {
    email: "info@wheretoknow.com",
    website: "www.wheretoknow.com",
    company_name: "Where to know Insights GmbH",
    address_line_1: "Potsdamer Platz 10 Haus 2, 5. OG Quartier",
    address_line_2: "Potsdamer Platz 10785, Berlin Germany",
  };
  document.getElementById("c-email").textContent = contact.email;
  document.getElementById("c-email").href = "mailto:" + contact.email;
  document.getElementById("c-web").textContent = contact.website;
  document.getElementById("c-web").href = "https://" + contact.website;
  document.getElementById("c-name").textContent = contact.company_name;
  document.getElementById("c-addr1").textContent = contact.address_line_1;
  document.getElementById("c-addr2").textContent = contact.address_line_2;
}

/* =========================================
   4. MAIN INITIALIZATION & DASHBOARD
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("data.json").then((r) => r.json()),
    fetch("dashboard.json").then((r) => r.json()),
  ])
    .then(([mainData, dashData]) => {
      window.REPORT_DATA = mainData;
      window.DASH_DATA = dashData;

      renderReport(mainData);

      // --- RENDER DASHBOARD (PAGE 2) ---
      const cats = dashData.categories;

      // 1. Overview Donut
      if (cats) {
        const dashScore = document.getElementById("dash-score");
        if (dashScore) dashScore.textContent = cats.score;

        const total = cats.total || 1;
        const pos = Math.round((cats.positive / total) * 100);
        const neu = Math.round((cats.neutral / total) * 100);
        const neg = Math.round((cats.negative / total) * 100);

        const elPos = document.getElementById("dash-pos-lbl");
        if (elPos) elPos.textContent = pos + "%";
        const elNeu = document.getElementById("dash-neu-lbl");
        if (elNeu) elNeu.textContent = neu + "%";
        const elNeg = document.getElementById("dash-neg-lbl");
        if (elNeg) elNeg.textContent = neg + "%";
      }

      // 2. KPI Cards
      const kpiContainer = document.getElementById("kpi-container");
      if (kpiContainer && cats.serviceCategories) {
        kpiContainer.innerHTML = "";
        cats.serviceCategories.forEach((cat) => {
          if (cat.title !== "Brand Consistency & Expression") {
            renderKPICard(cat, "kpi-container");
          }
        });
        // Add Customize Card
        kpiContainer.innerHTML += `
        <div class="kpi-card customize-card">
            <div class="kpi-head" style="justify-content: flex-start; gap: 8px">
              <span style="font-weight: 800; color: #555">Customize KPI</span>
            </div>
            <div class="customize-body">
              <img src="https://static.vecteezy.com/system/resources/previews/020/213/750/large_2x/add-button-plus-icon-isolated-on-circle-line-background-vector.jpg" class="kpi-plus-img" />
            </div>
        </div>`;
      }

      // 3. Target vs Performance Table
      const targetBody = document.getElementById("target-table-body");
      if (targetBody && cats.serviceCategories) {
        targetBody.innerHTML = "";
        cats.serviceCategories.forEach((cat) => {
          if (cat.title === "Brand Consistency & Expression") return;
          const diff = (cat.score - 8).toFixed(1);
          const diffColor = diff >= 0 ? "#2FAA68" : "#CE4049";
          const diffSign = diff >= 0 ? "+" : "";

          const metaKey =
            Object.keys(META).find((k) => k.includes(cat.title)) || cat.title;
          const meta = META[metaKey] || { img: "check.png", short: cat.title };

          targetBody.innerHTML += `
            <tr style="border-bottom: 1px solid #f5f5f5;">
                <td><img src="assets/${meta.img}" class="tiny-icon" /> ${cat.title}</td>
                <td class="val-center">${cat.score}</td>
                <td class="val-center">8</td>
                <td class="diff-val" style="color: ${diffColor}; text-align: right; font-weight: 800;">${diffSign}${diff}</td>
            </tr>`;
        });
      }

      // --- RENDER STAFF (PAGE 3) ---
      const staffBody = document.getElementById("staff-body");
      if (staffBody && dashData.staffs) {
        staffBody.innerHTML = "";
        dashData.staffs.forEach((row) => {
          const total = row.totalMentions || 0;
          const pos = row.positive || 0;
          const neg = row.negative || 0;
          const posRatio = total > 0 ? (pos / total) * 100 : 0;
          const negRatio = total > 0 ? (neg / total) * 100 : 0;
          const ratioDisplay =
            pos > 0
              ? (posRatio % 1 === 0 ? posRatio : posRatio.toFixed(1)) + "%"
              : "0%";
          const initial = row.name ? row.name.charAt(0).toUpperCase() : "-";

          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td><div class="col-name"><div class="avatar">${initial}</div>${row.name}</div></td>
          <td class="col-arrow">></td>
          <td>${row.lastTimeMention || "-"}</td>
          <td class="center">${total}</td>
          <td class="right"><div class="ring-wrapper">${pos > 0 ? pos + "/" + total : "-"}${getRing(posRatio, "green")}</div></td>
          <td class="right"><div class="ring-wrapper">${neg > 0 ? neg + "/" + total : "-"}${getRing(negRatio, "red")}</div></td>
          <td class="right">${ratioDisplay}</td>`;
          staffBody.appendChild(tr);
        });
      }
    })
    .catch((err) => logError("Data Load Failed", err));
});

/* =========================================
   5. DOWNLOAD FUNCTIONS
   ========================================= */

function downloadJSON() {
  if (!window.REPORT_DATA) return alert("No data loaded");
  const blob = new Blob([JSON.stringify(window.REPORT_DATA, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
}

function downloadExcel() {
  if (!window.REPORT_DATA) return alert("No data loaded");
  const data = window.REPORT_DATA;
  const wb = XLSX.utils.book_new();
  const overviewData = [
    ["Hotel Name", data.hotel_name || ""],
    ["Period", data.period_label || ""],
    ["Total Reviews", data.data_overview?.total_reviews || 0],
    [],
    ["Sentiment", "Count"],
    ["Positive", data.sentiment_summary?.positive || 0],
    ["Neutral", data.sentiment_summary?.neutral || 0],
    ["Negative", data.sentiment_summary?.negative || 0],
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, "Overview");
  XLSX.writeFile(wb, "hotel-report-data.xlsx");
}

function downloadHTML() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hotel-report.html";
  link.click();
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const btn = document.querySelector(".btn-primary");
  const originalText = btn.innerText;

  btn.innerText = "Generating PDF... (Please Wait)";
  btn.style.opacity = "0.7";
  btn.disabled = true;

  document.body.classList.add("pdf-mode");

  try {
    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const pages = document.querySelectorAll(".page");

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        windowWidth: 1240,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      if (i > 0) doc.addPage();
      doc.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    }
    doc.save("hotel-report.pdf");
  } catch (err) {
    console.error(err);
    alert("Error generating PDF: " + err.message);
  } finally {
    document.body.classList.remove("pdf-mode");
    btn.innerText = originalText;
    btn.style.opacity = "1";
    btn.disabled = false;
  }
}
