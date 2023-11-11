use std::env;
use std::fs;
use std::io::Result;
use std::path::Path;
use std::path::PathBuf;

use super::constants::DATABASE_FOLDER;
use super::structs::{Shortcut, Shortcuts};

pub fn add_shortcut(shortcuts: &mut Shortcuts, title: String, path: String) {
    let shortcut = Shortcut { title, path };
    shortcuts.shortcuts.push(shortcut);
}

pub fn remove_shortcut(shortcuts: &mut Shortcuts, title: &str) {
    shortcuts
        .shortcuts
        .retain(|shortcut| shortcut.title != title);
}

pub fn read_shortcuts_from_file<P: AsRef<Path>>(file_path: P) -> Result<Shortcuts> {
    let file_content = fs::read_to_string(file_path)?;
    let shortcuts = serde_json::from_str(&file_content)?;
    Ok(shortcuts)
}

pub fn write_shortcuts_to_file<P: AsRef<Path>>(file_path: P, shortcuts: &Shortcuts) -> Result<()> {
    let json = serde_json::to_string_pretty(shortcuts)?;
    fs::write(file_path, json)?;
    Ok(())
}

pub fn create_db_directory() -> Result<PathBuf> {
    let mut db_path = env::current_dir()?;
    db_path.push(DATABASE_FOLDER);

    if !db_path.exists() {
        fs::create_dir(&db_path)?;
    }

    Ok(db_path)
}
