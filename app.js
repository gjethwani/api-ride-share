const express = require('express');
const knex = require('knex');
const connect = require('./connect');
const app = express();

const User = require('./models/User');
const Ride = require ('./models/Ride');

/* ALL NECESSARY INFORMATION FOR ENDPOINTS IS WITHIN CODE */

//This endpoint is to authenticate and deauthenticate a user
app.get('/authenticate-user/:email/:password', function(request, response) {
  let email = request.params.email;
  let password = request.params.password;
  let user = new User({ email: email });
  user.fetch()
    .then(function(user) {
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      if (user.attributes.password !== password) {
        throw new Error(`Incorrect password`); //would encrypt password and have better security but didn't have time
      }
      response.status(200).json({
        status: 'success'
      })
    })
    .catch(function(error) {
      response.status(404).json({
        error: error.message
      });
    })
});

//This endpoint is to request a ride
app.get('/request-ride/:userEmail/:pickupAddress/:dropoffAddress', function(request, response) {
  let userEmail = request.params.userEmail;
  let pickupAddress = request.params.pickupAddress;
  let dropoffAddress = request.params.dropoffAddress;
  if (!userEmail || !pickupAddress || !dropoffAddress) {
    response.status(422).json({
      error: 'Incomplete data'
    });
  }
  let ride = new Ride({
    user: userEmail,
    pickupAddress: pickupAddress,
    dropoffAddress: dropoffAddress,
    status: 'REQUESTED'
  });
  ride.save(null, {method: 'insert'})
    .then(function() {
      response.status(200).json({
        status: 'success'
      });
    }, function(error) {
      response.status(422).json({
        error: error.message
      })
    })
});

//This endpoint is to check the status of a ride
app.get('/status/:id', function(request, response) {
  let id = request.params.id;
  let ride = new Ride({ id: id});
  ride.fetch()
    .then(function(ride) {
      if (!ride) {
        throw new Error(`User with email ${email} not found`);
      } else {
        response.status(200).json({
          rideStatus: ride.attributes.status
        });
      }
    })
    .catch(function(error) {
      response.status(404).json({
        error: error.message
      });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
