async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!email || !password) {
    msg.innerText = "Fill all fields";
    return;
  }

  const res = await fetch(
    "https://bais-logistics-website.onrender.com/api/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }
  );

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    msg.innerText = "Login failed";
  }
}
