const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */

router.get('/starred/:restaurantId', (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  
  // Find the starred restaurant by ID
  const starredRestaurant = STARRED_RESTAURANTS.find(restaurant => restaurant.id === restaurantId);

  if (!starredRestaurant) {
      // If the restaurant is not found, send status code 404 (Not Found)
      res.status(404).send("Restaurant not found");
  } else {
      // Find the restaurant in the list of all restaurants
      const restaurant = ALL_RESTAURANTS.find(r => r.id === restaurantId);
      
      if (!restaurant) {
          // If the restaurant doesn't exist, send status code 404 (Not Found)
          res.status(404).send("Restaurant not found");
      } else {
          // Create an object with the starred restaurant's id, comment, and name
          const response = {
              id: starredRestaurant.id,
              comment: starredRestaurant.comment,
              name: restaurant.name
          };
          // Send the restaurant data to the front-end
          res.json(response);
      }
  }
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */

router.post('/', (req, res) => {
  const  restaurantId  = req.body.id;

  
  // Check if the restaurant exists in all restaurants
  const restaurant = ALL_RESTAURANTS.find(r => r.id === restaurantId);
  if (!restaurant) {
      // If the restaurant is not found, send status code 404 (Not Found)
      return res.status(404).send("Restaurant not found");
  }


  // Check if the restaurant already exists in starred restaurants
  const existingStarredRestaurant = STARRED_RESTAURANTS.find(r => r.restaurantId === restaurantId);
  if (existingStarredRestaurant) {
      // If the restaurant already exists in starred restaurants, send status code 400 (Bad Request)
      return res.status(400).send("Restaurant already starred");
  }

  // Generate unique ID for the new starred restaurant
  const newId = uuidv4();

  // Create a record for the new starred restaurant
  const newStarredRestaurant = {
      id: newId,
      restaurantId: restaurantId,
      name:restaurant.name
     
  };

  // Push the new record into STARRED_RESTAURANTS
  STARRED_RESTAURANTS.push(newStarredRestaurant);

  console.log(STARRED_RESTAURANTS,'===============>')

  // Set a success status code and send the restaurant data to the front-end
  res.json(newStarredRestaurant);
});




/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const newListOfRestaurants = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  );
  newListOfRestaurants

  // The user tried to delete a restaurant that doesn't exist.
  if (STARRED_RESTAURANTS.length === newListOfRestaurants.length) {
    res.sendStatus(404);
    return;
  }

  STARRED_RESTAURANTS = newListOfRestaurants;
  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Newcomment } = req.body;

  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  restaurant.comment = Newcomment;

  res.sendStatus(200);
});


module.exports = router;