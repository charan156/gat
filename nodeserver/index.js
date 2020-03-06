import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from 'body-parser';
// Set up the express app
const app = express(); 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/metadata', { useNewUrlParser: true});
var db = mongoose.connection;
var met = db.collection('meta'); 
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully") 

app.use( cors(), 
        bodyParser.json(),
        )
app.use('/pdf', express.static(__dirname + '/pdf'));

app.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: ' successful'
  })
});

app.get('/allDocuments/', (req, res) => {
    met.find( {} ).toArray(function (err, result) {
        if (err) throw err
        var files = [];
        //result = JSON.parse(JSON.stringify(result));
        //console.log(result[0].TI);
        result.forEach((f) => {
            files.push({
                'file_name': f['PDF'],
                'pdf_path': "http://localhost:5000/pdf/"+f['YR']+"/"+f['PDF'],
                'union': f['UNION'],
                'case_no': f['NO'],
                'grievor': f['TI'],
                'employer': f['EMPLOYER'],
                'date_issued': f['IDT'],
                'jr_path': "http://localhost:5000/pdf/judicial_review/"+f['JRPDF'],
                'judicial_review':f['JRPDF'],
                'cases_cited': f['CCLINK'],
                'year': f['YR'] 
           })
        });    
    res.send(files)
    })
});

app.get('/allDocuments/:id', (req, res) => {
    var id = req.params.id;
    //console.log(id);
    met.find( { '$text': { '$search': "\""+id+"\"" } }  ).toArray(function (err, result) {
        if (err) throw err
        var files = [];
        //result = JSON.parse(JSON.stringify(result));
        //console.log(result[0].TI);
        result.forEach((f) => {
            files.push({
                'file_name': f['PDF'],
                'pdf_path': "http://localhost:5000/pdf/"+f['YR']+"/"+f['PDF'],
                'union': f['UNION'],
                'case_no': f['NO'],
                'grievor': f['TI'],
                'employer': f['EMPLOYER'],
                'date_issued': f['IDT'],
                'jr_path': "http://localhost:5000/pdf/judicial_review/"+f['JRPDF'],
                'judicial_review':f['JRPDF'],
                'cases_cited': f['CCLINK'],
                'year': f['YR'] 
           })
        });    
    res.send(files)
    })
});

app.get('/documents/', (req, res) => {
    let case_no  = req.query.case_no;
    let grievor  = req.query.grievor;
    let employer  = req.query.employer;
    let board  = req.query.board;
    let chair  = req.query.chair;
    let hearingDate  = req.query.hearingDate;
    let issueDate  = req.query.issueDate;
    let union  = req.query.union;
    let dict1 = {};
    if ( case_no != "" )
        dict1['NO'] = case_no;
    if ( grievor != "" )
        dict1['TI'] = grievor;
    if ( employer != "" )
        dict1['EMPLOYER'] = employer;
    if ( board != "" )
        dict1['BOARD'] = board;
    if ( chair != "" )
        dict1['CH'] = chair;
    if ( hearingDate != "" )
        dict1['HDT'] = hearingDate;
    if ( issueDate != "" )
        dict1['IDT'] = issueDate;
    if ( union != "" )
        dict1['UNION'] = union; 
    //console.log(req.query);
    met.find( {'$and':[ dict1 ]}  ).toArray(function (err, result) {
        if (err) throw err
        var files = [];
        //result = JSON.parse(JSON.stringify(result));
        //console.log(result[0].TI);
        result.forEach((f) => {
            files.push({
                'file_name': f['PDF'],
                'pdf_path': "http://localhost:5000/pdf/"+f['YR']+"/"+f['PDF'],
                'union': f['UNION'],
                'case_no': f['NO'],
                'grievor': f['TI'],
                'employer': f['EMPLOYER'],
                'date_issued': f['IDT'],
                'jr_path': "http://localhost:5000/pdf/judicial_review/"+f['JRPDF'],
                'judicial_review':f['JRPDF'],
                'cases_cited': f['CCLINK'],
                'year': f['YR'] 
           })
        });    
    res.send(files)
    })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});