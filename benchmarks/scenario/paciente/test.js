const fs = require('fs');

Paciente = require('./utils/PacienteData.js'); 

paciente = new Paciente();

console.log(paciente.patientData);

function extractValuesObjectAnidated(obj) {
    let result = [];

    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
        // If the value is an object, we recursively call extractValuesObjectAnidated
        let nestedObj = extractValuesObjectAnidated(obj[key]);
        result = result.concat([nestedObj]);
        } else {
        // If the value is not an object, we add it to the result
        result.push(obj[key]);
        }
    }

    return result;
};
tuplePaciente = extractValuesObjectAnidated(paciente.patientData);
console.log(tuplePaciente);

fs.writeFile('./tuplePaciente2.txt', JSON.stringify(tuplePaciente), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
