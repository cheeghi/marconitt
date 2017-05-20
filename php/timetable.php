	<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	header('Access-Control-Allow-Origin: *');  
	$mysqli = new mysqli("localhost", "root", "", "marconitt"); //connessione marconitt.altervista.org
	//$mysqliOrario = new mysqli("localhost", "root", "", "marconitt"); //connessione marconitt.altervista.org
	
	//var_dump($_GET);
	
	/*if (isset($_GET["room"])) {
		echo json_encode(getOrarioRoom($mysqli,$_GET["room"]));
	} elseif (isset($_GET["class"])) {
		echo json_encode(getOrarioClass($mysqli,$_GET["class"]));
	} elseif (isset($_GET["teacher"])) {
		echo json_encode(getOrarioTeacher($mysqli,$_GET["teacher"]));
	}  elseif (isset($_GET["legend"])) {
		echo json_encode(getLegend($mysqli));
	} elseif (isset($_GET["rooms"])) {
		echo json_encode(getOrarioRooms($mysqli,$_GET["rooms"]));
	} elseif (isset($_GET["classrooms"])) {
		echo json_encode(getOrarioClassRooms($mysqli,$_GET["classrooms"]));
	} elseif (isset($_GET["labrooms"])) {
		echo json_encode(getOrarioLabRooms($mysqli,$_GET["labrooms"]));	
	} elseif (isset($_GET["doquery"])) {
		echo json_encode(doquery($mysqli,$_GET["doquery"]));
    } elseif (isset($_GET["dochange"])) {
		echo json_encode(dochange($mysqli,$_GET["dochange"]));
    } elseif (isset($_GET["getindex"])) {
		echo json_encode(getindex($mysqli,$_GET["getindex"]));
    } else*/if (isset($_GET["prenotazioni"])) {
		echo json_encode(getPrenotazioni($mysqli, $_GET["prenotazioni"]));
    } else if (isset($_GET["prenotazionidaapprovare"])) {
		echo json_encode(getPrenotazioniDaApprovare($mysqli, $_GET["prenotazionidaapprovare"]));
    } else if (isset($_GET["prenotazioniexceptadmin"])) {
		echo json_encode(getPrenotazioniExceptAdmin($mysqli, $_GET["prenotazioniexceptadmin"]));
    } else if (isset($_GET["classesbyteacher"])) {
		echo json_encode(getClassesByTeacher($mysqli, $_GET["classesbyteacher"]));        
    } else if (isset($_GET["eventsbymonth"])) {
		echo json_encode(getEventsByMonth($mysqli, $_GET["eventsbymonth"])); 
    } else if (isset($_GET["eventscountbymonth"])) {
		echo json_encode(getEventsCountByMonth($mysqli, $_GET["eventscountbymonth"])); 		
    } else if (isset($_GET["eventsbyday"])) {
		echo json_encode(getEventsByDay($mysqli, $_GET["eventsbyday"])); 		
    } else if (isset($_GET["events"])) {
		echo json_encode(getEvents($mysqli, $_GET["events"])); 					
    } else if (isset($_GET["ttroombyday"])) {
        echo json_encode(getTTRoomByDay($mysqli, $_GET["stanza"], $_GET["day"])); 					
    } else if (isset($_GET["ttteacherbyday"])) {
        echo json_encode(getTTTeacherByDay($mysqli, $_GET["prof"], $_GET["day"])); 					
    } else if (isset($_GET["teachereventsbyday"])) {
        echo json_encode(getTeacherEventsByDay($mysqli, $_GET["prof"], $_GET["day"])); 					
    } else if (isset($_GET["liberazioniclassbyday"])) {
        echo json_encode(getLiberazioniClassByDay($mysqli, $_GET["classe"], $_GET["day"])); 					
    } else if (isset($_GET["ttclassbyday"])) {
        echo json_encode(getTTClassByDay($mysqli, $_GET["classe"], $_GET["day"])); 					
    } else if (isset($_GET["eventiclassbyday"])) {
        echo json_encode(getEventiClassByDay($mysqli, $_GET["classe"], $_GET["day"])); 					
	} elseif (isset($_GET["roomsbydate"])) {
		echo json_encode(getRoomsByDate($mysqli,$_GET["roomsbydate"]));
	} elseif (isset($_GET["classroomsbydate"])) {
		echo json_encode(getClassRoomsByDate($mysqli,$_GET["classroomsbydate"]));	
	} elseif (isset($_GET["labroomsbydate"])) {
		echo json_encode(getLabRoomsByDate($mysqli,$_GET["labroomsbydate"]));	
	} elseif (isset($_GET["isholiday"])) {
		echo json_encode(isHoliday($mysqli,$_GET["isholiday"]));	
	} else {
		echo json_encode(getOptions($mysqli));
	}
	
	/*
		Ritorna 3 array:
			- classes (lista delle classi)
			- teachers (lista dei professori)
			- rooms (lista delle aule)
	*/
	function getOptions($mysqli) { 
		
		$options = new stdClass();
		
		// Classi
		if ($result = $mysqli->query("SELECT DISTINCT `Column 1` FROM `GPU001` where `Column 1` NOT IN ('', 'RIC', 'D1', 'ALT') ORDER BY `Column 1`")) {
			$classi = array();
			while($c = $result->fetch_array()){			
				array_push($classi,$c[0]);
			}
			$options->classes = $classi;
		}
		
		// Prof
		if ($result = $mysqli->query("SELECT DISTINCT b.`Column 1` FROM `GPU001` a INNER JOIN `GPU004` b ON a.`Column 2` = b.`Column 0` ORDER BY b.`Column 1`")) {
            $prof = array();
			while($c = $result->fetch_array()){			
				array_push($prof,$c[0]);
			}
			$options->teachers = $prof;
		}
		
		// Aule
		if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` where `Column 4` != '' ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->rooms = $aule;
		}
        
        //progetti
        if ($result = $mysqli->query("SELECT DISTINCT progetto FROM progetti ORDER BY progetto")) {
			$prj = array();
			while($c = $result->fetch_array()){			
				array_push($prj,$c[0]);
			}
			$options->projects = $prj;
		}
        
        //solo aule
        if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` where `Column 4` like 'A%' ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->classrooms = $aule;
		}
        
        //solo laboratori
        if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` where `Column 4` like 'L%' ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->labs = $aule;
		}
		
		return $options;
	}
	
	/*
		Data in input un'aula, ritorna l'orario di quell'aula
	*/
	function getOrarioRoom($mysqli,$room) {
		$celle = array();
		if ($result = $mysqli->query("SELECT GPU001.`Column 1` as classe, GPU004.`Column 1` as prof, GPU001.`Column 3` as materia, GPU001.`Column 5` as giorno, GPU001.`Column 6` as ora FROM GPU001 INNER JOIN (SELECT DISTINCT `Column 0`,`Column 1` FROM GPU004) AS GPU004 ON GPU004.`Column 0` = GPU001.`Column 2` WHERE GPU001.`Column 4` = '$room' AND GPU001.versione = (SELECT MAX(versione) FROM GPU001) ORDER BY GPU001.`Column 5`,GPU001.`Column 6`")) {
        //if ($result = $mysqli->query("SELECT timetable.id as id, timetable.professore1 as prof1, timetable.giorno_settimana as giorno, timetable.ora as ora FROM timetable WHERE timetable.stanza = '$room' ORDER BY timetable.giorno_settimana ,timetable.ora")) {	
            while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
	}
	
	/*
		Dato in input un professore, ritorna l'orario di quel professore
	*/
	function getOrarioTeacher($mysqli,$teacher) {
		$celle = array();
		if ($result = $mysqli->query("SELECT `Column 1` as classe, `Column 3` as materia, `Column 4` as aula, `Column 5` as giorno, IF(`Column 6`>4,`Column 6`+2,IF(`Column 6`>2,`Column 6`+1,`Column 6`)) as ora FROM GPU001 WHERE `Column 2` = (SELECT DISTINCT `Column 0` from GPU004 WHERE `Column 1` = '$teacher') AND versione = (SELECT MAX(versione) FROM GPU001) UNION SELECT NULL,NULL,`Column 0`,`Column 2`,IF(`Column 3` = 5, 6, `Column 3`) FROM `GPU009` where `Column 1` = (SELECT DISTINCT `Column 0` from GPU004 WHERE `Column 1` = '$teacher') and versione = (SELECT MAX(versione) FROM GPU001)")) {
			while($c = $result->fetch_array()){			
				array_push($celle,$c);
			}
		}
		return $celle;
	}
	
	/*
		Data in input una classe, ritorna l'orario di quella classe
	*/
	function getOrarioClass($mysqli,$class) {
		$celle = array();
		if ($result = $mysqli->query("SELECT b.`Column 1` as prof, a.`Column 3` as materia, a.`Column 4` as aula, a.`Column 5` as giorno, a.`Column 6` as ora, b.`Column 22` as 'concorso' FROM GPU001 a INNER JOIN (SELECT distinct `Column 0`, `Column 1`,`Column 22` FROM `GPU004`) b ON a.`Column 2`= b.`Column 0` WHERE a.`Column 1` = '$class' AND a.versione = (SELECT MAX(versione) FROM GPU001) ORDER BY a.`Column 5`,a.`Column 6`")) {
			while($c = $result->fetch_array()){			
				array_push($celle,$c);
			}
		}
		return $celle;
	}

	/*
		Ritorna la legenda
	*/
	function getLegend($mysqli) {
		$row = array();
		if ($result = $mysqli->query("SELECT `Column 0` as sigla,`Column 1` as nome FROM `GPU007` WHERE versione = (SELECT MAX(versione) FROM GPUVersione) ORDER BY `Column 0`")) {
			while($c = $result->fetch_array()){			
				array_push($row,$c);
			}
		}
		return $row;
	}
	
	/*
		Ritorna l'orario di tutte le aule
	*/
	function getOrarioRooms($mysqli) {
		$options = new stdClass();
		
		if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getOrarioRoom($mysqli, $c[0]);
			}
			$options->rooms = $aule;
		}
		return $options;
	}
	
	/*
		Ritorna l'orario di tutte le aule (no i laboratori)
	*/	
	function getOrarioClassRooms($mysqli) {
		$options = new stdClass();
		
		if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` WHERE `GPU001`.`Column 4` like 'A%' ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getOrarioRoom($mysqli, $c[0]);
			}
			$options->rooms = $aule;
		}
		return $options;
	}
	
	/*
		Ritorna l'orario di tutti i laboratori (no le aule)
	*/		
	function getOrarioLabRooms($mysqli) {
		$options = new stdClass();
		
		if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` WHERE `GPU001`.`Column 4` like 'L%' ORDER BY `Column 4`")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getOrarioRoom($mysqli, $c[0]);
			}
			$options->rooms = $aule;
		}
		return $options;
	}

	/*
		esegue una query su db
	*/
	/* function doquery($mysqli, $query) {
		$mysqli->query($query);
        return $query;
      }*/
    
    //funzione che permette di eseguire funzioni di manipulation sul DB
    
    function dochange($mysqli, $query) {
    	if ($result = $mysqli->query($query)) {
        	return $result;
        }
	}
    
    //funzione che permette di eseguire funzioni di retrieve sul DB
        
    function doquery($mysqli, $query) {
    $result = $mysqli->query($query);
    $rows = array();
    	//if ($result = $mysqli->query($query)) {
    	if ($result->num_rows > 0) {
        	while($r = $result->fetch_array()) {
    			array_push($rows,$r);
        	}
        }
        return $rows;
	}
    
    //ritorna un indice
    
    function getindex($mysqli, $query) {
    $result = $mysqli->query($query);
    $rows = "";
    	if ($result->num_rows > 0) {
        	while($r = $result->fetch_array()) {
        		//$rows = $r[0] + " ; " + $rows;
                $rows = $r[0];
                }
        }
        //print gettype($rows);
        return $rows;
	}
	
    
	
	
	
	// ====================== API timetable ==================================
    
    function getOrarioTTRoom($mysqli,$room,$date) {
		$celle = array();
		//if ($result = $mysqli->query("SELECT * from timetable where timetable.stanza = '$room'")) {
        if ($result = $mysqli->query("SELECT timetable.risorsa as classe, timetable.professore1 as prof1, timetable.giorno_settimana as giorno, timetable.ora as ora FROM timetable WHERE timetable.stanza = '$room' ORDER BY timetable.giorno_settimana ,timetable.ora")) {	
            //SELECT GPU001.`Column 1` as classe, GPU004.`Column 1` as prof, GPU001.`Column 3` as materia, GPU001.`Column 5` as giorno, GPU001.`Column 6` as ora FROM GPU001 INNER JOIN (SELECT DISTINCT `Column 0`,`Column 1` FROM GPU004) AS GPU004 ON GPU004.`Column 0` = GPU001.`Column 2` WHERE GPU001.`Column 4` = '$room' AND GPU001.versione = (SELECT MAX(versione) FROM GPU001) ORDER BY GPU001.`Column 5`,GPU001.`Column 6`
            while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
	}
    
    
	
	function getRoomsByDate($mysqli, $data) {
		$options = new stdClass();
		
		//if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` ORDER BY `Column 4`")) {
		if ($result = $mysqli->query("SELECT * FROM aule ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
	function getClassRoomsByDate($mysqli, $data) {
		$options = new stdClass();
		
		//if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` WHERE `GPU001`.`Column 4` like 'A%' ORDER BY `Column 4`")) {
		if ($result = $mysqli->query("SELECT * FROM aule WHERE aule.aula like 'A%' ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
	function getLabRoomsByDate($mysqli, $data) {
		$options = new stdClass();
		
		//if ($result = $mysqli->query("SELECT DISTINCT `Column 4` FROM `GPU001` WHERE `GPU001`.`Column 4` like 'L%' ORDER BY `Column 4`")) {
		if ($result = $mysqli->query("SELECT * FROM aule WHERE aule.aula like 'L%' ORDER BY aula")) {			
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
	function getRoomByDate($mysqli, $room, $data) {
		$celle = array();
		if ($result = $mysqli->query("SELECT giorno, ora, stanza, risorsa, giorno_settimana FROM timetable WHERE stanza = '$room' AND giorno = '$data' ORDER BY ora * 1")) {
			while($c = $result->fetch_array()){			
				array_push($celle,$c);
			}
		}
		return $celle;
	}
    
    function getPrenotazioni($mysqli, $user) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id WHERE who='$user' ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }  
    
    function getPrenotazioniDaApprovare($mysqli) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata, who FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id WHERE approvata=false ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }  

    function getPrenotazioniExceptAdmin($mysqli) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata, who FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id WHERE who != 'admin' ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }      

    function getClassesByTeacher($mysqli, $teacher) {
		$celle = array();
        $query = "SELECT distinct `column 1` FROM `GPU001` WHERE `column 2`='$teacher' AND `column 1` NOT IN ('', 'RIC', 'D1', 'ALT') ORDER BY `column 1`";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c[0]);
			}
		}
		return $celle;
    }

    function getEventsByMonth($mysqli, $month) {
		$celle = array();
        $query = "SELECT * FROM eventi WHERE month(giorno) = $month ORDER BY giorno";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getEventsByDay($mysqli, $day) {
		$celle = array();
        $query = "SELECT * FROM eventi WHERE giorno='$day' ORDER BY giorno";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getEvents($mysqli) {
		$celle = array();
        $query = "SELECT * FROM eventi ORDER BY giorno DESC";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getEventsCountByMonth($mysqli, $month) {
		$query = "SELECT giorno, COUNT(giorno) as quantity FROM `eventi` WHERE month(giorno) = $month GROUP BY giorno";

		$celle = array();
        //$query = "SELECT * FROM eventi WHERE month(giorno) = $month ORDER BY giorno";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getTTRoomByDay($mysqli, $room, $day) {
        $query = "select * from timetable where stanza = '$room' and giorno = '$day' order by ora";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getTTTeacherByDay($mysqli, $teacher, $day) {
        $query = "select * from timetable where (professore1 = '$teacher' or professore2 = '$teacher' or professoreS = '$teacher') and giorno = '$day' order by ora";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getTeacherEventsByDay($mysqli, $teacher, $day) {
        $query = "select distinct eventi.descrizione, eventi.stanze, prof_eventi.ora from eventi inner join prof_eventi on eventi.id = prof_eventi.id where eventi.giorno = '$day' and prof_eventi.professori like '%$teacher%' order by oraInizio";             
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }
    
    function getLiberazioniClassByDay($mysqli, $class, $day) {
        $query = "select liberazione.descrizione, prof_liberazione.professori, prof_liberazione.ora from liberazione inner join prof_liberazione on liberazione.id = prof_liberazione.liberazione where liberazione.classe = '$class' and giorno = '$day' order by ora";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getTTClassByDay($mysqli, $class, $day) {
        $query = "select * from timetable where risorsa = '$class' and giorno = '$day' order by ora";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function getEventiClassByDay($mysqli, $class, $day) {
        $query = "select eventi.descrizione, eventi.stanze, prof_eventi.ora, prof_eventi.professori from eventi inner join prof_eventi on eventi.id = prof_eventi.id where eventi.giorno = '$day' and eventi.classi like '%$class%' order by oraInizio;";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    function isHoliday($mysqli, $day) {
        $query = "SELECT * FROM timetable WHERE giorno='$day'";
        $result = $mysqli->query($query);
		return $result->num_rows === 0;
    }

?>
