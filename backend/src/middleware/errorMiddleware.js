import chalk from 'chalk';

/**
 * @desc    Handles requests to routes that do not exist (404 Not Found).
 * This middleware is triggered when no other route matches.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the global error handler
};

/**
 * @desc    Global error handler to catch all errors passed via next(error).
 * This must be the last piece of middleware loaded.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code, we want to default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // --- Enterprise-level Logging: Log all server errors for debugging ---
  console.error(chalk.red.bold('--- ERROR ---'));
  console.error(chalk.red(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`));
  console.error(chalk.red(`Message: ${err.message}`));
  if (process.env.NODE_ENV !== 'production') {
    console.error(chalk.red.dim(err.stack));
  }
  console.error(chalk.red.bold('-------------'));


  res.status(statusCode);

  res.json({
    message: err.message,
    // Best Practice: Show stack trace only in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
