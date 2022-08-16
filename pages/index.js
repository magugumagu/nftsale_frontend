import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react";
import twitterLogo from '../public/assets/twitter-logo.svg';
import {ethers} from "ethers";
import SPAMDAO from '../utils/SPAMDAO.json';
import Icon from '../public/assets/BF269BAB-EAE1-4422-B9B2-56AFE23E8294.gif'
const TWITTER_HANDLE = 'SPAM_DAO';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/spamdao-nft';
const CONTRACT_ADDRESS ="0x22eC8fE1d79b1B168AE7DF4644ba93f715Cc5056";
const Home = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [merkle,setMerkle]
=useState([]);  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }

  const getMerkleData = (account) => {
    fetch('/api/merkletree?address=' + account)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result)
          setMerkle(result)
        },
        (error) => {
          console.log(error)
        }
      )
      .catch((error) => {
        console.error('通信に失敗しました', error)
      })
  }


  const askContractToMintNft =async () => {
    

    try {
      const {ethereum} =window;

      if (ethereum) {
        const mintvalue = ethers.utils.parseUnits('0.0004', 'ether')
        const merklejson=JSON.parse(merkle)
        const hexProof=merklejson.hexProof
        console.log(hexProof)

        const provider =new ethers.providers.Web3Provider(ethereum);
        const signer =provider.getSigner();
        const connectedContract =new ethers.Contract(CONTRACT_ADDRESS, SPAMDAO.abi, signer);
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn=await connectedContract.presaleMint(1,hexProof,{value:mintvalue});
        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn)
        console.log(`Mined, see transaction: https//rinkeby.etherscan.io/tx${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!")}
      
    } catch (error) {
      console.log(error)
    }
  }

  
  

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className={styles.connectwalletbuttoncontainer}>
    <button onClick={connectWallet} className={styles.connectwalletbutton}>
      Connect to Wallet
    </button>
    </div>
  );


  useEffect(() => {
    checkIfWalletIsConnected();
    if (currentAccount){
    getMerkleData(currentAccount)
    console.log('merkleproof',merkle)
    }

  }, [])

  useEffect(() => {
    getMerkleData(currentAccount)
    console.log('merkleproof',merkle)
    

  }, [currentAccount])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.headercontainer}>
          <p className={styles.gradienttext}>Stay Positive And Mint</p>
          <p className={styles.subtext}>
            welcome to SPAMDAO!!
          </p>
          <div className={styles.connectwalletcontainer}>
          <Image 
          alt="Monty Python Gif" className={styles.gif} src={Icon}
        />
        </div>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <div className={styles.mintblock}>
            <button onClick={askContractToMintNft} className={styles.mintbutton}>
              Mint NFT
            </button>
            </div> )} 
          
          
          
        </div>
        <div className={styles.footercontainer}>
          <Image alt="Twitter Logo" className={styles.twitterlogo} src={twitterLogo} />
          <a
            className={styles.footertext}
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
          
        <div className={styles.footercontainer3}>
          <a
            className={styles.footertext}
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >🌊 View Collection on OpenSea</a>
        </div>
      </div>
    </div>
  );
};

export default Home;