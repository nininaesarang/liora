document.addEventListener("DOMContentLoaded", () => {
    
    const formulario = document.querySelector(".cuestionario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault(); 

        try {
            // --- Verificación de Datos ---
            const nombreInput = document.getElementById("nombre_usuario");
            const sentimientoInput = document.querySelector('input[name="sentimiento"]:checked');
            const objetivoInput = document.querySelector('input[name="objetivo"]:checked');
            const ingresosInput = document.getElementById("ingresos");
            const gastosInput = document.getElementById("gastos");

            // 1. Validamos que los campos de texto no estén vacíos
            if (nombreInput.value.trim() === "" || ingresosInput.value === "" || gastosInput.value === "") {
                // Si están vacíos, lanzamos un error y vamos al 'catch'
                throw new Error("Por favor completa los campos de texto.");
            }

            // 2. Validamos que los radios hayan sido seleccionados
            if (!sentimientoInput || !objetivoInput) {
                // Si son 'null', lanzamos un error y vamos al 'catch'
                throw new Error("Por favor selecciona una opción para sentimiento y objetivo.");
            }

            // --- Si todo está bien, recolectamos los valores ---
            const datosUsuario = {
                nombre_usuario: nombreInput.value,
                sentimiento_financiero: sentimientoInput.value,
                meta_principal: objetivoInput.value,
                ingresos: parseFloat(ingresosInput.value),
                egresos: parseFloat(gastosInput.value)
            };

            // 4. Guarda los datos en localStorage
            localStorage.setItem('datosUsuarioLiora', JSON.stringify(datosUsuario));
            localStorage.removeItem('chatStateLiora');
            localStorage.removeItem('dineroDisponible');
            localStorage.removeItem('historialGastos');
            alert("¡Datos guardados!");

            // 6. ¡Abre la nueva ventana!
            // Asegúrate de que 'chat.html' exista en la misma carpeta
            window.open('chat2.html', '_blank');

        } catch (error) {
            // El bloque 'catch' ahora mostrará un error más útil
            console.error(error); // Muestra el error en la consola F12
            alert(error.message); // Muestra el mensaje de error al usuario
        }
    });
});