'use client'

import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { config } from "@/config";
import { useEffect } from "react";

export default function ConnectButton() {

  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const defaultChain = config.chains[0];

  useEffect(()=> {
    console.log(chain)
    if(isConnected && chain?.id !== defaultChain.id){
        switchNetwork?.(defaultChain.id)
    }
  }, [isConnected])
    
    return <span className='bg-black rounded-3xl'><w3m-button loadingLabel= "loading..." label='Connect Wallet'/></span>
  }