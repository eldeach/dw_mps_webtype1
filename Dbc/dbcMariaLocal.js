const mariadb = require('mariadb');

// Connection 정보 정의
const pool = mariadb.createPool({
  host: process.env.MARIA_DB_LOCAL_SERVER,
  port: process.env.MARIA_DB_LOCAL_SERVER_PORT,
  database: process.env.MARIA_DB_LOCAL_DBNAME,
  user: process.env.MARIA_DB_LOCAL_USER,
  password: process.env.MARIA_DB_LOCAL_PW,
  connectionLimit: 5
});

// Query 전송
async function sendQry(str) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(str);
    return rows;
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error occur ↓↓↓↓↓>\n\n"${str}". `, err)
  } finally {
    if (conn) {
      conn.release();
      conn.end()
    }
  }
};

async function sendReq(prm) {
  let conn;
  let rs =[];
  let ov = {};
  try {
    conn = await pool.getConnection();

    let pInputStr = []
    prm.pInput.map((value, index) => {
      if ((typeof value.value) == 'number') {
        pInputStr.push(`@${value.name}:=${value.value}`)
      }
      else {
        pInputStr.push(`@${value.name}:='${value.value}'`)
      }
    })

    let pOutputStr = []
    prm.pOutput.map((value, index) => {
      pOutputStr.push(`@${value.name}`)
    })

    let inputEnd=',';
    if (pInputStr.length > 0) {
      inputEnd = ','
    } else {
      inputEnd = ''
    }
    rs = await conn.query(`CALL ${prm.procedure}(${pInputStr.join()}${inputEnd} ${pOutputStr.join()})`)
    let out = await conn.query(`SELECT ${pOutputStr.join()}`)
    pOutputStr.map((value, index) => {
      ov[`${value.replace('@', '')}`] = out[0][value]
    })
    if(rs[0]) rs.pop()
    else rs=[]
    return {output : ov, recordsets : rs}; // MS SQL 라이브러리와 동일 사용 패턴을 구현하기 위함, result를 바로 return 하는 것도 가능함
  } catch (err) {
    return err
  } finally {
    if (conn) {
      conn.release();
      conn.end()
    }
  }
};


module.exports = { sendQry, sendReq }