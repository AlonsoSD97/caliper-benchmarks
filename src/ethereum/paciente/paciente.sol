// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.8;
struct Code {
    string code;
    string display;
    string system;
}

struct Coding {
    string code;
    string display;
    string definition;
}

struct patientData {
    code identidadDeGenero;
    code sexoBiologico;
    Code nacionalidad;
    struct Identifier {
        string use;
        struct Type {
            string paises;
            Coding coding;
        }
        string value;
    }
    Identifier identifier;
    struct NombreOficial {
        string use;
        struct Family {
            string segundoApellido;
        }
        string given;
    }
    NombreOficial NombreOficial;
    struct NombreSocial {
        string use;
        string given;
    }
    NombreSocial NombreSocial;
    struct Telecom {
        string system;
        string value;
        string use;
    }
    Telecom telecom;
    string birthDate;
    string address;
    struct Contact {
        string IdContacto;
        string relationship;
        struct Name {
            string use;
            struct Family {
                string segundoApellido;
            }
            string given;
        }
        Name name;
    }
    Contact contact;
    struct Communication {
        struct Lenguage {
            Coding coding;
        }
    }
    Communication communication;
    struct GeneralPractitioner {
        string id;
        string reference;
        string display;
    }
    GeneralPractitioner generalPractitioner;
}

contract paciente {
    patientData[] public pacientes;
    mapping(adress => patientData) public patientDataToAddress;
    function updaptedPatientData(patientData calldata _patientData) public {
        patientDataToAddress[msg.sender] = _patientData;
    }
}
    
        