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
  const total = cat.total || 1;
  const posPct = Math.round((cat.positive / total) * 100);
  const negPct = Math.round((cat.negative / total) * 100);
  const neuPct = Math.round((cat.neutral / total) * 100);
  const metaKey =
    Object.keys(META).find((k) => k.includes(cat.title)) || cat.title;
  const meta = META[metaKey] || {
    img: "check.png",
    short: cat.title.split(" ")[0],
  };
  const greenDash = `${posPct}, 100`;
  const yellowDash = `${neuPct}, 100`;
  const yellowOffset = -posPct;
  const redDash = `${negPct}, 100`;
  const redOffset = -(posPct + neuPct);
  const getPos = (offsetPct, valPct) => {
    if (valPct <= 0) return null;
    const midPct = offsetPct + valPct / 2;
    const angleDeg = midPct * 3.6 - 90;
    const angleRad = angleDeg * (Math.PI / 180);
    const radius = 68;
    const left = 50 + radius * Math.cos(angleRad);
    const top = 50 + radius * Math.sin(angleRad);

    return `top: ${top}%; left: ${left}%;`;
  };

  const posStyle = getPos(0, posPct);
  const neuStyle = getPos(posPct, neuPct);
  const negStyle = getPos(posPct + neuPct, negPct);
  const html = `
    <div class="kpi-card">
      <div class="kpi-head">
        <span class="cat-label">
          <img src="assets/${meta.img}" class="tiny-icon" onerror="this.style.display='none'" /> 
          ${meta.short}
        </span>
        <span class="kpi-goal">Goal: 8</span>
      </div>
      <div class="kpi-chart-wrap" style="overflow: visible;">
        
        ${posPct > 0 ? `<span class="kpi-lbl" style="${posStyle} position:absolute; transform:translate(-50%, -50%); color:#2FAA68; font-size:11px; font-weight:800;">${posPct}%</span>` : ""}
        ${neuPct > 0 ? `<span class="kpi-lbl" style="${neuStyle} position:absolute; transform:translate(-50%, -50%); color:#EFB82C; font-size:11px; font-weight:800;">${neuPct}%</span>` : ""}
        ${negPct > 0 ? `<span class="kpi-lbl" style="${negStyle} position:absolute; transform:translate(-50%, -50%); color:#CE4049; font-size:11px; font-weight:800;">${negPct}%</span>` : ""}

        <svg viewBox="0 0 36 36" style="transform: rotate(0deg);">
          <g transform="rotate(-90 18 18)">
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2FAA68" stroke-width="3" stroke-dasharray="${greenDash}" />
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#EFB82C" stroke-width="3" stroke-dasharray="${yellowDash}" stroke-dashoffset="${yellowOffset}" />
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#CE4049" stroke-width="3" stroke-dasharray="${redDash}" stroke-dashoffset="${redOffset}" />
          </g>
        </svg>
        <div class="kpi-score">${cat.score}</div>
      </div>
    </div>`;

  document.getElementById(containerId).innerHTML += html;
}
function renderRadarChart(categories, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !categories) return;

  const axes = [
    "Location & Neighbourhood",
    "Cleanliness",
    "Room Comfort",
    "Hotel Amenities & Atmosphere",
    "Food & Beverage",
    "Guest Experience & Service",
    "Value for Money",
  ];

  // Restored original large dimensions
  const centerX = 250;
  const centerY = 200;
  const maxRadius = 150;

  const getCoords = (score, angleDeg) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (score / 10) * maxRadius;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  let pointsScore = [],
    pointsGoal = [],
    axesHtml = "",
    labelsHtml = "";

  axes.forEach((axisName, i) => {
    const angle = (360 / 7) * i;

    // Goal & Score Math
    const goalPt = getCoords(8, angle);
    pointsGoal.push(`${goalPt.x},${goalPt.y}`);

    const catData = categories.find((c) => c.title === axisName);
    const score = catData ? catData.score : 0;
    const scorePt = getCoords(score, angle);
    pointsScore.push(`${scorePt.x},${scorePt.y}`);

    // Axis Grid Lines
    const maxPt = getCoords(10, angle);
    axesHtml += `<line x1="${centerX}" y1="${centerY}" x2="${maxPt.x}" y2="${maxPt.y}" stroke="#e5e5e5" stroke-width="1.2" />`;

    // Calculate Label Positions (Push outside the grid)
    const labelRadius = maxRadius + 35;
    const labelRad = (angle - 90) * (Math.PI / 180);
    const labelX = centerX + labelRadius * Math.cos(labelRad);
    const labelY = centerY + labelRadius * Math.sin(labelRad);

    let anchor = "middle";
    if (Math.cos(labelRad) > 0.1) anchor = "start";
    if (Math.cos(labelRad) < -0.1) anchor = "end";

    // Handle long text wrapping exactly like the original design
    if (axisName === "Hotel Amenities & Atmosphere") {
      labelsHtml += `<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-family="Inter, sans-serif" font-size="13" fill="#444" font-weight="700">
            <tspan x="${labelX}" dy="-8">Hotel Amenities</tspan>
            <tspan x="${labelX}" dy="16">&amp; Atmosphere</tspan>
        </text>`;
    } else if (axisName === "Guest Experience & Service") {
      labelsHtml += `<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-family="Inter, sans-serif" font-size="13" fill="#444" font-weight="700">
            <tspan x="${labelX}" dy="-8">Guest Experience</tspan>
            <tspan x="${labelX}" dy="16">&amp; Service</tspan>
        </text>`;
    } else {
      labelsHtml += `<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" alignment-baseline="middle" font-family="Inter, sans-serif" font-size="13" fill="#444" font-weight="700">${axisName}</text>`;
    }
  });

  // Concentric Web Rings (Scores 2, 4, 6, 8, 10)
  let webHtml = "";
  [2, 4, 6, 8, 10].forEach((val) => {
    let pts = axes
      .map(
        (_, i) =>
          `${getCoords(val, (360 / 7) * i).x},${getCoords(val, (360 / 7) * i).y}`,
      )
      .join(" ");
    webHtml += `<polygon points="${pts}" fill="none" stroke="#e5e5e5" stroke-width="1.2" />`;
  });

  // Render the fully sized SVG
  // Render the fully sized SVG
  container.innerHTML = `
    <svg viewBox="-50 0 600 450" width="100%" style="overflow: visible;">
        ${webHtml}
        ${axesHtml}
        
        <polygon points="${pointsGoal.join(" ")}" fill="rgba(111, 168, 220, 0.1)" stroke="#6fa8dc" stroke-width="2.5" />
        ${pointsGoal.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="2.5" fill="#6fa8dc" />`).join("")}
        
        <polygon points="${pointsScore.join(" ")}" fill="rgba(142, 124, 195, 0.15)" stroke="#8e7cc3" stroke-width="2.5" stroke-linejoin="round" />
        ${pointsScore.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="2.5" fill="#8e7cc3" />`).join("")}
        
        ${labelsHtml}
    </svg>`;
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
    fetch("competitors.json").then((r) => r.json()),
  ])
    .then(([mainData, dashData, compData]) => {
      window.REPORT_DATA = mainData;
      window.DASH_DATA = dashData;
      window.COMP_DATA = compData;
      renderReport(mainData);
      renderDashboardPage(dashData);
      if (compData) renderCompetitorsPage(compData);
    })
    .catch((err) => logError("Data Load Failed", err));
  const setupUpload = (id, callback) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const json = JSON.parse(e.target.result);
          callback(json);
          closeUploadModal();
          alert("Data updated successfully!");
        } catch (err) {
          alert("Invalid JSON file");
          console.error(err);
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
  };
  setupUpload("file-dashboard", (json) => renderDashboardPage(json));
  setupUpload("file-competitors", (json) =>
    renderCompetitorsPage({
      subject: window.COMP_DATA.subject,
      competitors: json.competitors || json,
    }),
  );
  setupUpload("file-competitors", (json) => renderCompetitorsPage(json));

  setupUpload("file-main", (json) => renderReport(json));
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
  if (typeof XLSX === "undefined") {
    return alert(
      "Error: Excel library (SheetJS) is missing. Please check your HTML script tags.",
    );
  }

  // Use global data populated from uploads/initial load
  const repData = window.REPORT_DATA || {};
  const dashData = window.DASH_DATA || {};
  const compData = window.COMP_DATA || null;

  if (!repData && !dashData) {
    return alert("No data loaded to export!");
  }

  const wb = XLSX.utils.book_new();

  // ==========================================
  // SHEET 1: Overview
  // ==========================================
  const hotelName =
    repData.data_overview?.hotel_name || dashData.hotelName || "Hotel";
  const period =
    repData.period_label ||
    dashData.categories?.startDate + " to " + dashData.categories?.endDate ||
    "N/A";
  const totalReviews =
    repData.data_overview?.total_reviews || dashData.categories?.total || 0;

  const sentPos =
    repData.sentiment_summary?.positive || dashData.categories?.positive || 0;
  const sentNeu =
    repData.sentiment_summary?.neutral || dashData.categories?.neutral || 0;
  const sentNeg =
    repData.sentiment_summary?.negative || dashData.categories?.negative || 0;

  const overviewSheet = [
    ["Report Data Overview"],
    ["Hotel Name", hotelName],
    ["Period", period],
    ["Total Reviews", totalReviews],
    [],
    ["Sentiment", "Count"],
    ["Positive", sentPos],
    ["Neutral", sentNeu],
    ["Negative", sentNeg],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(overviewSheet),
    "Overview",
  );

  // ==========================================
  // SHEET 2: Category KPI (From Dashboard)
  // ==========================================
  if (dashData.categories && dashData.categories.serviceCategories) {
    const catSheet = [
      [
        "Category",
        "Score",
        "Total Mentions",
        "Positive",
        "Neutral",
        "Negative",
      ],
    ];
    dashData.categories.serviceCategories.forEach((cat) => {
      catSheet.push([
        cat.title,
        cat.score,
        cat.total,
        cat.positive,
        cat.neutral,
        cat.negative,
      ]);
    });
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(catSheet),
      "Category KPI",
    );
  }

  // ==========================================
  // SHEET 3: Competitors
  // ==========================================
  if (compData) {
    const comps = compData.competitors || [];
    const subject = compData.subject;

    if (subject) {
      const compSheet = [
        [
          "Hotel Name",
          "Type",
          "Overall Score",
          "Cleanliness",
          "Room Comfort",
          "Food & Beverage",
          "Value for Money",
          "Location",
          "Amenities",
          "Service",
        ],
      ];

      const getRow = (hotel, type) => {
        const wtk = hotel.wtkSummary || {};
        const cats = wtk.categories || {};
        return [
          hotel.basicInfo?.hotelName || "Unknown",
          type,
          wtk.overall_score_avg || 0,
          cats["Cleanliness"] || 0,
          cats["Room Comfort"] || 0,
          cats["Food & Beverage"] || 0,
          cats["Value for Money"] || 0,
          cats["Location & Neighbourhood"] || 0,
          cats["Hotel Amenities & Atmosphere"] || 0,
          cats["Guest Experience & Service"] || 0,
        ];
      };

      compSheet.push(getRow(subject, "Subject Hotel"));
      comps.forEach((c) => compSheet.push(getRow(c, "Competitor")));

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet(compSheet),
        "Competitors",
      );
    }
  }

  // ==========================================
  // SHEET 4: Staff Mentions
  // ==========================================
  if (dashData.staffs) {
    const staffSheet = [
      ["Staff Name", "Total Mentions", "Positive", "Negative", "Last Mention"],
    ];
    dashData.staffs.forEach((s) => {
      staffSheet.push([
        s.name,
        s.totalMentions,
        s.positive,
        s.negative,
        s.lastTimeMention,
      ]);
    });
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(staffSheet),
      "Staff Mentions",
    );
  }

  // Save the file
  XLSX.writeFile(wb, "hotel-insights-report.xlsx");
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
function renderCompetitorsPage(data) {
  const subject = data.subject;
  const comps = data.competitors;
  const subjScore = subject.wtkSummary.overall_score_avg || 0;
  document.getElementById("comp-subject-score").textContent =
    subjScore.toFixed(1);
  let compSum = 0;
  let compCount = 0;
  comps.forEach((c) => {
    if (c.wtkSummary.overall_score_avg) {
      compSum += c.wtkSummary.overall_score_avg;
      compCount++;
    }
  });
  const compAvg = compCount > 0 ? compSum / compCount : 1;
  const ratio = compAvg > 0 ? subjScore / compAvg : 1;
  const ratioDisplay = ratio.toFixed(2);
  let rotation = (ratio - 1) * 180;
  if (rotation < -90) rotation = -90;
  if (rotation > 90) rotation = 90;

  const needle = document.getElementById("comp-needle");
  const ratioText = document.getElementById("comp-ratio-val");

  if (needle)
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
  if (ratioText) {
    ratioText.textContent = ratioDisplay;
    ratioText.style.color = ratio >= 1 ? "#2FAA68" : "#CE4049";
  }

  const listContainer = document.getElementById("comp-list-container");
  if (listContainer) {
    listContainer.innerHTML = "";

    comps.forEach((c, index) => {
      const score = c.wtkSummary.overall_score_avg || 0;
      const colors = ["#3b556e", "#917b9f", "#9fb0c8", "#c5a665", "#7a62ae"];
      const barColor = colors[index % colors.length];
      const widthPct = (score / 10) * 100;

      // FIX: Added flexbox to the row, and ellipsis/max-width to the text span
      const html = `
          <div class="comp-row" style="display: flex; align-items: center; margin-bottom: 12px;">
            <span class="comp-name" title="${c.basicInfo.hotelName}" 
                  style="flex: 0 0 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 15px; color: #555; font-size: 13px;">
              ${c.basicInfo.hotelName}
            </span>
            <div class="bar-container" style="flex: 1; background: #f5f5f5; border-radius: 3px; height: 26px;">
              <div class="bar-fill" style="width: ${widthPct}%; background: ${barColor}; height: 100%; border-radius: 3px; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: #fff; font-weight: 700; font-size: 12px;">
                ${score.toFixed(1)}
              </div>
            </div>
          </div>`;
      listContainer.innerHTML += html;
    });
  }
  const tableHead = document.getElementById("comp-table-head");
  const tableBody = document.getElementById("comp-table-body");

  if (tableHead && tableBody) {
    let headHtml = `<th style="text-align: left; padding: 15px 10px; font-weight: 700; color: #333;">Category</th>`;
    headHtml += `
      <th style="text-align: center; padding: 15px 10px; font-weight: 600; background-color: #f8fbff; border-bottom: 2px solid #3aa49d;">
        ${subject.basicInfo.hotelName.substring(0, 15)}...
      </th>`;
    comps.forEach((c) => {
      headHtml += `<th style="text-align: center; padding: 15px 10px; font-weight: 600;">${c.basicInfo.hotelName.substring(0, 15)}...</th>`;
    });
    headHtml += `
      <th style="text-align: center; padding: 15px 10px; font-weight: 700; color: #333;">Average</th>
      <th style="text-align: right; padding: 15px 20px 15px 10px; font-weight: 700; color: #333;">Diff</th>`;

    tableHead.innerHTML = headHtml;
    const catKeys = [
      "Location & Neighbourhood",
      "Cleanliness",
      "Room Comfort",
      "Hotel Amenities & Atmosphere",
      "Food & Beverage",
      "Guest Experience & Service",
      "Value for Money",
    ];

    tableBody.innerHTML = "";

    catKeys.forEach((cat) => {
      const subjVal = subject.wtkSummary.categories[cat] || 0;

      let rowHtml = `<tr style="border-bottom: 1px solid #f5f5f5">`;
      rowHtml += `<td style="padding: 12px 10px; font-weight: 500">${cat}</td>`;
      rowHtml += `<td style="text-align: center; padding: 12px 10px; background-color: #f8fbff; color: ${subjVal >= 8 ? "#2faa68" : subjVal >= 6 ? "#efb82c" : "#ce4049"}; font-weight: 600;">${subjVal.toFixed(1)}</td>`;
      let rowSum = 0;
      let rowCount = 0;

      comps.forEach((c) => {
        const val = c.wtkSummary.categories[cat] || 0;
        if (val > 0) {
          rowSum += val;
          rowCount++;
        }
        const color = val >= 8 ? "#2faa68" : val >= 6 ? "#efb82c" : "#ce4049";
        rowHtml += `<td style="text-align: center; padding: 12px 10px; color: ${color}">${val > 0 ? val.toFixed(1) : "-"}</td>`;
      });
      const rowAvg = rowCount > 0 ? rowSum / rowCount : 0;
      rowHtml += `<td style="text-align: center; padding: 12px 10px; font-weight: 700; color: #333;">${rowAvg > 0 ? rowAvg.toFixed(1) : "-"}</td>`;
      let diff = 0;
      let diffHtml = "-";
      if (subjVal > 0 && rowAvg > 0) {
        diff = subjVal - rowAvg;
        const diffSign = diff > 0 ? "+" : "";
        const diffColor = diff >= 0 ? "#2faa68" : "#ce4049";
        diffHtml = `<span style="color: ${diffColor}">${diffSign}${diff.toFixed(1)}</span>`;
      }

      rowHtml += `<td style="text-align: right; padding: 12px 20px 12px 10px; font-weight: 700;">${diffHtml}</td>`;
      rowHtml += `</tr>`;

      tableBody.innerHTML += rowHtml;
    });
  }
  renderComboChart(subject, comps);
}
/* =========================================
   MODAL LOGIC
   ========================================= */
function openUploadModal() {
  document.getElementById("uploadModal").style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("uploadModal").style.display = "none";
}
window.onclick = function (event) {
  const modal = document.getElementById("uploadModal");
  if (event.target === modal) {
    closeUploadModal();
  }
};
function renderDashboardPage(dashData) {
  if (!dashData) return;
  window.DASH_DATA = dashData;

  const cats = dashData.categories;

  // 1. Overview Donut (Dynamic Animation)
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

    // Calculate SVG stroke lengths
    const totalCircumference = 691.15; // 2 * PI * r (110)
    const semiCircumference = totalCircumference / 2; // Half circle

    const greenLen = (pos / 100) * semiCircumference;
    const yellowLen = (neu / 100) * semiCircumference;
    const redLen = (neg / 100) * semiCircumference;

    const donutGreen = document.getElementById("donut-green");
    const donutYellow = document.getElementById("donut-yellow");
    const donutRed = document.getElementById("donut-red");

    // Apply the math to the circles
    if (donutGreen) {
      donutGreen.setAttribute(
        "stroke-dasharray",
        `${greenLen} ${totalCircumference}`,
      );
      donutGreen.setAttribute("stroke-dashoffset", `0`);
    }
    if (donutYellow) {
      donutYellow.setAttribute(
        "stroke-dasharray",
        `${yellowLen} ${totalCircumference}`,
      );
      donutYellow.setAttribute("stroke-dashoffset", `-${greenLen}`);
    }
    if (donutRed) {
      donutRed.setAttribute(
        "stroke-dasharray",
        `${redLen} ${totalCircumference}`,
      );
      donutRed.setAttribute("stroke-dashoffset", `-${greenLen + yellowLen}`);
    }
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

  // 3. Target vs Performance Radar Chart
  if (cats && cats.serviceCategories) {
    renderRadarChart(cats.serviceCategories, "radar-container");
  }

  // 4. Target vs Performance Table
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

  // 5. Staff Table
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
}
function renderComboChart(subject, competitors) {
  const container = document.getElementById("combo-chart");
  if (!container) return;

  const allHotels = [subject, ...competitors];
  const maxReviews = Math.max(
    10,
    ...allHotels.map((h) => h.wtkSummary.review_count || 0),
  );
  const yMax = Math.ceil(maxReviews / 10) * 10;
  let yAxisLeft = `
    <div style="grid-row: 1 / 2; grid-column: 1 / 2; display: flex; flex-direction: column; justify-content: space-between; text-align: right; font-size: 11px; color: #888; height: 250px; padding-top: 20px; padding-right: 10px;">
      <span style="font-weight: 600; color: #555">No. of reviews</span>
      <span>${yMax}</span>
      <span>${Math.round(yMax * 0.8)}</span>
      <span>${Math.round(yMax * 0.6)}</span>
      <span>${Math.round(yMax * 0.4)}</span>
      <span>${Math.round(yMax * 0.2)}</span>
      <span>0</span>
    </div>`;
  let barsHtml = "";
  let polyPoints = [];
  const svgWidth = 500;
  const svgHeight = 230;

  allHotels.forEach((h, i) => {
    const reviews = h.wtkSummary.review_count || 0;
    const score = h.wtkSummary.overall_score_avg || 0;
    const heightPct = (reviews / yMax) * 100;
    const barColor = i === 0 ? "#2faa68" : "#8e7cc3";

    barsHtml += `
      <div style="width: 22px; height: 100%; display: flex; flex-direction: column-reverse; align-items: center;">
        <div style="height: ${heightPct}%; width: 100%; background: ${barColor}; border-radius: 2px 2px 0 0;" title="${reviews} Reviews"></div>
      </div>`;
    const x = (svgWidth / allHotels.length) * (i + 0.5);
    const y = svgHeight - (score / 10) * svgHeight;
    polyPoints.push(`${x},${y}`);
  });

  const polylinePoints = polyPoints.join(" ");
  const circles = polyPoints
    .map((p) => {
      const [x, y] = p.split(",");
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="#4472C4" />`;
    })
    .join("");
  let chartArea = `
    <div style="grid-row: 1 / 2; grid-column: 2 / 3; position: relative; height: 250px;">
      <div style="position: absolute; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding-top: 20px;">
        ${[...Array(6)].map(() => `<div style="width: 100%; height: 1px; background: #eee"></div>`).join("")}
      </div>

      <div style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: space-around; align-items: flex-end; padding: 0; top: 20px; height: 230px;">
        ${barsHtml}
      </div>

      <svg style="position: absolute; top: 20px; left: 0; width: 100%; height: 230px; z-index: 2; overflow: visible;" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
        <polyline points="${polylinePoints}" fill="none" stroke="#4472C4" stroke-width="2" vector-effect="non-scaling-stroke" />
        ${circles}
      </svg>
    </div>`;

  // 3. Right Y-Axis (Score 10 to 0)
  let yAxisRight = `
    <div style="grid-row: 1 / 2; grid-column: 3 / 4; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; color: #888; height: 250px; padding-top: 20px; padding-left: 10px;">
      <span style="font-weight: 600; color: #555">Score</span>
      <span>10</span><span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
    </div>`;

  // 4. X-Axis (Hotel Names - Truncated)
  let xAxis = `<div style="grid-row: 2 / 3; grid-column: 2 / 3; display: flex; justify-content: space-around; font-size: 10px; color: #555; margin-top: 10px; text-align: center;">`;
  allHotels.forEach((h) => {
    const name = h.basicInfo.hotelName;
    const shortName = name.length > 12 ? name.substring(0, 12) + "..." : name;
    xAxis += `<span style="width: ${100 / allHotels.length}%;" title="${name}">${shortName}</span>`;
  });
  xAxis += `</div>`;

  // 5. Dynamic Legend
  const legend = `
    <div style="grid-row: 3 / 4; grid-column: 1 / 4; display: flex; justify-content: center; gap: 25px; margin-top: 20px; font-size: 11px; color: #666;">
       <div style="display: flex; align-items: center; gap: 6px"><i style="width:12px; height:12px; background:#2faa68; border-radius:2px;"></i> Review Vol (Subject)</div>
       <div style="display: flex; align-items: center; gap: 6px"><i style="width:12px; height:12px; background:#8e7cc3; border-radius:2px;"></i> Review Vol (Competitor)</div>
       <div style="display: flex; align-items: center; gap: 6px">
          <div style="width:18px; height:2px; background:#4472C4; display:flex; align-items:center; justify-content:center;">
            <div style="width:6px; height:6px; background:#4472C4; border-radius:50%;"></div>
          </div> Overall Score
       </div>
    </div>
  `;

  // Inject everything into the container
  container.innerHTML = yAxisLeft + chartArea + yAxisRight + xAxis + legend;
  container.style.gridTemplateRows = "auto auto auto"; // Fix the grid sizing
}
