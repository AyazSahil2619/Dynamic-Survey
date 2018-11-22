const squel = require('squel');
const runQuery = require('../pgConnection');


async function queryExecute(query) {

    try {
        let res = await runQuery.pool.query(query);
        return res;

    } catch (err) {
        return Promise.reject(err)
    }

}
async function view(req, res, id) {

    let query = squel
        .select()
        .from("fieldstable")
        .where("tableid =?", id)
        .toString();

    try {
        let resp = await queryExecute(query);
        if (resp.rowCount > 0)
            return resp;
        else {
            return Promise.reject({
                err: "Data not found"
            });
        }
    } catch (err) {
        return Promise.reject(err.message);
    }
}

async function addDataToTable(req, res, id) {

    console.log(req.body,"INSIDE ADDDING DATA TO TABLE")

    let body = [req.body];
    let colquery = '';
    let values = '';

    let query = squel
        .select()
        .from("fieldstable")
        .field("fieldname")
        .where("tableid =?", id)
        .toString();

    let query1 = squel
        .select()
        .from("mastertable")
        .where("id =?", id)
        .toString();

    try {
        let res = await queryExecute(query)
        let res1 = await queryExecute(query1);

        res.rows.forEach((item, index) => {
            for (var key in item) {
                if (item[key] != 'uid') {
                    // colquery = colquery + item[key] + ',';
                    colquery = colquery + '"' + item[key] + '"' + ',';
                }
            }
        })

        body.forEach((item, index) => {
            for (var key in item) {
                values = values + `'` + item[key] + `'` + ',';
            }
        })


        colquery = colquery.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        values = values.replace(/(^[,\s]+)|([,\s]+$)/g, '');


        // let query2 = `INSERT INTO ${res1.rows[0].tablename} (${colquery}) VALUES (${values})`
        let query2 = `INSERT INTO "${res1.rows[0].tablename}" (${colquery}) VALUES (${values})`

        let res2 = await queryExecute(query2);

        if (res2.rowCount > 0) {
            return res2;
        } else {
            return Promise.reject(err);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}


async function TableData(req, res, id) {

    let newArray = [];

    let query = squel
        .select()
        .from("mastertable")
        .field("tablename")
        .where("id =?", id)
        .toString();

    try {
        let res = await queryExecute(query);

        let query1 = squel
            .select()
            .from(`"${res.rows[0].tablename}"`)
            .toString();
        let res1 = await queryExecute(query1);

        // console.log(res1.rows,"ooo")
        res1.rows.forEach((item) => {
            let datas = {};

            for (var key in item) {
                keys = unescape(key);
                datas[keys] = item[key];
            }
            newArray.push(datas);
        });

        // console.log(newArray, "aaa");
        return newArray;

    } catch (err) {
        console.log(err,"ERROR")
        return Promise.reject(err.message);
    }
}

async function deleteData(tableid, rowid) {

    let query = squel
        .select()
        .from("mastertable")
        .field("tablename")
        .where("id =?", tableid)
        .toString();

    try {
        let res = await queryExecute(query);

        let query1 = squel
            .delete()
            .from(`"${res.rows[0].tablename}"`)
            .where("uid= ? ", rowid)
            .toString();

        let res1 = await queryExecute(query1);

        return res1

    } catch (err) {
        return Promise.reject(err.message);
    }
}

async function getdetails(tableid, uid) {

    let query = squel
        .select()
        .from("mastertable")
        .field("tablename")
        .where("id =?", tableid)
        .toString();

    try {
        let res = await queryExecute(query);

        let query1 = squel
            .select()
            .from(`"${res.rows[0].tablename}"`)
            .where("uid= ? ", uid)
            .toString();

        let res1 = await queryExecute(query1);

        return res1;

    } catch (err) {
        return Promise.reject(err.message);
    }
}


async function updateRow(req, res, id) {

    let body = [req.body];
    let values = '';

    let query = squel
        .select()
        .from("mastertable")
        .field("tablename")
        .where("id =?", id)
        .toString();

    console.log(req.body,"qqq");

    try {
        let res = await queryExecute(query);

        body.forEach((item, index) => {
            for (var key in item) {
                if (key != 'uid') {
                    // values = values + key + `=` + `'` + item[key] + `'` + ',';
                    values = values + '"' + escape(key) + '"' + `=` + `'` + item[key] + `'` + ',';
                } else {
                    condition = key + `=` + `'` + item[key] + `'`
                }
            }
        })

        console.log(condition,"CONDITION");

        values = values.replace(/(^[,\s]+)|([,\s]+$)/g, '');

        console.log(values, "VALUES");

        // let query1 = `UPDATE ${res.rows[0].tablename} SET ${values} WHERE ${condition};`
        let query1 = `UPDATE "${res.rows[0].tablename}" SET ${values} WHERE ${condition};`

        let res1 = await queryExecute(query1);

        return res1;

    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    view: view,
    addDataToTable: addDataToTable,
    TableData: TableData,
    deleteData: deleteData,
    getdetails: getdetails,
    updateRow: updateRow
}