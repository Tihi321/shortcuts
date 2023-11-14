use std::path::Path;

fn get_base_name(service_path: &str) -> &str {
    let path = Path::new(service_path);
    let file_name = path.file_stem().unwrap();

    return file_name.to_str().unwrap();
}

pub fn extract_before_extension(input: &str) -> &str {
    return get_base_name(input);
}
