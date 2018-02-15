<?php
//connect to server
	$Server_Name = "localhost";
	$Server_Username = "root";
	$Server_Password = "";
	$Database_Name = "avvent";

	$conn = new mysqli($Server_Name, $Server_Username, $Server_Password, $Database_Name);

	if(!$conn){
		die("Connection Failed. ". mysqli_connect_error());
	}

	$offset = $_POST['Offset'];

	$sql = "SELECT * FROM projects LIMIT 3 OFFSET ".$offset ;
	$result = mysqli_query($conn, $sql);

	$ProjectsArray = array();
	if(mysqli_num_rows($result) == 0){
		echo "404";
	} else  {
		while ($row = mysqli_fetch_array($result)) {
			array_push($ProjectsArray, $arrayName = array('id' => $row['ID'], 'projectName' => $row['ProjectName'], 'description' => $row['Description'], 'projectAdminID' => $row['ProjectAdminID']));
		}
		echo json_encode($ProjectsArray);
	}
?>