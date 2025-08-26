import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const form = document.getElementById("formNovaTarefa");
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = form.titulo.value;
    const conteudo = form.conteudo.value;
    const data = form.data.value;

    // Enviar dados para o Firestore
    const db = getFirestore(app);
    addDoc(collection(db, "tarefas"), {
        titulo,
        conteudo,
        data
    })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erro ao cadastrar tarefa:", error);
        });
});

function listarTarefas() {
    const db = getFirestore(app);
    const tarefasRef = collection(db, "tarefas");

    // Limpar main existente
    const main = document.querySelector("main");
    main.innerHTML = "";

    // Obter tarefas do Firestore
    getDocs(tarefasRef)
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const id = doc.id;
                const tarefa = doc.data();
                const div = document.createElement("div");
                div.classList.add('card');
                div.innerHTML = `<h2>${tarefa.titulo}</h2><hr>`;
                div.innerHTML += `<p>${tarefa.conteudo}</p>`;
                div.innerHTML += `<p>(${tarefa.data})</p>`;
                const botoesDiv = document.createElement('div');
                botoesDiv.classList.add('botoes');
                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.addEventListener('click', () => { excluirTarefa(id) });
                botoesDiv.appendChild(btnExcluir);
                div.appendChild(botoesDiv);
                main.appendChild(div);
            });
        })
        .catch((error) => {
            console.error("Erro ao listar tarefas:", error);
        });
}

function excluirTarefa(id) {
    const db = getFirestore(app);
    const tarefasRef = collection(db, "tarefas");
    const tarefaRef = doc(tarefasRef, id);

    // Excluir tarefa do Firestore
    deleteDoc(tarefaRef)
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erro ao excluir tarefa:", error);
        });
}

listarTarefas();