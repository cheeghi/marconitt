<?php
 header('Access-Control-Allow-Origin: *');  
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$guid = '**GUID**';
$anno_scol = "2015";
$cid = 'VRIT0007';
$login = 'VRIT0007.client2';
$password = '**PASSWORD**';

$data = $_GET['data']; //AAAA-MM-GG

          try {
              $options = array(
             //    'soap_version'=>SOAP_1_2,
                  'exceptions'=>true,
                  'trace'=>1,
                  'cache_wsdl'=>WSDL_CACHE_NONE
              );
             $client = new SoapClient('https://web.spaggiari.eu/services/ws/wsExtData.php?wsdl',$options);


             $result = $client->__soapCall("wsExtData..downloadAgenda",
                  array(
                    'client_guid' => $guid,
                    'anno_scol' => $anno_scol,
                    'sede_codice'=>$cid,
                    'login'=>$login,
                    'password'=>$password,
					         'dal'=>$data,
                    'al'=>$data,
					       'special_request'=>""
                  )
              );
          } catch (Exception $e) {
             echo "Exception Error:";
          //  print($e->getMessage()."\n");
              die();
          }

      $file = time()."_agenda.zip";
      //print_r($file);
      file_put_contents(  $file , $result->data);
      $result->data = "Data saved to file: $file";

      //Estrazione csv
      $zip = new ZipArchive;
      $res = $zip->open($file);
      $time = time();
      if ($res === TRUE) {
        $zip->extractTo('agenda/'.$time.'/');
        $zip->close();
        unlink(time()."_agenda.zip");
      } else {
      }


      //Correzione csv
      $fileName = "agenda/$time/agenda.csv";
      $destionationFile = "agenda/".$time.".csv";
      $file = file_get_contents($fileName);
      $tmpFile = preg_replace("/(\r?\n){2,}/", " ", $file);
      $tmpFile = str_replace(array("\n", "\r"), ' ', $tmpFile);
        $csv = str_getcsv($tmpFile,";");
        $count = 0;
        file_put_contents($destionationFile, "");
        foreach ($csv as $key => $value) {
          if ($count % 13 == 0 && $count != 0 && $count < sizeOf($csv)-1) {
            file_put_contents($destionationFile, explode(" ", $csv[$count])[0]."\n", FILE_APPEND | LOCK_EX);
            file_put_contents($destionationFile, explode(" ", $csv[$count])[1].";", FILE_APPEND | LOCK_EX);
          } else {
            if ($count == sizeOf($csv)-1) {
              file_put_contents($destionationFile, $csv[$count], FILE_APPEND | LOCK_EX);
            } else {
              file_put_contents($destionationFile, $csv[$count].";", FILE_APPEND | LOCK_EX);
            }
          }
          $count++;
        }

        unlink($fileName);
        rmdir('agenda/'.$time.'/');

        //Restituzione JSON
        $ok = false;
      $fileData=fopen($destionationFile,'r');
        $events = array();
        while($row=fgets($fileData)){  
        // can parse further $row by usingstr_getcsv
          $event = new stdClass();
          $row = str_getcsv($row,";");
          if (count($row) == 14 && $ok && $row[6] != "") {
            $event->description = $row[6];
            $event->hour_start = $row[8];
            $event->hour_end = $row[10];
            $event->who = [substr($row[1], 0, 3), strtolower($row[3])];
            array_push($events, $event);
          }
            $ok = true;
       }

      //$final = json_encode($events);
      //$final = preg_replace('/"([a-zA-Z]+[a-zA-Z0-9_]*)":/','$1:',$final);
      echo json_encode($events);

      unlink($destionationFile);

     die();
?>
