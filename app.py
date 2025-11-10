from flask import Flask, request, jsonify, render_template
from scipy import stats
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate-regression', methods=['POST'])
def calculate_regression():
    """Calculates linear regression from posted data."""
    try:
        data = request.json['data']
        
        x_vals = []
        y_vals = []

        # String formating
        for line in data.strip().split('\n'):
            if not line.strip():
                continue
                
            parts = line.split(',')
            
            if len(parts) == 2:
                x_vals.append(float(parts[0].strip()))
                y_vals.append(float(parts[1].strip()))
            else:
                # Handle lines with incorrect format
                return jsonify({"error": "Invalid data format. Use 'x, y' pairs."}), 400

        if not x_vals or len(x_vals) < 2:
            return jsonify({"error": "Not enough data points. At least 2 are required."}), 400

        lin_regress = stats.linregress(x_vals, y_vals)
        
        # Send the result back as JSON
        return jsonify({
            "slope": round(lin_regress.slope, 4),
            "intercept": round(lin_regress.intercept, 4),
            "r_squared": round(lin_regress.rvalue**2, 4)
        })

    except ValueError:
        return jsonify({"error": "Invalid data. Ensure all values are numeric."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/graph')
def graph():
    return render_template('graph.html')

@app.route('/implicit')
def implicit():
    return render_template('implicit.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
