import Swal from "sweetalert2";

const GlobalSwal = Swal.mixin({
  didOpen: () => {
    document.body.style.overflow = "hidden";
  },
  willClose: () => {
    document.body.style.overflow = "auto";
  },
});

export default GlobalSwal;
