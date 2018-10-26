/**
 * Está função inicia a captura da chave pública do servidor
 * e envio na chave AES no cliente, além de limpar os campos
 * do formulário como uma medida de precausão, para caso os
 * dados de acesso do mesmo vejam exibidos pelo browser.
 */
window.onload = function () {
    getPublicKey(sendAESKey)
    clearFields()
}

/**
 * Está função limpa os dados do forulário de cadastro
 */
const clearFields = function () {
    const inputLogin = document.getElementById('userLogin')
    const inputPass = document.getElementById('userPassword')
    const inputConfPass = document.getElementById('userConfirmPassword')
    const inputEmail = document.getElementById('userEmail')
    inputLogin.value = ''
    inputPass.value = ''
    inputConfPass.value = ''
    inputEmail.value = ''
}

/**
 * Esta função faz a validação dos dados inseridos no formulário de
 * cadastro antes de enviar para o servidor.
 */
const validar = function (e) {
    const inputLogin = document.getElementById('userLogin')
    const inputPass = document.getElementById('userPassword')
    const inputConfPass = document.getElementById('userConfirmPassword')
    const inputEmail = document.getElementById('userEmail')

    if (inputLogin.value.trim() == '') {
        alert("O login deve ser informado")
        return false;
    }
    if (inputPass.value.trim() == '') {
        alert("A senha deve ser informada")
        return false;
    }
    if (inputConfPass.value.trim() == '') {
        alert("A senha de confirmação deve ser informada")
        return false;
    } else {
        if (inputPass.value != inputConfPass.value) {
            alert("As senhas não batem")
            return false;
        }
    }
    if (inputEmail.value.trim() == '') {
        alert("O e-mail deve ser informado")
        return false;
    }

    let criptLogin = CryptoJS.AES.encrypt(inputLogin.value, window.clientkey)
    let criptPass = CryptoJS.AES.encrypt(inputPass.value, window.clientkey)
    let criptEmail = CryptoJS.AES.encrypt(inputEmail.value, window.clientkey)
    inputLogin.value = criptLogin.toString()
    inputPass.value = criptPass.toString()
    inputEmail.value = criptEmail.toString()
    inputConfPass.value = ''
    return true
}