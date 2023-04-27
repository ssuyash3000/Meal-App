var app =(function(){
    let inputBar = document.getElementById("mealSearchBar");
    let listOfMealInDOM = document.getElementById("listOfMealInDOM");
    let errorMessage =  document.getElementById("errorMessage");
    let mealList = [];
    let favList = [];
    //function to add meal in the DOM
    function addMealToDOM(meal){
        let li = document.createElement("li");
        li.dataset.id = `${meal.idMeal}`;
        // li.setAttribute.id = "mealItem";
        li.setAttribute("id", "mealItem");
        li.innerHTML = `
        <img src="${meal.strMealThumb}" id = "poster" data-id="${meal.idMeal}" >
        <div id="details" data-id="${meal.idMeal}">

        <h1 id="mealTitle"  data-id="${meal.idMeal}">${meal.strMeal} </h1>
    
        <h3 id="mealCategory"  data-id="${meal.idMeal}">Category - ${meal.strCategory}</h3>

        <h3 id="area" data-id="${meal.idMeal}">Area - ${meal.strArea}</h3>

        <a id="youtube" href="${meal.strYoutube}" target="blank"> Tutorial </a>

        <a id="favBtn" data-id="${meal.idMeal}" data-title="${meal.strMeal}">Add to Favourites</a>
        
        </div>
        `;
        listOfMealInDOM.append(li);
    }
    //function to search the meal
    async function searchTheMeal(text){
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`);
        const data =  await response.json();
        if(data.meals == null){
            errorMessage.innerHTML = "No meals Found for given input";
            listOfMealInDOM.innerHTML = "";

        }else{
            errorMessage.innerHTML = "";
            mealList = data.meals;
            listOfMealInDOM.innerHTML = "";
            for(let i = 0; i < mealList.length; i++){
                addMealToDOM(mealList[i]);
            }
        }
    }   
    //function to add meal in fav list
    function addToFav(mealId, mealTitle){
        for(i of favList){
            if(i===mealId){
                errorMessage.innerHTML = "This meal is already in the Fav List";
                //clearing out the message in 4 seconds
                setTimeout(()=>{
                    errorMessage.innerHTML = "";
                }, 4000);
                
                return;
            }
        }
        favList.push(mealId);
        errorMessage.innerHTML = `${mealTitle} added in the fav List`;
        //clearing out the message in 4 seconds
        setTimeout(()=>{
            errorMessage.innerHTML = "";
        }, 4000);

        //updating the favList array in the localStorage each time 
        // favList is updated 
        localStorage.setItem("favList", JSON.stringify(favList));
    }
    //Event Delegation - handling all similar events under one function 
    function handleKeys(e){
        const text = inputBar.value;
        if(text.length !== 0 && e.target.id  === "mealSearchBar"){
            searchTheMeal(text);
        }
    }
    function handleClick(e){
        if(e.target.id === "mealItem" || e.target.id === "poster" ||e.target.id === "details" 
        || e.target.id ==="area" || e.target.id === "mealCategory" || e.target.id ==="mealTitle"){
            let mealId = e.target.dataset.id;
            localStorage.setItem("mealId", JSON.stringify(mealId));
            //console.log("mealItem Clicked " + mealId + e.target.id);
            window.open("./MealDetails/mealDetails.html");
        }
        else if(e.target.id === "clear"){
            listOfMealInDOM.innerHTML = "";
            errorMessage.innerHTML = "";
            inputBar.value = "";
        }
        else if(e.target.id === "favourite"){
            localStorage.setItem("mealId", JSON.stringify(favList));
            window.open("./Favourite/favourite.html");
        }else if(e.target.id === "favBtn"){
            addToFav(e.target.dataset.id, e.target.dataset.title);
        }
    }
    function appInitalize(){
        document.addEventListener("keyup", handleKeys);
        document.addEventListener("click", handleClick);
    }
    return {
        appInitalize:appInitalize,
    };
})();