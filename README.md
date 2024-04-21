# AI RAG Bun Tests

This project was created using `bun init` in bun v1.1.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Description

This is a repo test sample for trying different ways to AI RAG using LLMs and bun.sh

- Search and storing vectors in MongoDB
- Search and storing vectors in other vector databases

## Tasks

### install:dependencies

To install dependencies:

```bash
bun install
```

### run

To run:

```bash
bun run index.ts
```

### agebox:encrypt

Encrypt all secrets files in the project:

```bash
agebox encrypt --all
```

### agebox:decrypt

Decrypt all secrets files in the project:

```bash
agebox decrypt --all
```

### localembeddingsmodel

Download and run local embeddings model using llamafile

If llamafile TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile is not present, it will be downloaded from the llamafile repository.

```bash
# Download llamafile binary
if [ ! -f llamafile-0.7.1 ]; then
wget https://github.com/Mozilla-Ocho/llamafile/releases/download/0.7.1/llamafile-0.7.1
# Make the file executable. On Windows, instead just rename the file to end in ".exe".
chmod +x llamafile-0.7.1
fi

# Download the model file
if [ ! -f TinyLlama-1.1B-Chat-v1.0.Q2_K.gguf ]; then
wget https://huggingface.co/jartine/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/fc0c95fca3c2a84e6032645951ec1d9c77fc336c/TinyLlama-1.1B-Chat-v1.0.Q2_K.gguf
fi

# Start the model server. Listens at http://localhost:8080 by default.
sh ./llamafile-0.7.1  --server --host 0.0.0.0 --embedding -ngl 0 --model ./TinyLlama-1.1B-Chat-v1.0.Q2_K.gguf --port 8080
```
