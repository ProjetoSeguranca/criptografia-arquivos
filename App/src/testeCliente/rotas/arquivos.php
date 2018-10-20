<?php
    header('Content-Type: application/json');
    session_start();
    if($_POST["file"]){
        $_SESSION["files"] = $_POST["file"];
    }
    if($_SESSION["login"]){
        echo $_SESSION["files"];
    } else {
        echo json_encode(array(
            "msg" => "Erro: Sessão não foi aberta"
        ));
    }
?>