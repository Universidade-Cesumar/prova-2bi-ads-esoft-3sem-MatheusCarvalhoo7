// Arquivo para código javascript

const url = "https://6a29e2d4f59cb8f65f1db317.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

async function listarMateriais() {

    const resposta = await fetch(url);

    const materiais = await resposta.json();

    listaMateriais.innerHTML = "";

    materiais.forEach(material => {

        listaMateriais.innerHTML += `
            <tr>
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
            </tr>
        `;

    });

}

listarMateriais();