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

	$client_projectID = $_POST["ProjectID"];

	$sql = "SELECT * FROM projects WHERE ID = ".$client_projectID ;
	$result = mysqli_query($conn, $sql);

	$dataProject = array();
	$tasks = array();
	$participants = array();

	if(mysqli_num_rows($result) == 0){
		echo "404";
	} else  {
		while ($row = mysqli_fetch_array($result)) {
			$dataProject = array('ID' => $row['ID'], 'projectName' => $row['ProjectName'], 'description' => $row['Description'], 'projectAdminID' => $row['ProjectAdminID']);
		}

		$sql = "SELECT * FROM project_tasks WHERE ProjectID = ".$client_projectID;
		$result = mysqli_query($conn, $sql);

		while ($row = mysqli_fetch_array($result)) {
			array_push($tasks, $temp = array('id' => $row['ID'], 'title' => $row['Title'], 'description' => $row['Description'], 'endDate' => $row['EndDate'], 'duration' => $row['Duration'], 'participantID' => $row['ParticipantID']));
		}
		$dataProject['tasks'] = $tasks;

		$sql = "SELECT * FROM projects_participants WHERE ProjectID = ".$client_projectID;
		$result = mysqli_query($conn, $sql);

		while ($row = mysqli_fetch_array($result)) {
			array_push($participants, $temp = array('id' => $row['ID'], 'participantsID' => $row['ParticipantsID'], 'participantsUsername' => $row['ParticipantsUsername']));
		}
		$dataProject['participants'] = $participants;
		echo json_encode($dataProject);
	}
?>