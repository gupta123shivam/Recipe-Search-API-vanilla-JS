const searchBtn = document.querySelector('#search-btn')
const mealList = document.querySelector('#meals')
const mealDetailsContent = document.querySelector('.meal-details-content');  // overlay
const recipeCloseBtn = document.querySelector('#recipe-close-btn')  // overclose button

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// getting Meal list
async function getMealList(){
  const searchInputTxt = document.getElementById('search-input').value.trim();

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
  const data = await res.json();
  let html = "";
  if(data.meals){
    // ijecting each meal from data to HTML
    data.meals.forEach(meal => {
      // adding a daat attribute to store mealID as data-id
      html += `
          <div class="meal-item" data-id="${meal.idMeal}">   
              <div class="meal-img">
                  <img src="${meal.strMealThumb}" alt="food image">
              </div>
              <div class="meal-name">
                  <h3>${meal.strMeal}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
              </div>
          </div>
      `;
    });

    // removing notFound if present already
    mealList.classList.remove('notFound');
  } 
  else{
    html = "Sorry, we didn't find any meal!";
    mealList.classList.add('notFound');
  }

  mealList.innerHTML = html;
}


// getting recipe of the meal
async function getMealRecipe(e){
  e.preventDefault();

  if(e.target.classList.contains('recipe-btn')){
    const mealItem = e.target.parentElement.parentElement;  // corrsponding meal-item
    await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
    .then(response => response.json())
    .then(data => mealRecipeModal(data.meals));
  }
}

// create a overlay modal
function mealRecipeModal(meal){
    meal = meal[0]; // getting 1st meal from meal
    const html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="recipe image">
        </div>
        <div class = "recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch the Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}