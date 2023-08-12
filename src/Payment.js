// import React, { useEffect, useState } from 'react'
// import './Payment.css'
// import { useStateValue } from './Stateprovider';
// import CheckoutProduct from './CheckoutProduct';
// import { Link, useNavigate } from 'react-router-dom';
// import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import CurrencyFormat from 'react-currency-format';
// import { getBasketTotal } from './reducer';
 import axios from './axios';
 //import { firebaseApp } from './firebase';
 //import firebase from 'firebase/app';
// import { db,auth, createUserWithEmailAndPassword } from "./firebase";

import React, { useEffect, useState } from 'react';
import './Payment.css';
import { useStateValue } from './Stateprovider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import { db , serverTimestamp} from "./firebase"; // Import specific named exports


function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setclientSecret] = useState("");

    useEffect(() => {
        const getclientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setclientSecret(response.data.clientSecret);
        };
        getclientSecret();
    }, [basket]);

    console.log('THE SECRET IS >>>')

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (clientSecret.trim() !== "") {
            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },

            });

            if (payload.error) {
                setError(payload.error.message);
                setSucceeded(false);
            } else {
                setSucceeded(true);
                setError(null);

                if (user) {
                    const ordersRef = db.collection('users').doc(user?.uid).collection('orders');
                    const order = {
                        basket: basket,
                        amount: payload.paymentIntent.amount,
                        created:firebase.firestore.FieldValue.serverTimestamp()

                    };
                    ordersRef.add(order);
                }

                dispatch({
                    type: 'EMPTY_BASKET'
                })
                navigate('/Orders', { replace: true });
            }
        } else {
            setError("Invalid clientSecret");
        }

        setProcessing(false);
    };
    const handleChange = event => {

        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className='payment' >
            <div className='payment_container'>
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items </Link>)
                </h1>
                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment_address'>
                        <p>{user?.email}</p>
                        <p>Nehru Chowk</p>
                        <p>Sangamner,Maharashtra</p>
                    </div>

                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3> Review items and delivery</h3>
                    </div>
                    <div className='payment_items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                image={item.image}
                                rating={item.rating} />

                        ))}
                    </div>
                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Payment Method</h3>
                    </div>
                    <div className='payment_details'>

                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />

                            <div className='payment_priceContainer'>

                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total : {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₹"}

                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy now"}</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>

                    </div>


                </div>

            </div>

        </div>

    )
}

export default Payment