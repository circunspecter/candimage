<?php

$path = "../uploads";

$images = array();

if (is_dir($path) and chdir($path))
{
	$images = array();

	foreach (glob("*.{jpg,jpeg,gif,png}", GLOB_BRACE) as $file)
	{
		$images[] = array(
			'imgUrl'  => "uploads/{$file}",
			'imgName' => pathinfo($file, PATHINFO_FILENAME),
		);
	}
}

header('Content-type: application/json');

echo json_encode($images);