const form = document.getElementById("adminForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmPasswordError");
const successMessage = document.getElementById("successMessage");

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";
  confirmError.textContent = "";
  successMessage.classList.add("hidden");

  let valid = true;

  if (!validateEmail(emailInput.value)) {
    emailError.textContent = "Email inválido.";
    valid = false;
  }

  if (passwordInput.value.length < 6) {
    passwordError.textContent = "A senha deve ter pelo menos 6 caracteres.";
    valid = false;
  }

  if (passwordInput.value !== confirmInput.value) {
    confirmError.textContent = "As senhas não coincidem.";
    valid = false;
  }

  if (!valid) return;

  const body = {
    email: emailInput.value,
    senha: passwordInput.value
  };

  try {
    const resp = await fetch("http://localhost:3000/cadastrarAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await resp.text();

    if (resp.ok) {
      successMessage.textContent = "Administrador criado com sucesso!";
      successMessage.classList.remove("hidden");
      form.reset();
    } else {
      emailError.textContent = text || "Erro ao criar administrador.";
    }

  } catch (err) {
    console.error(err);
    emailError.textContent = "Erro ao conectar ao servidor.";
  }
});
