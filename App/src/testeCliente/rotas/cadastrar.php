<?php
    header('Content-Type: application/json');
    $dados = array(
        "login" => $_POST["userLogin"],
        "senha" => $_POST["userPassword"],
        "email" => $_POST["userEmail"]
    );
    echo json_encode($dados)
?>