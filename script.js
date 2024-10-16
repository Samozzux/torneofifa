let results = [];
let standings = {
    'Matteo': { wins: 0, goalsFor: 0, goalsAgainst: 0 },
    'Samuele': { wins: 0, goalsFor: 0, goalsAgainst: 0 },
};

// Funzione per aggiungere un risultato
function addResult() {
    const teamA = document.getElementById('teamA').value;
    const teamB = document.getElementById('teamB').value;
    const scoreA = parseInt(document.getElementById('scoreA').value);
    const scoreB = parseInt(document.getElementById('scoreB').value);

    if (teamA && teamB && !isNaN(scoreA) && !isNaN(scoreB)) {
        const result = {
            teamA: teamA,
            teamB: teamB,
            scoreA: scoreA,
            scoreB: scoreB
        };
        results.push(result);
        updateStandings(scoreA, scoreB);
        updateResults();
        clearInputs();
        saveData(); // Salva i dati
    } else {
        alert('Inserisci i nomi delle squadre e i punteggi validi.');
    }
}

// Funzione per modificare un risultato
function editResult(index) {
    const row = document.getElementById(`row-${index}`);
    const cells = row.getElementsByTagName('td');

    // Mostra i campi di input
    cells[0].innerHTML = `<input type="text" value="${cells[0].textContent.trim()}" class="editable" />`;
    cells[1].innerHTML = `<input type="number" value="${cells[1].textContent.split(' - ')[0].trim()}" class="editable" /> - <input type="number" value="${cells[1].textContent.split(' - ')[1].trim()}" class="editable" />`;
    cells[2].innerHTML = `<input type="text" value="${cells[2].textContent.trim()}" class="editable" />`;
    cells[3].innerHTML = `<button onclick="saveResult(${index})">Salva</button>`;
}

// Funzione per salvare un risultato modificato
function saveResult(index) {
    const row = document.getElementById(`row-${index}`);
    const inputs = row.getElementsByTagName('input');

    const teamA = inputs[0].value;
    const scoreA = parseInt(inputs[1].value);
    const scoreB = parseInt(inputs[2].value);
    const teamB = inputs[3].value;

    results[index] = {
        teamA: teamA,
        teamB: teamB,
        scoreA: scoreA,
        scoreB: scoreB
    };

    // Ricalcola le statistiche
    recalculateStandings();
    
    saveData(); // Salva i dati
    updateResults(); // Aggiorna la visualizzazione
}

function deleteResult(index) {
    results.splice(index, 1);
    saveData(); // Salva i dati dopo l'eliminazione
    updateResults(); // Aggiorna la visualizzazione
    recalculateStandings(); // Ricalcola le statistiche
}

function recalculateStandings() {
    // Azzerare le statistiche
    standings['Matteo'].wins = 0;
    standings['Samuele'].wins = 0;
    standings['Matteo'].goalsFor = 0;
    standings['Matteo'].goalsAgainst = 0;
    standings['Samuele'].goalsFor = 0;
    standings['Samuele'].goalsAgainst = 0;

    // Ricalcola le statistiche in base ai risultati attuali
    results.forEach(result => updateStandings(result.scoreA, result.scoreB));
    
    // Aggiorna la visualizzazione delle statistiche
    updateStandingsDisplay();
}

function updateResults() {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.id = `row-${index}`;
        row.innerHTML = `
            <td>${result.teamA}</td>
            <td>${result.scoreA} - ${result.scoreB}</td>
            <td>${result.teamB}</td>
            <td>
                <button class="edit" onclick="editResult(${index})">Modifica</button>
                <button class="delete" onclick="deleteResult(${index})">Elimina</button>
            </td>
        `;
        resultsBody.appendChild(row);
    });
    
    // Se non ci sono risultati, azzera le statistiche
    if (results.length === 0) {
        standings['Matteo'].wins = 0;
        standings['Samuele'].wins = 0;
        standings['Matteo'].goalsFor = 0;
        standings['Matteo'].goalsAgainst = 0;
        standings['Samuele'].goalsFor = 0;
        standings['Samuele'].goalsAgainst = 0;
    }
    
    updateStandingsDisplay();
}

function updateStandings(scoreA, scoreB) {
    if (scoreA > scoreB) {
        standings['Matteo'].wins += 1;
        standings['Matteo'].goalsFor += scoreA;
        standings['Matteo'].goalsAgainst += scoreB;
        standings['Samuele'].goalsFor += scoreB;
        standings['Samuele'].goalsAgainst += scoreA;
    } else if (scoreB > scoreA) {
        standings['Samuele'].wins += 1;
        standings['Samuele'].goalsFor += scoreB;
        standings['Samuele'].goalsAgainst += scoreA;
        standings['Matteo'].goalsFor += scoreA;
        standings['Matteo'].goalsAgainst += scoreB;
    } else {
        standings['Matteo'].goalsFor += scoreA;
        standings['Matteo'].goalsAgainst += scoreB;
        standings['Samuele'].goalsFor += scoreB;
        standings['Samuele'].goalsAgainst += scoreA;
    }
    updateStandingsDisplay();
}

function updateStandingsDisplay() {
    const standingsBody = document.getElementById('standingsBody');
    standingsBody.innerHTML = `
        <tr>
            <td>Matteo</td>
            <td>${standings['Matteo'].wins}</td>
            <td>${standings['Matteo'].goalsFor}</td>
            <td>${standings['Matteo'].goalsAgainst}</td>
            <td>${standings['Matteo'].goalsFor - standings['Matteo'].goalsAgainst}</td>
        </tr>
        <tr>
            <td>Samuele</td>
            <td>${standings['Samuele'].wins}</td>
            <td>${standings['Samuele'].goalsFor}</td>
            <td>${standings['Samuele'].goalsAgainst}</td>
            <td>${standings['Samuele'].goalsFor - standings['Samuele'].goalsAgainst}</td>
        </tr>
    `;
}

// Funzione per pulire gli input
function clearInputs() {
    document.getElementById('teamA').value = '';
    document.getElementById('teamB').value = '';
    document.getElementById('scoreA').value = '';
    document.getElementById('scoreB').value = '';
}

// Funzione per salvare i dati nel localStorage
function saveData() {
    localStorage.setItem('results', JSON.stringify(results));
    localStorage.setItem('standings', JSON.stringify(standings));
}

// Funzione per caricare i dati dal localStorage
function loadData() {
    const savedResults = localStorage.getItem('results');
    const savedStandings = localStorage.getItem('standings');
    if (savedResults) {
        results = JSON.parse(savedResults);
    }
    if (savedStandings) {
        standings = JSON.parse(savedStandings);
    }
    updateResults();
    updateStandingsDisplay();
}

// Carica i dati all'avvio
window.onload = loadData;
