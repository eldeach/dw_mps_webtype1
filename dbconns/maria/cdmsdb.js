const mariadb = require('mariadb');
const { resolve } = require('path');

// Connection 정보 정의
const pool = mariadb.createPool({
     host: process.env.CDMS_DB_HOST,
     port: process.env.CDMS_DB_PORT,
     user: process.env.CDMS_DB_USER, 
     password: process.env.CDMS_DB_PW,
     connectionLimit: 5
});

// DB Connection 객체 생성 함수
async function getConn(dbName=process.env.CDMS_DB_NAME){
  const conn = await pool.getConnection();
  conn.query('USE ' + dbName);
  return conn;
}

// 이하는 커스텀 함수들
function commaJoin(cols){
  if (cols.length === 1){
    return cols;
  }
  else {
    return cols.join(', ');
  }
};

async function sendQry_toCdms(str){
  let conn;
  try{
    conn = await getConn();
    const rows = await conn.query(str);
    return rows;
  } catch (err) {
    console.log(err)
  } finally {
    conn.release();
    conn.end()
  }
};

function selectQry_toCdms(materials){
  // materials : {
  //   cols : [배열],
  //   tblName : "테이블 명칭",
  //   whereClause : "조건식"
  // }
  let str = "";
  if (materials.whereClause.length > 0) {
    str = "SELECT ".concat(commaJoin(materials.cols)).concat(' FROM ' ).concat(materials.tblName).concat(' WHERE ').concat(materials.whereClause)
  } else {
    str = "SELECT ".concat(commaJoin(materials.cols)).concat(' FROM ' ).concat(materials.tblName);
  }
  return str;
};

function insertQry_toCdms(materials){
  // materials : {
  //   cols : [배열],
  //   tblName : "테이블 명칭",
  //   values : [배열]
  // }
  let str
  let valueLength = materials.cols.length
  if (valueLength > 1){
    str = "INSERT INTO ".concat(materials.tblName).concat("(").concat(commaJoin(materials.cols)).concat(') VALUES (' ).concat(commaJoin(materials.values).concat(")"));
  } else {
    str = "INSERT INTO ".concat(materials.tblName).concat("(").concat(materials.cols[0]).concat(') VALUES (' ).concat(materials.values[0]).concat(")");
  }
  return str;
};

function updateQry_toCdms (materials){
  // materials : {
  //   cols : [배열],
  //   tblName : "테이블 명칭",
  //   values : [배열]
  //   whereClause : "조건식"
  // }
  let setArr=[];
  materials.cols.map((col, index)=>{
    setArr.push (col.concat(" = ").concat(materials.values[index]))
  });

  let str = "UPDATE ".concat(materials.tblName).concat(" SET ".concat(commaJoin(setArr))).concat(" WHERE ").concat(materials.whereClause)
  
  console.log(str)

  return str;
}

  module.exports={sendQry_toCdms, selectQry_toCdms, insertQry_toCdms, updateQry_toCdms }