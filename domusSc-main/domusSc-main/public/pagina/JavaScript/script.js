import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



// --- COLE SUAS CHAVES AQUI (IGUAL VOCÊ FEZ NO CADASTRO) ---

const firebaseConfig = {

    apiKey: "AIzaSyBWNqPRVksBMahDk-yR9p8hUMOxkZSYq6Y",

    authDomain: "domus-f0f1e.firebaseapp.com",

    projectId: "domus-f0f1e",

    storageBucket: "domus-f0f1e.firebasestorage.app",

    messagingSenderId: "596298855370",

    appId: "1:596298855370:web:b61e8ddb93258323aa5533",

};



// INICIALIZAÇÃO

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const IMAGE_BASE_URL = "http://localhost:3000/uploads";



console.log(" Script da Home carregado com Firebase!");



// --- ELEMENTOS DO HTML ---

const botaoCadastro = document.getElementById("botaoCadastro");

const centralConta = document.getElementById("centralConta");

const botaoConta = document.getElementById("botaoConta");

const menuConta = document.getElementById("menuConta");

const btnVerPerfil = document.getElementById("verPerfil");

const btnSair = document.getElementById("sairConta");

const cardsContainer = document.querySelector(".cards");



// 1. VERIFICAR SE TEM ALGUÉM LOGADO

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(" Usuário conectado:", user.email);



        // Esconde botão "Entrar/Cadastro"

        if (botaoCadastro) {

            botaoCadastro.style.display = 'none'; // Forçando esconder via CSS inline

        }



        // Mostra o ícone da conta (engrenagem)

        if (centralConta) {

            centralConta.classList.remove("hidden");

            centralConta.style.display = 'block'; // Forçando mostrar

        }

    } else {

        console.log("❌ Ninguém logado.");

        if (botaoCadastro) botaoCadastro.style.display = 'block';

        if (centralConta) centralConta.classList.add("hidden");

    }

});



// 2. MENU DA CONTA (ABRIR/FECHAR)

if (botaoConta) {

    botaoConta.addEventListener("click", (e) => {

        e.stopPropagation(); // Não deixa o clique passar

        // Toggle manual para garantir

        if (menuConta.classList.contains("hidden")) {

            menuConta.classList.remove("hidden");

            menuConta.style.display = "block";

        } else {

            menuConta.classList.add("hidden");

            menuConta.style.display = "none";

        }

    });

}



// Fechar menu ao clicar fora

window.addEventListener("click", (e) => {

    if (menuConta && !menuConta.classList.contains("hidden")) {

        menuConta.classList.add("hidden");

        menuConta.style.display = "none";

    }

});



// Botão "Ver Perfil"

if (btnVerPerfil) {

    btnVerPerfil.addEventListener("click", () => {

        window.location.href = "perfilOn.html";

    });

}



// Botão Sair

if (btnSair) {

    btnSair.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("Você saiu da conta.");

            window.location.reload();

        } catch (err) {

            console.error(err);

        }

    });

}



const cardImages = document.querySelectorAll(".card img");



// ==============================

// ANIMAÇÃO DE FUNDO (bannerIntermediario)

// ==============================

// ==============================
// ANIMAÇÃO DE FUNDO (bannerIntermediario)
// ==============================
const banner = document.querySelector("#bannerIntermediario"); 

if (banner) { 
    const imagensPromocionais = [

        // Corrigido para Caminho Absoluto a partir da raiz (public)

        "/pagina/imageFIGURE/A beleza feminina.jfif",

        "/pagina/imageFIGURE/A violinista.jfif",

        "/pagina/imageFIGURE/Passeio na chuva.jfif",



        "/pagina/imageFIGURE/banner_artista.png",

        "/pagina/imageFIGURE/banner_artista1.png",

        "/pagina/imageFIGURE/bannerFundoART.png",

        "/pagina/imageFIGURE/cachoeira.png",

        "/pagina/imageFIGURE/coruja.png",

        "/pagina/imageFIGURE/grariaAzul.png",

        "/pagina/imageFIGURE/LogoDomus-sc.png",



        "/pagina/imageFIGURE/bannerArtista.webp",

        "/pagina/imageFIGURE/bannerArtista1.webp",

        "/pagina/imageFIGURE/bannerFundoART.webp",

        "/pagina/imageFIGURE/cachoeira0.webp",

        "/pagina/imageFIGURE/floripa.webp",

        "/pagina/imageFIGURE/florianopolis-mercado-publico.webp",

        "/pagina/imageFIGURE/fundo_verde.webp",

        "/pagina/imageFIGURE/grariaAzul.webp",

        "/pagina/imageFIGURE/LogoDomus-sc.webp",

        "/pagina/imageFIGURE/perfil1.webp",

        "/pagina/imageFIGURE/ponte-hercilio-luz-florianopolis.webp",



        "/pagina/imageFIGURE/flores.jpeg",

        "/pagina/imageFIGURE/fotoart1.jpeg",

        "/pagina/imageFIGURE/fotoart2.jpeg",

        "/pagina/imageFIGURE/fotoart3.jpeg",

        "/pagina/imageFIGURE/fotoart4.jpeg",

        "/pagina/imageFIGURE/fotoart5.jpeg",

        "/pagina/imageFIGURE/fotoart6.jpeg",

        "/pagina/imageFIGURE/fotoart7.jpeg",

        "/pagina/imageFIGURE/fotoart8.jpeg",

        "/pagina/imageFIGURE/fotoart9.jpeg",

        "/pagina/imageFIGURE/fundo_verde.jpeg",

        "/pagina/imageFIGURE/paisagem.jpeg",

        "/pagina/imageFIGURE/perfil.jpeg",

        "/pagina/imageFIGURE/violino_com_fruteira.jpeg"

    ];

    
    // ... restante da função criarImagemPromocional e setInterval ...
}

    

    function criarImagemPromocional() {

        const img = document.createElement("img");

        img.src =

            imagensPromocionais[

            Math.floor(Math.random() * imagensPromocionais.length)

            ];

        img.classList.add("promocao-imagem");



        img.style.left = `${Math.random() * 90}%`;

        const tamanho = 80 + Math.random() * 100;

        img.style.width = `${tamanho}px`;



        banner.appendChild(img);

        setTimeout(() => img.remove(), 10000);

    }



    setInterval(criarImagemPromocional, 2000);

 // Esta é a chave de fechamento correta para o if (banner)



// ==============================

// INTERAÇÃO VISUAL DO BANNER

// ==============================

const botao = document.getElementById("botaoPromocao");

const texto = banner?.querySelector("h2"); // 'banner' agora está definido



if (banner && botao && texto) {

    const cores = ["#3c4dcf", "#4e5df5", "#2b379a"];

    let indice = 0;



    setInterval(() => {

        indice = (indice + 1) % cores.length;

        banner.style.background = `linear-gradient(135deg, ${cores[indice]}, ${cores[(indice + 1) % cores.length]})`;

    }, 5000);



    banner.addEventListener("mouseenter", () => {

        texto.style.transform = "scale(1.05)";

        texto.style.transition = "transform 0.4s ease";

    });



    banner.addEventListener("mouseleave", () => {

        texto.style.transform = "scale(1)";

    });



    botao.addEventListener("click", () => {

        alert("Explore o Domus SC e descubra o melhor da arte catarinense!");

    });

}



// ==============================

// ANIMAÇÃO DE ENTRADA DOS CARDS

// ==============================

window.addEventListener("load", () => {

    cardImages.forEach((img, i) => {

        img.style.opacity = 0;

        img.style.transform = "translateY(20px)";

        setTimeout(() => {

            img.style.transition = "all 0.6s ease";

            img.style.opacity = 1;

            img.style.transform = "translateY(0)";

        }, i * 150);

    });

});



// ==============================

// EFEITO DE HOVER NAS IMAGENS

// ==============================

cardImages.forEach((img) => {

    img.addEventListener("mouseenter", () => {

        img.style.transform = "scale(1.05)";

        img.style.transition = "transform 0.3s ease";

        img.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";

    });



    img.addEventListener("mouseleave", () => {

        img.style.transform = "scale(1)";

        img.style.boxShadow = "none";

    });

});



// 3. CARREGAR OBRAS DO BANCO

async function carregarObras() {

    if (!cardsContainer) return;

    try {

        const querySnapshot = await getDocs(collection(db, "artworks"));



        if (!querySnapshot.empty) cardsContainer.innerHTML = "";



        querySnapshot.forEach((doc) => {

            const obra = doc.data();

            const urlImagem = `${IMAGE_BASE_URL}/${obra.filename}`;



            const card = document.createElement("article");

            card.className = "card";

            card.innerHTML = `

                <img src="${urlImagem}" alt="${obra.title}" style="cursor:pointer" onclick="abrirZoom('${urlImagem}', '${obra.title}')">

                <div class="card-content">

                    <h4>${obra.title}</h4>

                    <p>${obra.description || ""}</p>

                </div>

            `;

            cardsContainer.appendChild(card);

        });

    } catch (e) {

        console.error("Erro ao buscar obras:", e);

    }

}



// Zoom Global

window.abrirZoom = (src, title) => {

    const modal = document.getElementById("modal");

    const imgAmpliada = document.getElementById("imgAmpliada");

    const caption = document.getElementById("caption");



    if (modal && imgAmpliada) {

        modal.style.display = "block";

        imgAmpliada.src = src;

        if (caption) caption.textContent = title;

    }

}



// Botão fechar do modal

const fecharModal = document.querySelector(".fechar");

if (fecharModal) {

    fecharModal.onclick = () => document.getElementById("modal").style.display = "none";

}



document.addEventListener("DOMContentLoaded", carregarObras);