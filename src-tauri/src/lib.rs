// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod disk;
mod terminal;
mod utils;
mod window;

use std::env;

use serde_json::{self};

use database::disk::create_db_directory;
use tauri::{Emitter, Listener, Manager};

use crate::{
    database::{
        constants::SHORTCUTS_FOLDER,
        disk::{
            add_shortcut, read_shortcuts_from_directory, read_shortcuts_from_directory_as_string,
            remove_shortcut, remove_shortcuts_db_file, rename_shortcuts_db_file, update_shortcut,
            write_shortcut_to_directory, write_shortcuts_to_directory,
        },
        structs::{RenameTab, Shortcut, ShortcutReceived, Tab},
    },
    disk::disk::open_in_explorer,
    terminal::commands::{start_service, stop_service},
    utils::index::create_window,
    window::messages::{
        ADD_SHORTCUT, ADD_TAB, GET_SHORTCUTS, OPEN_PATH, REMOVE_SHORTCUT, REMOVE_TAB, RENAME_TAB,
        SHORTCUTS_UPDATE, START_SHORTCUT, STOP_SHORTCUT, UPDATE_SHORTCUT,
    },
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_path = create_db_directory().unwrap();
    println!("Database directory is at: {:?}", db_path);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(move |app| {
            let app_handle = app.app_handle();
            let remove_shortcut_handle = app_handle.clone();
            let update_shortcut_handle = app_handle.clone();
            let add_shortcut_handle = app_handle.clone();
            let add_tab_handle = app_handle.clone();
            let remove_tab_handle = app_handle.clone();
            let rename_tab_handle = app_handle.clone();
            let get_shortcuts_handle = app_handle.clone();

            let _ = create_window(&app).unwrap();

            app.listen(ADD_SHORTCUT, move |event| {
                let value = event.payload();
                match serde_json::from_str::<ShortcutReceived>(value) {
                    Ok(shortcut_received) => {
                        let shortcut = Shortcut {
                            list: shortcut_received.list,
                            id: shortcut_received.id,
                            visibility: shortcut_received.visibility,
                            name: shortcut_received.name,
                            path: shortcut_received.path,
                            arguments: shortcut_received.arguments,
                        };
                        let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                        add_shortcut(&mut shortcuts_list, shortcut);

                        // Write the updated shortcuts back to the file
                        write_shortcuts_to_directory(&shortcuts_list).unwrap();

                        if let Some(window) = add_shortcut_handle.get_webview_window("main") {
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
            });

            app.listen(ADD_TAB, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Tab>(value) {
                    Ok(tab) => {
                        let mut shortcuts_dir = env::current_dir().unwrap();
                        shortcuts_dir.push(SHORTCUTS_FOLDER);

                        let _ = write_shortcut_to_directory(&Vec::new(), &tab.name, &shortcuts_dir);

                        if let Some(window) = add_tab_handle.get_webview_window("main") {
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
            });

            app.listen(REMOVE_TAB, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Tab>(value) {
                    Ok(tab) => {
                        remove_shortcuts_db_file(&tab.name).unwrap();

                        if let Some(window) = remove_tab_handle.get_webview_window("main") {
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
            });

            app.listen(RENAME_TAB, move |event| {
                let value = event.payload();
                match serde_json::from_str::<RenameTab>(value) {
                    Ok(tab) => {
                        rename_shortcuts_db_file(&tab.current, &tab.new).unwrap();
                        if let Some(window) = rename_tab_handle.get_webview_window("main") {
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
            });

            app.listen(REMOVE_SHORTCUT, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Shortcut>(value) {
                    Ok(shortcut) => {
                        let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                        remove_shortcut(&mut shortcuts_list, &shortcut);

                        // Write the updated shortcuts back to the file
                        write_shortcuts_to_directory(&shortcuts_list).unwrap();

                        if let Some(window) = remove_shortcut_handle.get_webview_window("main") {
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
            });

            app.listen(UPDATE_SHORTCUT, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Shortcut>(value) {
                    Ok(shortcut) => {
                        let mut shortcuts_list = read_shortcuts_from_directory().unwrap();

                        update_shortcut(&mut shortcuts_list, shortcut);

                        // Write the updated shortcuts back to the file
                        write_shortcuts_to_directory(&shortcuts_list).unwrap();

                        if let Some(window) = update_shortcut_handle.get_webview_window("main") {
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
            });

            app.listen(START_SHORTCUT, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Shortcut>(value) {
                    Ok(shortcut) => {
                        start_service(&shortcut).unwrap();
                    }
                    Err(e) => eprintln!("Failed to parse event payload: {}", e),
                }
            });

            app.listen(STOP_SHORTCUT, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Shortcut>(value) {
                    Ok(shortcut) => {
                        stop_service(&shortcut.path).unwrap();
                    }
                    Err(e) => eprintln!("Failed to parse event payload: {}", e),
                }
            });

            app.listen(GET_SHORTCUTS, move |_| {
                if let Some(window) = get_shortcuts_handle.get_webview_window("main") {
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

            app.listen(OPEN_PATH, move |event| {
                let value = event.payload();
                match serde_json::from_str::<Shortcut>(value) {
                    Ok(shortcut) => match open_in_explorer(&shortcut.path) {
                        Ok(_) => println!("Opened successfully"),
                        Err(e) => eprintln!("Failed to open: {}", e),
                    },
                    Err(e) => eprintln!("Failed to parse event payload: {}", e),
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
