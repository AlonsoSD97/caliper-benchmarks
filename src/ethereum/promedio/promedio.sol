// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

contract promedios {
    struct Alumno {
        string name;
        int edad;
    }

    mapping(uint => Alumno) public alumnos;
    mapping(string => mapping(uint => Alumno)) public profesor;

    function actualizar_promedio (uint _index, Alumno memory _alumno ) public {
     alumnos[_index] = _alumno;
}


    function add_profesor(string memory _name, uint _index) public {
        profesor[_name][_index] = alumnos[_index];
    }
}
