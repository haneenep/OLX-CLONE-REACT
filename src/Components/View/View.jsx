import React, { useEffect, useState, useContext } from "react";
import "./View.css";
import { PostContext } from "../../store/postContext";
import { FirebaseContext } from "../../store/firebaseContext";

import { collection, doc, getDoc } from "firebase/firestore";

function View() {
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postDetails } = useContext(PostContext);
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (!postDetails.user) {
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", postDetails.user));

        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          setError("Seller information not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error loading seller details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  });

  return !postDetails ? (
    <div className="viewParentDiv">
        <p>Product not found</p>
      </div>
  )  : (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img style={{objectFit:"cover"}}
          src={postDetails.image}
          alt={postDetails.product}
        />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>₹ {postDetails.price}</p>
          <p>Product: {postDetails.item}</p>
          <p>Category: {postDetails.category}</p>
          <p>Posted: {postDetails.createdAt 
              ? new Date(postDetails.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              : 'Date not available'}</p>
        </div>
        
        <div className="contactDetails">
          <h3>Seller Details</h3>
          {loading ? (
            <p>Loading seller details...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : userDetails ? (
            <div className="sellerInfo">
              <p>Name: {userDetails.name || 'Not provided'}</p>
              {userDetails.email && <p>Email: {userDetails.email}</p>}
              {userDetails.phone && <p>Phone: {userDetails.phone}</p>}
              {userDetails.location && <p>Location: {userDetails.location}</p>}
            </div>
          ) : (
            <p>No seller details available</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default View;
