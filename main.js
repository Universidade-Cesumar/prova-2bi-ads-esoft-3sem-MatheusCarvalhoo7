const url = "https://6a29e2d4f59cb8f65f1db317.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const inputRetirada = document.getElementById("input-retirada");
const inputBusca = document.getElementById("input-busca");
const totalItens = document.getElementById("total-itens");

async function listarMateriais() {
    try {
        const resposta = await fetch(url);
        const materiais = await resposta.json();

        const termoBusca = inputBusca.value.toLowerCase();

        totalItens.textContent = materiais.length;
        listaMateriais.innerHTML = "";

        materiais.forEach(material => {
            if (!material.nome.toLowerCase().includes(termoBusca)) {
                return;
            }

            const classeEstoque =
                material.quantidade < 10 ? "estoque-critico" : "";

            listaMateriais.innerHTML += `
                <tr class="${classeEstoque}">
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

    } catch (erro) {
        console.error("Erro ao listar materiais:", erro);
        alert("Erro ao carregar os materiais.");
    }
}

listarMateriais();

async function cadastrarMaterial() {
    try {
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

    } catch (erro) {
        console.error("Erro ao cadastrar material:", erro);
        alert("Erro ao cadastrar material.");
    }
}

btnCadastrar.addEventListener("click", cadastrarMaterial);

inputBusca.addEventListener("input", listarMateriais);

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
    try {
        await fetch(`${url}/${id}`, {
            method: "DELETE"
        });

        listarMateriais();

    } catch (erro) {
        console.error("Erro ao excluir material:", erro);
        alert("Erro ao excluir material.");
    }
}

async function baixarMaterial(id, estoqueAtual) {
    try {
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

    } catch (erro) {
        console.error("Erro ao baixar material:", erro);
        alert("Erro ao baixar material.");
    }
}