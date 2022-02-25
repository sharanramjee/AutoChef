import requests
import json
class RecipeRecommender:
    def __init__(self, api_key):
        self.api_key = api_key

    def get_recipes_call(
        self, ingredients, use_pantry, cuisine, diet, intolerance, dish_type, 
        num_calls, num_results_per_call
    ):
        base_api_args = {
            'includeIngredients': ",".join(ingredients), 'ignorePantry': not use_pantry,
            'cuisine': ','.join(cuisine), 'diet': diet, 
            'intolerances': ",".join(intolerance),
            'type': dish_type
        }
        if diet == 'any':
            base_api_args.pop('diet')
        if dish_type == 'any':
            base_api_args.pop('type')
        if not cuisine:
            base_api_args.pop('cuisine')
        if not intolerance:
            base_api_args.pop('intolerances')

        params = {
            'apiKey': self.api_key,
            'fillIngredients': True, 'addRecipeInformation': True,
            'sort': 'min-missing-ingredients', 'sortDirection': 'asc',
            'instructionsRequired': True,
            'number': num_results_per_call,
            'offset': num_calls * num_results_per_call
        }
        params.update(base_api_args)
        response = requests.get(url="https://api.spoonacular.com/recipes/complexSearch", params=params)
        response_json = response.json()
        
        return response_json


    def get_relevant_info(self, recipe):
        relevant_params = [
            'missedIngredientCount', 'usedIngredientCount', 'missedIngredients', 
            'usedIngredients', 'title', 'image', 'summary', 'id',
            'spoonacularScore', 'healthScore', 'aggregateLikes', 'veryPopular',
        ]
        relevant_info = {param: recipe[param] for param in relevant_params}
        # Rename id as spoonacularId
        relevant_info['spoonacularId'] = relevant_info['id']
        del relevant_info['id']

        # Get missing and used ingredient names
        relevant_info['missedIngredient_names'] = [missed['name'] for missed in relevant_info['missedIngredients']]
        relevant_info['usedIngredient_names'] = [used['name'] for used in relevant_info['usedIngredients']]

        # TEMP: Remove missedIngredients and usedIngredients for now to avoid clutter
        relevant_info.pop('missedIngredients', None)
        relevant_info.pop('usedIngredients', None)

        return relevant_info


    def get_recipes_by_ingredients(
        self, num_recipes, ingredients, use_pantry=False,  
        cuisine=[], diet='any', intolerance=[], dish_type='any' 
    ):
        # Manually only filtering top recipes through a loop
        relevant_recipes = []
        num_calls = 0
        num_results_per_call = 20


        # num_calls < 3 to avoid too much calls to spoonacular
        while num_calls < 3 and len(relevant_recipes) < num_recipes:
        # while num_calls < 3:
            response_json = self.get_recipes_call(
                ingredients, use_pantry, cuisine, diet, intolerance, dish_type,
                num_calls, num_results_per_call
            )

            # Only add result if spoonacularscore >= 75:
            # TEMP: Can be changed
            for recipe in response_json['results']: 
                relevant_info = self.get_relevant_info(recipe)
                relevant_recipes.append(relevant_info)               
                # if recipe['spoonacularScore'] >= 75:
                #     relevant_info = self.get_relevant_info(recipe)
                #     relevant_recipes.append(relevant_info)
            
            # To offset results from the same call
            num_calls += 1
            print("Number of relevant recipes total:", len(relevant_recipes))
        # Sort by missedIngredientCount, then spoonacularScore
        sorted_recipes = sorted(relevant_recipes, key=lambda d: (d['missedIngredientCount'], -d['usedIngredientCount'], -d['spoonacularScore'], -d['aggregateLikes'])) 

        return sorted_recipes[:num_recipes]

    def get_recipe_insts(self, spoon_ids, stepBreakdown):
        recipe_insts = []
        for id in spoon_ids:
            params = {'apiKey': self.api_key, 'stepBreakdown': stepBreakdown}
            response = requests.get(
                url="https://api.spoonacular.com/recipes/" + str(id) + "/analyzedInstructions",
                params=params
            )
            response_json = response.json()
            recipe_insts.append({'spoon_id': id, 'instructions': response_json})
        return recipe_insts



def main():
    jongha_key = '8ed35011298e4cd5b31f57c78d4b9055'
    api_key = '51a955828emsh3295292ccbfe406p11aa4cjsn352261ae1b36'
    recommender = RecipeRecommender(api_key=jongha_key)
    ingredients = ['tomato', 'cheese']
    num_recipes = 10
    use_pantry = False
    # cuisine = ["French", "German"]
    cuisine=[]; diet='any'; dish_type='any'
    # diet = 'vegetarian'
    # dish_type = 'appetizer'
    intolerance = ['Seafood']

    recipe_recs = recommender.get_recipes_by_ingredients(
        num_recipes, ingredients, use_pantry, cuisine, diet, intolerance, dish_type)
    with open('webapp/recsys/sample_recipe_output.json', 'w') as f:
        json.dump(recipe_recs, f, indent=4)
    
    all_ids = [rec['spoonacularId'] for rec in recipe_recs]
    recipe_insts = recommender.get_recipe_insts(all_ids, False)
    with open('webapp/recsys/sample_recipe_insts_output.json', 'w') as f:
        json.dump(recipe_insts, f, indent=4)
if __name__ == "__main__":
    main()