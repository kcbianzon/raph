/* =========================================
   1. UTILITIES & CONFIG
   ========================================= */

function logError(msg, err) {
  console.error(msg, err);
  const box = document.getElementById("debug-log");
  if (box) {
    box.style.display = "block";
    box.innerHTML = `<strong> ERROR:</strong> ${msg}<br><br>${err ? err.message : ""}`;
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

/* =========================================
   4. MAIN INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Staff Table
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
        <td class="right">${ratioDisplay}</td>`;
      staffBody.appendChild(tr);
    });
  }

  // 2. Fetch Data
  fetch("data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not find data.json");
      return res.json();
    })
    .then((data) => {
      window.REPORT_DATA = data;

      // Cover
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
        .forEach(
          (el) => (el.textContent = `${dateObj.month}, ${dateObj.year}`),
        );

      // Overview
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

        // Top Lists
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

      // Categories
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

      // Solutions
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
          list
            .slice(5)
            .forEach((item) => renderSolutionItem(item, "sol-list-2"));
        }
      }

      // Contact
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
   5. DOWNLOAD FUNCTIONS (SAFE MODE)
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

function downloadHTML() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hotel-report.html";
  link.click();
}

function downloadPDF() {
  if (typeof html2pdf === "undefined") {
    alert(
      "Error: html2pdf library is missing. Ensure 'dist/html2pdf.bundle.min.js' is loaded.",
    );
    return;
  }

  const btn = document.querySelector(".btn-primary");
  const originalText = btn.innerText;
  btn.innerText = "Generating PDF... (Please Wait)";
  btn.style.opacity = "0.7";
  btn.disabled = true;

  const element = document.getElementById("report-content");

  // SAFE MODE: Auto-scaling (Zoom to fit)
  const opt = {
    margin: 0.5,
    filename: "hotel-report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      // Removed windowWidth to let it auto-detect best fit
      scrollX: 0,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      btn.innerText = originalText;
      btn.style.opacity = "1";
      btn.disabled = false;
    })
    .catch((err) => {
      console.error(err);
      alert("Error: " + err.message);
      btn.innerText = originalText;
      btn.style.opacity = "1";
      btn.disabled = false;
    });
}
