use serde_json::Result as SerdeResult;
use std::env;
use std::fs;
use std::io::Result;
use std::path::PathBuf;

use super::constants::SHORTCUTS_FOLDER;
use super::structs::{Shortcut, ShortcutsList};

pub fn add_shortcut(shortcuts_list: &mut Vec<ShortcutsList>, shortcut: Shortcut) {
    // Find the ShortcutsList with the same list name
    if let Some(list) = shortcuts_list.iter_mut().find(|x| x.list == shortcut.list) {
        // Add the shortcut to the found ShortcutsList
        list.shortcuts.push(shortcut);
    } else {
        // If no ShortcutsList with the same name exists, create a new one
        let list_name = shortcut.list.clone();
        shortcuts_list.push(ShortcutsList {
            list: list_name,
            shortcuts: vec![shortcut],
        });
    }
}

pub fn remove_shortcut(shortcuts_list: &mut Vec<ShortcutsList>, shortcut_to_remove: &Shortcut) {
    // Find the ShortcutsList with the same list name
    if let Some(list) = shortcuts_list
        .iter_mut()
        .find(|x| x.list == shortcut_to_remove.list)
    {
        // Find and remove the shortcut with the matching id
        list.shortcuts
            .retain(|shortcut| shortcut.id != shortcut_to_remove.id);
    }
    // Optionally, remove the ShortcutsList if it becomes empty
    shortcuts_list.retain(|list| !list.shortcuts.is_empty());
}

pub fn update_shortcut(shortcuts_list: &mut Vec<ShortcutsList>, updated_shortcut: Shortcut) {
    // Find the ShortcutsList with the same list name
    if let Some(list) = shortcuts_list
        .iter_mut()
        .find(|x| x.list == updated_shortcut.list)
    {
        // Find the shortcut with the matching id
        if let Some(shortcut) = list
            .shortcuts
            .iter_mut()
            .find(|x| x.id == updated_shortcut.id)
        {
            // Update the found shortcut
            *shortcut = updated_shortcut;
        } else {
            // If the shortcut is not found, you can choose to add it or not.
            // Uncomment the next line to add the shortcut if it's not found.
            // list.shortcuts.push(updated_shortcut);
        }
    } else {
        // If the ShortcutsList is not found, you might want to handle this case.
        // For example, by creating a new ShortcutsList.
        // Uncomment the following lines to create a new list if it's not found.
        // let list_name = updated_shortcut.list.clone();
        // shortcuts_list.push(ShortcutsList {
        //     list: list_name,
        //     shortcuts: vec![updated_shortcut],
        // });
    }
}

pub fn read_shortcuts_from_directory() -> Result<Vec<ShortcutsList>> {
    let mut shortcuts_lists = Vec::new();

    for entry in fs::read_dir(SHORTCUTS_FOLDER)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() && path.extension().and_then(std::ffi::OsStr::to_str) == Some("json") {
            let content = fs::read_to_string(&path)?;
            let shortcuts: Vec<Shortcut> = serde_json::from_str(&content).unwrap();

            // Set the list field to the name of the file (without the extension)
            if let Some(file_stem) = path.file_stem().and_then(std::ffi::OsStr::to_str) {
                shortcuts_lists.push(ShortcutsList {
                    list: file_stem.to_string(),
                    shortcuts,
                });
            }
        }
    }

    Ok(shortcuts_lists)
}

pub fn read_shortcuts_from_directory_as_string() -> String {
    let shortcuts = read_shortcuts_from_directory().unwrap();

    // Serialize the shortcuts data to JSON
    let shortcuts_json = serde_json::to_string(&shortcuts).expect("Failed to serialize shortcuts");

    return shortcuts_json;
}

pub fn write_shortcuts_to_directory(shortcuts_lists: &[ShortcutsList]) -> SerdeResult<()> {
    let mut shortcuts_dir = env::current_dir().unwrap();
    shortcuts_dir.push(SHORTCUTS_FOLDER); // Make sure SHORTCUTS_FOLDER is defined

    for shortcuts_list in shortcuts_lists {
        let json_file_path = shortcuts_dir.join(format!("{0}.json", &shortcuts_list.list));
        let json = serde_json::to_string_pretty(&shortcuts_list.shortcuts)?;
        fs::write(json_file_path, json).unwrap();
    }
    Ok(())
}
pub fn create_db_directory() -> Result<PathBuf> {
    let mut db_path = env::current_dir()?;
    db_path.push(SHORTCUTS_FOLDER);

    // Attempt to create the entire directory structure if it doesn't exist
    if let Err(err) = fs::create_dir_all(&db_path) {
        eprintln!("Error creating directories: {}", err);
    } else {
        println!("Directories created successfully");
    }

    Ok(db_path)
}
