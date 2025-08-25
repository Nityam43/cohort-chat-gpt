const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');


/* Routes */
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require("./routes/chat.routes");


const app = express();



/* using middlewares */
app.use(cors({
    origin: ['http://localhost:5173', 'https://cohort-chat-gpt.onrender.com'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));



/* Health check endpoint */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasMongoUri: !!process.env.MONGO_URI,
            port: process.env.PORT || 3000
        }
    });
});

/* Using Routes */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;