window.onload = function () {
    getPublicKey(sendAESKey)
    cryptoFile(getFileInfo)
}

const cryptoFile = function (callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelected = document.getElementById('file');
        fileSelected.addEventListener('change', function (e) {
            var fileTobeRead = fileSelected.files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                var fileContents = document.getElementById('arquivo');
                var fileContents2 = document.getElementById('arquivo2');
                let cifra = CryptoJS.AES.encrypt(fileReader.result, window.clientkey)
                fileContents.innerText = 'Original.....: ' + fileReader.result;
                fileContents2.innerText = 'Criptografado: ' + cifra.toString();
                callback({
                    fileName: CryptoJS.AES.encrypt(fileTobeRead.name, window.clientkey).toString(),
                    fileType: CryptoJS.AES.encrypt(fileTobeRead.type, window.clientkey).toString(),
                    fileSize: CryptoJS.AES.encrypt(fileTobeRead.size.toString(), window.clientkey).toString(),
                    fileContent: cifra.toString(),
                    hashContent: CryptoJS.SHA256(cifra.toString()).toString()
                })
            }
            fileReader.readAsDataURL(fileTobeRead); //O conteudo do arquivo está em base64
        }, false)
    }
    else {
        alert("Arquivo(s) não suportado(s)");
    }
}

const getFileInfo = function (data) {
    window.fileEncrypt = data
}

const sendFile = function () {
    console.log(window.fileEncrypt)
    if (window.fileEncrypt) {
        clientkey = makeClientKey()
        fetch('/criptografia-arquivos/App/src/testeCliente/rotas/arquivos.php', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `file=${JSON.stringify(window.fileEncrypt)}`
        })
            .then(`{}`)
            .then(function (data) {
                var msg = 'Arquivo enviado com sucesso'
                alert(msg)
                console.log(msg);
                window.location.reload()
            })
            .catch(function (error) {
                var msg = `Falha ao enviar arquivo. Erro: ${error}`
                alert(msg)
                console.log(msg);
            });
    } else {
        alert('Nenhum arquivo foi selecionado.')
    }
}