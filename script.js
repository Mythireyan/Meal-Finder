const search = document.getElementById('search'),
	submit = document.getElementById('submit'),
	random = document.getElementById('random'),
	result = document.getElementById('result-heading'),
	single_mealEl = document.getElementById('single-meal'),
	meals = document.getElementById('meals');

//SEARCH INPUT FUNCTION
function searchInput(e){
	e.preventDefault();

//SINGLE MEAL ELEMENT
	single_mealEl.innerHTML='';

//GET SEARCH TERMS
	searchTerm = search.value;

//CHECK THERE IS NOT EMPTY SEARCH
if(searchTerm.trim()){

//FETCH THE API
fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
	.then(res => res.json())
	.then(data => {
		console.log(data);
		result.innerHTML=`<h2>Results Of Search Recepie: '<i>${searchTerm}</i>' </h2>`;

		//CHECKING WHEATHER THE MEAL IS AVAILABLE
		if(data.meals != null){
			meals.innerHTML=data.meals.map(meal=>
				`<div class='meal'>
						<div class='meal-info' meal-id='${meal.idMeal}'>
							<h3 class='meal-name'>${meal.strMeal}</h3>
						</div>
						<img src="${meal.strMealThumb}" alt="image">
				</div>
				`
		).join('');
			//CLEAR SEARCH
			search.value='';
		}else{
			result.innerHTML=`<h2>Sorry😔, Your Search Meal Is Not Available</h2>`;
		}
	})

}else{
	alert('There is no input entered')
}

}

//GETTING RANDOM MEAL USING API

function getRandomMeal(){
	result.innerHTML='';
	meals.innerHTML='';
	search.innerHTML='';

	fetch('https://www.themealdb.com/api/json/v1/1/random.php')
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0];
			updateDOM(meal); 
		})
}

//FETCHING A INDIVIDUAL MEAL BY ITS ID
function getMealById(mealID){
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then(res => res.json())
		.then(data =>{
			const meal = data.meals[0];
			updateDOM(meal);
		})
}
//UPDATING DOM WITH THE INDIVIDUAL MEAL
	function updateDOM(meal){
		const ingredients = [];
		for(let i=1; i<=20; i++){
			if(meal[`strIngredient${i}`]){
				ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
			}else{
				break;
			}
		}

		single_mealEl.innerHTML=`
		<div class="single-meal">
			<h1>${meal.strMeal}</h1>
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
			<div class='single-meal-info'>
				${meal.strCategory ? `<p>${meal.strCategory}</p>`:''}
				${meal.strArea ? `<p>${meal.strArea}</p>`:''}
			</div>
			<div class='main'>
				<p>${meal.strInstructions}</p>
				<h2>Ingrediants</h2>
				<ul>
					${ingredients.map(ing => `<li>${ing}</li>`).join('')}
				</ul>	
			</div>
		</div>`
	}

//EVENT LISTENERS

//SEARCH BUTTON
submit.addEventListener('submit', searchInput);

//RANDOM BUTTON
random.addEventListener('click', getRandomMeal);

//INDIVIDUAL MEAL
meals.addEventListener('click',(e)=>{
	const mealInfo = e.path.find(item=>{
		if(item.classList){
			return item.classList.contains('meal-info');
		}else{
			return false;
		}
	});
	if(mealInfo){
		const mealId = mealInfo.getAttribute('meal-id');
		
		getMealById(mealId)
	}

})