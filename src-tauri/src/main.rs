// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod disk;
mod terminal;
mod utils;
mod window;

use serde_json::{self};

use database::disk::create_db_directory;
use tauri::Manager;

use crate::{
    database::{
        disk::{
            add_shortcut, read_shortcuts_from_directory, read_shortcuts_from_directory_as_string,
            remove_shortcut, remove_shortcuts_db_file, update_shortcut,
            write_shortcuts_to_directory,
        },
        structs::{Shortcut, ShortcutsList, Tab},
    },
    disk::disk::open_in_explorer,
    terminal::commands::{start_service, stop_service},
    window::messages::{
        ADD_SHORTCUT, ADD_TAB, GET_SHORTCUTS, OPEN_PATH, REMOVE_SHORTCUT, REMOVE_TAB,
        SHORTCUTS_UPDATE, START_SHORTCUT, STOP_SHORTCUT, UPDATE_SHORTCUT,
    },
};

fn main() {
    let db_path = create_db_directory().unwrap();
    println!("Database directory is at: {:?}", db_path);

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();
            let remove_shortcut_handle = app_handle.clone();
            let update_shortcut_handle = app_handle.clone();
            let add_shortcut_handle = app_handle.clone();
            let add_tab_handle = app_handle.clone();
            let remove_tab_handle = app_handle.clone();
            let get_shortcuts_handle = app_handle.clone();

            app.listen_global(ADD_SHORTCUT, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => {
                            let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                            add_shortcut(&mut shortcuts_list, shortcut);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_directory(&shortcuts_list).unwrap();

                            if let Some(window) = add_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_directory_as_string();

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

            app.listen_global(ADD_TAB, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Tab>(value) {
                        Ok(tab) => {
                            let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                            shortcuts_list.push(ShortcutsList {
                                list: tab.name,
                                shortcuts: Vec::new(),
                            });

                            write_shortcuts_to_directory(&shortcuts_list).unwrap();

                            if let Some(window) = add_tab_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_directory_as_string();

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

            app.listen_global(REMOVE_TAB, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Tab>(value) {
                        Ok(tab) => {
                            remove_shortcuts_db_file(&tab.name).unwrap();

                            if let Some(window) = remove_tab_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_directory_as_string();

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
                            let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                            remove_shortcut(&mut shortcuts_list, &shortcut);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_directory(&shortcuts_list).unwrap();

                            if let Some(window) = remove_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_directory_as_string();

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
                            let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                            update_shortcut(&mut shortcuts_list, shortcut);

                            // Write the updated shortcuts back to the file
                            write_shortcuts_to_directory(&shortcuts_list).unwrap();

                            if let Some(window) = update_shortcut_handle.get_window("main") {
                                // Serialize the shortcuts data to JSON
                                let shortcuts_json = read_shortcuts_from_directory_as_string();

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
                            start_service(&shortcut).unwrap();
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

            app.listen_global(GET_SHORTCUTS, move |_| {
                if let Some(window) = get_shortcuts_handle.get_window("main") {
                    // Serialize the shortcuts data to JSON
                    let shortcuts_json = read_shortcuts_from_directory_as_string();

                    // Emit the event with the serialized shortcuts data
                    window
                        .emit(SHORTCUTS_UPDATE, shortcuts_json)
                        .expect("Failed to emit event");
                } else {
                    // Handle the case where the window could not be found
                    eprintln!("Main window not found");
                }
            });

            app.listen_global(OPEN_PATH, move |event| {
                if let Some(value) = event.payload() {
                    match serde_json::from_str::<Shortcut>(value) {
                        Ok(shortcut) => match open_in_explorer(&shortcut.path) {
                            Ok(_) => println!("Opened successfully"),
                            Err(e) => eprintln!("Failed to open: {}", e),
                        },
                        Err(e) => eprintln!("Failed to parse event payload: {}", e),
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
