<?php

$resp = array(
	'success' => false,
);

$path = "../uploads";

if (array_key_exists('file', $_POST) and is_file("{$path}/{$_POST['file']}"))
{
	$resp['success'] = unlink("{$path}/{$_POST['file']}");
}

header('Content-type: application/json');

echo json_encode($resp);