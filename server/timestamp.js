
const express = require('express');
const app = express();
let currentMaxTimestamp = 0;

app.get('/get-timestamp', (req, res) => {
    currentMaxTimestamp += 1;
    res.json({ timestamp: currentMaxTimestamp });
});

app.listen(7000, () => {
    console.log('Timestamp service running on port 7000');
}); ``
