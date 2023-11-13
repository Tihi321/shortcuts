use std::path::Path;
use std::process::Command;

pub fn open_in_explorer(shortcut_path: &str) -> std::io::Result<()> {
    let path = Path::new(shortcut_path);
    let parent_folder = path
        .parent()
        .unwrap_or_else(|| Path::new("No parent directory found"));

    let os_type = std::env::consts::OS;
    let result = match os_type {
        "windows" => Command::new("explorer")
            .arg(parent_folder.to_str().unwrap())
            .status(),
        "macos" => Command::new("open").arg(path.to_str().unwrap()).status(),
        "linux" => Command::new("xdg-open")
            .arg(path.to_str().unwrap())
            .status(),
        _ => Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "Unsupported OS",
        )),
    };

    result.map(|_| ())
}
