const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const path = require('path');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Set up static files directory
app.use(express.static(path.join(__dirname, 'static')));

// Handle homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Handle recommendation route
app.post('/recommend', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'recommend.html')),

  console.log(req.body)

  const{ pn, ap, dp, rate, rateC, sentiment_analysis } = req.body;

  // Call the Python script using PythonShell
  const options = {
    scriptPath: __dirname , // Update this path to your Python scripts directory
    args: [pn, ap, dp, rate, rateC, sentiment_analysis],
  };

  PythonShell.run('recommend.py', options, (err, results) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const [fdf, barPlotRating, barPlotPrice, barPlotRatingCount] = JSON.parse(results[0]);

      res.render('recommend', {
        fdf,
        barPlotRating,
        barPlotPrice,
        barPlotRatingCount,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
