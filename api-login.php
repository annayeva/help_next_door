<?php

$sUrlUserName = $_GET['username'];
$sUrlUserPass = $_GET['pass'];
//echo $sUrlUserPass;

$sUsers = file_get_contents("json/users_credentials.json");

$ajUsers = json_decode( $sUsers );

$foundUser = false;
for( $i=0; $i < count($ajUsers); $i++ ){
	$userEmailFromJson = $ajUsers[$i]->userEmail;
	$userPasswordFromJson = $ajUsers[$i]->userPassword;
	$userIdFromJson = $ajUsers[$i]->userId;
	$userAddressFromJson = $ajUsers[$i]->userAddress;


	if( $sUrlUserName ==  $userEmailFromJson && $sUrlUserPass == $userPasswordFromJson){
//if( $inputUserEmail ==  $userEmailFromJson && $inputUserPassword == $userPasswordFromJson ){
		session_start();

		$_SESSION['user_id']=$userIdFromJson;
		$_SESSION['user_email']=$userEmailFromJson;
		$_SESSION['user_address']=$userAddressFromJson;
		$_SESSION['user_password']=$userAddressFromJson;



		//userAddress

		$foundUser = true;	
	}	
		// THE SERVER NEEDS TO TELL THE CLIENT ABOUT THE LOGIN ATTEMPT
}

if($foundUser){ 
	echo '{"status":"ok","user":"' . $_SESSION['user_email'] . '","user_id":"' . $_SESSION['user_id'] . '"}';	
}
else{
	echo '{"status":"error"}';
}


	//$iUserId = 1; //  THIS COMES FROM THE FILE
	//$sValidUserName = "A"; //  THIS COMES FROM THE FILE

	

 	//echo $sUrlUserName ;

	/* CHECK IF THE USER NAMES MATCH */
	
	?>