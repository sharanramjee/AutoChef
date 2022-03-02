from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from recipe_recs import RecipeRecommender
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# api_key = '51a955828emsh3295292ccbfe406p11aa4cjsn352261ae1b36'

@app.route('/recsys', methods=['GET', 'POST'])
@cross_origin()
def recsys():
    # POST request
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_json())
        return 'OK', 200
    # GET request
    else:
        recommender = RecipeRecommender()
        # Include pantry
        include_pantry = request.args.get('includePantry')
        if include_pantry == 'true':
            include_pantry = True
        else:
            include_pantry = False
        # Ingredient list
        ingredient_list = request.args.get('ingredients').split(', ')
        # Cuisine list
        cuisine_list = request.args.get('cuisines')
        if len(cuisine_list) == 0:
            cuisine_list = list()
        else:
            cuisine_list = cuisine_list.split(', ')
        # Diet
        diet = request.args.get('diet')
        if len(diet) == 0:
            diet = 'any'
        # Intolerance list
        intolerance_list = request.args.get('intolerances')
        if len(intolerance_list) == 0:
            intolerance_list = list()
        else:
            intolerance_list = intolerance_list.split(', ')
        # Meal type
        meal_type = request.args.get('meal_type')
        if len(meal_type) == 0:
            meal_type = 'any'
        recipe_recs = recommender.get_recipes_by_ingredients(20, ingredient_list, include_pantry,
            cuisine_list, diet, intolerance_list, meal_type)
        return jsonify(recipe_recs)  # serialize and use JSON headers


@app.route('/insts', methods=['GET', 'POST'])
@cross_origin()
def insts():
    # POST request
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_json())
        return 'OK', 200
    # GET request
    else:
        recommender = RecipeRecommender()
        breakdown = request.args.get('breakdown')
        if breakdown == 'true':
            breakdown = True
        else:
            breakdown = False
        recipe_id = request.args.get('recipe_id')
        insts = recommender.get_recipe_insts([recipe_id], breakdown)
        return jsonify(insts)  # serialize and use JSON headers


if __name__ == '__main__':
   app.run()