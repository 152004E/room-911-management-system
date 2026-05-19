import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const showAlert = {
  success: (title: string, text: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      background: '#152031',
      color: '#ffffff',
      confirmButtonColor: '#2563EB',
      iconColor: '#10FB72',
      customClass: {
        popup: 'border border-white/10 !rounded-room',
        title: '!text-lg !font-black !uppercase !text-white',
        htmlContainer: '!text-sm !text-white/70'
      }
    });
  },
  error: (title: string, text: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      background: '#152031',
      color: '#ffffff',
      confirmButtonColor: '#2563EB',
      iconColor: '#FF3131',
      customClass: {
        popup: 'border border-white/10 !rounded-room',
        title: '!text-lg !font-black !uppercase !text-white',
        htmlContainer: '!text-sm !text-white/70'
      }
    });
  },
  confirm: (title: string, text: string, confirmButtonText: string = 'Confirmar') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      background: '#152031',
      color: '#ffffff',
      confirmButtonColor: '#FF3131',
      cancelButtonColor: '#475569',
      iconColor: '#d97706',
      customClass: {
        popup: 'border border-white/10 !rounded-room',
        title: '!text-lg !font-black !uppercase !text-white',
        htmlContainer: '!text-sm !text-white/70'
      }
    });
  }
};
