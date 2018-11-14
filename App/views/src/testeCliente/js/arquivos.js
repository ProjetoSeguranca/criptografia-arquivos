//ESTE ARQUIVO AINDA ESTÁ EM DESENVOLVIMENTO

/**
 * 
 */
window.onload = function () {
    getPublicKey(sendAESKey)
    cryptoFile(getFileInfo)
    getFilesUser()
    checarSolicitacao()
}

function alertSend(mensagem, tipo) {
    const divAlert = document.getElementById('divAlert')
    divAlert.classList.add(tipo)
    divAlert.style.display = 'block'
    divAlert.insertAdjacentHTML('beforeend', `${mensagem}<br>`)
    setTimeout(() => {
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

const openModalCompartilhar = function (flag = true, e) {
    if (e) {
        e.preventDefault()
    }
    const modal = document.getElementById('compartilhar')
    const box = document.getElementById('formCompart')
    if (flag == true) {
        getUsers()
        insetDataFilesShare()
        modal.style.zIndex = '2000'
        box.style.display = 'block'
    } else {
        box.style.display = 'none'
        modal.style.zIndex = '-1'
    }
}

const getUsers = function () {
    // fetch('/listar/usuarios')
    //     .then(data => {
    //         if (data.status < 300 && data.status >= 200) {
    //             return data.text()
    //         } else {
    //             throw true
    //         }
    //     })
    //     .then(usuarios => {
    //         window.usuarios = JSON.parse(usuarios)
    //     })
    //     .catch((error) => {
    //         alertSend(`<strong>Erro! </strong>Falha ao checar lista de usuarios.`, 'alert-danger')
    //         openModalLoad(false)
    //     })
}

const validarUser = function () {
    // let flag = false
    // const element = document.getElementById('loginCompart')
    // element.style.color = 'red'
    // window.usuarios.forEach(e => {
    //     if (element.value == e) {
    //         element.style.color = 'green'
    //         flag = true
    //         return
    //     }
    // })
    // if(flag == true){
    //     return true
    // } else {
    //     return false
    // }
    return true
}

const openModalSolicitacao = function (data, flag = true) {
    const modal = document.getElementById('solicitacao')
    const box = document.getElementById('formSolicitacao')
    const pMsg = document.getElementById('msgSolicitacao')
    if (flag == true) {
        if (data.existe == true) {
            window.checar = false
            pMsg.innerHTML = `<strong>${data.user}</strong>, gostaria de compartilhar o arquivo <strong>${data.arquivo}</strong> com você.`
            modal.style.zIndex = '2000'
            box.style.display = 'block'
        }
    } else {
        pMsg.innerHTML = ''
        box.style.display = 'none'
        modal.style.zIndex = '-1'
    }
}

const checkRespJSONServer = function (retorno, msg) {
    const r = JSON.parse(retorno)
    if (r.msg === 'Sucesso') {
        alertSend(`<strong>Sucesso! </strong>${msg}`, 'alert-success')
        openModalLoad(false)
        return
    } else {
        throw true
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
                    throw true
                }
            }).then(retorno => {
                checkRespJSONServer(retorno, `Arquivo salvo com sucesso`)
            })
            .catch((error) => {
                alertSend(`<strong>Erro! </strong>Falha ao enviar arquivo do usuário.`, 'alert-danger')
                openModalLoad(false)
            })
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
                    throw true
                }
            }).then(retorno => {
                checkRespJSONServer(retorno, `Arquivo excluido com sucesso`)
            })
            .catch((error) => {
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
                throw true
            }
        })
        .then(data => {
            window.files = JSON.parse(data)
            insetDataFilesTable(window.files)
            openModalLoad(false)
        })
        .catch((error) => {
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

const insetDataFilesShare = function () {
    const lista = document.getElementById('listaArquivos')
    lista.innerHTML = ''
    const files = Array.from(window.files)
    const spans = files.map((file) => {
        const span = document.createElement('span')
        span.innerHTML = `<span><input type="radio" name="fileCompart" value="${file.name}">${file.name}</span>`
        return span
    })
    spans.forEach(span => {
        lista.appendChild(span)
    })
}

const checarSolicitacao = function () {
    window.checar = true
    setInterval(() => {
        if (window.checar == true) {
            fetch('/compartilhar/arquivo/checar')
                .then(data => {
                    if (data.status < 300 && data.status >= 200) {
                        return data.text()
                    }
                })
                .then(retorno => {
                    const r = JSON.parse(retorno)
                    openModalSolicitacao(r)
                })
        }
    }, 5000)
}

const solicitacaoCompart = function (flag = true) {
    window.checar = true
    const modal = document.getElementById('solicitacao')
    const box = document.getElementById('formSolicitacao')
    box.style.display = 'none'
    modal.style.zIndex = '-1'
    if (flag == true) {
        transUserToUser(123123)
    } else {
        deleteCompart(123123)
    }
}

const transUserToUser = function (idCompart) {
    fetch('/compartilhar/arquivo/aceitar', { method: 'post', body: `{"id": "${idCompart}"}` })
        .then(data => {
            if (data.status < 300 && data.status >= 200) {
                return data.text()
            } else {
                throw true
            }
        })
        .then(retorno => {
            checkRespJSONServer(retorno, `Arquivo salvo`)
            getFilesUser()
        })
        .catch((error) => {
            alertSend(`<strong>Erro! </strong>Falha ao salvar arquivo`, 'alert-danger')
        })
}

const deleteCompart = function (idCompart) {
    fetch('/compartilhar/arquivo/negar', { method: 'post', body: `{"id": "${idCompart}"}` })
        .then(data => {
            if (data.status < 300 && data.status >= 200) {
                return data.text()
            } else {
                throw true
            }
        })
        .then(retorno => {
            checkRespJSONServer(retorno, `Solicitação recusada`)
        })
        .catch((error) => {
            alertSend(`<strong>Erro! </strong>Falha ao enviar dados para o servidor`, 'alert-danger')
        })
}

const sendCompartilhamento = function (e) {
    e.preventDefault()
    const loginCompart = document.getElementById('loginCompart')
    const fileCompart = document.getElementsByName('fileCompart')
    if (validarFormCompart(loginCompart, fileCompart)) {
        const dados = {
            login: CryptoJS.AES.encrypt(loginCompart.value, window.clientkey).toString(),
            arquivo: CryptoJS.AES.encrypt(fileCompart.value, window.clientkey).toString()
        }
        fetch('/compartilhar/arquivo', {
            method: 'post',
            body: JSON.stringify(dados)
        })
            .then(data => {
                if (data.status < 300 && data.status >= 200) {
                    return data.text()
                }
            })
            .then(retorno => {
                openModalCompartilhar(false, e)
                checkRespJSONServer(retorno, `Arquivo compartilhado`)
            })
            .catch((error) => {
                openModalCompartilhar(false)
                alertSend(`<strong>Erro! </strong>Falha ao compartilhar arquivo`, 'alert-danger')
            })
    }
}

const validarFormCompart = function (loginCompart, fileCompart) {
    if (loginCompart.value.trim() == '') {
        loginCompart.focus();
        alert('Informe para quem enviar o arquivo')
        return false
    }
    let flag = false
    fileCompart.forEach(e => {
        if (e.checked) {
            flag = true
        }
    })
    if (!flag) {
        alert('Selecione um arquivo')
        return false
    }
    if(!validarUser()){
        alert('Informe um usuário válido')
        return false
    }
    return true
}