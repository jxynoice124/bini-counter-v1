const express = require('express');
const app = express();
const port = 8080;

/* middleware shits */
const errorHandler = require('./handlers/errorHandler.js')

app.use(express.json())
app.use(errorHandler)

app.get('/', (req, res) => {  
res.sendFile(path.join(__dirname, 'index.html')); 
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
