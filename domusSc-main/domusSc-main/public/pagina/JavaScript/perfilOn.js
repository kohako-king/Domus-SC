// JavaScript/perfilOn.js

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



// IMPORTAÇÕES DO STORAGE

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";



// --- CONFIGURAÇÃO (USE AS MESMAS CHAVES) ---

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

const storage = getStorage(app);



// CONFIGURAÇÕES DO SERVIDOR NODE.JS (Mantidas para a funcionalidade de Obras)

const API_UPLOAD = "http://localhost:3000/upload-obra";

const IMAGE_BASE_URL = "http://localhost:3000/uploads";



console.log("🛠️ Script de Perfil ON (Edição) Carregado!");



// Elementos de Formulário (Novos)

const formEdicaoPerfil = document.getElementById("formEdicaoPerfil");

const inputNome = document.getElementById("inputNome");

const inputSobrenome = document.getElementById("inputSobrenome");

const inputBio = document.getElementById("inputBio");

const inputTelefone = document.getElementById("inputTelefone");

const emailDisplay = document.getElementById("emailDisplay");

const tipoDisplay = document.getElementById("tipoDisplay");

const msgEdicao = document.getElementById("msgEdicao");



// Elementos de Mídia

const fotoPerfil = document.getElementById("fotoPerfil");

const inputFotoPerfil = document.getElementById("inputFotoPerfil");

const btnAdd = document.getElementById("btnAdicionarObra");

const inputImagem = document.getElementById("inputImagem");

const listaObras = document.getElementById("listaObras");



// Variável para armazenar o UID do usuário logado

let currentUid = null;



// Esconde o botão de adicionar obra por padrão

if (btnAdd) {

    btnAdd.style.display = "none";

}



// ==========================================================

// 1. DETECÇÃO DE USUÁRIO E CARREGAMENTO DE DADOS NOS CAMPOS

// ==========================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        alert("Você precisa fazer login para editar seu perfil!");

        window.location.href = "cadastro.html";

        return;

    }



    currentUid = user.uid; // Salva o UID



    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);



    if (docSnap.exists()) {

        const data = docSnap.data();



        // Preenche os campos do Formulário

        if (inputNome) inputNome.value = data.nome || "";

        if (inputSobrenome) inputSobrenome.value = data.sobrenome || "";

        if (inputBio) inputBio.value = data.descricao || "";

        if (inputTelefone) inputTelefone.value = data.telefone || "";



        // Preenche os campos de referência

        if (emailDisplay) emailDisplay.textContent = `Email: ${data.email || ''}`;

        if (tipoDisplay) tipoDisplay.textContent = `Tipo: ${data.tipo === "artista" ? "Artista" : "Visitante"}`;



        // Carrega a foto de perfil

        if (fotoPerfil) {

            if (data.imagem_perfil_url) {

                fotoPerfil.src = data.imagem_perfil_url;

            } else if (data.imagem_perfil_filename) {

                // Fallback para o sistema Node.js, se necessário

                fotoPerfil.src = `${IMAGE_BASE_URL}/${data.imagem_perfil_filename}`;

            } else {

                fotoPerfil.src = "/imageFIGURE/default_profile.png"; // Use uma imagem padrão real

            }

        }



        // Só permite edição de mídia se for artista

        if (data.tipo === "artista") {

            if (btnAdd) btnAdd.style.display = "inline-block";

            if (fotoPerfil) {

                fotoPerfil.style.cursor = "pointer";

                fotoPerfil.onclick = () => inputFotoPerfil.click();

            }

        } else {

            // Para visitantes, desativa a edição de foto e o botão de obra

            if (fotoPerfil) fotoPerfil.style.cursor = "default";

            if (btnAdd) btnAdd.style.display = "none";

        }



        carregarMinhasObras(user.uid);

    } else {

        alert("Dados de perfil não encontrados. Redirecionando para o login.");

        auth.signOut();

        window.location.href = "cadastro.html";

    }

});



// ==========================================================

// 2. SALVAR DADOS DO PERFIL NO FIRESTORE

// ==========================================================

if (formEdicaoPerfil) {

    formEdicaoPerfil.addEventListener("submit", async (e) => {

        e.preventDefault();

        msgEdicao.textContent = "Salvando...";



        if (!currentUid) {

            msgEdicao.textContent = "Erro: Usuário não autenticado.";

            return;

        }



        const dadosAtualizados = {

            nome: inputNome.value.trim(),

            sobrenome: inputSobrenome.value.trim(),

            descricao: inputBio.value.trim(),

            telefone: inputTelefone.value.trim() || null,

            updatedAt: new Date().toISOString()

        };



        try {

            const userDocRef = doc(db, "users", currentUid);

            await updateDoc(userDocRef, dadosAtualizados);



            msgEdicao.textContent = "Perfil atualizado com sucesso!";

            msgEdicao.style.color = "green";

            // Opcional: Recarrega as informações (ou apenas a página)

            setTimeout(() => {

                msgEdicao.textContent = "";

            }, 3000);



        } catch (error) {

            console.error("Erro ao salvar perfil:", error);

            msgEdicao.textContent = "Erro ao salvar: " + error.message;

            msgEdicao.style.color = "red";

        }

    });

}





// ==========================================================

// 3. LÓGICA DE TROCAR FOTO (Reutilizada do script anterior)

// ==========================================================



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

        alert("Erro ao carregar a foto no Firebase Storage.");

        return null;

    }

}





if (inputFotoPerfil) {

    inputFotoPerfil.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file || !currentUid) return;



        msgEdicao.textContent = "Carregando nova foto...";

        msgEdicao.style.color = "blue";

        const uploadResult = await uploadImageToFirebaseStorage(file, currentUid);



        if (uploadResult) {

            await updateDoc(doc(db, "users", currentUid), {

                imagem_perfil_url: uploadResult.url,

                imagem_perfil_filename: uploadResult.filename,

            });



            fotoPerfil.src = uploadResult.url;

            msgEdicao.textContent = "Foto de perfil atualizada com sucesso!";

            msgEdicao.style.color = "green";

        } else {

            msgEdicao.textContent = "Falha ao atualizar a foto.";

            msgEdicao.style.color = "red";

        }

        setTimeout(() => {

            msgEdicao.textContent = "";

        }, 3000);

    });

}



// ==========================================================

// 4. LÓGICA DE ADICIONAR OBRA (Reutilizada)

// ==========================================================

if (btnAdd) {

    btnAdd.addEventListener("click", () => inputImagem.click());

}



if (inputImagem) {

    inputImagem.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file || !currentUid) return;



        const titulo = prompt("Título da Obra:");

        if (!titulo) return;

        const desc = prompt("Descrição:");



        const nome = await enviarImagemNode(file);

        if (nome) {

            await addDoc(collection(db, "artworks"), {

                artistUid: currentUid,

                filename: nome,

                title: titulo,

                description: desc || "",

                createdAt: new Date().toISOString(),

            });

            alert("Obra cadastrada!");

            carregarMinhasObras(currentUid);

        }

    });

}



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



async function carregarMinhasObras(uid) {

    if (!listaObras) return;

    listaObras.innerHTML = "Carregando obras...";

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

        div.innerHTML = `<img src="${IMAGE_BASE_URL}/${obra.filename}" alt="${obra.title}"><h4>${obra.title}</h4>`;

        listaObras.appendChild(div);

    });

}