//formulario que será enviado com as informações
const form = document.querySelector("form");
//O valor da despesa
const amount = document.querySelector("#amount");
//O nome da despesa
const expense = document.querySelector("#expense");
//A categoria da despesa que vamos capturar seu value e seu nome
const category = document.querySelector("#category");
//A lista que vai comportar os items de despesa
const expenseList = document.querySelector("ul");

const expensesQuantity = document.querySelector("aside header p span");

const expensesTotal = document.querySelector("aside header h2");
console.log(expensesTotal);

//Tratamento do campo de entrada de valor
amount.oninput = () => {
  //Expressão regular para capturar letras
  const regex = /\D+/g;

  //Adicionando a expressão regular dentro da variável value
  let value = amount.value.replace(regex, "");

  //Adicionando a regra dentro do que o usuário estiver digitando
  amount.value = value;

  //Pegando o valor e divindo para mostrar também os centavos
  value = Number(value) / 100;

  //Adicionando a formação no que o usuário vai digitar
  amount.value = formatCurrencyBRL(value);
};

//Ao enviar o formulário, faça tudo o que tiver dentro desse bloco
form.onsubmit = () => {
  //Evento padrão que vai remover o comportamento natural de form
  event.preventDefault();

  //Objeto que vai conter as informações enviadas do usuário para a construção de uma nova lista
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  //Função que vai criar uma nova lista de acordo com o que o usuário mandou
  expenseAdd(newExpense);
};

//Formatação da moeda de entrada
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

//Adicionando um novo item na lista de despesas
function expenseAdd(newExpense) {
  try {
    //Cria o elemento para adicionar na lista
    //Criando o elemento pai que vai abraçar o resto
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Criando o icon da categoria
    const expenseIcon = document.createElement("img");

    //Setando de forma dinâmica a imagem de acordo com a categoria escolhida
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);

    //Setando o valor alternativo se a imagem nao carregar, no caso o valor seria o nome da categoria
    expenseIcon.setAttribute("alt", newExpense.category_name);

    //Adicionando o nome da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //Criando os detalhes dentro do expense-info
    const expenseName = document.createElement("strong");
    expenseName.textContent = `${newExpense.expense}`;

    //O valor em texto da categoria
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = `${newExpense.category_name}`;

    //Adicionando o que foi criado dentro da estrutura
    expenseInfo.append(expenseName, expenseCategory);

    //Criando o valor da despesa dentro da lista
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");

    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

    //Criando o botão de remover
    const expenseRemove = document.createElement("img");
    expenseRemove.setAttribute("src", "/img/remove.svg");
    expenseRemove.setAttribute("alt", "Remover");
    expenseRemove.classList.add("remove-icon");

    //Adicionando o icon dentro da lista criada
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove);

    //Adicionando a lista dentro de sua estrutura das listas
    expenseList.append(expenseItem);

    //Atualiza o total da lista
    updateTotals();

    //Limpar os campos
    formClear();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.log(error);
  }
}

//Função que vai atualizar o quantitativo de despesa quanto o preço acumulativo de despesa

function updateTotals() {
  try {
    //Vai recuperar todos os items da lista
    const items = expenseList.children;

    //atualização de quantidade de item da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      let itemAmount = items[item].querySelector(".expense-amount");
      //Removendo caracteres nao numeros e substitui a virgula pelo ponto
      let value = itemAmount.textContent
        //Expressão que pega todo o tipo de caractere não numérico
        .replace(/[^\d,]/g, "")
        //Substitui virgula por ponto
        .replace(",", ".");

      //Converte o valor para ponto flutuante
      value = parseFloat(value);

      //Verifica se o valor realmente é um número, se não emite um alerta
      if (isNaN(value)) {
        alert(
          "Não foi possível calcular o total, o valor não parece ser um número",
        );
      }

      //Atualizando o total
      total += Number(value);
    }

    //Criando a small para comportar o symbol R$
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    //Pegando o valor sem o R$, removendo o mesmo
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    //Limpando o conteudo inteiro por dentro
    expensesTotal.innerHTML = "";

    //adicionando o simbolo e o valor formatado
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Não foi possível atualizar os totais");
    console.log(error);
  }
}

//Evento que vai remover o item
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");

    item.remove();
  }

  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
