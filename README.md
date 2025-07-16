# Rust Guessing Game

This is a web-based guessing game built with Rust (using the Actix Web framework) for the backend and a modern HTML, CSS, and JavaScript frontend. The game challenges players to guess a secret number within a customizable range, with options for limiting guesses and setting a time limit.

## Features

*   **Interactive Space Background:** A dynamic, animated starfield provides an immersive space theme.
*   **Customizable Game Rules:** Players can set their own maximum number of guesses and a time limit in seconds for each game.
*   **Guess Counter:** Tracks and displays the number of guesses remaining.
*   **Time Limit:** A countdown timer adds an extra layer of challenge.
*   **Guess History:** Keeps a log of all previous guesses made in the current game.
*   **Visual Feedback:** Provides immediate visual cues (color changes) for "Too small!", "Too big!", and "You got it!" messages.
*   **Responsive Input:** Supports guessing by pressing the "Enter" key in the input field.

## Setup and Running the Game

To get the game up and running on your local machine, follow these steps:

### Prerequisites

*   **Rust:** Ensure you have Rust and Cargo installed. If not, you can install it via `rustup`:
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
    Follow the on-screen instructions.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    # Replace YOUR_USERNAME and YOUR_REPOSITORY_NAME with your actual GitHub details
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd YOUR_REPOSITORY_NAME # or whatever you named the cloned directory (e.g., guessing_game)
    ```

### Running the Application

1.  **Build and Run the Rust Backend:**
    This command will compile the Rust code and start the web server.
    ```bash
    cargo run
    ```
    You should see output indicating that the server is running, typically on `http://127.0.0.1:8080`.

2.  **Access the Frontend:**
    Open your web browser and navigate to the address provided by `cargo run`, usually:
    ```
    http://127.0.0.1:8080
    ```

## How to Play

1.  **Set Game Rules:** On the main screen, enter your desired "Max Guesses" and "Time Limit (seconds)" in the respective input fields.
2.  **Start Game:** Click the "Start New Game" button.
3.  **Guess the Number:** Enter your guess in the input field and either click the "Guess" button or press "Enter".
4.  **Receive Feedback:** The game will tell you if your guess is "Too small!", "Too big!", or "You got it!". The message color will change accordingly.
5.  **Monitor Progress:** Keep an eye on the "Guesses Remaining" and "Time Remaining" displays. Your previous guesses will be listed under "Guess History".
6.  **Win or Lose:** The game ends when you guess the correct number, run out of guesses, or run out of time.

## Dependencies

This project utilizes the following Rust crates:

*   `actix-web`: A powerful, pragmatic, and extremely fast web framework for Rust.
*   `actix-files`: For serving static files (our frontend HTML, CSS, JS).
*   `rand`: For generating random numbers.
*   `serde`: A framework for serializing and deserializing Rust data structures efficiently and generically.
*   `serde_json`: JSON support for `serde`.
*   `chrono`: Date and time library for handling game timers.