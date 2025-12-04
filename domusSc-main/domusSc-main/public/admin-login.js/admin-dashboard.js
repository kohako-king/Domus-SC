// Protege a rota no front-end
if (localStorage.getItem('isAdmin') !== 'true') {
  window.location.href = '/admin/login.html';
}

// Mock: inicializa dados de demo se não existirem
if (!localStorage.getItem('obras')) {
  const demoObras = [
    { id: 1, title: "Rosa", artist: "João", description: "Óleo sobre tela" },
    { id: 2, title: "Mar", artist: "Maria", description: "Aquarela" }
  ];
  localStorage.setItem('obras', JSON.stringify(demoObras));
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminEmail');
  window.location.href = '/';
});

// UTIL: renderiza listas
function renderUsers(){
  const container = document.getElementById('usersList');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  container.innerHTML = '';
  users.forEach(u => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="info"><strong>${u.name}</strong><br>${u.email}</div>
      <div class="actions">
        <button class="edit" data-id="${u.id}">Editar</button>
        <button class="del" data-id="${u.id}">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderObras(){
  const container = document.getElementById('obrasList');
  const obras = JSON.parse(localStorage.getItem('obras') || '[]');
  container.innerHTML = '';
  obras.forEach(o => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="info"><strong>${o.title}</strong> - ${o.artist}<br>${o.description}</div>
      <div class="actions">
        <button class="edit" data-id="${o.id}">Editar</button>
        <button class="del" data-id="${o.id}">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Eventos delegados para ações de editar/excluir
document.addEventListener('click', (ev) => {
  if (ev.target.matches('#usersList .del')) {
    const id = Number(ev.target.dataset.id);
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
  } else if (ev.target.matches('#obrasList .del')) {
    const id = Number(ev.target.dataset.id);
    let obras = JSON.parse(localStorage.getItem('obras') || '[]');
    obras = obras.filter(o => o.id !== id);
    localStorage.setItem('obras', JSON.stringify(obras));
    renderObras();
  } else if (ev.target.matches('.edit')) {
    const id = Number(ev.target.dataset.id);
    // Simples prompt para editar (você pode substituir por modal / formulário)
    if (ev.target.closest('#usersList')) {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === id);
      const newName = prompt('Novo nome:', user.name);
      if (newName !== null) {
        user.name = newName;
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers();
      }
    } else {
      let obras = JSON.parse(localStorage.getItem('obras') || '[]');
      const obra = obras.find(o => o.id === id);
      const newTitle = prompt('Novo título:', obra.title);
      if (newTitle !== null) {
        obra.title = newTitle;
        localStorage.setItem('obras', JSON.stringify(obras));
        renderObras();
      }
    }
  }
});

// inicialização
renderUsers();
renderObras();
