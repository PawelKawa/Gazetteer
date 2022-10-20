<?php

    $executionStartTime = microtime(true);

    $countryList = json_decode(file_get_contents("./countryBorders.json"), true);

    $loop = $countryList['features'];
    $country=[];

    for ($x = 0; $x < count($loop); $x++ ){
        
        $a[0] = $countryList['features'][$x]['properties']['name'];
        $a[1] = $countryList['features'][$x]['properties']['iso_a2'];
        array_push($country, $a);
    }



    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>




