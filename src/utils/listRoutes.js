const listRoutes = (app) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        routes.push({
          path: handler.route.path,
          methods: Object.keys(handler.route.methods).join(', ').toUpperCase(),
        });
      });
    }
  });

  console.log('Available Endpoints:');
  routes.forEach((route) => {
    console.log(`${route.methods} ${route.path}`);
  });
};

module.exports = listRoutes;
