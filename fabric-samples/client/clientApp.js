/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 01-01-2021 11:29:51
 * @modify date 07-01-2021 00:51:20
 * @desc route entries for the client to access the application functionalities.
 */

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = require('../sdk/app.js')

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
 * Login to the application and the username and password is validated.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} '/login'
 * @param  {} (req, res)
 * @param  {} res
 */
clinetApp.post('/login', (req, res) => {
	const {username, password, role} = req.body;
	const passwd = fetchCredentials(username);
	const user = password === passwd;
	if(user){
		// Generate an access token
    const accessToken = jwt.sign({username: username, role: role}, password);
    res.json({accessToken,});
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
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/registerDoctor', authenticateJWT,  async (req, res) => {
	const doctorObject = createUserObject(req.body)
	const response = await app.registerDoctor(doctorObject);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Invoke registration for patient methods and add the patient data to the ledger. 
 * Registration is carried out only once by doctor/admin (preferably admin).
 * As the username and password of the admin/doctor is needed to enroll.
 * @author Vineeth Bhat
 * @create date 30-12-2020
 * @param  {} '/registerPatient'
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/registerPatient', authenticateJWT, async (req, res) => {
	const patientObject = createUserObject(req.body)
	const response = await app.registerPatient(patientObject);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Invoke update ledger functionalities for updating patient data.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} '/updatePatientData'
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/updatePatientData', authenticateJWT, async (req, res) => {
	const userObj = createUserObject(req.body)
	const response = await app.updatePatientData(userObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Route to invoke the method to read a specific patient's data based on patient's id.
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} '/readPatientData'
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/readPatientData', authenticateJWT, async (req, res) => {
	const userObj = createUserObject(req.body)
	const response = await app.readPatientData(userObj);
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
 * @param  {} async(req, res)
 * @param  {} res
 */
clinetApp.post('/readAllPatientData', authenticateJWT, async (req, res) => {
	const userObj = createUserObject(req.body)
	const response = await app.readPatientData(userObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

clinetApp.post('/initialize', authenticateJWT, async (req, res) => {
	const userObj = createUserObject(req.body)
	const response = await app.initLedger(userObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

/**
 * Method to create an object from request body
 * @author Vineeth Bhat
 * @create date 04-01-2021
 * @param  {} requestBody
 * @return object
 */
function createUserObject(requestBody){
	const userObject = {
		id: requestBody.id,
		password: requestBody.password,
		org: requestBody.organization,
		doctorId: requestBody.doctorId,
		role: role
	}
	return userObject;
}

/**
 * Method to get password from the credentials file. 
 * If the username doesnot exist then it will return empty string.
 * @create date 07-01-2021
 * @param  {} username
 * @return password
 */
function fetchCredentials(username){
	const cred = credentials[username]
	if(cred){
		return cred.password
	}else {
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
	const password = fetchCredentials(req.body.id);
    jwt.verify(token, password, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
			req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};