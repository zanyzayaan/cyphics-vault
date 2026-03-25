# VAULT | Classical Cryptography Suite

VAULT is a web-based application designed to encrypt and decrypt messages using historical cryptographic algorithms. It features a modern interface and an intelligent auto-detection engine to simplify the decryption process.

## Live Demo
You can access the live application at: https://zanyzayaan.github.io/cyphics-vault/

## Features
* Multi-Cipher Support: Supports Caesar, Atbash, ROT13, Vigenere, Beaufort, Rail Fence, and Baconian ciphers.
* Auto-Detect Engine: Analyzes input text patterns and frequency to automatically identify the cipher type and calculate potential shift keys.
* Glassmorphism UI: A dark-themed interface focused on readability and professional aesthetics.
* Clipboard Integration: Includes a dedicated copy function for quick result exporting.

## Technical Implementation: Auto-Detection Logic
The application utilizes a multi-stage approach to identify encrypted text:
1. Regex Validation: Identifies Baconian and Base64 encoding by checking for specific character sets and padding.
2. Frequency Analysis: For substitution ciphers like Caesar, the engine tests all 26 possible rotations. It scores each rotation based on standard English letter frequency (ETAOIN). The version with the highest linguistic score is automatically displayed to the user.

## Tech Stack
* HTML5: Semantic structure.
* CSS3: Custom layouts using Flexbox and Grid.
* JavaScript (ES6+): Core logic, DOM manipulation, and cryptographic algorithms.

## Usage Instructions
1. Enter or paste the text into the Input field.
2. Select the "Auto-Detect" button to let the engine identify the cipher, or manually choose a method from the dropdown menu.
3. Provide a key or shift value if the specific cipher requires it.
4. View the processed result in the Output field and use the Copy button to save it to your clipboard.
