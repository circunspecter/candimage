<?php

$resp = array(
	'success' => false,
	'message' => 'Oops...',
);

if ($image = $_FILES['image'])
{
	$fileName = time().'.'.pathinfo($image['name'], PATHINFO_EXTENSION);

	if (copy($image['tmp_name'], "../uploads/{$fileName}"))
	{
		$resp = array(
			'success' => true,
			'message' => 'Image uploaded successfully',
			'imgUrl'  => "uploads/{$fileName}",
			'imgName' => $fileName,
		);
	}
}

header('Content-type: application/json');

echo json_encode($resp);