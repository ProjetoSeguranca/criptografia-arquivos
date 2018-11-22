//ESTE ARQUIVO AINDA ESTÁ EM DESENVOLVIMENTO

/**
 * 
 */
window.onload = function () {
    getPublicKey(sendAESKey, getFilesUser)
    cryptoFile(getFileInfo)
    //checarSolicitacao()
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
    const idSolicitacao = document.getElementById('idSolicitacao')

    if (flag == true) {
        if (data.existe == true) {
            window.checar = false
            pMsg.innerHTML = `<strong>${data.user}</strong>, gostaria de compartilhar o arquivo <strong>${data.arquivo}</strong> com você.`
            idSolicitacao.value = data.idConvite
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
                callback(CryptoJSAESEncryptFile({
                    content: fileReader.result,
                    fileName: fileSelected.files[0].name
                }))
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
        fetch('/upload', {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(window.fileEncrypt)
        })
            .then(function (data) {
                if (data.status < 300 && data.status >= 200) {
                    return data.text()
                } else {
                    throw true
                }
            }).then(retorno => {
                checkRespJSONServer(retorno, `Arquivo salvo com sucesso`)
                getFilesUser()
            })
            .catch((error) => {
                alertSend(`<strong>Erro! </strong>Falha ao enviar arquivo do usuário.`, 'alert-danger')
                openModalLoad(false)
                getFilesUser()
            })
    } else {
        alertSend('<strong>Atenção! </strong>Nenhum arquivo foi selecionado para envio', 'alert-warning')
    }
}
const deleteFile = function (e, id) {
    if (confirm('Confirmar exclusão do arquivo?')) {
        e.preventDefault()
        fetch(`arquivos/delete/${id}`, {
            method: 'get'
        })
            .then(function (data) {
                if (data.status < 300 && data.status >= 200) {
                    return data.text()
                } else {
                    throw true
                }
            }).then(retorno => {
                checkRespJSONServer(retorno, `Arquivo excluido com sucesso`)
                getFilesUser()
            })
            .catch((error) => {
                alertSend(`<strong>Erro! </strong>Falha ao excluir arquivo do usuário.`, 'alert-danger')
                openModalLoad(false)
                getFilesUser()
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
            console.log(error)
            alertSend(`<strong>Erro! </strong>Falha ao obter arquivos do usuário.`, 'alert-danger')
            openModalLoad(false)
        })
}

const downloadFile = function (id) {
    openModalLoad(true, 'Aguarde. Descriptografando o arquivo para baixar...')
    fetch(`arquivos/download/`, {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(CryptoJSAESEncryptId(id))
    })
        .then(resp => {
            if (resp.status < 300 && resp.status >= 200) {
                return resp.text()
            } else {
                throw true
            }
        })
        .then(data => {
            const fileContent = JSON.parse(data)
            construirArquivo({
                id,
                fileName,
                fileContent
            })
            openModalLoad(false)
        })
        .catch((error) => {
            openModalLoad(false)
            console.log(error)
            alertSend(`<strong>Erro! </strong>Falha ao baixar arquivo`, 'alert-danger')
        })
}

const construirArquivo = function (data) {
    const decryptedFileContent = CryptoJSAesDecrypt(data.fileContent, data.salt, data)
    const decryptedFileName = CryptoJSAesDecrypt(data.fileName, data.salt, data)

    const dataURL = `data:application/octet-stream,${decryptedFileContent}`
    const elementLink = document.getElementById(`file${data.id}`)
    elementLink.download = data.decryptedFileName
    elementLink.target = '_blank'
    elementLink.href = dataURL
    elementLink.click()
}

const insetDataFilesTable = function (files) {
    const tbody = document.getElementById('tableFilesData')
    lista = Array.from(files.listaArquivos)
    console.log('Files: ', lista)
    tbody.innerHTML = ''
    const rows = lista.map(file => {
        const tdName = document.createElement('td')
        const tdNameLink = document.createElement('a')
        tdNameLink.setAttribute('onclick', `downloadFile('${CryptoJSAesDecrypt(file.idArquivo, files.salt, files.iv)}')`)
        tdNameLink.setAttribute('id', `file${CryptoJSAesDecrypt(file.idArquivo, files.salt, files.iv)}`)
        tdNameLink.innerHTML = CryptoJSAesDecrypt(file.fileName, files.salt, files.iv)
        tdName.appendChild(tdNameLink)
        const tdModificationData = document.createElement('td')
        tdModificationData.innerHTML = CryptoJSAesDecrypt(file.modificationData, files.salt, files.iv)
        const tdExt = document.createElement('td')
        tdExt.innerHTML = CryptoJSAesDecrypt(file.fileType, files.salt, files.iv)
        const tdSize = document.createElement('td')
        tdSize.innerHTML = CryptoJSAesDecrypt(file.fileSize, files.salt, files.iv)
        const tdActions = document.createElement('td')
        tdActions.innerHTML = `<a onclick="deleteFile(event, '${CryptoJSAesDecrypt(file.idArquivo, files.salt, files.iv)}')" class="btn btn-danger btn-xs">Excluir</a>`
        const tr = document.createElement('tr')
        tr.appendChild(tdName)
        tr.appendChild(tdModificationData)
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
    const idSolicitacao = document.getElementById('idSolicitacao')

    box.style.display = 'none'
    modal.style.zIndex = '-1'
    if (flag == true) {
        transUserToUser(idSolicitacao.value)
    } else {
        deleteCompart(idSolicitacao.value)
    }
}

const transUserToUser = function (idCompart) {
    const idEncrypted = CryptoJSAESEncryptId(`${idCompart}`)
    fetch('/compartilhar/arquivo/aceitar', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `data=${idEncrypted.data}&salt=${idEncrypted.salt}&iv=${idEncrypted.iv}&hash=${idEncrypted.hash}`
    })
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
    const idEncrypted = CryptoJSAESEncryptId(`${idCompart}`)
    fetch('/compartilhar/arquivo/negar', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `data=${idEncrypted.data}&salt=${idEncrypted.salt}&iv=${idEncrypted.iv}&hash=${idEncrypted.hash}`
    })
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
        const dadosEncrypted = CryptoJSAESEncryptSC({
            login: loginCompart.value,
            fileName: fileCompart.value
        })
        fetch('/compartilhar/arquivo', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `login=${dadosEncrypted.data.login}&fileName=${dadosEncrypted.data.fileName}&salt=${dadosEncrypted.salt}&iv=${dadosEncrypted.iv}&hash=${dadosEncrypted.hash}`
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
    if (!validarUser()) {
        alert('Informe um usuário válido')
        return false
    }
    return true
}