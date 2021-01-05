/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 31-12-2020 12:17:00
 * @modify date 05-01-2021 17:18:47
 * @desc server side methods to implement application functionalities.
 */

'use strict'

const { Gateway, Wallets } = require('fabric-network')
const FabricCAServices = require('fabric-ca-client')
const path = require('path')
const { buildCCPHospital, buildWallet, prettyJSONString, registerAndEnrollUser, buildCAClient } = require('./utils.js')
const orgConst = require('./organizationConstant.json')

const channelName = 'mychannel'
const chaincodeName = 'basic'

const walletPath = path.join(__dirname, 'wallet')

/**
 * Method to register and enroll the user to a specific organization.
 * Get the organization detail, wallet detail and create a identity for the
 * user in the wallet and finally register and enroll the user.
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} userObj
 * @return object
 */
async function registerUser(userObj) {
  try {
    const orgDetail = orgConst[userObj.org]
    const ccp = buildCCPHospital(userObj.org)
    const caClient = buildCAClient(FabricCAServices, ccp, orgDetail.ca)
    const wallet = await buildWallet(Wallets, walletPath)
    await registerAndEnrollUser(caClient, wallet, orgDetail.msp, userObj.id, orgDetail.department)
  } catch (error) {
    console.error(`\nregisterUser() --> Failed to register user ${userObj.id}: ${error}`)
    throw new Error(`Failed to register user ${userObj.id}: ${error}`)
  }
}

/**
 * Method to connect the sdk to fabric network by creating a gateway and
 * obtaining an instance of the network of the fabric network.
 * @author Vineeth Bhat
 * @create date 03-01-2021
 * @param  {} userObj
 */
async function connectNetwork(userObj) {
  try {
    const ccp = buildCCPHospital(userObj.org)
    const wallet = await buildWallet(Wallets, walletPath)
    const gateway = new Gateway()
    await gateway.connect(ccp, {
      wallet,
      identity: userObj.id,
      discovery: { enabled: true, asLocalhost: true }
    })
    const network = await gateway.getNetwork(channelName)
    userObj.wallet = wallet
    userObj.gateway = gateway
    userObj.network = network
    return userObj
  } catch (error) {
    console.error(`connectNetwork() --> Failed to connect to the fabric network: ${error}`)
    throw new Error(`Failed to connect to the fabric network: ${error}`)
  }
}

/**
 * Method to disconnect the connection between sdk and fabric network.
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} userObj
 */
function disconnectNetowrk(userObj) {
  userObj.gateway.disconnect()
}

/**
 * Method to register the doctor to the organization by using registerUser().
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} doctorObj
 */
async function registerDoctor(doctorObj) {
  try {
    registerUser(doctorObj)
    return 'Doctor: ' + doctorObj.id + ', successfully registered'
  } catch (error) {
    console.error(`\nregisterDoctor() --> Failed to register doctor ${doctorObj.id}: ${error}`)
    throw new Error(`Failed to register doctor ${doctorObj.id}: ${error}`)
  }
}

/**
 * Method to register the patient to an organization using registerUser().
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} patientObj
 */
async function registerPatient(patientObj) {
  try {
    registerUser(patientObj)
  
    // ----------uncomment this section and add appropriate method name from smart contract in
    //                                       submitTransaction() to add the patient data to the ledger ------------------
    // patientObj = await connectNetwork(patientObj)
    // const contract = patientObj.network.getContract(chaincodeName)
    // console.log('\nregisterPatient()--> Submit Transaction: AddPatient, function adds the patient data to the ledger')
    // await contract.submitTransaction('')
    // console.log('\n Result: committed')
    // disconnectNetowrk(patientObj)
    return 'Patient: ' + patientObj.id + ', successfully registered'
  } catch (error) {
    console.error(`\nregisterPatient() --> Failed to register patient ${patientObj.id}: ${error}`)
    throw new Error(`Failed to register patient ${patientObj.id}: ${error}`)
  }
}

/**
 * Method to update the patient record in the ledger using appropriate chanincode and method.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} userObj
 */
async function updatePatientData(userObj) {
  try {
    userObj = await connectNetwork(userObj)
    const contract = userObj.network.getContract(chaincodeName)
    console.log('\n--> Submit Transaction: UpdateRecord, function updates patient record the ledger')
    await contract.submitTransaction('')
    console.log('*** Result: committed')
    return 'Record updated'
  } catch (error) {
    console.error(`updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}

/**
 * Method to read a patient's record based on id from the ledger using appropriate chanincode and method.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} userObj
 * @return result
 */
async function readPatientData(userObj) {
  try {
    userObj = await connectNetwork(userObj)
    const contract = userObj.network.getContract(chaincodeName)
    console.log('\n--> Evaluate Transaction: ReadRecord, function reads a patient\'s record the ledger')
    const result = await contract.evaluateTransaction('', '')
    console.log(`*** Result: ${prettyJSONString(result.toString())}`)
    return result
  } catch (error) {
    console.error(`readPatientData() --> Failed to read the record: ${error}`)
    throw new Error(`Failed to read the record: ${error}`)
  }
}

/**
 * Method to read all the records from the ledger using appropriate chanincode and method.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} userObj
 * @return result
 */
async function readAllPatientData(userObj) {
  try {
    userObj = await connectNetwork(userObj)
    const contract = userObj.network.getContract(chaincodeName)
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current records from the ledger')
    const result = await contract.evaluateTransaction('')
    console.log(`*** Result: ${prettyJSONString(result.toString())}`)
    return result
  } catch (error) {
    console.error(`readAllPatientData() --> Failed to read all the current record: ${error}`)
    throw new Error(`Failed to read all the current record: ${error}`)
  }
}

async function initLedger(userObj) {
  try {
    userObj = await connectNetwork(userObj)
    const contract = userObj.network.getContract(chaincodeName)

    console.log('\n--> Submit Transaction: InitializePatient, function creates the initial set of assets on the ledger')
    await contract.submitTransaction('InitializePatient')
    console.log('*** Result: committed')

    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger')
    const result = await contract.evaluateTransaction('GetAllAssets')
    console.log(`*** Result: ${prettyJSONString(result.toString())}`)
    return result
  } catch (error) {
    console.error(`Failed to retrieve contract: ${error}`)
    process.exit(1)
  }
}

module.exports = {
  registerDoctor,
  registerPatient,
  initLedger,
  connectNetwork,
  disconnectNetowrk,
  updatePatientData,
  readPatientData,
  readAllPatientData
}
