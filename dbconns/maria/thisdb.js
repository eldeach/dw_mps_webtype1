const mariadb = require('mariadb');
const { resolve } = require('path');

// Connection 정보 정의
const pool = mariadb.createPool({
     host: process.env.THISDB_HOST,
     port: process.env.THISDB_PORT,
     user: process.env.THISDB_USER, 
     password: process.env.THISDB_PW,
     connectionLimit: 5
});

// DB Connection 객체 생성 함수
async function getConn(dbName=process.env.THISDB_NAME){
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

async function sendQry(str){
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

function selectQry(materials){
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

function insertQry (materials){
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

function updateQry (materials){
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


  async function batchInsertFunc (targetTable, columNamesArr, questions, valueArrys, truncTbl) {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query('USE ' + process.env.THISDB_NAME);
      if (truncTbl){
        conn.query("SET FOREIGN_KEY_CHECKS = 0;")
        conn.query("TRUNCATE " + targetTable + ";")
        conn.query("SET FOREIGN_KEY_CHECKS = 1;")
      }
      const rows = await conn.batch("INSERT INTO " + targetTable + " ("+columNamesArr.join(', ')+") VALUES("+questions.join(', ')+")", valueArrys)
      return rows
    } catch (err) {
      console.log(err)
    } finally {
      if (conn) conn.end();
    }
  }

  async function batchInsertOnDupliFunc (targetTable, columNamesArr, questions, valueArrys,dupStrArry) {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query('USE ' + process.env.THISDB_NAME);
      const rows = await conn.batch("INSERT INTO " + targetTable + " ("+columNamesArr.join(', ')+") VALUES("+questions.join(', ')+") ON DUPLICATE KEY UPDATE "+dupStrArry.join(","), valueArrys)
      return rows
    } catch (err) {
      console.log(err)
    } finally {
      if (conn) conn.end();
    }
  }

  async function truncateTable(truncTable){
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query('USE ' + process.env.THISDB_NAME);
      const setFKfalse = await conn.query("SET FOREIGN_KEY_CHECKS = 0;")
      const truncTbl = await conn.query("TRUNCATE " + truncTable + ";")
      const setFKtrue = await conn.query("SET FOREIGN_KEY_CHECKS = 1;")

      // return rows
    } catch (err) {
      console.log(err)
    } finally {
      if (conn) conn.end();
    }
  }

  async function whereClause(targetTable,searchKeyWord){
    let columnList=await strFunc("SHOW COLUMNS FROM "+targetTable)
    let whereList = []
    let clause=""
    if(searchKeyWord.length>0){
      columnList.map((oneColumn)=>{
        let tempStr
        if (oneColumn.Field =="uuid_binary"){
          tempStr= oneColumn.Field + " = UUID_TO_BIN('" + searchKeyWord +"')"
          whereList.push("("+tempStr+")")
        }
        else if(oneColumn.Field =="user_pw"){}
        else if(oneColumn.Field =="insert_by"){}
        else if(oneColumn.Field =="update_by"){}
        else {
          tempStr = oneColumn.Field + " like '%" + searchKeyWord + "%'"
          whereList.push("("+tempStr+")")
        }
        
      })
      clause="WHERE "+whereList.join(" OR ")
    }
    return clause
}

  module.exports={sendQry, selectQry, insertQry, updateQry, batchInsertFunc, batchInsertOnDupliFunc, whereClause, truncateTable}