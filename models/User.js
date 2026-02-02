class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {
        
        this._name = name; // O underline antes do nome da propriedade indica que ela é privada, ou seja, não deve ser acessada diretamente fora da classe
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date(); // Data de registro do usuario, atribuido automaticamente quando o objeto é criado
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    get birth() {
        return this._birth;
    }

    set birth(value) {
        this._birth = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get photo() {
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    get admin() {
        return this._admin;
    }

    set admin(value) {
        this._admin = value;
    }

    get register() {
        return this._register;
    }

    set register(value) {
        this._register = value;
    }

}