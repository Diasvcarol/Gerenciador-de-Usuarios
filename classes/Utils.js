class Utils {

    static dateFormat (date) { 
        return date.getDate() + "/" + ((date.getMonth() + 1).toString().padStart(2, "0")) + "/" + date.getFullYear(); 
        // .padStart(2, "0") adiciona um zero a esquerda se o numero tiver apenas 1 digito, funciona apenas em strings
    
    }
}