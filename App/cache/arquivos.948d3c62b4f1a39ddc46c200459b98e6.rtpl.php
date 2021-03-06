<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>
<html lang="en">

<head>
  <title>Arquivos</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="./views/src/testeCliente/js/arquivos.js"></script>
  <script src="./views/src/testeCliente/js/handshake.js"></script>
  <script src="./views/src/testeCliente/crypto-js/crypto-js.js"></script>
  <script src="./views/src/testeCliente/jscriptografia/jsencrypt.min.js"></script>
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="./views/src/testeCliente/css/arquivos.css">
</head>

<body>
  <div id="carregamento">
    <div id="barraDiv"></div>
  </div>
  <div id="compartilhar">
    <div id="formCompart">
      <div class="cabecalho">
        <h3>Compartilhar arquivo</h2>
          <button onclick="openModalCompartilhar(false, event);" class="btn btn-danger btn-xs">X</button>
      </div>
      <form method="post" name="formCompartilhar" onsubmit="return sendCompartilhamento(event);">
        <div class="form-group">
          <input onkeyup="validarUser()" type="text" class="form-control" name="loginCompart" id="loginCompart" placeholder="Compartilhar com: ">
        </div>
        <div class="form-group">
          <label for="">Escolha o arquivo: </label>
          <div id="listaArquivos" class="listaArquivos"></div>
        </div>
        <div class="form-group">
          <button class="btn btn-success" type="submit">Compartilhar</button>
        </div>
      </form>
    </div>
  </div>
  <div id="solicitacao">
    <div id="formSolicitacao">
      <h3>Solicitação de compartilhamento</h3>
      <p id="msgSolicitacao"></p>
      <button class="btn btn-success">Aceitar</button>
      <button class="btn btn-danger">Recusar</button>
    </div>
  </div>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Sistema de arquivos</a>
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li class="active"><a>Meus arquivos</a></li>
          <li><a href="#" onclick="openModalCompartilhar();">Compartilhar</a></li>
          <li><a href="/logout"><span class="glyphicon glyphicon-log-out"></span> Sair</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="jumbotron">
      <h1>Bem-vindo!</h1>
      <p>Olá, <?php echo htmlspecialchars( $data["user"], ENT_COMPAT, 'UTF-8', FALSE ); ?>.</p>
    </div>
    <div class="arquivos">
      <h1>Meus Arquivos</h1>
      <div class="formEnviar">
        <input type="file" name="file" id="file">
        <input class="btn btn-primary btn-xs" type="button" onclick="sendFile()" value="Enviar arquivo">
      </div>
      <div id="divAlert" class="alert fade in">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>
      <div class="table-responsive">
        <table id="tableFiles" class="table table-striped table-hover">
          <tr>
            <th>Nome</th>
            <th class="ocultar">Data de Modificação</th>
            <th class="ocultar">Extensão</th>
            <th>Tamanho</th>
            <th>Ações</th>
          </tr>
          <tbody id="tableFilesData">

          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div id="arquivo"></div>
  <div id="arquivo2"></div>
</body>

</html>