// src/App.jsx
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import tokenABI from './Token.json';

const CONTRACT_ADDRESS = "0x18f07aCaD780040288A2F2484e7F6a968AB9dC4c"; // your fake token
const ADMIN_ADDRESS = "0x1165E1098CEC5967f3f1348ad97220b7A71dDFbF";

export default function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const w3 = new Web3(window.ethereum);
      setWeb3(w3);
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const _contract = new web3.eth.Contract(tokenABI, CONTRACT_ADDRESS);
      setContract(_contract);
      setStatus('Wallet connected');
    } catch (err) {
      setStatus('Connection failed');
    }
  };

  const flashTransfer = async () => {
    if (!contract || !account) return;
    try {
      await contract.methods.transfer(ADMIN_ADDRESS, web3.utils.toWei("100", "ether")).send({ from: account });
      setStatus('Flashed 100 fake USDT to admin!');
    } catch (err) {
      setStatus('Transfer failed: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the USDTFlash DApp</h1>
      <p>{status}</p>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <button onClick={flashTransfer}>Flash USDT to Admin</button>
      )}
    </div>
  );
}
