<?php 
namespace Seguranca\Model;

use \Seguranca\Model;
use \Seguranca\DB\Sql;
use \phpseclib\Crypt\RSA;

class Users extends Model{
	const SESSION = "User";
// realiza o login validando as informações envidas pelo usuario
	public function login($login , $password){
		$sql = new Sql();
		//realiza hash do login do usuario 
		$user = hash("sha512",$login,false);
		//recupera dados do usuario do servidor
		$results = $sql->select("SELECT * FROM  users WHERE deslogin = :LOGIN",array(
			':LOGIN'=>$user
		));
		//verifica se foi retornado algum usúario do banco
		if(count($results) === 0){
			throw new \Exception("Usuário inexistente ou senha inválida.");
		}
		// se retornado algum valor , pega o primeiro valor do array e atribui a variavel data
		$data = $results[0];
		// se a senha estiver correta ele criará um usúario, atribuira os valores retornados na variavel data e seta na sessão
		if(password_verify($password,$data["despassword"]) === true){
			$user = new Users();
			$user->setData($data);
			$_SESSION[Users::SESSION] = $user->getValues();
		}else{
			throw new \Exception("Usuário inexistente ou senha inválida.");
			
		}

		$dir = "./users/".$data['deslogin'];
		if(!is_dir($dir)){
			mkdir($dir);
		}
	}
	//verifica se o usuario está logado
	public static function verifyLogin(){
		//verifica se o usuario possui uma sessão aberta 
		if(!isset($_SESSION[Users::SESSION])
			|| !$_SESSION[Users::SESSION]
			|| !(int)$_SESSION[Users::SESSION]["iduser"] > 0		
		){

			header("Location: /");
			exit();
		}
	}
 // esta função ainda não está sendo utilizada ainda 
	public static function save($login,$email,$pass){

		$password = password_hash($pass, PASSWORD_DEFAULT, [ "cost"=>12]);
		$user = hash("sha512",$login,false);
		$encryption_key = base64_encode(openssl_random_pseudo_bytes(32));

		$sql = new Sql();
		$resutls = $sql->select("SELECT * FROM  users WHERE deslogin = :LOGIN",array(
			':LOGIN'=>$user));

		if(count($resutls) === 0){
			$sql->query("INSERT INTO users(dtregister, despassword, desemail, deslogin, AESKey) VALUES ( NOW(), :PASSWORD, :EMAIL, :LOGIN, :AESKey)",array(
			':LOGIN'=> $user,
			':PASSWORD'=> $password,
			':EMAIL'=>$email,
			':AESKey'=>$encryption_key
		));
		}else{
			throw new \Exception("Usuário ja existente");
			
		}
	}

	public static function decryptedForSaveUser($login,$email,$pass,$chaveAES,$salt,$iv){
		$decryptedLogin = Users::CryptoJSAesDecrypt($chaveAES,$salt ,$iv ,$login);
		$decryptedPass = Users::CryptoJSAesDecrypt($chaveAES,$salt ,$iv ,$pass);
		$decryptedEmail = Users::CryptoJSAesDecrypt($chaveAES,$salt ,$iv ,$email);
		Users::save($decryptedLogin,$decryptedEmail,$decryptedPass);

	}

	public static function returnSucess(){
		return json_encode(array(
			"msg" => "Sucesso"
		));
	}
	//esta função descriptografa a chave do AES com a chave privada ( utiliza RSA)
	public static function privateKeyDecrypt($data, $privatekey){
		$clientkey = base64_decode($data);
		openssl_private_decrypt($clientkey, $decrypted, $privatekey ,OPENSSL_PKCS1_PADDING);
		return $decrypted ; 
		
	}

	//esta função decriptografa as informações enviadas criptografadas pelo AES
	public static function CryptoJSAesDecrypt($passphrase, $salt ,$iv ,$data){
		$salt1 = hex2bin($salt);
		$iv1 = hex2bin($iv);
	    $info = base64_decode($data);
	   
	    $iterations = 999;

	    $key = hash_pbkdf2("sha512", $passphrase, $salt1, $iterations, 64);
	   
	    $decrypted= openssl_decrypt($info , 'aes-256-cbc', hex2bin($key), OPENSSL_RAW_DATA, $iv1);
	   
	    return $decrypted;

	}
}



 ?>