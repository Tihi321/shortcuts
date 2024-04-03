import { open } from "@tauri-apps/plugin-dialog";

export const openFile = async () => {
  try {
    // Opens a file dialog allowing the user to select files
    const selected = await open({
      // Optional: specify filters for file types
      filters: [
        {
          name: "Application",
          extensions: ["exe", "bat"],
        },
      ],
      // Optional: specify if multiple files can be selected
      multiple: false,
      // Optional: specify if directories can be selected
      directory: false,
    });
    return selected;

    // Handle the selected file path
  } catch (error) {
    console.error("Error opening file dialog:", error);

    return "";
  }
};
