
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("formTarefa");
  const campo = document.getElementById("campoTarefa");
  const lista = document.getElementById("listaTarefas");

  const total = document.getElementById("totalTarefas");
  const pendentes = document.getElementById("tarefasPendentes");
  const concluidas = document.getElementById("tarefasConcluidas");

  const mensagem = document.getElementById("mensagemVazia");
  const barra = document.getElementById("barraProgresso");
  const textoProgresso = document.getElementById("textoProgresso");

  const botoesFiltro = document.querySelectorAll(".filtro");

  let tarefas = [];

  let filtroAtual = "todas";

  // Carregar tarefas salvas
  try {
    const salvas = JSON.parse(
      localStorage.getItem("minhasTarefas")
    );

    if (Array.isArray(salvas)) {
      tarefas = salvas.filter(t =>
        t &&
        typeof t.texto === "string" &&
        typeof t.concluida === "boolean"
      );
    }
  } catch (erro) {
    tarefas = [];
  }

  // Salvar tarefas no navegador
  function salvarTarefas() {
    localStorage.setItem(
      "minhasTarefas",
      JSON.stringify(tarefas)
    );
  }

  // Adicionar tarefa
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const texto = campo.value.trim();

    if (texto === "") {
      alert("Digite uma tarefa antes de adicionar!");
      campo.focus();
      return;
    }

    const novaTarefa = {
      id: Date.now() + Math.random(),
      texto: texto,
      concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();
    campo.value = "";
    campo.focus();

    filtroAtual = "todas";
    atualizarFiltros();
    mostrarTarefas();
  });

  // Concluir ou excluir uma tarefa
  lista.addEventListener("click", function (evento) {

    const botao = evento.target.closest("button");

    if (!botao) return;

    const id = Number(botao.dataset.id);

    if (botao.classList.contains("botao-concluir")) {

      const tarefa = tarefas.find(t => t.id === id);

      if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
      }

    }

    if (botao.classList.contains("botao-excluir")) {

      tarefas = tarefas.filter(t => t.id !== id);

    }

    salvarTarefas();
    mostrarTarefas();

  });

  // Filtrar tarefas
  botoesFiltro.forEach(botao => {

    botao.addEventListener("click", function () {

      filtroAtual = botao.dataset.filtro;

      atualizarFiltros();
      mostrarTarefas();

    });

  });

  function atualizarFiltros() {

    botoesFiltro.forEach(botao => {

      botao.classList.toggle(
        "ativo",
        botao.dataset.filtro === filtroAtual
      );

    });

  }

  // Mostrar tarefas na tela
  function mostrarTarefas() {

    lista.innerHTML = "";

    const filtradas = tarefas.filter(tarefa => {

      if (filtroAtual === "pendentes") {
        return !tarefa.concluida;
      }

      if (filtroAtual === "concluidas") {
        return tarefa.concluida;
      }

      return true;

    });

    mensagem.style.display =
      filtradas.length === 0 ? "block" : "none";

    if (tarefas.length === 0) {
      mensagem.textContent =
        "📚 Nenhuma tarefa por aqui. Adicione sua primeira atividade!";
    } else if (filtradas.length === 0) {
      mensagem.textContent =
        "Não existem tarefas nesta categoria.";
    }

    filtradas.forEach(tarefa => {

      const item = document.createElement("li");
      item.className = "item-tarefa";

      const conteudo = document.createElement("div");
      conteudo.className = "conteudo-tarefa";

      const nome = document.createElement("span");
      nome.className = "nome-tarefa";
      nome.textContent = tarefa.texto;

      if (tarefa.concluida) {
        nome.classList.add("concluida");
      }

      const acoes = document.createElement("div");
      acoes.className = "acoes";

      const concluir = document.createElement("button");
      concluir.className = "botao-concluir";
      concluir.dataset.id = tarefa.id;
      concluir.textContent = tarefa.concluida
        ? "Desfazer"
        : "Concluir";

      concluir.type = "button";

      const excluir = document.createElement("button");
      excluir.className = "botao-excluir";
      excluir.dataset.id = tarefa.id;
      excluir.textContent = "Excluir";
      excluir.type = "button";

      conteudo.appendChild(nome);

      acoes.appendChild(concluir);
      acoes.appendChild(excluir);

      item.appendChild(conteudo);
      item.appendChild(acoes);

      lista.appendChild(item);

    });

    atualizarResumo();

  }

  // Atualizar os números e o progresso
  function atualizarResumo() {

    const quantidade = tarefas.length;

    const feitas = tarefas.filter(
      t => t.concluida
    ).length;

    const faltam = quantidade - feitas;

    const porcentagem = quantidade > 0
      ? Math.round((feitas / quantidade) * 100)
      : 0;

    total.textContent = quantidade;
    pendentes.textContent = faltam;
    concluidas.textContent = feitas;

    barra.style.width = porcentagem + "%";

    textoProgresso.textContent =
      porcentagem + "% concluído";

  }

  // Iniciar o aplicativo
  atualizarFiltros();
  mostrarTarefas();

});
