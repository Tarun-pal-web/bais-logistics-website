// 🔐 SECURITY CHECK
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}

const API = "http://localhost:5000";

// ===============================
// LOAD ENQUIRIES
// ===============================
async function loadEnquiries() {
  try {
    const res = await fetch(`${API}/api/admin/enquiries`);
    const data = await res.json();

    let total = data.length;
    let pending = 0;
    let completed = 0;

    const tbody = document.getElementById("enquiryTable");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">No data yet</td>
        </tr>`;
      return;
    }

    data.forEach(enq => {
      if (enq.status === "Completed") completed++;
      else pending++;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${enq.name}</td>
        <td>${enq.phone}</td>
        <td>${enq.pickup || "-"}</td>
        <td>${enq.drop_location || "-"}</td>
        <td>${enq.status}</td>
        <td>
          ${
            enq.status === "Pending"
              ? `<button onclick="markComplete('${enq.id}')">✔ Complete</button>`
              : "✅"
          }
          <button 
            onclick="deleteEnquiry('${enq.id}')" 
            style="margin-left:6px;color:red;">
            🗑 Delete
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });

    // UPDATE CARDS
    document.getElementById("totalEnq").innerText = total;
    document.getElementById("pendingEnq").innerText = pending;
    document.getElementById("completedEnq").innerText = completed;

  } catch (err) {
    alert("Failed to load enquiries");
    console.error(err);
  }
}

// ===============================
// MARK AS COMPLETED
// ===============================
async function markComplete(id) {
  if (!confirm("Mark this enquiry as Completed?")) return;

  try {
    await fetch(`${API}/api/admin/enquiries/${id}`, {
      method: "PUT"
    });

    loadEnquiries(); // refresh
  } catch (err) {
    alert("Failed to update status");
  }
}

// ===============================
// DELETE ENQUIRY
// ===============================
async function deleteEnquiry(id) {
  if (!confirm("Are you sure you want to delete this enquiry?")) return;

  try {
    await fetch(`${API}/api/admin/enquiries/${id}`, {
      method: "DELETE"
    });

    loadEnquiries(); // refresh
  } catch (err) {
    alert("Failed to delete enquiry");
  }
}

// LOAD ON PAGE OPEN
loadEnquiries();
