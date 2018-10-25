<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>

<html>

<head>
  <meta charset="utf-8" />
  <title>Arquivos</title>
  <link rel="stylesheet" href="./views/src/testeCliente/css/arquivos.css">
  <script src="./views/src/testeCliente/js/arquivos.js"></script>
  <script src="./views/src/testeCliente/js/handshake.js"></script>
  <script src="./views/src/testeCliente/crypto-js/crypto-js.js"></script>
  <script src="./views/src/testeCliente/jscriptografia/jsencrypt.min.js"></script>
</head>

<body>
  <div class="box1">
    <div class="box2">
      <font color="white" , size=7>Servidor</font>
    </div>
    <div class="box3">
      <font color="white" , size=3>Bem Vindo <?php echo htmlspecialchars( $data["user"], ENT_COMPAT, 'UTF-8', FALSE ); ?></font>
    </div>
  </div>
  <div class="gray">
    <div class="addbutton">
      <input type="file" name="file" id="file">
      <input type="button" onclick="sendFile()" value="Enviar arquivo">
    </div>
  </div>
  <h1>Arquivos</h1>
  <table>
    <tr>
      <th>Nome</th>
      <th>Data de Modificação</th>
      <th>Tipo</th>
      <th>Extensão</th>
      <th>Tamanho</th>
    </tr>
    <tr>
      <td>Exemplo</td>
      <td>29/09/2018</td>
      <td>Pasta compactada</td>
      <td>.zip</td>
      <td>1.088kb</td>
    </tr>
    <tr>
    </tr>
  </table>
  </div>
  <div id="arquivo"></div>
  <div id="arquivo2"></div>
</body>

</html>