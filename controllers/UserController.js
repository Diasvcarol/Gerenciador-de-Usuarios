class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) { // Construtor da classe UserController que recebe o id do formulario e o id da tabela como parametros

        this.formEl = document.getElementById(formIdCreate); // Pega o formulario de criar usuario pelo id
        this.formElUpdate = document.getElementById(formIdUpdate); // Pega o formulario de atualizar usuario pelo id
        this.tableEl = document.getElementById(tableId); // Pega a tabela pelo id

        this.eventOnSubmit(); // Chama o metodo eventOnSubmit para adicionar o evento de submit ao formulario
        this.onEdit(); // Chama o metodo onEdit para adicionar o evento de cancelar no formulario de atualizar usuario
    };

    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => { // Adiciona um evento de click ao botao cancelar do formulario de atualizar usuario

            this.showFormCreate(); // Chama o metodo showFormCreate para mostrar o formulario de criar usuario

        });

        this.formElUpdate.addEventListener("submit", event => { // Adiciona um evento ao formulario de atualizar usuario, arrow function para manter o contexto do this da classe

            event.preventDefault(); 

            let btn = this.formElUpdate.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getFormValues(this.formElUpdate);
            let index = this.formElUpdate.dataset.trIndex; // Pega o indice da linha que esta sendo editada, armazenado no atributo data-tr-index do formulario de atualizar usuario
            let tr = this.tableEl.rows[index]; // Pega a linha da tabela que esta sendo editada pelo indice, .rows é uma propriedade da tabela que retorna uma coleção de todas as linhas (tr) da tabela
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values); // Junta os dois objetos, o userOld e o values, sobrescrevendo os valores do userOld com os valores do values


             this.getPhoto(this.formElUpdate).then((content) => { // Chama o metodo getPhoto que retorna uma Promise, usando o then para pegar o conteudo lido da foto
            // O then serve para tratar o sucesso da Promise, ele significa que a Promise foi resolvida com sucesso

                if (!values.photo) {
                    result._photo = userOld._photo; // Se a foto não for atualizada, mantém a foto antiga

                } else {
                    result._photo = content; // Atribui o conteudo lido da foto a propriedade photo do objeto user
                }

                tr.dataset.user = JSON.stringify(result); // Atualiza os dados do usuario na linha da tabela

                tr.innerHTML =
                    `
                        <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                this.addEventTr(tr);
                this.updateCount();
                this.formElUpdate.reset(); 

                btn.disabled = false;

                this.showFormCreate();

            }, (e) => { // O catch serve para tratar o erro da Promise, ele significa que a Promise foi rejeitada

                console.error(e);
            });
        });
    }

    eventOnSubmit() {

        this.formEl.addEventListener("submit", event => { // Adiciona um evento ao formulario, arrow function para manter o contexto do this da classe

            event.preventDefault(); // Previne o comportamento padrão do formulario de recarregar a pagina

            let btn = this.formEl.querySelector("[type=submit]"); // Pega o botao de submit do formulario
            btn.disabled = true; // Desabilita o botao de submit para evitar multiplos envios

            let values = this.getFormValues(this.formEl); // Chamar o metodo getFormValues que retorna um objeto user (JSON), armazenando na variavel values

            if (!values) return false; // Se o formulario não for valido, retorna false e não continua a execucao do codigo

            this.getPhoto(this.formEl).then((content) => { // Chama o metodo getPhoto que retorna uma Promise, usando o then para pegar o conteudo lido da foto
            // O then serve para tratar o sucesso da Promise, ele significa que a Promise foi resolvida com sucesso

                values.photo = content; // Atribui o conteudo lido da foto a propriedade photo do objeto user
                this.addLine(values); // Chama o metodo addLine para adicionar uma nova linha na tabela com os dados do usuario

                this.formEl.reset(); // Reseta o formulario apos o envio

                btn.disabled = false; // Habilita o botao de submit novamente

            }, (e) => { // O catch serve para tratar o erro da Promise, ele significa que a Promise foi rejeitada

                console.error(e);
            });
        });
    };

    getPhoto(formEl) {

        return new Promise((resolve, reject) => { // Retorna uma nova Promise que recebe duas funcoes como parametros: resolve e reject 
        // Uma promise é um objeto que representa a eventual conclusão (ou falha ) de uma operação assíncrona e seu valor resultante

            let fileReader = new FileReader();

            let element = [...formEl.elements].filter(item => {
                if (item.name === 'photo') { 
                    return item;
                };
            }); 

            let file = element[0].files[0]; // .files é uma propriedade do input type file que retorna uma FileList com os arquivos selecionados

            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            };

            if (file) {
                fileReader.readAsDataURL(file); // .readAsDataURL é um metodo do FileReader que lê o conteudo do arquivo e o converte para uma URL de dados (data URL(base64))

            } else {
                resolve('dist/img/boxed-bg.jpg'); // Se não houver arquivo selecionado, resolve a Promise com uma imagem padrão
            }

        });
    };
 
    getFormValues(formEl) {

        let user = {}; // Variavel declarada fora do escopo do forEach é visivel dentro e fora do forEach, só existe dentro do metodo getFormValues
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){ // Usamos o operador spread e [] para transformar a HTMLCollection em um array
        // e assim usar o forEach para iterar sobre os campos do formulario, sem isso não seria possivel usar o forEach diretamente na HTMLCollection
        // ...formEl agora é um array com todos os elementos do formulario

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) { // Verifica se o campo é obrigatorio e se está vazio
                
                field.parentElement.classList.add("has-error"); // Adiciona a classe has-error ao elemento pai do campo (form-group) para indicar que o campo está com erro
                isValid = false;
            }

            if (field.name == "gender") { // Verifica se o name do campo é igual
                if (field.checked) {
                    user[field.name] = field.value; // Adiciona o valor do campo na propriedade do objeto user que tem o nome do campo gender
                };

            } else if (field.name == "admin") {
                    user[field.name] = field.checked; 
                
            } else {
                user[field.name] = field.value; // Adiciona o valor do campo na propriedade do objeto user
                
            };

        });

        if (!isValid) {
            return false; // Se o formulario não for valido, retorna false e não cria o objeto user
        }

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
        let tr = document.createElement("tr"); // Cria um elemento tr (table row) para adicionar uma nova linha na tabela

        tr.dataset.user = JSON.stringify(dataUser); // Armazena os dados do usuario no atributo data-user da linha da tabela, convertendo o objeto user para uma string JSON

        tr.innerHTML = // Adiciona conteudo HTML dentro do elemento tr
            `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
            `; // Adiciona o que esta entre crases como conteudo do elemento tr

        this.addEventTr(tr); // Chama o metodo addEventTr para adicionar os eventos aos botoes da linha criada
        this.tableEl.appendChild(tr); // Adiciona o elemento tr como filho do elemento tableEl (tabela)
        this.updateCount(); // Chama o metodo updateCounts para atualizar os contadores de usuarios e administradores
    };

    addEventTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja realmente excluir?")) { // Exibe uma caixa de confirmacao para o usuario

                tr.remove(); // Remove a linha da tabela
                this.updateCount(); // Chama o metodo updateCounts para atualizar os contadores de usuarios e administradores

            };

        }); // Adiciona um evento de click ao botao de editar da linha criada

        tr.querySelector(".btn-edit").addEventListener("click", e => { // Adiciona um evento de click ao botao de editar da linha criada
        
            let json = JSON.parse(tr.dataset.user);

            this.formElUpdate.dataset.trIndex = tr.sectionRowIndex; // Armazena o indice da linha que esta sendo editada no atributo data-tr-index do formulario de atualizar usuario
            // sectionRowIndex retorna o indice da linha dentro do tbody, ignorando o thead

            for (let name in json) { // Itera sobre as propriedades do objeto json (dados do usuario), cada um dos campos

                let field = this.formElUpdate.querySelector("[name=" + name.replace("_","") + "]"); // Seleciona o campo do formulario de atualizar usuario pelo name
                //Vai buscar todos os names que tem no html do form-user-update

                if (field) { // Verifica se o campo existe no formulario de atualizar usuario

                    switch (field.type) { // Verifica o tipo do campo para atribuir o valor corretamente

                        case 'file':
                            continue;
                            break;

                        case 'radio':
                            field = this.formElUpdate.querySelector("[name=" + name.replace("_","") + "][value=" + json[name] + "]"); 
                            // Seleciona o campo do formulario de atualizar usuario pelo name (gender) e value (M ou F)
                            field.checked = true; // Marca o radio button correspondente como selecionado
                            break;

                        case 'checkbox':
                            field.checked = json[name]; // Atribui o valor da propriedade do objeto json ao campo do formulario
                            break;

                        default:
                            field.value = json[name]; // Atribui o valor da propriedade do objeto json ao campo do formulario
                    }
                }
            }

            this.formElUpdate.querySelector(".photo").src = json._photo; // Atualiza a foto do formulario de atualizar usuario
            this.showFormUpdate(); // Chama o metodo showFormUpdate para mostrar o formulario de atualizar usuario
        });
    };

    showFormCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    };

    showFormUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    };

    updateCount() {

        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableEl.children].forEach(tr => { // Itera sobre os filhos do elemento tableEl (tabela), que são as linhas (tr)

            numberUsers++;

            let user = JSON.parse(tr.dataset.user); // Converte a string JSON armazenada no atributo data-user de volta para um objeto

            if (user._admin) numberAdmins++; // Verifica se o usuario é admin, se for incrementa o contador de administradores

        });

        document.getElementById("number-users").innerHTML = numberUsers; // Atualiza o conteudo do elemento com id number-users com o numero de usuarios
        document.getElementById("number-admin").innerHTML = numberAdmins; // Atualiza o conteudo do elemento com id number-admin com o numero de administradores

    };
};