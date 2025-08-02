//Dieser Code dient zur Simulation realistischer API-Nutzungsdaten
//LocalStorage.clear() // Entfernt alle gespeicherten Daten im LocalStorage, z.B. für Debugging
// Definition eines Interfaces für einzelne API-Aufrufe
// Jeder Eintrag enthält den Namen des Nutzers, den aufgerufenen Service, einen HTTP-Statuscode sowie einen Zeitstempel
export interface ApiCall {
  user: string;
  service: string;
  statusCode: number;
  timestamp: string;
}

// Beispielhafte Liste von Nutzern, die API-Aufrufe tätigen können
// Diese Liste simuliert verschiedene System- und Anwendungskomponenten, z. B. Test-User, CronJobs oder Frontend-Clients
export const users = [
  'Max Mustermann',
  'APIClientX',
  'ServiceBot42',
  'DataFetcherPro',
  'APITester3000',
  'SystemUserAlpha',
  'IntegrationTest42',
  'WebAppFrontend',
  'MobileUserA1',
  'CronJobDaemon'
];

// Beispielhafte Liste von API-Endpunkten, die genutzt werden können
// Diese orientieren sich an typischen Funktionen eines Mobilitätsdienstes wie Fahrplan- oder Kartendienste
export const services = [
  'trip',
  'arrivalBoard',
  'departureBoard',
  'lineSearch',
  'location.name',
  'stopFinder',
  'vehicleMonitor',
  'connectionCheck',
  'mapTile',
  'rideSuggestion'
];


// Liste möglicher HTTP-Statuscodes zur Simulation erfolgreicher und fehlerhafter Anfragen
const statusCodes = [200, 404, 500, 503, 400, 301, 401, 204, 403];

// Funktion zur Erzeugung zufälliger API-Aufrufe über einen gegebenen Zeitraum (in Tagen)
// Pro Tag wird eine zufällige Anzahl von 1 bis 40 API-Aufrufen generiert
function generateRandomApiCalls(days: number): ApiCall[] {
  const apiCalls: ApiCall[] = [];
  const now = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);

    // Zufällige Anzahl API Calls zwischen 1 und 40
    const callsPerDay = Math.floor(Math.random() * 40) + 1;

    for (let c = 0; c < callsPerDay; c++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);

      const timestamp = new Date(date);
      timestamp.setHours(randomHour, randomMinute, randomSecond);

      apiCalls.push({
        user: users[Math.floor(Math.random() * users.length)],
        service: services[Math.floor(Math.random() * services.length)],
        statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
        timestamp: timestamp.toISOString()
      });
    }
  }

  return apiCalls;
}

// Funktion zum Laden bereits gespeicherter API-Daten aus dem lokalen Speicher
// Falls keine Daten vorhanden sind, wird eine neue Zufallsmenge für ein Jahr erzeugt und gespeichert
function getApiCalls(): ApiCall[] {
  const storedData = localStorage.getItem('apiCalls');
  if (storedData) {
    return JSON.parse(storedData);
  } else {
    const newData = generateRandomApiCalls(365); // 1 Jahr Daten simulieren
    localStorage.setItem('apiCalls', JSON.stringify(newData));
    return newData;
  }
}


// Export der API-Daten für den Einsatz im Dashboard-Prototypen
// Die Daten können z. B. für Visualisierungen von Fehlerhäufigkeiten oder Nutzeraktivität genutzt werden
export const apiCalls: ApiCall[] = getApiCalls();


// Funktion zum Zurücksetzen der gespeicherten API-Daten
// Nützlich für Debugging oder das Testen von Re-Renders und neuen Datenzuständen im Frontend
export function clearApiCallsFromStorage() {
  localStorage.removeItem('apiCalls');
}

