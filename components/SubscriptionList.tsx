"use client"

import React from 'react'
import SubscriptionCard from './SubscriptionCard'
import {  useAccount, useNetwork, useContractRead } from "wagmi";
import ABI from "../constants/ABI/AutoPay.json"
import Addresses from "../constants/Addresses/Address.json"

const SubscriptionList = () => {
    const { address, isConnected } = useAccount();
    // 0xe4AF61b6806d929589Fd5269b9507Ef650b27efa
    const { data, isError, isLoading } = useContractRead({
        address: "0x0C9D33C6D418D713d3b33522A92C25B0d9F87528",
        abi: ABI,
        functionName: 'getSubscription',
        args: [address, Addresses.Payee]
      })
    
  return (
    <div> {data ? 
    <SubscriptionCard cardData= {data}/> : <h3>No Active Subscription</h3>}</div>
  )
}

export default SubscriptionList