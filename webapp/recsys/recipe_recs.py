import requests

class RecipeRecommender():
    
    def __init__(self, api_key):
        self.api_key = api_key

    def get_recipes_call(self, ingredients, use_pantry, num_calls, num_results_per_call):
        params = {
            'apiKey': self.api_key,
            'includeIngredients': ",".join(ingredients), 'ignorePantry': use_pantry,
            'number': num_results_per_call,
            'type': 'main course', 'fillIngredients': True, 'addRecipeInformation': True,
            'sort': 'min-missing-ingredients', 'sortDirection': 'asc',
            'offset': num_calls * num_results_per_call
        }
        response = requests.get(url="https://api.spoonacular.com/recipes/complexSearch", params=params)
        response_json = response.json()
        # print(response.request.url)        

        return response_json


    def get_relevant_info(self, recipe):
        relevant_params = [
            'missedIngredientCount', 'usedIngredientCount', 'missedIngredients', 
            'usedIngredients', 'title', 'image', 'summary',
            'spoonacularScore', 'healthScore', 'aggregateLikes', 'veryPopular',
        ]
        relevant_info = {param: recipe[param] for param in relevant_params}

        # Get missing and used ingredient names
        relevant_info['missedIngredient_names'] = [missed['name'] for missed in relevant_info['missedIngredients']]
        relevant_info['usedIngredient_names'] = [used['name'] for used in relevant_info['usedIngredients']]

        # TEMP: Remove missedIngredients and usedIngredients for now to avoid clutter
        relevant_info.pop('missedIngredients', None)
        relevant_info.pop('usedIngredients', None)

        return relevant_info


    def get_recipes_by_ingredients(self, ingredients, use_pantry, num_recipes):

        # Manually only filtering top recipes through a loop
        relevant_recipes = []
        num_calls = 0
        num_results_per_call = 10

        # num_calls < 3 to avoid too much calls to spoonacular
        while num_calls < 3 and len(relevant_recipes) < num_recipes:
            response_json = self.get_recipes_call(ingredients, use_pantry, num_calls, num_results_per_call)

            # Only add result if spoonacularscore >= 75:
            # TEMP: Can be changed
            for recipe in response_json['results']:                
                if recipe['spoonacularScore'] >= 75:
                    relevant_info = self.get_relevant_info(recipe)
                    relevant_recipes.append(relevant_info)
            
            # To offset results from the same call
            num_calls += 1

        # Sort by missedIngredientCount, then spoonacularScore
        sorted_recipes = sorted(relevant_recipes, key=lambda d: (d['missedIngredientCount'], -d['usedIngredientCount'], -d['spoonacularScore'], -d['aggregateLikes'])) 

        return sorted_recipes

def main():
    jongha_key = '8ed35011298e4cd5b31f57c78d4b9055'
    recommender = RecipeRecommender(api_key=jongha_key)
    ingredients = ['tomato', 'cheese']
    num_recipes = 5
    use_pantry = False

    recipe_recs = recommender.get_recipes_by_ingredients(ingredients, use_pantry, num_recipes=num_recipes)
    print(recipe_recs)

if __name__ == "__main__":
    main()