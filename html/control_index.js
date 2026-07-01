// ── Orden de las tarjetas ──────────────────────────────────────────
// Define el orden progresivo: cada posición es [cardId, checkboxId, btnId]
const tarjetas = [
    { card: 'c1', checkbox: 'cb1', btn: 'btn1' },
    { card: 'c2', checkbox: 'cb2', btn: 'btn2' },
    { card: 'c3', checkbox: 'cb3', btn: 'btn3' },
    { card: 'c4', checkbox: 'cb4', btn: 'btn4' },
    { card: 'c5', checkbox: 'cb5', btn: 'btn5' },
];

// ── Guardar y cargar progreso en localStorage ──────────────────────
function guardarProgreso(progreso) {
    localStorage.setItem('progreso_temas', JSON.stringify(progreso));
}

function cargarProgreso() {
    const guardado = localStorage.getItem('progreso_temas');
    // Si no hay nada guardado, solo la primera está desbloqueada
    if (!guardado) {
        return tarjetas.map((_, i) => ({
            desbloqueada: i === 0,
            completada: false
        }));
    }
    return JSON.parse(guardado);
}

// ── Aplicar estado visual a cada tarjeta ──────────────────────────
function aplicarEstado(progreso) {
    tarjetas.forEach((t, i) => {
        const card     = document.getElementById(t.card);
        const checkbox = document.getElementById(t.checkbox);
        const btn      = document.getElementById(t.btn);
        const estado   = progreso[i];

        if (estado.desbloqueada) {
            // ── Tarjeta habilitada ──
            card.classList.remove('bloqueada');
            checkbox.classList.remove('checkbox-bloqueado');
            checkbox.onclick = () => marcarCompletada(i, progreso);

            if (estado.completada) {
                card.classList.add('checked');
                checkbox.classList.add('checked-box');
                const badge = card.querySelector('.visto-badge');
                if (badge) badge.style.display = 'block';
            } else {
                card.classList.remove('checked');
                checkbox.classList.remove('checked-box');
                const badge = card.querySelector('.visto-badge');
                if (badge) badge.style.display = 'none';
            }

            if (btn) btn.disabled = false;

        } else {
            // ── Tarjeta bloqueada ──
            card.classList.add('bloqueada');
            card.classList.remove('checked');
            checkbox.classList.add('checkbox-bloqueado');
            checkbox.classList.remove('checked-box');
            checkbox.onclick = null; // sin acción al hacer clic

            const badge = card.querySelector('.visto-badge');
            if (badge) badge.style.display = 'none';

            if (btn) btn.disabled = true;
        }
    });
}

// ── Marcar tarjeta como completada y desbloquear la siguiente ─────
function marcarCompletada(indice, progreso) {
    // Alternar completada/no completada
    progreso[indice].completada = !progreso[indice].completada;

    // Si se marcó como completada, desbloquear la siguiente
    if (progreso[indice].completada) {
        const siguiente = indice + 1;
        if (siguiente < tarjetas.length) {
            progreso[siguiente].desbloqueada = true;
        }
    } else {
        // Si se desmarca, volver a bloquear las siguientes no completadas
        for (let j = indice + 1; j < tarjetas.length; j++) {
            if (!progreso[j].completada) {
                progreso[j].desbloqueada = false;
            } else {
                break; // si ya estaba completada, no tocar las siguientes
            }
        }
    }

    guardarProgreso(progreso);
    aplicarEstado(progreso);
}

// ── Inicializar al cargar la página ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const progreso = cargarProgreso();
    aplicarEstado(progreso);
})