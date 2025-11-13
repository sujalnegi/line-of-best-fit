document.addEventListener('DOMContentLoaded', () => {

    // --- Get Elements ---
    const graphDiv = document.getElementById('plotly-graph');
    
    // Mode Toggles
    const modeLinear = document.getElementById('mode-linear');
    const modeComplex = document.getElementById('mode-complex');

    // Input Containers
    const linearInputContainer = document.getElementById('linear-input-container');
    const complexInputContainer = document.getElementById('complex-input-container');
    
    // Inputs
    const mInput = document.getElementById('m-input');
    const cInput = document.getElementById('c-input');
    const functionInput = document.getElementById('function-input');

    //Ranges
    const xMinInput = document.getElementById('x-min-input');
    const xMaxInput = document.getElementById('x-max-input');

    // Buttons
    const drawBtn = document.getElementById('draw-btn');
    const clearGraphBtn = document.getElementById('clear-graph-btn');
    const downloadBtn = document.getElementById('download-btn');

    // --- State ---
    let currentMode = 'linear'; // 'linear' or 'complex'

    let allTraces = [];

    const colors = [
        '#3498db', // Blue
        '#e74c3c', // Red
        '#2ecc71', // Green
        '#9b59b6', // Purple
        '#f1c40f', // Yellow
        '#1abc9c', // Teal
        '#d35400'  // Orange
    ];

    // --- Graphing Layout ---
    const baseLayout = {
        title: 'Function Plot',
        xaxis: { title: 'x', zeroline: true, gridcolor: '#eee' },
        yaxis: { title: 'y / f(x)', zeroline: true, gridcolor: '#eee', autorange: true },
        autosize: true,
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 }
    };

    // --- Event Listeners ---

    // Switch to Linear Mode
    modeLinear.addEventListener('click', () => {
        currentMode = 'linear';
        modeLinear.classList.add('active');
        modeComplex.classList.remove('active');
        linearInputContainer.classList.remove('hidden');
        complexInputContainer.classList.add('hidden');
    });

    downloadBtn.addEventListener('click', () => {
        // Use Plotly's built-in function to download the image
        Plotly.downloadImage(graphDiv, {
            format: 'png',      
            width: 1000,        
            height: 600,       
            filename: 'my-graph' 
        });
    });

    // Switch to Complex Mode
    modeComplex.addEventListener('click', () => {
        currentMode = 'complex';
        modeComplex.classList.add('active');
        modeLinear.classList.remove('active');
        complexInputContainer.classList.remove('hidden');
        linearInputContainer.classList.add('hidden');
    });

    // Main Plot Button
    drawBtn.addEventListener('click', plotGraph);

    // Clear Button now calls initGraph
    clearGraphBtn.addEventListener('click', initGraph);


    // --- Functions ---

    function plotGraph() {
        let newTrace = null;
        const range = getPlotRange(); // Get user-defined range

        if (currentMode === 'linear') {
            newTrace = createLinearTrace(range);
        } else {
            newTrace = createComplexTrace(range);
        }

        if (newTrace) {
            newTrace.line.color = colors[allTraces.length % colors.length];
            allTraces.push(newTrace);
            
            const newLayout = JSON.parse(JSON.stringify(baseLayout)); // Deep copy
            newLayout.xaxis.range = [range.min, range.max];
            
            Plotly.newPlot(graphDiv, allTraces, newLayout);
        }
    }
    function getPlotRange() {
        let min = parseFloat(xMinInput.value);
        let max = parseFloat(xMaxInput.value);

        if (isNaN(min)) {
            min = -20;
        }
        if (isNaN(max)) {
            max = 20;
        }

        if (min >= max) {
            alert("X-Min must be less than X-Max. Using defaults.");
            min = -20;
            max = 20;
        }
        
        return { min: min, max: max };
    }
    
    function createLinearTrace(range) { // <-- Receives range
        const m = parseFloat(mInput.value);
        const c = parseFloat(cInput.value);

        if (isNaN(m) || isNaN(c)) {
            alert("Please enter valid numbers for 'm' and 'c'.");
            return null;
        }

        let x_values = [];
        let y_values = [];
        const numPoints = 200;
        const step = (range.max - range.min) / numPoints; // Use range

        for (let i = 0; i <= numPoints; i++) {
            let x = range.min + (step * i); // Use range.min
            x_values.push(x);
            y_values.push(m * x + c);
        }

        return {
            x: x_values,
            y: y_values,
            type: 'scatter',
            mode: 'lines',
            name: `y = ${m}x + ${c}`,
            line: { width: 3 }
        };
    }

    function createComplexTrace(range) { // <-- Receives range
        const expression = functionInput.value;
        if (!expression) {
            alert("Please enter a function.");
            return null;
        }

        try {
            const compiledExpr = math.compile(expression);

            let x_values = [];
            const numPoints = 400; // Use more points for smooth functions
            const step = (range.max - range.min) / numPoints; // Use range

            for (let i = 0; i <= numPoints; i++) {
                let x = range.min + (step * i); // Use range.min
                x_values.push(math.round(x, 6)); // Round to avoid float issues
            }

            const y_values = x_values.map(x => {
                return compiledExpr.evaluate({ x: x });
            });

            return {
                x: x_values,
                y: y_values,
                type: 'scatter',
                mode: 'lines',
                name: `f(x) = ${expression}`,
                line: { width: 3 }
            };

        } catch (err) {
            alert("Error: Could not parse or evaluate the function.\n\n" + err.message);
            return null;
        }
    }

    function initGraph() {
        allTraces = []; 
        Plotly.newPlot(graphDiv, allTraces, baseLayout); 
    }

    initGraph();
    modeLinear.addEventListener('click', () => {
        currentMode = 'linear';
        modeLinear.classList.add('active');
        modeComplex.classList.remove('active');
        linearInputContainer.classList.remove('hidden');
        complexInputContainer.classList.add('hidden');
    });

    modeComplex.addEventListener('click', () => {
        currentMode = 'complex';
        modeComplex.classList.add('active');
        modeLinear.classList.remove('active');
        complexInputContainer.classList.remove('hidden');
        linearInputContainer.classList.add('hidden');
    });

    modeLinear.click();
});