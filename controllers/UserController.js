class UserController {

    constructor(formId, tableId) { // Construtor da classe UserController que recebe o id do formulario e o id da tabela como parametros

        this.formEl = document.getElementById(formId); // Pega o formulario pelo id
        this.tableEl = document.getElementById(tableId); // Pega a tabela pelo id

        this.eventOnSubmit(); // Chama o metodo eventOnSubmit para adicionar o evento de submit ao formulario
    };

    eventOnSubmit() {

        this.formEl.addEventListener("submit", event => { // Adiciona um evento ao formulario, arrow function para manter o contexto do this da classe

            event.preventDefault(); // Previne o comportamento padrao do formulario de recarregar a pagina

            let values = this.getFormValues(); // Chamar o metodo getFormValues que retorna um objeto user (JSON)

            this.getPhoto((content) => {

                values.photo = content; // Atribui o conteudo lido da foto a propriedade photo do objeto user
                this.addLine(values); // Chama o metodo addLine para adicionar uma nova linha na tabela com os dados do usuario

            }); // Chamar o metodo getPhoto para ler a foto do usuario
        });
    };

    getPhoto(callback) {

        let fileReader = new FileReader(); // Cria um novo objeto FileReader para ler arquivos, FileReader é uma API do JavaScript para ler arquivos do cliente

        let element = [...this.formEl.elements].filter(item => { // Usamos o operador spread para transformar a HTMLCollection em um array e assim usar o filter para filtrar os campos do formulario
            if (item.name === 'photo') { // Verifica se o name do campo é igual a 'photo' , se for igual retorna o item (campo)
                return item;
            };
        }); // Gera um novo array com os dados filtrados

        let file = element[0].files[0]; // Pega o primeiro arquivo do input files

        fileReader.onload = () => { // Evento onload é disparado quando a leitura do arquivo é concluida, evento onload vai acontecer depois que o arquivo for lido

            callback(fileReader.result); // Resultado da leitura do arquivo, que é uma URL de dados (base64), a tag img usa essa URL para exibir a imagem
            // Chama o callback passando o resultado da leitura do arquivo
        };

        fileReader.readAsDataURL(file); // Metodo readAsDataURL lê o conteudo do arquivo e o converte para uma URL de dados (base64)
    };
 
    getFormValues() {

        let user = {}; // Variavel declarada fora do escopo do forEach é visivel dentro e fora do forEach, só existe dentro do metodo getFormValues

        [...this.formEl.elements].forEach(function(field, index){ // Usamos o operador spread para transformar a HTMLCollection em um array ]
        // e assim usar o forEach para iterar sobre os campos do formulario, sem isso não seria possivel usar o forEach diretamente na HTMLCollection

            if (field.name == "gender") { // Verifica se o name do campo é igual
                if (field.checked) {
                    user[field.name] = field.value; // Adiciona o valor do campo na propriedade do objeto user que tem o nome do campo gender
                };

            } else {
                user[field.name] = field.value; // Adiciona o valor do campo na propriedade do objeto user
                
            };

        });

        return new User( // Cria um novo objeto user, um objeto é uma variavel que instancia uma classe, retornando o objeto (JSON) criado
            user.name, 
            user.gender, 
            user.birth,
            user.country, 
            user.email,
            user.password, 
            user.photo, 
            user.admin
        );
    };

    // dataUser vai vir do metodo getFormValues
    addLine(dataUser) { // dataUser é o parametro que vai receber o objeto user, ele vai criar uma nova linha na tabela com os dados do usuario
        // Cria uma nova linha na tabela com os dados do usuario
        this.tableEl.innerHTML = // Adiciona conteudo HTML dentro do elemento this.tableEl
                `
                  <td>
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${dataUser.admin}</td>
                    <td>${dataUser.birth}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                  </tr>`; // Adiciona o que esta entre crases como conteudo do elemento tr

    };
};