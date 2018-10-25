<?php
    session_start();
    session_destroy();
    if($_SESSION["login"]){
        echo "Sessão finalizada";
    }
?>