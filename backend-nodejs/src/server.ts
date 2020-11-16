import errorHandler from 'errorhandler';
import app from './app';
// const port = app.get('port');

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), app.get('host'), () =>
  console.log('info',
    'App is running at http://%s:%d',
    app.get('host'),
    app.get('port')
  )
);

export default server;
