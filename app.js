async function fetchRecipes() {
    try {
        console.log('Fetching recipes...');
        const response = await fetch('/SEAdish.github.io/src/data/recipes.json');
        
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