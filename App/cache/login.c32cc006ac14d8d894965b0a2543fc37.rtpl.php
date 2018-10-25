<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Login</title>
		<link rel="stylesheet" href="./views/src/testeCliente/css/login.css">
		<script src="./views/src/testeCliente/js/login.js"></script>
		<script src="./views/src/testeCliente/js/handshake.js"></script>
		<script src="./views/src/testeCliente/crypto-js/crypto-js.js"></script>
		<script src="./views/src/testeCliente/jscriptografia/jsencrypt.min.js"></script>
	</head>
<body>
	<form action=" " name="formLogin" id="formLogin" method="post" onsubmit="return validar(this)">
		<div class="box">
			<h1>Login</h1>
			<fieldset>
				<div class="login-user">
					<label for="userLogin">Usuario</label>
					<input class="userLogin" id="userLogin" aria-label="Usuario" placeholder="Usuario">
				</div>
				<div class="password">
					<label for="userPassword">Senha</label>
					<input class="userPassword" id="userPassword" type="password" aria-label="Senha" placeholder="Senha">
					<div class=box2>
						<input type="hidden" name="data" id="data" value="">
						<input type="submit" value="Entrar" class="btn">
					</div>
					<div class="box3">
						<input type="button" value="Cadastrar" class="btn">
						<p class="Cadastrar"></p>
					</div>
			</fieldset>
		</div>
	</form>
</body>
</html>