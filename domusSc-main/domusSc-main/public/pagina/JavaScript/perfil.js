// JavaScript/perfil.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// IMPORTAÇÕES NECESSÁRIAS DO STORAGE (para quando o usuário alterar a foto)
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// --- CONFIGURAÇÃO ---
const firebaseConfig = {
  apiKey: "AIzaSyBWNqPRVksBMahDk-yR9p8hUMOxkZSYq6Y",
  authDomain: "domus-f0f1e.firebaseapp.com",
  projectId: "domus-f0f1e",
  // Usamos o appspot.com para referenciar o bucket de forma genérica
  storageBucket: "domus-f0f1e.appspot.com",
  messagingSenderId: "596298855370",
  appId: "1:596298855370:web:b61e8ddb93258323aa5533"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializando o Storage

// CONFIGURAÇÕES DO SERVIDOR NODE.JS (Mantidas para a funcionalidade de Obras)
const API_UPLOAD = "http://localhost:3000/upload-obra";
const IMAGE_BASE_URL = "http://localhost:3000/uploads";

console.log("🔥 Script de Perfil Carregado!");

// Elementos
const nomeArt = document.getElementById("nome_ART");
const bioP = document.getElementById("BIO");
const specialP = document.getElementById("Special");
const fotoPerfil = document.getElementById("fotoPerfil");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const btnAdd = document.getElementById("btnAdicionarObra");
const inputImagem = document.getElementById("inputImagem");
const listaObras = document.getElementById("listaObras");

// Esconde o botão de adicionar obra por padrão se ele existir
if (btnAdd) {
  btnAdd.style.display = "none";
}

// ==========================================================
// 1. LÓGICA DE DETECÇÃO DE USUÁRIO E CARREGAMENTO DE DADOS
// ==========================================================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Você precisa fazer login para ver esta página!");
    window.location.href = "cadastro.html";
    return;
  }

  // Pega o UID do usuário logado e busca o documento no Firestore
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // Preenche os campos de Nome, Tipo e Descrição
    if (nomeArt) nomeArt.textContent = `${data.nome || 'Usuário'} ${data.sobrenome || ''}`;
    if (bioP) bioP.textContent = data.descricao || "Sem biografia cadastrada.";
    if (specialP)
      specialP.textContent = data.tipo === "artista" ? "Artista" : "Visitante";

    // Carrega a foto de perfil
    if (fotoPerfil) {
      // Prioriza a URL do Firebase Storage (melhor prática)
      if (data.imagem_perfil_url) {
        fotoPerfil.src = data.imagem_perfil_url;
        // Caso o usuário tenha cadastrado a foto via o sistema Node.js anterior (fallback)
      } else if (data.imagem_perfil_filename) {
        fotoPerfil.src = `${IMAGE_BASE_URL}/${data.imagem_perfil_filename}`;
      } else {
        // Foto de perfil padrão se não houver nenhuma
        fotoPerfil.src = "caminho/para/imagem/padrao.png";
      }
    }

    // Se for artista
    if (data.tipo === "artista") {
      // Permite adicionar obras
      if (btnAdd) {
        btnAdd.style.display = "inline-block";
        btnAdd.classList.remove("hidden");
      }
      // Permite alterar a foto
      if (fotoPerfil) {
        fotoPerfil.style.cursor = "pointer";
        fotoPerfil.onclick = () => inputFotoPerfil.click();
      }
    } else {
      // Se for visitante, desativa a edição de foto e o botão de obra
      if (fotoPerfil) fotoPerfil.style.cursor = "default";
      if (btnAdd) btnAdd.style.display = "none";
    }

    carregarMinhasObras(user.uid);
  } else {
    // Se o documento no Firestore não existir (apenas Auth), redireciona para o cadastro
    alert("Dados de perfil não encontrados. Por favor, complete seu cadastro.");
    // Opcional: Redirecionar para uma página de complemento de cadastro
    // window.location.href = "complemento_cadastro.html";
    auth.signOut(); // Desloga o usuário
    window.location.href = "cadastro.html";
  }
});


// ==========================================================
// 2. LÓGICA DE TROCAR FOTO (Corrigida para usar Firebase Storage)
// ==========================================================

// Função de upload para Firebase Storage (Duplicada para auto-suficiência do perfil.js)
async function uploadImageToFirebaseStorage(file, userId) {
  const fileName = `profile_${Date.now()}_${file.name}`;
  const storagePath = `users/${userId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, filename: fileName };
  } catch (error) {
    console.error("Erro no upload para o Firebase Storage:", error);
    alert("Erro ao carregar a foto no Firebase Storage. Verifique as regras de segurança.");
    return null;
  }
}


if (inputFotoPerfil) {
  inputFotoPerfil.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // NOVO: Usando Firebase Storage para atualização de foto
    const uid = auth.currentUser.uid;
    const uploadResult = await uploadImageToFirebaseStorage(file, uid);

    if (uploadResult) {
      await updateDoc(doc(db, "users", uid), {
        // Atualiza ambos os campos no Firestore
        imagem_perfil_url: uploadResult.url,
        imagem_perfil_filename: uploadResult.filename,
      });

      // Atualiza a imagem na tela
      fotoPerfil.src = uploadResult.url;
      alert("Foto de perfil atualizada com sucesso!");
    }
  });
}

// ==========================================================
// 3. ADICIONAR OBRA (Mantida a lógica de Node.js/IMAGE_BASE_URL)
// ==========================================================
if (btnAdd) {
  btnAdd.addEventListener("click", () => inputImagem.click());
}

if (inputImagem) {
  inputImagem.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const titulo = prompt("Título da Obra:");
    if (!titulo) return;
    const desc = prompt("Descrição:");

    // Usa a função de upload para o servidor Node.js
    const nome = await enviarImagemNode(file);
    if (nome) {
      await addDoc(collection(db, "artworks"), {
        artistUid: auth.currentUser.uid,
        filename: nome, // Salva o nome do arquivo para o sistema Node.js
        title: titulo,
        description: desc || "",
        createdAt: new Date().toISOString(),
      });
      alert("Obra cadastrada!");
      carregarMinhasObras(auth.currentUser.uid);
    }
  });
}

// Função de upload para o Servidor Node.js (Mantida)
async function enviarImagemNode(file) {
  const formData = new FormData();
  formData.append("imagem", file);
  try {
    const res = await fetch(API_UPLOAD, { method: "POST", body: formData });
    const json = await res.json();
    return json.fileName;
  } catch (err) {
    console.error(err);
    alert("Erro no upload. O servidor Node (tela preta) está rodando?");
    return null;
  }
}

// Função de carregar Obras (Mantida)
async function carregarMinhasObras(uid) {
  if (!listaObras) return;
  listaObras.innerHTML = "Carregando...";
  const q = query(collection(db, "artworks"), where("artistUid", "==", uid));
  const snap = await getDocs(q);

  listaObras.innerHTML = "";
  if (snap.empty) {
    listaObras.innerHTML = "<p>Nenhuma obra cadastrada.</p>";
    return;
  }

  snap.forEach((doc) => {
    const obra = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    // Usa o IMAGE_BASE_URL do Node.js
    div.innerHTML = `<img src="${IMAGE_BASE_URL}/${obra.filename}" alt="${obra.title}"><h4>${obra.title}</h4>`;
    listaObras.appendChild(div);
  });
}