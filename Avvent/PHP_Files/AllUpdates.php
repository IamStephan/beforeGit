<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	
	$offset = $_POST['offset'];
//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);
//Check If Connection Failed	
	if(!$conn)
	{
		die("Connection Failed. ". mysqli_connect_error());
	} else {
		$sql = "SELECT * FROM updates ORDER BY ID DESC LIMIT 3 OFFSET ".$offset;
		$result = mysqli_query($conn, $sql);

		if (mysqli_num_rows($result) == 0) {
				echo "Error 404";
		} else {
			while($row = mysqli_fetch_assoc($result)) {
				echo $row["ID"]."|".$row["Tag"]."|".$row["Title"]."|".$row["Text"]."|".$row["Date"].";";
			}
		}
	}
	
	

	
	

	
?>