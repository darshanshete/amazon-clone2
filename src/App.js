import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom"
import Checkout from './Checkout';
import React, { useEffect, useState } from 'react';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './Stateprovider';
import Payment from './Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import Orders from './Orders';

const promise = loadStripe("pk_test_51NYQuhSInr2jWExXymmJtCSQi9GiRTWsnTNYZ37LHAYdmYY8e4A91PvfysDwDND3MLbzOKoc38P9vca2ArgHaWTj00VSGr4m0q");

function App() {
  const [{ }, dispatch] = useStateValue();


  // function HelloComponent() {
  //   return <h1>Login Page</h1>;
  // }
  useEffect(() => {

    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS >>>', authUser);

      if (authUser) {
        //user logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })


      } else {
        //user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])

  const [basketItems, setBasketItems] = useState([]);
  return (
    // BEM
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={[<Header />, <Orders />]} />
          <Route path="/checkout" element={[<Header />, <Checkout />]} />
          <Route path="/payment" element={[<Header />, <Elements stripe={promise}>
            <Payment />
          </Elements>]} />
          <Route path="/" element={[<Header />, <Home />]} />

        </Routes>
      </div>
    </Router>
  );
}



export default App;
