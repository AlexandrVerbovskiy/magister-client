import React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Payment from "../components/Payment"
import env from "../env"

const stripePromise = loadStripe(env.STRIPE_PUBLIC_KEY)

const Test = () => {
  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  )
}

export default Test