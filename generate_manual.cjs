/**
 * Manual de Usuario – ToDo List Pro
 * Generado con docx-js para Ingeniería Web II – UNIMINUTO 2026
 * Autor: Luis Albeiro Isaza Arroyo
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TabStopType, TabStopPosition, ExternalHyperlink
} = require('C:/Users/lisaza/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

/* ─── Colores ─── */
const NAVY   = '1B3A5C';
const BLUE   = '2E86AB';
const LIGHT  = 'EAF4FB';
const WHITE  = 'FFFFFF';
const GRAY   = 'F2F2F2';
const TEXT   = '2D2D2D';
const MUTED  = '6B7280';

/* ─── Bordes comunes ─── */
const border = (color = 'CCCCCC') => ({ style: BorderStyle.SINGLE, size: 1, color });
const allBorders = (c) => ({ top: border(c), bottom: border(c), left: border(c), right: border(c) });
const noBorders = () => ({
  top:    { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left:   { style: BorderStyle.NONE },
  right:  { style: BorderStyle.NONE },
});

/* ─── Helpers de texto ─── */
const run = (text, opts = {}) => new TextRun({ text, font: 'Calibri', size: 22, color: TEXT, ...opts });
const bold = (text, opts = {}) => run(text, { bold: true, ...opts });
const para = (children, opts = {}) => new Paragraph({ children, spacing: { after: 120 }, ...opts });
const heading1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, font: 'Calibri', size: 28, bold: true, color: NAVY })],
  spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } },
});
const heading2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: 'Calibri', size: 24, bold: true, color: BLUE })],
  spacing: { before: 240, after: 120 },
});
const heading3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, font: 'Calibri', size: 22, bold: true, color: NAVY })],
  spacing: { before: 160, after: 80 },
});
const bodyText = (text) => para([run(text)], { spacing: { after: 140, line: 340 } });
const space = (pts = 120) => new Paragraph({ children: [], spacing: { after: pts } });

/* ─── Placeholder de imagen ─── */
const imgPlaceholder = (label, height = 2400) => {
  const rows = [];
  // Fila de etiqueta
  rows.push(new TableRow({
    children: [new TableCell({
      borders: allBorders(BLUE),
      shading: { fill: LIGHT, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `📷  ${label}`, font: 'Calibri', size: 20, bold: true, color: BLUE })]
      })]
    })]
  }));
  // Filas de espacio en blanco (simulan la altura de la imagen)
  const blankLines = Math.floor(height / 240);
  const blankChildren = Array.from({ length: blankLines }, () =>
    new Paragraph({ children: [run('')], spacing: { after: 0 } })
  );
  rows.push(new TableRow({
    children: [new TableCell({
      borders: allBorders('CCCCCC'),
      shading: { fill: 'FAFAFA', type: ShadingType.CLEAR },
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      children: blankChildren.length ? blankChildren : [new Paragraph({ children: [run('')] })]
    })]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows,
  });
};

/* ─── Info box ─── */
const infoBox = (title, lines) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      borders: allBorders(BLUE),
      shading: { fill: LIGHT, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [
        new Paragraph({ children: [new TextRun({ text: title, font: 'Calibri', size: 22, bold: true, color: NAVY })], spacing: { after: 80 } }),
        ...lines.map(l => new Paragraph({ children: [run(l)], spacing: { after: 60 }, bullet: { level: 0 } }))
      ]
    })]
  })]
});

/* ─── Tabla de dos columnas ─── */
const twoCol = (left, right) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4500, 4860],
  rows: [new TableRow({
    children: [
      new TableCell({ borders: allBorders(BLUE), shading: { fill: LIGHT, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [new Paragraph({ children: [bold(left[0], { color: NAVY })], spacing: { after: 60 } }), ...left.slice(1).map(l => new Paragraph({ children: [run(l)], spacing: { after: 40 } }))] }),
      new TableCell({ borders: allBorders(BLUE), shading: { fill: WHITE, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [new Paragraph({ children: [bold(right[0], { color: NAVY })], spacing: { after: 60 } }), ...right.slice(1).map(l => new Paragraph({ children: [run(l)], spacing: { after: 40 } }))] }),
    ]
  })]
});

/* ─── Tabla de features ─── */
const featureTable = (rows) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3600, 5760],
  rows: [
    new TableRow({
      children: [
        new TableCell({ borders: allBorders(NAVY), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [bold('Función', { color: WHITE, size: 20 })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ borders: allBorders(NAVY), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [bold('Descripción', { color: WHITE, size: 20 })], alignment: AlignmentType.CENTER })] }),
      ]
    }),
    ...rows.map(([col1, col2], i) => new TableRow({
      children: [
        new TableCell({ borders: allBorders('CCCCCC'), shading: { fill: i % 2 === 0 ? LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 160 },
          children: [new Paragraph({ children: [bold(col1, { color: NAVY, size: 20 })] })] }),
        new TableCell({ borders: allBorders('CCCCCC'), shading: { fill: i % 2 === 0 ? LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 160 },
          children: [new Paragraph({ children: [run(col2, { size: 20 })] })] }),
      ]
    }))
  ]
});

/* ══════════════════════════════════════════════════
   PORTADA
══════════════════════════════════════════════════ */
const coverPage = [
  space(720),
  // Franja superior de color
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: noBorders(),
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      margins: { top: 400, bottom: 400, left: 320, right: 320 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'CORPORACIÓN UNIVERSITARIA MINUTO DE DIOS', font: 'Calibri', size: 20, bold: true, color: WHITE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'UNIMINUTO', font: 'Calibri', size: 24, bold: true, color: 'A8D8EA' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0  }, children: [new TextRun({ text: 'Ingeniería en Sistemas', font: 'Calibri', size: 18, color: 'BDC3C7' })] }),
      ]
    })]})],
  }),
  space(480),
  // Título principal
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'MANUAL DE USUARIO', font: 'Calibri', size: 44, bold: true, color: NAVY })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'ToDo List Pro', font: 'Calibri', size: 36, bold: true, color: BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'Sistema Avanzado de Gestión de Tareas', font: 'Calibri', size: 24, color: MUTED, italics: true })]
  }),
  space(240),
  // Línea decorativa
  new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 1 } }, children: [run('')], spacing: { after: 240 } }),
  // Datos del proyecto
  new Table({
    width: { size: 7200, type: WidthType.DXA },
    columnWidths: [2400, 4800],
    rows: [
      [['Estudiante:', 'Luis Albeiro Isaza Arroyo'], ['Asignatura:', 'Ingeniería Web II']],
      [['Docente:', 'Zaida Ojeda'], ['Semestre:', '2026 – I']],
      [['Tecnologías:', 'React · Vite · JSON Server'], ['Entorno:', 'http://localhost:5173']],
    ].map(([left, right]) => new TableRow({
      children: [
        new TableCell({ borders: noBorders(), margins: { top: 80, bottom: 80, left: 0, right: 80 },
          children: [new Paragraph({ children: [bold(left[0], { color: NAVY, size: 20 })] })] }),
        new TableCell({ borders: noBorders(), margins: { top: 80, bottom: 80, left: 80, right: 0 },
          children: [new Paragraph({ children: [run(left[1], { size: 20 })] })] }),
        new TableCell({ borders: noBorders(), margins: { top: 80, bottom: 80, left: 120, right: 80 },
          children: [new Paragraph({ children: [bold(right[0], { color: NAVY, size: 20 })] })] }),
        new TableCell({ borders: noBorders(), margins: { top: 80, bottom: 80, left: 80, right: 0 },
          children: [new Paragraph({ children: [run(right[1], { size: 20 })] })] }),
      ]
    }))
  }),
  space(240),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Bogotá D.C. – 2026', font: 'Calibri', size: 20, color: MUTED })]
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   TABLA DE CONTENIDO (manual)
══════════════════════════════════════════════════ */
const toc = [
  heading1('Tabla de Contenido'),
  ...[
    ['1. Introducción', '3'],
    ['2. Requisitos del Sistema', '3'],
    ['3. Acceso al Sistema – Iniciar Sesión', '4'],
    ['4. Panel Principal (Dashboard)', '5'],
    ['   4.1  Barra de Navegación', '5'],
    ['   4.2  Sidebar de Categorías', '6'],
    ['   4.3  Tarjetas de Estadísticas', '6'],
    ['   4.4  Barra de Búsqueda y Filtros', '7'],
    ['5. Gestión de Tareas', '8'],
    ['   5.1  Crear una Nueva Tarea', '8'],
    ['   5.2  Ver Detalle y Subtareas', '9'],
    ['   5.3  Completar una Tarea', '10'],
    ['   5.4  Editar una Tarea', '11'],
    ['   5.5  Eliminar una Tarea', '11'],
    ['6. Gestión de Subtareas', '12'],
    ['7. Categorías Personalizadas', '13'],
    ['8. Filtros por Estado', '14'],
    ['9. Búsqueda de Tareas', '14'],
    ['10. Cerrar Sesión', '15'],
    ['11. Preguntas Frecuentes', '15'],
  ].map(([title, page]) => new Paragraph({
    children: [
      new TextRun({ text: title, font: 'Calibri', size: 22, color: title.startsWith('   ') ? MUTED : TEXT }),
      new TextRun({ text: `\t${page}`, font: 'Calibri', size: 22, color: MUTED }),
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: 3 }],
    spacing: { after: 100 },
  })),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 1 – INTRODUCCIÓN
══════════════════════════════════════════════════ */
const sec1 = [
  heading1('1. Introducción'),
  bodyText(
    'ToDo List Pro es una aplicación web de gestión de tareas desarrollada como proyecto académico para la asignatura Ingeniería Web II de la Corporación Universitaria Minuto de Dios (UNIMINUTO). ' +
    'La aplicación permite a los usuarios organizar, priorizar y hacer seguimiento a sus actividades diarias a través de una interfaz moderna, responsiva y fácil de usar.'
  ),
  bodyText(
    'El sistema está construido con React 19 + Vite como frontend, una API REST simulada con JSON Server, y hace uso de Context API para la gestión del estado global. ' +
    'Incluye autenticación de usuarios, categorías personalizables, alertas de vencimiento, subtareas y filtros avanzados.'
  ),
  space(80),
  infoBox('Características Principales', [
    '✔  Autenticación de usuarios con correo y contraseña',
    '✔  Creación, edición y eliminación de tareas',
    '✔  Categorías con colores personalizables',
    '✔  Subtareas con barra de progreso',
    '✔  Alertas configurables de vencimiento (1 a 30 días)',
    '✔  Filtros por estado: Pendientes, Completadas, Vencidas, Próximas',
    '✔  Búsqueda en tiempo real',
    '✔  Diseño oscuro responsivo (PC, tablet y móvil)',
  ]),
  space(120),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 2 – REQUISITOS
══════════════════════════════════════════════════ */
const sec2 = [
  heading1('2. Requisitos del Sistema'),
  twoCol(
    ['Requisitos de Software', 'Node.js v18 o superior', 'Navegador moderno (Chrome, Firefox, Edge)', 'npm v9 o superior'],
    ['Comandos de Inicio', 'npm install  (instalar dependencias)', 'npm run server  (JSON Server – puerto 3001)', 'npm run dev  (aplicación – puerto 5173)']
  ),
  space(120),
  bodyText('Una vez iniciados ambos servicios, acceda a la aplicación desde su navegador en:'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: 'http://localhost:5173', font: 'Courier New', size: 24, bold: true, color: BLUE })]
  }),
  space(80),
  featureTable([
    ['Credencial Demo', 'Email: admin@admin.com  |  Contraseña: 123456'],
    ['Usuario Test', 'Email: usuario@test.com  |  Contraseña: test123'],
  ]),
  space(120),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 3 – LOGIN
══════════════════════════════════════════════════ */
const sec3 = [
  heading1('3. Acceso al Sistema – Iniciar Sesión'),
  bodyText(
    'Al ingresar a la URL de la aplicación, si el usuario no tiene una sesión activa será redirigido automáticamente a la pantalla de inicio de sesión. ' +
    'Esta pantalla presenta dos paneles: a la izquierda, información y características del sistema; a la derecha, el formulario de acceso.'
  ),
  heading2('3.1  Pasos para iniciar sesión'),
  ...[
    '1.  Ingrese su correo electrónico en el campo "Correo electrónico".',
    '2.  Ingrese su contraseña en el campo "Contraseña" (puede usar el ícono del ojo para mostrarla).',
    '3.  Haga clic en el botón verde "Ingresar al sistema".',
    '4.  Alternativamente, haga clic en "⚡ Acceso rápido (Demo)" para autocompletar las credenciales de prueba.',
    '5.  Si las credenciales son correctas, será redirigido al Dashboard principal.',
  ].map(t => bodyText(t)),
  space(80),
  imgPlaceholder('CAPTURA 1 – Pantalla de Inicio de Sesión', 2800),
  space(120),
  infoBox('Nota de Seguridad', [
    'La sesión se almacena en localStorage del navegador.',
    'Para proteger su cuenta, cierre sesión al terminar de usar la aplicación.',
    'Si ingresa credenciales incorrectas, aparecerá un mensaje de error.',
  ]),
  space(120),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 4 – DASHBOARD
══════════════════════════════════════════════════ */
const sec4 = [
  heading1('4. Panel Principal (Dashboard)'),
  bodyText(
    'El Dashboard es la pantalla principal de la aplicación. Está dividido en dos columnas: un sidebar izquierdo con las categorías de tareas, ' +
    'y el panel principal derecho con las estadísticas, filtros y lista de tareas.'
  ),
  space(80),
  imgPlaceholder('CAPTURA 2 – Dashboard Principal con Tareas', 3200),
  space(120),
  heading2('4.1  Barra de Navegación'),
  bodyText(
    'La barra de navegación superior muestra el logo "ToDo List PRO" a la izquierda, contadores rápidos de tareas Pendientes / Completadas / Vencidas al centro, ' +
    'y el nombre del usuario con el botón "Salir" a la derecha.'
  ),
  featureTable([
    ['Logo + nombre', 'Clic en el logo navega al Dashboard desde cualquier pantalla'],
    ['Contadores superiores', 'Muestran el resumen rápido: Pendientes, Completadas, Vencidas'],
    ['Perfil de usuario', 'Muestra el nombre y correo del usuario autenticado'],
    ['Botón Salir', 'Cierra la sesión y redirige al Login'],
  ]),
  space(120),
  heading2('4.2  Sidebar de Categorías'),
  bodyText(
    'El panel lateral izquierdo muestra una cuadrícula de tarjetas de categoría. Cada tarjeta presenta el nombre, ícono, color y conteo de tareas de esa categoría. ' +
    'Al hacer clic en una categoría se filtra automáticamente la lista de tareas. Existe también la tarjeta especial "Todas" para ver todas las tareas.'
  ),
  bodyText('En la parte inferior del sidebar hay un botón "+ Agregar" para crear nuevas categorías personalizadas con nombre y color a elegir.'),
  space(80),
  heading2('4.3  Tarjetas de Estadísticas'),
  bodyText(
    'Cuatro tarjetas clickeables resumen el estado global de las tareas. Cada tarjeta actúa como filtro: al hacer clic sobre ella, la lista se filtra para mostrar únicamente las tareas de ese grupo. ' +
    'Un segundo clic sobre la tarjeta activa limpia el filtro.'
  ),
  featureTable([
    ['🕐 Pendientes (amarillo)', 'Tareas creadas sin marcar como completadas'],
    ['✅ Completadas (verde)', 'Tareas marcadas como finalizadas'],
    ['⚠ Vencidas (rojo)', 'Tareas cuya fecha de vencimiento ya pasó y no están completadas'],
    ['📅 Próximas (azul)', 'Tareas que vencen dentro de los próximos 7 días'],
  ]),
  space(120),
  heading2('4.4  Barra de Búsqueda y Filtros'),
  bodyText('Ubicada debajo de las tarjetas de estadísticas, la barra de filtros ofrece tres controles combinables:'),
  ...[
    '• Campo de búsqueda: filtra tareas en tiempo real por título o descripción.',
    '• Selector de estado: permite filtrar entre "Todos los estados", "Pendientes" o "Completadas".',
    '• Botón "Limpiar": aparece cuando hay filtros activos y los resetea todos con un clic.',
  ].map(bodyText),
  space(120),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 5 – GESTIÓN DE TAREAS
══════════════════════════════════════════════════ */
const sec5 = [
  heading1('5. Gestión de Tareas'),

  heading2('5.1  Crear una Nueva Tarea'),
  bodyText(
    'Para crear una tarea haga clic en el botón verde "+ Nueva Tarea" ubicado en la esquina superior derecha del panel principal. ' +
    'Se abrirá un modal centrado con el formulario de creación.'
  ),
  ...[
    '1.  Título (obligatorio): nombre descriptivo de la tarea.',
    '2.  Descripción (opcional): detalles adicionales, máximo 500 caracteres.',
    '3.  Categoría (obligatoria): seleccione una de las categorías disponibles haciendo clic sobre ella.',
    '4.  Fecha Inicio: se asigna automáticamente con la fecha actual.',
    '5.  Fecha Vencimiento (obligatoria): seleccione la fecha límite de la tarea.',
    '6.  Alerta Previa: seleccione con cuántos días de anticipación desea ser alertado (1, 2, 3, 5, 7, 10, 14 o 30 días).',
    '7.  Haga clic en "+ Crear tarea" para guardar. El modal se cerrará y la tarea aparecerá en la lista.',
  ].map(bodyText),
  space(80),
  imgPlaceholder('CAPTURA 3 – Modal "Nueva Tarea"', 3000),
  space(120),

  heading2('5.2  Ver Detalle y Subtareas'),
  bodyText(
    'Cada tarea en la lista está representada por una tarjeta (TaskCard). Por defecto, la tarjeta muestra el título, categoría, fechas, días restantes y estado. ' +
    'Para expandirla y ver todos sus detalles, haga clic en cualquier parte de la cabecera de la tarjeta.'
  ),
  bodyText('Al expandirse, la tarjeta muestra:'),
  ...[
    '• Descripción completa de la tarea.',
    '• Sección de SUBTAREAS con barra de progreso (completadas/total).',
    '• Lista de subtareas individuales con checkbox para marcarlas como completadas.',
    '• Campo "+ Agregar subtarea..." para añadir nuevas subtareas (presione Enter o clic en el botón ✓).',
    '• Botones de acción: Editar y Eliminar.',
  ].map(bodyText),
  space(80),
  imgPlaceholder('CAPTURA 4 – Tarea Expandida con Subtareas', 3200),
  space(120),

  heading2('5.3  Completar una Tarea'),
  bodyText(
    'Para marcar una tarea como completada, haga clic en el checkbox circular ubicado a la izquierda del título en la cabecera de la tarjeta. ' +
    'La tarea mostrará el título tachado y reducirá su opacidad para indicar que está finalizada. ' +
    'Para reactivarla, vuelva a hacer clic en el checkbox.'
  ),
  space(80),

  heading2('5.4  Editar una Tarea'),
  bodyText(
    'Para editar una tarea, primero expándala haciendo clic en su cabecera y luego haga clic en el botón azul "✏ Editar" que aparece en la parte inferior de la tarjeta expandida. ' +
    'Se abrirá el mismo formulario modal con los datos actuales de la tarea prellenados. ' +
    'Modifique los campos necesarios y haga clic en "Guardar cambios" para confirmar.'
  ),
  space(80),
  imgPlaceholder('CAPTURA 5 – Modal "Editar Tarea"', 2800),
  space(120),

  heading2('5.5  Eliminar una Tarea'),
  bodyText(
    'Para eliminar una tarea, expándala y haga clic en el botón rojo "🗑 Eliminar". ' +
    'Aparecerá una pantalla de confirmación directamente sobre la tarjeta con la pregunta "¿Eliminar esta tarea?" y dos opciones: ' +
    '"Cancelar" (para desistir) y "Sí, eliminar" (para confirmar). ' +
    'Esta acción es permanente y no se puede deshacer.'
  ),
  space(80),
  imgPlaceholder('CAPTURA 6 – Confirmación de Eliminación', 2200),
  space(120),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 6 – SUBTAREAS
══════════════════════════════════════════════════ */
const sec6 = [
  heading1('6. Gestión de Subtareas'),
  bodyText(
    'Las subtareas permiten dividir una tarea principal en pasos más pequeños y manejables. ' +
    'Se gestionan dentro del área expandida de cada tarjeta de tarea.'
  ),
  featureTable([
    ['Agregar subtarea', 'Escriba en el campo "+ Agregar subtarea..." y presione Enter o clic en ✓'],
    ['Completar subtarea', 'Haga clic en el checkbox cuadrado a la izquierda de cada subtarea'],
    ['Eliminar subtarea', 'Pase el cursor sobre la subtarea y haga clic en el ícono ✕ que aparece a la derecha'],
    ['Barra de progreso', 'Se actualiza automáticamente al completar subtareas (ej. 2/3 = 66%)'],
    ['Contador en lista', 'La tarjeta cerrada muestra el progreso en formato "completadas/total"'],
  ]),
  space(120),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 7 – CATEGORÍAS
══════════════════════════════════════════════════ */
const sec7 = [
  heading1('7. Categorías Personalizadas'),
  bodyText(
    'La aplicación incluye cuatro categorías predeterminadas: Trabajo (verde), Universidad (azul), Casa (naranja) y Compras (morado). ' +
    'Puede crear categorías adicionales desde el sidebar.'
  ),
  heading2('7.1  Crear una Categoría'),
  ...[
    '1.  En el sidebar izquierdo, haga clic en la tarjeta "+ Agregar".',
    '2.  Aparecerá un formulario inline con un campo de nombre y un selector de color.',
    '3.  Escriba el nombre de la categoría.',
    '4.  Haga clic en el círculo de color para seleccionar el tono deseado.',
    '5.  Presione Enter o el botón ✓ para guardar la nueva categoría.',
  ].map(bodyText),
  heading2('7.2  Filtrar por Categoría'),
  bodyText(
    'Haga clic sobre cualquier tarjeta de categoría en el sidebar para filtrar la lista de tareas. ' +
    'La tarjeta activa se resalta con un borde del color de la categoría y el panel principal muestra el nombre de la categoría como título. ' +
    'Haga clic en la tarjeta "Todas" para volver a ver todas las tareas.'
  ),
  space(120),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 8 – FILTROS POR ESTADO
══════════════════════════════════════════════════ */
const sec8 = [
  heading1('8. Filtros por Estado'),
  bodyText(
    'Las cuatro tarjetas de estadísticas del panel principal funcionan como filtros inteligentes. ' +
    'Al activar un filtro, el panel muestra únicamente las tareas de esa categoría de estado, el título cambia para indicar el filtro activo, ' +
    'y aparece un mensaje "Mostrando solo [estado] — ver todas" con un enlace para limpiar el filtro.'
  ),
  space(80),
  imgPlaceholder('CAPTURA 7 – Filtro "Completadas" Activo', 2800),
  space(120),
  featureTable([
    ['Pendientes', 'Muestra tareas con estado "pendiente" sin fecha vencida'],
    ['Completadas', 'Muestra únicamente tareas marcadas como completadas'],
    ['Vencidas', 'Muestra tareas cuya fecha de vencimiento ya pasó y no están completadas'],
    ['Próximas', 'Muestra tareas con fecha de vencimiento en los próximos 7 días'],
  ]),
  space(120),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 9 – BÚSQUEDA
══════════════════════════════════════════════════ */
const sec9 = [
  heading1('9. Búsqueda de Tareas'),
  bodyText(
    'El campo de búsqueda ubicado en la barra de filtros permite encontrar tareas en tiempo real. ' +
    'La búsqueda compara el texto ingresado contra el título y la descripción de cada tarea (sin distinción de mayúsculas/minúsculas).'
  ),
  ...[
    '1.  Haga clic en el campo "Buscar tareas..." en la barra de filtros.',
    '2.  Empiece a escribir el término a buscar. La lista se actualiza automáticamente con cada tecla.',
    '3.  Para limpiar la búsqueda, haga clic en el botón "×" que aparece dentro del campo, o borre el texto manualmente.',
    '4.  Si no hay resultados, la aplicación muestra el mensaje "Sin resultados" con un botón "Limpiar filtros".',
  ].map(bodyText),
  bodyText('La búsqueda puede combinarse simultáneamente con los filtros de categoría y de estado.'),
  space(120),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 10 – CERRAR SESIÓN
══════════════════════════════════════════════════ */
const sec10 = [
  heading1('10. Cerrar Sesión'),
  bodyText(
    'Para cerrar sesión en la aplicación, haga clic en el botón "→ Salir" ubicado en la barra de navegación superior derecha. ' +
    'Esto eliminará la sesión del navegador y redirigirá automáticamente a la pantalla de inicio de sesión. ' +
    'Al cerrar sesión se muestra una notificación "Sesión cerrada. ¡Hasta pronto!".'
  ),
  bodyText(
    'Si cierra el navegador sin cerrar sesión, la sesión permanecerá activa para la próxima vez que acceda a la aplicación desde el mismo navegador.'
  ),
  space(120),
];

/* ══════════════════════════════════════════════════
   SECCIÓN 11 – FAQ
══════════════════════════════════════════════════ */
const sec11 = [
  heading1('11. Preguntas Frecuentes'),
  featureTable([
    ['¿Qué pasa si no inicia el servidor?',
     'Ejecute "npm run server" en la terminal. La app necesita JSON Server en el puerto 3001 para funcionar.'],
    ['¿Puedo usar la app sin internet?',
     'Sí, toda la aplicación funciona localmente. Solo necesita tener los dos servidores corriendo en su máquina.'],
    ['¿Dónde se guardan los datos?',
     'En el archivo db.json ubicado en la raíz del proyecto. Este archivo actúa como base de datos.'],
    ['¿Qué ocurre si elimino una categoría?',
     'La categoría se elimina del sidebar, pero las tareas asociadas conservan su categoría como texto.'],
    ['¿Las subtareas afectan el estado de la tarea?',
     'No automáticamente. Debe marcar la tarea principal como completada de forma independiente.'],
    ['¿La app es responsiva?',
     'Sí. En pantallas móviles el sidebar se oculta y se accede con el botón hamburguesa (≡).'],
    ['¿Cómo recupero una tarea eliminada?',
     'No es posible desde la interfaz. Puede restaurarla editando manualmente el archivo db.json.'],
  ]),
  space(240),
  // Pie de página del documento
  new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } }, children: [run('')], spacing: { after: 80 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('Desarrollado por Luis Albeiro Isaza Arroyo  |  Ingeniería Web II  |  UNIMINUTO 2026', { size: 18, color: MUTED })]
  }),
];

/* ══════════════════════════════════════════════════
   DOCUMENTO FINAL
══════════════════════════════════════════════════ */
const doc = new Document({
  numbering: { config: [] },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22, color: TEXT } }
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 28, bold: true, font: 'Calibri', color: NAVY },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 24, bold: true, font: 'Calibri', color: BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 22, bold: true, font: 'Calibri', color: NAVY },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'ToDo List Pro  |  Manual de Usuario  |  UNIMINUTO 2026', font: 'Calibri', size: 18, color: MUTED }),
              new TextRun({ text: '\t', font: 'Calibri', size: 18 }),
              new TextRun({ text: 'Pág. ', font: 'Calibri', size: 18, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 18, color: BLUE }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Ingeniería Web II  ·  Zaida Ojeda  ·  Luis Albeiro Isaza Arroyo  ·  2026', font: 'Calibri', size: 16, color: MUTED })],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
          })
        ]
      })
    },
    children: [
      ...coverPage,
      ...toc,
      ...sec1,
      ...sec2,
      ...sec3,
      ...sec4,
      ...sec5,
      ...sec6,
      ...sec7,
      ...sec8,
      ...sec9,
      ...sec10,
      ...sec11,
    ]
  }]
});

/* ─── Guardar ─── */
const OUTPUT = 'C:/Users/lisaza/Documents/UniMinuto/Ingenieria Web II/Lista de tareas/todo-list-pro/Manual_Usuario_TodoListPro.docx';

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log('✅ Manual generado:', OUTPUT);
}).catch(err => {
  console.error('❌ Error:', err.message);
});
