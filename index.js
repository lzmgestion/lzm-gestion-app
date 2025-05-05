
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if ((user === "admin" && pass === "1234") || (user === "tecnico" && pass === "abcd")) {
      alert("Ingreso exitoso");
      localStorage.setItem("userRole", user === "admin" ? "admin" : "tecnico");
      window.location.href = "index.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });
});
