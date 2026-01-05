if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}

const API = "https://bais-logistics-website.onrender.com";

async function loadEnquiries() {
  const res = await fetch(`${API}/api/admin/enquiries`);
  const data = await res.json();

  let total = data.length;
  let pending = 0;
  let completed = 0;

  const tbody = document.getElementById("enquiryTable");
  tbody.innerHTML = "";

  data.forEach(enq => {
    if (enq.status === "Completed") completed++;
    else pending++;

    tbody.innerHTML += `
<tr>
  <td>${enq.name}</td>
  <td>${enq.phone}</td>
  <td>${enq.pickup || "-"}</td>
  <td>${enq.drop_location || "-"}</td>
  <td>${enq.message || "-"}</td>   <!-- ✅ CARGO ADDED -->
  <td>${enq.status}</td>
  <td>
    ${
      enq.status === "Pending"
        ? `<button onclick="markComplete('${enq.id}')">✓</button>`
        : "✅"
    }
    <button onclick="deleteEnquiry('${enq.id}')">🗑</button>
  </td>
</tr>`;
  });

  document.getElementById("totalEnq").innerText = total;
  document.getElementById("pendingEnq").innerText = pending;
  document.getElementById("completedEnq").innerText = completed;
}

async function markComplete(id) {
  await fetch(`${API}/api/admin/enquiries/${id}`, { method: "PUT" });
  loadEnquiries();
}

async function deleteEnquiry(id) {
  await fetch(`${API}/api/admin/enquiries/${id}`, { method: "DELETE" });
  loadEnquiries();
}

loadEnquiries();
