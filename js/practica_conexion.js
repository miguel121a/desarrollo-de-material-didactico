// ================================================================
// practica_conexion.js
// p1  → B   ¿Diferencia entre crear y conectarse?
// p2  → B   ¿Para qué sirve el puerto?
// p3  → C   ¿Por qué usar variables de entorno?
// p4  → drag and drop: elementos para conectarse (d4-a, d4-c, d4-e, d4-g)
// p5  → B   ¿Qué permite el consumo en la nube?
// p6  → D   ¿Qué método especifica exactamente qué datos necesita?
// p7  → C   ¿Qué método representa el código fetch?
// p8  → B   ¿Ventaja del ORM?
// p9  → drag and drop: métodos válidos de consumo (d9-a, d9-c, d9-e, d9-g)
// p10 → C   ¿Método más adecuado para obtener solo campos específicos?
// ================================================================

const respuestasCorrectas = {
    p1:  'B',
    p2:  'B',
    p3:  'C',
    p5:  'B',
    p6:  'D',
    p7:  'C',
    p8:  'B',
    p10: 'C'
};

const explicaciones = {
    p1:  'Crear una base de datos consiste en definir su estructura y registrarla en el servidor. Conectarse es abrir un canal de comunicación hacia esa base de datos ya existente para leer o modificar su contenido.',
    p2:  'El puerto identifica el punto específico dentro del servidor por el que se realizará la conexión al servicio de base de datos. Por ejemplo, MySQL usa el puerto 3306 por defecto.',
    p3:  'Guardar los datos de conexión en variables de entorno evita que información sensible como contraseñas quede expuesta en el código fuente, mejorando la seguridad y facilitando los cambios de configuración.',
    p5:  'El consumo de datos en la nube permite que aplicaciones web, móviles y de escritorio accedan a la misma información actualizada en tiempo real, sin necesidad de mantener copias locales que puedan volverse obsoletas.',
    p6:  'GraphQL permite al cliente definir exactamente qué campos necesita en una sola solicitud, evitando recibir datos innecesarios, a diferencia de REST que devuelve todos los campos definidos en el endpoint.',
    p7:  'El método fetch de JavaScript envía solicitudes HTTP a una URL de una API, recibe la respuesta y la convierte a JSON. Esto es característico del consumo mediante API REST.',
    p8:  'Un ORM representa las tablas de la base de datos como objetos o clases dentro del código, permitiendo interactuar con los datos sin escribir SQL directamente, lo que simplifica el desarrollo.',
    p10: 'GraphQL es el método más adecuado cuando se necesita obtener campos específicos de los datos, ya que permite definir exactamente qué información se requiere en cada consulta, evitando transferir datos innecesarios.'
};

// ── Respuestas correctas del drag and drop ───────────────────────
const correctasDrag4 = ['d4-a', 'd4-c', 'd4-e', 'd4-g'];
const correctasDrag9 = ['d9-a', 'd9-c', 'd9-e', 'd9-g'];

let elementoArrastrado = null;

document.addEventListener('DOMContentLoaded', () => {
    iniciarDrag('drag-source-4', 'drop-zone-4');
    iniciarDrag('drag-source-9', 'drop-zone-9');
});

function iniciarDrag(sourceId, zoneId) {
    const source = document.getElementById(sourceId);
    const zone   = document.getElementById(zoneId);

    source.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            elementoArrastrado = item;
            item.classList.add('arrastrando');
            e.dataTransfer.setData('id', item.id);
            e.dataTransfer.setData('source', sourceId);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('arrastrando');
            elementoArrastrado = null;
        });
    });

    zone.addEventListener('dragover',  (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', ()  => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const id   = e.dataTransfer.getData('id');
        const item = document.getElementById(id);
        if (e.dataTransfer.getData('source') === sourceId) {
            zone.appendChild(item);
            item.addEventListener('dragstart', (ev) => {
                elementoArrastrado = item;
                item.classList.add('arrastrando');
                ev.dataTransfer.setData('id', item.id);
                ev.dataTransfer.setData('source', sourceId);
            });
        }
    });

    source.addEventListener('dragover',  (e) => { e.preventDefault(); source.classList.add('drag-over'); });
    source.addEventListener('dragleave', ()  => { source.classList.remove('drag-over'); });
    source.addEventListener('drop', (e) => {
        e.preventDefault();
        source.classList.remove('drag-over');
        const id = e.dataTransfer.getData('id');
        if (e.dataTransfer.getData('source') === sourceId) {
            source.appendChild(document.getElementById(id));
        }
    });
}

function validarDragSeleccion(zoneId, correctas, feedbackId, cardId) {
    const zone     = document.getElementById(zoneId);
    const feedback = document.getElementById(feedbackId);
    const card     = document.getElementById(cardId);
    const items    = zone.querySelectorAll('.drag-item');

    if (items.length === 0) return null;

    const sourceId = zoneId.replace('drop-zone', 'drag-source');
    document.querySelectorAll(`#${sourceId} .drag-item, #${zoneId} .drag-item`).forEach(item => {
        item.classList.add('drag-bloqueado');
    });

    let aciertos = 0;
    let errores  = 0;

    Array.from(items).forEach(item => {
        if (correctas.includes(item.id)) {
            aciertos++;
            item.classList.add('drag-correcto');
        } else {
            errores++;
            item.classList.add('drag-incorrecto');
        }
    });

    document.getElementById(sourceId).querySelectorAll('.drag-item').forEach(item => {
        if (correctas.includes(item.id)) item.style.borderColor = '#fbbf24';
    });

    const esCorrecto = aciertos === correctas.length && errores === 0;

    if (esCorrecto) {
        card.classList.add('correcta');
        feedback.className = 'feedback correcta-fb visible';
        feedback.textContent = `✅ ¡Correcto! Identificaste los ${correctas.length} elementos correctos.`;
    } else {
        card.classList.add('incorrecta');
        feedback.className = 'feedback incorrecta-fb visible';
        feedback.textContent = `❌ Incorrecto. Tuviste ${aciertos} elemento(s) correcto(s) de ${correctas.length}. Los marcados en rojo no corresponden, los marcados en amarillo en la lista izquierda eran parte de la respuesta correcta.`;
    }

    return esCorrecto;
}

function verificar() {
    let correctas   = 0;
    let incorrectas = 0;
    let sinResponder = [];

    for (const nombre in respuestasCorrectas) {
        const seleccion = document.querySelector(`input[name="${nombre}"]:checked`);
        const feedback  = document.getElementById(`feedback-${nombre}`);
        const card      = document.getElementById(`pregunta-${nombre.replace('p', '')}`);
        const labels    = card.querySelectorAll('.opciones-lista li label');

        if (seleccion === null) {
            sinResponder.push(nombre);
            card.classList.add('sin-responder');
            feedback.className = 'feedback sin-responder-fb visible';
            feedback.textContent = '⚠️ No respondiste esta pregunta.';
            continue;
        }

        const respuestaUsuario  = seleccion.value;
        const respuestaCorrecta = respuestasCorrectas[nombre];

        labels.forEach(label => {
            label.classList.add('deshabilitada');
            if (label.querySelector('input').value === respuestaCorrecta)
                label.classList.add('es-correcta');
        });

        if (respuestaUsuario === respuestaCorrecta) {
            correctas++;
            card.classList.add('correcta');
            feedback.className = 'feedback correcta-fb visible';
            feedback.textContent = `✅ Correcto. ${explicaciones[nombre]}`;
        } else {
            incorrectas++;
            card.classList.add('incorrecta');
            labels.forEach(label => {
                if (label.querySelector('input').value === respuestaUsuario)
                    label.classList.add('es-incorrecta');
            });
            feedback.className = 'feedback incorrecta-fb visible';
            feedback.textContent = `❌ Incorrecto. La respuesta correcta es ${respuestaCorrecta}. ${explicaciones[nombre]}`;
        }
    }

    // Drag p4
    const r4 = validarDragSeleccion('drop-zone-4', correctasDrag4, 'feedback-p4', 'pregunta-4');
    if (r4 === null) {
        sinResponder.push('p4');
        document.getElementById('pregunta-4').classList.add('sin-responder');
        const fb = document.getElementById('feedback-p4');
        fb.className = 'feedback sin-responder-fb visible';
        fb.textContent = '⚠️ Debes arrastrar al menos un elemento antes de revisar.';
    } else if (r4 === true) { correctas++; } else { incorrectas++; }

    // Drag p9
    const r9 = validarDragSeleccion('drop-zone-9', correctasDrag9, 'feedback-p9', 'pregunta-9');
    if (r9 === null) {
        sinResponder.push('p9');
        document.getElementById('pregunta-9').classList.add('sin-responder');
        const fb = document.getElementById('feedback-p9');
        fb.className = 'feedback sin-responder-fb visible';
        fb.textContent = '⚠️ Debes arrastrar al menos un elemento antes de revisar.';
    } else if (r9 === true) { correctas++; } else { incorrectas++; }

    const aviso = document.getElementById('aviso-faltantes');
    if (sinResponder.length > 0) {
        aviso.textContent = `⚠️ Te faltan ${sinResponder.length} pregunta(s) por completar.`;
        aviso.classList.add('visible');
        return;
    }

    aviso.classList.remove('visible');
    mostrarResultado(correctas, incorrectas);
}

function mostrarResultado(correctas, incorrectas) {
    const total = Object.keys(respuestasCorrectas).length + 2;
    const pct   = Math.round((correctas / total) * 100);

    let icono, titulo, subtitulo;
    if (pct === 100)    { titulo = '¡Perfecto!';        subtitulo = 'Respondiste todo correctamente. ¡Excelente dominio del tema!'; }
    else if (pct >= 75) { titulo = '¡Muy bien!';        subtitulo = 'Tienes un buen manejo del tema. Repasa las preguntas marcadas en rojo.'; }
    else if (pct >= 50) { titulo = 'Puedes mejorar';    subtitulo = 'Tienes una base sólida. Te recomendamos repasar el material antes de continuar.'; }
    else                { titulo = 'Sigue practicando'; subtitulo = 'Te recomendamos leer nuevamente los temas e intentarlo de nuevo.'; }

    document.getElementById('resultado-icono').textContent     = icono;
    document.getElementById('resultado-titulo').textContent    = titulo;
    document.getElementById('resultado-subtitulo').textContent = subtitulo;
    document.getElementById('resultado-detalle').innerHTML = `
        <div class="detalle-pill correctas"> ${correctas} correctas</div>
        <div class="detalle-pill incorrectas"> ${incorrectas} incorrectas</div>
        <div class="detalle-pill puntaje"> ${pct}% de aciertos</div>
    `;

    const resultado = document.getElementById('resultado-final');
    resultado.classList.add('visible');
    setTimeout(() => {
        document.getElementById('resultado-barra').style.width = pct + '%';
    }, 100);
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function reiniciar() {
    for (const nombre in respuestasCorrectas) {
        const card = document.getElementById(`pregunta-${nombre.replace('p', '')}`);
        card.classList.remove('correcta', 'incorrecta', 'sin-responder');
        card.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
        card.querySelectorAll('.opciones-lista li label').forEach(l => {
            l.classList.remove('es-correcta', 'es-incorrecta', 'deshabilitada');
        });
        const feedback = document.getElementById(`feedback-${nombre}`);
        feedback.className = 'feedback';
        feedback.textContent = '';
    }

    // Reiniciar drag p4
    const source4 = document.getElementById('drag-source-4');
    const zone4   = document.getElementById('drop-zone-4');
    zone4.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-correcto', 'drag-incorrecto', 'drag-bloqueado', 'arrastrando');
        item.style.borderColor = '';
        source4.appendChild(item);
    });
    source4.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-bloqueado');
        item.style.borderColor = '';
    });
    document.getElementById('pregunta-4').classList.remove('correcta', 'incorrecta', 'sin-responder');
    document.getElementById('feedback-p4').className = 'feedback';
    document.getElementById('feedback-p4').textContent = '';

    // Reiniciar drag p9
    const source9 = document.getElementById('drag-source-9');
    const zone9   = document.getElementById('drop-zone-9');
    zone9.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-correcto', 'drag-incorrecto', 'drag-bloqueado', 'arrastrando');
        item.style.borderColor = '';
        source9.appendChild(item);
    });
    source9.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-bloqueado');
        item.style.borderColor = '';
    });
    document.getElementById('pregunta-9').classList.remove('correcta', 'incorrecta', 'sin-responder');
    document.getElementById('feedback-p9').className = 'feedback';
    document.getElementById('feedback-p9').textContent = '';

    document.getElementById('resultado-final').classList.remove('visible');
    document.getElementById('aviso-faltantes').classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
