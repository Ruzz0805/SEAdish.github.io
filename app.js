let recipes = [];

async function fetchRecipes() {
    try {
        console.log('Fetching recipes...');
        
        // Determine the correct base URL
        const baseURL = window.location.hostname.includes('github.io') 
            ? '/SEAdish.github.io'
            : '';
            
        const response = await fetch(`${baseURL}/src/data/recipes.json`);
        
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
        console.error('Error loading recipes:', error);
        document.querySelector('.main-content').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Recipes</h2>
                <p>There was a problem loading the recipes.</p>
                <p>Error details: ${error.message}</p>
                <p>Please try:</p>
                <ul>
                    <li>Refreshing the page</li>
                    <li>Checking your internet connection</li>
                    <li>Clearing your browser cache</li>
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

// Add this function to display the home page content
function displayHome(container) {
    container.innerHTML = `
        <div class="hero-section">
            <h1>Welcome to SEA Dishes</h1>
            <p class="hero-text">Discover the vibrant flavors of Southeast Asia, where every dish tells a story of tradition, culture, and passion. From the spicy streets of Thailand to the aromatic kitchens of Indonesia and the savory homes of the Philippines, join us on a culinary adventure that will transform your cooking experience.</p>
            <div class="hero-features">
                <div class="feature">
                    <span>🍳</span>
                    <p>Authentic Recipes</p>
                </div>
                <div class="feature">
                    <span>📝</span>
                    <p>Step-by-Step Guide</p>
                </div>
                <div class="feature">
                    <span>🌏</span>
                    <p>Cultural Insights</p>
                </div>
            </div>
        </div>
        <div class="featured-section">
            <div class="section-header">
                <h2>Featured Recipes</h2>
                <p>Explore our hand-picked dishes from across Southeast Asia</p>
            </div>
            <div class="recipe-grid featured-grid">
                ${displayFeaturedRecipes()}
            </div>
            <div class="see-more-container">
                <button class="see-more-btn" onclick="navigateToPage('allRecipes')">See More Recipes</button>
            </div>
        </div>
    `;
}

// Add helper function to display featured recipes
function displayFeaturedRecipes() {
    if (!recipes.length) return '';
    
    // Get 4 random recipes for the featured section
    const featuredRecipes = [...recipes]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    
    return featuredRecipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <span class="country-tag">${recipe.country}</span>
        </div>
    `).join('');
}

// Add the search display function
function displaySearch(container) {
    container.innerHTML = `
        <div class="search-section">
            <h2>Search Recipes</h2>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search by name, country, or ingredients...">
            </div>
            <div class="search-results recipe-grid">
                <!-- Search results will be displayed here -->
            </div>
        </div>
    `;

    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
}

// Add search handler function
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const searchResults = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.country.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );

    const resultsContainer = document.querySelector('.search-results');
    if (searchTerm.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }

    resultsContainer.innerHTML = searchResults.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <span class="country-tag">${recipe.country}</span>
        </div>
    `).join('');
}

// Add the countries display function
function displayCountries(container) {
    const countries = [...new Set(recipes.map(recipe => recipe.country))];
    
    container.innerHTML = `
        <div class="countries-section">
            <h2>Browse by Country</h2>
            <div class="countries-grid">
                ${countries.map(country => `
                    <div class="country-card" onclick="showCountryRecipes('${country}')">
                        <h3>${country}</h3>
                        <p>${country} recipes</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}