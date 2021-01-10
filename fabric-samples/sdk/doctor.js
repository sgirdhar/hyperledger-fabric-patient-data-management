/**
 * @author Vineeth Bhat
 * @email vineeth.bhat@stud.fra-uas.de
 * @create date 10-01-2021 10:56:51
 * @modify date 10-01-2021 11:27:12
 * @desc [description]
 */

class Doctor {
  constructor(obj) {
    this.id = obj.doctorId
    this.org = obj.org
    // this.department = obj.department
    // this.address = obj.address
    // this.telephone = obj.telephone
  }
}

module.exports = Doctor
