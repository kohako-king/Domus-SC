// LISTA FIXA DE E-MAILS AUTORIZADOS (editar aqui)
const AUTHORIZED_ADMINS = [
  "admin1@exemplo.com",
  "admin2@exemplo.com",
  "seu.email@dominio.com"
];

// Para cada admin na lista, você pode definir uma senha simples (demo)
const ADMIN_PASSWORDS = {
  "admin1@exemplo.com": "senha123",
  "admin2@exemplo.com": "senha456",
  "seu.email@dominio.com": "minhasenha"
};

const form = document.getElementById('adminLoginForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const email = document.getElementById('admEmail').value.trim();
  const pass = document.getElementById('admPass').value;

  if (!AUTHORIZED_ADMINS.includes(email)) {
    msg.textContent = 'E-mail não autorizado.';
    return;
  }
  if (ADMIN_PASSWORDS[email] !== pass) {
    msg.textContent = 'Senha incorreta.';
    return;
  }

  // login bem-sucedido: marca sessão de admin no localStorage
  localStorage.setItem('isAdmin', 'true');
  localStorage.setItem('adminEmail', email);
  window.location.href = '/admin/dashboard.html';
});
