// ======================================================================================== [dotenv 환경변수 등록]
require('dotenv').config({ path : './secrets/.env'})

// ======================================================================================== [Import Libaray]
// express
const express = require('express');

// path : react로 route를 넘기기 위한 라이브러리
const path = require('path');


// bodyParser
const bodyParser= require('body-parser')

//connect-flash : passport에서 문제 발생 시 flash 메시지를 사용하기 위한 flash 라이브러리
const flash= require('connect-flash')

// axios AJAX
const { default: axios } = require('axios');

// express-sanitizers : https 관련 라이브러리
const expressSanitizer = require("express-sanitizer");

// https
const https = require("https");
const fs = require("fs");

// SSL
const options = {
  key: fs.readFileSync("./secrets/cert.key"),
  cert: fs.readFileSync("./secrets/cert.crt"),
};


// OS 타입 확인 - 아직 사용할 일 없음
// const { type } = require('os');

// JWT - 아직 사용 할 일 없음
// const jwt = require("jsonwebtoken");


// ======================================================================================== [Server Initialize] 객체 생성 및 미들웨어 적용, 서버 listen 함수 실행
// express 객체 생성
const app = express();

// 서버 미들웨어 적용
app.use( express.json({ limit: '10mb' }) )
app.use( bodyParser.urlencoded({ extended: true }) ) 
app.use( express.urlencoded({limit: '10mb', extended: true }))
app.use( flash() )
app.use( express.static(path.join(__dirname, process.env.react_build_path )));

// https 미들웨어
app.use(expressSanitizer());
app.use("/", express.static("public"));

const {scdRunAll} = require('./Scheduler/scdScheduler')

// 포트 정의
// app.listen( process.env.httpPORT, async function() {
//   scdRunAll()
//   console.log('listening on '+ process.env.httpPORT)
// })

// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer(options, app).listen(process.env.httpPORT, async () => {
  scdRunAll()
  console.log('HTTPS server started on port ' + process.env.httpPORT)
});


// ======================================================================================== [Import Component] js
// Function
const passportLocal = require('./Passport/LocalStrategy/passportLocal');
passportLocal(app);

// bone_system

const withdrawElecSign = require('./bone_system/put/elecSign/withdrawElecSign');
withdrawElecSign(app)

const elecSign = require('./bone_system/put/elecSign/elecSign');
elecSign(app)

const getCdmsDocList = require('./CRUD/get/AVM/getCdmsDocList/getCdmsDocList')
getCdmsDocList(app)


// get/System/User
// const userList = require('./CRUD/get/System/User/getUserList');
// userList(app)
const getUserListApproved = require('./CRUD/get/System/User/getUserListApproved');
getUserListApproved(app)
const getUserListPrepared = require('./CRUD/get/System/User/getUserListPrepared');
getUserListPrepared(app)
const getUserListRejected = require('./CRUD/get/System/User/getUserListRejected');
getUserListRejected(app)
const getUserListUnderApproved = require('./CRUD/get/System/User/getUserListUnderApproved');
getUserListUnderApproved(app)
const getUserListVoid = require('./CRUD/get/System/User/getUserListVoid');
getUserListVoid(app)

const getAuthList = require('./CRUD/get/System/User/getAuthList');
getAuthList(app)
// get/System/Approval
const myPrepared = require('./CRUD/get/System/Approval/myPrepared');
myPrepared(app)
const myReviewList = require('./CRUD/get/System/Approval/myReviewList');
myReviewList(app)
const approvalUserList = require('./CRUD/get/System/Approval/approvalUserList');
approvalUserList(app)

// get/AVM/Machine
const getMachineListApproved = require('./CRUD/get/AVM/Machine/getMachineList/getMachineListApproved')
getMachineListApproved(app)
const getMachineListPrepared = require('./CRUD/get/AVM/Machine/getMachineList/getMachineListPrepared')
getMachineListPrepared(app)
const getMachineListRejected = require('./CRUD/get/AVM/Machine/getMachineList/getMachineListRejected')
getMachineListRejected(app)
const getMachineListUnderApproved = require('./CRUD/get/AVM/Machine/getMachineList/getMachineListUnderApproved')
getMachineListUnderApproved(app)
const getMachineListVoid = require('./CRUD/get/AVM/Machine/getMachineList/getMachineListVoid')
getMachineListVoid(app)

const getEqPrm = require('./CRUD/get/AVM/Machine/getEqPrm/getEqPrm')
getEqPrm(app)
const getPrmDocs = require('./CRUD/get/AVM/Machine/getPrmDocs/getPrmDocs')
getPrmDocs(app)

// get/AVM/Mapping
const getreMap1year = require('./CRUD/get/AVM/Mapping/getReMap1year/getReMap1year')
getreMap1year(app)
const getReMap3year = require('./CRUD/get/AVM/Mapping/getReMap3year/getReMap3year')
getReMap3year(app)
const getReMap3YearSeason = require('./CRUD/get/AVM/Mapping/getReMap3YearSeason/getReMap3YearSeason')
getReMap3YearSeason(app)

// get/AVM/Qual
const getrequal1year = require('./CRUD/get/AVM/Qual/getrequal1year/getrequal1year')
getrequal1year(app)
const getrequal5year = require('./CRUD/get/AVM/Qual/getrequal5year/getrequal5year')
getrequal5year(app)
const getrequalSter = require('./CRUD/get/AVM/Qual/getrequalSter/getrequalSter')
getrequalSter(app)
const getrequalVHP = require('./CRUD/get/AVM/Qual/getrequalVHP/getrequalVHP')
getrequalVHP(app)

const getPrReview = require('./CRUD/get/AVM/Qual/getPrReview/getPrReview')
getPrReview(app)

// get/AVM/CV
const getPrCv = require('./CRUD/get/AVM/Machine/getPrCv/getPrCv')
getPrCv(app)

// get/AVM/Product
// const getProductList = require('./CRUD/get/AVM/Product/getProductList/getProductList')
// getProductList(app)
const getProductListApproved = require('./CRUD/get/AVM/Product/getProductList/getProductListApproved')
getProductListApproved(app)
const getProductListPrepared = require('./CRUD/get/AVM/Product/getProductList/getProductListPrepared')
getProductListPrepared(app)
const getProductListRejected = require('./CRUD/get/AVM/Product/getProductList/getProductListRejected')
getProductListRejected(app)
const getProductListUnderApproved = require('./CRUD/get/AVM/Product/getProductList/getProductListUnderApproved')
getProductListUnderApproved(app)
const getProductListVoid = require('./CRUD/get/AVM/Product/getProductList/getProductListVoid')
getProductListVoid(app)

const getPrPV = require('./CRUD/get/AVM/Product/getPrPV/getPrPV')
getPrPV(app)

// post/AVM/
const addMachine = require('./CRUD/post/AVM/addMachine/addMachine')
addMachine(app)
const addProduct = require('./CRUD/post/AVM/addProduct/addProduct')
addProduct(app)

// post/System
const addAccount = require('./CRUD/post/System/addAccount/addAccount');
addAccount(app)


// Mailing
const mailingList = require('./Mailing/mailingList');
mailingList(app)


// Middleware Function
const mwAuthCheck = require ( './Passport/LocalStrategy/handleSessionFunc/middleware/mwAuthCheck' );

//================================================================================ [공통 기능] 모든 route를 react SPA로 연결 (이 코드는 맨 아래 있어야함)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/viewrequal', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/viewmt', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/viewprm', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/viewcv', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/viewpv', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/noauth', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/sessionexpired', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/local-logout', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});

app.get('/sessioncheck', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});


app.get('*', mwAuthCheck, function (req, res) {
  res.sendFile(path.join(__dirname, process.env.react_build_path+'index.html'));
});
