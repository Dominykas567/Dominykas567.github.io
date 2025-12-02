document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".php-email-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = {
            firstName: form.querySelector("input[name='first-name']").value,
            lastName: form.querySelector("input[name='last-name']").value,
            email: form.querySelector("input[name='email']").value,
            phone: form.querySelector("input[name='phone']").value,
            address: form.querySelector("input[name='address']").value,
            subject: form.querySelector("input[name='subject']").value,
            message: form.querySelector("textarea[name='message']").value,
            gender: form.querySelector("input[name='gender']:checked").value,
            age: form.querySelector("input[name='age']:checked").value,
            jsLevel: form.querySelector("input[name='js-level']:checked").value
        };

        console.log(formData);

        const outputArea = document.getElementById("form-output");
        outputArea.innerHTML = `
            <p><strong>Vardas:</strong> ${formData.firstName}</p>
            <p><strong>Pavardė:</strong> ${formData.lastName}</p>
            <p><strong>El. paštas:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Tel. numeris:</strong> ${formData.phone}</p>
            <p><strong>Adresas:</strong> ${formData.address}</p>
            <p><strong>Lytis:</strong> ${formData.gender}</p>
            <p><strong>Amžius:</strong> ${formData.age}</p>
            <p><strong>JS lygis:</strong> ${formData.jsLevel}</p>
            <p><strong>Tema:</strong> ${formData.subject}</p>
            <p><strong>Žinutė:</strong> ${formData.message}</p>
        `;
    });
});
