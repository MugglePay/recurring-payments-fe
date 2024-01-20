"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useContractWrite, useAccount, useNetwork } from "wagmi";
import AutoPayABI from "../constants/ABI/AutoPay.json";
import TokenABI from "../constants/ABI/Token.json";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be blank",
  }),
  description: z.string().min(1, {
    message: "description is a required field",
  }),
  Payee: z.string().min(2, {
    message: "Payee is a required field",
  }),
  token: z.string().optional(),
  subscription_cost: z.string().min(1, {
    message: "subscription_cost is a required field",
  }),
  frequency: z.enum(["Daily", "Weekly", "Monthly"]),
  subscription_period:  z.string().min(1, {
    message: "subscription_period is a required field",
  }),

});

const SubscriptionForm = () => {
  const { address, isConnected } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<any>();
  const { data, error, isLoading, isError, isSuccess, write } =
    useContractWrite({
      abi: AutoPayABI,
      address: "0x0C9D33C6D418D713d3b33522A92C25B0d9F87528",
      functionName: "createSubscription",
      onSuccess: (data) => {
        console.log(data);

        alert(`Successfully created Hash: ${data.hash}`);
      },
    });
    const {  write: ApproveToken} =
    useContractWrite({
      abi: TokenABI,
      address: tokenAddress,
      functionName: "approve",
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      Payee: "0xe4AF61b6806d929589Fd5269b9507Ef650b27efa",
      token: "",
      subscription_cost : "",
      frequency: "Daily",
      subscription_period: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    if (!isConnected) {
      alert("Please connect your wallet.");
    }

    const subscription_cost = BigInt(values.subscription_cost) * BigInt(10 ** 18);
    const frequency = values.frequency == "Daily" ? 0 : values.frequency == "Weekly" ? 1 : 2

    ApproveToken({
      args : ["0x0C9D33C6D418D713d3b33522A92C25B0d9F87528", subscription_cost * BigInt(20)]
    })

    write({
      args: [values.Payee, subscription_cost, tokenAddress, values.name,  values.description, parseInt(values.subscription_period), frequency],
    });

    setTimeout(() => {
      form.reset();
    }, 2000);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="ex- Music Subscription" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="ex- Music Subscription from merchant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="Payee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input placeholder="ex-0x342t24...." onChange={(event) => setTokenAddress(event.target.value)}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscription_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Cost</FormLabel>
                <FormControl>
                  <Input placeholder="ex- 100000000" type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                  defaultValue={"Daily"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscription_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Period</FormLabel>
                <FormControl>
                  <Input placeholder="ex- 1" type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <Button type="submit">Create Subscription</Button>
      </form>
    </Form>
  );
};

export default SubscriptionForm