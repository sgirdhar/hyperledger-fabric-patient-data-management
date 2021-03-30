/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by: Shubham Girdhar
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class RecordContract extends Contract {

    // Initialising the patient ledger
    async InitPatientLedger(ctx) {
        const records = [
            {
                PatientId: 'Patient1',
                Address: 'A1',
                Telephone: 741258,
                HealthRecordId: 'EHR1',
                Diagnosis: 'D1',
                Medication: 'M1',
                DoctorAuthorizationList: ['Doc1'],
                OrganisationAuthorizationList: ['Hospital1'],
            },
            {
                PatientId: 'Patient2',
                Address: 'A1',
                Telephone: 745528,
                HealthRecordId: 'EHR2',
                Diagnosis: 'D2',
                Medication: 'M2',
                DoctorAuthorizationList: ['Doc2'],
                OrganisationAuthorizationList: ['Hospital2'],
            },
            {
                PatientId: 'Patient3',
                Address: 'A3',
                Telephone: 744442,
                HealthRecordId: 'EHR3',
                Diagnosis: 'D3',
                Medication: 'M3',
                DoctorAuthorizationList: ['Doc1','Doc2'],
                OrganisationAuthorizationList: ['Hospital1','Hospital2'],
            },
        ];

        for (const record of records) {
            // asset.docType = 'EHR';
            await ctx.stub.putState(record.PatientId, Buffer.from(JSON.stringify(record)));
            console.info(`Record ${record.PatientId} initialized`);
        }
    }

    // CreateRecord issues a new record to the world state with given details.
    async CreateRecord(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const address = userObj.address;
        const telephone = userObj.telephone;
        const diagnosis = userObj.diagnosis;
        const medication = userObj.medication;
        const doctorId = userObj.doctorId;

        const exists = await this.RecordExists(ctx, patientId);
        if (exists) {
            throw new Error(`The record ${patientId} already exist`);
        }

        const record = {
            PatientId: patientId,
            Address: address,
            Telephone: parseInt(telephone,10),
            // HealthRecordId: healthRecordId,
            Diagnosis: diagnosis,
            Medication: medication,
            DoctorAuthorizationList:[doctorId],
            // DoctorAuthorizationList: doctorAuthorizationList,
            // OrganisationAuthorizationList: organisationAuthorizationList,
            // docType: 'EHR',
        };
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
        return JSON.stringify(record);
    }

    // ReadRecord returns the record stored in the world state with given patientId.
    async DoctorReadRecord(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const doctorId = userObj.doctorId;
        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        const auth = await this.CheckAuthorization(ctx, recordJSON, doctorId);
        if(!auth){
            return JSON.stringify('Access Denied');
        }
        return recordJSON.toString();
    }

    // UpdateRecord updates an existing record in the world state with provided parameters.
    async UpdateRecord(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const diagnosis = userObj.diagnosis;
        const doctorId = userObj.doctorId;
        const medication = userObj.medication;
        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        const auth = await this.CheckAuthorization(ctx, recordJSON, doctorId);
        if(!auth){
            return JSON.stringify('Access Denied');
        }
        const updatedRecord = JSON.parse(recordJSON.toString());

        updatedRecord.Diagnosis = diagnosis;
        updatedRecord.Medication = medication;
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
        return JSON.stringify(updatedRecord);
    }

    // DeleteRecord deletes a given record from the world state.
    async DeleteRecord(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const doctorId = userObj.doctorId;
        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        const auth = await this.CheckAuthorization(ctx, recordJSON, doctorId);
        if(!auth){
            return JSON.stringify('Access Denied');
        }
        return ctx.stub.deleteState(patientId);
    }

    // RecordExists returns true when record with given PatientId exists in world state.
    async RecordExists(ctx, patientId) {
        const recordJSON = await ctx.stub.getState(patientId);
        return recordJSON && recordJSON.length > 0;
    }

    // TransferRecord updates the DoctorId field of record with given id in the world state.
    async TransferRecord(ctx, id, newDoctor) {
        const recordString = await this.ReadRecord(ctx, id);
        const record = JSON.parse(recordString);
        record.DoctorId = newDoctor;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(record)));
    }

    // GetAllRecords returns all records found in the world state.
    async GetAllRecords(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all records in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // GetRecordHistory returns the history of a particular record
    async GetRecordHistory(ctx, userObj) {
        userObj = JSON.parse(userObj);
        let resultsIterator = await ctx.stub.getHistoryForKey(userObj.patientId);
        let results = await this.GetAllResults(resultsIterator, true);
        return JSON.stringify(results);
        // return results;
    }

    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

    /**
     * Update patient's personal information.
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async UpdatePatientInfo(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const address = userObj.address;
        const telephone = userObj.telephone;

        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }

        const updatedRecord = JSON.parse(recordJSON.toString());
        updatedRecord.Address = address;
        updatedRecord.Telephone = parseInt(telephone,10);
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
        return JSON.stringify(updatedRecord);
    }

    /**
     * Update authorization list to grant access to doctor
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async GrantAccess(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const doctorId = userObj.doctorId;

        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        const jsonString = JSON.parse(recordJSON.toString());
        const authrozationList = jsonString.DoctorAuthorizationList;
        authrozationList.push(doctorId);
        const updatedRecord = JSON.parse(recordJSON.toString());
        updatedRecord. DoctorAuthorizationList = authrozationList;
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
        return JSON.stringify(updatedRecord);
    }

    /**
     * Update authorization list to revoke access to doctor
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async RevokeAccess(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const doctorId = userObj.doctorId;

        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }

        const jsonString = JSON.parse(recordJSON.toString());
        const authrozationList = jsonString.DoctorAuthorizationList;
        const index = authrozationList.indexOf(doctorId);
        if (index > -1) {
            authrozationList.splice(index, 1);
        }
        const updatedRecord = JSON.parse(recordJSON.toString());
        updatedRecord. DoctorAuthorizationList = authrozationList;
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
        return JSON.stringify(updatedRecord);
    }

    /**
     * Checking authrization to read/write record
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     * @returns recordJSON
     */
    async CheckAuthorization(ctx, recordJSON, doctorId){
        const updatedRecord = JSON.parse(recordJSON.toString());
        const authrozationList = updatedRecord.DoctorAuthorizationList;
        return authrozationList.includes(doctorId);
    }

    /**
     * Method to read patient's record. Accessible only for patient
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async PatientReadRecord(ctx, userObj) {
        userObj = JSON.parse(userObj);
        const patientId = userObj.patientId;
        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        return recordJSON.toString();
    }


}

module.exports = RecordContract;