(function () {
    function applyMask(inputElement) {
        let value = inputElement.value;
        if (isNaN(value[value.length - 1])) {
            inputElement.value = value.substring(0, value.length - 1);
            return;
        }
        inputElement.setAttribute("maxlength", "14");
        if (value.length === 3 || value.length === 7) inputElement.value += ".";
        if (value.length === 11) inputElement.value += "-";
    }

    function validateCPF(cpf) {
        let sum = 0;
        let remainder;

        if (cpf === "00000000000") return false;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    function validateForm() {
        const cpfInput = document.getElementById("cpf");
        let cpf = cpfInput.value;
        cpf = cpf.replace(/[^\d]+/g, '');

        if (!validateCPF(cpf)) {
            showToast('CPF inválido!', 'danger');
            cpfInput.focus();
            return false;
        }
        return true;
    }

    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0 show`;
        toast.role = 'alert';
        toast.ariaLive = 'assertive';
        toast.ariaAtomic = 'true';

        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Mensagem</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 5000);
    }

    function handleFormSubmission(event) {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
    
        const formAction = event.target.getAttribute('action');
        const isUpdate = formAction.includes('updateUser');

        if (!isUpdate && !validateForm()) return;
    
        const method = isUpdate ? 'put' : 'post';
        const url = formAction;
    
        axios({
            method: method,
            url: url,
            data: data
        })
        .then(response => {
            const successMessage = isUpdate ? 'Currículo atualizado com sucesso!' : 'Usuário criado com sucesso!';
            showToast(successMessage, 'success');
            if (!isUpdate) {
                event.target.reset();
            }
        })
        .catch(error => {
            console.log(error);
            if (error.response && error.response.data.message) {
                showToast(error.response.data.message, 'danger');
            } else {
                showToast('Ocorreu um erro ao processar a solicitação.', 'danger');
            }
        });
    }
    
    function init() {
        const form = document.getElementById('createUserForm') || document.getElementById('updateUserForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function () {
                applyMask(this);
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', init);

})();
