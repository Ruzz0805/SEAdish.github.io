// Recipe data handling
let recipes = [];

async function fetchRecipes() {
    try {
        console.log('Fetching recipes...');
        const response = await fetch('./src/data/recipes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        recipes = data.recipes;
        console.log(`Successfully loaded ${recipes.length} recipes`);
        console.log('Recipes by country:', 
            recipes.reduce((acc, recipe) => {
                acc[recipe.country] = (acc[recipe.country] || 0) + 1;
                return acc;
            }, {})
        );
        
        // Initialize the current page content
        const currentPage = document.querySelector('.nav-links .active').dataset.page;
        navigateToPage(currentPage);
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.querySelector('.main-content').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Recipes</h2>
                <p>There was a problem loading the recipes. Please check:</p>
                <ul>
                    <li>Your internet connection</li>
                    <li>That you're running through a local server</li>
                    <li>The file path to recipes.json is correct</li>
                </ul>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

function displayRecipes(recipesToShow) {
    console.log('Displaying recipes:', recipesToShow.length);
    const recipeGrid = document.querySelector('.recipe-grid');
    if (!recipeGrid) {
        console.error('Recipe grid not found!');
        return;
    }
    
    recipeGrid.innerHTML = '';

    if (recipesToShow.length === 0) {
        recipeGrid.innerHTML = '<div class="no-recipes">No recipes found</div>';
        return;
    }

    recipesToShow.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipeGrid.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(recipe.id);
    
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <span class="country-tag">${recipe.country}</span>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${recipe.id}">
            ${isFavorite ? '❤️' : '🤍'}
        </button>
    `;
    
    // Add error handling for image load
    const img = card.querySelector('img');
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/300x200?text=No+Image';
    });
    
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('favorite-btn')) {
            openModal(recipe);
        }
    });

    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(recipe.id, favoriteBtn);
    });
    
    return card;
}

function toggleFavorite(recipeId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
        button.textContent = '🤍';
        button.classList.remove('active');
    } else {
        favorites.push(recipeId);
        button.textContent = '❤️';
        button.classList.add('active');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Enhanced Modal Function
function openModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalImage = modal.querySelector('img');
    const modalTitle = modal.querySelector('h2');
    const ingredientsList = modal.querySelector('.ingredients ul');
    const instructionsList = modal.querySelector('.instructions ol');

    modalImage.src = recipe.image;
    modalTitle.textContent = recipe.name;
    
    // Clear and populate ingredients
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    // Clear and populate instructions
    instructionsList.innerHTML = '';
    recipe.instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });

    modal.style.display = 'block';
}

// Enhanced Search Function
function searchRecipes(searchTerm) {
    const filteredRecipes = recipes.filter(recipe => {
        const searchString = `${recipe.name} ${recipe.description} ${recipe.country}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });
    displayRecipes(filteredRecipes);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    
    // Add click handlers for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = e.currentTarget.parentElement.dataset.page;
            navigateToPage(pageName);
        });
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('recipeModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Add this at the top of your existing app.js
const pages = {
    home: `
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
            <div class="recipe-grid featured-grid"></div>
            <div class="see-more-container">
                <button class="see-more-btn" onclick="navigateToPage('allRecipes')">See More Recipes</button>
            </div>
        </div>
    `,
    allRecipes: `
        <div class="recipe-filter-section">
            <div class="country-dropdown">
                <select id="countrySelect" class="country-select">
                    <option value="all">All Countries</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Laos">Laos</option>
                </select>
            </div>
            <div class="recipe-count">
                <span id="recipeCounter">Showing all recipes</span>
            </div>
        </div>
        ${displayRecipeStats()}
        <div class="recipe-grid"></div>
    `,
    search: `
        <div class="advanced-search">
            <div class="search-filters">
                <input type="text" placeholder="Recipe name..." class="search-input">
                <select class="country-select">
                    <option value="">All Countries</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Laos">Laos</option>
                </select>
                <button class="search-btn">Search</button>
            </div>
            <div class="recipe-grid"></div>
        </div>
    `,
    countries: `
        <div class="countries-grid">
            <div class="country-card" data-country="Indonesia">
                <img src="https://images.unsplash.com/photo-1552567919-1831c9200bbb?w=800" alt="Indonesia">
                <h3>Indonesia</h3>
                <p>Traditional Indonesian Recipes</p>
            </div>
            <div class="country-card" data-country="Thailand">
                <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=800" alt="Thailand">
                <h3>Thailand</h3>
                <p>Authentic Thai Cuisine</p>
            </div>
            <div class="country-card" data-country="Philippines">
                <img src="https://images.unsplash.com/photo-1542379950-b3fc716c16e5?w=800" alt="Philippines">
                <h3>Philippines</h3>
                <p>Filipino Favorites</p>
            </div>
            <div class="country-card" data-country="Vietnam">
                <img src="https://images.unsplash.com/photo-1583417319-070-4a69db38a482?w=800" alt="Vietnam">
                <h3>Vietnam</h3>
                <p>Vietnamese Delicacies</p>
            </div>
            <div class="country-card" data-country="Malaysia">
                <img src="https://images.unsplash.com/photo-1540961566528-8d5e5ea7329d?w=800" alt="Malaysia">
                <h3>Malaysia</h3>
                <p>Malaysian Specialties</p>
            </div>
            <div class="country-card" data-country="Cambodia">
                <img src="https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800" alt="Cambodia">
                <h3>Cambodia</h3>
                <p>Cambodian Cuisine</p>
            </div>
            <div class="country-card" data-country="Myanmar">
                <img src="https://images.unsplash.com/photo-1554672723-d42a16e533db?w=800" alt="Myanmar">
                <h3>Myanmar</h3>
                <p>Burmese Traditional Dishes</p>
            </div>
            <div class="country-card" data-country="Laos">
                <img src="https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=800" alt="Laos">
                <h3>Laos</h3>
                <p>Laotian Food Heritage</p>
            </div>
        </div>
    `,
    favorites: `
        <div class="favorites-container">
            <h2>Your Favorite Recipes</h2>
            <div class="recipe-grid"></div>
        </div>
    `,
    randomDish: `
        <div class="random-generator">
            <div class="generator-header">
                <h2>Random Dish Generator</h2>
                <p>Can't decide what to cook? Let us pick a random dish for you!</p>
            </div>
            <div class="generator-container">
                <div class="random-dish-display">
                    <!-- Random dish will be displayed here -->
                </div>
                <button class="generate-btn">
                    <span class="btn-text">Generate Random Dish</span>
                    <span class="btn-icon">🎲</span>
                </button>
            </div>
        </div>
    `
};

// Add this to your existing styles.css
const loadingHTML = `
    <div class="loading">
        <p>Loading recipes...</p>
    </div>
`;

// Add these new functions
function navigateToPage(pageName) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = pages[pageName];
    
    // Update active nav link
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Initialize page-specific content
    switch(pageName) {
        case 'home':
            const featuredRecipes = getRandomRecipes(3);
            const featuredGrid = document.querySelector('.featured-grid');
            if (featuredGrid) {
                featuredGrid.innerHTML = '';
                featuredRecipes.forEach(recipe => {
                    const card = createRecipeCard(recipe);
                    featuredGrid.appendChild(card);
                });
            }
            break;
        case 'allRecipes':
            initializeFilters();
            break;
        case 'search':
            initializeSearch();
            break;
        case 'favorites':
            displayFavorites();
            break;
        case 'countries':
            initializeCountryCards();
            break;
        case 'randomDish':
            // Initialize random generator and trigger first random dish
            setTimeout(() => {
                initializeRandomGenerator();
                const generateBtn = document.querySelector('.generate-btn');
                if (generateBtn) {
                    generateBtn.click(); // Generate first random dish automatically
                }
            }, 100);
            break;
    }
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
    displayRecipes(favoriteRecipes);
}

function initializeCountryCards() {
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        card.addEventListener('click', () => {
            const country = card.dataset.country;
            const filteredRecipes = recipes.filter(recipe => recipe.country === country);
            navigateToPage('allRecipes');
            displayRecipes(filteredRecipes);
        });
    });
}

// Add this function to get random recipes
function getRandomRecipes(count) {
    // Get one recipe from each country if possible
    const countries = [...new Set(recipes.map(recipe => recipe.country))];
    let selectedRecipes = [];

    // First, try to get one recipe from different countries
    countries.forEach(country => {
        const countryRecipes = recipes.filter(recipe => recipe.country === country);
        const randomRecipe = countryRecipes[Math.floor(Math.random() * countryRecipes.length)];
        if (selectedRecipes.length < count) {
            selectedRecipes.push(randomRecipe);
        }
    });

    // If we need more recipes, add random ones
    if (selectedRecipes.length < count) {
        const remainingRecipes = recipes.filter(recipe => 
            !selectedRecipes.find(selected => selected.id === recipe.id)
        );
        const additional = remainingRecipes
            .sort(() => 0.5 - Math.random())
            .slice(0, count - selectedRecipes.length);
        selectedRecipes = [...selectedRecipes, ...additional];
    }

    return selectedRecipes.slice(0, count);
}

// Add a function to display recipe count by country
function displayRecipeStats() {
    const countByCountry = recipes.reduce((acc, recipe) => {
        acc[recipe.country] = (acc[recipe.country] || 0) + 1;
        return acc;
    }, {});

    return `
        <div class="recipe-stats">
            <h3>Recipe Collection</h3>
            <div class="stats-grid">
                ${Object.entries(countByCountry).map(([country, count]) => `
                    <div class="stat-item">
                        <span class="country-name">${country}</span>
                        <span class="recipe-count">${count} recipes</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Add CSS for the new recipe stats section
const statsStyles = `
    <style>
    .recipe-stats {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .recipe-stats h3 {
        text-align: center;
        margin-bottom: 15px;
        color: #2c3e50;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        padding: 10px;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
    }

    .country-name {
        font-weight: 500;
        color: #2c3e50;
    }

    .recipe-count {
        color: #3498db;
        font-weight: 500;
    }
    </style>
`;

// Add the styles to the document head
document.head.insertAdjacentHTML('beforeend', statsStyles);

// Add these functions after your existing code

function initializeFilters() {
    const countrySelect = document.querySelector('#countrySelect');
    const recipeCounter = document.querySelector('#recipeCounter');
    
    if (countrySelect) {
        countrySelect.addEventListener('change', () => {
            const selectedCountry = countrySelect.value;
            let filteredRecipes;
            
            if (selectedCountry === 'all') {
                filteredRecipes = recipes;
                recipeCounter.textContent = `Showing all recipes (${recipes.length})`;
            } else {
                filteredRecipes = recipes.filter(recipe => recipe.country === selectedCountry);
                recipeCounter.textContent = `Showing ${filteredRecipes.length} recipes from ${selectedCountry}`;
            }

            // Display filtered recipes
            const recipeGrid = document.querySelector('.recipe-grid');
            recipeGrid.innerHTML = ''; // Clear existing cards
            
            if (filteredRecipes.length === 0) {
                recipeGrid.innerHTML = '<div class="no-recipes">No recipes found for this country</div>';
            } else {
                filteredRecipes.forEach(recipe => {
                    const card = createRecipeCard(recipe);
                    recipeGrid.appendChild(card);
                });
            }
        });

        // Initialize with all recipes
        const allRecipes = recipes;
        recipeCounter.textContent = `Showing all recipes (${allRecipes.length})`;
        const recipeGrid = document.querySelector('.recipe-grid');
        allRecipes.forEach(recipe => {
            const card = createRecipeCard(recipe);
            recipeGrid.appendChild(card);
        });
    }
}

// Add search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const countrySelect = document.querySelector('.country-select');
    const searchBtn = document.querySelector('.search-btn');

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCountry = countrySelect.value;

        const filteredRecipes = recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                                recipe.description.toLowerCase().includes(searchTerm);
            const matchesCountry = !selectedCountry || recipe.country === selectedCountry;
            return matchesSearch && matchesCountry;
        });

        displayRecipes(filteredRecipes);
    };

    searchInput.addEventListener('input', performSearch);
    countrySelect.addEventListener('change', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

// Update the getRandomRecipes function to get recipes by country
function getRandomRecipesByCountry(country, count) {
    const countryRecipes = recipes.filter(recipe => recipe.country === country);
    const shuffled = [...countryRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Add this function to handle random dish generation
function initializeRandomGenerator() {
    const generateBtn = document.querySelector('.generate-btn');
    const displayArea = document.querySelector('.random-dish-display');

    if (generateBtn && displayArea) {
        const generateRandomDish = () => {
            // Add spinning animation to button
            generateBtn.classList.add('spinning');
            
            // Fade out current dish
            displayArea.classList.add('fade-out');

            // Wait for fade out, then generate new dish
            setTimeout(() => {
                const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
                
                displayArea.innerHTML = `
                    <div class="random-card">
                        <div class="random-image">
                            <img src="${randomRecipe.image}" alt="${randomRecipe.name}" 
                                onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                        </div>
                        <div class="random-info">
                            <h3>${randomRecipe.name}</h3>
                            <p class="country">${randomRecipe.country}</p>
                            <p class="description">${randomRecipe.description}</p>
                            <div class="random-buttons">
                                <button class="view-recipe-btn" onclick="openModal(${JSON.stringify(randomRecipe).replace(/"/g, '&quot;')})">
                                    View Recipe
                                </button>
                                <button class="try-again-btn" onclick="return false;">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                // Remove spinning class from button
                generateBtn.classList.remove('spinning');
                
                // Fade in new dish
                displayArea.classList.remove('fade-out');
                displayArea.classList.add('fade-in');

                // Add click handler to the Try Again button
                const tryAgainBtn = displayArea.querySelector('.try-again-btn');
                if (tryAgainBtn) {
                    tryAgainBtn.addEventListener('click', generateRandomDish);
                }

                // Remove fade-in class after animation
                setTimeout(() => {
                    displayArea.classList.remove('fade-in');
                }, 500);
            }, 500);
        };

        // Add click handler to the main generate button
        generateBtn.addEventListener('click', generateRandomDish);
    }
}