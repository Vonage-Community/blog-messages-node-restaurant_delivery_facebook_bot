// access our environment variables
require('dotenv').config();
// access the Vonage SDK so we can use the Voange object and API
const Vonage = require('@vonage/server-sdk');
// access Got library which allows us to make HTTP request to WOLT API
const got = require('got');
const loki = require('lokijs');

// boilerplate Express setup
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create in-memory database to store offline restaurants
let db = new loki("restaurants.db");
let restaurants = db.addCollection("restaurants");

// The frequency to check our offline restaurants
const INTERVAL = 6000;
// The Sender will always be the Sandbox account so we make this easier to access through a global variable
let SENDER;

// initialize a new Vonage instance, with ENV variables/keys
const vonage = new Vonage(
  {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    applicationId: process.env.APP_ID,
    privateKey: './private.key'
  },
  {
    apiHost: 'https://messages-sandbox.nexmo.com/',
  }
 );

 // call Wolt API for restaurant info
const getRestaurant = async (reqRestaurant) => {
  const response = await got.get(`https://restaurant-api.wolt.com/v3/venues/slug/${reqRestaurant}`)
      .json();
  return response.results[0];
}

// Check initially whether restaurant is online or should it be added to list of offline restaurants to check
const firstStatusCheck = (restaurant, recipient) => {
  if (restaurant.online) {
    sendFacebookMessage(`Hey, ${restaurant.name[0].value} is now accepting orders!!`, recipient);
  } else {
      sendFacebookMessage(`Sorry, ${restaurant.name[0].value} is currently offline. I'll ping you when it's open again!`, recipient);
      addRestaurantToDb(restaurant, recipient);
    }
}

// function to send a facebook messenger message
const sendFacebookMessage = async (text, recipient) => {
  vonage.channel.send(
    SENDER,
    recipient ,
    {
      content: {
        type: 'text',
        text: text,
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data.message_uuid);
      }
     }
   );
 }

// take a restaurant name and looker-uper and add to our list of restaurants to check
 const addRestaurantToDb = (restaurant, recipient) => {
  restaurants.insert({name: restaurant.name[0].value, online: restaurant.online, recipient: recipient, slug: restaurant.slug});
 }

 // retrieve all restaurants with offline status
// for each offline restuarant
// check that current restaurant is still offline
const offlineRestaurantLookup = async () => {
  let offlineRestaurants = restaurants.data;
  offlineRestaurants.forEach(await checkIsStill0ffline);
}

// if checked restaurant is now online:
// message user that restaurant is now online
// delete checked restaurant from db
const checkIsStill0ffline = async (restaurant) => {
  const checkedRestaurant = await getRestaurant(restaurant.slug);
  if (checkedRestaurant.online) {
    sendFacebookMessage(`Hey, ${restaurant.name} is now accepting orders!!`, restaurant.recipient);
    restaurants.chain().find({'name': restaurant.name}).remove();
  }
}


// Enhanced Sandbox Messaging
app.post('/inbound', async(req, res) => {
  SENDER = req.body.from;
  const recipient = await req.body.to;
  const requestedRestaurant = await req.body.message.content.text.split('/').pop();
  const restaurant = await getRestaurant(requestedRestaurant);
  firstStatusCheck(restaurant, recipient);
  res.send('ok');
});

app.post('/status', (req, res) => {
  res.send('ok');
});

// every X seconds, check that offline restaurants are still offline
setInterval(function(){offlineRestaurantLookup()} , INTERVAL);

app.listen(3000);
