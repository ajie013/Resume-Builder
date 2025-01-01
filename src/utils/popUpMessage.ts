import Swal, { SweetAlertResult } from 'sweetalert2';

type iconType = 'success' | 'error' | 'warning' | 'info' | 'question';


function popUpMessageToast(icon: iconType, title: string): void {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        width: "auto",
        showConfirmButton: false,
        timer: 1500,
    });

    Toast.fire({
        icon: icon,
        title: title
    });
}


function popUpMessage(message: string, icon: iconType): Promise<SweetAlertResult> {
    return Swal.fire({
        text: message,
        icon: icon,
        showConfirmButton: false,
        timer: 1500,
    });
}

export { popUpMessageToast, popUpMessage };