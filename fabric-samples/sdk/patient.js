/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 10-01-2021 10:56:41
 * @modify date 10-01-2021 11:49:11
 * @desc [description]
 */

class Patient {
  constructor(obj) {
    this.id = obj.patientId
    this.org = obj.org
    this.address = obj.address
    this.telephone = obj.telephone
    this.diagnosis = obj.diagnosis
    this.medication = obj.medication
    this.doctorId = obj.doctorId
  }
}

module.exports = Patient
