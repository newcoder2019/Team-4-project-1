
console.log(keys)

function searchRecipeByTerms(foodTerm) {
    let url = "http://api.yummly.com/v1/api/recipes";
    url += '?_app_id=' + keys.yummly.appId
        + '&_app_key=' + keys.yummly.key
        + '&q=' + foodTerm;
    $.ajax({
        url: url,
        method: 'GET',
        success: function (result) {
            appendResult(result.matches)
        }
    }).fail(function (err) {
        throw err;
    });
}

function secondsToMinutes(seconds) {
    return parseInt(seconds) / 60;
}

function appendResult(food) {
    $('#foods').html('');
    $('#foodlist').html('');
    $('#walmartDiv').html('');
    if (food.length == 0) {
        $('#foods').html('No results found');
    }
    for (var i = 0; i < food.length; i++) {
        $('#foods').append(`
            <div class="card" style="width: 18rem;">
            <img class="card-img-top" src=${food[i].smallImageUrls[0]} alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title"><ul>${food[i].recipeName}</ul></h5>
            <p class="card-text">
                <ul>Prepared in ${secondsToMinutes(food[i].totalTimeInSeconds)} minutes</ul>
                </p>
            <ul><a href="#" class="btn btn-primary" id='wantIt' data-val=${food[i].id}>Click for more</a></ul>
            </div>
            </div>
            <br>
            `)
    }
}

function searchByID(yummlyId) {
    let url = "http://api.yummly.com/v1/api/recipe/";
    url += yummlyId
        + '?_app_id=' + keys.yummly.appId
        + '&_app_key=' + keys.yummly.key
    $.ajax({
        url: url,
        method: 'GET',
        success: function (result) {
            console.log(result)
            displayRecipe(result)
        }
    }).fail(function (err) {
        throw err;
    });
}

function findCaloriesIndex(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].attribute.toLowerCase().includes('kcal')) {
            return i;
        }
    }
    return 0;
}

function displayRecipe(result) {
    $('#foodlist').html('');

    let names = result.ingredientLines;
    let uniqueNames = [];
    $.each(names, function (i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });

    var recipeObj = new recipe(
        result.name, String(result.totalTime), uniqueNames,
        result.id, result.numberOfServings, result.images[0].hostedSmallUrl,
        result.source.sourceRecipeUrl, result.nutritionEstimates[findCaloriesIndex(result.nutritionEstimates)]
    );

    console.log(recipeObj);
    //this object can be saved to firebase

    $('#foodlist').append(`
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src=${recipeObj.imgLink} alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${recipeObj.name}</h5>
                <p class="card-text">
                    <ul>Servings: ${recipeObj.servingSize}</ul>
                    <ul>Calories: ${recipeObj.getCal()}</ul>
                    <ul>Time to Prepare: ${recipeObj.prepTime}</ul>
                    </p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>Ingredients</b></li>
                ${showIngredients(recipeObj.ingredients)}
            </ul>
            <div class="card-body">
                <a href=${recipeObj.URL} target="_blank" class="card-link">Click here for recipe</a>
            </div>
        </div>
        
        `)
}

function recipe(name, prepTime, ingredients, id, servingSize, imgLink, URL, calories) {
    this.name = name;
    this.prepTime = prepTime;
    this.ingredients = ingredients; //array
    this.id = id;
    this.servingSize = servingSize;
    this.imgLink = imgLink;
    this.URL = URL;
    this.calories = calories; //object
    this.getCal = function () {
        return ((this.calories != null) ? (String(this.calories.value) + ' ' + String(this.calories.unit.pluralAbbreviation)) : 'Not Available');

        // if (this.calories != null) {
        //     return (String(this.calories.value) + ' ' + String(this.calories.unit.pluralAbbreviation));
        // } else {
        //     return 'Not Available'
        // }
    }
}

function showIngredients(ingredients) {
    //${showIngredients(food[i].ingredients)}
    let toReturn = '';
    for (let i = 0; i < ingredients.length; i++) {
        toReturn += `<li class="list-group-item" id="walmartable" data-val="${cleanIngredient(ingredients[i])}">${ingredients[i]}</li>`
    }
    return toReturn;
}

function cleanIngredient(item) {
    var str = item.split(' ');
    var toReturn = '';
    for (let i = 0; i < str.length; i++) {
        if (!contains(str[i])) {
            toReturn += ' ' + str[i];
        }
    }
    return toReturn.trim();
}

// function walmartSearch(term) {

//     //http://api.walmartlabs.com/v1/search?apiKey=q393az5mmru5ah3duz4x9ka2&query=rice
//     let url = "http://api.walmartlabs.com/v1/search";
//     url += '?apiKey=' + keys.walmart.key
//         + '&query=' + term;
//     $.ajax({
//         url: url,
//         method: 'GET',
//         success: function (result) {
//             console.log(result)
//             //appendWalmart(result)
//         }
//     }).fail(function (err) {
//         throw err;
//     });
// }

// $(document).on('click', '#walmartable', function () {
//     //$('#foodlist').hide();
//     console.log($(this).data('val'));
//     walmartSearch($(this).data('val'));
// })

$(document).on('click', '#wantIt', function () {
    $('#foods').hide();
    searchByID($(this).data('val'));
});

$(document).on('click', '#taco', function (e) {
    event.preventDefault();
    searchRecipeByTerms($('#basic').val().trim());
});
