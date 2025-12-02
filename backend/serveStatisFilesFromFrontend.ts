// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '../../frontend/dist');
    const indexPath = path.resolve(
        __dirname,
        '../../frontend',
        'dist',
        'index.html'
    );

    console.log('Static files path:', staticPath);
    console.log('Index.html path:', indexPath);
    console.log('Current __dirname:', __dirname);

    app.use(express.static(staticPath));

    // Catch all handler: send back React's index.html file for SPA routing
    app.use((req, res) => {
        res.sendFile(indexPath);
    });
} else {
    // In development, provide a simple root route
    app.get('/', (req, res) => {
        res.json({ message: 'API is running in development mode' });
    });
}