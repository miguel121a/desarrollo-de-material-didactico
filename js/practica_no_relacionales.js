// ================================================================
// practica_no_relacionales.js
// p1  → B   ¿Cómo almacenan info las BD no relacionales?
// p2  → C   ¿Para qué apps son adecuadas las NoSQL?
// p3  → drag and drop: configurar acceso seguro (d3-a, d3-c, d3-e, d3-g)
// p4  → B   ¿Por qué MongoDB crea BD automáticamente?
// p5  → D   ¿Diferencia SQL vs NoSQL?
// p6  → B   ¿Ventaja de almacenar datos relacionados en mismo registro?
// p7  → drag and drop: identificar CRUD (d7-a, d7-c, d7-e, d7-g)
// p8  → C   ¿Diferencia autenticación vs autorización?
// p9  → C   ¿Para qué sirven snapshots?
// p10 → D   ¿Qué gestor usa clave-valor?
// p11 → D   ¿Para qué sirve configurar acceso a la red?
// p12 → C   ¿Protocolo para cifrar datos en tránsito?
// ================================================================

const respuestasCorrectas = {
    p1:  'B',
    p2:  'C',
    p4:  'B',
    p5:  'D',
    p6:  'B',
    p8:  'C',
    p9:  'C',
    p10: 'D',
    p11: 'D',
    p12: 'C'
};

const explicaciones = {
    p1:  'Las bases de datos NoSQL almacenan la información en estructuras flexibles como documentos JSON, grafos o pares clave-valor, sin necesidad de tablas fijas.',
    p2:  'Las NoSQL son ideales para aplicaciones que manejan grandes volúmenes de información con estructuras variables que cambian con frecuencia.',
    p4:  'MongoDB no requiere definir un esquema previo, por lo que puede crear la base de datos automáticamente cuando se inserta el primer dato.',
    p5:  'En NoSQL cada registro puede tener campos distintos y cada gestor tiene su propia sintaxis, a diferencia de SQL que es estándar y tiene esquema fijo.',
    p6:  'Almacenar datos relacionados en el mismo registro evita hacer JOINs entre colecciones, simplificando las consultas y mejorando el rendimiento.',
    p8:  'La autenticación verifica la identidad del usuario antes de permitir el acceso. La autorización determina qué acciones puede realizar una vez dentro.',
    p9:  'Los snapshots automáticos generan copias de seguridad programadas que permiten restaurar la base de datos a un estado anterior en caso de fallo.',
    p10: 'El modelo clave-valor almacena cada dato con una clave única que lo identifica, permitiendo búsquedas extremadamente rápidas por esa clave.',
    p11: 'Configurar el acceso a la red en MongoDB Atlas permite definir qué direcciones IP están autorizadas a conectarse al clúster, bloqueando el resto.',
    p12: 'TLS/SSL es el protocolo estándar para cifrar la comunicación entre una aplicación y la base de datos, protegiendo los datos mientras viajan por la red.'
};

// ── Respuestas correctas del drag and drop ───────────────────────
const correctasDrag3 = ['d3-a', 'd3-c', 'd3-e', 'd3-g'];
const correctasDrag7 = ['d7-a', 'd7-c', 'd7-e', 'd7-g'];

let elementoArrastrado = null;

// ── Inicializar drag and drop ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    iniciarDrag('drag-source-3', 'drop-zone-3');
    iniciarDrag('drag-source-7', 'drop-zone-7');
});

function iniciarDrag(sourceId, zoneId) {
    const source = document.getElementById(sourceId);
    const zone   = document.getElementById(zoneId);

    // Eventos en items del source
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

    // Zona destino: acepta items
    zone.addEventListener('dragover',  (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', ()  => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const id   = e.dataTransfer.getData('id');
        const item = document.getElementById(id);
        // Solo acepta items del mismo source
        if (e.dataTransfer.getData('source') === sourceId) {
            zone.appendChild(item);
            // Reasignar evento dragstart al nuevo item en la zona
            item.addEventListener('dragstart', (ev) => {
                elementoArrastrado = item;
                item.classList.add('arrastrando');
                ev.dataTransfer.setData('id', item.id);
                ev.dataTransfer.setData('source', sourceId);
            });
        }
    });

    // Source: acepta items de vuelta
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

// ── Validar drag and drop de selección ──────────────────────────
function validarDragSeleccion(zoneId, correctas, feedbackId, cardId) {
    const zone     = document.getElementById(zoneId);
    const feedback = document.getElementById(feedbackId);
    const card     = document.getElementById(cardId);
    const items    = zone.querySelectorAll('.drag-item');

    if (items.length === 0) return null; // sin responder

    // Bloquear todos los items de la zona y del source
    const sourceId = zoneId.replace('drop-zone', 'drag-source');
    document.querySelectorAll(`#${sourceId} .drag-item, #${zoneId} .drag-item`).forEach(item => {
        item.classList.add('drag-bloqueado');
    });

    // Evaluar items en la zona
    let aciertos   = 0;
    let errores    = 0;
    const enZona   = Array.from(items).map(i => i.id);

    enZona.forEach(id => {
        const item = document.getElementById(id);
        if (correctas.includes(id)) {
            aciertos++;
            item.classList.add('drag-correcto');
        } else {
            errores++;
            item.classList.add('drag-incorrecto');
        }
    });

    // Marcar en verde los correctos que quedaron en el source sin arrastrar
    const sourceEl = document.getElementById(sourceId);
    sourceEl.querySelectorAll('.drag-item').forEach(item => {
        if (correctas.includes(item.id)) {
            item.style.borderColor = '#fbbf24';
        }
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

// ── Verificar todo ───────────────────────────────────────────────
function verificar() {
    let correctas   = 0;
    let incorrectas = 0;
    let sinResponder = [];

    // Opción múltiple
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

    // Drag and drop p3
    const r3 = validarDragSeleccion('drop-zone-3', correctasDrag3, 'feedback-p3', 'pregunta-3');
    if (r3 === null) {
        sinResponder.push('p3');
        document.getElementById('pregunta-3').classList.add('sin-responder');
        const fb = document.getElementById('feedback-p3');
        fb.className = 'feedback sin-responder-fb visible';
        fb.textContent = '⚠️ Debes arrastrar al menos un elemento antes de revisar.';
    } else if (r3 === true) { correctas++; } else { incorrectas++; }

    // Drag and drop p7
    const r7 = validarDragSeleccion('drop-zone-7', correctasDrag7, 'feedback-p7', 'pregunta-7');
    if (r7 === null) {
        sinResponder.push('p7');
        document.getElementById('pregunta-7').classList.add('sin-responder');
        const fb = document.getElementById('feedback-p7');
        fb.className = 'feedback sin-responder-fb visible';
        fb.textContent = '⚠️ Debes arrastrar al menos un elemento antes de revisar.';
    } else if (r7 === true) { correctas++; } else { incorrectas++; }

    const aviso = document.getElementById('aviso-faltantes');
    if (sinResponder.length > 0) {
        aviso.textContent = `⚠️ Te faltan ${sinResponder.length} pregunta(s) por completar.`;
        aviso.classList.add('visible');
        return;
    }

    aviso.classList.remove('visible');
    mostrarResultado(correctas, incorrectas);
}

// ── Resultado final ──────────────────────────────────────────────
function mostrarResultado(correctas, incorrectas) {
    const total = Object.keys(respuestasCorrectas).length + 2; // +2 drag
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
        <div class="detalle-pill correctas">${correctas} correctas</div>
        <div class="detalle-pill incorrectas">${incorrectas} incorrectas</div>
        <div class="detalle-pill puntaje">${pct}% de aciertos</div>
    `;

    const resultado = document.getElementById('resultado-final');
    resultado.classList.add('visible');
    setTimeout(() => {
        document.getElementById('resultado-barra').style.width = pct + '%';
    }, 100);
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Reiniciar ────────────────────────────────────────────────────
function reiniciar() {
    // Opción múltiple
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

    // Drag p3
    const source3 = document.getElementById('drag-source-3');
    const zone3   = document.getElementById('drop-zone-3');
    zone3.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-correcto', 'drag-incorrecto', 'drag-bloqueado', 'arrastrando');
        item.style.borderColor = '';
        source3.appendChild(item);
    });
    source3.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-bloqueado');
        item.style.borderColor = '';
    });
    document.getElementById('pregunta-3').classList.remove('correcta', 'incorrecta', 'sin-responder');
    document.getElementById('feedback-p3').className = 'feedback';
    document.getElementById('feedback-p3').textContent = '';

    // Drag p7
    const source7 = document.getElementById('drag-source-7');
    const zone7   = document.getElementById('drop-zone-7');
    zone7.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-correcto', 'drag-incorrecto', 'drag-bloqueado', 'arrastrando');
        item.style.borderColor = '';
        source7.appendChild(item);
    });
    source7.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-bloqueado');
        item.style.borderColor = '';
    });
    document.getElementById('pregunta-7').classList.remove('correcta', 'incorrecta', 'sin-responder');
    document.getElementById('feedback-p7').className = 'feedback';
    document.getElementById('feedback-p7').textContent = '';

    document.getElementById('resultado-final').classList.remove('visible');
    document.getElementById('aviso-faltantes').classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
