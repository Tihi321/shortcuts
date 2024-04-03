use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Tab {
    pub(crate) name: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize)]
pub struct Path {
    pub(crate) base64Data: Option<String>,
    pub(crate) duration: Option<f64>,
    pub(crate) height: Option<f64>,
    pub(crate) mimeType: Option<String>,
    pub(crate) modifiedAt: Option<String>,
    pub(crate) name: String,
    pub(crate) path: String,
    pub(crate) size: i32,
    pub(crate) width: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct RenameTab {
    pub(crate) current: String,
    pub(crate) new: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct ShortcutReceived {
    pub(crate) list: String,
    pub(crate) id: String,
    pub(crate) visibility: String,
    pub(crate) name: String,
    pub(crate) path: Path,
    pub(crate) arguments: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Shortcut {
    pub(crate) list: String,
    pub(crate) id: String,
    pub(crate) visibility: String,
    pub(crate) name: String,
    pub(crate) path: String,
    pub(crate) arguments: String,
}

#[derive(Serialize, Deserialize)]
pub struct ShortcutsList {
    pub(crate) list: String,
    pub(crate) shortcuts: Vec<Shortcut>,
}
