use std::io;
use std::os::windows::process::CommandExt;
use std::path::Path;
use std::process::Command;
use winapi::um::wincon::GetConsoleWindow;
use winapi::um::winuser::{ShowWindow, UpdateWindow, SW_HIDE};

use crate::utils::index::extract_before_exe;

fn execute_hidden_command(command: &str) -> io::Result<bool> {
    // Create a new command to execute the PowerShell script
    let mut cmd = Command::new("powershell.exe");

    // Set the arguments for the PowerShell script
    cmd.arg("-NoProfile").arg("-Command");

    println!("Service Command - {}", command);
    cmd.arg(&command);

    // Enable the `DETACHED_PROCESS` flag to hide the terminal window
    cmd.creation_flags(winapi::um::winbase::CREATE_NO_WINDOW);

    // Execute the command and capture the output
    let output = cmd.output()?;

    // Hide the console window
    unsafe {
        let window_handle = GetConsoleWindow();
        ShowWindow(window_handle, SW_HIDE);
        UpdateWindow(window_handle);
    }

    let stdout_str = String::from_utf8(output.stdout).unwrap();
    println!("Service Output - {}", stdout_str);

    Ok(true)
}

pub fn start_service(service_path: &str, visibility: &str) -> io::Result<bool> {
    // Construct the PowerShell command to start the service
    let path = Path::new(service_path);
    let parent_folder = path
        .parent()
        .unwrap_or_else(|| Path::new("No parent directory found"));

    let start_service_command = format!(
        "Start-Process -FilePath '{0}' -WindowStyle {1} -WorkingDirectory \"{2}\"",
        service_path,
        visibility,
        parent_folder.display()
    );

    let _ = execute_hidden_command(&start_service_command);

    Ok(true)
}

pub fn stop_service(service_path: &str) -> io::Result<bool> {
    // Construct the PowerShell command to start the service
    let name = extract_before_exe(service_path);
    println!("{}", name);
    let stop_service_command = format!("taskkill /IM {0}.exe /F", name);

    let _ = execute_hidden_command(&stop_service_command);

    Ok(true)
}
