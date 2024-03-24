import pandas as pd
from sklearn.tree import DecisionTreeClassifier
recipe_data = pd.read_csv('C:/Users/dogap/Desktop/recipes_with_no_tags_and_cuisine.csv')

recipe_data

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.preprocessing import StandardScaler

#Handle missing data if any
recipe_data = recipe_data.dropna(subset=['ingredients', 'cuisine_path'])
#Convert 'total_time' to string (if it's not already)
recipe_data['total_time'] = recipe_data['total_time'].astype(str)
#Combine relevant features
recipe_data['combined_features'] = recipe_data['total_time'] + ' ' + recipe_data['ingredients'] + ' ' + recipe_data['cuisine_path']
#Use TfidfVectorizer to convert text features to vectors
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(recipe_data['combined_features'])
#Use linear_kernel to calculate similarity
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def get_recommendations(query):
    # Check if the query is a substring of any recipe names
    matching_recipes = recipe_data[recipe_data['recipe_name'].str.contains(query, case=False)]

    if matching_recipes.empty:
        print(f"No recipes found for '{query}'. Try a different search term.")
        return

    # Use the first matching recipe as the selected recipe
    selected_recipe = matching_recipes.iloc[0]['recipe_name']

    # Get the index of the selected recipe
    idx = recipe_data[recipe_data['recipe_name'] == selected_recipe].index[0]

    # Get the pairwise similarity scores
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the recipes based on similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the top 5 similar recipes
    sim_recipes = sim_scores[1:11]

    # Return the recipe names
    return recipe_data['recipe_name'].iloc[[i[0] for i in sim_recipes]]
#Example usage
query = 'sushi'
recommendations = get_recommendations(query)
print(f"Recipes similar to '{query}':")
print(recommendations)