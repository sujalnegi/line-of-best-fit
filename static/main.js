document.addEventListener('DOMContentLoaded', () => {

    const dataInput = document.getElementById('data-input');
    const calcButton = document.getElementById('calculate-btn');
    const btnText = calcButton.querySelector('.btn-text');
    const resultsDisplay = document.getElementById('results-box');
    const chartPlaceholder = document.getElementById('chart-placeholder');
    const ctx = document.getElementById('regression-chart').getContext('2d');
    
    let regressionChart;

    // Add click event listener to the button
    calcButton.addEventListener('click', async () => {
        const rawData = dataInput.value;

        // --- Set Loading State ---
        calcButton.disabled = true;
        calcButton.classList.add('loading');
        btnText.innerText = 'Calculating...';
        
        // Clear previous results and errors
        resultsDisplay.innerText = '';
        resultsDisplay.className = 'results-box'; // Resets to base class

        try {
            // Call our Flask API
            const response = await fetch('/calculate-regression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: rawData })
            });

            const results = await response.json();

            // Handle errors returned from the server
            if (!response.ok) {
                throw new Error(results.error || 'An error occurred');
            }
            
            const slope = results.slope;
            const intercept = results.intercept;
            const rSquared = results.r_squared;

            const sign = intercept >= 0 ? '+' : '-';
            const interceptAbs = Math.abs(intercept); // Get the absolute value

            resultsDisplay.innerText = `y = ${slope}x ${sign} ${interceptAbs} (R²: ${rSquared})`;
            resultsDisplay.classList.add('success');
        
            updateChart(rawData, results);
        
            chartPlaceholder.style.display = 'none';

        } catch (error) {
            resultsDisplay.innerText = `Error: ${error.message}`;
            resultsDisplay.classList.add('error');
        } finally {
            calcButton.disabled = false;
            calcButton.classList.remove('loading');
            btnText.innerText = 'Calculate';
        }
    });

    /**
     * Parses raw data and updates the Chart.js canvas
     */
    function updateChart(rawData, regressionResults) {
        // Parse the data again, just for the chart
        const points = rawData.trim().split('\n')
            .map(line => {
                const parts = line.split(',');
                if (parts.length === 2) {
                    const x = parseFloat(parts[0]);
                    const y = parseFloat(parts[1]);
                    return { x, y };
        0
    3        }
                return null; 
            })
            .filter(p => p && !isNaN(p.x) && !isNaN(p.y)); // Filter out any invalid lines

        if (points.length === 0) return;

        // Find the min and max x values to draw the regression line
        const xVals = points.map(p => p.x);
        const minX = Math.min(...xVals);
        const maxX = Math.max(...xVals);
        
        const { slope, intercept } = regressionResults;
        const lineData = [
            { x: minX, y: slope * minX + intercept },
            { x: maxX, y: slope * maxX + intercept }
        ];

        if (regressionChart) {
            regressionChart.destroy();
        }

        regressionChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Data Points',
                        data: points,
                        backgroundColor: 'rgba(0, 123, 255, 0.6)'
                    },
                    {
                        label: 'Regression Line',
                        type: 'line',
                        data: lineData,
                        borderColor: 'rgba(220, 53, 69, 0.8)', 
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'X Value' } },
                    y: { title: { display: true, text: 'Y Value' } }
                }
            }
        });
    }
});