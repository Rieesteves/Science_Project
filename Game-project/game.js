// Variables for tracking time
let startTime, endTime;

// Sound effects
const buttonClickSound = new Audio('button-click.mp3');

// Start game and record start time
document.getElementById('start-game').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    document.getElementById('game-description').style.display = 'none';
    document.getElementById('level-1').style.display = 'block';
    startTime = new Date(); // Start tracking time
    updateProgress(1, 3); // Update progress bar to level 1
});

// Level 1 - Loops
let loopCount = 0;
const maxLoops = 5;

// Update the display for remaining clicks
document.getElementById('remaining-clicks').textContent = maxLoops;

// Click event for the "Click Me!" button
document.getElementById('loop-button').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    loopCount++;
    const remainingClicks = maxLoops - loopCount;
    document.getElementById('remaining-clicks').textContent = remainingClicks;

    if (loopCount >= maxLoops) {
        // Once 5 clicks are reached, show the "Next Level" button
        document.getElementById('loop-button').disabled = true;  // Disable the button
        document.getElementById('next-level-1').style.display = 'block';  // Show the next button
    }
});

// Event for moving to the next level
document.getElementById('next-level-1').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    document.getElementById('level-1').style.display = 'none';
    document.getElementById('level-2').style.display = 'block';
    updateProgress(2, 3); // Update progress bar to level 2
});

// Level 2 - Conditionals
let currentSubLevel = 1;
const maxSubLevels = 3;

// Click event for sub-level shapes
const feedback = document.getElementById('feedback-2');
const shapes = document.querySelectorAll('.shape');

// Set up click events for each shape in the level 2 sub-levels
shapes.forEach(shape => {
    shape.addEventListener('click', function() {
        buttonClickSound.play(); // Play sound
        const chosenColor = this.getAttribute('data-color');

        // Check for correct conditions based on current sub-level
        let correct = false;
        if (currentSubLevel === 1 && chosenColor === 'red') {
            correct = true; // Sub-Level 1: Click if the shape is red
        } else if (currentSubLevel === 2 && (chosenColor === 'blue' || chosenColor === 'square')) {
            correct = true; // Sub-Level 2: Click if the shape is blue or a square
        } else if (currentSubLevel === 3 && (chosenColor === 'red' && this.classList.contains('square'))) {
            correct = true; // Sub-Level 3: Click if the shape is red and a square
        }

        if (correct) {
            feedback.textContent = "Correct! Moving to the next sub-level.";
            document.getElementById('next-sub-level').style.display = 'block'; // Show "Next Sub-Level" button
        } else {
            feedback.textContent = "Wrong choice! Try again.";
        }
    });
});

// Handling sub-level transition
document.getElementById('next-sub-level').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    if (currentSubLevel < maxSubLevels) {
        // Hide the current sub-level and move to the next one
        document.getElementById(`sub-level-${currentSubLevel}`).style.display = 'none';
        currentSubLevel++;
        document.getElementById(`sub-level-${currentSubLevel}`).style.display = 'block';
        document.getElementById('next-sub-level').style.display = 'none'; // Hide button again
        feedback.textContent = ""; // Clear feedback
    }

    if (currentSubLevel === maxSubLevels) {
        document.getElementById('next-level-2').style.display = 'block'; // Show "Next Level" button for Level 3
    }
});

// Moving to Level 3: Sorting Algorithms
document.getElementById('next-level-2').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    document.getElementById('level-2').style.display = 'none';
    document.getElementById('level-3').style.display = 'block';
    updateProgress(3, 3); // Update progress bar to level 3
});

// Leaderboard logic
document.getElementById('submit-score').addEventListener('click', function() {
    // Get player time and store it in localStorage
    let playerTime = Math.floor((endTime - startTime) / 1000);
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Add new score
    leaderboard.push(playerTime);
    leaderboard.sort((a, b) => a - b); // Sort scores in ascending order
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores

    // Save updated leaderboard
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Show leaderboard
    updateLeaderboard();
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
});

// Function to update leaderboard UI
function updateLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard-list');
    leaderboardElement.innerHTML = ''; // Clear existing scores

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `Score: ${score} seconds`;
        leaderboardElement.appendChild(li);
    });
}

// Event to reset the game
document.getElementById('restart-game').addEventListener('click', function() {
    buttonClickSound.play(); // Play sound
    document.getElementById('level-1').style.display = 'none';
    document.getElementById('level-2').style.display = 'none';
    document.getElementById('level-3').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-description').style.display = 'block';
    updateProgress(0, 3); // Reset progress bar
});
