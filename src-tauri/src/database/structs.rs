use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Shortcut {
    pub(crate) title: String,
    pub(crate) path: String,
}

#[derive(Serialize, Deserialize)]
pub struct Shortcuts {
    pub(crate) shortcuts: Vec<Shortcut>,
}
