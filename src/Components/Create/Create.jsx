import { Fragment, useState, useContext } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { AuthContext } from "../../store/userContext";
import { FirebaseContext } from "../../store/firebaseContext";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState({
    item: "",
    category: "",
    price: "",
    image: "",
    commonErr: "",
  });

  const { db } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const cloudName = "dyd8cwf8e";
  const uploadPreset = "olx_upload";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {}

    if(!item.trim()) newError.item = "item Name is REquired";
    if(!category.trim()) newError.category = "category is REquired";
    if(!price.trim()) newError.price = "price is REquired";
    if(!image) newError.image = "image is REquired";

    if(Object.keys(newError).length > 0){
      setError(newError);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    if (user) {
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setImageUrl(data.secure_url);

        await addDoc(collection(db, "items"), {
          item,
          category,
          price,
          image: data.secure_url,
          user: user.uid,
          createdAt: new Date().toDateString(),
        });

        navigate("/");
      } catch (error) {
        console.error("Error while uploading the item", error);
      }
    }
  };

  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <br />
            <input
              className="input"
              type="text"
              id="name"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              name="Name"
              defaultValue="John"
            />
            {error.item ? (
              <>
                <br /> <span className="error">{error.item}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <label htmlFor="category">Category</label>
            <br />
            <input
              className="input"
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="category"
              defaultValue="John"
            />
            {error.category ? (
              <>
                <br /> <span className="error">{error.category}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <label htmlFor="price">Price</label>
            <br />
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              id="price"
              name="Price"
            />
            {error.price ? (
              <>
                <br /> <span className="error">{error.price}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <br />
            <img alt="Posts" width="200px" height="200px" src={imageUrl}></img>
            <br />
            <input
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              type="file"
            />
            {error.image ? (
              <>
                <br /> <span className="error">{error.image}</span>
              </>
            ) : (
              <br />
            )}
            <br />
            <button type="submit" className="uploadBtn">
              upload and Submit
            </button>
          </form>
        </div>
      </card>
    </Fragment>
  );
};

export default Create;
