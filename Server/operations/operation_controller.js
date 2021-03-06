const repository = require('./operation_repository')

async function view(req, res) {
    const id = parseInt(req.params.id, 10);
    // console.log(id);

    try {
        var data = await repository.view(req, res, id)
        res.status(200).json(data.rows)

    } catch (err) {
        res.status(400).json(err);
    }
}

async function addDataToTable(req, res) {
    const id = parseInt(req.params.id, 10);
    try {
        let data = await repository.addDataToTable(req, res, id);
        res.status(200).json(data)

    } catch (err) {
        res.status(400).json(err);
    }
}

async function TableData(req, res) {
    const id = parseInt(req.params.id, 10);

    try {
        var data = await repository.TableData(req, res, id)
        res.status(200).json(data)

    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteData(req, res) {
    const tableid = parseInt(req.params.tableid, 10);
    const rowid = parseInt(req.params.rowid, 10);


    try {
        var data = await repository.deleteData(tableid, rowid)
        res.status(200).json(data.rows)

    } catch (err) {
        res.status(400).json(err);
    }
}

async function getdetails(req, res) {
    const tableid = parseInt(req.params.tableid, 10);
    const rowid = parseInt(req.params.uid, 10);

    try {
        var data = await repository.getdetails(tableid, rowid);
        res.status(200).json(data.rows)

    } catch (err) {
        res.status(400).json(err);
    }
}

async function updateRow(req, res) {

    const tableid = parseInt(req.params.id, 10);

    try {
        let data = await repository.updateRow(req, res, tableid);
        res.status(200).json(data)

    } catch (err) {
        res.status(400).json(err);
    }
}
async function fetchDropdownList(req, res) {

    const tableid = parseInt(req.params.id, 10);

    try {
        let data = await repository.fetchDropdownList(req, res, tableid);
        res.status(200).json(data)

    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    view: view,
    addDataToTable: addDataToTable,
    TableData: TableData,
    deleteData: deleteData,
    getdetails: getdetails,
    updateRow: updateRow,
    fetchDropdownList: fetchDropdownList
}