
# Southeast Asian Recipes App - Roadmap

## Overview
This application is a single-page web app showcasing popular Southeast Asian dishes. Users can click on a dish image to view the recipe, ingredients, and cooking instructions.

## Features
1. **Dish Gallery** - Display a grid of images representing each dish.
2. **Recipe Display Modal** - When a dish is clicked, a modal opens with:
   - Image of the dish
   - List of ingredients
   - Step-by-step cooking instructions
3. **Search and Filter** (Future) - Enable users to search dishes by country or main ingredients.

## Project Setup
### 1. Tech Stack
   - **Frontend**: HTML, CSS, JavaScript (or a framework like React/Vue for scalability)
   - **Data**: JSON file for recipes (dish name, image URL, ingredients, steps)

### 2. Folder Structure 
    - /public - images/ - dish1.jpg - dish2.jpg ... /src - data/ - recipes.json 
# Contains all dish data - components/ - Gallery.js 
# Dish gallery component - Modal.js 
# Modal for displaying recipes - App.js 

# Main app file

## Milestones

### Phase 1 - Project Setup and Initial Components
- **Goal**: Set up the project structure and create basic components.
- [ ] Initialize project (e.g., using Create React App if React is chosen)
- [ ] Set up folder structure and import assets (images, JSON)
- [ ] Create a simple `App.js` layout with header and placeholder for gallery

### Phase 2 - Dish Gallery
- **Goal**: Create a responsive gallery that displays all dishes.
- [ ] Design and style the gallery grid in CSS
- [ ] Fetch data from `recipes.json` to display dish images and names
- [ ] Set up `Gallery.js` to map data into clickable image cards

### Phase 3 - Recipe Display Modal
- **Goal**: Display recipe details when a dish is clicked.
- [ ] Create a `Modal.js` component for recipe details
- [ ] Add functionality to open modal with dish data on click
- [ ] Style modal for readability (ingredients list, steps section)

### Phase 4 - Search and Filter (Optional)
- **Goal**: Enhance user experience with search functionality.
- [ ] Add input field to search/filter by dish name or ingredient
- [ ] Filter data dynamically as user types

### Phase 5 - Polish and Deployment
- **Goal**: Finalize and deploy the project for demo.
- [ ] Test functionality on multiple devices for responsiveness
- [ ] Fix any CSS or JavaScript bugs
- [ ] Deploy on GitHub Pages, Vercel, or Netlify

## Future Enhancements
- **Backend**: Integrate with a backend to dynamically fetch data and allow adding new recipes.
- **User Accounts**: Add features like saving favorite recipes.
- **Advanced Filtering**: Allow filtering by country, preparation time, or difficulty level.

