
import {CDN_URL} from "../utils/constants";
import { useContext } from "react";
import UserContext from "../utils/UserContext";

const RestaurantCard = (props) => {
    
    const {resData} = props;
    console.log("resData", resData);
    const { loggedInUser } = useContext(UserContext);
    const {
      cloudinaryImageId,
      name,
      avgRating,
      cuisines,
      costForTwo,
      deliveryTime,} = resData;
      
    return (
      // <div className="res-card" style={{ backgroundColor: "#f0f0f0" }}>
      <div className="m-4 p-4 w-[250px] rounded-lg bg-gray-100 hover:bg-gray-200">
        <img
          // className="res-logo"
          className="rounded-lg"
          alt="res-logo"
          src= { CDN_URL + cloudinaryImageId }
          />
        {/* <h3>{name}</h3> */}
        <h3 className="font-bold py-4 text-lg">{name}</h3>
        <h4>{cuisines.join(", ")}</h4>
        {/* <h4>{cuisines}</h4> */}
        <h4>{avgRating} stars</h4>
        {/* <h4>₹{costForTwo / 100} FOR TWO</h4> */}
        <h4>{costForTwo}</h4>
        <h4>{deliveryTime} minutes</h4>
        <h4>User : {loggedInUser} </h4>
      </div>
    );
  };
      // higher order component

      export const withPromotedLabel = (RestaurantCard) => {
        return (props) => {
          return (
            <div>
              <label className="absolute bg-black text-white m-2 p-2 rounded-lg">
                Promoted 
                </label>
                <RestaurantCard {...props} />
            </div>
          );
        };
      }

    export default RestaurantCard;