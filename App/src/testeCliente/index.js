window.onload = function () {
    getPublicKey(sendAESKey)
    clearFields()
}

const makeClientKey = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
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

const encryptData = function (data) {
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(window.publickey)
    var encryptedData = encrypt.encrypt(data)
    //console.log('ENCRYPTED: ', encryptedData)
    return encryptedData
}

// const decryptData = function (data) {
//     var decrypt = new JSEncrypt()
//     decrypt.setPrivateKey("MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQABAoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fvxTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeHm7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAFz/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIMV7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATeaTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5AzilpsLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Ozuku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876")
//     var uncrypted = decrypt.decrypt(data)
//     console.log("DECRYPT MSG : "+uncrypted)
//     return uncrypted
// }

const getPublicKey = function (sendKey) {
    fetch(`/criptografia-arquivos/App/src/testeCliente/public_key.php`)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                    publickey = data.key;
                    console.log('Request succeeded to public key')
                    sendKey()
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

const sendAESKey = function () {
    clientkey = makeClientKey()
    fetch('/criptografia-arquivos/App/src/testeCliente/getclientkey.php', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `clientkey=${encryptData(clientkey)}`
    })
        .then(`{}`)
        .then(function (data) {
            window.clientkey = clientkey
            window.publickey = publickey
            console.log('Request succeeded to client key');
            //console.log('Cliente key AES: ', window.clientkey)
            //console.log('Public key RSA.: ', window.publickey)
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}