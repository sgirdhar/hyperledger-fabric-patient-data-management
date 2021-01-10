/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 31-12-2020 12:17:00
 * @modify date 10-01-2021 13:10:16
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
    return network
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
    await registerUser(patientObj)
  
    const network = await connectNetwork(patientObj)
    const contract = network.getContract(chaincodeName)
    const string1 = JSON.stringify(patientObj)
    console.log('\nregisterPatient()--> Submit Transaction: CreateRecord, function adds the patient data to the ledger')
    console.log('\nregisterPatient()-->' + string1)
    await contract.submitTransaction('CreateRecord', string1)
    console.log('\n Result: committed')
    return 'Patient: ' + patientObj.id + ', successfully registered'
  } catch (error) {
    console.error(`\nregisterPatient() --> Failed to register patient ${patientObj.id}: ${error}`)
    throw new Error(`Failed to register patient ${patientObj.id}: ${error}`)
  }
}

/**
 * Method to update the patient information (non-medical) in the ledger using appropriate chanincode and method.
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} userObj
 */
async function updatePatientInfo(userObj) {
  try {
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
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
 * Method to update the patient health record in the ledger using appropriate chanincode and method.
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} userObj
 */
async function updatePatientHealthRecord(userObj) {
  try {
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
    console.log('\n--> Submit Transaction: UpdateRecord, function updates patient record the ledger')
    await contract.submitTransaction('UpdateRecord', userObj)
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
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
    console.log('\n--> Evaluate Transaction: ReadRecord, function reads a patient\'s record the ledger')
    let result
    if (userObj.role === 'Doctor') {
      result = await contract.evaluateTransaction('ReadRecord', userObj)
    } else if (userObj.role === 'Patinet') {
      result = await contract.evaluateTransaction('patientReadRecord', userObj)
    }
   
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
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
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
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)

    console.log('\n--> Submit Transaction: InitPatientLedger, function creates the initial set of assets on the ledger')
    await contract.submitTransaction('InitPatientLedger')
    console.log('*** Result: committed')

    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger')
    const result = await contract.evaluateTransaction('GetAllRecords')
    console.log(`*** Result: ${prettyJSONString(result.toString())}`)
    return result
  } catch (error) {
    console.error(`Failed to retrieve contract: ${error}`)
    process.exit(1)
  }
}

/**
 * Method to grant access to doctor to view patient's medical records
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} userObj
 */
async function grantAccess(userObj) {
  try {
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
    console.log('\n--> Submit Transaction: UpdateRecord, function grant access to the ledger')
    await contract.submitTransaction('grantAccess', userObj)
    console.log('*** Result: committed')
    return 'Access Granted: ' + userObj.doctorId
  } catch (error) {
    console.error(`updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}

/**
 * Method to revoke access to doctor to view patient's medical records
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} userObj
 */
async function revokeAccess(userObj) {
  try {
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)
    console.log('\n--> Submit Transaction: UpdateRecord, function revoke access to the ledger')
    await contract.submitTransaction('revokeAccess', userObj)
    console.log('*** Result: committed')
    return 'Access Revoked: ' + userObj.doctorId
  } catch (error) {
    console.error(`updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}

module.exports = {
  registerDoctor,
  registerPatient,
  initLedger,
  connectNetwork,
  disconnectNetowrk,
  updatePatientHealthRecord,
  readPatientData,
  readAllPatientData,
  updatePatientInfo,
  grantAccess,
  revokeAccess
}
