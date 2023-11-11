// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::disk::create_db_directory;
use serde_json::{Error, Value};
use tauri::Manager;

use crate::{
    database::{
        constants::DATABASE_PATH,
        disk::{add_shortcut, read_shortcuts_from_file, write_shortcuts_to_file},
        structs::{Shortcut, Shortcuts},
    },
    window::messages::ADD_SHORTCUT,
};
mod database;
mod window;

fn main() {
    let db_path = create_db_directory().unwrap();
    println!("Database directory is at: {:?}", db_path);

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();

            app.listen_global(ADD_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            let mut shortcuts = read_shortcuts_from_file(DATABASE_PATH)
                                .unwrap_or_else(|_| Shortcuts {
                                    shortcuts: Vec::new(),
                                });

                            add_shortcut(&mut shortcuts, shortcut.title, shortcut.path);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_file(DATABASE_PATH, &shortcuts).unwrap();
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            println!("started");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
