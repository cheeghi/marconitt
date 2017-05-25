# DOCUMENTAZIONE setup di MarconiTT
-------------
**@author** MarconiTT team <br>
**@date** 21-05-2017 <br>
**@version** 1.0 <br><br>
Istruzioni per fare il setup dell'applicazione per il nuovo anno scolastico.

-------------
<br>

## Step 1
Eseguire il programma Python get_dati.py<br>
Questo programma serve per salvare su files .csv i dati dell'anno scolastico precedente.
<br><br>


## Step 2
Inserire correttamente le vacanze nel file vacanze.csv<br>
Inserire correttamente la data di inizio e fine scuola nel file periodo.csv
<br><br>


## Step 3
Eseguire il programma Python aule.py<br>
Inserire nella tabella aule del Database le aule non usate nell'orario, come laboratori per le verifiche, etc.<br>
Attenzione: Non aggiungere le aule 304, 042 o Aula Magna(le aule per gli eventi);
<br><br>


## Step 4
Aggiungere/rimuovere nella tabella aule_eventi le aule utilizzate per la sezione eventi.
<br><br>


## Step 5
Eseguire il programma Python generator.py<br>
In questo modo saranno svuotate tutte le tabelle del DataBase e verrà ricreata la tabella timetable.
<br><br>


## Step 6
Svuotare ed reinserire le tabelle gpu001 (orario scolastico) e gpu0004 (professori).<br>
Eseguire il programma Python carica_orario.py, per caricare l'orario nella timetable.<br>
Attenzione:  l'esecuzione di tale programma richiede diversi minuti.
<br><br>


## Step 7
Eseguire il programma Python carica_utenti.py<br>
Saranno così inseriti gli utenti nella tabella users.<br>
Inserire a mano gli utenti per l'ufficio protocollo(admin).
<br><br>


## Step 8
Inserire nella tabella progetti i vari progetti scolastici che possono richiedere aule da prenotare.
<br><br>


## Step 9
Ogni qual volta cambia l'orario, eseguire il programma Python cambia_orario.py