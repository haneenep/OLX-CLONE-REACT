import { useState, useEffect, useContext } from "react";
import Heart from "../../assets/Heart";
import "./Post.css";
import { collection, query, getDocs } from "firebase/firestore";
import { AuthContext } from "../../store/userContext";
import { FirebaseContext } from "../../store/firebaseContext";
import { PostContext } from "../../store/postContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../store/cartContext";

function Posts() {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { db } = useContext(FirebaseContext);
  const { likedProducts, addLikedProduct, removeLikedProduct } =
    useContext(CartContext);
  const { setPostDetails } = useContext(PostContext);

  const onHandleLike = (product) => {
    setLiked(!liked);
    if (!liked) {
      addLikedProduct(product);
    } else {
      removeLikedProduct(product.id);
    }
  };

  console.log(likedProducts, "likedproducts");

  useEffect(() => {
    if (user) {
      const fetchingProducts = async () => {
        try {
          const datas = query(collection(db, "items"));

          const querySnapShot = await getDocs(datas);

          const allProducts = querySnapShot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          });

          setProducts(allProducts);
        } catch (error) {
          console.log(error, "Error while showing the post");
        }
      };
      fetchingProducts();
    }
  }, []);

  const onHandlePost = (product) => {
    setPostDetails(product);
    navigate("/view");
  };

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <div onClick={() => onHandleLike(product)} className="favorite">
                <Heart
                  filled={likedProducts.some((item) => item.id === product.id)}
                ></Heart>
              </div>
              <div className="image">
                <img
                  onClick={() => onHandlePost(product)}
                  src={product.image}
                  alt=""
                />
              </div>
              <div className="content">
                <p className="rate">&#x20B9;{product.price}</p>
                <span className="kilometer">{product.category}</span>
                <p className="name">{product.item}</p>
              </div>
              <div className="date">
                <span>{product.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Posts;
