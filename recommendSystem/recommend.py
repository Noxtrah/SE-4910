from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

# Load recipe data
recipe_data = pd.read_csv('https://blobrecipeimages.blob.core.windows.net/data-set-kaggle/recipes_with_no_tags_and_cuisine.csv')
recipe_data = recipe_data.dropna(subset=['ingredients', 'cuisine_path'])
recipe_data['total_time'] = recipe_data['total_time'].astype(str)
recipe_data['combined_features'] = recipe_data['total_time'] + ' ' + recipe_data['ingredients'] + ' ' + recipe_data['cuisine_path']

# Create TF-IDF matrix
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(recipe_data['combined_features'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def get_recommendations(query):
    matching_recipes = recipe_data[recipe_data['recipe_name'].str.contains(query, case=False)]
    if matching_recipes.empty:
        return []
    selected_recipe = matching_recipes.iloc[0]['recipe_name']
    idx = recipe_data[recipe_data['recipe_name'] == selected_recipe].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_recipes = sim_scores[1:11]
    return recipe_data['recipe_name'].iloc[[i[0] for i in sim_recipes]].tolist()

@app.route('/recommend', methods=['GET'])
def recommend():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "No query parameter provided"}), 400
    recommendations = get_recommendations(query)
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True)
