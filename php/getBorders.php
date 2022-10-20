<?php

    $executionStartTime = microtime(true);

    $countryList = json_decode(file_get_contents("./countryBorders.json"), true);

    $loop = $countryList['features'];
    $country=[];

    $iso2 = $_REQUEST['iso2'];
    for ($x = 0; $x < count($loop); $x++ ){
        if($iso2 == $countryList['features'][$x]['properties']['iso_a2'])
        {
            $a[0] = $countryList['features'][$x]['properties']['iso_a2'];
            $a[1] = $countryList['features'][$x]['geometry'];

            array_push($country, $a);

        }
    }


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>




