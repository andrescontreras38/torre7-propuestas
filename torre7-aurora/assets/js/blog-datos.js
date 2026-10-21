/* ==========================================================
   ARTÍCULOS DEL BLOG — Torre 7 Soluciones Integrales
   ----------------------------------------------------------
   Cómo agregar un artículo:
   1. Copia un bloque { ... } completo y pégalo al inicio de la lista
      (el primero de la lista es el más reciente).
   2. Cambia los datos:
      - slug: identificador sin espacios ni tildes (aparece en el enlace).
      - titulo, resumen, categoria, autor, fecha (ej. "20 de octubre de 2026").
      - imagen: ruta de una foto dentro de assets/img/.
      - ejemplo: true muestra la etiqueta "Borrador de ejemplo". Ponlo en false
        (o bórralo) en los artículos reales.
      - contenido: lista de párrafos. Puedes usar <h2>subtítulo</h2>,
        <ul><li>…</li></ul> y <strong>negrita</strong>.
   Los 3 artículos de abajo son BORRADORES DE EJEMPLO para mostrar cómo
   funciona el blog. Revísalos, ajústalos o reemplázalos antes de publicar.
   ========================================================== */
const BLOG_POSTS = [
  {
    slug: "senales-diagnostico-organizacional",
    titulo: "5 señales de que tu organización necesita un diagnóstico",
    resumen: "Antes de planear o formular proyectos, conviene conocer con claridad cómo está la organización. Estas señales indican que es buen momento para hacer un diagnóstico.",
    categoria: "Fortalecimiento organizacional",
    autor: "Equipo Torre 7",
    fecha: "",
    imagen: "assets/img/equipo.webp",
    ejemplo: true,
    contenido: [
      "Un diagnóstico organizacional es una mirada ordenada a cómo funciona una organización: sus capacidades, sus procesos, sus recursos y sus oportunidades de mejora. No es un examen para encontrar culpables, sino una herramienta para decidir con información.",
      "<h2>1. Las prioridades no están claras</h2>",
      "Cuando el equipo trabaja en muchos frentes al mismo tiempo y cuesta decir qué es lo más importante, es probable que falte una lectura compartida de la situación de la organización.",
      "<h2>2. Los mismos problemas se repiten</h2>",
      "Si las dificultades vuelven a aparecer año tras año, puede que se estén atendiendo los síntomas y no las causas. Un diagnóstico ayuda a distinguir unos de otras.",
      "<h2>3. La organización está creciendo o cambiando</h2>",
      "Nuevos programas, nuevos aliados o un equipo más grande exigen ajustar la forma de trabajar. Es un buen momento para revisar qué capacidades hay y cuáles se necesitan.",
      "<h2>4. Se prepara una planeación estratégica o un proyecto</h2>",
      "Planear sin conocer el punto de partida hace más difícil fijar metas realistas. El diagnóstico es la base para definir objetivos, prioridades e indicadores.",
      "<h2>5. Cuesta mostrar resultados</h2>",
      "Si es difícil explicar a aliados o financiadores qué se ha logrado, puede faltar información organizada sobre actividades y resultados.",
      "<h2>¿Qué se obtiene de un diagnóstico?</h2>",
      "<ul><li>Una visión clara de las capacidades y necesidades de la organización.</li><li>Una matriz de oportunidades de mejora.</li><li>Recomendaciones priorizadas para actuar.</li></ul>",
      "El alcance depende de cada organización. Lo importante es que el resultado sirva para tomar decisiones y avanzar."
    ]
  },
  {
    slug: "que-es-el-marco-logico",
    titulo: "¿Qué es el marco lógico y para qué sirve?",
    resumen: "El marco lógico es una herramienta para ordenar un proyecto: qué se quiere lograr, cómo, con qué y cómo se sabrá si se logró. Te explicamos sus partes en lenguaje sencillo.",
    categoria: "Gestión de proyectos",
    autor: "Equipo Torre 7",
    fecha: "",
    imagen: "assets/img/pizarra.webp",
    ejemplo: true,
    contenido: [
      "Muchas convocatorias y entidades de cooperación piden presentar los proyectos con un marco lógico. Más allá de ser un requisito, es una forma práctica de pensar un proyecto de principio a fin.",
      "<h2>La idea central</h2>",
      "El marco lógico organiza el proyecto en una tabla que conecta lo que se hace con lo que se quiere lograr. Cada nivel debe llevar al siguiente: las actividades producen resultados, los resultados contribuyen al objetivo del proyecto y este aporta a un fin mayor.",
      "<h2>Sus partes principales</h2>",
      "<ul><li><strong>Fin:</strong> el cambio de largo plazo al que el proyecto quiere contribuir.</li><li><strong>Propósito u objetivo:</strong> lo que el proyecto busca lograr directamente.</li><li><strong>Resultados o productos:</strong> lo que el proyecto entrega.</li><li><strong>Actividades:</strong> las acciones necesarias para obtener los resultados.</li></ul>",
      "Para cada nivel se definen indicadores (cómo se medirá), medios de verificación (dónde se comprobará) y supuestos (condiciones externas que deben darse).",
      "<h2>¿Por qué es útil?</h2>",
      "Obliga a revisar si lo planeado realmente conduce al objetivo, facilita explicar el proyecto a otras personas y deja listas las bases para el seguimiento y la evaluación.",
      "<h2>Un consejo para empezar</h2>",
      "Antes de llenar la tabla, describe con claridad el problema que el proyecto quiere atender y a quiénes afecta. Un buen marco lógico parte de un problema bien entendido."
    ]
  },
  {
    slug: "preparate-para-buscar-financiacion",
    titulo: "Cómo preparar a tu organización antes de buscar financiación",
    resumen: "Encontrar una convocatoria es solo el primer paso. Estos puntos ayudan a que tu organización llegue mejor preparada a la hora de postular.",
    categoria: "Financiación y cooperación",
    autor: "Equipo Torre 7",
    fecha: "",
    imagen: "assets/img/asesoria.webp",
    ejemplo: true,
    contenido: [
      "Buscar financiación o cooperación es una tarea que exige tiempo y preparación. Llegar con la información organizada aumenta las posibilidades de presentar una propuesta sólida, aunque ningún proceso garantiza la aprobación.",
      "<h2>1. Ten claro qué quieres financiar</h2>",
      "Define la necesidad, el objetivo y el alcance de la iniciativa. Una idea concreta es más fácil de ajustar a los requisitos de cada convocatoria.",
      "<h2>2. Revisa los criterios de elegibilidad</h2>",
      "Cada fuente tiene condiciones sobre el tipo de organización, el territorio, el tema y los montos. Leerlas con calma evita invertir esfuerzo en convocatorias que no aplican.",
      "<h2>3. Organiza los documentos de la organización</h2>",
      "Muchas convocatorias piden soportes legales, financieros y de experiencia. Tenerlos al día ahorra tiempo cuando se abren plazos cortos.",
      "<h2>4. Prepara un proyecto bien estructurado</h2>",
      "Objetivos, actividades, presupuesto, cronograma e indicadores coherentes entre sí. Herramientas como el marco lógico ayudan a lograrlo.",
      "<h2>5. Arma una hoja de ruta</h2>",
      "<ul><li>Lista de oportunidades pertinentes.</li><li>Fechas de cierre y requisitos de cada una.</li><li>Responsables y tareas pendientes.</li></ul>",
      "Con este orden, la organización puede postular de forma más tranquila y aprender de cada proceso, sea cual sea el resultado."
    ]
  }
];
