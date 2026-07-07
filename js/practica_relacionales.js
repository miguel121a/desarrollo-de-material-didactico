// ================================================================
// practica.js
// p1  → B  ¿Cuál describe mejor una BD relacional?
// p2  → C  ¿Ventaja de claves foráneas?
// p3  → B  ¿Beneficio de BD en la nube?
// p4  → C  ¿Primer paso para diseñar una BD?
// p5  → B  ¿Principal ventaja de BD relacional?
// p6  → D  ¿Comando para obtener información? (SELECT)
// p7  → drag and drop
// p8  → C  ¿Diferencia UPDATE y DELETE?
// p9  → C  ¿Qué significa CRUD?
// p10 → B  ¿Para qué sirve asignar privilegios?
// p11 → D  ¿Privilegio para solo consultar? (SELECT)
// p12 → B  ¿Ventaja de usar roles?
// p13 → D  ¿Qué hace FLUSH PRIVILEGES?
// ================================================================

const respuestasCorrectas = {
    p1:  'B',
    p2:  'C',
    p3:  'B',
    p4:  'C',
    p5:  'B',
    p6:  'D',
    p8:  'C',
    p9:  'C',
    p10: 'B',
    p11: 'D',
    p12: 'B',
    p13: 'D'
};

const explicaciones = {
    p1:  'Una base de datos relacional organiza la información en tablas conectadas entre sí mediante claves primarias y foráneas.',
    p2:  'Las claves foráneas evitan repetir información en varias tablas, conectando registros entre ellas y manteniendo los datos organizados.',
    p3:  'Al estar en la nube, la base de datos es accesible desde cualquier lugar y no depende de un servidor físico.',
    p4:  'El primer paso es identificar las entidades del sistema y sus atributos antes de crear cualquier tabla en el gestor.',
    p5:  'Permite conectar un registro de una tabla con un registro de otra tabla relacionada, evitando duplicar información.',
    p6:  'SELECT es el comando de consulta en SQL. Permite recuperar registros de una tabla, con filtros opcionales usando WHERE.',
    p8:  'UPDATE modifica el valor de campos en un registro existente sin eliminarlo. DELETE borra el registro completo de la tabla.',
    p9:  'CRUD son las cuatro operaciones fundamentales: Create (crear), Read (leer), Update (actualizar) y Delete (eliminar).',
    p10: 'Los privilegios controlan qué puede hacer cada usuario según su función, protegiendo la información de accesos no autorizados.',
    p11: 'SELECT permite únicamente leer datos sin poder insertar, modificar ni eliminar. Es el privilegio adecuado para usuarios de solo consulta.',
    p12: 'Con roles se agrupan todos los privilegios y se asignan al usuario de una sola vez, evitando configurarlos uno por uno.',
    p13: 'FLUSH PRIVILEGES recarga la tabla de permisos para que los cambios con GRANT o REVOKE surtan efecto inmediato.'
};

const ordenCorrecto = {
    1: 'paso-a',
    2: 'paso-b',
    3: 'paso-c',
    4: 'paso-d',
    5: 'paso-e',
    6: 'paso-f'
};

let elementoArrastrado = null;

document.addEventListener('DOMContentLoaded', () => {
    iniciarDragAndDrop();
});

function iniciarDragAndDrop() {
    const items  = document.querySelectorAll('.drag-item');
    const zonas  = document.querySelectorAll('.drop-zone');
    const source = document.getElementById('drag-source');

    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            elementoArrastrado = item;
            item.classList.add('arrastrando');
            e.dataTransfer.setData('id', item.id);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('arrastrando');
            elementoArrastrado = null;
        });
    });

    zonas.forEach(zona => {
        zona.addEventListener('dragover',  (e) => { e.preventDefault(); zona.classList.add('drag-over'); });
        zona.addEventListener('dragleave', ()  => { zona.classList.remove('drag-over'); });
        zona.addEventListener('drop', (e) => {
            e.preventDefault();
            zona.classList.remove('drag-over');
            const item = document.getElementById(e.dataTransfer.getData('id'));
            const existente = zona.querySelector('.drag-item');
            if (existente) source.appendChild(existente);
            zona.appendChild(item);
        });
    });

    source.addEventListener('dragover',  (e) => { e.preventDefault(); source.classList.add('drag-over'); });
    source.addEventListener('dragleave', ()  => { source.classList.remove('drag-over'); });
    source.addEventListener('drop', (e) => {
        e.preventDefault();
        source.classList.remove('drag-over');
        source.appendChild(document.getElementById(e.dataTransfer.getData('id')));
    });
}

function validarDragAndDrop() {
    const feedback = document.getElementById('feedback-p7');
    const card     = document.getElementById('pregunta-7');

    for (let i = 1; i <= 6; i++) {
        if (!document.getElementById(`zona-${i}`).querySelector('.drag-item')) return null;
    }

    let aciertos = 0;
    for (let i = 1; i <= 6; i++) {
        const item = document.getElementById(`zona-${i}`).querySelector('.drag-item');
        item.classList.add('drag-bloqueado');
        if (item.id === ordenCorrecto[i]) {
            aciertos++;
            item.classList.add('drag-correcto');
        } else {
            item.classList.add('drag-incorrecto');
        }
    }

    document.querySelectorAll('#drag-source .drag-item').forEach(item => {
        item.classList.add('drag-bloqueado');
    });

    if (aciertos === 6) {
        card.classList.add('correcta');
        feedback.className = 'feedback correcta-fb visible';
        feedback.textContent = '✅ ¡Correcto! El orden es: identificar entidades → definir atributos → establecer relaciones → crear tablas → exportar → importar en la nube.';
        return true;
    } else {
        card.classList.add('incorrecta');
        feedback.className = 'feedback incorrecta-fb visible';
        feedback.textContent = `❌ Orden incorrecto. Tuviste ${aciertos} de 6 pasos en la posición correcta. El orden correcto es: 1) Identificar entidades, 2) Definir atributos, 3) Establecer relaciones, 4) Crear tablas, 5) Exportar, 6) Importar en la nube.`;
        return false;
    }
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

    const resultadoDrag = validarDragAndDrop();
    if (resultadoDrag === null) {
        sinResponder.push('p7');
        document.getElementById('pregunta-7').classList.add('sin-responder');
        const fb7 = document.getElementById('feedback-p7');
        fb7.className = 'feedback sin-responder-fb visible';
        fb7.textContent = '⚠️ Debes colocar todos los pasos en las zonas antes de revisar.';
    } else if (resultadoDrag === true) {
        correctas++;
    } else {
        incorrectas++;
    }

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
    const total = Object.keys(respuestasCorrectas).length + 1;
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

    const source = document.getElementById('drag-source');
    document.querySelectorAll('.drag-item').forEach(item => {
        item.classList.remove('drag-correcto', 'drag-incorrecto', 'drag-bloqueado', 'arrastrando');
        source.appendChild(item);
    });

    const card7 = document.getElementById('pregunta-7');
    card7.classList.remove('correcta', 'incorrecta', 'sin-responder');
    const feedback7 = document.getElementById('feedback-p7');
    feedback7.className = 'feedback';
    feedback7.textContent = '';

    document.getElementById('resultado-final').classList.remove('visible');
    document.getElementById('aviso-faltantes').classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
