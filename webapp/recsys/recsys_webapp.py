from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from recipe_recs import RecipeRecommender
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/recsys', methods=['GET', 'POST'])
@cross_origin()
def recsys_webapp():
    # POST request
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_json())
        return 'OK', 200
    # GET request
    else:
        jongha_key = '8ed35011298e4cd5b31f57c78d4b9055'
        recommender = RecipeRecommender(api_key=jongha_key)
        include_pantry = request.args.get('includePantry')
        if include_pantry == 'true':
            include_pantry = True
        else:
            include_pantry = False
        ingredient_list = request.args.get('ingredients').split(', ')
        recipe_recs = recommender.get_recipes_by_ingredients(ingredient_list, include_pantry, num_recipes=20)
        return jsonify(recipe_recs)  # serialize and use JSON headers

if __name__ == '__main__':
   app.run()