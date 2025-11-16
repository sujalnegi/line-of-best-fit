from flask import Flask, jsonify, render_template, request
from scipy import stats

app = Flask(__name__)

# Page Routes

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/graph')
def graph():
    return render_template('graph.html')

@app.route('/implicit')
def implicit():
    return render_template('implicit.html')

@app.route('/about')
def about():
    return render_template('about.html')


# API Endpoints 

@app.route('/calculate-regression', methods=['POST'])
def calculate_regression():
    try:

        if not request.is_json:
            return jsonify({"error": "Invalid request: Content-Type must be application/json"}), 400

        data = request.json.get('data') 
        if data is None:
            return jsonify({"error": "Invalid request: Missing 'data' key in JSON payload"}), 400

        x_vals = []
        y_vals = []

        
        for line in data.strip().split('\n'):
            if not line.strip(): 
                continue
            
            parts = [part.strip() for part in line.split(',')]
            
            if len(parts) == 2:
                x_vals.append(float(parts[0]))
                y_vals.append(float(parts[1]))
            else:
                return jsonify({"error": f"Invalid data format. Use 'x, y' pairs. Failed on line: '{line}'"}), 400

        if len(x_vals) < 2:
            return jsonify({"error": "Not enough data points. At least 2 are required."}), 400

        lin_regress = stats.linregress(x_vals, y_vals)
        
        return jsonify({
            "slope": round(lin_regress.slope, 4),
            "intercept": round(lin_regress.intercept, 4),
            "r_squared": round(lin_regress.rvalue**2, 4)
        })

    except ValueError:
        return jsonify({"error": "Invalid data. Ensure all values are numeric."}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# runner
if __name__ == '__main__':
    app.run(debug=True)
