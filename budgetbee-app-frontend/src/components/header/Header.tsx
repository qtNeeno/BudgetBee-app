import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import icon from "../../img/bee.png";
import { fetchUserData } from "../../services/fetchBudgetHeader";

const Header = () => {
  const [userData, setUserData] = useState<{ budget: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const jsonString: any = localStorage.getItem("user");
  const budgetId = JSON.parse(jsonString);

  const clearLocalStorageAndRefresh = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const isMobileOrTablet = () => {
    return window.innerWidth <= 768;
  };

  const [isMobileOrTabletView, setIsMobileOrTabletView] = useState(
    isMobileOrTablet()
  );

  useEffect(() => {
    fetchUserData(budgetId.budget.id)
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOptionClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTabletView(isMobileOrTablet());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="containerHeader text-center grid items-center test rounded-br-3xl rounded-bl-3xl">
        <img
          src={icon}
          alt=""
          className="h-20 absolute mb-20 md:mb-10 right-0"
        />
        <div
          className="hamburger absolute mb-20 md:mb-10 ml-5"
          onClick={handleMenuToggle}
        >
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
        </div>
        {menuOpen && (
          <div className="menu-options mt-12 md:mt-0">
            <ul>
              <Link to="/">
                <li>Home</li>
              </Link>
              <hr />
              <Link to="/transaction">
                <li>Transazioni</li>
              </Link>
              <hr />
              <Link to="/details">
                <li onClick={handleOptionClick}>Dettagli</li>
              </Link>
              <hr />
              <li onClick={clearLocalStorageAndRefresh}>Log Out</li>
            </ul>
          </div>
        )}
        <div className="text-3xl mt-20 mb-20 sm:mt-10 sm:mb-10">
          <p>€ {userData?.budget}</p>
          <p className="text-base sm:text-lg">Bilancio totale</p>
        </div>
        {isMobileOrTabletView && (
          <div className="flex justify-between mb-5 ml-5 mr-5">
            <Link to="/transaction">
              <button className="rounded-full font-bold bg-black w-32 h-16 text-white">
                Aggiungi Entrata
              </button>
            </Link>
            <Link to="/transaction">
              <button className="rounded-full font-bold bg-black w-32 h-16 text-white">
                Aggiungi <br />
                Uscita
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
