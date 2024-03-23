# typst-to-ast (WIP)

## Development

wasm-pack is required for the build process. To install wasm-pack, execute the following command:

```sh
cargo install --locked --force wasm-pack
```

To build the WebAssembly, execute the following command:

```sh
wasm-pack build --target nodejs --out-dir ./dist
rm -f ./dist/.gitignore
```

To generate a build that can be used as a package, execute the following command:

```sh
bun run build
```
