 const xhlsi = require('.');
 const keyData = {
     validFrom: new Date(Date.now()), 
     validTo: new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 1)),
     firstName: "Mäx",
     secondName: "Mstermen",
     rooms: ["01", "101"],
     commonDoors:["10","12"]}
 console.log('Create key test: ', xhlsi.CreateKey(keyData).toString())
 console.log('Duplicate key test: ', xhlsi.DuplicateKey(keyData).toString())
