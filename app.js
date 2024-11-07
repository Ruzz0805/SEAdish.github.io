let recipes = [];

async function fetchRecipes() {
    try {
        console.log('Fetching recipes...');
        // Try one of these fetch paths:
        
        // Option 1: Using relative path from root
        const response = await fetch('/SEAdish.github.io/src/data/recipes.json');
        
        // Option 2: Using full URL (replace USERNAME with your GitHub username)
        // const response = await fetch('https://ruzz0805.github.io/SEAdish.github.io/src/data/recipes.json');
        
        // Add detailed error logging
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        recipes = data.recipes;
        console.log(`Successfully loaded ${recipes.length} recipes`);
        
        // Initialize the current page content
        const currentPage = document.querySelector('.nav-links .active')?.dataset.page || 'home';
        navigateToPage(currentPage);
        
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            location: window.location.href
        });
        
        document.querySelector('.main-content').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Recipes</h2>
                <p>There was a problem loading the recipes. Details:</p>
                <ul>
                    <li>Error: ${error.message}</li>
                    <li>Current URL: ${window.location.href}</li>
                    <li>Attempted path: /SEAdish.github.io/src/data/recipes.json</li>
                </ul>
            </div>
        `;
    }
}

// Add this function to handle navigation
function navigateToPage(page) {
    console.log('Navigating to:', page);
    
    // Get the main content container
    const mainContent = document.querySelector('.main-content');
    
    switch (page) {
        case 'allRecipes':
            displayAllRecipes(mainContent);
            break;
        case 'randomDish':
            displayRandomRecipe(mainContent);
            break;
        case 'favorites':
            displayFavorites(mainContent);
            break;
        case 'search':
            displaySearch(mainContent);
            break;
        case 'countries':
            displayCountries(mainContent);
            break;
        case 'home':
        default:
            displayHome(mainContent);
    }
}

// Add event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Fetch recipes when the page loads
    fetchRecipes();
    
    // Add click handlers for navigation links
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-links li').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the page from data-page attribute
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });
});

// Helper functions for displaying content
function displayAllRecipes(container) {
    if (!recipes.length) {
        container.innerHTML = '<p>No recipes available.</p>';
        return;
    }

    const recipesHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <span class="country-tag">${recipe.country}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="recipes-grid">
            ${recipesHTML}
        </div>
    `;
}

function displayRandomRecipe(container) {
    if (!recipes.length) {
        container.innerHTML = '<p>No recipes available.</p>';
        return;
    }

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    container.innerHTML = `
        <div class="random-recipe">
            <h2>Today's Random Recipe</h2>
            <div class="recipe-card large" onclick="showRecipeDetails(${randomRecipe.id})">
                <img src="${randomRecipe.image}" alt="${randomRecipe.name}">
                <h3>${randomRecipe.name}</h3>
                <p>${randomRecipe.description}</p>
                <span class="country-tag">${randomRecipe.country}</span>
            </div>
        </div>
    `;
}

function displayFavorites(container) {
    // Implement favorites functionality
    container.innerHTML = `
        <div class="favorites-placeholder">
            <h2>Favorites</h2>
            <p>Favorites feature coming soon!</p>
        </div>
    `;
}

// Add this function to show recipe details
function showRecipeDetails(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const modal = document.querySelector('.recipe-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}">
            <p>${recipe.description}</p>
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions">
                <h3>Instructions</h3>
                <ol>
                    ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    document.querySelector('.recipe-modal').style.display = 'none';
}