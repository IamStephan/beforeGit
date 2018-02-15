<?php

	
// Server Information
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";
	

//Make The Connection
	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);
//Check If Connection Failed	
	if(!$conn)
	{
		die("Connection Failed. ". mysqli_connect_error());
	}
	
	
	$sql = "SELECT * FROM updates ORDER BY ID DESC LIMIT 3" ;
	$result = mysqli_query($conn, $sql);
	
	while($row = mysqli_fetch_assoc($result)) {
        echo $row["ID"]."|".$row["Tag"]."|".$row["Title"]."|".$row["Text"]."|".$row["Date"].";";
    }
?>