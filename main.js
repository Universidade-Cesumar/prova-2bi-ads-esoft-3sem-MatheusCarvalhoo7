// Arquivo para código javascript

const url = "https://6a29e2d4f59cb8f65f1db317.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const inputRetirada = document.getElementById("input-retirada");

async function listarMateriais() {

    const resposta = await fetch(url);

    const materiais = await resposta.json();

    listaMateriais.innerHTML = "";

    materiais.forEach(material => {

        listaMateriais.innerHTML += `
            <tr>
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
                <td>
                    <button class="btn-baixar" onclick="baixarMaterial('${material.id}', ${material.quantidade})">
                    Baixar
                    </button>

                    <button class="btn-excluir" onclick="excluirMaterial('${material.id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

}

listarMateriais();

async function cadastrarMaterial() {

    const material = {
        nome: inputNome.value,
        quantidade: Number(inputQuantidade.value)
    };

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(material)
    });

    inputNome.value = "";
    inputQuantidade.value = "";

    listarMateriais();
}

btnCadastrar.addEventListener("click", cadastrarMaterial);

function validarRetirada(estoqueAtual, quantidadeRetirada) {

    if (quantidadeRetirada <= 0) {
        return false;
    }

    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }

    return true;
}

async function excluirMaterial(id) {

    await fetch(`${url}/${id}`, {
        method: "DELETE"
    });

    listarMateriais();
}

async function baixarMaterial(id, estoqueAtual) {

    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert("Quantidade inválida para retirada.");
        return;
    }

    const novoEstoque = estoqueAtual - quantidadeRetirada;

    await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantidade: novoEstoque
        })
    });

    inputRetirada.value = "";

    listarMateriais();
}