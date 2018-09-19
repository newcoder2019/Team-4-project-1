var list = ['oz', 'pound', '(', ')', '/', 'cup', 'ounce', 'lb', 'can', 'tsp', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'tbs', 'tablespoon', 'large', 'medium', 'small', 'crush', 'clove', 'quarter', 'qtr', '½', '⅓', '¼', 'chopped', 'tablespoons', 'teaspoon', 'spoon', 'mince'] 


function contains(word){
    for (let i = 0; i < list.length; i++){
        if(word.toLowerCase().includes(list[i])){
            return true;
        }
    }
    if(word.toLowerCase() == 'g'){
        return true;
    }
    return false;
}

//special case 'g'