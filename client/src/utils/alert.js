import Swal from 'sweetalert2';

// Standard success toast used for short non-blocking confirmations.
export const toastSuccess = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 3000,
        showConfirmButton: false
    });
};

// Standard error modal/toast for failed actions.
export const toastError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
};

// Informational toast for neutral updates.
export const toastInfo = (message) => {
    Swal.fire({
        icon: 'info',
        text: message,
        timer: 3000,
        showConfirmButton: false,
        iconColor: '#d69c30'
    });
};

// Reusable confirmation dialog; returns true only when user confirms.
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
