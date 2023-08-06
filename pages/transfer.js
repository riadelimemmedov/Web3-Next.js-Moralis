//!React and Next.js
import { useState,useEffect } from "react";


//!Third Party Packages
import { useMoralis } from "react-moralis";
import {toast, toast as toast_alert} from "react-hot-toast";
import axios from 'axios'


//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')





//?Transfer
export default function Transfer(){
    //state
    const [owner,setOwner] = useState()
    const [spender,setSpender] = useState()
    const [recipient,setRecipient] = useState()

    const [disable_approve,setDisableApprove] = useState(false)
    const [disable_allowance,setDisableAllowance] = useState(false)
    const [disable_transfer,setDisableTransfer] = useState(false)

    const [amount_approve,setAmountApprove] = useState()
    const [amount_transfer,setAmountTransfer] = useState()



    const [isCompletedApprove,setCompletedApprove] = useState(false)
    const [confirmedApproveAccount,setConfirmedApproveAccount] = useState()



    const raiseAlertTransfer = (message) => {
        setDisableTransfer(true)
        setTimeout(() => {
            setDisableTransfer(false)
            toast_alert.error(`${message}`)
        }, 3000);
    }

    const saveApprove = async (approvment_hash,confirmed_account,confirming_account,amount,confirmations) => {
        await axios.post('http://127.0.0.1:8000/approve/create/',{
            approvment_hash:approvment_hash,
            confirmed_account:confirmed_account,
            confirming_account:confirming_account,
            amount:amount,
            confirmations:confirmations
        })
        .then((response) => {
            if(response.data){
                setCompletedApprove(response.data.is_approve)
                setConfirmedApproveAccount(response.data.confirmed_account)
            }
        })
        .catch((err) => {
            console.log('Encounter error when save approved to database ' , err)
        })

        console.log('Approvemtne hash ', approvment_hash)
        console.log('Confirmed account ', confirmed_account)
        console.log('Confirmining account ', confirming_account)
        console.log('Approvemt amount ', amount)
        console.log('Approvemtne confirmations ', confirmations)
        return true
    }



    const saveTransfer = async(transfer_hash,transfer_from,transfer_to,transfer_amount,confirmations) => {
        await axios.post('http://127.0.0.1:8000/transfer/create/',{            
            "transfer_hash":transfer_hash,
            "transfer_from": transfer_from,
            "transfer_to": transfer_to,
            "transfer_amount": transfer_amount,
            "confirmations": confirmations,
            "transfer_approvement":String(transfer_from)
            
        })
        .then((response) => {
            if(response.data){
                console.log('Bunediii alaa complete or not ', response.data)
            }
        })
        .catch((err) => {
            console.log('Encounter error when save transfer to database ', err)
        })

        
        console.log('Transfer  hash ', transfer_hash)
        console.log('Transfer from  ', transfer_from)
        console.log('Transfer to ', transfer_to)
        console.log('Trnsfer amount ', transfer_amount)
        console.log('Transfer confirmations value is ', confirmations)
        return true
    }




    //getContractInformation
    const getContractInformation = async()=>{
        const deployed_contract = await mytoken_contract.deployContract()
        const decimals = await deployed_contract.contract.decimals()

        return{deployed_contract,decimals}
    }

    //handleApprove
    const handleApprove = async(e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        setCompletedApprove(false)
        try{
            if(metamaskAddressRegex.test(owner)){
                setDisableApprove(true)
                setTimeout(async(e) => {
                    setDisableApprove(false)
                    const contract_information = await getContractInformation()  
                    const formattedAmount = mytoken_contract.Ethers.utils.parseUnits(amount_approve.toString(),contract_information.decimals)
            
                    const approved_account = await contract_information.deployed_contract.contract.connect(contract_information.deployed_contract.signer).approve(owner,formattedAmount)
                    const isSaveApproved = await saveApprove(approved_account.hash,owner,await contract_information.deployed_contract.signer.getAddress(),Number(amount_approve.toString()),approved_account.confirmations)
                    

                    // console.log('Is approved is ', isApproved)
                    // console.log('Approved account is ', approved_account)
                    
                    
                    // console.log('Isapproved hash ', approved_account.hash)
                    // console.log('Onaylanann hesab ', owner)
                    // console.log('Onaylayan hesab ', await contract_information.deployed_contract.signer.getAddress())
                    // console.log('Amount is ', amount_approve.toString())
                    // console.log('Confirmations ', approved_account.confirmations)

                    // window.localStorage.setItem('approved_address',owner)
                    // window.localStorage.setItem('is_approved',true)
                    // window.localStorage.setItem('approved_value',amount_approve.toString())

                    // console.log('Is approved value  ', approved_account)

                    await approved_account.wait()

                    toast_alert.success('Approved process completed successfully')
                }, 5000);
            }
            else{
                setDisableApprove(true)
                // window.localStorage.setItem('is_approved',false)
                setTimeout(()=>{
                    toast_alert.error('Please input valid metamask addresss')
                    setDisableApprove(false)
                },3000)
            }
        }
        catch(err){
            // window.localStorage.setItem('is_approved',false)
            console.log('When you --- APPROVE ---- another metamask address encounteres come issues,please try again...')
        }
    }


    //handleAllowance
    const handleAllowance = async (e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        console.log('isCompletedApprove ', isCompletedApprove)

        try{
            // console.log('Approved addresss is ', window.localStorage.getItem('approved_address'))
            // console.log('Is approvedd is ', window.localStorage.getItem('is_approved'))
            if(metamaskAddressRegex.test(spender)){//&& spender == window.localStorage.getItem('approved_address') && window.localStorage.getItem('is_approved')
                setDisableAllowance(true)
                setTimeout(async (e) => {
                    setDisableAllowance(false)
                    const contract_information = await getContractInformation()  
                    const allowanceAmount = await contract_information.deployed_contract.contract.allowance(contract_information.deployed_contract.signer.getAddress(), spender); 

                    console.log('Allowance amount:', mytoken_contract.Ethers.utils.formatUnits(allowanceAmount, contract_information.decimals));
                    toast_alert.success(`Allowed process completed successfully,spender balance is : ${mytoken_contract.Ethers.utils.formatUnits(allowanceAmount, contract_information.decimals)}`)
                },5000);
            }
            // else if(!window.localStorage.getItem('is_approved')){
            //     setDisableAllowance(true)
            //     setTimeout(()=>{
            //         toast_alert.error('Please complete APPROVE process before for using ALLOWANCE process')
            //         setDisableAllowance(false)
            //     },3000)
            // }
            // else if(spender != window.localStorage.getItem('approved_address')){
            //     setDisableAllowance(true)
            //     setTimeout(()=>{
            //         toast_alert.error('This address not approved please first approve this wallet address')
            //         setDisableAllowance(false)
            //     },3000)
            // }
            else{
                setDisableAllowance(true)
                setTimeout(()=>{
                    toast_alert.error('Please input valid metamask addresss')
                    setDisableAllowance(false)
                },3000)
            }
        }
        catch(err){
            console.log('When you --- ALLOW  --- another metamask address encounteres come issues,please try again...')            
        }
    }

    
    //handleTransferFrom
    const handleTransferFrom = async (e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        try{
            // console.log('Approved addresss is ', window.localStorage.getItem('approved_address'))
            // console.log('Is approvedd is ', window.localStorage.getItem('is_approved'))

            // console.log('Approved value is ', window.localStorage.getItem('approved_value'))
            // const confirmedApproveAccountBalance =  await handleUserBalance(confirmedApproveAccount)

            const contract_information = await getContractInformation()  
            const allowanceAmount = await contract_information.deployed_contract.contract.allowance(contract_information.deployed_contract.signer.getAddress(), confirmedApproveAccount); 
            const confirmedApproveAccountBalance = mytoken_contract.Ethers.utils.formatUnits(allowanceAmount, contract_information.decimals)





            if(Number(amount_transfer) > Number(confirmedApproveAccountBalance)){
                raiseAlertTransfer('Approved account not enough token for transfer process,please increse approved token value')
                return 
            }


            console.log('Confirmed account balance is ', confirmedApproveAccountBalance)
            console.log('isCompletedApprove ', isCompletedApprove)
            console.log('Confirmed account is ', confirmedApproveAccount)

            if(metamaskAddressRegex.test(recipient) && confirmedApproveAccount != null && isCompletedApprove == true){// && amount_transfer > 0 && window.localStorage.getItem('approved_address') && window.localStorage.getItem('is_approved') && recipient != window.localStorage.getItem('approved_address') && amount_transfer <= Number(window.localStorage.getItem('approved_value'))
                setDisableTransfer(true)
                setTimeout(async (e) => {
                    setDisableTransfer(false)
                    const contract_information = await getContractInformation()  

                    const formattedAmount = mytoken_contract.Ethers.utils.parseUnits(amount_transfer.toString(),contract_information.decimals)
                    console.log('Alaa noldueee sene ', formattedAmount)
                    

                    // const tx = await deployed_contract.contract.connect(deployed_contract.signer).transfer(formData.address,formattedAmount)

                    const seconSignerAddress = await mytoken_contract.ethers.getSigner(confirmedApproveAccount)

                    console.log('Dostlar bunedir bele ', seconSignerAddress)

                    const tx = await contract_information.deployed_contract.contract.connect(seconSignerAddress).transferFrom(contract_information.deployed_contract.signer.getAddress(),recipient,formattedAmount)
                    const user_balance =  await handleUserBalance(recipient)

                    const isSaveTransfer = await saveTransfer(tx.hash,confirmedApproveAccount,recipient,Number(amount_transfer.toString()),tx.confirmations)



                    console.log('User balance is ', user_balance)

                    console.log('Sen allah bunedi bele ', tx)
                    await tx.wait()
                    toast_alert.success('Transfer From process completed successfully')
                },5000)
            }
            // else if(!window.localStorage.getItem('is_approved')){
            //     setDisableTransfer(true)
            //     setTimeout(()=>{
            //         toast_alert.error('Please complete APPROVE process before for using TRANSFER process')
            //         setDisableTransfer(false)
            //     },3000)
            // }
            // else if(recipient == window.localStorage.getItem('approved_address')){
            //     setDisableTransfer(true)
            //     setTimeout(()=>{
            //         toast_alert.error("You don't send token approved account")                    
            //         setDisableTransfer(false)
            //     },3000)
            // }
            // else if(amount_transfer > Number(window.localStorage.getItem('approved_value'))){
            //     setDisableTransfer(true)
            //     setTimeout(() => {
            //         setDisableTransfer(false)
            //         toast_alert.error('Approved account not enough token for transfer process,please increse approved token value')
            //     }, 3000);
            // }
            else{
                setDisableTransfer(true)
                setTimeout(() => {
                    setDisableTransfer(false)
                    toast_alert.error('Please first complete APPROVE account process and MetamaskAddress format')
                }, 3000);
            }
        }
        catch(err){
            toast_alert.error('Please first complete APPROVE account process')
        }
    }


    //handleUserBalance
    const handleUserBalance = async (address) => {
        const contract = (await mytoken_contract.deployContract()).contract
        const balance = await contract.balanceOf(address)
        const formattedBalance = mytoken_contract.Ethers.utils.formatEther(balance)
        return formattedBalance
    }


    //useEffect
    // useEffect(() => {
    //     window.localStorage.removeItem('approved_address',owner)
    //     window.localStorage.removeItem('is_approved',true)
    // },[])
    

    //returned jsx to client
    return(
        <div className="bg-light text-left p-5 m-5 shadow">
            <h1 className="mb-5 text-secondary">Transfer One Account To Another Coin</h1>
            <hr/>

            {/* !Allowance  */}
            <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                Owner address : <b>{owner}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Amount for approver : <b>{amount_approve}</b>
                <hr/>

                <div className="row">
                    <div className="col-4">
                        <input type="text" className="form-control p-3" value={owner} onChange={(e)=>setOwner(e.target.value)}  placeholder="Approved address"/>
                    </div>
                    <div className="col-4">
                        <input type="number" className="form-control p-3" value={amount_approve} onChange={(e)=>setAmountApprove(e.target.value)} placeholder="Amount value"/>
                    </div>
                    <div className="col-2">
                        <button type="button" onClick={handleApprove} className="btn btn-warning fw-bold w-20" style={{padding:'14px'}} disabled={disable_approve || !owner || !amount_approve}>
                            {disable_approve ? 'Approving...' : 'Approve'}
                        </button>
                    </div>
                </div>
            </form>

            {/* !Allowance  */}
            <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                Spender address : <b>{spender}</b>
                <hr/>

                <div className="row">
                    <div className="col-8">
                        <input type="text" className="form-control p-3" value={spender} onChange={(e)=>setSpender(e.target.value)}  placeholder="Spender address"/>
                    </div>
                    <div className="col-2">
                        <button type="button" onClick={handleAllowance} className="btn btn-info fw-bold w-20" style={{padding:'14px'}} disabled={disable_allowance || !spender}>
                            {disable_allowance ? 'Allowed...' : 'Allow'}
                        </button>
                    </div>
                </div>
            </form>


            {/* !Transfer From  */}
            <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                Recipient address : <b>{recipient}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Transfer amount value : <b>{amount_transfer}</b>

                <hr/>

                <div className="row">
                    <div className="col-4">
                        <input type="text" className="form-control p-3" value={recipient} onChange={(e)=>setRecipient(e.target.value)}  placeholder="Recipient address"/>
                    </div>
                    <div className="col-4">
                        <input type="text" className="form-control p-3" value={amount_transfer} onChange={(e)=>setAmountTransfer(e.target.value)}  placeholder="Amount value"/>
                    </div>
                    <div className="col-2">
                        <button type="button" onClick={handleTransferFrom} className="btn btn-primary fw-bold w-20" style={{padding:'14px'}} disabled={disable_transfer || !recipient || !amount_transfer}>
                            {disable_transfer ? 'Transferring...' : 'Transfer'}
                        </button>
                    </div>
                </div>
            </form>

        </div>  
    )
}