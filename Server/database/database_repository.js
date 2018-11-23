const squel = require('squel');
const runQuery = require('../pgConnection');

//  Database Query gets executed
async function queryExecute(query) {
    try {
        let result = await runQuery.pool.query(query);
        return result;
    } catch (err) {

        return Promise.reject(err)
    }
}
//  Creating TABLE in DATABASE And Inserting its Details into MASTERTABLE AND FIELDSTABLE

async function CreateTable(req, res) {

    console.log(req.body, "BODY");

    let colquery = '';
    let fieldsData = [];
    let ColInfo = req.body.ColInfo;
    let constraints = '';
    let query = '';
    let dropdownlist = req.body.dropdownValue;
    let dropdownData = [];


    dropdownlist.forEach((item, index) => {
        dropdownData.push({
            options: item.dropdownOption,
        })
    })

    ColInfo.forEach((item, index) => {
        if (item.constraint) {
            // constraints = constraints + ' ' + item.name + ',';
            // constraints = constraints + ' ' + '"' + item.name + '"' + ',';
            constraints = constraints + ' ' + '"' + escape(item.name) + '"' + ',';

            fieldsData.push({
                // fieldname: item.name,
                fieldname: escape(item.name),
                // label field added
                label: item.label,
                fieldtype: item.type,
                Konstraint: true
            })
        } else {
            fieldsData.push({
                // fieldname: item.name,
                fieldname: escape(item.name),
                // label field added
                label: item.label,
                fieldtype: item.type,
                Konstraint: false
            })
        }
        // colquery = colquery + ' ' + item.name + ' ' + item.type + ',';
        // colquery = colquery + ' ' + '"' + item.name + '"' + ' ' + item.type + ',';
        if(item.type == 'dropdown'){
            colquery = colquery + ' ' + '"' + escape(item.name) + '"' + ' ' + 'text' + ',';
        }
        else{
            colquery = colquery + ' ' + '"' + escape(item.name) + '"' + ' ' + item.type + ',';
        }


    });

    fieldsData.push({
        fieldname: 'uid',
        label: false,
        fieldtype: 'serial',
        Konstraint: false
    })

    colquery = colquery + 'uid SERIAL' + ',';

    console.log(colquery, "COLUMN QUERY");
    console.log(fieldsData, "FIELDS DATA");



    constraints = constraints.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    let tablename = escape(req.body.tablename);

    if (constraints) {
        // query = `CREATE TABLE IF NOT EXISTS ${req.body.tablename} (${colquery} PRIMARY KEY (${constraints}));`
        // query = `CREATE TABLE IF NOT EXISTS "${req.body.tablename}" (${colquery} PRIMARY KEY (${constraints}));`
        query = `CREATE TABLE IF NOT EXISTS "${tablename}" (${colquery} PRIMARY KEY (${constraints}));`

        console.log(query, "QUERY");

    } else {
        colquery = colquery.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        // query = `CREATE TABLE IF NOT EXISTS ${req.body.tablename} (${colquery});`
        // query = `CREATE TABLE IF NOT EXISTS "${req.body.tablename}" (${colquery});`
        query = `CREATE TABLE IF NOT EXISTS "${tablename}" (${colquery});`

    }

    let query1 = squel
        .insert()
        .into("mastertable")
        // tablename in place of req.body.tablename
        .set("tablename", tablename)
        .set("createdby", req.body.currentUser)
        .set("\"Description\"", req.body.description)
        .toString();

    try {
        let response = await queryExecute(query);
        let response1 = await queryExecute(query1);
        let query2 = squel
            .select()
            .from("mastertable")
            // tablename in place of req.body.tablename
            .where("tablename =?", tablename)
            .toString();

        let response2 = await queryExecute(query2);

        fieldsData.forEach((field) => {
            field.tableid = response2.rows[0].id
        });

        dropdownData.forEach((field) => {
            field.tableid = response2.rows[0].id
        })

console.log(dropdownData,"DROP DOWN")

        let query3 = squel
            .insert()
            .into("fieldstable")
            .setFieldsRows(fieldsData)
            .toString();

        let query4 = squel
            .insert()
            .into("dropdowntable")
            .setFieldsRows(dropdownData)
            .toString();

        let response3 = await queryExecute(query3);
        let response4 = await queryExecute(query4);

        return response;

    } catch (err) {
        return Promise.reject(err.code)
    }

}


// Fetching DATA from MASTERTABLE

async function viewTable() {

    let query = squel
        .select()
        .from("mastertable")
        .toString();

    try {
        let resp = await queryExecute(query);
        let newArray = [];

        if (resp.rowCount > 0) {
            resp.rows.forEach((item) => {
                let datas = {};

                for (var key in item) {
                    if (key == 'tablename') {
                        datas[key] = unescape(item[key]);
                    } else {
                        datas[key] = item[key];
                    }
                }
                newArray.push(datas);
            });

            return newArray;
        } else {
            return Promise.reject({
                err: "Data not found"
            });
        }

    } catch (err) {
        return Promise.reject(err.message);
    }
}


// Deleting fields from fieldstable, row from mastertable and the table itself
async function deleteTable(id) {

    let query = squel
        .select()
        .from("mastertable")
        .where("id =?", id)
        .toString();

    let query1 = squel
        .delete()
        .from("mastertable")
        .where("id= ? ", id)
        .toString();

    let query3 = squel
        .delete()
        .from("fieldstable")
        .where("tableid= ? ", id)
        .toString();

    try {
        let resp = await queryExecute(query);
        let resp3 = await queryExecute(query3);
        let query2 = `DROP TABLE "${resp.rows[0].tablename}"`;
        let resp2 = await queryExecute(query2);
        let resp1 = await queryExecute(query1);

        if (resp1.rowCount > 0) {
            return;
        } else {
            return Promise.reject({
                err: "Table not found"
            });
        }

    } catch (err) {
        return Promise.reject(err.message);
    }

}

//DATA to COLUMNS (modified by AND modified at) is added

async function modifyTable(req, res, id) {

    let query = squel
        .update()
        .table('mastertable')
        .set('modifiedby', req.body.user)
        .set('modifiedat', req.body.time)
        .where('id=?', id)
        .toString();

    try {
        let resp = await queryExecute(query)
        return resp;
    } catch (err) {
        return Promise.reject(err);
    }
}


// Fetching Table Information  (is to be modified for editing table)

async function TableData(id) {

    let query = squel
        .select()
        .from("mastertable")
        .where("id =?", id)
        .toString();
    try {
        let resp = await queryExecute(query);

        return resp.rows;
    } catch (err) {
        return Promise.reject(err.message);
    }
}


//  Editing Existing Table

async function editTable(req, res, id) {

    console.log(id, "ID");
    console.log(req.body, "BODY");


    let fieldsData = [];
    let newfieldsData = [];
    let constraint = '';

    let newData = {};
    let columnQuery = '';
    let deleteColumn = '';
    let changed = false;


    req.body.forEach((item, index) => {
        for (var key in item) {
            if (key == 'tablename' || key == 'Description') {
                newData = {
                    tablename: escape(item.tablename),
                    Description: item.Description
                }
            } else {
                if (key == 'deletefield') {
                    deleteColumn = deleteColumn + 'DROP COLUMN' + ' ' + '"' + escape(item.deletefield) + '"' + ','
                }
            }
        }
    })


    req.body.forEach((item, index) => {

        let data = {};
        let newdata = {};

        for (var key in item) {
            if (key == 'fieldname' || key == 'label' || key == 'fieldtype' || key == 'konstraint') {

                data[key] = item[key]

            } else if (key == 'newfieldname' || key == 'newlabel' || key == 'newfieldtype' || key == 'newkonstraint') {

                newdata[key] = item[key];

            }
        }
        if (Object.keys(data).length != 0)
            fieldsData.push(data);

        if (Object.keys(newdata).length != 0)
            newfieldsData.push(newdata);
    })


    newfieldsData.forEach((item) => {
        if (item.newkonstraint) {
            // columnQuery = columnQuery + 'ADD COLUMN' + ' ' + '"' + escape(item.newfieldname) + '"' + ' ' +
            // item.newfieldtype + ' ' + 'PRIMARY KEY' + ' ' + ','
            columnQuery = columnQuery + 'ADD COLUMN' + ' ' + '"' + escape(item.newfieldname) + '"' + ' ' +
                item.newfieldtype + ','

            constraint = constraint + ' ' + '"' + escape(item.newfieldname) + '"' + ','

        } else {
            columnQuery = columnQuery + 'ADD COLUMN' + ' ' + '"' + escape(item.newfieldname) + '"' + ' ' + item.newfieldtype + ','
        }
        for (var key in item) {
            if (key == 'newfieldname' || key == 'newlabel' || key == 'newfieldtype' || key == 'newkonstraint') {

                data = {
                    fieldname: escape(item.newfieldname),
                    label: item.newlabel,
                    fieldtype: item.newfieldtype,
                    konstraint: item.newkonstraint
                }
            }
        }
        if (Object.keys(data).length != 0)
            fieldsData.push(data);

    })

    fieldsData.forEach((field) => {
        field.tableid = id;
    })

    constraint = constraint.replace(/(^[,\s]+)|([,\s]+$)/g, '')
    columnQuery = columnQuery.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    deleteColumn = deleteColumn.replace(/(^[,\s]+)|([,\s]+$)/g, '');

    console.log(deleteColumn, " COLUMN DELETE ");
    console.log(columnQuery, "columnQuery");
    console.log(fieldsData, "Fields data");
    console.log(newData, " Table description ");
    console.log(constraint, "CONSTRAINTS");

    let updateMastertableQuery = squel
        .update()
        .table('mastertable')
        .set('tablename', newData.tablename)
        .set('"Description"', newData.Description)
        .where('id=?', id)
        .toString();

    // console.log(updateMastertableQuery, "*")

    let deleteOldDataQuery = squel
        .delete()
        .from("fieldstable")
        .where("tableid= ? ", id)
        .where("fieldname <>  ?", 'uid')
        .toString();

    // console.log(deleteOldDataQuery, "**");

    // console.log(fieldsData, "++++++")


    let fieldstableQuery = squel
        .insert()
        .into("fieldstable")
        .setFieldsRows(fieldsData)
        .toString();

    console.log(fieldstableQuery, "***");

    try {
        // console.log("TRY", id)
        let response = await TableData(id);
        // console.log("RESPONSE");
        // console.log(response)


        let tablename = escape(response[0].tablename);
        let description = response[0].Description;

        console.log(tablename, description, "===")
        // console.log(columnQuery, "COLUMNQUERY");

        let mastertableResult;
        let fieldstableResult;

        if (tablename != newData.tablename) {
            let query = `ALTER TABLE "${tablename}"  RENAME TO "${newData.tablename}";`
            // console.log(query);
            let tableResult = await queryExecute(query);
            mastertableResult = await queryExecute(updateMastertableQuery);
            changed = true;
        }

        if (description != newData.Description) {
            // console.log(description, "in")
            mastertableResult = await queryExecute(updateMastertableQuery);
            changed = true;
        }

        if (deleteColumn) {
            let deleteColumnQuery = `ALTER TABLE "${newData.tablename}" ${deleteColumn};`
            console.log(deleteColumnQuery, "deletecolumnQuery");
            deleteColumnResult = await queryExecute(deleteColumnQuery);
            let deleteResult = await queryExecute(deleteOldDataQuery);
            fieldstableResult = await queryExecute(fieldstableQuery);

            changed = true;
        }

        if (columnQuery) {

            let alterColumnQuery = `ALTER TABLE "${newData.tablename}" ${columnQuery} ;`
            console.log(alterColumnQuery, "QUERY");
            let columnResult = await queryExecute(alterColumnQuery);

            if (constraint) {
                let constraintQuery = `ALTER TABLE "${newData.tablename}" ADD PRIMARY KEY (${constraint});`
                console.log(constraintQuery, "QURRYYYYYYYYYYYY")
                let constraintResult = await queryExecute(constraintQuery);
            }

            let deleteResult = await queryExecute(deleteOldDataQuery);
            fieldstableResult = await queryExecute(fieldstableQuery);

            changed = true;
        }

        return changed;

    } catch (err) {
        console.log(err, "1234");
        return Promise.reject(err.message);
    }
}


async function checkTablename(req, res) {

    let query = squel
        .select()
        .from("mastertable")
        .field("tablename")
        .toString();
    let check = true;

    try {
        let response = await queryExecute(query);

        response.rows.forEach((item, index) => {
            if (item.tablename === req.body.tablename) {
                check = false;
                return check;
            }
        });
        return check;

    } catch (err) {
        console.log(err);
        return Promise.reject(err)
    }

}


module.exports = {
    CreateTable: CreateTable,
    viewTable: viewTable,
    deleteTable: deleteTable,
    modifyTable: modifyTable,
    TableData: TableData,
    editTable: editTable,
    checkTablename: checkTablename
}





























// fieldsData.push({
//     fieldname: 'uid',
//     fieldtype: 'serial',
//     constraint: false
// })

// fieldsData.forEach((field) => {
//     field.tableid = id
// });

//  let fieldstableQuery = squel
//     .select()
//     .from('fieldstable')
//     .field('fieldname')
//     .where('tableid=?', id)
//     .toString();

// let deleteFieldQuery = squel
//     .delete()
//     .from('fieldstable')
//     .where('tableid=?', id)
//     .toString();

// // console.log(updateTableQuery, "11");
// // console.log(deleteFieldQuery, "22");
// // console.log(insertFieldQuery, "33");

// try {
//     let oldData = await TableData(id);
//     let tablenameQuery = `ALTER TABLE IF EXISTS ${oldData.tablename} RENAME TO ${newData.tablename}`

//     let columnQuery = ``

//     let resp = await queryExecute(updateTableQuery);
//     let resp1 = await queryExecute(deleteFieldQuery)
//     let resp2 = await queryExecute(insertFieldQuery);

//     // console.log(resp,"0000");
//     // console.log(resp1,"111");
//     // console.log(resp2,"222");


//     // return resp2;

// } catch (err) {
//     return Promise.reject(err);
// }