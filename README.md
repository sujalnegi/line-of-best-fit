# line-of-best-fit
<div align="center">
  <img src="https://i.ibb.co/x85V0Rk2/Untitled-design-1-fotor-20251117191025.png" alt="Logo" width="200"/>
   


**A online tool that helps students to make complex graph by just entering an equation & find the line of best fit**

</div>

---

## About

line-of-best-fit is utility tool for mathematicians and physicist which helps students to Plot points in a graph and automatically plots the line of best fit. Furthermore it helps to draw graphs using multiple formats of equations.

Try it here: **[Link](https://lineofbestfit.pythonanywhere.com/)** 

---


## Demo 

A full demo of all the functions is  **[here](https://drive.google.com/file/d/1LZCNNzGY_keZSoDigF8I25stGche1bNl/view?usp=drive_link)**

---

## Features

- Plots points on graph and additionally draws the line of best fit.
- Draws graphs for equations in following formats:
    - Linear Equation: y = mx + c
    - Complex Function Equation: f(x)
    - Implicit Equation: f(x, y) =  0
- User Friendly Interface: 
    - Plotly graphs make it more accessible for feature like: zooming, paning, scalling and more
- Savable graphs: User can download the graph as a (.png) file

---


## Project Structure

```
line-of-best-fit/
├── devlogs/             # Screenshots of all simulations and the landing page 
├── static/              # Contains the css & js files also assests
├── templates/           # HTML templates for all pages
├── .gitignore           # Git ignore file
├── app.py               # Main Flask application with all routes
├── LICENSE              # MIT License
├── README.md            # You are reading this lol
└── requirements.txt     # Python dependencies (only Flask)
```

---

## Installation Steps

### Prerequisites
- **Python 3.13+** (I used 3.13.5 but anything 3.13+ should work fine)
- **pip** for installing packages
- **flask** 2.0 or greator
- **Any modern browser** (Chrome, Firefox, Edge the simulations use Canvas API)

---


### Installation Steps

1. **Clone the repo:**
   ```bash
   git clone https://github.com/sujalnegi/line-of-best-fit.git
   cd line-of-best-fit
   ```

2. **Create a virtual environment (recommended):**
   
   Makes a seprate environment for the repo
   
   **Windows:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
   
   **macOS / Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   


4. **Run the app:**
   ```bash
   python app.py
   ```

5. **Open it up:**
   
   Go to `http://127.0.0.1:5000` in your browser

---

## Usage

1. The home page has the plotting and best fit line function.
2. Then the user can navigate through navigation bar.
3. The graphs of function and linear equation can be made by the "Graphs" feature
4. The graphs of [f(x, y) = 0] can be made with the "Complex Graphs" feature
5. There is a download button for graphs through which user can download the current graph

---

## Acknowledgement

CSS falling star background

Source: [LINK](https://www.youtube.com/watch?v=aywzn9cf-_U&t=162s)

---

## Author

Email: [sujal1negi@gmail.com](mailto:sujal1negi@gmail.com)

Instagram: [@_sujalnegi _ ](https://instagram.com/_sujalnegi_)

Made by **Sujal Negi** 
