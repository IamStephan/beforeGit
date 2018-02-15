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
	$client_title = mysqli_real_escape_String($conn, $_POST["Title"]);
	$client_desc = mysqli_real_escape_String($conn, $_POST["Description"]);
	$client_date = mysqli_real_escape_String($conn, $_POST["EndDate"]);
	$client_dur = mysqli_real_escape_String($conn, $_POST["Duration"]);
	$client_token = mysqli_real_escape_String($conn, $_POST["Token"]);
	$client_id = '';
	

//Check If Connection Failed	
	if(!$conn){
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	$sql = "SELECT UserID FROM tokens WHERE Token = '$client_token' LIMIT 1";
	$result = mysqli_query($conn, $sql);
	

	if (mysqli_num_rows($result) == 0) {
		echo "error";
	} else {
		$row = mysqli_fetch_array($result);
		$client_id = $row['UserID'];
		
		
		$sql = "INSERT INTO project_tasks (Title, Description, EndDate, Duration, ParticipantID, ProjectID) VALUES ('$client_title','$client_desc','$client_date', '$client_dur', '$client_id', '$client_projectID')";
		$result = mysqli_query($conn, $sql);
		if ($result) {
			$last_id = mysqli_insert_id($conn);
			echo $last_id;
		} else {
			echo "error";
		}
	}
?>