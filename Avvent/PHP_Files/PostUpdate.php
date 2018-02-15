<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_tag = mysqli_real_escape_String($conn, $_POST["Tag"]);
	$client_title = mysqli_real_escape_String($conn, $_POST["Title"]);
	$client_text = mysqli_real_escape_String($conn, $_POST["Text"]);
	$client_date = mysqli_real_escape_String($conn, $_POST["Date"]);
	$client_token = mysqli_real_escape_String($conn, $_POST["Token"]);

	

//Check If Connection Failed	
	if(!$conn){
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	
//Get Results From Database
	$sql = "SELECT UserID FROM tokens WHERE Token = '$client_token' LIMIT 1";
	$result = mysqli_query($conn, $sql);
	$row = mysqli_fetch_array($result);
 //Check If There Was At Least One Row
	if(mysqli_num_rows($result) == 0){
		echo "error";
	} else {
		
		$sql = "SELECT UserRole FROM avvent_members WHERE ID = ".$row['UserID'];
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($result);

		if ($row['UserRole'] == "Administrator") {
			$sql = "INSERT INTO updates (Tag, Title, Text, Date) VALUES ('$client_tag','$client_title','$client_text','$client_date')";
			$result = mysqli_query($conn, $sql);
			if ($result) {
				echo "success";
			} else {
				echo "error";
			}
			
		} else {
			echo "error";
		}
	}
?>