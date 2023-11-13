use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Shortcut {
    pub(crate) id: String,
    pub(crate) visibility: String,
    pub(crate) name: String,
    pub(crate) path: String,
}

#[derive(Serialize, Deserialize)]
pub struct Shortcuts {
    pub(crate) items: Vec<Shortcut>,
}
