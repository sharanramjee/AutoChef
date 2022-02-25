from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from recipe_recs import RecipeRecommender
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

api_key = '51a955828emsh3295292ccbfe406p11aa4cjsn352261ae1b36'

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
        recommender = RecipeRecommender(api_key=api_key)
        include_pantry = request.args.get('includePantry')
        if include_pantry == 'true':
            include_pantry = True
        else:
            include_pantry = False
        ingredient_list = request.args.get('ingredients').split(', ')
        recipe_recs = recommender.get_recipes_by_ingredients(20, ingredient_list, include_pantry)
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
        recommender = RecipeRecommender(api_key=api_key)
        breakdown = request.args.get('breakdown')
        if breakdown == 'true':
            breakdown = True
        else:
            breakdown = False
        recipe_id = request.args.get('recipe_id')
        insts = recommender.get_recipe_insts([recipe_id], breakdown)
        print('BOI:', insts)
        return jsonify(insts)  # serialize and use JSON headers


if __name__ == '__main__':
   app.run()