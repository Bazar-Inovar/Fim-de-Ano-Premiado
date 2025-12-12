import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtk0iopRxmAr89DLn6gHBnqnVtKDBIM-k",
    authDomain: "sorteio-inovar.firebaseapp.com",
    databaseURL: "https://sorteio-inovar-default-rtdb.firebaseio.com",
    projectId: "sorteio-inovar",
    storageBucket: "sorteio-inovar.firebasestorage.app",
    messagingSenderId: "1023153056854",
    appId: "1:1023153056854:web:13f285abe2d00e87ad9ff7",
    measurementId: "G-C9KSKFGCHC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let botao = document.querySelector('#botao-buscar')
botao.addEventListener('click', buscarNumeros)

let verificador = document.querySelector('#verificador')

async function buscarNumeros() {
    const telefone = document.getElementById("telefone").value.trim();
    const resultadoDiv = document.getElementById("resultado");

    resultadoDiv.innerHTML = ""; 

    if (telefone === "") {
        resultadoDiv.innerHTML = "<p style='color:red'>Por favor, insira seu número de telefone.</p>";
        return;
    }
    else if (telefone.length !== 11  ){
        resultadoDiv.innerHTML = "<p style='color:red'>Insira um número de telefone válido.</p>";
        return;
    }

    const dbRef = ref(db);
    const sorteioRef = child(dbRef, "sorteio");

    try {
        const snapshot = await get(sorteioRef);

        if (!snapshot.exists()) {
            resultadoDiv.innerHTML = "<p>Nenhum dado encontrado.</p>";
            return;
        }

        const dados = snapshot.val();
        let registros = [];

        Object.keys(dados).forEach(numero => {
            const item = dados[numero];

            if (item.numeroCliente === telefone) {
                registros.push({
                    numero: numero,
                    nome: item.nome
                });
            }
        });

        if (registros.length === 0) {
            resultadoDiv.innerHTML = "<p style='color:red'>Nenhum número encontrado para esse telefone.</p>";
            return;
        }

        let tabela = `
            <table>
                <tr>
                    <th>Número</th>
                    <th>Nome</th>
                </tr>
        `;

        registros.forEach(item => {
            tabela += `
                <tr class="tabela">
                    <td style="text-align:center;">${item.numero}</td>
                    <td>${item.nome}</td>
                </tr>
            `;
        });

        tabela += `</table>`;

        resultadoDiv.innerHTML = tabela;

        verificador.style.height = '100%'

    } catch (error) {
        console.error(error);
        resultadoDiv.innerHTML = "<p style='color:red'>Ocorreu um erro ao buscar seus números.</p>";
    }
}

function criarNeve() {
    const floco = document.createElement("div");
    floco.classList.add("floco");
    floco.innerHTML = "❄";

    floco.style.left = Math.random() * window.innerWidth + "px";
    floco.style.fontSize = (10 + Math.random() * 20) + "px";
    floco.style.opacity = Math.random();
    floco.style.animationDuration = (4 + Math.random() * 6) + "s";

    document.getElementById("neve").appendChild(floco);

    setTimeout(() => floco.remove(), 10000);
}

setInterval(criarNeve, 150);
