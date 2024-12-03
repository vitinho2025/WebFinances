document.getElementById("formcadastro").addEventListener("submit", function (event) {
  event.preventDefault();

  var nome = document.getElementById('nome').value;
  var categoria = document.getElementById('categoria').value;
  var data = document.getElementById('data').value;
  var valor = parseFloat(document.getElementById('valor').value);

  var transacao = { nome: nome, categoria: categoria, data: data, valor: valor };

  var lista_transacoes = JSON.parse(localStorage.getItem('lista_transacoes')) || [];

  lista_transacoes.push(transacao);

  localStorage.setItem('lista_transacoes', JSON.stringify(lista_transacoes));

  document.getElementById('formcadastro').reset();

  exibir_transacoes();
  atualizar_resumo();
});

function exibir_transacoes() {
  var lista_transacoes = JSON.parse(localStorage.getItem('lista_transacoes')) || [];
  var output = document.getElementById('output');

  output.innerHTML = '';
  lista_transacoes.forEach(({ nome, categoria, data, valor }, index) => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nome}</td>
      <td>${categoria}</td>
      <td>${new Date(data).toLocaleDateString()}</td>
      <td>R$ ${valor.toFixed(2)}</td>
      <td>
        <button onclick="editar_transacao(${index})">Editar</button>
        <button onclick="excluir_transacao(${index})">Excluir</button>
      </td>
    `;
    output.appendChild(tr);
  });
}

function atualizar_resumo() {
  var lista_transacoes = JSON.parse(localStorage.getItem('lista_transacoes')) || [];
  var totalReceitas = 0;
  var totalDespesas = 0;

  lista_transacoes.forEach(({ categoria, valor }) => {
    if (categoria === "receita") totalReceitas += valor;
    else if (categoria === "despesa") totalDespesas += valor;
  });

  document.getElementById('totalReceitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
  document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
  document.getElementById('saldoFinal').textContent = `R$ ${(totalReceitas - totalDespesas).toFixed(2)}`;
}

function excluir_transacao(index) {
  var lista_transacoes = JSON.parse(localStorage.getItem('lista_transacoes')) || [];
  lista_transacoes.splice(index, 1); // Remove o item do array
  localStorage.setItem('lista_transacoes', JSON.stringify(lista_transacoes));
  exibir_transacoes();
  atualizar_resumo();
}

function editar_transacao(index) {
  var lista_transacoes = JSON.parse(localStorage.getItem('lista_transacoes')) || [];
  var transacao = lista_transacoes[index];

  // Preenche o formulário com os dados da transação
  document.getElementById('nome').value = transacao.nome;
  document.getElementById('categoria').value = transacao.categoria;
  document.getElementById('data').value = transacao.data;
  document.getElementById('valor').value = transacao.valor;

  // Remove a transação para evitar duplicação ao salvar novamente
  excluir_transacao(index);
}

// Inicializar ao carregar
exibir_transacoes();
atualizar_resumo();