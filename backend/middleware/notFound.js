/**
 * 404 Not Found middleware for undefined routes
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFound;
