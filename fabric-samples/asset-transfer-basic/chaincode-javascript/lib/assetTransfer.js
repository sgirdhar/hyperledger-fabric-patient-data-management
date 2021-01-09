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

    async InitializePatient(ctx) {
        const assets = [
            {
                ID: 'patient1',
                Age: '25',
                Address: 'XX',
                Hospital: 'Hospital1',
            },
            {
                ID: 'patient2',
                Age: '55',
                Address: 'XXXXX',
                Hospital: 'Hospital1',
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async RegisterPatient(ctx, id, age, address, hospital) {
        const asset = {
            ID: id,
            Age: age,
            Address: address,
            Hospital: hospital,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // Initialising the patient ledger
    async InitPatientLedger(ctx) {
        const records = [
            {
                ID: 'EHR1',
                PatientId: 'Patient1',
                Diagnosis: 'D1',
                Medication: 'M1',
                DoctorId: 'Doc1',
            },
            {
                ID: 'EHR2',
                PatientId: 'Patient2',
                Diagnosis: 'D2',
                Medication: 'M2',
                DoctorId: 'Doc2',
            },
            {
                ID: 'EHR3',
                PatientId: 'Patient3',
                Diagnosis: 'D3',
                Medication: 'M3',
                DoctorId: 'Doc1',
            },
        ];

        for (const record of records) {
            // asset.docType = 'EHR';
            await ctx.stub.putState(record.ID, Buffer.from(JSON.stringify(record)));
            console.info(`Record ${record.ID} initialized`);
        }
    }

    // CreateRecord issues a new record to the world state with given details.
    async CreateRecord(ctx, id, patientId, diagnosis, medication, doctorId) {
        const record = {
            ID: id,
            PatientId: patientId,
            Diagnosis: diagnosis,
            Medication: medication,
            DoctorId: doctorId,
            // docType: 'EHR',
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(record)));
        return JSON.stringify(record);
    }

    // ReadRecord returns the record stored in the world state with given id.
    async ReadRecord(ctx, id) {
        const recordJSON = await ctx.stub.getState(id); // get the record from chaincode state
        if (!recordJSON || recordJSON.length === 0) {
            throw new Error(`The Record ${id} does not exist`);
        }
        return recordJSON.toString();
    }

    // UpdateRecord updates an existing record in the world state with provided parameters.
    async UpdateRecord(ctx, id, patientId, diagnosis, medication, doctorId) {
        const exists = await this.RecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The record ${id} does not exist`);
        }

        // overwriting original record with new record
        const updatedRecord = {
            ID: id,
            PatientId: patientId,
            Diagnosis: diagnosis,
            Medication: medication,
            DoctorId: doctorId,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedRecord)));
    }

    // DeleteRecord deletes a given record from the world state.
    async DeleteRecord(ctx, id) {
        const exists = await this.RecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The record ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
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


}

module.exports = AssetTransfer;
