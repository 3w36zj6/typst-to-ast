use typst::syntax::{ast::AstNode, *};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse_typst_to_ast(input: &str) -> JsValue {
    let parsed = parse(input);
    let typst_stx =
        typst::syntax::ast::Markup::from_untyped(&parsed).expect("Failed to parse input");
    let result_string = format!("{:?}", typst_stx);
    JsValue::from_str(&result_string)
}
