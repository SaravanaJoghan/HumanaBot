from flask import Flask, request, jsonify
import os
import torch
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from flask_cors import CORS  # Import CORS from flask_cors

# Load or create an initial DataFrame
try:
    data = pd.read_csv('correctedQA.csv')
except FileNotFoundError:
    data = pd.DataFrame(columns=['Human', 'Assistant'])

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()

def get_answer(user_query, data):
    # Compare similarity to each question in the dataset
    tfidf_matrix = tfidf_vectorizer.fit_transform(data['Human'])
    user_query_vector = tfidf_vectorizer.transform([user_query])
    
    similarity_scores = cosine_similarity(user_query_vector, tfidf_matrix)

    # Find the most similar question
    most_similar_idx = similarity_scores.argmax()
    answer = data['Assistant'][most_similar_idx]

    return answer

def generate_response(user_question, max_length=30):
    input_ids = tokenizer.encode(user_question, return_tensors="pt").to(device)
    attention_mask = torch.ones(input_ids.shape, device=device)
    output = model.generate(input_ids, max_length=max_length, no_repeat_ngram_size=2, attention_mask=attention_mask)
    generated_response = tokenizer.decode(output[0], skip_special_tokens=True)
    return generated_response

# Your existing code for loading the GPT-2 model and tokenizer
model_dir = "./models/gpt2_small"
model = GPT2LMHeadModel.from_pretrained(model_dir)
tokenizer = GPT2Tokenizer.from_pretrained(model_dir)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

app = Flask(__name__)
# Configure CORS to allow requests from any origin
CORS(app)

@app.route('/get_gpt2_response', methods=['POST'])
def get_gpt2_response():
    user_input = request.json.get('user_input')
    response = generate_response(user_input, max_length=150)  # Use your existing GPT-2 response generation function
    return jsonify({'bot_response': response})

@app.route('/get_cosine_similarity_response', methods=['POST'])
def get_cosine_similarity_response():
    user_input = request.json.get('user_input')
    bot_answer = get_answer(user_input, data)
    return jsonify({'bot_response': bot_answer})

if __name__ == '__main__':
    app.run(debug=True)
