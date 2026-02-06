/* =========================================
   1. UTILITIES & CONFIG
   ========================================= */

// Debug Logger
function logError(msg, err) {
  console.error(msg, err);
  const box = document.getElementById("debug-log");
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<strong>⚠️ ERROR:</strong> ${msg}<br><br>${err ? err.message : ""}`;
  }
}

// Parse Date "2026-01" -> { year: "2026", month: "January" }
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

// SVG Ring Generator (for Staff Page)
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

// Category Meta Data (Corrected mapping)
const META = {
  "Location & Neighbourhood": {
    code: "loc",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "ic-loc",
    title: "Location",
  },
  Cleanliness: {
    code: "cln",
    colorClass: "c-teal",
    textClass: "t-teal",
    icon: "ic-cln",
    title: "Cleanliness",
  },
  "Room Comfort": {
    code: "room",
    colorClass: "c-purple",
    textClass: "t-purple",
    icon: "ic-bed",
    title: "Room",
  },
  "Hotel Amenities & Atmosphere": {
    code: "amen",
    colorClass: "c-blue",
    textClass: "t-blue",
    icon: "ic-gym",
    title: "Amenities",
  },
  "Food & Beverage": {
    code: "fnb",
    colorClass: "c-pink",
    textClass: "t-pink",
    icon: "ic-fnb",
    title: "F & B",
  },
  "Guest Experience & Service": {
    code: "srv",
    colorClass: "c-orange",
    textClass: "t-orange",
    icon: "ic-srv",
    title: "Service",
  },
  "Value for Money": {
    code: "val",
    colorClass: "c-gold",
    textClass: "t-gold",
    icon: "ic-val",
    title: "Value",
  },
};

/* =========================================
   2. HARDCODED STAFF DATA (Page 3)
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

// Render Category Block (Pages 7 & 8)
function renderCategory(catData, weeklyData, countData, containerId) {
  // Safe default if category not found in META
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

  // Build Table Rows
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
      // Sparkline coordinates (Box is 280x80)
      const x = 30 + i * 55;
      const y = 80 - s * 8;
      points.push(`${x},${y}`);
    }
    tableRows += `<td class="${cls}">${val}</td>`;
  });
  tableRows += `<td>8</td></tr>`;

  // Sparkline SVG Path
  let d = points.length > 0 ? "M" + points.join(" L") : "";

  // [FIX] Removed broken style tag on icon. Now uses CSS class directly.
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
        <div class="chart-box">
          <svg class="chart-svg">
            <line x1="0" y1="40" x2="280" y2="40" class="chart-base" />
            <path d="${d}" class="chart-line" />
          </svg>
        </div>
        <table class="data-table">${tableRows}</table>
      </div>

      <div class="highlight-grid">
        <div class="highlight-box hl-pos">
          <div class="hl-icon"><i class="icon ic-check"></i></div>
          ${catData.positive}
        </div>
        <div class="highlight-box hl-neg">
          <div class="hl-icon"><i class="icon ic-alert"></i></div>
          ${catData.negative}
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById(containerId);
  if (container) container.innerHTML += html;
}

// Render Solution Item (Pages 9 & 10)
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
    </div>
  `;

  const container = document.getElementById(containerId);
  if (container) container.innerHTML += html;
}

/* =========================================
   4. MAIN INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // --- A. Populate Staff Table (Hardcoded) ---
  const staffBody = document.getElementById("staff-body");
  if (staffBody) {
    STAFF_DATA.forEach((row) => {
      const posRatio = (row.pos / row.total) * 100;
      const negRatio = (row.neg / row.total) * 100;
      const ratioDisplay =
        row.pos > 0
          ? (posRatio % 1 === 0 ? posRatio : posRatio.toFixed(1)) + "%"
          : "0%";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><div class="col-name"><div class="avatar">${row.initial}</div>${row.name}</div></td>
        <td class="col-arrow">></td>
        <td>${row.date}</td>
        <td class="center">${row.total}</td>
        <td class="right"><div class="ring-wrapper">${row.pos > 0 ? row.pos + "/" + row.total : "-"}${getRing(posRatio, "green")}</div></td>
        <td class="right"><div class="ring-wrapper">${row.neg > 0 ? row.neg + "/" + row.total : "-"}${getRing(negRatio, "red")}</div></td>
        <td class="right">${ratioDisplay}</td>
      `;
      staffBody.appendChild(tr);
    });
  }

  // --- B. Navigation Scroll Logic ---
  const links = document.querySelectorAll(".nav-links a");

  function setActive(hash) {
    links.forEach((a) => {
      a.style.color = a.getAttribute("href") === hash ? "#fff" : "#ccc";
    });
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setActive(href);
      }
    });
  });

  // --- C. Fetch & Populate Data from JSON ---
  fetch("data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not find data.json");
      return res.json();
    })
    .then((data) => {
      window.REPORT_DATA = data; // Store for download function

      // 1. Cover Page
      let hotelName =
        data.hotel_name ||
        (data.data_overview
          ? data.data_overview.hotel_name
          : "Excelsior Hotel Gallia");
      document.getElementById("cover-hotel-name").innerHTML = hotelName.replace(
        /,/g,
        ",<br>",
      );

      const dateObj = parseDate(data.period_label);
      document.getElementById("cover-year").textContent = dateObj.year;
      document.getElementById("cover-month").textContent = dateObj.month;

      // Update all header dates across pages
      const fullDate = `${dateObj.month}, ${dateObj.year}`;
      document
        .querySelectorAll(".date-placeholder")
        .forEach((el) => (el.textContent = fullDate));

      // 2. Dashboard Score (Page 2)
      if (data.dashboard_overview && data.dashboard_overview.overall_score) {
        document.getElementById("dashboard-score").textContent =
          data.dashboard_overview.overall_score;
      }

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

      if (data.insights) {
        document.getElementById("txt-highlight").textContent =
          data.insights.highlight;
        document.getElementById("txt-issue").textContent = data.insights.issue;
        document.getElementById("txt-trend").textContent =
          data.insights.trend_insights;

        // 4. Top Lists (Page 6)
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

      // 5. Category Reports (Pages 7 & 8)
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
      const p8Cats = [
        "Food & Beverage",
        "Guest Experience & Service",
        "Value for Money",
      ];

      p7Cats.forEach((name) => {
        const cat = data.insights.category_summary.find(
          (c) => c.category === name,
        );
        if (cat) renderCategory(cat, weeklyData, countData, "cat-container-1");
      });

      p8Cats.forEach((name) => {
        const cat = data.insights.category_summary.find(
          (c) => c.category === name,
        );
        if (cat) renderCategory(cat, weeklyData, countData, "cat-container-2");
      });

      // 6. Solutions (Pages 9 & 10)
      if (data.solution) {
        if (data.solution.overall) {
          document.getElementById("mgmt-focus-text").innerText =
            data.solution.overall;
        }
        if (data.solution.category_solutions) {
          const list = data.solution.category_solutions.filter(
            (i) => i.action !== "-",
          );
          // Split into two pages
          list
            .slice(0, 5)
            .forEach((item) => renderSolutionItem(item, "sol-list-1"));
          list
            .slice(5)
            .forEach((item) => renderSolutionItem(item, "sol-list-2"));
        }
      }

      // 7. Contact (Page 11)
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
    })
    .catch((err) => logError("Data Load Failed", err));
});

/* =========================================
   5. DOWNLOAD FUNCTIONS (FIXED)
   ========================================= */

function downloadJSON() {
  if (!window.REPORT_DATA) return alert("No data loaded to download.");
  const blob = new Blob([JSON.stringify(window.REPORT_DATA, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
}

function downloadHTML() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hotel-report.html";
  link.click();
}

function downloadPDF() {
  const element = document.getElementById("report-content");

  // [FIX] Use exact pixel format to match CSS dimensions (1240 x 1754)
  // This prevents the "narrowing" effect.
  const opt = {
    margin: 0,
    filename: "hotel-report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowWidth: 1240,
    },
    jsPDF: {
      unit: "px",
      format: [1240, 1754],
      orientation: "portrait",
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .catch((err) => {
      console.error("PDF Generation failed:", err);
      alert("Could not generate PDF. Please ensure all assets are loaded.");
    });
}
