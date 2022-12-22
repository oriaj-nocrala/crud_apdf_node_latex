const express = require('express');
const app = express();
const latex = require('node-latex');
const fs = require('fs');
const mysql = require('mysql');
const { query } = require('express');

app.get('/', async (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'animal'
  });

  connection.connect();
  data = '\\documentclass{article}\n';
  data += '\\usepackage[utf8]{inputenc}\n';
  data += '\\usepackage[spanish]{babel}\n';
  data += '\\usepackage{tabularx}\n';
  data += '\\usepackage{geometry}\n';
  data += '\\geometry{left=2cm,right=2cm,top=2cm,bottom=2cm,}\n';
  data += '\\begin{document}\n'
  const query1= () => {
    return new Promise((resolve, reject) => {
      connection.query(`select id, nombre, edad, patas,
      case when venenoso = 0 then 'No'
           when venenoso = 1 then 'Sí'
      end as venenoso
  from cienpies;`, (err, rows, fields) => {
        if (err) throw err;
        data += '\\begin{table}[h]\n';
        data += '\\centering\n';
        data += '\\caption{Tabla de cienpies}\n';
        data += '\\hspace{0.5cm}\n';
        data += '\\begin{tabularx}{\\linewidth}{';
        for (let i = 0; i < fields.length; i++) {
          data += 'c';
          if(i == fields.length - 1) data += '}\n';
        }
        for (let i = 0; i < fields.length; i++) {
          if(i < fields.length - 1)
            data += `${fields[i].name} & `;
          else if(i == fields.length - 1)
            data += `${fields[i].name} \\\\ \\hline\n`;
          if(i == fields.length - 1) data += '\\\\\n';
        }
        for (let i = 0; i < rows.length; i++) {
          for (let j = 0; j < fields.length; j++) {
            if(j < fields.length - 1)
              data += `${rows[i][fields[j].name]} & `;
            else if(j == fields.length - 1)
              data += `${rows[i][fields[j].name]} \\\\ \\hline\n`;
            if(j == fields.length - 1) data += '\\\\\n';
          }
        }
        data += '\\end{tabularx}\n';
        data += '\\end{table}\n';
        data += '\\hfill\n'
        resolve();
      });
    });
  }
   const query2= () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM lombriz', (err, rows, fields) => {
        if (err) throw err;
        data += '\\begin{table}[h]\n';
        data += '\\centering\n';
        data += '\\caption{Tabla de lombrices}\n';
        data += '\\hspace{0.5cm}\n';
        data += '\\begin{tabularx}{\\linewidth}{';
        for (let i = 0; i < fields.length; i++) {
          data += 'c';
          if(i == fields.length - 1) data += '}\n';
        }
        for (let i = 0; i < fields.length; i++) {
          if(i < fields.length - 1)
            data += `${fields[i].name} & `;
          else if(i == fields.length - 1)
            data += `${fields[i].name} \\\\ \\hline\n`;
          if(i == fields.length - 1) data += '\\\\\n';
        }
        for (let i = 0; i < rows.length; i++) {
          for (let j = 0; j < fields.length; j++) {
            if(j < fields.length - 1)
              data += `${rows[i][fields[j].name]} & `;
            else if(j == fields.length - 1)
              data += `${rows[i][fields[j].name]} \\\\ \\hline\n`;
            if(j == fields.length - 1) data += '\\\\\n';
          }
        }
        data += '\\end{tabularx}\n';
        data += '\\end{table}\n';
        resolve();
      });
    });
  }
  query1()
  .then(query2)
  .then(() => {
    data += '\\end{document}\n';
    console.log(data);
    const pdf = latex(data);
    pdf.pipe(res);
    connection.end();
  })
  .catch(err => console.log(err));
});

app.listen(3000, () => console.log('Listening on port 3000!'));