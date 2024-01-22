import RestaurantCard , {withPromotedLabel} from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";

const Body = () => {
    // Local State Variable - Super powerful variable
  const [listOfRestaurants, setListOfRestaurant] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);

  const [searchText, setSearchText] = useState("");

  const RestaurantCardPromoted = withPromotedLabel(RestaurantCard);

  // Whenever state variables update, react triggers a reconciliation cycle(re-renders the component)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING')}` );
      // "https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=17.43503979273124&lng=78.33982840346458&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();

      let foundRestaurants = null;

      if (json && json.data && Array.isArray(json.data.cards)) {
          for (let i = 0; i < json.data.cards.length; i++) {
              const card = json.data.cards[i];
              if (card && card.card && card.card.card && card.card.card.gridElements && card.card.card.gridElements.infoWithStyle && card.card.card.gridElements.infoWithStyle.restaurants) {
                  foundRestaurants = card.card.card.gridElements.infoWithStyle.restaurants;
                  break;
              }
          }
      }
      // console.log("foundRestaurants", foundRestaurants);
      if (foundRestaurants) {
          setListOfRestaurant(foundRestaurants);
          setFilteredRestaurant(foundRestaurants);
      } else {
          console.log("The specified structure was not found in the JSON.");
      }

    } catch (error) {
      console.error("Fetching error: ", error);
    }
  };

  const onlineStatus = useOnlineStatus();
  console.log(filteredRestaurant);

  const { loggedInUser, setUserName } = useContext(UserContext);

  if (onlineStatus === false){
    return (
    <h1>Looks like you're offline!! Please check your internet connection</h1>
    )
}


  return listOfRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      {/* ... rest of your component */}
      <div className="filter flex">
        <div className="search m-4 p-4">
          <input
            type="text"
            className="border border-solid border-black"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="px-4 py-2 bg-green-100 m-4 rounded-lg"
            onClick={() => {
              // Filter the restraunt cards and update the UI
              // searchText
              console.log(searchText);

              const filteredRestaurant = listOfRestaurants.filter((res) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
              );

              setFilteredRestaurant(filteredRestaurant);
            }}
          >
            Search
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg"
            onClick={() => {
              const filteredList = listOfRestaurants.filter(
                (res) => res.info.avgRating > 4
              );
              setListOfRestaurant(filteredList);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <label>UserName : </label>
          <input
            className="border border-black p-2"
            value={loggedInUser}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        {filteredRestaurant.map((restaurant) => (
          <Link
            key={restaurant.info.id}
            to={"/restaurants/" + restaurant.info.id}
          >
            { <RestaurantCard resData={restaurant.info} /> }
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
