from flask import Flask, jsonify, request
from flask_cors import CORS
from extractor import search_movies, get_movie_details

app = Flask(__name__)
CORS(app)  # Lampa-nın brauzer/TV tərəfdən sorğu ata bilməsi üçün CORS-u açırıq

@app.route('/api/search', methods=['GET'])
def api_search():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    
    results = search_movies(query)
    return jsonify(results)

@app.route('/api/details', methods=['GET'])
def api_details():
    movie_url = request.args.get('url', '')
    if not movie_url:
        return jsonify({'error': 'URL tələb olunur'}), 400
        
    details = get_movie_details(movie_url)
    if not details:
        return jsonify({'error': 'Film tapılmadı və ya xəta baş verdi'}), 404
        
    return jsonify(details)

if __name__ == '__main__':
    # Serveri yerli şəbəkədə və ya serverdə 5000 portunda işə salırıq
    app.run(host='0.0.0.0', port=5000, debug=False)