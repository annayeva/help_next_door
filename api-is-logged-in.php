<?php
	session_start();
	
	if( isset($_SESSION['user_id'])  ){
		
		echo '{"status":"ok"}';
	}else{

		echo '{"status":"error"}';
	}
	
?>