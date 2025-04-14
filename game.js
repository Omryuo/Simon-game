// Simon Game JavaScript Code:

  // Constants and variables
  const buttonColors = ["red", "blue", "green", "yellow"];
  // Keyboard mappings for each button (R, B, G, Y)
  const keyboardControls = {
    "r": "red",
    "b": "blue", 
    "g": "green",
    "y": "yellow",
    // Arrow keys alternative
    "arrowright": "red",
    "arrowdown": "blue",
    "arrowup": "green",
    "arrowleft": "yellow"
  };
  let gamePattern = [];
  let userClickedPattern = [];
  let started = false;
  let level = 0;
  let highScore = 0;
  let waitingForInput = false;
  
  // DOM Elements - Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    const levelTitle = document.getElementById("level-title");
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreDisplay = document.getElementById("final-score");
    const finalHighScoreDisplay = document.getElementById("final-high-score");
    const keyControlsInfo = document.getElementById("key-controls");
    
    // Update key controls info
    if (keyControlsInfo) {
      keyControlsInfo.innerHTML = `
        <p>Keyboard Controls:</p>
        <ul>
          <li><strong>R or →</strong>: Red button</li>
          <li><strong>B or ↓</strong>: Blue button</li>
          <li><strong>G or ↑</strong>: Green button</li>
          <li><strong>Y or ←</strong>: Yellow button</li>
        </ul>
      `;
    }
    
    // Event Listeners
    document.addEventListener("keydown", function(event) {
      const key = event.key.toLowerCase();
      
      // If game not started, any key starts the game
      if (!started) {
        handleStartGame();
        return;
      }
      
      // If game is running and waiting for input, check if a button key was pressed
      if (started && waitingForInput && key in keyboardControls) {
        const color = keyboardControls[key];
        simulateButtonPress(color);
      }
    });
    
    document.addEventListener("touchstart", function(e) {
      // Only respond to touchstart on the body or game over screen
      // This prevents conflicts with button touches
      if (e.target.tagName === "BODY" || e.target.closest("#game-over-screen")) {
        handleStartGame(e);
      }
    });
    
    if (gameOverScreen) {
      gameOverScreen.addEventListener("click", handleStartGame);
    }
    
    // Select all buttons and add click event listeners
    document.querySelectorAll(".btn").forEach(button => {
      button.addEventListener("click", function() {
        if (!started || !waitingForInput) return; // Ignore clicks if game hasn't started or not waiting for input
        
        const userChosenColor = this.id;
        handleUserInput(userChosenColor);
      });
    });
  
    // Helper function to simulate button press via keyboard
    function simulateButtonPress(color) {
      const button = document.getElementById(color);
      if (button) {
        // Visual feedback
        animatePress(color);
        // Process the input
        handleUserInput(color);
      }
    }
    
    // Centralized function to handle user input (from click or keyboard)
    function handleUserInput(color) {
      userClickedPattern.push(color);
      playSound(color);
      checkAnswer(userClickedPattern.length - 1);
    }
  
    // Game Functions
    function handleStartGame(e) {
      if (!started) {
        // Explicitly set display style to none instead of using class
        if (gameOverScreen) {
          gameOverScreen.style.display = "none";
        }
        
        resetGame();
        
        if (levelTitle) {
          levelTitle.textContent = `Level ${level}`;
        }
        
        setTimeout(nextSequence, 500); // Short delay before starting
      }
    }
  
    function resetGame() {
      level = 0;
      gamePattern = [];
      started = true;
      updateScore(0);
    }
  
    function checkAnswer(currentIndex) {
      if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
        if (userClickedPattern.length === gamePattern.length) {
          updateScore(level);
          
          // Proceed to next level with a delay
          waitingForInput = false;
          setTimeout(function() {
            nextSequence();
          }, 1000);
        }
      } else {
        gameOver();
      }
    }
  
    function nextSequence() {
      userClickedPattern = [];
      level++;
      
      if (levelTitle) {
        levelTitle.textContent = `Level ${level}`;
      }
  
      // Generate random color
      const randomNumber = Math.floor(Math.random() * 4);
      const randomChosenColor = buttonColors[randomNumber];
      gamePattern.push(randomChosenColor);
  
      // Show pattern with delay between each button
      waitingForInput = false; // Disable input while showing pattern
      showPattern(0);
    }
  
    // Show pattern sequence with proper timing
    function showPattern(index) {
      if (index >= gamePattern.length) {
        // Pattern display complete, now accept user input
        waitingForInput = true;
        return;
      }
      
      const color = gamePattern[index];
      const button = document.getElementById(color);
      
      if (button) {
        // Flash animation
        flashButton(button);
        playSound(color);
        
        // Schedule next color in sequence
        setTimeout(() => showPattern(index + 1), 600);
      }
    }
  
    function flashButton(button) {
      button.classList.add("flash");
      setTimeout(() => button.classList.remove("flash"), 300);
    }
  
    function playSound(name) {
      const audio = new Audio(`./sounds/${name}.mp3`);
      
      // Error handling for audio
      audio.onerror = function() {
        console.warn(`Sound not found: ./sounds/${name}.mp3`);
      };
      
      audio.play().catch(e => {
        // Handle autoplay restrictions
        console.warn("Audio playback failed:", e);
      });
    }
  
    function animatePress(currentColor) {
      const button = document.getElementById(currentColor);
      if (button) {
        button.classList.add("pressed");
        setTimeout(function() {
          button.classList.remove("pressed");
        }, 100);
      }
    }
  
    function updateScore(newScore) {
      if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${newScore}`;
      }
      
      // Update high score if needed
      if (newScore > highScore) {
        highScore = newScore;
        if (highScoreDisplay) {
          highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
      }
    }
  
    function gameOver() {
      playSound("wrong");
      document.body.classList.add("game-over");
      waitingForInput = false;
      
      setTimeout(function() {
        document.body.classList.remove("game-over");
      }, 300);
     
      // Reset game state
      started = false;
      
      // Update title
      if (levelTitle) {
        levelTitle.textContent = "Game Over! Press Any Key to Restart";
      }
    }
  });