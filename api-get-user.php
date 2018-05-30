<?php

$sUrlUserId = $_GET['user_id'];

$sUsers = file_get_contents("json/users_credentials.json");

$ajUsers = json_decode( $sUsers );

for( $i=0; $i < count($ajUsers); $i++ ){
	$userIdFromJson = $ajUsers[$i]->userId;

	if( $sUrlUserId ==  $userIdFromJson ){

		$jUser = $ajUsers[$i];

		$sUser = json_encode( $jUser );

		echo $sUser;

	}	

}


?>
