import { useContext } from "react";
import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import Swal from "sweetalert2";
import { AuthContext } from "../../store/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../../util/firebase";
import { useNavigate,Link } from "react-router-dom";

function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure you want to logout ?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          // setUser(null);
          localStorage.removeItem("user");
          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div className="brandName">
          <OlxLogo></OlxLogo>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        <div className="language">
        <Link to={"/cart"}>CART</Link>
          {/* <span> ENGLISH </span>
          <Arrow></Arrow> */}
        </div>
        <div className="loginPage">
        {user ? (
          <span onClick={handleLogOut} style={{ cursor: "pointer" }}>
            LOGout
          </span>
        ) : (
          <Link to={"/login"}>Login</Link>
        )}
          {/* <span>{user ? `Explore ${user.displayName}` : "Login"}</span> */}
          <hr />
        </div>
        <div className="sellMenu">
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <Link to={"/create"}>SELL</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
