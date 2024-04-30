import { ChangeEvent, FormEvent, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { CartReducerInitialState } from "../types/reducer-types"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import axios from "axios"
import { server } from "../redux/store"
import toast from "react-hot-toast"
import { saveShippingInfo } from "../redux/reducer/cartReducer"


const Shipping = () => {

    const { cartItems, total } = useSelector(
        (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    )

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    })

    const changHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        dispatch(saveShippingInfo(shippingInfo));
    
        try {
          const { data } = await axios.post(
            `${server}/api/v1/payment/create`,
            {
              amount: total,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          navigate("/pay", {
            state: data.clientSecret,
          });
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart")
    }, [cartItems])

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>

                <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={changHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={changHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    value={shippingInfo.state}
                    onChange={changHandler}
                />

                <select
                    name="country"
                    required
                    value={shippingInfo.country}
                    onChange={changHandler}>
                    <option value="">Choose Country</option>
                    <option value="Ha Noi">Ha Noi</option>
                </select>

                <input
                    required
                    type="number"
                    placeholder="Pin Code"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={changHandler}
                />

                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping