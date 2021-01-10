/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by: Shubham Girdhar
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    // Initialising the patient ledger
    async InitPatientLedger(ctx) {
        const records = [
            {
                PatientId: 'Patient1',
                Address: 'xxxx',
                Telephone: '123456',
                Diagnosis: 'D1',
                Medication: 'M1',
                AuthorizationList:['Doc1'],
            },
            {
                PatientId: 'Patient2',
                Address: 'xxxx',
                Telephone: '123457',
                Diagnosis: 'D2',
                Medication: 'M2',
                AuthorizationList:['Doc2'],
            },
            {
                PatientId: 'Patient3',
                Address: 'xxxx',
                Telephone: '123457',
                Diagnosis: 'D3',
                Medication: 'M3',
                AuthorizationList:['Doc1'],
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
        const patientId = userObj.id;
        const address = userObj.address;
        const tel = userObj.tel;
        const diagnosis = userObj.diagnosis;
        const medication = userObj.medication;
        const doctorId = userObj.doctorId;

        console.log('\n'+userObj);

        const exists = await this.RecordExists(ctx, patientId);
        if (exists) {
            throw new Error(`The record ${patientId} already exist`);
        }

        const record = {
            PatientId: patientId,
            Address: address,
            Telephone: tel,
            Diagnosis: diagnosis,
            Medication: medication,
            AuthorizationList:[doctorId],
            // docType: 'EHR',
        };
        ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
        return JSON.stringify(record);
    }

    // ReadRecord returns the record stored in the world state with given id.
    async ReadRecord(ctx, userObj) {
        const patientId = userObj.id;
        await this.checkAuthorization(ctx, userObj);
        const recordJSON = await ctx.stub.getState(patientId);
        return recordJSON.toString();
    }

    // UpdateRecord updates an existing record in the world state with provided parameters.
    async UpdateRecord(ctx, userObj) {

        const patientId = userObj.id;
        // const address = userObj.address;
        // const tel = userObj.tel;
        const diagnosis = userObj.diagnosis;
        const medication = userObj.medication;
        // const doctorId = userObj.doctorId;

        await this.checkAuthorization(ctx, userObj);
        const updatedRecord = {
            // PatientId: userObj.id,
            Diagnosis: diagnosis,
            Medication: medication,
            // DoctorId: userObj.doctorId,
        };
        return ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    // DeleteRecord deletes a given record from the world state.
    async DeleteRecord(ctx, userObj) {
        await this.checkAuthorization(ctx, userObj);
        return ctx.stub.deleteState(userObj.d);
    }

    // RecordExists returns true when record with given ID exists in world state.
    async RecordExists(ctx, id) {
        const recordJSON = await ctx.stub.getState(id);
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

    /**
     * Update patient's personal information.
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async UpdatePatientInfo(ctx, userObj) {
        const patientId = userObj.id;
        const address = userObj.address;
        const tel = userObj.tel;

        const exists = await this.RecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The record ${patientId} does not exist`);
        }

        const updatedRecord = {
            Address: address,
            Telephone: tel,
        };
        return ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    /**
     * Update authorization list to grant access to doctor
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async grantAccess(ctx, userObj) {
        const patientId = userObj.id;
        const doctorId = userObj.doctorId;

        const authrozationList = await this.getAuthorizationList(ctx, patientId);
        authrozationList.push(doctorId);
        const updatedRecord = {
            AuthorizationList: authrozationList,
        };
        return ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    /**
     * Update authorization list to revoke access to doctor
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async revokeAccess(ctx, userObj) {
        const patientId = userObj.id;
        const doctorId = userObj.doctorId;

        const authrozationList = await this.getAuthorizationList(ctx, patientId);
        const index = authrozationList.indexOf(doctorId);
        if (index > -1) {
            authrozationList.splice(index, 1);
        }
        const updatedRecord = {
            AuthorizationList: authrozationList,
        };
        return ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    /**
     * Get authorization list
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async getAuthorizationList(ctx, id) {
        const recordJSON = await ctx.stub.getState(id);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${id} does not exist`);
        }
        const authrozationList = recordJSON.AuthorizationList;
        return authrozationList;
    }

    /**
     * Check a authorization list for doctor's id
     * @author Vineeth Bhat
     * @create date 09-01-2021
     * @param  {} ctx
     * @param  {} userObj
     */
    async checkAuthorization(ctx, userObj) {
        const patientId = userObj.id;
        const doctorId = userObj.doctorId;

        const authrozationList = await this.getAuthorizationList(ctx, patientId);
        const auth = authrozationList.includes(doctorId);
        if(auth){
            throw new Error('Access denied');
        }
    }

    /**
     * Method to read patient's record. Accessible only for patient
     * @param  {} ctx
     * @param  {} userObj
     */
    async patientReadRecord(ctx, userObj) {
        const patientId = userObj.id;
        const recordJSON = await ctx.stub.getState(patientId);
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${patientId} does not exist`);
        }
        return recordJSON.toString();
    }


}

module.exports = AssetTransfer;
