import {Dropzone} from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagenDrop = {
    dictDefaultMessage:'Sube tus imagenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    //autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es un archivo',
    headers:{
        'CSRF-Token': token
    }
}