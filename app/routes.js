var express = require('express');
var moment = require('moment');
var _ = require('lodash');

var projects = require('./data/projects');

var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {
    data: projects.byThemePhase,
    counts: projects.counts,
    view: 'theme',
    themes: projects.themes,
    phases: projects.phases
    }
  );
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/location/', function (req, res) {
  res.render('index', {
    "data": projects.byLocationPhase,
    "counts": projects.counts,
    "view":"location",
    "themes": projects.locations,
    "phases":projects.phases
  });
});

router.get('/projects/:id', function (req, res) {
  res.render('project', {
    data: projects.getById(req.params.id),
    phases: projects.phases,
  });
});

// TODO: make this work
router.get('/projects/:id/prototype', function (req, res) {
  var project = projects.getById(req.params.id);
  if (!data.prototype) {
    res.render('no-prototype', {
      data: project,
    });
  } else {
    res.redirect(data.prototype);
  }
});

router.get('/api', function (req, res) {
  res.json(projects);
});

router.get('/api/:id', function (req, res) {
  var data = projects.getById(req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404);
    res.json({error: 'ID not found'});
  }
});

// TODO: make this work
// router.get('/showntells/all/:loc?', function (req, res, next) {
//   var loc = req.params.loc;

//   var data = [];
//   _.each(projects, function(el)
//   {
//     if (el.showntells)
//     _.each(el.showntells, function(sup)
//     {
//       if (loc && loc !== el.location) {}
//       else {
//         data.push({
//           "name":el.name,
//           "date":moment(sup, "D MMMM YYYY, HH:mm"),
//           "id":el.id,
//           "location":el.location,
//         })
//       }
//     })
//   })

//   req.data = req.data || {};
//   req.data.all = true;
//   req.data.loc = loc;
//   req.data.places = _.unique(_.pluck(projects,'location'));
//   req.data.showntells = _.sortBy(data, "date");

//   req.url = '/showntells';
//   next();
// });

// router.get('/showntells/today/:loc?', function (req, res, next) {
//   var loc = req.params.loc;
//   var data = [];
//   _.each(projects, function(el)
//   {
//     if (el.showntells)
//     _.each(el.showntells, function(sup)
//     {
//         supdate = moment(sup, "D MMMM YYYY, HH:mm");
//         if (supdate.isSame(moment(), 'day'))
//         {
//           if (loc && loc !== el.location) {}
//           else {
//             data.push({
//               "name":el.name,
//               "date":supdate,
//               "id":el.id,
//               "location":el.location,
//             })
//           }
//         }
//     })
//   })
//   req.data = req.data || {};
//   req.data.today = true;
//   req.data.loc = loc;
//   req.data.places = _.unique(_.pluck(projects,'location'));
//   req.data.showntells = _.sortBy(data, "date");
//   req.url = '/showntells';
//   next();
// })

router.get('/display/:number?', function(req, res, next) {
  // Grab number from URL. 0 is default.
  var number = req.params.number;
  if (!number) number = 0;
  // if number is too big for the current data reset it.
  if (number >= projects.raw.length) number = 0;

  // make sure we use the right template to render.
  res.render('display/index', {
    data: projects.raw[number],
    total: projects.raw.length,
    number: number
  });
});

module.exports = router;
