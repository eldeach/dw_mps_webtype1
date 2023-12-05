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

// express-sanitizers - 아직 사용 할 일 없음
//const expressSanitizer = require("express-sanitizer");

// https - 아직 사용 할 일 없음
//const https = require("https");
//const fs = require("fs");

// SSL - 아직 사용 할 일 없음
//const options = {
//  key: fs.readFileSync("./secrets/cert.key"),
//  cert: fs.readFileSync("./secrets/cert.crt"),
//};

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

// https
//app.use( express.urlencoded({ extended: true }) ); // 중복인가...?
//app.use( expressSanitizer() );
//app.use( "/", express.static("public") );

// 포트 정의
app.listen( 8080, function() {
  console.log('listening on '+ 8080)
})

// https 의존성으로 certificate와 private key로 새로운 서버를 시작
// https.createServer( options, app ).listen( process.env.PORT, () => {
  //   console.log( 'HTTPS server started on port '+ process.env.PORT )
  // });
  

// ======================================================================================== [Import Component] js
// Function
const {sendQry, selectQry, insertQry, updateQry, batchInsertFunc, batchInsertOnDupliFunc, whereClause, truncateTable} = require ('./dbconns/maria/thisdb');
const passportLocal = require('./Passport/LocalStrategy/passportLocal');
passportLocal(app);

// bone_system
const getAuthList = require('./bone_system/get/getAuthList');
getAuthList(app)

const myPrepared = require('./bone_system/get/myPrepared');
myPrepared(app)

const myReviewList = require('./bone_system/get/myReviewList');
myReviewList(app)

// Sys1
const userList = require('./bone_system/get/getUserList');
userList(app)

const approvalUserList = require('./bone_system/get/approvalUserList');
approvalUserList(app)

const addAccount = require('./sys1/post/addAccount/addAccount');
addAccount(app)


const withdrawElecSign = require('./bone_system/put/elecSign/withdrawElecSign');
withdrawElecSign(app)

const elecSign = require('./bone_system/put/elecSign/elecSign');
elecSign(app)

// Middleware Function
const mwAuthCheck = require ( './Passport/LocalStrategy/handleSessionFunc/middleware/mwAuthCheck' );

//================================================================================ [공통 기능] 모든 route를 react SPA로 연결 (이 코드는 맨 아래 있어야함)
app.get('/', function (req, res) {
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
