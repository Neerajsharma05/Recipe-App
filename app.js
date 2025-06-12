const searchBtn = document.querySelector("#searchBtn");
const UserInput = document.querySelector(".Search-box");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailConatiner = document.querySelector(".recipe-detailconatiner");
const recipeDetalCloseBtn = document.querySelector(".detal-close-btn");
const recipeInfo = document.querySelector(".recipe-info");
const blackScreen = document.querySelector(".black-screen");
const categoryContainer = document.querySelector(".category-container");
const aboutCategory = document.querySelector(".see-more");

blackScreen.style.display = "none";

// search box
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const search = UserInput.value.trim();
  if (!search) {
    return;
  }
  fetchRecipes(search);
  recipeContainer.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// fetch Searched Recipes from api
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipe...</h2>";

  try {
    const row = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await row.json();

    recipeContainer.innerHTML = "";

    data.meals.forEach((meal) => {
      if (meal.strArea === "indian") {
        console.log(meal.strMeal);
    }
      createMealCards(meal, recipeContainer);
      
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipe...</h2>";
  }
};

// create Cards for meals

const createMealCards = (meal, htmlsection) => {
  const recipeDiv = document.createElement("div");
  recipeDiv.classList.add("recipe");
  recipeDiv.innerHTML = `   
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p> <span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>`;

  // recipe button
  const ViewBtn = document.createElement("button");
  ViewBtn.innerHTML = "View Recipe";
  ViewBtn.classList.add("VewiRecipe");
  recipeDiv.appendChild(ViewBtn);
  htmlsection.appendChild(recipeDiv);

  // adding event listner to Recippe View
  ViewBtn.addEventListener("click", () => {
    recipeDetailPopup(meal);
    
    blackScreen.style.display = "block";

    // fetchIngredients(meal)
  });
};

// fetch category

const fecthCategories = async () => {
  try {
    // fetch meals categories
    const row = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    const data = await row.json();1

    for (let i = 1; i < 9; i++) {
      

      const meal = data.categories[`${i}`];
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
            <img src="${meal.strCategoryThumb}" alt="">
            <div class="tittle">
                <h4>${meal.strCategory}</h4>
                <a href="#searchResult">
                     <button class="see-more" data-index="${i}">See More</button>
                </a>
               
            </div>`;
      categoryContainer.appendChild(card);
    }
    // data.categories.forEach(meal =>{
    //     console.log(meal);
    // })

    document.querySelectorAll(".see-more").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const meal = data.categories[index];
        console.log(meal.strCategory);
        getMealid(meal.strCategory, recipeContainer);
        // recipeDetailPopup(meal);
        // blackScreen.style.display = 'block';
      });
    });
  } catch (error) {
    categoryContainer.innerHTML = `<h1>Fetching Some Error in Categories</h1>`;
    console.log(error);
  }
};
fecthCategories();


// provides meal id for categories

const getMealid = async (query, section) => { 
  section.innerHTML = "";
  const row = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`
  );
  const data = await row.json();

  const meals = data.meals;

  const combinedMeals = await Promise.all(
    meals.map(async (meal) => {
      const details = await mealDetail(meal.idMeal);
      return { ...meal, ...details };
    })
  );

  combinedMeals.forEach((meal) => createMealCards(meal, section));
};

//  Lookup full meal details by id
const mealDetail = async (MealId) => {

  try {
    
  
  const row = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${MealId}`
  );
  const data = await row.json();

  if (data.meals && data.meals.length > 0) {
    return data.meals[0]; // return full meal with ingredients
  } else {
    console.log("No meal found.");
    return {};
  }

  } catch (error) {
    console.log('erroe in Meal Details function');
  }
};

// fucntion to fecth ingredents and mesurments
const fetchIngredients = (meal) => {
  let ingredientsList = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${
        measure?.trim() || ""
      } ${ingredient.trim()}</li>`;
    } else {
      break; // No more valid ingredients
    }
  }

  return ingredientsList;
};

// sidebar menu

const sidebarMenu = () => {
  const menuBtn = document.querySelector(".ri-menu-line");
  const sidebar = document.querySelector(".side-bar-menu-conatiner"); // fixed selector (without All)
  const sidebarCloseBtn = document.querySelector("#closeSideBar"); // use correct ID or class

  menuBtn.addEventListener("click", () => {
    sidebar.style.display = "block";
    blackScreen.style.display = "block";
  });

  sidebarCloseBtn.addEventListener("click", () => {
    sidebar.style.display = "none"; // hides the sidebar
    blackScreen.style.display = "none";
  });


  // console.log(sideBarMenuBtn);
  
  const sideBarMenuBtn = document.querySelectorAll('.menuBtn'); 

sideBarMenuBtn.forEach((btn)=>{
    btn.addEventListener('click',()=>{
    sidebar.style.display = "none"; // hides the sidebar
    blackScreen.style.display = "none";

      
    })
  })


};
sidebarMenu();


// popup detail
const recipeDetailPopup = (meal) => {
  recipeDetailConatiner.style.display = "block";
  recipeDetalCloseBtn.style.display = "block";

  const ingredientsList = fetchIngredients(meal); // 👍 use outside if needed elsewhere

  recipeInfo.innerHTML = `
    <div class="d-right">
    <h1>${meal.strMeal}</h1>
    <h3>Ingredients : </h3>
    <ul>${ingredientsList}</ul>
    <h3>Instructions : </h3>
    <p>${meal.strInstructions}</p>
    </div>
    <div class="d-left">
        <img src="${meal.strMealThumb}">  
        <button class="YtSerachBtn">See on Youtube</button>

    </div>
    `;
  ytseacrh(meal.strMeal);
  
};
// recipe Close btn
recipeDetalCloseBtn.addEventListener("click", () => {
  recipeDetalCloseBtn.style.display = "none";
  recipeDetailConatiner.style.display = "none";
  blackScreen.style.display = "none";
});
// function to search on youtube

const ytseacrh = (query) => {
  try {
    const ytBtn = document.querySelector(".YtSerachBtn");
    if (ytBtn) {
      ytBtn.addEventListener("click", () => {
        window.open(`https://www.youtube.com/results?search_query=${query}`);
      });
    }
  } catch (erroe) {
    console.log("error in fetch youtube section");
  }
};

// --------------Create section 1 ---------------

const section1 = document.querySelector(".sec");
const secContainer = document.querySelector(".sec-recipeContainer");
const secTitle = document.querySelector("#cake");

const fecthSec = async (query, section) => {
  try {
    const row = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await row.json();

    data.meals.forEach((meal) => {
      // console.log(meal);
      createMealCards(meal, section);
    });
  } catch (error) {
    console.log("erroe in fetch section");
  }
};

const section2 = document.querySelector(".sec");
const secContainer2 = document.querySelector(".sec2");
const secContainer3 = document.querySelector(".sec3");
const secContainer4 = document.querySelector(".sec4");
const secContainer5 = document.querySelector(".sec5");

fecthSec("Breakfast", secContainer);
fecthSec("Vegetarian", secContainer2);
fecthSec("Chicken", secContainer3);
fecthSec("Cheese", secContainer4);
fecthSec("", secContainer5);

// veg meal api
//
getMealid("Vegetarian", secContainer2);
