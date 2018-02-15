<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_projectID = mysqli_real_escape_String($conn, $_POST["ProjectID"]);
	$client_username = mysqli_real_escape_String($conn, $_POST["Username"]);
	$client_token= mysqli_real_escape_String($conn, $_POST["token"]);
	$client_id = '';
	

//Check If Connection Failed	
	if(!$conn){
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	$sql = "SELECT UserID FROM tokens WHERE Token = '$client_token' LIMIT 1";
	$result = mysqli_query($conn, $sql);

	if(mysqli_num_rows($result) == 0){
		echo "404";
	} else {
		$sql = "SELECT * FROM avvent_members WHERE Username = '$client_username' OR Email = '$client_username'";
		$result = mysqli_query($conn, $sql);
		

		if(mysqli_num_rows($result) == 0){
			echo "error";
		} else {
			$row = mysqli_fetch_array($result);
			$client_id = $row['ID'];
			$client_username = $row['Username'];

			$sql = "SELECT * From projects_participants WHERE ParticipantsID = '$client_id' AND ProjectID = '$client_projectID'";
			$result = mysqli_query($conn, $sql);

			if (mysqli_num_rows($result) == 0) {
				$sql = "INSERT INTO projects_participants (ParticipantsID, 	ParticipantsUsername, ProjectID) VALUES ('$client_id','$client_username','$client_projectID')";
				$result = mysqli_query($conn, $sql);
				if ($result) {
					$last_id = mysqli_insert_id($conn);
					echo json_encode(array('id'=> $client_id, 'username'=>$client_username));
				} else {
					echo "error";
				}
			} else {
				echo "error";
			}
		}
	}
		
?>