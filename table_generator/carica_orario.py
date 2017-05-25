##IMPORT
import mysql.connector


##DOC
__author__ = 'Elia Semprebon'
__description__ = "Carica l'orario nella time table"


##VARIABILI
global boolD
boolD = True

##FUNZIONI
def fn_creaconnesione():
    connessione = mysql.connector.connect(user='root', password='',host='127.0.0.1',database='marconitt')
    return connessione


def fn_caricaorario():
    connessione = fn_creaconnesione()
    connessione2 = fn_creaconnesione()
    connessione3 = fn_creaconnesione()
    cursore = connessione.cursor()
    cursore2 = connessione2.cursor()
    cursore3 = connessione3.cursor()
    query = "SELECT `Column 1`, `Column 2`, `Column 4`, `Column 5`, `Column 6` FROM GPU001 WHERE(`Column 1`IS NOT NULL AND `Column 4` IS NOT NULL AND `Column 5` IS NOT NULL AND `Column 6` IS NOT NULL);"
    cursore.execute(query)
    cont = 0
    appo = 500
    prof1 = True
    prof2 = False
    nomeProfessore = ""
    
    for classe, prof, aula, giorno, ora in cursore:
        if (classe != "D1" and classe != "RIC"):
            query = "SELECT DISTINCT professore1 FROM timetable WHERE (stanza = '" + aula + "' AND giorno_settimana = " + giorno + " AND ora = " + ora + ");"
            cursore2.execute(query)
            
            for profe in cursore2:
                profe = str(profe)
                profe = profe.replace("(", "")
                profe = profe.replace(")", "")
                profe = profe.replace(",", "")
                
                if(profe != "None"):
                    #print("E' il secondo")
                    prof1 = False

            if(prof1 == False):
                prof2 = True

            query = "SELECT `Column 1` FROM GPU004 WHERE `Column 0` = '" + prof + "';"
            cursore3.execute(query)

            for p in cursore3:
                p = str(p)
                p = p.replace("(", "")
                p = p.replace(")", "")
                p = p.replace(",", "")
                p = p.replace("u'", "")
                p = p.replace("'", "")
                nomeProfessore = p
    
            if(prof1):
                query = "UPDATE timetable SET professore1 = '" + nomeProfessore + "' WHERE (stanza = '" + aula + "' AND giorno_settimana = " + giorno + " AND ora = " + ora + ");"
            elif(prof2):
                query = "UPDATE timetable SET professore2 = '" + nomeProfessore + "' WHERE (stanza = '" + aula + "' AND giorno_settimana = " + giorno + " AND ora = " + ora + ");"

            cursore2.execute(query)
            query = "UPDATE timetable SET risorsa = '" + classe + "' WHERE (stanza = '" + aula + "' AND giorno_settimana = " + giorno + " AND ora = " + ora + ");"
            cursore2.execute(query)
            cont = cont + 1

            if(cont == appo):
                print(appo)
                appo += 500
                connessione2.commit()
                cursore2.close()
                connessione2.close()
                connessione2 = fn_creaconnesione()
                cursore2 = connessione2.cursor()
                connessione3.commit()
                cursore3.close()
                connessione3.close()
                connessione3 = fn_creaconnesione()
                cursore3 = connessione3.cursor()

            prof1 = True
            prof2 = False

    query = "UPDATE timetable SET professore2 = NULL WHERE professore2 = professore1;"

    connessione2.commit()
    cursore.close()
    connessione.close()
    cursore2.close()
    connessione2.close()
    connessione3.commit()
    cursore3.close()
    connessione3.close()

    
##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_caricaorario()
    
    if(boolD):
        print("Fine programma")
