import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")

connectBtn.onclick = connectWallet
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectBtn.innerHTML = "Connected!"
    } else {
        connectBtn.innerHTML = "Please install metamask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethInput").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
function listenForTransactionMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Compleated with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function withdraw(){
    if(typeof window.ethereum !== "undefined"){
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionMine(txResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }

}
