use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use rand::Rng;
use chrono::{Utc, DateTime, Duration};

#[derive(Deserialize)]
struct NewGameRequest {
    max_guesses: u32,
    time_limit_seconds: u32,
}

#[derive(Serialize, Deserialize, Clone)]
struct GameState {
    secret_number: u32,
    guess_count: u32,
    guess_history: Vec<u32>,
    max_guesses: u32,
    time_limit_seconds: u32,
    start_time: DateTime<Utc>,
}

#[derive(Deserialize)]
struct Guess {
    guess: u32,
}

#[derive(Serialize)]
struct GuessResponse {
    message: String,
    status: String,
    guess_count: u32,
    guess_history: Vec<u32>,
    max_guesses: u32,
    time_remaining_seconds: i64,
    game_over: bool,
}

async fn new_game(req: web::Json<NewGameRequest>, data: web::Data<Mutex<GameState>>) -> impl Responder {
    let mut state = data.lock().unwrap();
    
    // Use values from the request, with a default max number (e.g., 100)
    let max_number = 100; // You can make this configurable too if needed

    state.secret_number = rand::thread_rng().gen_range(1..max_number + 1);
    state.guess_count = 0;
    state.guess_history = Vec::new();
    state.max_guesses = req.max_guesses;
    state.time_limit_seconds = req.time_limit_seconds;
    state.start_time = Utc::now();

    HttpResponse::Ok().json(GuessResponse {
        message: format!("New game started! Guess a number between 1 and {}.", max_number),
        status: "new_game".to_string(),
        guess_count: state.guess_count,
        guess_history: state.guess_history.clone(),
        max_guesses: state.max_guesses,
        time_remaining_seconds: state.time_limit_seconds as i64,
        game_over: false,
    })
}

async fn make_guess(
    guess: web::Json<Guess>,
    data: web::Data<Mutex<GameState>>,
) -> impl Responder {
    let mut state = data.lock().unwrap();
    let guess_number = guess.guess;

    state.guess_count += 1;
    state.guess_history.push(guess_number);

    let elapsed_time = (Utc::now() - state.start_time).num_seconds();
    let time_remaining = state.time_limit_seconds as i64 - elapsed_time;

    let mut message = String::new();
    let mut status = String::new();
    let mut game_over = false;

    if guess_number < state.secret_number {
        message = "Too small!".to_string();
        status = "too_small".to_string();
    } else if guess_number > state.secret_number {
        message = "Too big!".to_string();
        status = "too_big".to_string();
    } else {
        message = "You got it!".to_string();
        status = "correct".to_string();
        game_over = true;
    }

    if !game_over && (state.guess_count >= state.max_guesses || time_remaining <= 0) {
        game_over = true;
        if state.guess_count >= state.max_guesses {
            message = format!("You ran out of guesses! The secret number was {}.", state.secret_number);
            status = "lost_guesses".to_string();
        } else if time_remaining <= 0 {
            message = format!("Time's up! The secret number was {}.", state.secret_number);
            status = "lost_time".to_string();
        }
    }

    HttpResponse::Ok().json(GuessResponse {
        message,
        status,
        guess_count: state.guess_count,
        guess_history: state.guess_history.clone(),
        max_guesses: state.max_guesses,
        time_remaining_seconds: time_remaining,
        game_over,
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let game_state = web::Data::new(Mutex::new(GameState { 
        secret_number: 0, 
        guess_count: 0, 
        guess_history: Vec::new(), 
        max_guesses: 0, 
        time_limit_seconds: 0, 
        start_time: Utc::now(),
    }));

    HttpServer::new(move || {
        App::new()
            .app_data(game_state.clone())
            .route("/new_game", web::post().to(new_game))
            .route("/guess", web::post().to(make_guess))
            .service(actix_files::Files::new("/", "./frontend").index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}