document.addEventListener("DOMContentLoaded", () => {
    
    const datosGuardados = localStorage.getItem('datosUsuarioLiora');
    const elSaludo = document.getElementById('texto');
    const elPlanContainer = document.getElementById('plan-accion-container');
    const inputMensaje = document.querySelector('.text');
    const botonEnviar = document.querySelector('.boton');
    const divTexto = document.querySelector('.texto'); 
    const divMensaje = document.querySelector('.mensaje');
    const divBotonesDeuda = document.getElementById('botones-deuda-container');
    const btnBola = document.getElementById('btn-bola');
    const btnAvalancha = document.getElementById('btn-avalancha');
    const imgLiora = document.querySelector('.liora');

    const originalImageSrc = 'img/Liorarisa.png';
    const neutralImageSrc = 'img/Lioraneutro.png';

    let chatState = localStorage.getItem('chatStateLiora') || 'confirmacion';

    if (datosGuardados && elSaludo && elPlanContainer && inputMensaje && botonEnviar && divTexto && imgLiora && divMensaje && divBotonesDeuda && btnBola && btnAvalancha) {
        
        const usuario = JSON.parse(datosGuardados);

        if (chatState === 'confirmacion') {
            elSaludo.textContent = `¡Bienvenido, ${usuario.nombre_usuario}! Veo que te sientes un poco ${usuario.sentimiento_financiero} y que tu meta es ${usuario.meta_principal}. ¡Es un gran paso! Según tus números, tienes aproximadamente $${usuario.ingresos} al mes para tus gastos y ahorros. ¿Quieres que empecemos creando un plan simple de ahorro?`;
            inputMensaje.placeholder = 'Escribe "si" para comenzar';
            imgLiora.src = originalImageSrc; 

        } else if (chatState === 'registro') {
            const disponible = parseFloat(localStorage.getItem('dineroDisponible'));
            elSaludo.textContent = ''; 
            const htmlDelPlan = generarPlanDeAccion(usuario.meta_principal);
            elPlanContainer.innerHTML = `
                <div class="disponible-info" id="disponible-display">
                    ¡Bienvenido de nuevo! Te quedan <strong>$${disponible.toFixed(2)}</strong> de "Dinero Disponible".
                </div>
                ${htmlDelPlan} 
            `;
            inputMensaje.placeholder = "Ingresa un gasto (o 'salir')";
            imgLiora.src = originalImageSrc; 

        } else if (chatState === 'decision_deuda') {
            elSaludo.textContent = ''; 
            const htmlDelPlan = generarPlanDeAccion(usuario.meta_principal);
            elPlanContainer.innerHTML = htmlDelPlan;
            divMensaje.style.display = 'none';
            divBotonesDeuda.style.display = 'flex';
            imgLiora.src = neutralImageSrc; 
        
        } else if (chatState === 'definir_meta_ahorro') {
            elSaludo.textContent = ''; 
            const htmlDelPlan = generarPlanDeAccion(usuario.meta_principal);
            elPlanContainer.innerHTML = htmlDelPlan;
            inputMensaje.placeholder = "¿Cuánto quieres ahorrar este mes? (ej: 1000)";
        
        } else if (chatState === 'registro_ahorro') {
            elSaludo.textContent = ''; 
            const metaAhorro = parseFloat(localStorage.getItem('metaAhorro'));
            const totalAhorrado = parseFloat(localStorage.getItem('totalAhorrado'));
            elPlanContainer.innerHTML = `
                <div class="disponible-info" id="ahorro-display">
                    ¡Genial! Tu meta es <strong>$${metaAhorro.toFixed(2)}</strong>.
                    <p>Llevas ahorrados: <strong>$${totalAhorrado.toFixed(2)}</strong></p>
                </div>
                <p>Ingresa un nuevo ahorro (o 'salir')</p>
            `;
            inputMensaje.placeholder = "Ingresa un ahorro (ej: 50) o 'salir'";
        }
        
        botonEnviar.addEventListener('click', () => {
            
            const inputText = inputMensaje.value.trim();
            if (inputText === "") return; 
            const inputTextLower = inputText.toLowerCase();
            if (chatState === 'confirmacion') {
                if (inputTextLower === 'si' || inputTextLower === 'por supuesto') {
                    
                    const meta = usuario.meta_principal;
                    const htmlDelPlan = generarPlanDeAccion(meta); 
                    
                    elSaludo.textContent = ''; 
                    elPlanContainer.innerHTML = htmlDelPlan; 
                    divTexto.scrollTop = 0; 
                    inputMensaje.value = '';
                    switch (meta) {
                        case 'entender tu vida financiera':
                            const disponible = usuario.ingresos - usuario.egresos;
                            localStorage.setItem('dineroDisponible', disponible);
                            localStorage.setItem('historialGastos', JSON.stringify([])); 
                            
                            elPlanContainer.innerHTML = `
                                <div class="disponible-info" id="disponible-display">
                                    ¡Perfecto! Después de tus gastos fijos, tienes <strong>$${disponible.toFixed(2)}</strong> de "Dinero Disponible" para el mes.
                                </div>
                                ${htmlDelPlan}
                            `;
                            
                            inputMensaje.placeholder = "Ingresa un gasto (o 'salir')";
                            chatState = 'registro';
                            localStorage.setItem('chatStateLiora', 'registro');
                            break;

                        case 'Pagar una deuda':
                            divMensaje.style.display = 'none';
                            divBotonesDeuda.style.display = 'flex';
                            imgLiora.src = neutralImageSrc;
                            chatState = 'decision_deuda'; 
                            localStorage.setItem('chatStateLiora', 'decision_deuda');
                            break;

                        case 'ahorrar':
                            inputMensaje.placeholder = "¿Cuánto quieres ahorrar este mes? (ej: 1000)";
                            chatState = 'definir_meta_ahorro'; // ¡Nuevo estado!
                            localStorage.setItem('chatStateLiora', 'definir_meta_ahorro');
                            break;
                            
                        default:
                            inputMensaje.placeholder = "Sesión terminada.";
                            inputMensaje.disabled = true;
                    }
                } else {
                    inputMensaje.value = ''; 
                    inputMensaje.placeholder = "Por favor, escribe 'si' para continuar :)";
                }

            } else if (chatState === 'registro') {
                if (inputTextLower === 'salir' || inputTextLower === 'fin' || inputTextLower === 'terminar') {
                    chatState = 'menu'; 
                    localStorage.setItem('chatStateLiora', 'menu');
                    const disponible = parseFloat(localStorage.getItem('dineroDisponible'));
                    elPlanContainer.innerHTML = `
                        <div class="disponible-info" id="disponible-display">¡Entendido! Terminamos de registrar gastos por ahora.</div>
                        <h3>Resumen Final</h3>
                        <p>Tu dinero disponible restante es: <strong>$${disponible.toFixed(2)}</strong></p>
                    `;
                    divTexto.scrollTop = 0;
                    inputMensaje.value = '';
                    inputMensaje.placeholder = 'Sesión terminada.';
                    inputMensaje.disabled = true;
                    botonEnviar.disabled = true;

                } else {
                    const partes = inputText.split(' ');
                    const cantidad = parseFloat(partes[0]);
                    let categoria = partes.slice(1).join(' ');
                    if (categoria === "") categoria = "Gasto"; 

                    if (isNaN(cantidad) || cantidad <= 0) {
                        inputMensaje.value = '';
                        inputMensaje.placeholder = "Formato incorrecto. Usa: 50 cafe (o 'salir')";
                        return; 
                    }
                    let disponible = parseFloat(localStorage.getItem('dineroDisponible'));
                    let historial = JSON.parse(localStorage.getItem('historialGastos'));
                    disponible -= cantidad;
                    historial.push({ cantidad: cantidad, categoria: categoria, fecha: new Date() });
                    localStorage.setItem('dineroDisponible', disponible);
                    localStorage.setItem('historialGastos', JSON.stringify(historial));

                    if (elPlanContainer) {
                        elPlanContainer.innerHTML = `
                            <div class="disponible-info" id="disponible-display">
                                ¡Gasto registrado! 💸 Te quedan <strong>$${disponible.toFixed(2)}</strong> de "Dinero Disponible".
                            </div>
                        `;
                    }
                    divTexto.scrollTop = 0; 
                    inputMensaje.value = '';
                    inputMensaje.placeholder = "Ingresa otro gasto (o 'salir')";
                }
            } else if (chatState === 'definir_meta_ahorro') {
                const meta = parseFloat(inputText);

                // Validamos que sea un número
                if (isNaN(meta) || meta <= 0) {
                    inputMensaje.value = '';
                    inputMensaje.placeholder = "Por favor, ingresa un número válido (ej: 1000)";
                    return;
                }
                
                localStorage.setItem('metaAhorro', meta);
                localStorage.setItem('totalAhorrado', 0); 
                elPlanContainer.innerHTML = `
                    <div class="disponible-info" id="ahorro-display">
                        ¡Meta establecida! Tu objetivo es <strong>$${meta.toFixed(2)}</strong>.
                        <p>Llevas ahorrados: <strong>$0.00</strong></p>
                    </div>
                    <p>¡Perfecto! Ahora, ingresa tu primer ahorro para esta meta.</p>
                `;
                divTexto.scrollTop = 0;
                inputMensaje.value = '';
                inputMensaje.placeholder = "Ingresa un ahorro (ej: 50) o 'salir'";
                
                // Cambiamos el estado al loop de ahorro
                chatState = 'registro_ahorro';
                localStorage.setItem('chatStateLiora', 'registro_ahorro');

            } else if (chatState === 'registro_ahorro') {
                
                // 1. Revisar si es un comando de salida
                if (inputTextLower === 'salir' || inputTextLower === 'fin' || inputTextLower === 'terminar') {
                    chatState = 'menu'; 
                    localStorage.setItem('chatStateLiora', 'menu');
                    const totalAhorrado = parseFloat(localStorage.getItem('totalAhorrado'));
                    elPlanContainer.innerHTML = `
                        <div class="disponible-info" id="ahorro-display">¡Entendido! Terminamos de ahorrar por ahora.</div>
                        <h3>Resumen Final</h3>
                        <p>Has ahorrado un total de: <strong>$${totalAhorrado.toFixed(2)}</strong></p>
                    `;
                    divTexto.scrollTop = 0;
                    inputMensaje.value = '';
                    inputMensaje.placeholder = 'Sesión terminada.';
                    inputMensaje.disabled = true;
                    botonEnviar.disabled = true;
                    return; // Importante salir de la función aquí
                }
                
                // 2. Si NO es "salir", es un depósito
                const cantidad = parseFloat(inputText);
                if (isNaN(cantidad) || cantidad <= 0) {
                    inputMensaje.value = '';
                    inputMensaje.placeholder = "Ingresa un número válido (ej: 50) o 'salir'";
                    return;
                }

                // 3. Lee, actualiza y guarda los datos
                let totalAhorrado = parseFloat(localStorage.getItem('totalAhorrado'));
                const metaAhorro = parseFloat(localStorage.getItem('metaAhorro'));
                
                totalAhorrado += cantidad;
                
                localStorage.setItem('totalAhorrado', totalAhorrado);

                // 4. Actualiza la pantalla
                elPlanContainer.innerHTML = `
                    <div class="disponible-info" id="ahorro-display">
                        ¡Ahorro registrado! 📈 Llevas <strong>$${totalAhorrado.toFixed(2)}</strong>
                        de tu meta de <strong>$${metaAhorro.toFixed(2)}</strong>.
                    </div>
                `;
                divTexto.scrollTop = 0; 
                
                // 5. Revisa si cumplió la meta
                if (totalAhorrado >= metaAhorro) {
                    elPlanContainer.innerHTML += "<h3>¡FELICIDADES! ¡Alcanzaste tu meta de ahorro! 🎉</h3>";
                    chatState = 'menu';
                    localStorage.setItem('chatStateLiora', 'menu');
                    inputMensaje.value = '';
                    inputMensaje.placeholder = '¡Meta completada!';
                    inputMensaje.disabled = true;
                    botonEnviar.disabled = true;
                } else {
                    // Si no, pide el siguiente
                    inputMensaje.value = '';
                    inputMensaje.placeholder = "Ingresa otro ahorro (o 'salir')";
                }
            }
        }); // <-- Fin del addEventListener de 'botonEnviar'


        // --- 7. OYENTES PARA LOS BOTONES DE DEUDA 
        btnBola.addEventListener('click', () => {
            if (chatState !== 'decision_deuda') return;
            divBotonesDeuda.style.display = 'none';
            elPlanContainer.innerHTML = `
                <h2>¡Método Bola de Nieve! ❄️</h2>
                <p>Excelente elección. Es muy motivador.</p>
                <ol>
                    <li>Haz una lista de TODAS tus deudas, de la más pequeña a la más grande.</li>
                    <li>Paga el mínimo en todas, EXCEPTO en la más pequeña.</li>
                    <li>Ataca la deuda más pequeña con todo el dinero extra que tengas.</li>
                    <li>Cuando la elimines, ¡celebra! Y pasa a la siguiente más pequeña.</li>
                </ol>
                <p>¡Hemos terminado por ahora! Puedes cerrar la ventana.</p>
            `;
            divTexto.scrollTop = 0;
            imgLiora.src = originalImageSrc;
            chatState = 'menu';
            localStorage.setItem('chatStateLiora', 'menu');
        });

        btnAvalancha.addEventListener('click', () => {
            if (chatState !== 'decision_deuda') return;
            divBotonesDeuda.style.display = 'none';
            elPlanContainer.innerHTML = `
                <h2>¡Método Avalancha! 🏔️</h2>
                <p>La elección matemáticamente más rápida.</p>
                <ol>
                    <li>Haz una lista de TODAS tus deudas, ordenadas por la TASA DE INTERÉS más alta.</li>
                    <li>Paga el mínimo en todas, EXCEPTO en la de interés más alto.</li>
                    <li>Ataca esa deuda con todo tu dinero extra.</li>
                    <li>Cuando la elimines, pasa a la siguiente con el interés más alto.</li>
                </ol>
                <p>¡Hemos terminado por ahora! Puedes cerrar la ventana.</p>
            `;
            divTexto.scrollTop = 0;
            imgLiora.src = originalImageSrc;
            chatState = 'menu';
            localStorage.setItem('chatStateLiora', 'menu');
        });
        
        inputMensaje.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                botonEnviar.click();    
            }
        });

    } else {
        // --- 8. Manejo de error ---
        if (!datosGuardados) {
            alert("No se encontraron datos. Redirigiendo al inicio.");
            window.location.href = 'index.html';
        } else {
            console.error("Error: Faltan elementos clave del HTML. Revisa tus IDs y Clases.");
            alert("Error al cargar la página. Revisa la consola (F12) para más detalles.");
        }
    }
});


/**
 * Función generarPlanDeAccion(meta)
 * Esta función genera el texto inicial para cada meta.
 * @param {string} meta - El valor de la meta 
 * @returns {string} - Un string de HTML con el plan/pregunta
 */
function generarPlanDeAccion(meta) {
    let htmlGenerado = '';

    switch (meta) {
        
        case 'entender tu vida financiera':
            htmlGenerado = `
                <div class="plan-accion">
                    <h2>Tu primer paso: Un registro de gastos</h2>
                    <p>¡Genial! El primer paso para tomar el control es saber exactamente a dónde va tu dinero. Te propongo este plan:</p>
                    <ul>
                        <li><strong>Durante 7 días:</strong> Anota absolutamente TODO lo que gastes.</li>
                        <li><strong>Usa categorías:</strong> Agrupa tus gastos (Comida, Ocio, Servicios, etc.).</li>
                        <li><strong>Analiza:</strong> Al final de la semana, revisaremos juntos.</li>
                    </ul>
                    <p>Para empezar, ingresa tu primer gasto del día.</p>
                </div>
            `;
            break;
            
        case 'Pagar una deuda':
            htmlGenerado = `
                <div class="plan-accion">
                    <h2>Tu plan: Estrategias de pago de deuda</h2>
                    <p>¡Vamos! Existen dos métodos muy efectivos. Por favor, elige uno:</p>
                </div>
            `;
            break;

        case 'ahorrar':
            htmlGenerado = `
                <div class="plan-accion">
                    <h2>Tu meta: Empezar a ahorrar</h2>
                    <p>¡Excelente! El ahorro es un hábito. Aquí tienes un plan de 3 pasos:</p>
                    <ul>
                        <li><strong>1. "Págate a ti primero":</strong> Apenas recibas tu ingreso, separa un 5% o 10%.</li>
                        <li><strong>2. Dale un nombre:</strong> ¿Para qué ahorras? ("Vacaciones", "Mi tranquilidad").</li>
                        <li><strong>3. Automatiza:</strong> Configura una transferencia automática.</li>
                    </ul>
                    <p>Para empezar, ¿cuánto te gustaría ahorrar este mes?</p>
                </div>
            `;
            break;
            
        default:
            htmlGenerado = `<p>¡Listo para empezar! Veo que tienes una meta de '${meta}'. Cuéntame un poco más.</p>`;
    }
    
    return htmlGenerado;
}