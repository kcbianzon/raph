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
const META = {
  "Location & Neighbourhood": {
    code: "loc",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "ic-loc",
    img: "location.png", // Correct filename
    title: "Location",
    short: "Location", // KPI Label
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
    short: "F&B", // Fixed: Shows "F&B" instead of "F"
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
   2. HARDCODED STAFF DATA
   ========================================= */
const STAFF_DATA = [
  { name: "Staff", initial: "S", date: "2025-12-24", total: 8, pos: 8, neg: 0 },
  {
    name: "Front Desk",
    initial: "F",
    date: "2025-12-25",
    total: 4,
    pos: 0,
    neg: 4,
  },
  {
    name: "Manager",
    initial: "M",
    date: "2025-12-24",
    total: 3,
    pos: 1,
    neg: 2,
  },
  {
    name: "Hotel Staff",
    initial: "H",
    date: "2025-12-20",
    total: 3,
    pos: 3,
    neg: 0,
  },
  {
    name: "Housekeeping",
    initial: "H",
    date: "2025-12-24",
    total: 2,
    pos: 1,
    neg: 1,
  },
  {
    name: "Arabic-speaking employee",
    initial: "A",
    date: "2025-12-27",
    total: 1,
    pos: 1,
    neg: 0,
  },
  {
    name: "Mahmoud",
    initial: "M",
    date: "2025-12-27",
    total: 1,
    pos: 1,
    neg: 0,
  },
  {
    name: "Event Planning",
    initial: "E",
    date: "2025-12-24",
    total: 1,
    pos: 1,
    neg: 0,
  },
  {
    name: "General Staff",
    initial: "G",
    date: "2025-12-24",
    total: 1,
    pos: 1,
    neg: 0,
  },
  {
    name: "Martina Nicotra",
    initial: "M",
    date: "2025-12-17",
    total: 1,
    pos: 1,
    neg: 0,
  },
  {
    name: "Floor staff",
    initial: "F",
    date: "2025-12-05",
    total: 1,
    pos: 0,
    neg: 1,
  },
  {
    name: "ragazza della reception",
    initial: "r",
    date: "2025-12-05",
    total: 1,
    pos: 0,
    neg: 1,
  },
  {
    name: "ragazzo",
    initial: "r",
    date: "2025-12-05",
    total: 1,
    pos: 0,
    neg: 1,
  },
  {
    name: "Receptionist",
    initial: "R",
    date: "2025-12-05",
    total: 1,
    pos: 0,
    neg: 1,
  },
];

/* =========================================
   3. RENDER FUNCTIONS
   ========================================= */
function renderKPICard(cat, containerId) {
  // Calculate percentages based on counts
  const total = cat.total || 1;
  const posPct = Math.round((cat.positive / total) * 100);
  const negPct = Math.round((cat.negative / total) * 100);
  const neuPct = Math.round((cat.neutral / total) * 100);

  // Map category keys to icons/names (using your META object)
  // We try to match the JSON title to your META keys
  const metaKey =
    Object.keys(META).find((k) => k.includes(cat.title)) || cat.title;
  const meta = META[metaKey] || { icon: "ic-check", title: cat.title };

  // Calculate Circle Dash Arrays (Total 100)
  // Green starts at 0. Yellow starts after Green. Red starts after Yellow.
  const greenDash = `${posPct}, 100`;
  const yellowDash = `${neuPct}, 100`;
  const yellowOffset = -posPct;
  const redDash = `${negPct}, 100`;
  const redOffset = -(posPct + neuPct);

  const html = `
    <div class="kpi-card">
      <div class="kpi-head">
        <span class="cat-label"><img src="assets/${meta.icon.replace("ic-", "")}.png" class="tiny-icon" /> ${meta.title.split(" ")[0]}</span>
        <span class="kpi-goal">Goal: 8</span>
      </div>
      <div class="kpi-chart-wrap">
        <span class="kpi-lbl" style="top:-10px; left:5px; font-size:12px">${neuPct > 0 ? neuPct + "%" : ""}</span>
        <span class="kpi-lbl" style="bottom:-10px; right:-5px; font-size:12px">${posPct}%</span>
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2FAA68" stroke-width="3" stroke-dasharray="${greenDash}" />
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#EFB82C" stroke-width="3" stroke-dasharray="${yellowDash}" stroke-dashoffset="${yellowOffset}" />
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#CE4049" stroke-width="3" stroke-dasharray="${redDash}" stroke-dashoffset="${redOffset}" />
        </svg>
        <div class="kpi-score">${cat.score}</div>
      </div>
    </div>`;

  document.getElementById(containerId).innerHTML += html;
}
function renderCategory(catData, weeklyData, countData, containerId) {
  const meta = META[catData.category] || {
    code: "gen",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "",
  };
  const scores = weeklyData[catData.category] || [null, null, null, null, null];
  const reviewCount =
    countData && countData[catData.category]
      ? countData[catData.category]
      : catData.count_total || 0;

  let tableRows = `<tr><th>Performance</th><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th><th>Week 5</th><th style="color:#5C86C8; letter-spacing:2px;">••••• Goal</th></tr><tr><td>Score</td>`;
  let points = [];
  scores.forEach((s, i) => {
    let cls = "";
    let val = "-";
    if (s !== null) {
      val = s;
      if (s >= 8) cls = "score-green";
      else if (s >= 6) cls = "score-orange";
      else cls = "score-red";
      const x = 30 + i * 55;
      const y = 80 - s * 8;
      points.push(`${x},${y}`);
    }
    tableRows += `<td class="${cls}">${val}</td>`;
  });
  tableRows += `<td>8</td></tr>`;
  let d = points.length > 0 ? "M" + points.join(" L") : "";

  const html = `
    <div class="cat-block">
      <div class="cat-header">
        <div class="cat-bar ${meta.colorClass}"></div>
        <div class="cat-icon-box ${meta.colorClass}" style="border-radius:50%; padding:4px;">
          <i class="icon ${meta.icon}"></i>
        </div>
        <div class="cat-name">${catData.category}</div>
        <div class="cat-reviews"><span class="dot-reviews"></span> Reviews: ${reviewCount}</div>
      </div>
      <div class="cat-comment"><strong>Comment:</strong> ${catData.trend}</div>
      <div class="viz-row">
        <div class="chart-box"><svg class="chart-svg"><line x1="0" y1="40" x2="280" y2="40" class="chart-base" /><path d="${d}" class="chart-line" /></svg></div>
        <table class="data-table">${tableRows}</table>
      </div>
      <div class="highlight-grid">
        <div class="highlight-box hl-pos"><div class="hl-icon"><i class="icon ic-check"></i></div>${catData.positive}</div>
        <div class="highlight-box hl-neg"><div class="hl-icon"><i class="icon ic-alert"></i></div>${catData.negative}</div>
      </div>
    </div>`;
  const el = document.getElementById(containerId);
  if (el) el.innerHTML += html;
}

function renderSolutionItem(item, containerId) {
  const meta = META[item.category] || {
    color: "c-blue",
    icon: "",
    title: item.category,
  };
  const html = `
    <div class="sol-item">
      <div class="sol-icon-circle ${meta.color}">
        <div class="sol-icon-inner ${meta.icon}"></div>
      </div>
      <div class="sol-content">
        <div class="sol-title">${meta.title}</div>
        <div class="sol-text">${item.action}</div>
      </div>
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
        <div class="cat-title-text">
           <i class="icon ${meta.icon}"></i> ${catData.category}
        </div>
        <div class="cat-separator"></div>
        <div class="cat-reviews-text">
           <span class="${dotClass}"></span> Reviews: ${reviewCount}
        </div>
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

        <table class="data-table" style="flex: 1; border: 1px solid #eee; margin-left:10px; border-collapse:collapse;">
           ${tableRows}
        </table>
      </div>
      
      <div style="display:flex; gap:20px; margin-top:15px;">
         <div style="flex:1; background:rgba(47, 170, 104, 0.08); padding:12px; border-radius:6px; font-size:13px; color:#333; display:flex; gap:10px; align-items:flex-start;">
            <img src="${iconPos}" class="icon-img-sm">
            <div style="line-height:1.4;">${catData.positive}</div>
         </div>
         <div style="flex:1; background:rgba(206, 64, 73, 0.08); padding:12px; border-radius:6px; font-size:13px; color:#333; display:flex; gap:10px; align-items:flex-start;">
            <img src="${iconNeg}" class="icon-img-sm">
            <div style="line-height:1.4;">${catData.negative}</div>
         </div>
      </div>
    </div>`;

  if (container) container.innerHTML += html;
}

/* =========================================
   4. RENDER ALL (DYNAMIC RE-RENDER)
   ========================================= */

function renderReport(data) {
  window.REPORT_DATA = data; // Store data globally

  // 1. Clear existing dynamic containers to avoid duplication
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

  // 2. Cover Page
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

  // 3. Overview (Page 5)
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

  // 4. Insights (Highlight, Issue, Trend, Top Lists)
  if (data.insights) {
    document.getElementById("txt-highlight").textContent =
      data.insights.highlight;
    document.getElementById("txt-issue").textContent = data.insights.issue;
    document.getElementById("txt-trend").textContent =
      data.insights.trend_insights;
    const posCont = document.getElementById("list-positives");
    const negCont = document.getElementById("list-negatives");
    if (data.insights.strengths) {
      data.insights.strengths.slice(0, 5).forEach((item, i) => {
        posCont.innerHTML += `<div class="list-item"><span class="item-num">${i + 1}</span><span>${item.phrase}</span></div>`;
      });
    }
    if (data.insights.improvements) {
      data.insights.improvements.slice(0, 5).forEach((item, i) => {
        negCont.innerHTML += `<div class="list-item"><span class="item-num">${i + 1}</span><span>${item.phrase}</span></div>`;
      });
    }
  }

  // 5. Categories (Page 7 & 8)
  const weeklyData = {};
  const countData = data.category_counts || {};
  if (data.insights && data.insights.category_summary) {
    data.insights.category_summary.forEach(
      (c) => (weeklyData[c.category] = [null, null, null, null, null]),
    );
  }
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

  // 6. Solutions (Page 9 & 10)
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

  // 7. Contact Info
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
   4. MAIN INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch BOTH data files
  Promise.all([
    fetch("data.json").then((r) => r.json()),
    fetch("dashboard.json").then((r) => r.json()),
  ])
    .then(([mainData, dashData]) => {
      window.REPORT_DATA = mainData;
      window.DASH_DATA = dashData;

      // --- RENDER MAIN REPORT (Existing Logic) ---
      renderReport(mainData);

      // --- RENDER DASHBOARD (PAGE 2) ---
      const cats = dashData.categories;

      // 1. Overview Donut
      if (cats) {
        document.getElementById("dash-score").textContent = cats.score;
        const total = cats.total || 1;
        document.getElementById("dash-pos-lbl").textContent =
          Math.round((cats.positive / total) * 100) + "%";
        document.getElementById("dash-neu-lbl").textContent =
          Math.round((cats.neutral / total) * 100) + "%";
        document.getElementById("dash-neg-lbl").textContent =
          Math.round((cats.negative / total) * 100) + "%";
      }

      // 2. KPI Cards
      const kpiContainer = document.getElementById("kpi-container");
      if (kpiContainer && cats.serviceCategories) {
        kpiContainer.innerHTML = ""; // Clear
        cats.serviceCategories.forEach((cat) => {
          // Skip "Brand Consistency" if you don't want it in KPI grid
          if (cat.title !== "Brand Consistency & Expression") {
            renderKPICard(cat, "kpi-container");
          }
        });
        // Re-add the "Customize" card at the end
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
      const targetBody = document.getElementById("target-table-body");
      if (targetBody && cats.serviceCategories) {
        targetBody.innerHTML = "";
        cats.serviceCategories.forEach((cat) => {
          if (cat.title === "Brand Consistency & Expression") return;
          const diff = (cat.score - 8).toFixed(1);
          const diffColor = diff >= 0 ? "#2FAA68" : "#CE4049";
          const diffSign = diff >= 0 ? "+" : "";

          let iconName = "location";
          if (cat.title.includes("Location")) iconName = "location.png";
          else if (cat.title.includes("Cleanliness")) iconName = "cleanliness";
          else if (cat.title.includes("Comfort")) iconName = "comfort";
          else if (cat.title.includes("Amenities")) iconName = "amenities";
          else if (cat.title.includes("Food")) iconName = "food";
          else if (cat.title.includes("Guest")) iconName = "guest";
          else if (cat.title.includes("Value")) iconName = "money";

          targetBody.innerHTML += `
            <tr style="border-bottom: 1px solid #f5f5f5;">
                <td><img src="assets/${iconName}.png" class="tiny-icon" /> ${cat.title}</td>
                <td class="val-center">${cat.score}</td>
                <td class="val-center">8</td>
                <td class="diff-val" style="color: ${diffColor}; text-align: right; font-weight: 800;">${diffSign}${diff}</td>
            </tr>`;
        });
      }
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
   6. DOWNLOAD FUNCTIONS
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

  // 1. Overview Sheet
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

  // 2. Categories Sheet
  if (data.insights && data.insights.category_summary) {
    const catRows = [
      ["Category", "Score", "Positive Highlights", "Negative Highlights"],
    ];
    data.insights.category_summary.forEach((c) => {
      catRows.push([c.category, c.score, c.positive, c.negative]);
    });
    const wsCats = XLSX.utils.aoa_to_sheet(catRows);
    XLSX.utils.book_append_sheet(wb, wsCats, "Categories");
  }

  // 3. Solutions Sheet
  if (data.solution && data.solution.category_solutions) {
    const solRows = [["Category", "Suggested Action"]];
    data.solution.category_solutions.forEach((s) => {
      solRows.push([s.category, s.action]);
    });
    const wsSols = XLSX.utils.aoa_to_sheet(solRows);
    XLSX.utils.book_append_sheet(wb, wsSols, "Solutions");
  }

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

//DOWNLOAD PDF [IMPORTANT]
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const btn = document.querySelector(".btn-primary");
  const originalText = btn.innerText;

  btn.innerText = "Generating PDF... (Please Wait)";
  btn.style.opacity = "0.7";
  btn.disabled = true;
  document.body.classList.add("pdf-mode");

  try {
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

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
