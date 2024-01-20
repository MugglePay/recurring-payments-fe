import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './ui/button'
import { useContractWrite, useAccount, useNetwork } from "wagmi";
import AutoPayABI from "../constants/ABI/AutoPay.json";
import { CalendarCheck2 } from 'lucide-react';

  
const SubscriptionCard = (data : any) => {
  const { write : CancelSubscriptioin } =
  useContractWrite({
    abi: AutoPayABI,
    address: "0x0C9D33C6D418D713d3b33522A92C25B0d9F87528",
    functionName: "cancelSubscription",
    onSuccess: (data) => {
      console.log(data);

      alert(`Successfully created Hash: ${data.hash}`);
    },
  });
  console.log(data)

  const Subscription_period = ['Daily', 'Weekly', 'Monthly']
  return (
    <div>
      {data.cardData?.isActive ? 
          <Card className={'m-2 p-2'}>
      <CardContent className="p-2 flex justify-between">
        <div className=''>
          <h1 className='text-xl font-semibold'>{data.cardData.name}</h1>
          <p className=' text-sm text-gray-600'>{data.cardData.description}</p>
        </div>
        <div className=''>
          <h1 className='text-xl font-semibold'>Token Address</h1>
          <p className=' text-sm text-gray-600'>{data.cardData.tokenAddress}</p>
        </div>
        <div className=''>
          <h1 className='text-xl font-semibold'>Allowance</h1>
          <p className=' text-sm text-gray-600 text-center'>{parseInt(data.cardData.allowance)/ 10 ** 18}$</p>
        </div>
        <div className=''>
          <h1 className='text-xl font-semibold'>Period</h1>
          <p className=' text-sm text-gray-600 text-center'>{Subscription_period[parseInt(data.cardData.subscriptionPeriod)]}</p>
        </div>
       
        <p><span className='font-bold'></span></p>
        <div>
          <Button variant={'destructive'} onClick={()=> CancelSubscriptioin({
            args : [data.cardData.customer, data.cardData.payee]
          })}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
     :  <h3>No Active Subscription</h3>
  }
    </div>
  )
}

export default SubscriptionCard