##IMPORT
import mysql.connector


##DOC
__author__ = 'Elia Semprebon'
__description__ = "Carica l'orario nella tabella centrale"


##VARIABILI
global boolD
#global connessione
boolD = True



##FUNZIONI
def fn_creaconnesione():
    connessione = mysql.connector.connect(user='root', password='',host='127.0.0.1',database='marconitt')
    return connessione


def fn_caricaorario():
    connessione = fn_creaconnesione()
    connessione2 = fn_creaconnesione()
    cursore = connessione.cursor()
    cursore2 = connessione2.cursor()
    query = "SELECT `Column 1`, `Column 4`, `Column 5`, `Column 6` FROM GPU001 WHERE(`Column 1`IS NOT NULL AND `Column 4` IS NOT NULL AND `Column 5` IS NOT NULL AND `Column 6` IS NOT NULL);"
    cursore.execute(query)
    cont = 0
    appo = 1000
    
    for classe, aula, giorno, ora in cursore:
        if (classe != "D1" and classe != "RIC"):
            query = "UPDATE timetable SET risorsa = '" + classe + "' WHERE (stanza = '" + aula + "' AND giorno_settimana = " + giorno + " AND ora = " + ora + ");"
            cont = cont + 1

            if(cont == appo):
                appo += 1000
                connessione2.commit()
                cursore2.close()
                connessione2.close()
                connessione2 = fn_creaconnesione()
                cursore2 = connessione2.cursor()
                
            cursore2.execute(query)

    connessione2.commit()
    cursore.close()
    connessione.close()
    cursore2.close()
    connessione2.close()

    
##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_caricaorario()
    
    if(boolD):
        print("Fine programma")
