//ESTE ARQUIVO AINDA ESTÁ EM DESENVOLVIMENTO

/**
 * 
 */
window.onload = function () {
    getPublicKey(sendAESKey)
    cryptoFile(getFileInfo)
    getFilesUser()
}

function alertSend(mensagem, tipo) {
    const divAlert = document.getElementById('divAlert')
    divAlert.classList.add(tipo)
    divAlert.style.display = 'block'
    divAlert.insertAdjacentHTML('beforeend', `${mensagem}`)
    setInterval(() => {
        divAlert.style.display = 'none'
        divAlert.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
        divAlert.classList.remove(tipo)
    }, 3000)
}

function openModalLoad(flag, msg = `<p>Aguarde...</p>`) {
    const modal = document.getElementById('carregamento')
    const box = document.getElementById('barraDiv')

    if (flag == true) {
        box.innerHTML = msg
        modal.style.zIndex = '2000'
        box.style.display = 'block'
    } else {
        setTimeout(() => {
            box.style.display = 'none'
            modal.style.zIndex = '-1'
        }, 1000)
    }
}

/**
 * Está função criptografa os arquivos antes de serem enviados ao servidor.
 */
const cryptoFile = async function (callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelected = document.getElementById('file');
        fileSelected.addEventListener('change', function (e) {
            var fileTobeRead = fileSelected.files[0];
            var fileReader = new FileReader();
            openModalLoad(true, 'Aguarde. Criptografando o arquivo...')
            fileReader.onload = function (e) {
                var fileContents = document.getElementById('arquivo');
                var fileContents2 = document.getElementById('arquivo2');
                let cifra = CryptoJS.AES.encrypt(fileReader.result, window.clientkey)
                //fileContents.innerText = 'Original.....: ' + fileReader.result;
                //fileContents2.innerText = 'Criptografado: ' + cifra.toString();
                callback({
                    fileName: CryptoJS.AES.encrypt(Date.now() + '_' + fileTobeRead.name, window.clientkey).toString(),
                    fileType: CryptoJS.AES.encrypt(fileTobeRead.type, window.clientkey).toString(),
                    fileSize: CryptoJS.AES.encrypt(fileTobeRead.size.toString(), window.clientkey).toString(),
                    fileContent: cifra.toString(),
                    hashContent: CryptoJS.SHA256(cifra.toString()).toString()
                })
                openModalLoad(false)
            }
            fileReader.readAsDataURL(fileTobeRead); //O conteudo do arquivo está em base64
        }, false)
    }
    else {
        alert("Arquivo(s) não suportado(s)");
    }
}

/**
 * Esta função é utiliada como callback na função "cryptoFile" para
 * salvar em uma variavel os dados do arquivo que foi criptografado.
 */
const getFileInfo = function (data) {
    window.fileEncrypt = data
}

/**
 * Está função será responsável por enviar os arquivos criptografados ao
 * servidor de arquivos.
 */
const sendFile = function () {
    if (window.fileEncrypt) {
        openModalLoad(true, `<p>Aguarde. Salvando o arquivo...</p>`)
        clientkey = makeClientKey()
        fetch('/upload', {
            method: 'post',
            body: `file=${JSON.stringify(window.fileEncrypt)}`
        })
            .then(function (data) {
                if (data.status < 300 && data.status >= 200) {
                    return data.text()
                } else {
                    alertSend(`<strong>Erro! </strong>Falha ao enviar o arquivo. Erro ${error.status}`, 'alert-danger')
                }
            }).then(retorno => {
                const r = JSON.parse(retorno)
                if (r.msg === 'Sucesso') {
                    alertSend(`<strong>Sucesso! </strong>Arquivo enviado com sucesso`, 'alert-success')
                }
            })
            .catch((error)=>{
                alertSend(`<strong>Erro! </strong>Falha ao enviar arquivo do usuário.`, 'alert-danger')
                openModalLoad(false)
            })
        openModalLoad(false)
        getFilesUser()
    } else {
        alertSend('<strong>Atenção! </strong>Nenhum arquivo foi selecionado para envio', 'alert-warning')
    }
}

const deleteFile = function (e, id) {
    if (confirm('Confirmar exclusão do arquivo?')) {
        e.preventDefault()
        fetch(`/arquivo/delete/${id}`, { method: 'delete' })
            .then(function (data) {
                if (data.status < 300 && data.status >= 200) {
                    return data.text()
                } else {
                    alertSend(`<strong>Erro! </strong>Falha ao excluir arquivo. Erro ${error.status}`, 'alert-danger')
                }
            }).then(retorno => {
                const r = JSON.parse(retorno)
                if (r.msg === 'Sucesso') {
                    alertSend(`<strong>Sucesso! </strong>Arquivo excluido com sucesso`, 'alert-success')
                    getFilesUser()
                }
            })
            .catch((error)=>{
                alertSend(`<strong>Erro! </strong>Falha ao excluir arquivo do usuário.`, 'alert-danger')
                openModalLoad(false)
            })
    }
}

const getFilesUser = function () {
    openModalLoad(true, 'Aguarde. Carregando arquivos...')
    fetch('/listar/arquivos')
        .then(resp => {
            if (resp.status < 300 && resp.status >= 200) {
                return resp.text()
            } else {
                alertSend(`<strong>Erro! </strong>Falha ao obter arquivos do usuário. Erro ${error.status}`, 'alert-danger')
                throw true
            }
        })
        .then(data => {
            const files = JSON.parse(data)
            insetDataFilesTable(files)
            openModalLoad(false)
        })
        .catch((error)=>{
            alertSend(`<strong>Erro! </strong>Falha ao obter arquivos do usuário.`, 'alert-danger')
            openModalLoad(false)
        })
}

const insetDataFilesTable = function (files) {
    const tbody = document.getElementById('tableFilesData')
    files = Array.from(files)
    tbody.innerHTML = ''
    const rows = files.map(file => {
        const tdName = document.createElement('td')
        tdName.innerHTML = file.name
        const tdModificationData = document.createElement('td')
        tdModificationData.innerHTML = file.modificationData
        const tdType = document.createElement('td')
        tdType.innerHTML = file.type
        const tdExt = document.createElement('td')
        tdExt.innerHTML = file.ext
        const tdSize = document.createElement('td')
        tdSize.innerHTML = file.size
        const tdActions = document.createElement('td')
        tdActions.innerHTML = `<a onclick="deleteFile(event, '${file.name}')" class="btn btn-danger btn-xs">Excluir</a>`
        const tr = document.createElement('tr')
        tr.appendChild(tdName)
        tr.appendChild(tdModificationData)
        tr.appendChild(tdType)
        tr.appendChild(tdExt)
        tr.appendChild(tdSize)
        tr.appendChild(tdActions)
        return tr
    })
    rows.forEach(linha => {
        tbody.appendChild(linha)
    })
}