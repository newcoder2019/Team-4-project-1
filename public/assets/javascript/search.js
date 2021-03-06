let recipeStore = [];
let tempFavs = [];

function searchRecipeByTerms(foodTerm, type) {
    let url = "https://api.yummly.com/v1/api/recipes";
    url += '?_app_id=' + keys.yummly.appId
        + '&_app_key=' + keys.yummly.key
        + '&q=' + foodTerm;
    $.ajax({
        url: url,
        method: 'GET',
        success: function (result) {
            appendResult(result.matches, type)
        }
    }).fail(function (err) {
        throw err;
    });
}

function ingredientInfo(ingredientClicked) {
    let url = 'https://api.edamam.com/api/food-database/parser?ingr=';

    url += ingredientClicked +
        '&app_id=' + keys.foodDb.appId
        + '&app_key=' + keys.foodDb.key

    $.ajax({
        url: url,
        method: 'GET',
        success: function (result) {
            let info = (result.parsed[0].food.nutrients != null) ? result.parsed[0].food.nutrients : null;
            appendInfo(info, ingredientClicked);
        }
    }).fail(function (err) {
        throw err;
    })
}

function appendInfo(result, id, currDiv) {
    (result != null) ? Object.keys(result).forEach(e => $('.append').append(`<p style='color:black'>${e} ${result[e]}</p>`)) : $('.append').append(`<p>No info available</p>`);
    $('.append').attr('class', 'list-group-item');
}

function secondsToMinutes(seconds) {
    return parseInt(seconds) / 60;
}

function appendResult(food, type) {
    $('#foods').html('');
    $('#foodlist').html('');

    if (type == 1) {

        if (food.length == 0) {
            $('#foods').html('No results found');
        }

        for (var i = 0; i < food.length; i++) {

            let image = ((food[i].smallImageUrls != null) ? food[i].smallImageUrls[0] : 'assets/images/imageNotFound.png');
            $('#foods').append(`
            <div class="card col-xs-18 col-sm-6 col-md-3" style="width: 18rem;">
                <img class="card-img-top" src=${image} alt="assets/images/imageNotFound.png">
                <div class="card-body">
                    <h5 class="card-title"><ul>${food[i].recipeName}</ul></h5>
                    <p class="card-text">
                        <ul>Prepared in ${secondsToMinutes(food[i].totalTimeInSeconds)} minutes</ul>
                        </p>
                        <ul><a href="#" class="btn btn-primary" id='wantIt' data-val=${food[i].id}>Click for more</a></ul>
                        </div>
                        </div>
                        <br>
                        `);
        }
    } else {

        let random = food[Math.floor(Math.random() * food.length)]

        let image = ((random.smallImageUrls != null) ? random.smallImageUrls[0] : 'assets/images/imageNotFound.png');
        $('#foods').append(`
            
            <div class="card col-xs-18 col-sm-6 col-md-3" style="width: 18rem;">
                <img class="card-img-top" src=${image} alt="assets/images/imageNotFound.png">
                <div class="card-body">
                    <h5 class="card-title"><ul>${random.recipeName}</ul></h5>
                    <p class="card-text">
                        <ul>Prepared in ${secondsToMinutes(random.totalTimeInSeconds)} minutes</ul>
                        </p>
                        <ul><a href="#" class="btn btn-primary" id='wantIt' data-val=${random.id}>Click for more</a></ul>
                </div>
            </div>
               
                        `);
    }
}

function searchByID(yummlyId) {
    let url = "https://api.yummly.com/v1/api/recipe/";
    url += yummlyId
        + '?_app_id=' + keys.yummly.appId
        + '&_app_key=' + keys.yummly.key
    $.ajax({
        url: url,
        method: 'GET',
        success: function (result) {
            displayRecipe(result);
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

    recipeStore.push(recipeObj);

    $('#foodlist').append(`
    <div class="card col-xs-18 col-sm-6 col-md-3" style="width: 18rem;">
        <img class="card-img-top" src=${recipeObj.imgLink} alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${recipeObj.name}</h5>
            <p class="card-text">
                <ul>Servings: ${recipeObj.servingSize}</ul>
                <ul>Calories: ${caloriesObjectless(recipeObj)}</ul>
                <ul>Time to Prepare: ${recipeObj.prepTime}</ul>
                </p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>Ingredients</b></li>
            ${showIngredients(recipeObj.ingredients)}
        </ul>
        <div class="card-body">
            <a href=${recipeObj.URL} target="_blank" class="card-link">Click here for recipe</a>
            
            <div class="btn btn-outline-light" id='favorite' data-val="${recipeObj.id}" style="display: ${favShow}"><i class="fas fa-heart"></i> Favorites</div>
        </div>
    </div>
    `);
}
//<button type="button" id='favorite' data-val="${recipeObj.id}" style="display: ${favShow}">Favorite</button><div 

function recipe(name, prepTime, ingredients, id, servingSize, imgLink, URL, calories) {
    this.name = name;
    this.prepTime = prepTime;
    this.ingredients = ingredients; //array
    this.id = id;
    this.servingSize = servingSize;
    this.imgLink = imgLink;
    this.URL = URL;
    this.calories = calories; //object
}

function showIngredients(ingredients) {
    //${showIngredients(food[i].ingredients)}
    let toReturn = '';
    for (let i = 0; i < ingredients.length; i++) {
        let noMeasurements = cleanIngredient(ingredients[i]);
        toReturn += `<li class="list-group-item" id="moreInfo" data-val="${noMeasurements}">${ingredients[i]}
                </li>`
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

$(document).on('click', '#moreInfo', function () {
    $(this).removeAttr('moreInfo');
    $(this).attr('id', 'lessInfo');
    $(this).addClass('append');
    ingredientInfo($(this).data('val'));
});

$(document).on('click', '#lessInfo', function () {
    $(this).removeAttr('lessInfo');
    $(this).attr('id', 'moreInfo');
    $(this).children().html('');
    $(this).children().remove('.info');
});

$(document).on('click', '#wantIt', function () {
    $('#foods').hide();
    $('#foodlist').show();
    searchByID($(this).data('val'));
});

$(document).on('click', '#taco', function (e) {
    event.preventDefault();
    $('#foods').show();
    $('#foodlist').hide();
    let temp = $('#food').val().trim();
    $('#food').val('');
    searchRecipeByTerms(temp, 1);
});

$(document).on('click', '#random', function (e) {
    $('#foods').show();
    $('#foodlist').hide();
    searchRecipeByTerms(randomFoods(), 2);
});

function caloriesObjectless(obj) {
    return ((obj.calories != null) ? (String(obj.calories.value) + ' ' + String(obj.calories.unit.pluralAbbreviation)) : 'Not Available');
}


$(document).on('click', '#showFav', function () {
    $('#foods').show();
    $('#foodlist').show();
    $('#foods').html('');
    $('#foodlist').html('');
    let temp = userProfile.favoirts;

    for (let i = 1; i < temp.length; i++) {
        $('#foods').append(`
            <div class="card col-xs-18 col-sm-6 col-md-3" style="width: 18rem;">
                <img class="card-img-top" src=${temp[i].imgLink} alt="assets/images/imageNotFound.png">
                <div class="card-body">
                    <h5 class="card-title"><ul>${temp[i].name}</ul></h5>
                    <p class="card-text">
                        <ul>Prepared in ${temp[i].prepTime} minutes</ul>
                        </p>
                        <ul><a href="#" class="btn btn-primary" id='wantIt' data-val=${temp[i].id}>Click for more</a></ul>
                </div>
            </div>
               
            `);
    }

});

function isDupe(array, val) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == val.id) {
            return true;
        }
    }
    return false;
}

$(document).on('click', '#favorite', function () {
    let id = $(this).data('val');

    for (let i = 0; i < recipeStore.length; i++) {
        if (id == recipeStore[i].id) {
            if (!isDupe(userProfile.favoirts, recipeStore[i])) {
                userProfile.favoirts.push(recipeStore[i]);
                pushProfile();
            }
        }
    }
});

function pushProfile() {
    database.ref('/users/' + getUid()).set(userProfile);
};

$(document).ready(function () {
    
});
