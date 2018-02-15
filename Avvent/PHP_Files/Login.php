<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_username = mysqli_real_escape_String($conn, $_POST["Username"]);
	$client_password = mysqli_real_escape_String($conn, $_POST["Password"]);

//Check If Connection Failed	
	if(!$conn)
	{
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	
//Get Results From Database
	$sql = "SELECT * FROM avvent_members WHERE Username = '$client_username' OR Email ='$client_username'" ;
	$result = mysqli_query($conn, $sql);
	
	
 //Check If There Was At Least One Row
	if(mysqli_num_rows($result) == 0){
		echo "404";
	} else {
		while($row = mysqli_fetch_array($result)) {
			$passCheck = password_verify($client_password, $row['Password']);

			if ($passCheck == true && $client_username == $row['Username'] || $client_username == $row['Email']) {
				$newToken = md5(time() . mt_rand(1,1000000));
				echo json_encode(array('token' => $newToken, 'userName' => $row["Username"], 'firstName' => $row["Firstname"], 'lastName' =>$row["Lastname"], 'userRole' => $row["UserRole"], 'userID' => $row['ID']));
				$userID = $row["ID"];
				$sql = "INSERT INTO tokens (Token, UserID) VALUES ('$newToken', '$userID');";
				$result = mysqli_query($conn, $sql);
				break;
			} else {
				echo "";
			}
		}	
	}
?>