/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 10-01-2021 10:56:41
 * @modify date 09-03-2021 21:17:33
 * @desc [description]
 */

class User {
  constructor(obj) {
    this.id = obj.id
    this.patientId = obj.patientId
    this.org = obj.org
    this.address = obj.address
    this.telephone = obj.tel
    this.diagnosis = obj.diagnosis
    this.medication = obj.medication
    this.doctorId = obj.doctorId
    this.role = obj.role
    this.username = obj.username
  }
}

module.exports = User

