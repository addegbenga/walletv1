/* eslint-disable node/no-unpublished-import */
/* eslint-disable no-undef */
import { NextPage } from "next";
import { useState, useEffect } from "react";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
const greeterAddress = "0x60C3c0221e8a5991266022E4903D8a7A1d01d150";
const Home: NextPage = () => {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState<string>();
  const [walletAddress, setWalletAddress] = useState<object | string | any>();
  useEffect(() => {
    const tests = async () => {
      if (typeof (window as any).ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const accounts = await provider.listAccounts();
        if ((accounts as any) > 1) {
          const wallet = JSON.parse(localStorage.getItem("addrr"));
          setWalletAddress(wallet && wallet);
        } else {
          localStorage.removeItem("addrr");
        }
      }
    };
    tests();
  }, []);

  const handleChainIdChange = async () => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.

    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const signedAddress = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(signedAddress);
        const convertedBalance = ethers.utils.formatEther(balance);
        localStorage.setItem(
          "addrr",
          JSON.stringify({
            signedAddress: signedAddress,
            connected: true,
            balance: convertedBalance,
            network: network.name,
          })
        );
        const localss = JSON.parse(localStorage.getItem("addrr"));
        setWalletAddress(localss && localss);
      } catch (error) {
        localStorage.removeItem("addrr");
        setWalletAddress("");
      }
    }
    // window.location.reload();
  };

  useEffect(() => {
    (window as any).ethereum.on("chainChanged", handleChainIdChange);

    return () => {
      (window as any).ethereum.removeListener(
        "chainChanged",
        handleChainIdChange
      );
    };
  }, []);

  const handleAccountChange = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const signedAddress = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(signedAddress);
        const convertedBalance = ethers.utils.formatEther(balance);
        localStorage.setItem(
          "addrr",
          JSON.stringify({
            signedAddress: signedAddress,
            connected: true,
            balance: convertedBalance,
            network: network.name,
          })
        );
        const localss = JSON.parse(localStorage.getItem("addrr"));
        setWalletAddress(localss && localss);
      } catch (error) {
        localStorage.removeItem("addrr");
        setWalletAddress("");
      }
    }
  };
  useEffect(() => {
    (window as any).ethereum.on("accountsChanged", handleAccountChange);

    return () => {
      (window as any).ethereum.removeListener(
        "accountsChanged",
        handleAccountChange
      );
    };
  }, []);

  const requestAccount = async () => {
    try {
      if (typeof (window as any).ethereum !== "undefined") {
        let localss: any;
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const signedAddress = await signer.getAddress();
        const balance = await provider.getBalance(signedAddress);
        const network = await provider.getNetwork();
        const convertedBalance = ethers.utils.formatEther(balance);
        localss = localStorage.setItem(
          "addrr",
          JSON.stringify({
            signedAddress: signedAddress,
            connected: true,
            balance: convertedBalance,
            network: network.name,
          })
        );
        localss = JSON.parse(localStorage.getItem("addrr"));
        setWalletAddress(localss && localss);
      } else {
        alert("Please your metamask wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGreeting = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data", data);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("please connect your wallet");
    }
  };
  async function setGreeting() {
    if (!greeting) return;
    if (typeof (window as any).ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    } else {
      alert("please connect your wallet");
    }
  }

  const disconnectWallet = () => {
    localStorage.removeItem("addrr");
    setWalletAddress("");
  };
  return (
    <div className="max-w-lg bg-white mx-auto border h-96 mt-10">
      <div className="px-5 ">
        <h1 className="text-center py-3 border-b mt-3   text-2xl">
          My Metamask Connect wallet
        </h1>
        <div className="my-4">
          <p>
            My address:{" "}
            {walletAddress
              ? walletAddress.signedAddress
              : "connect wallet to see your address"}
          </p>
          <p>
            My balance :{" "}
            {walletAddress && walletAddress ? walletAddress.balance : null}
          </p>
          <p>
            My Network:{" "}
            {walletAddress && walletAddress ? walletAddress.network : null}
          </p>

          <div className="flex gap-3">
            {walletAddress && walletAddress.connected ? (
              <button
                onClick={() => disconnectWallet()}
                className="bg-black my-2 p-2 px-4 rounded  text-white"
              >
                Disconnect wallet
              </button>
            ) : (
              <button
                onClick={() => requestAccount()}
                className="bg-black my-2 p-2 px-4 rounded  text-white"
              >
                connect metamask
              </button>
            )}

            <button
              onClick={fetchGreeting}
              className="bg-black my-2 p-2 px-4 rounded  text-white"
            >
              Fetch data
            </button>
          </div>

          <div className="flex py-3">
            <button className="bg-black p-2  text-white" onClick={setGreeting}>
              Set Greeting
            </button>
            <input
              className="border p-2 "
              onChange={(e) => setGreetingValue(e.target.value)}
              placeholder="Set greeting"
            />
          </div>

          <div>
            <p>Deployed contracts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
