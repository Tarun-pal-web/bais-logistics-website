function registerUser(){
  const user = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value.trim();

  if(!user || !pass){
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("user", user);
  localStorage.setItem("pass", pass);

  alert("Registration successful");
  window.location.href = "login.html";
}
