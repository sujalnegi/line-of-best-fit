document.addEventListener('DOMContentLoaded', () => {

    const graphDiv = document.getElementById('plotly-implicit-graph');
    const plotBtn = document.getElementById('plot-implicit-btn');
    const expressionInput = document.getElementById('implicit-input');
    const downloadBtn = document.getElementById('download-btn');

    const layout = {
        title: 'Implicit Plot',
        xaxis: {
            title: 'x',
            gridcolor: '#eee'
        },
        yaxis: {
            title: 'y',
            gridcolor: '#eee',
            scaleanchor: 'x',
            scaleratio: 1
        },
        autosize: true
    };
    downloadBtn.addEventListener('click', () => {
        // Use Plotly's built-in function to download the image
        Plotly.downloadImage(graphDiv, {
            format: 'png',
            width: 1000,
            height: 600,
            filename: 'my-graph'
        });
    });

    function plotImplicit() {
        const expression = expressionInput.value;
        if (!expression) {
            alert("Please enter an equation");
            return;
        }

        let compiledExpr;
        try {
            compiledExpr = math.compile(expression);
        } catch (err) {
            alert("Error: Could not parse the function.\n\n" + err.message);
            return;
        }

        const resolution = 100;
        const x_range = [-10, 10];
        const y_range = [-10, 10];

        let x_values = [];
        let y_values = [];
        let z_values = [];

        const x_step = (x_range[1] - x_range[0]) / resolution;
        const y_step = (y_range[1] - y_range[0]) / resolution;

        for (let i = 0; i <= resolution; i++) {
            x_values.push(x_range[0] + i * x_step);
            y_values.push(y_range[0] + i * y_step);
        }

        for (let y of y_values) {
            let z_row = [];
            for (let x of x_values) {
                try {
                    let z = compiledExpr.evaluate({ x: x, y: y });
                    if (!isFinite(z)) { z = null; }
                    z_row.push(z);
                } catch (err) {
                    z_row.push(null);
                }
            }
            z_values.push(z_row);
        }

        const trace = {
            x: x_values,
            y: y_values,
            z: z_values,
            type: 'contour',

            contours: {
                coloring: 'none',
                start: 0,
                end: 0,
                size: 0
            },
            line: {
                color: '#3498db',
                width: 3
            }
        };

        Plotly.newPlot(graphDiv, [trace], layout);
    }

    plotBtn.addEventListener('click', plotImplicit);

    plotImplicit();
});