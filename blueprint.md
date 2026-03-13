# Project Blueprint: Lotto Number Recommender

## Overview

A simple, visually appealing web application to generate random lottery numbers, including a bonus number. The application will be built with modern HTML, CSS, and JavaScript, following Baseline web standards.

## Current Plan

### 1. **Project Setup**
- Create the initial `blueprint.md` file to document the project.

### 2. **HTML Structure (`index.html`)**
- Set up the main HTML document.
- Add a descriptive title.
- Create a container for the lottery number display.
- Add a button to trigger the number generation.
- Link the CSS (`style.css`) and JavaScript (`main.js`) files.

### 3. **Styling (`style.css`)**
- Apply a clean and modern design.
- Use CSS variables for a consistent color scheme.
- Style the number display to be clear and readable.
- Add interactive styles for the button.
- Ensure the layout is responsive and mobile-friendly.

### 4. **JavaScript Logic (`main.js`)**
- Create a Web Component named `lotto-display` to encapsulate the number display logic.
- Implement a function to generate 6 unique random numbers between 1 and 45.
- Implement a function to generate a bonus number, ensuring it doesn't conflict with the main numbers.
- Add an event listener to the button to trigger the number generation and update the display.
