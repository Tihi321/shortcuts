use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
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
