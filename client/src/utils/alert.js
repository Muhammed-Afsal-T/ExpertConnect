import Swal from 'sweetalert2';

export const toastSuccess = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 3000,
        showConfirmButton: false
    });
};

export const toastError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
};

export const toastInfo = (message) => {
    Swal.fire({
        icon: 'info',
        text: message,
        timer: 3000,
        showConfirmButton: false,
        iconColor: '#d69c30'
    });
};

export const confirmAction = async (title, text) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
    });
    return result.isConfirmed;
};