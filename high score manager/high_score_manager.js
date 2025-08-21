const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');

const file = "high_score_manager.txt";

function writeScores() {
    let scores = [];
    try {
        if (fs.existsSync(file)) {
            const lines = fs.readFileSync(file, 'utf-8').split('\n');
            for (let line of lines) {
                line = line.trim();
                if (line) {
                    const [name, score] = line.split(',');
                    if (score && !isNaN(parseInt(score))) {
                        scores.push([name, parseInt(score)]);
                    }
                }
            }
        }
    } catch (error) {
        // File not found or error, just continue with empty scores
    }
    return scores;
}

function saveScore(scores) {
    try {
        const data = scores.map(([name, score]) => `${name},${score}`).join('\n');
        fs.writeFileSync(file, data);
    } catch (error) {
        console.error("Error saving scores:", error.message);
    }
}

function bubbleSort(scores) {
    const n = scores.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (scores[j][1] < scores[j + 1][1]) {
                [scores[j], scores[j + 1]] = [scores[j + 1], scores[j]]; // Düzeltildi
            }
        }
    }
}

function addOrUpdateScore() {
    let name = prompt("Type the player's name: ");
    while (!name) {
        name = prompt("Error: Please provide a name: ");
    }

    let scoreInput = prompt("Enter the final score: ");
    if (!scoreInput || isNaN(parseInt(scoreInput))) {
        console.log("Error: Enter a valid number for the score.");
        return;
    }
    const score = parseInt(scoreInput);

    let scoreList = writeScores();
    let scoreDict = {};
    for (let [player, scr] of scoreList) {
        scoreDict[player] = scr;
    }

    if (scoreDict[name]) {
        if (score > scoreDict[name]) {
            console.log(`${name}'s previous score of ${scoreDict[name]} will be updated to ${score}.`);
            scoreDict[name] = score;
        } else {
            console.log(`${name}'s current score of ${scoreDict[name]} is already higher or equal. Update not applied.`);
        }
    } else {
        scoreDict[name] = score;
        console.log(`${name} is a new entry with a score of ${score}.`);
    }

    let sortedScore = Object.entries(scoreDict).sort((a, b) => b[1] - a[1]);
    saveScore(sortedScore);
}

function searchScore() {
    let name = prompt("Search for a player's name: ");
    let scores = writeScores();
    for (let [player, score] of scores) {
        if (player.toLowerCase() === name.toLowerCase()) {
            console.log(`The score of ${player} is ${score}`);
            return;
        }
    }
    console.log("Player with that name does not exist.");
}

function readFile() {
    try {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf-8');
            if (content) {
                console.log("\nThe robot retrieved the following information:\n" + content);
            } else {
                console.log("\nThe file is currently empty.");
            }
        } else {
            console.log("\nThe robot was unable to locate the file.");
        }
    } catch (error) {
        console.log("\nAn error occurred:", error.message);
    }
}

function writeSentence() {
    let sentence = prompt("\nPlease enter a sentence:\n");
    if (sentence && typeof sentence === 'string') {
        try {
            fs.appendFileSync(file, sentence + '\n');
            console.log("Your sentence has been successfully saved!");
        } catch (error) {
            console.log("\nAn error occurred:", error.message);
        }
    } else {
        console.log("\nInvalid input. Please provide a valid sentence.");
    }
}

function clearFile() {
    try {
        fs.writeFileSync(file, '');
        console.log("\nThe robot has cleared all contents from the file.");
    } catch (error) {
        console.log("\nAn error occurred:", error.message);
    }
}

function displayScores() {
    let scores = writeScores();
    console.log("\n-------------------------------------------");
    console.log("High Score Board:");
    console.log("\n-------------------------------------------");

    if (scores.length === 0) {
        console.log("No scores available.");
    } else {
        let rank = 1;
        for (let [name, score] of scores) {
            console.log(`${rank}. ${name}: ${score}`);
            rank++;
        }
    }
}

function main() {
    while (true) {
        console.log("\nHigh Score Manager");
        console.log("1. Add or update high score");
        console.log("2. Search score by name");
        console.log("3. View high scores");
        console.log("4. Exit");

        let choice = prompt("Enter your choice (1-4): ");

        if (choice === '1') {
            addOrUpdateScore();
        } else if (choice === '2') {
            searchScore();
        } else if (choice === '3') {
            displayScores();
        } else if (choice === '4') {
            console.log("Goodbye!");
            break;
        } else {
            console.log("Invalid choice. Please try again.");
        }
    }
}

if (require.main === module) {
    main();
}
