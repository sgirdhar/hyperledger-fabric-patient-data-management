/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 31-12-2020 12:03:08
 * @modify date 30-03-2021 21:18:26
 * @desc
 */

'use strict'

const fs = require('fs')
const path = require('path')
const orgConst = require('./organizationConstant.json')

// const adminUserId = 'admin'
// const adminUserPasswd = 'adminpw'

/**
 * Method to retrive the organisation configuration from the network.
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @returns organization contents
 */
exports.buildCCPHospital = (orgName) => {
  const orgDetail = orgConst[orgName]
  const ccpPath = path.resolve(__dirname, '..', '..', orgDetail.path)
  const fileExists = fs.existsSync(ccpPath)

  if (!fileExists) {
    throw new Error(`no such file or directory: ${ccpPath}`)
  }

  const contents = fs.readFileSync(ccpPath, 'utf8')
  const ccp = JSON.parse(contents)
  console.log(`Loaded the network configuration located at ${ccpPath}`)
  return ccp
}

/**
 * Method to create wallets to store identities
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} Wallets
 * @param  {} walletPath
 * @returns wallet
 */
exports.buildWallet = async(Wallets, walletPath) => {
  // Create a new  wallet : Note that wallet is for managing identities.
  let wallet
  if (walletPath) {
    wallet = await Wallets.newFileSystemWallet(walletPath)
    console.log(`Built a file system wallet at ${walletPath}`)
  } else {
    wallet = await Wallets.newInMemoryWallet()
    console.log('Built an in memory wallet')
  }
  return wallet
}

/**
 * Create ca client based on the caHostName.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param {*} FabricCAServices
 * @param {*} ccp
 * @returns caClient
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[caHostName] // lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem
  const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

  console.log(`Built a CA Client named ${caInfo.caName}`)
  return caClient
}

/**
 * Enroll admin to the organization
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} caClient
 * @param  {} wallet
 * @param  {} orgMspId
 */
exports.enrollAdmin = async(caClient, wallet, orgMspId) => {
  try {
    const adminUserId = 'admin'
    const adminUserPasswd = 'adminpw'
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminUserId)
    if (identity) {
      console.log('An identity for the admin user already exists in the wallet')
      return
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd })
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: orgMspId,
      type: 'X.509'
    }
    await wallet.put(adminUserId, x509Identity)
    console.log('Successfully enrolled admin user and imported it into the wallet')
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`)
  }
}

/**
 * Register new user and enroll the user to the organization.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} caClient
 * @param  {} wallet
 * @param  {} orgMspId
 * @param  {} userId
 * @param  {} affiliation
 */
exports.registerAndEnrollUser = async(caClient, wallet, orgMspId, userObj, affiliation) => {
  try {
    const userId = userObj.id
    const username = userObj.username

    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId)
    if (userIdentity) {
      console.log(`An identity for the user ${userId} already exists in the wallet`)
      return
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(username)
    if (!adminIdentity) {
      console.log('An identity for the admin user does not exist in the wallet')
      console.log('Enroll the admin user before retrying')
      return
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
    const adminUser = await provider.getUserContext(adminIdentity, username)

    // Register the user, enroll the user, and import the new identity into the wallet.
    // if affiliation is specified by client, the affiliation value must be configured in CA
    const secret = await caClient.register({
      affiliation: affiliation,
      enrollmentID: userId,
      role: 'client'
    }, adminUser)
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret
    })
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: orgMspId,
      type: 'X.509'
    }
    await wallet.put(userId, x509Identity)
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`)
  } catch (error) {
    console.error(`Failed to register user : ${error}`)
  }
}

/**
 * Method to beautify JSON string.
 * @author Vineeth Bhat
 * @create date 31-12-2020
 * @param  {} inputString
 */
exports.prettyJSONString = (inputString) => {
  if (inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2)
  } else {
    return inputString
  }
}
