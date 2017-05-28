	<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	header('Access-Control-Allow-Origin: *');  
	$mysqli = new mysqli("localhost", "root", "", "marconitt");
	
    if (isset($_GET["prenotazioni"])) {
		echo json_encode(getPrenotazioni($mysqli, $_GET["prenotazioni"]));
    } else if (isset($_GET["prenotazionidaapprovare"])) {
		echo json_encode(getPrenotazioniDaApprovare($mysqli, $_GET["prenotazionidaapprovare"]));
    } else if (isset($_GET["prenotazioniadmin"])) {
		echo json_encode(getPrenotazioniAdmin($mysqli, $_GET["prenotazioniadmin"]));
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
    } else if (isset($_GET["classeventsbyday"])) {
        echo json_encode(getClassEventsByDay($mysqli, $_GET["classe"], $_GET["day"])); 					
	} else if (isset($_GET["roomsbydate"])) {
		echo json_encode(getRoomsByDate($mysqli,$_GET["roomsbydate"]));
	} else if (isset($_GET["classroomsbydate"])) {
		echo json_encode(getClassRoomsByDate($mysqli,$_GET["classroomsbydate"]));	
	} else if (isset($_GET["labroomsbydate"])) {
		echo json_encode(getLabRoomsByDate($mysqli,$_GET["labroomsbydate"]));	
	} else if (isset($_GET["isholiday"])) {
		echo json_encode(isHoliday($mysqli,$_GET["isholiday"]));	
	} else {
		echo json_encode(getOptions($mysqli));
	}
	
	/**
        Chiamata di default, ritorna un oggetto contenente 3 array:
            - classes (lista delle classi)
            - teachers (lista dei professori)
            - rooms (lista delle stanze(aule + laboratori))
            - classrooms (lista delle aule)
            - labs (lista dei laboratori)
            - projects (lista dei progetti)
            - eventsrooms (aule per eventi)
        @param $mysqli
        @return {object}
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
		
		// Stanze
        if ($result = $mysqli->query("SELECT * FROM aule ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){
				array_push($aule,$c[0]);
			}
			$options->rooms = $aule;
		}
        
        // progetti
        if ($result = $mysqli->query("SELECT DISTINCT progetto FROM progetti ORDER BY progetto")) {
			$prj = array();
			while($c = $result->fetch_array()){			
				array_push($prj,$c[0]);
			}
			$options->projects = $prj;
		}
        
        // solo aule
        if ($result = $mysqli->query("SELECT * FROM aule where aula like 'A%' ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->classrooms = $aule;
		}
        
        // solo laboratori
        if ($result = $mysqli->query("SELECT * FROM aule where aula like 'L%' ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->labs = $aule;
		}
        
        // aule per eventi
        if ($result = $mysqli->query("SELECT * FROM aule_eventi ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				array_push($aule,$c[0]);
			}
			$options->eventsrooms = $aule;
		}        
		
		return $options;
	}    
	
	// ====================== API timetable ==================================
    	
    /**
       Ritorna "la timetable" di tutte le stanze(aule + laboratori) in un giorno,
       è un array di oggetti (stanza:[lista dei recordi])
       @param $mysqli
       @param $data
       @return {object}
     */
	function getRoomsByDate($mysqli, $data) {
		$options = new stdClass();
        
		if ($result = $mysqli->query("SELECT * FROM aule ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
    /**
       Ritorna "la timetable" di tutte le aule in un giorno,
       è un array di oggetti (stanza:[lista dei recordi])
       @param $mysqli
       @param $data
       @return {object}
     */
	function getClassRoomsByDate($mysqli, $data) {
		$options = new stdClass();
		
		if ($result = $mysqli->query("SELECT * FROM aule WHERE aule.aula like 'A%' ORDER BY aula")) {
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
    /**
       Ritorna "la timetable" di tutti i laboratori in un giorno,
       è un array di oggetti (stanza:[lista dei recordi])
       @param $mysqli
       @param $data
       @return {object}
     */
	function getLabRoomsByDate($mysqli, $data) {
		$options = new stdClass();
		
		if ($result = $mysqli->query("SELECT * FROM aule WHERE aule.aula like 'L%' ORDER BY aula")) {			
			$aule = array();
			while($c = $result->fetch_array()){			
				$aule[$c[0]] = getRoomByDate($mysqli, $c[0], $data);
			}
			$options->rooms = $aule;
		}
		return $options;	
	}
	
    /**
        Ritorna i record di una stanza in un giorno
        @param $mysqli
        @param $room
        @param $data
        @return {array}
     */
	function getRoomByDate($mysqli, $room, $data) {
		$celle = array();
		if ($result = $mysqli->query("SELECT giorno, ora, stanza, risorsa, giorno_settimana FROM timetable WHERE stanza = '$room' AND giorno = '$data' ORDER BY ora * 1")) {
			while($c = $result->fetch_array()){			
				array_push($celle,$c);
			}
		}
		return $celle;
	}
    
    /**
        Ritorna tutte le prenotazioni di un utente
        @param $mysqli
        @param $user
        @return {array}
     */
    function getPrenotazioni($mysqli, $user) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata, who FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id WHERE who='$user' ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }  
    
    /**
        Ritorna tutte le prenotazioni non approvate (approvata = false)
        @parm mysqli
        @return {array}
     */
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

    /**
        Ritorna tutte le prenotazione eccetto quelle effettuate dall'admin
        @param $mysqli
        @return {array}
     */
    function getPrenotazioniExceptAdmin($mysqli) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata, GPU004.`column 1` as user, who FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id INNER JOIN users ON users.username=prenotazioni.who INNER JOIN GPU004 ON who=GPU004.`column 0` WHERE users.admin=false ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }     

    /**
        Ritorna tutte le prenotazione eccetto quelle effettuate dall'admin
        @param $mysqli
        @return {array}
     */
    function getPrenotazioniAdmin($mysqli) {
		$celle = array();
        $query = "SELECT giorno, stanza, risorsa, ora, approvata, GPU004.`column 1` as user, who FROM timetable INNER JOIN prenotazioni ON timetable.id=prenotazioni.id INNER JOIN users ON users.username=prenotazioni.who INNER JOIN GPU004 ON who=GPU004.`column 0` WHERE users.admin=true ORDER BY giorno DESC, ora";
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }  

    /**
        Ritorna tutte le classi di un professore
        @param $mysqli
        @param $teacher
        @return {array}
     */
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

    /**
        Ritorna tutti gli eventi di un mese
        @param $mysqli
        @param $month
        @return {array}
     */
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

    /**
        Ritorna tutti gli eventi di un giorno
        @param $mysqli
        @param $day
        @return {array}
     */
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

    /**
        Ritorna tutti gli eventi
        @param $mysqli
        @return {array}
     */
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

    /**
        Ritorna il numero di eventi di ogni giorno di un mese
        @param $mysqli
        @param $month
        @return {array}
     */
    function getEventsCountByMonth($mysqli, $month) {
		$query = "SELECT giorno, COUNT(giorno) as quantity FROM `eventi` WHERE month(giorno) = $month GROUP BY giorno";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    /**
        Ritorna "la timetable" di una stanza in un giorno
        @param $mysqli
        @param $room
        @param $day
        @return {array}
    */
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

    /**
        Ritorna "la timetable" di un professore in un giorno
        @param $mysqli
        @param $teacher
        @param $day
        @return {array}
     */
    function getTTTeacherByDay($mysqli, $teacher, $day) {
        $query = "select * from timetable where (professore1 = '$teacher' or professore2 = '$teacher') and giorno = '$day' order by ora";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    /**
        Ritorna gli eventi di un professore in un giorno
        @param $mysqli
        @param $teacher
        @param $day
        @return {array}
    */
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
    
    /**
        Ritorna le liberazioni di una classi in un giorno
        @param $mysqli
        @param $class
        @param $day
        @return {array}
    */
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

    /**
        Ritorna "la timetable" di una classe in un giorno
        @param $mysqli
        @param $class
        @param $day
        @return {array}
     */
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

    /**
        Ritorna gli eventi di una classe in un giorno
        @param $mysqli
        @param $class
        @param $day
        @return {array}
     */
    function getClassEventsByDay($mysqli, $class, $day) {
        $query = "select eventi.descrizione, eventi.stanze, prof_eventi.ora, prof_eventi.professori from eventi inner join prof_eventi on eventi.id = prof_eventi.id where eventi.giorno = '$day' and eventi.classi like '%$class%' order by oraInizio;";
		$celle = array();
        
		if ($result = $mysqli->query($query)) {
        	while($c = $result->fetch_array()){
				array_push($celle,$c);
			}
		}
		return $celle;
    }

    /**
        Dice se un giorno è vacanza oppure no
        @param $mysqli
        @param $day
        @return {boolean}
     */
    function isHoliday($mysqli, $day) {
        $query = "SELECT * FROM timetable WHERE giorno='$day'";
        $result = $mysqli->query($query);
		return $result->num_rows === 0;
    }

?>
