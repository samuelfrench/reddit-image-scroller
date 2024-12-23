const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

// Allow CORS from all origins
app.use(cors());

async function getRedditAccessToken() {
    const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
    try {
        const response = await axios.post('https://www.reddit.com/api/v1/access_token', 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error obtaining access token:", error);
        throw new Error("Error obtaining access token");
    }
}

// Example endpoint to fetch data from Reddit
app.get("/reddit/r/pics.json", async (req, res) => {
    const { after } = req.query;
    try {
        const accessToken = await getRedditAccessToken();
        const response = await axios.get(`https://oauth.reddit.com/r/pics.json?after=${after || ''}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'image-scroller/1.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Error fetching images");
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});