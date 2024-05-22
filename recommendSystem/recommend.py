from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import requests
import json
from recipeRecDTO import RecipeRecommendationObject 


app = Flask(__name__)

sas_token = "sp=racwdyti&st=2024-05-14T12:06:34Z&se=2024-06-04T20:06:34Z&sv=2022-11-02&sr=b&sig=%2FYZk57JEkcpWlOKhm9rl5y2roVMQbwl%2Fa%2FgyPS5uL5A%3D"
blob_url = "https://blobrecipeimages.blob.core.windows.net/data-set-kaggle/recipes_with_no_tags_and_cuisine.csv?" + sas_token
#Blob Service Client oluştur
blob_service_client = BlobServiceClient(account_url="https://blobrecipeimages.blob.core.windows.net", credential=sas_token)

# Container Client oluştur
container_client = blob_service_client.get_container_client("data-set-kaggle")

#blob_url="https://blobrecipeimages.blob.core.windows.net/data-set-kaggle/recipes_with_no_tags_and_cuisine.csv?"


# Load recipe data
recipe_data = pd.read_csv(blob_url)
recipe_data = recipe_data.dropna(subset=['ingredients', 'cuisine_path'])
recipe_data['total_time'] = recipe_data['total_time'].astype(str)
recipe_data['combined_features'] = recipe_data['total_time'] + ' ' + recipe_data['ingredients'] + ' ' + recipe_data['cuisine_path']

# Create TF-IDF matrix
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(recipe_data['combined_features'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
def get_recommendations(title=None, ingredients=None):
    matching_recipes = recipe_data

    if title:
        matching_recipes = matching_recipes[matching_recipes['recipe_name'].str.contains(title, case=False)]

    if ingredients:
        ingredient_query = '|'.join(ingredients)
        matching_recipes = matching_recipes[matching_recipes['ingredients'].str.contains(ingredient_query, case=False)]

    if matching_recipes.empty:
        return []

    combined_features_with_ingredients = matching_recipes['total_time'] + ' ' + matching_recipes['ingredients'] + ' ' + matching_recipes['cuisine_path']
    tfidf_matrix_with_ingredients = tfidf_vectorizer.fit_transform(combined_features_with_ingredients)
    cosine_sim_with_ingredients = linear_kernel(tfidf_matrix_with_ingredients, tfidf_matrix_with_ingredients)
    
    # Calculate similarity scores for matched recipes
    sim_scores = []
    for i in range(len(matching_recipes)):
        sim_scores.append((i, cosine_sim_with_ingredients[i,-1]))  # similarity score for the last recipe
    
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_recipes = sim_scores[:5]  # Take the top 5 similar recipes
    recipe_indices = [i[0] for i in sim_recipes]
    recommended_recipes = [matching_recipes.iloc[idx] for idx in recipe_indices]

    return recommended_recipes




@app.route('/hello', methods=['GET'])
def hello():
    return "hellooooo"


@app.route('/get-recommendations', methods=['GET'])
def recommend():
    title = request.args.get('title')
    ingredients = request.args.get('ingredients')
    
    if not title and not ingredients:
        return jsonify({'error': 'Please provide at least one parameter.'}), 400

    if ingredients and ":" in ingredients:
        ingredients = format_data_ingredients(ingredients)

    recommendations = get_recommendations(title, ingredients)

    if not recommendations:
        return jsonify({'message': 'No recipes found matching the criteria.'}), 404

    # Convert recommendations to RecipeRecommendationObject
    recommendation_objects = [create_recommendation_object(recipe) for recipe in recommendations]

    return jsonify({'recommendations': [vars(obj) for obj in recommendation_objects]})

def format_data_ingredients(ingredients):
    formatted_ingredients = []
    for ingredient in ingredients.split(','):
        parts = ingredient.strip().split(':')
        formatted_ingredient = parts[0].strip() if len(parts) > 1 else parts[0].strip()
        formatted_ingredients.append(formatted_ingredient)
    return formatted_ingredients


def create_recommendation_object(recipe_row):
    return RecipeRecommendationObject (
        title=recipe_row['recipe_name'],
        ingredients=recipe_row['ingredients'],
        description=recipe_row['directions'],  
        cuisine=recipe_row['cuisine_path'],  
        timing=recipe_row['total_time'],
        photoPathURL=recipe_row['img_src']
    )

@app.route('/add-recipe-to-dataset', methods=['POST'])
def add_recipe_to_dataset():

    global recipe_data  # Declare recipe_data as global

    data = request.json

    # Extract data from request body
    recipe_name = data.get('title', '')
    prep_time = format_time(data.get('preparationTime', None))
    cook_time = None  
    total_time = None  
    servings = None  
    yield_value = None  
    ingredients = data.get('ingredients', '')
    directions = data.get('description', '')
    rating = None  
    url = None  
    cuisine_path = data.get('cuisine', '')
    nutrition = None  
    timing = None
    img_src = data.get('photoPathURL', '')

    # Process the data and add it to the dataset
    # You can perform any necessary processing here, such as data validation and formatting
    # Then add the recipe to the dataset
    new_recipe = pd.DataFrame.from_dict({
        'recipe_name': [recipe_name],
        'prep_time': [prep_time],
        'cook_time': [cook_time],
        'total_time': [total_time],
        'servings': [servings],
        'yield': [yield_value],
        'ingredients': [ingredients],
        'directions': [directions],
        'rating': [rating],
        'url': [url],
        'cuisine_path': [cuisine_path],
        'nutrition': [nutrition],
        'timing': [timing],
        'img_src': [img_src]
    })

    recipe_data = pd.concat([recipe_data, new_recipe], ignore_index=True)

    # Dosyayı bloba yükle
    data = recipe_data.to_csv(index=False)
    blob_client = container_client.get_blob_client(blob="recipes_with_no_tags_and_cuisine.csv")
    blob_client.upload_blob(data, overwrite=True)

    print("Veri başarıyla bloba yüklendi.")

    return jsonify({"message": "Recipe added to dataset successfully"})
 
def format_time(minutes):
    if not minutes:
        return ''

    hours, mins = divmod(minutes, 60)

    if hours > 0 and mins > 0:
        return f"{hours} hrs {mins} mins"
    elif hours > 0:
        return f"{hours} hrs"
    else:
        return f"{mins} mins"

if __name__ == '__main__':
    app.run()