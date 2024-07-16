import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";

const useCreateDispute = ({ order = null }) => {
  const { sessionUser } = useContext(IndiceContext);
  const [error, setError] = useState(null);
  const [type, setType] = useState("damage");
  const [description, setDescription] = useState("");

  const [opponentId, setOpponentId] = useState(null);
  const [opponentName, setOpponentName] = useState("");
  const [opponentPhoto, setOpponentPhoto] = useState(null);
  const [opponentCountItems, setOpponentCountItems] = useState(0);
  const [opponentItemsType, setOpponentItemsType] = useState("for rental");
  const [opponentCommentCountName, setOpponentCommentCountName] = useState(0);
  const [opponentAverageRatingName, setOpponentAverageRatingName] = useState(0);

  const [listing, setListing] = useState({});

  const isOwnerCreateDispute = sessionUser?.id == order?.ownerId;

  useEffect(() => {
    setType("damage");
    setDescription("");

    if (order) {
      setOpponentId(isOwnerCreateDispute ? order.tenantId : order.ownerId);
      setOpponentName(
        isOwnerCreateDispute ? order.tenantName : order.ownerName
      );
      setOpponentPhoto(
        isOwnerCreateDispute ? order.tenantPhoto : order.ownerPhoto
      );
      setOpponentCountItems(
        isOwnerCreateDispute ? order.tenantCountItems : order.ownerCountItems
      );
      setOpponentItemsType(isOwnerCreateDispute ? "are rented" : "for rental");

      setOpponentAverageRatingName(
        isOwnerCreateDispute
          ? order.tenantCommentCount
          : order.ownerCommentCount
      );
      setOpponentCommentCountName(
        isOwnerCreateDispute
          ? order.tenantAverageRating
          : order.ownerAverageRating
      );

      setListing({
        id: order.listingId,
        listingImages: order.images ?? order.listingImages,
        name: order.listingName,
        averageRating: order.listingAverageRating,
        commentCount: order.listingCommentCount,
      });
    } else {
      setOpponentName("");
      setOpponentPhoto(null);
      setOpponentCountItems(0);
      setOpponentItemsType("for rental");
      setListing({});
    }
  }, [order?.id]);

  return {
    error,
    setError,
    type,
    setType,
    description,
    setDescription,

    opponentId,
    opponentName,
    opponentPhoto,
    opponentCountItems,
    opponentItemsType,
    opponentCommentCountName,
    opponentAverageRatingName,

    listing,
    isOwnerCreateDispute,
  };
};

export default useCreateDispute;
