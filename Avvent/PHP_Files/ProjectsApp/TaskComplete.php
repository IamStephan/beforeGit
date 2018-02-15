<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_taskID = mysqli_real_escape_String($conn, $_POST["taskID"]);
	$client_token = mysqli_real_escape_String($conn, $_POST["Token"]);

//Check If Connection Failed	
	if(!$conn){
		die("Connection Failed. ". mysqli_connect_error());
	}

	$sql = "SELECT UserID FROM tokens WHERE Token = '$client_token' LIMIT 1";
	$result = mysqli_query($conn, $sql);

	if(mysqli_num_rows($result) == 0){
		echo "404";
	} else {
		$sql = "DELETE FROM project_tasks WHERE ID= '$client_taskID'";
		$result = mysqli_query($conn, $sql);

		if ($result) {
			echo "success";
		} else {
			echo "error";
		}
	}
?>