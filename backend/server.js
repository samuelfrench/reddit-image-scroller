const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Allow CORS from all origins
app.use(cors());

// Example endpoint to fetch data from Reddit
app.get("/reddit/r/pics.json", async (req, res) => {
    const { after } = req.query;
    try {
        const response = await axios.get(`https://www.reddit.com/r/pics.json?after=${after || ''}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Error fetching images");
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});