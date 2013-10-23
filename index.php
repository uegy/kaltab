<?php

session_start();
if(isset($_SESSION['text'])){
	echo "<p>".$_SESSION['text']."</p>";
	session_unset();
}


$db = new PDO('mysql:host=localhost;dbname=kaldb', 'kaltab', 'cnc390cnc');

$stms = $db->prepare('SELECT * from kaltab WHERE Type= :type');
$args = array(':type' => '*');
var_dump($_GET);
if(sizeof($_GET) > 0){
	if(isset($_GET['type'])){
		$args[':type'] = $_GET['type'];
	}
	
	if(isset($_GET['text'])){
		$_SESSION['text'] = $_GET['text'];
	}

	$stms->execute($args);
	require 'table.php';
}else{
	//require 'form.php';
	require 'kalmask.php';
}


?>


