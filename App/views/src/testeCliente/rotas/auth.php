<?php
    $dados = array(
        "login" => $_POST["userLogin"],
        "senha" => $_POST["userPassword"]
    );
    
    session_start();
    $_SESSION["login"] = $dados["login"];
    $_SESSION["senha"] = $dados["senha"];
?>