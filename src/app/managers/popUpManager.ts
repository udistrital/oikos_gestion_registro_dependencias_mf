import { Injectable } from '@angular/core';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class PopUpManager {
    constructor(
    ) { }
    showSuccessAlert(text: string) {
        Swal.fire({
            icon: 'success',
            title: 'Operación exitosa',
            text: text,
            confirmButtonText: 'Aceptar',
        });
    }
    showErrorAlert(text: string) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: text,
            confirmButtonText: 'Aceptar',
        });
    }
    showLoaderAlert(text: string){
        Swal.fire({
            title: text,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 2000,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
}