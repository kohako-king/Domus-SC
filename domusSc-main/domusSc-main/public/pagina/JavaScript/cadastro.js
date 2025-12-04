 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBWNqPRVksBMahDk-yR9p8hUMOxkZSYq6Y",
      authDomain: "domus-f0f1e.firebaseapp.com",
      projectId: "domus-f0f1e",
      storageBucket: "domus-f0f1e.firebasestorage.app",
      messagingSenderId: "596298855370",
      appId: "1:596298855370:web:b61e8ddb93258323aa5533",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const API_URL = "http://localhost:3000/upload-obra";

    const radios = document.querySelectorAll('input[name="mode"]');
    const passGroup2 = document.getElementById("passwordGroup2");
    const artistToggle = document.getElementById("artistToggle");
    const artistFields = document.getElementById("artistFields");
    const isArtist = document.getElementById("isArtist");
    const btnSubmit = document.getElementById("btnSubmit");
    const msg = document.getElementById("msg");

    function toggleArtistFields(show) {
      if (show) {
        artistFields.classList.add("visible");
        artistFields.classList.remove("hidden");
        document.querySelector('.boxlogin')?.classList.add('artista-ativo');
      } else {
        artistFields.classList.remove("visible");
        artistFields.classList.add("hidden");
        document.querySelector('.boxlogin')?.classList.remove('artista-ativo');
      }
    }

    radios.forEach(r => {
      r.addEventListener("change", e => {
        if (e.target.value === "cadastro") {
          passGroup2.classList.remove("hidden");
          artistToggle.classList.remove("hidden");
          btnSubmit.textContent = "Cadastrar";
          toggleArtistFields(isArtist.checked);
        } else {
          passGroup2.classList.add("hidden");
          artistToggle.classList.add("hidden");
          toggleArtistFields(false);
          isArtist.checked = false;
          btnSubmit.textContent = "Entrar";
        }
      });
    });

    isArtist.addEventListener("change", e => {
      toggleArtistFields(e.target.checked);
    });

    // ... (Linhas 115-129: Função isArtist.addEventListener)

    document.getElementById("authForm").addEventListener("submit", async e => {

      e.preventDefault();

      msg.textContent = "Carregando...";



      const mode = document.querySelector('input[name="mode"]:checked').value;

      const email = document.getElementById("email").value;

      const pass = document.getElementById("password").value;



      try {

        if (mode === "login") {

          await signInWithEmailAndPassword(auth, email, pass);

          window.location.href = "index.html";

        } else {

          const confirmPass = document.getElementById("confirmPassword").value;

          if (pass !== confirmPass) {

            msg.textContent = "Senhas não conferem";

            return;

          }



          const cred = await createUserWithEmailAndPassword(auth, email, pass);

          const user = cred.user;



          // === INÍCIO DAS VARIÁVEIS QUE ESTAVAM FALTANDO ===

          const isUserArtist = isArtist.checked; // Define se o checkbox está marcado



          // Coleta os valores dos campos. O '|| ""' garante que a variável tenha um valor.

          // O nome recebe "Visitante" se não for artista E o campo estiver vazio.

          const nomeValue = document.getElementById("nome").value.trim() || (isUserArtist ? "" : "Visitante");

          const sobrenomeValue = document.getElementById("sobrenome").value.trim() || "";

          const idadeValue = document.getElementById("idade").value.trim() || null;

          const descricaoValue = document.getElementById("descricao").value.trim() || "";

          const telefoneValue = document.getElementById("telefone").value.trim() || null;

          // === FIM DAS VARIÁVEIS QUE ESTAVAM FALTANDO ===



          let dados = {

            uid: user.uid,

            email,

            tipo: isUserArtist ? "artista" : "visitante", // Usa a nova variável

            createdAt: new Date().toISOString(),

            nome: nomeValue, // Usa a nova variável

            sobrenome: sobrenomeValue, // Usa a nova variável

            idade: idadeValue, // Usa a nova variável

            descricao: descricaoValue, // Usa a nova variável

            telefone: telefoneValue, // Usa a nova variável

          };



          if (isArtist.checked) {

            // Se for artista, os dados já foram coletados acima.

            // O bloco abaixo é redundante, mas faremos a verificação para o upload.

            // Note que se você não for artista, a foto NÃO será enviada.



            const fileInput = document.getElementById("foto");

            if (fileInput.files.length > 0) {

              msg.textContent = "Carregando foto...";

              const formData = new FormData();

              formData.append("imagem", fileInput.files[0]);



              const res = await fetch(API_URL, { method: "POST", body: formData });



              if (res.ok) {

                const json = await res.json();

                dados.imagem_perfil_url = json.url;

              }

            }



          }



          await setDoc(doc(db, "users", user.uid), dados);

          alert("Cadastro realizado!");

          window.location.href = "index.html";

        }

      } catch (err) {

        console.error(err);

        msg.textContent = "Erro: " + err.message;

      }

    });