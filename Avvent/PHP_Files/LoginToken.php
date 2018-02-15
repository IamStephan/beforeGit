<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
	


//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_token = mysqli_real_escape_String($conn, $_POST["Token"]);

//Check If Connection Failed	
	if(!$conn)
	{
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	
//Get Results From Database

	$sql = "SELECT Token, UserID FROM tokens WHERE Token = '$client_token'" ;
	$result = mysqli_query($conn, $sql);
	
	
	
	
 //Check If There Was At Least One Row
	if(mysqli_num_rows($result) == 0)
	{
		echo "404";
	}	
	else
	{
		while($row = mysqli_fetch_array($result)) {
			if ($client_token == $row["Token"]) {
				$U_ID = $row["UserID"];

				$sql = "SELECT * FROM avvent_members WHERE ID = '$U_ID'" ;
				$result = mysqli_query($conn, $sql);
				if ($row = mysqli_fetch_array($result)) {
					echo json_encode(array('userName' => $row["Username"], 'firstName' => $row["Firstname"], 'lastName' =>$row["Lastname"], 'userRole' => $row["UserRole"], 'userID' => $row["ID"]));
				} else {
					echo "";
				}
				break;
			}
		}
		
	}
?>