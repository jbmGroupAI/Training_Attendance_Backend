const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const trainingRoute = require('./trainingSession.route')
const trainingTopicRoute = require('./trainingTopic.route')
const config = require('../../config/config');
const employeeRoute = require('./employee.route')
const adminRoute=require('./admin.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/training',
    route: trainingRoute
  },
  {
    path: '/employee',
    route: employeeRoute
  },
  {
    path: '/topics',
    route: trainingTopicRoute
  },
  {
    path: '/',
    route: adminRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
