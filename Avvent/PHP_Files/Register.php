<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

//Client Information
	$client_firstname = mysqli_real_escape_String($conn, $_POST["FirstName"]);
	$client_lastname = mysqli_real_escape_String($conn, $_POST["LastName"]);
	$client_email = mysqli_real_escape_String($conn, $_POST["Email"]);
	$client_username = mysqli_real_escape_String($conn, $_POST["Username"]);
	$client_password = mysqli_real_escape_String($conn, $_POST["Password"]);



//Check If Connection Failed	
	if(!$conn)
	{
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	
//Get Results From Database
	$sql = "SELECT Username, Email FROM pending_users WHERE Username = '$client_username' OR Email ='$client_email'" ;
	$result = mysqli_query($conn, $sql);
	
	
	
	
 //Check If There Was At Least One Row
	if(mysqli_num_rows($result) == 0){
		$hashedPassword = password_hash($client_password, PASSWORD_DEFAULT);
		$sql = "INSERT INTO pending_users (Firstname, Lastname, Email, Username, Password) VALUES ('$client_firstname', '$client_lastname' ,'$client_email' ,'$client_username' ,'$hashedPassword');";
		$result = mysqli_query($conn, $sql);

		if ($result) {
			echo "success";
		} else {
			echo "error";
		}
	} else {
		echo "User Exist";	
	}
?>