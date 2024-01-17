import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestrauntMenu";
import RestaurantCategory from "./RestaurentCategory";
import { useState } from "react";

const RestaurantMenu = () => {
  const { resId } = useParams();
  
  const dummy = "Dummy Data";

  const resInfo = useRestaurantMenu(resId);

  const [showIndex, setShowIndex] = useState(null);

  if (resInfo === null) return <Shimmer />;

  let name, cuisines, costForTwoMessage, itemCards;

  if (resInfo && Array.isArray(resInfo.cards)) {
    for (const card of resInfo.cards) {
      if (card && card.card && card.card.card && card.card.card.info) {
        ({ name, cuisines, costForTwoMessage } = card.card.card.info);
        break; // Found the first structure, break the loop
      }
    }

    for (const card of resInfo.cards) {
      if (card && card.groupedCard && card.groupedCard.cardGroupMap && card.groupedCard.cardGroupMap.REGULAR && Array.isArray(card.groupedCard.cardGroupMap.REGULAR.cards)) {
        for (const innerCard of card.groupedCard.cardGroupMap.REGULAR.cards) {
          if (innerCard && innerCard.card && innerCard.card.card && innerCard.card.card.itemCards) {
            itemCards = innerCard.card.card.itemCards;
            break; // Found the second structure, break the inner loop
          }
        }
      }
    }
  }

  if (!name || !cuisines || !costForTwoMessage || !itemCards) {
    return <Shimmer />;
  }

  const categories =
    resInfo?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
      (c) =>
        c.card?.["card"]?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
    );


  return (
    // <div className="menu">
    //   <h1>{name}</h1>
    //   <p>
    //     {cuisines.join(", ")} - {costForTwoMessage}
    //   </p>
    //   <h2>Menu</h2>
    //   <ul>
    //     {itemCards.map((item) => (
    //       <li key={item.card.info.id}>
    //         {item.card.info.name} -{" Rs."}
    //         {item.card.info.price / 100 || item.card.info.defaultPrice / 100}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div className="text-center">
    <h1 className="font-bold my-6 text-2xl">{name}</h1>
    <p className="font-bold text-lg">
      {cuisines.join(", ")} - {costForTwoMessage}
    </p>
    {/* categories accordions */}
    {categories.map((category, index) => (
      // controlled component
      <RestaurantCategory
        key={category?.card?.card.title}
        data={category?.card?.card}
        showItems={index === showIndex ? true : false}
        setShowIndex={() => setShowIndex(index)}
        dummy={dummy}
      />
    ))}
  </div>
  );
};

export default RestaurantMenu;
