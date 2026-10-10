
// ---------- DATA: 120 STUDENTS ----------

let seed = 12345;

function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const between = (a, b) =>
  Math.round(a + random() * (b - a));

const pick = list =>
  list[Math.floor(random() * list.length)];

const firstNames = [
  "Aarav", "Diya", "Imran", "Meera", "Rohan", "Sana",
  "Kiran", "Farhan", "Priya", "Arjun", "Anita", "Vikram",
  "Divya", "Karthik", "Fatima", "Suresh", "Lakshmi",
  "Rahul", "Nisha", "Ajay", "Pooja", "Manoj", "Swathi",
  "Harish", "Ayesha", "Naveen", "Keerthi", "Bala",
  "Revathi", "Yusuf"
];

const lastNames = [
  "Kumar", "Raj", "Rahman", "Devi", "Singh", "Nair",
  "Iyer", "Reddy", "Khan", "Pillai", "Sharma", "Menon"
];

const depts = ["CSE", "IT", "ECE", "AI&DS", "MECH"];

const cities = [
  "Chennai", "Madurai", "Coimbatore", "Salem", "Trichy",
  "Erode", "Tirunelveli", "Vellore", "Thanjavur", "Hosur"
];

const feeOf = {
  "CSE": 90000,
  "IT": 85000,
  "ECE": 80000,
  "AI&DS": 85000,
  "MECH": 75000
};

const students = [];

for (let i = 0; i < 120; i++) {
  const ability = random();

  const internal = Math.min(
    40,
    Math.max(8, between(8, 40) * 0.4 + ability * 24)
  );

  const external = Math.min(
    60,
    Math.max(10, between(10, 60) * 0.4 + ability * 36)
  );

  const att = Math.min(
    99,
    Math.max(45, Math.round(45 + ability * 45 + between(0, 10)))
  );

  const failed = ability < 0.2
    ? between(2, 4)
    : ability < 0.4
      ? between(0, 2)
      : 0;

  const dept = pick(depts);
  const fee = feeOf[dept];
  const residence = random() < 0.4 ? "Hostel" : "Day Scholar";
  const last = pick(lastNames);
  const marks = Math.round(internal) + Math.round(external);

  students.push({
    id: "S" + (101 + i),
    name: pick(firstNames) + " " + last,
    dept,
    year: (i % 4) + 1,
    internal: Math.round(internal),
    external: Math.round(external),
    marks,
    att,
    failed,
    supplies: failed > 0 ? between(0, failed) : 0,
    weekend: random() < 0.3 ? "Yes" : "No",
    transport: residence === "Hostel"
      ? "None"
      : pick(["Bus", "Bus", "Own Vehicle", "Train"]),
    residence,
    from: pick(cities),
    fee,
    paid: random() < 0.55
      ? fee
      : Math.round(fee * between(30, 90) / 100 / 1000) * 1000,
    parent: pick(["Mr.", "Mrs."]) + " " +
      pick(firstNames.slice(15)) + " " + last,
    pin: String(1000 + (i * 7919) % 9000),
    score: Math.round(marks * 0.7 + att * 0.3)
  });
}

students.forEach(s => {
  s.due = s.fee - s.paid;
});

// ---------- HELPERS ----------

const app = document.getElementById("app");
let selectedYear = 0;

function level(score) {
  if (score >= 75) {
    return {
      text: "Doing Well",
      face: "😊",
      banner: "green",
      pill: "p-g",
      msg: "Your child is doing great. Please keep encouraging them!"
    };
  }

  if (score >= 50) {
    return {
      text: "Needs Some Help",
      face: "😐",
      banner: "yellow",
      pill: "p-y",
      msg: "Your child needs a little extra support. Please meet the class teacher."
    };
  }

  return {
    text: "Needs Urgent Attention",
    face: "😟",
    banner: "redbg",
    pill: "p-r",
    msg: "Your child needs your help now. Please meet the class teacher soon."
  };
}

const bar = (percent, color) =>
  `<div class="bar"><i style="width:${percent}%; background:${color}"></i></div>`;

const money = value =>
  "₹" + value.toLocaleString("en-IN");

// ---------- LOGIN PAGE ----------

function loginPage(message = "") {
  app.innerHTML = `
    <div class="box center">
      <div style="font-size:60px">🎓</div>
      <h1>EduNEXA</h1>
      <p>Know how your child is doing</p>

      <input id="user" placeholder="👤 Student ID (or admin)">
      <input id="pass" type="password" placeholder="🔑 PIN (or password)">

      <br><br>

      <button onclick="login()">Login</button>

      <p class="red">${message}</p>

      <small>
        Management: admin / admin123<br>
        Parent: S101 / 1000
      </small>
    </div>
  `;
}

function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  if (user === "admin" && pass === "admin123") {
    managementPage();
    return;
  }

  const student = students.find(
    s => s.id.toLowerCase() === user.toLowerCase() &&
         s.pin === pass
  );

  if (student) {
    studentPage(student, true);
  } else {
    loginPage("❌ Wrong ID or PIN. Please try again.");
  }
}

// ---------- MANAGEMENT DASHBOARD ----------

function managementPage() {
  app.innerHTML = `
    <div class="top">
      <h2>🎓 EduNEXA - College Management</h2>
      <button class="logout" onclick="loginPage()">Logout</button>
    </div>

    <div class="box">
      <div class="tabs">
        ${["All Years", "Year 1", "Year 2", "Year 3", "Year 4"]
          .map((title, year) =>
            `<button id="tab${year}" onclick="setYear(${year})">${title}</button>`
          ).join("")}
      </div>

      <div class="filters">
        <input
          id="search"
          placeholder="🔍 Search name or ID..."
          oninput="showRows()"
        >

        <select id="dept" onchange="showRows()">
          <option value="">All Departments</option>
          ${depts.map(dept => `<option>${dept}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="grid" id="stats"></div>

    <div class="box">
      <h3 id="title"></h3>

      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Parent PIN</th>
              <th>Dept</th>
              <th>Year</th>
              <th>Internal</th>
              <th>External</th>
              <th>Marks</th>
              <th>Attendance</th>
              <th>Failed</th>
              <th>Supplies</th>
              <th>Weekend Exam</th>
              <th>Transport</th>
              <th>Residence</th>
              <th>From</th>
              <th>Fee Due</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>
  `;

  showRows();
}

function setYear(year) {
  selectedYear = year;
  showRows();
}

function showRows() {
  const search = document.getElementById("search").value.toLowerCase();
  const dept = document.getElementById("dept").value;

  const list = students.filter(s =>
    (selectedYear === 0 || s.year === selectedYear) &&
    (!dept || s.dept === dept) &&
    (s.name + s.id).toLowerCase().includes(search)
  );

  for (let year = 0; year <= 4; year++) {
    document.getElementById("tab" + year).className =
      year === selectedYear ? "on" : "";
  }

  const avg = list.length
    ? list.reduce((total, s) => total + s.score, 0) / list.length
    : 0;

  const pendingFees = list.reduce((total, s) => total + s.due, 0);
  const needsReview = list.filter(s => s.score < 75).length;

  document.getElementById("stats").innerHTML = `
    <div class="stat s1">
      👥 Students
      <b>${list.length}</b>
    </div>

    <div class="stat s2">
      ⭐ Average Score
      <b>${avg.toFixed(1)}</b>
    </div>

    <div class="stat s3">
      ⚠️ Need Review
      <b>${needsReview}</b>
    </div>

    <div class="stat s4">
      💰 Fee Pending
      <b>${money(pendingFees)}</b>
    </div>
  `;

  document.getElementById("title").textContent =
    "👤 " +
    (selectedYear ? "Year " + selectedYear : "All Years") +
    " Students (" + list.length + ")";

  document.getElementById("rows").innerHTML =
    list.map(s => `
      <tr>
        <td>
          <a onclick="openStudent('${s.id}')">${s.name}</a>
        </td>
        <td>${s.id}</td>
        <td>${s.pin}</td>
        <td>${s.dept}</td>
        <td>${s.year}</td>
        <td>${s.internal}</td>
        <td>${s.external}</td>
        <td>${s.marks}</td>
        <td>${s.att}%</td>
        <td class="${s.failed ? "red" : ""}">${s.failed}</td>
        <td class="${s.supplies ? "red" : ""}">${s.supplies}</td>
        <td>${s.weekend}</td>
        <td>${s.transport}</td>
        <td>${s.residence}</td>
        <td>${s.from}</td>
        <td class="${s.due ? "red" : ""}">
          ${s.due > 0 ? money(s.due) : "Paid"}
        </td>
        <td><b>${s.score}</b></td>
        <td>
          <span class="pill ${level(s.score).pill}">
            ${level(s.score).text}
          </span>
        </td>
      </tr>
    `).join("") ||
    '<tr><td colspan="18">No students found</td></tr>';
}

function openStudent(id) {
  const student = students.find(s => s.id === id);

  if (student) {
    studentPage(student, false);
  }
}

// ---------- STUDENT / PARENT DASHBOARD ----------

function studentPage(s, isParent) {
  const lv = level(s.score);
  const feePercent = Math.round(s.paid / s.fee * 100);

  const attColor = s.att >= 75
    ? "#16a34a"
    : s.att >= 60
      ? "#f59e0b"
      : "#dc2626";

  const button = isParent
    ? `<button class="logout" onclick="loginPage()">Logout</button>`
    : `<button class="logout" onclick="managementPage()">⬅ Back</button>`;

  const alerts = [
    s.failed > 0 ? `📕 ${s.failed} subject(s) failed` : "",
    s.supplies > 0 ? `📝 ${s.supplies} supply exam(s) to write` : "",
    s.att < 75 ? `📅 Attendance is low (${s.att}%)` : "",
    s.due > 0 ? `💰 Fee balance pending: ${money(s.due)}` : ""
  ].filter(Boolean);

  app.innerHTML = `
    <div class="top">
      <h2>${isParent ? "Welcome, " + s.parent : "Student Details"}</h2>
      ${button}
    </div>

    <div class="banner ${lv.banner}">
      <div class="face">${lv.face}</div>
      <h2>${s.name} is ${lv.text}</h2>
      <p>${lv.msg}</p>
      <p>
        <b>Class: ${s.dept} - Year ${s.year} | ID: ${s.id}</b>
      </p>
    </div>

    ${
      alerts.length
        ? `<div class="box">
             <h3>🔔 Please Note</h3>
             ${alerts.map(alert => `<p class="red">${alert}</p>`).join("")}
           </div>`
        : `<div class="box">
             <h3>✅ No problems. All good!</h3>
           </div>`
    }

    <div class="grid">
      <div class="card c-blue">
        <div class="icon">📚</div>
        <div>Total Marks</div>
        <div class="num">${s.marks} / 100</div>
        ${bar(s.marks, "#3b82f6")}
        <p>
          Internal: <b>${s.internal} / 40</b><br>
          External: <b>${s.external} / 60</b>
        </p>
      </div>

      <div class="card c-green">
        <div class="icon">📅</div>
        <div>Attendance</div>
        <div class="num">${s.att}%</div>
        ${bar(s.att, attColor)}
        <p>Should be 75% or more</p>
      </div>

      <div class="card c-pink">
        <div class="icon">📕</div>
        <div>Failed Subjects</div>
        <div class="num">${s.failed}</div>
        <p>Supply exams: <b>${s.supplies}</b></p>
      </div>

      <div class="card c-purple">
        <div class="icon">🗓️</div>
        <div>Weekend Exams</div>
        <div class="num">${s.weekend}</div>
        <p>Success score: <b>${s.score} / 100</b></p>
      </div>

      <div class="card c-yellow">
        <div class="icon">🏠</div>
        <div>Stay and Travel</div>
        <div class="num" style="font-size:24px">${s.residence}</div>
        <p>
          Coming from: <b>${s.from}</b><br>
          Transport: <b>${s.transport}</b>
        </p>
      </div>

      <div class="card c-orange">
        <div class="icon">💰</div>
        <div>Fees</div>
        <div class="num">
          ${s.due > 0 ? money(s.due) + " due" : "All Paid ✅"}
        </div>
        ${bar(feePercent, "#16a34a")}
        <p>
          Total: <b>${money(s.fee)}</b><br>
          Paid: <b>${money(s.paid)}</b>
        </p>
      </div>
    </div>

    ${
      isParent
        ? ""
        : `<div class="box">
             <h3>👨‍👩‍👧 Parent</h3>
             <p>${s.parent}</p>
           </div>`
    }
  `;
}

// ---------- START APPLICATION ----------

loginPage();
