window.onload = function () {
    let modal = new RModal(document.getElementById('modal'), {
        //content: 'Abracadabra'
        beforeOpen: function (next) {
            next();
        }
        , afterOpen: function () {
        }

        , beforeClose: function (next) {
            next();
        }
        , afterClose: function () {
        }
        // , bodyClass: 'modal-open'
        // , dialogClass: 'modal-dialog'
        // , dialogOpenClass: 'animated fadeIn'
        // , dialogCloseClass: 'animated fadeOut'

        // , focus: true
        // , focusElements: ['input.form-control', 'textarea', 'button.btn-primary']

        // , escapeClose: true
    });

    document.addEventListener('keydown', function (ev) {
        modal.keydown(ev);
    }, false);

    // document.getElementById('showModal').addEventListener("click", function (ev) {
    //     ev.preventDefault();
    // modal.open();
    // }, false);

    window.modal = modal;

    let btns = document.querySelectorAll(".btn-group-toggle .btn");
    btns.forEach((btn) => {
        btn.addEventListener('click', event => {
            btns.forEach(i => i.classList.remove("active"));

            btn.classList.add("active");
        })
    });


    // modal.open();
};