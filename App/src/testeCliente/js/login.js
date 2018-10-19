window.onload = function () {
    getPublicKey(sendAESKey)
    clearFields()
}

const clearFields = function () {
    const inputLogin = document.getElementById('userLogin').value = ''
    const inputPass = document.getElementById('userPassword').value = ''
}

const validar = function (e) {
    const inputLogin = document.getElementById('userLogin')
    const inputPass = document.getElementById('userPassword')
    if(window.clientkey && window.publickey){
        if (inputLogin.value.trim() == '') {
            alert("O login deve ser informado")
            return false;
        }
        if (inputPass.value.trim() == '') {
            alert("A senha deve ser informada")
            return false;
        }
        let criptLogin = CryptoJS.AES.encrypt(inputLogin.value, window.clientkey)
        let criptPass = CryptoJS.AES.encrypt(inputPass.value, window.clientkey)
        inputLogin.value = criptLogin.toString()
        inputPass.value = criptPass.toString()
        return true
    } else {
        alert('Não foi encontrado as chaves para troca de informações.')
        return false;
    }
}