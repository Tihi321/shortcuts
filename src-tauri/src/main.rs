// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json::{self};

use database::disk::create_db_directory;
use tauri::Manager;

use crate::{
    database::{
        constants::DATABASE_PATH,
        disk::{
            add_shortcut, read_shortcuts_from_file, read_shortcuts_from_file_as_string,
            remove_shortcut, update_shortcut, write_shortcuts_to_file,
        },
        structs::{Shortcut, Shortcuts},
    },
    terminal::commands::{start_service, stop_service},
    window::messages::{
        ADD_SHORTCUT, GET_SHORTCUT, REMOVE_SHORTCUT, SHORTCUTS_UPDATE, START_SHORTCUT,
        STOP_SHORTCUT, UPDATE_SHORTCUT,
    },
};
mod database;
mod terminal;
mod utils;
mod window;

fn main() {
    let db_path = create_db_directory().unwrap();
    println!("Database directory is at: {:?}", db_path);

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();
            let remove_shortcut_handle = app_handle.clone();
            let update_shortcut_handle = app_handle.clone();
            let add_shortcut_handle = app_handle.clone();
            let get_shortcuts_handle = app_handle.clone();

            app.listen_global(ADD_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            let mut shortcuts = read_shortcuts_from_file(DATABASE_PATH)
                                .unwrap_or_else(|_| Shortcuts { items: Vec::new() });

                            add_shortcut(&mut shortcuts, shortcut);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_file(DATABASE_PATH, &shortcuts).unwrap();

                            if let Some(window) = add_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_file_as_string();

                                // Emit the event with the serialized shortcuts data
                                window
                                    .emit(SHORTCUTS_UPDATE, shortcuts_json)
                                    .expect("Failed to emit event");
                            } else {
                                // Handle the case where the window could not be found
                                eprintln!("Main window not found");
                            }
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            app.listen_global(REMOVE_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            let mut shortcuts = read_shortcuts_from_file(DATABASE_PATH)
                                .unwrap_or_else(|_| Shortcuts { items: Vec::new() });

                            remove_shortcut(&mut shortcuts, shortcut.id);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_file(DATABASE_PATH, &shortcuts).unwrap();

                            if let Some(window) = remove_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_file_as_string();

                                // Emit the event with the serialized shortcuts data
                                window
                                    .emit(SHORTCUTS_UPDATE, shortcuts_json)
                                    .expect("Failed to emit event");
                            } else {
                                // Handle the case where the window could not be found
                                eprintln!("Main window not found");
                            }
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            app.listen_global(UPDATE_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            let mut shortcuts = read_shortcuts_from_file(DATABASE_PATH)
                                .unwrap_or_else(|_| Shortcuts { items: Vec::new() });

                            update_shortcut(&mut shortcuts, shortcut);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_file(DATABASE_PATH, &shortcuts).unwrap();

                            if let Some(window) = update_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_file_as_string();

                                // Emit the event with the serialized shortcuts data
                                window
                                    .emit(SHORTCUTS_UPDATE, shortcuts_json)
                                    .expect("Failed to emit event");
                            } else {
                                // Handle the case where the window could not be found
                                eprintln!("Main window not found");
                            }
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            app.listen_global(START_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            stop_service(&shortcut.path).unwrap();
                            start_service(&shortcut.path, &shortcut.visibility).unwrap();
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            app.listen_global(STOP_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            stop_service(&shortcut.path).unwrap();
                        }
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            app.listen_global(GET_SHORTCUT, move |_| {
                if let Some(window) = get_shortcuts_handle.get_window("main") {
                    // Serialize the shortcuts data to JSON
                    let shortcuts_json = read_shortcuts_from_file_as_string();

                    // Emit the event with the serialized shortcuts data
                    window
                        .emit(SHORTCUTS_UPDATE, shortcuts_json)
                        .expect("Failed to emit event");
                } else {
                    // Handle the case where the window could not be found
                    eprintln!("Main window not found");
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
