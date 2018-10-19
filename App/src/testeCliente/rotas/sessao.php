<?php
    header('Content-Type: application/json');
    session_start();
    $dados = array(
        "login" => $_SESSION["login"] ? $_SESSION["login"] : "",
        "senha" => $_SESSION["senha"] ? $_SESSION["senha"] : "",
        "publickey" => $_SESSION["publickey"],
        "clientkey" => $_SESSION["clientkey"]
    );
    echo json_encode($dados)
?>