import express from 'express';
const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Define a route for handling the form submission
app.post('/submit', async (req, res) => {
  try {
    // Your form submission handling code goes here
  } catch (error) {
    console.error('Error handling form submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server on port 8000
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
