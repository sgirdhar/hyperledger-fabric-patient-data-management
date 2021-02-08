/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 01-01-2021 11:29:51
 * @modify date 11-01-2021 01:35:13
 * @desc route entries for the client to access the application functionalities.
 */

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = require('../sdk/app.js')
const User = require('../sdk/user.js')

const clinetApp = express();
clinetApp.use(morgan('combined'));
clinetApp.use(bodyParser.json());
clinetApp.use(cors());
const jwt = require('jsonwebtoken');
clinetApp.use(bodyParser.urlencoded({
  extended: true
}));

const credentials = require('./credentials.json')
clinetApp.listen(5001, () => console.log('Backend server running on 5001'));





/**
 * Method to get password from the credentials file. 
 * If the username doesnot exist then it will return empty string.
 * @create date 07-01-2021
 * @param  {} username
 * @return password or role as per the given obj
 */
function fetchCredentials(username,obj){
  const cred = credentials[username]
  var param = obj;
	if(cred){
    if(param=="password"){
      return cred.password; 
    }
    else if(param=="role"){
      return cred.role;
    }
  }
	else {
		return ""
	}
}

/**
 * Method to authenticate the access token generated.
 * @author Vineeth Bhat
 * @create date 07-01-2021
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
		const token = authHeader.split(' ')[1];
	const password = fetchCredentials(req.body.username,"password");
    jwt.verify(token, password, (err, user) => {
      if (err) {
        console.log(err);
        console.log(password);
        return res.sendStatus(403);
      }
			req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

/**
 * Login to the application and the username and password is validated.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} '/login'
 * @param  {} (req, res)
 * @param  {} res
 */
clinetApp.post('/login', (req, res) => {
	const {username,password} = req.body;
  const passwd = fetchCredentials(username,"password");
  const user = password === passwd;
	if(user){
    // Generate an access token
    const rol = fetchCredentials(username,"role")
    const accessToken = jwt.sign({username: username, role: rol}, password);
    res.json({accessToken,rol});
	} else {
		res.send("Invalid Username or password");
	}
});

/**
 * Invoke registration for the doctor. Carried out one time by the admin.
 * As the username and password of the admin is needed to enroll.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} '/registerDoctor'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/registerDoctor', authenticateJWT,  async (req, res) => {
	const doctorObj = new User(req.body)
	const response = await app.registerDoctor(doctorObj);
	if (response.error) {
    res.send(JSON.stringify(response.error));
  } else {
    res.send(JSON.stringify(response));
  }
});

/**
 * Invoke registration for patient methods and add the patient data to the ledger. 
 * Registration is carried out only once by doctor/admin (preferably admin).
 * As the username and password of the admin/doctor is needed to enroll.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} '/registerPatient'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/registerPatient', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.registerPatient(patientObj);
	console.log(response);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Update patient's non-medical information.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} '/updatePatientData'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/updatePatientInfo', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.updatePatientInfo(patientObj)
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Update patient's medical information
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} '/updatePatientHealthRecord'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/updatePatientHealthRecord', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.updatePatientHealthRecord(patientObj)
	if (response.error) {
    res.send(response.error)
  } else {
    res.send(response)
  }
});

/**
 * Route to invoke the method to read a specific patient's data based on patient's id.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} '/readPatientData'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/readPatientData', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.readPatientData(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});


/**
 * Route to invoke the method to read a all the data of all patients' from the ledger.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} '/readAllPatientData'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/readAllPatientData', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.readAllPatientData(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

// Route to invoke function to get history of a record
clinetApp.post('/getRecordHistory', authenticateJWT, async (req, res) => {
  console.log('Beginning client API getRecordHistory')
	const patientObj = new User(req.body)
	const response = await app.getRecordHistory(patientObj);  
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
  console.log(response)
  console.log('Ending client API getRecordHistory')
});

clinetApp.post('/initialize', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.initLedger(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Method to grant access to the doctor by the patient to view his medical record
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} '/grantAccess'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/grantAccess', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.grantAccess(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Method to revoke access to the doctor by the patient.
 * @author Vineeth Bhat
 * @create date 09-01-2021
 * @param  {} '/grantAccess'
 * @param authenticateJWT
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/revokeAccess', authenticateJWT, async (req, res) => {
	const patientObj = new User(req.body)
	const response = await app.revokeAccess(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});