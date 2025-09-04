function searchRecipes(){
    const searchInput = document.getElementById('searchInput').value.trim();
    const recipeDiv = document.getElementById('recipes');
    const notFoundDiv = document.getElementById('notFound');

    //clear previous results
    recipeDiv.innerHTML = '';
    notFoundDiv.style.display = 'none';

    if(searchInput.trim() === ''){
        notFoundDiv.innerHTML = 'Please enter a recipe name to search!';
        notFoundDiv.style.display ='block';
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
    .then(Response => Response.json())
    .then(data => {
       if(!data.meals){
        notFoundDiv.innerHTML = 'Recipe not Found, please try another search !';
        notFoundDiv.style.display ='block';
       }
       else{
        data.meals.forEach(meal => {
           const card = document.createElement('div');
           card.classList.add('recipe-card');
           
           card.innerHTML = `
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
           <h3>${meal.strMeal}</h3>
           <button onclick= "viewRecipes('${meal.idMeal}')"> View Recipe</button>
           <button onclick= "addToFavorites('${meal.idMeal}')">&#10084; Add to Favorites</button>
           `;

           recipeDiv.appendChild(card);

        });
    }
    })
}

function viewRecipes(mealId){
    const popupCard = document.getElementById('popupCard');
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeDetails = document.getElementById('recipeDetails');
    const recipeIngredients = document.getElementById('recipeIngredients');

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then (response => response.json())
    .then(data => {
        const meal = data.meals[0];
        recipeTitle.innerText = meal.strMeal;
        recipeDetails.innerText = meal.strInstructions;
        recipeIngredients.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                const li = document.createElement("li");
                li.innerText = `${ingredient} - ${measure}`;
                recipeIngredients.appendChild(li);
            }
        }
        popupCard.classList.add('show');
    })
}

function closeRecipe(){
    document.getElementById('popupCard').classList.remove('show');
}

// Favorites Functions
function addToFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(mealId)) {
        favorites.push(mealId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
        alert("Recipe added to favorites!");
    } else {
        alert("This recipe is already in favorites!");
    }
}

function removeFromFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(id => id !== mealId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}

function clearFavorites() {
    if (confirm("Are you sure you want to remove all favorites?")) {
        localStorage.removeItem("favorites");
        loadFavorites();
        alert("All favorites have been cleared!");
    }
}

function loadFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesDiv.innerHTML = '<p>No favorites yet!</p>';
        return;
    }

    favorites.forEach(mealId => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const card = document.createElement('div');
            card.classList.add('recipe-card');

            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button onclick="viewRecipes('${meal.idMeal}')">View Recipe</button>
                <button onclick="removeFromFavorites('${meal.idMeal}')">❌ Remove</button>
            `;

            favoritesDiv.appendChild(card);
        });
    });
}

// Random Rcipe
function getRandomRecipe() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(response => response.json())
    .then(data => {
        const meal = data.meals[0];
        viewRecipes(meal.idMeal);
    });
}

// Load favorites 
window.onload = function() {
    loadFavorites();
   
};