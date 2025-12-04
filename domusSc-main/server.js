// server.js

import express from "express";

import cors from "cors";

import path from "path";

import multer from "multer";

import fs from "fs";

import { fileURLToPath } from "url";



// Configuração para ES Modules (para substituir __dirname)

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



const app = express();

const PORT = 3000;



// 1. Configurar CORS (Permite que o Front acesse o Back)

app.use(

  cors({

    origin: [

      "http://127.0.0.1:5500",

      "http://localhost:5500",

      "http://127.0.0.1:5501",

      "http://localhost:5501",

    ],

    credentials: true,

  })

);



app.use(express.json());



// 2. Criar pasta de uploads se não existir

const uploadDir = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadDir)) {

  console.log("📂 Criando pasta public/uploads...");

  fs.mkdirSync(uploadDir, { recursive: true });

}



// 3. Servir as imagens estáticas

// O prefixo '/uploads' no URL é mapeado para a pasta 'uploadDir'

app.use("/uploads", express.static(uploadDir));



// 4. Configurar Multer (Salvamento do arquivo)

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadDir);

  },

  filename: (req, file, cb) => {

    // Nome único: timestamp + numero random + extensão original

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, uniqueSuffix + ext);

  },

});



const upload = multer({ storage: storage });





// 5. Rota de Upload CORRIGIDA

app.post("/upload-obra", upload.single("imagem"), (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({ error: "Nenhum arquivo enviado." });

    }



    console.log(`📸 Imagem recebida: ${req.file.filename}`);



    // CORREÇÃO: Resposta JSON movida para dentro da função de rota

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;



    res.status(200).json({

      message: "Upload realizado com sucesso!",

      fileName: req.file.filename,

      filePath: req.file.path, // Caminho completo no servidor

      url: fileUrl // URL pública para acesso pelo navegador/frontend

    });

  } catch (error) {

    console.error("Erro no upload:", error);

    res.status(500).json({ error: "Erro interno no servidor." });

  }

});



// 6. Rota de Teste

app.get("/", (req, res) => {

  res.send("API Domus SC rodando perfeitamente!");

});



app.listen(PORT, () => {

  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);

  console.log(`📂 Pasta de imagens configurada em: ${uploadDir}`);

});