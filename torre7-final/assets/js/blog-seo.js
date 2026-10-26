/* ==========================================================
   Optimización SEO y GEO de los artículos del blog
   Se carga DESPUÉS de blog-datos.js. Añade a cada artículo:
   - tituloSeo: título corto para la etiqueta <title> (máx. 50 caracteres + « | Torre 7»)
   - descripcion: meta descripción (130–155 caracteres)
   - imagenAlt: texto alternativo descriptivo de la foto principal
   - fuentes: referencias institucionales para profundizar
   - extra: secciones de profundidad (ejemplos, tablas, listas de verificación)
     que se insertan antes del párrafo de cierre del artículo
   ========================================================== */
const BLOG_SEO = {
  "que-es-una-esal-en-colombia": {
    tituloSeo: "Qué es una ESAL en Colombia: tipos y requisitos",
    descripcion: "Qué es una ESAL en Colombia: definición, tipos (fundación, corporación, asociación), registro y las seis dimensiones para fortalecerla.",
    imagenAlt: "Equipo de una organización social reunido en una sala de trabajo",
    fuentes: [["Registro Único Empresarial y Social (RUES)", "https://www.rues.org.co"], ["DIAN – Dirección de Impuestos y Aduanas Nacionales", "https://www.dian.gov.co"]],
    extra: [
      "<h2>¿ESAL, ONG y fundación son lo mismo?</h2>",
      "No exactamente. <strong>ESAL</strong> es el término jurídico y tributario que agrupa a las entidades sin ánimo de lucro. <strong>ONG</strong> (organización no gubernamental) es un término de uso común, pero no es una figura legal propia: una ONG suele constituirse legalmente como fundación, corporación o asociación. <strong>Fundación</strong> es una figura concreta, con reglas propias. Por eso, al buscar convocatorias o financiación, conviene identificarte con tu figura jurídica y con el término ESAL.",
      "<h2>Ejemplos de objeto social de una ESAL</h2>",
      "<ul><li>Educación, formación y generación de capacidades.</li><li>Salud, nutrición y bienestar.</li><li>Cultura, arte y patrimonio.</li><li>Ambiente y desarrollo sostenible.</li><li>Desarrollo comunitario y territorial.</li><li>Inclusión, derechos y atención a poblaciones específicas.</li><li>Deporte, recreación y emprendimiento social.</li></ul>",
      "<h2>Ventajas y obligaciones de formalizarse</h2>",
      "<table><thead><tr><th>Ventajas</th><th>Obligaciones frecuentes</th></tr></thead><tbody><tr><td>Personería jurídica propia, separada de las personas que la crean.</td><td>Mantener actualizado el registro y renovarlo en los plazos que fije la norma.</td></tr><tr><td>Posibilidad de recibir donaciones, firmar convenios y contratar.</td><td>Llevar contabilidad y soportes ordenados.</td></tr><tr><td>Acceso a convocatorias que exigen figura legal.</td><td>Cumplir las obligaciones tributarias que correspondan a su régimen.</td></tr><tr><td>Mayor credibilidad ante aliados, financiadores y comunidad.</td><td>Tener órganos de gobierno funcionando, con actas y estatutos al día.</td></tr></tbody></table>",
      "<h2>Errores frecuentes al constituir una ESAL</h2>",
      "<ul><li>Redactar un objeto social tan amplio que no comunica qué hace la organización, o tan estrecho que impide crecer.</li><li>Copiar estatutos de otra organización sin adaptarlos.</li><li>No definir con claridad las funciones de la junta y del representante legal.</li><li>Mezclar los recursos de la organización con los personales.</li></ul>",
      "<h2>Lista de chequeo de salud institucional</h2>",
      "<ul><li>¿El certificado de existencia y representación legal está vigente?</li><li>¿Los estatutos reflejan lo que la organización hace hoy?</li><li>¿Hay actas, contabilidad y soportes al día?</li><li>¿Existe un plan con objetivos y responsables?</li><li>¿La organización puede mostrar resultados con datos?</li></ul>"
    ]
  },
  "planeacion-estrategica-para-esal-paso-a-paso": {
    tituloSeo: "Planeación estratégica para ESAL: guía paso a paso",
    descripcion: "Guía para construir el plan estratégico de una ESAL en 7 pasos: diagnóstico, misión, objetivos, plan de acción, indicadores y seguimiento.",
    imagenAlt: "Equipo construyendo un plan estratégico frente a un tablero con notas",
    fuentes: [["Departamento Nacional de Planeación (DNP)", "https://www.dnp.gov.co"]],
    extra: [
      "<h2>Plan estratégico, plan operativo y proyecto: ¿en qué se diferencian?</h2>",
      "<table><thead><tr><th>Instrumento</th><th>Horizonte</th><th>Para qué sirve</th></tr></thead><tbody><tr><td>Plan estratégico</td><td>3 a 5 años</td><td>Definir hacia dónde va la organización y con qué prioridades.</td></tr><tr><td>Plan operativo anual</td><td>1 año</td><td>Traducir la estrategia en actividades, responsables, fechas y presupuesto.</td></tr><tr><td>Proyecto</td><td>Según financiación</td><td>Ejecutar una iniciativa concreta con objetivos, resultados e indicadores propios.</td></tr></tbody></table>",
      "<h2>Ejemplo resumido para una fundación pequeña</h2>",
      "<table><thead><tr><th>Objetivo estratégico</th><th>Indicador</th><th>Meta a 3 años</th><th>Responsable</th></tr></thead><tbody><tr><td>Diversificar los ingresos</td><td>% del presupuesto que aporta la principal fuente</td><td>Menos del 50 %</td><td>Dirección</td></tr><tr><td>Fortalecer la gestión de proyectos</td><td>Proyectos formulados y presentados al año</td><td>6 por año</td><td>Coordinación de proyectos</td></tr><tr><td>Mejorar la rendición de cuentas</td><td>Informes anuales publicados</td><td>1 por año</td><td>Junta y dirección</td></tr></tbody></table>",
      "Las cifras son ilustrativas: cada organización debe fijar metas acordes con su realidad.",
      "<h2>Cómo involucrar al equipo y a la junta</h2>",
      "<ul><li>Realiza uno o dos talleres de construcción, no solo una reunión de presentación.</li><li>Invita a representantes de la población atendida y de los aliados clave.</li><li>Comparte un borrador antes de aprobarlo y recoge comentarios.</li><li>Deja constancia de la aprobación de la junta en un acta.</li></ul>",
      "<h2>Qué debe contener el documento final</h2>",
      "<ul><li>Resumen del diagnóstico y del contexto.</li><li>Misión, visión y valores.</li><li>Objetivos estratégicos y ejes de trabajo.</li><li>Plan de acción del primer año.</li><li>Indicadores, metas y forma de seguimiento.</li><li>Presupuesto general y fuentes previstas.</li></ul>",
      "<h2>Cómo saber si el plan está funcionando</h2>",
      "Revisa cada trimestre un tablero sencillo con semáforo: <strong>verde</strong> (en curso o cumplido), <strong>amarillo</strong> (retraso con solución prevista) y <strong>rojo</strong> (bloqueado). Lo importante es conversar sobre las causas y decidir ajustes, no solo reportar."
    ]
  },
  "como-formular-un-proyecto-social": {
    tituloSeo: "Cómo formular un proyecto social paso a paso",
    descripcion: "Cómo formular un proyecto social: problema, objetivos, marco lógico, cronograma, presupuesto y riesgos, con ejemplo y lista de verificación.",
    imagenAlt: "Integrantes de una organización social trabajando en la formulación de un proyecto",
    fuentes: [["Departamento Nacional de Planeación (DNP)", "https://www.dnp.gov.co"], ["APC-Colombia – Agencia Presidencial de Cooperación", "https://www.apccolombia.gov.co"]],
    extra: [
      "<h2>Ejemplo: del problema al objetivo</h2>",
      "<table><thead><tr><th>Elemento</th><th>Ejemplo</th></tr></thead><tbody><tr><td>Problema central</td><td>Las organizaciones comunitarias de un municipio tienen baja capacidad para formular proyectos y acceder a recursos.</td></tr><tr><td>Causas</td><td>Falta de formación en formulación, ausencia de documentos al día, poca información sobre convocatorias.</td></tr><tr><td>Objetivo general</td><td>Fortalecer las capacidades de formulación de proyectos de 15 organizaciones comunitarias en 12 meses.</td></tr><tr><td>Resultados esperados</td><td>15 organizaciones formadas; 15 perfiles de proyecto elaborados; hoja de ruta de convocatorias por organización.</td></tr></tbody></table>",
      "<h2>La matriz del marco lógico en una mirada</h2>",
      "<table><thead><tr><th>Nivel</th><th>Resumen narrativo</th><th>Indicador</th><th>Fuente de verificación</th><th>Supuestos</th></tr></thead><tbody><tr><td>Objetivo general</td><td>Mayor acceso a recursos de las organizaciones</td><td>Propuestas presentadas</td><td>Registros de postulación</td><td>Convocatorias abiertas</td></tr><tr><td>Resultado</td><td>Capacidades de formulación fortalecidas</td><td>% de organizaciones con perfil elaborado</td><td>Documentos entregados</td><td>Asistencia sostenida</td></tr><tr><td>Actividad</td><td>Talleres de formulación</td><td>Talleres realizados</td><td>Listas de asistencia</td><td>Equipo disponible</td></tr></tbody></table>",
      "<h2>Errores que restan puntos en una convocatoria</h2>",
      "<ul><li>No seguir el formato ni los anexos solicitados.</li><li>Objetivos demasiado amplios para el tiempo y el presupuesto.</li><li>Presupuesto incoherente con las actividades.</li><li>Indicadores que no se pueden verificar.</li><li>No explicar cómo continuará el proyecto al terminar la financiación.</li></ul>",
      "<h2>Cómo adaptar tu proyecto a una convocatoria</h2>",
      "Lee los términos de referencia completos, identifica los criterios de evaluación y los puntajes, y ajusta el lenguaje y la estructura a lo que piden. Un mismo proyecto puede requerir versiones distintas según el financiador."
    ]
  },
  "indicadores-para-proyectos-sociales": {
    tituloSeo: "Indicadores para proyectos sociales y ejemplos",
    descripcion: "Qué son los indicadores de un proyecto social, tipos, cómo escribirlos, ficha técnica y ejemplos de producto, resultado e impacto.",
    imagenAlt: "Persona analizando datos e indicadores de un proyecto en una mesa de trabajo",
    fuentes: [["Departamento Nacional de Planeación (DNP)", "https://www.dnp.gov.co"]],
    extra: [
      "<h2>Ejemplo: de un objetivo a sus indicadores</h2>",
      "<table><thead><tr><th>Nivel</th><th>Indicador</th><th>Línea base</th><th>Meta</th><th>Fuente</th></tr></thead><tbody><tr><td>Producto</td><td>Número de talleres de formulación realizados</td><td>0</td><td>8</td><td>Listas de asistencia e informes</td></tr><tr><td>Resultado</td><td>% de organizaciones con un perfil de proyecto elaborado</td><td>10 %</td><td>80 %</td><td>Documentos de perfil entregados</td></tr><tr><td>Impacto</td><td>Número de propuestas presentadas a convocatorias por las organizaciones participantes</td><td>2</td><td>12</td><td>Registros de postulación</td></tr></tbody></table>",
      "<h2>Indicadores cuantitativos y cualitativos</h2>",
      "Los <strong>cuantitativos</strong> expresan cantidades, porcentajes o tasas. Los <strong>cualitativos</strong> describen percepciones, prácticas o niveles de apropiación mediante criterios definidos (por ejemplo, una rúbrica de tres niveles). Combinarlos suele dar una imagen más completa del cambio.",
      "<h2>Fuentes de verificación frecuentes</h2>",
      "<ul><li>Listas de asistencia y registros de actividades.</li><li>Encuestas de entrada y de salida.</li><li>Entrevistas y grupos focales.</li><li>Documentos producidos (planes, perfiles, informes).</li><li>Registros administrativos y contables.</li></ul>",
      "<h2>Cómo fijar una meta realista</h2>",
      "Parte de la línea base, revisa experiencias anteriores, considera los recursos y el tiempo disponibles, y consulta al equipo y a la población. Una meta ambiciosa pero alcanzable motiva; una meta imposible desgasta y resta credibilidad.",
      "<h2>Un tablero mínimo de seguimiento</h2>",
      "<ul><li>Indicador y meta.</li><li>Valor actual y porcentaje de avance.</li><li>Semáforo (verde, amarillo, rojo).</li><li>Comentario sobre causas y decisiones.</li><li>Responsable y fecha de la próxima medición.</li></ul>"
    ]
  },
  "presupuesto-de-un-proyecto-social": {
    tituloSeo: "Presupuesto de un proyecto social: guía y ejemplo",
    descripcion: "Cómo armar el presupuesto de un proyecto social: costos directos e indirectos, contrapartida, flujo de caja, ejemplo y errores comunes.",
    imagenAlt: "Documentos y calculadora para elaborar el presupuesto de un proyecto",
    fuentes: [["APC-Colombia – Agencia Presidencial de Cooperación", "https://www.apccolombia.gov.co"]],
    extra: [
      "<h2>Ejemplo de presupuesto sencillo (cifras ilustrativas)</h2>",
      "<table><thead><tr><th>Rubro</th><th>Supuesto</th><th>Valor (COP)</th></tr></thead><tbody><tr><td>Personal del proyecto</td><td>1 coordinador, 12 meses</td><td>36.000.000</td></tr><tr><td>Talleres y logística</td><td>8 talleres</td><td>12.000.000</td></tr><tr><td>Materiales</td><td>Kits y material de apoyo</td><td>3.000.000</td></tr><tr><td>Transporte</td><td>Desplazamientos del equipo</td><td>4.000.000</td></tr><tr><td>Seguimiento y evaluación</td><td>Línea base y evaluación final</td><td>5.000.000</td></tr><tr><td>Comunicaciones</td><td>Piezas y difusión</td><td>2.000.000</td></tr><tr><td><strong>Subtotal costos directos</strong></td><td></td><td><strong>62.000.000</strong></td></tr><tr><td>Costos indirectos</td><td>10 % de los directos (ejemplo)</td><td>6.200.000</td></tr><tr><td><strong>Total del proyecto</strong></td><td></td><td><strong>68.200.000</strong></td></tr></tbody></table>",
      "Los porcentajes de costos indirectos y los rubros permitidos dependen de cada financiador; este ejemplo solo ilustra la estructura.",
      "<h2>Lista de chequeo del presupuesto</h2>",
      "<ul><li>Cada actividad del cronograma tiene su costo.</li><li>Los precios unitarios tienen cotización o referencia.</li><li>Los rubros coinciden con los permitidos por la convocatoria.</li><li>La contrapartida y los aportes en especie están valorados y soportados.</li><li>Las sumas y los totales están verificados.</li><li>Existe un flujo de caja mensual coherente con los desembolsos.</li></ul>",
      "<h2>Del presupuesto al control</h2>",
      "Una vez aprobado el proyecto, compara cada mes lo ejecutado con lo presupuestado, documenta las variaciones y guarda los soportes de cada gasto. Esa disciplina facilita los informes financieros y las auditorías."
    ]
  },
  "seguimiento-y-evaluacion-de-proyectos-sociales": {
    tituloSeo: "Seguimiento y evaluación de proyectos sociales",
    descripcion: "Diferencias entre seguimiento, evaluación y sistematización, criterios de evaluación y cómo montar un plan de seguimiento paso a paso.",
    imagenAlt: "Investigadora revisando resultados y gráficos de seguimiento de un proyecto",
    fuentes: [["OCDE – Criterios de evaluación del Comité de Ayuda al Desarrollo (CAD)", "https://www.oecd.org"], ["Departamento Nacional de Planeación (DNP)", "https://www.dnp.gov.co"]],
    extra: [
      "<h2>Ejemplo de tablero trimestral</h2>",
      "<table><thead><tr><th>Indicador</th><th>Meta anual</th><th>Avance</th><th>Estado</th><th>Decisión</th></tr></thead><tbody><tr><td>Talleres realizados</td><td>8</td><td>4</td><td>En curso</td><td>Mantener el calendario</td></tr><tr><td>Participantes que completan el proceso</td><td>80 %</td><td>62 %</td><td>Atención</td><td>Reforzar acompañamiento y recordatorios</td></tr><tr><td>Perfiles de proyecto elaborados</td><td>15</td><td>3</td><td>Retraso</td><td>Agregar sesiones de asesoría individual</td></tr></tbody></table>",
      "<h2>Momentos del seguimiento y la evaluación</h2>",
      "<ul><li><strong>Al inicio:</strong> línea base y acuerdos sobre indicadores.</li><li><strong>Durante:</strong> seguimiento periódico y evaluación intermedia si el proyecto es largo.</li><li><strong>Al cierre:</strong> evaluación final y sistematización de aprendizajes.</li><li><strong>Después:</strong> seguimiento posterior para observar la sostenibilidad de los resultados.</li></ul>",
      "<h2>Cómo comunicar los resultados</h2>",
      "<table><thead><tr><th>Audiencia</th><th>Qué necesita</th><th>Formato útil</th></tr></thead><tbody><tr><td>Financiadores</td><td>Cumplimiento, uso de recursos, resultados</td><td>Informe técnico y financiero</td></tr><tr><td>Población participante</td><td>Qué se logró y qué sigue</td><td>Encuentro de devolución, infografía</td></tr><tr><td>Equipo y junta</td><td>Aprendizajes y decisiones</td><td>Tablero y reunión de análisis</td></tr></tbody></table>",
      "<h2>Evaluación participativa</h2>",
      "Involucrar a las personas atendidas en la evaluación —con encuestas, conversatorios o grupos focales— aporta información que los indicadores no capturan y fortalece la confianza en el proceso."
    ]
  },
  "fuentes-de-financiacion-para-esal-en-colombia": {
    tituloSeo: "Financiación para ESAL en Colombia: fuentes",
    descripcion: "Fuentes de financiación para ESAL en Colombia: cooperación, recursos públicos, sector privado, donaciones e ingresos propios y cómo elegir.",
    imagenAlt: "Reunión de trabajo para planear la búsqueda de financiación de una organización social",
    fuentes: [["APC-Colombia – Agencia Presidencial de Cooperación", "https://www.apccolombia.gov.co"], ["Colombia Compra Eficiente – Contratación pública", "https://www.colombiacompra.gov.co"]],
    extra: [
      "<h2>Qué buscan los financiadores</h2>",
      "<ul><li><strong>Pertinencia:</strong> que el proyecto responda a una necesidad real y a sus prioridades.</li><li><strong>Capacidad:</strong> que la organización tenga experiencia y gestión ordenada.</li><li><strong>Coherencia:</strong> objetivos, actividades, presupuesto e indicadores alineados.</li><li><strong>Resultados:</strong> evidencia de lo logrado en proyectos anteriores.</li><li><strong>Sostenibilidad:</strong> claridad sobre qué pasa cuando termina el apoyo.</li></ul>",
      "<h2>Modelo de ficha de oportunidad</h2>",
      "<table><thead><tr><th>Campo</th><th>Qué registrar</th></tr></thead><tbody><tr><td>Fuente y convocatoria</td><td>Nombre de la entidad y de la convocatoria</td></tr><tr><td>Tema y público</td><td>Líneas temáticas y organizaciones elegibles</td></tr><tr><td>Monto y duración</td><td>Valor máximo, contrapartida, plazo de ejecución</td></tr><tr><td>Fechas</td><td>Apertura, cierre, publicación de resultados</td></tr><tr><td>Requisitos</td><td>Documentos legales, financieros y de experiencia</td></tr><tr><td>Decisión</td><td>Postular, aplazar o descartar, con la razón</td></tr></tbody></table>",
      "<h2>Errores al postular</h2>",
      "<ul><li>Dejar la preparación para los últimos días.</li><li>Postular a convocatorias que no se ajustan a la misión.</li><li>No leer las preguntas frecuentes ni los anexos.</li><li>Enviar documentos vencidos o incompletos.</li></ul>",
      "<h2>Cómo evaluar el retorno de postular</h2>",
      "Lleva un registro de cuántas propuestas presentas, cuántas se aprueban y cuántas horas de trabajo requieren. Con esos datos puedes decidir en qué fuentes invertir más tiempo y qué aprendizajes aplicar."
    ]
  },
  "sostenibilidad-organizacional-para-esal": {
    tituloSeo: "Sostenibilidad de una ESAL: cómo asegurarla",
    descripcion: "Sostenibilidad organizacional para ESAL: las cuatro dimensiones, estrategias de ingresos, reservas y un plan en cuatro pasos para perdurar.",
    imagenAlt: "Dirección de una organización cerrando un acuerdo con aliados",
    fuentes: [],
    extra: [
      "<h2>Diagnóstico rápido: 10 preguntas</h2>",
      "<ol><li>¿Ninguna fuente aporta más de la mitad de los ingresos?</li><li>¿Hay reservas para cubrir al menos algunos meses de gastos básicos?</li><li>¿Los procesos clave están documentados?</li><li>¿Más de una persona sabe hacer cada tarea crítica?</li><li>¿La junta se reúne con regularidad?</li><li>¿Existe un plan estratégico vigente?</li><li>¿La organización mide y comunica sus resultados?</li><li>¿Hay alianzas activas con otras organizaciones o instituciones?</li><li>¿Se rinden cuentas a la comunidad y a los aliados?</li><li>¿Hay servicios o ingresos propios alineados con la misión?</li></ol>",
      "Si respondes «no» a varias, tienes una guía clara de prioridades.",
      "<h2>Ejemplo de mezcla de ingresos más saludable</h2>",
      "<table><thead><tr><th>Fuente</th><th>Situación frágil</th><th>Situación más sólida</th></tr></thead><tbody><tr><td>Un solo financiador</td><td>Más del 80 %</td><td>Menos del 50 %</td></tr><tr><td>Otras fuentes de proyectos</td><td>Ninguna</td><td>Dos o tres fuentes activas</td></tr><tr><td>Ingresos propios y donaciones</td><td>Casi nulos</td><td>Una parte relevante del presupuesto</td></tr></tbody></table>",
      "Los porcentajes son una referencia ilustrativa, no una regla: lo esencial es reducir la dependencia de una sola fuente.",
      "<h2>Señales de alerta</h2>",
      "<ul><li>La organización depende de una sola persona.</li><li>Los gastos institucionales se cubren con recursos de proyectos sin planearlo.</li><li>Cada fin de proyecto genera incertidumbre sobre el futuro del equipo.</li><li>Cuesta explicar qué resultados ha logrado la organización.</li></ul>",
      "<h2>Cómo construir una reserva</h2>",
      "Destina una parte pequeña pero constante de los excedentes (cuando la normativa y los financiadores lo permitan) a un fondo de reserva institucional, y define reglas claras sobre cuándo y cómo puede usarse."
    ]
  },
  "gobierno-y-transparencia-en-esal": {
    tituloSeo: "Gobierno y transparencia en ESAL: buenas prácticas",
    descripcion: "Gobierno y transparencia en ESAL: órganos, junta directiva, conflictos de interés, rendición de cuentas y lista de verificación.",
    imagenAlt: "Equipo directivo de una organización en una reunión de junta",
    fuentes: [["RUES – Registro Único Empresarial y Social", "https://www.rues.org.co"]],
    extra: [
      "<h2>Calendario anual de gobierno</h2>",
      "<table><thead><tr><th>Momento</th><th>Qué hacer</th></tr></thead><tbody><tr><td>Primer trimestre</td><td>Cerrar el año contable, preparar informe de gestión y realizar la asamblea ordinaria según los estatutos; actualizar el registro cuando corresponda.</td></tr><tr><td>Cada trimestre</td><td>Reunión de junta con seguimiento al plan, a los indicadores y al presupuesto.</td></tr><tr><td>Mitad de año</td><td>Revisión de riesgos, de ingresos y del plan operativo.</td></tr><tr><td>Último trimestre</td><td>Aprobar presupuesto y plan operativo del siguiente año.</td></tr></tbody></table>",
      "<h2>Archivo institucional: documentos que conviene conservar</h2>",
      "<ul><li>Acta de constitución y estatutos vigentes.</li><li>Certificado de existencia y representación legal.</li><li>Actas de asamblea y junta, firmadas.</li><li>Estados financieros y soportes contables.</li><li>Contratos, convenios e informes a financiadores.</li><li>Políticas internas aprobadas.</li></ul>",
      "<h2>Políticas mínimas recomendadas</h2>",
      "<ul><li>Conflictos de interés.</li><li>Compras y contratación.</li><li>Protección de datos personales.</li><li>Protección de niñas, niños y adolescentes, cuando se trabaje con ellos.</li><li>Canales de quejas y sugerencias.</li></ul>",
      "<h2>Cómo preparar una buena reunión de junta</h2>",
      "<ol><li>Envía la convocatoria y el orden del día con anticipación.</li><li>Adjunta los documentos que se van a discutir.</li><li>Dedica el tiempo a decidir, no solo a informar.</li><li>Registra los acuerdos y los responsables en el acta.</li><li>Haz seguimiento a los compromisos en la siguiente reunión.</li></ol>"
    ]
  },
  "innovacion-social-en-organizaciones-pilotos": {
    tituloSeo: "Innovación social: del problema al piloto",
    descripcion: "Innovación social en organizaciones: ciclo de seis pasos, cómo diseñar un piloto, errores comunes y criterios para escalar una solución.",
    imagenAlt: "Taller de ideación con notas adhesivas en una organización",
    fuentes: [],
    extra: [
      "<h2>Ejemplo de piloto: formación breve en formulación de proyectos</h2>",
      "<table><thead><tr><th>Elemento</th><th>Diseño del piloto</th></tr></thead><tbody><tr><td>Pregunta de aprendizaje</td><td>¿Un curso virtual de cuatro semanas permite que las organizaciones produzcan un perfil de proyecto?</td></tr><tr><td>Participantes</td><td>10 organizaciones comunitarias</td></tr><tr><td>Duración</td><td>6 semanas</td></tr><tr><td>Indicadores</td><td>% que completa el curso; % que entrega un perfil; satisfacción</td></tr><tr><td>Decisión</td><td>Si al menos la mitad entrega un perfil, ajustar y escalar; si no, rediseñar</td></tr></tbody></table>",
      "<h2>Herramientas de cocreación</h2>",
      "<ul><li>Mapas de empatía y de actores.</li><li>Entrevistas y observación en campo.</li><li>Lluvia de ideas y priorización de ideas.</li><li>Prototipos en papel o maquetas simples.</li><li>Sesiones de retroalimentación con usuarios.</li></ul>",
      "<h2>Métricas de aprendizaje</h2>",
      "Además de medir resultados, mide qué se aprendió: ¿qué supuestos se confirmaron?, ¿cuáles no?, ¿qué ajustes harías? Documentar los aprendizajes es parte del valor del piloto.",
      "<h2>Criterios para decidir si se escala</h2>",
      "<ul><li>Resultados positivos frente a las metas del piloto.</li><li>Aceptación por parte de los usuarios.</li><li>Costos que se puedan sostener.</li><li>Capacidad del equipo y de los aliados para ampliarlo.</li></ul>"
    ]
  },
  "senales-diagnostico-organizacional": {
    tituloSeo: "Diagnóstico organizacional: 5 señales para hacerlo",
    descripcion: "Cinco señales de que tu organización necesita un diagnóstico organizacional y qué resultados obtiene con él.",
    imagenAlt: "Equipo de una organización conversando sobre su diagnóstico",
    respuesta: "Una organización necesita un diagnóstico cuando las prioridades no están claras, los mismos problemas se repiten, está creciendo o cambiando, va a hacer planeación estratégica o formular proyectos, o le cuesta mostrar resultados. El diagnóstico ordena capacidades, brechas y oportunidades para decidir con información.",
    faq: [
      { q: "¿Cuánto dura un diagnóstico organizacional?", a: "Depende del tamaño de la organización y del alcance. Puede tomar desde unas pocas semanas hasta un par de meses, incluyendo recolección de información, análisis y entrega de recomendaciones." },
      { q: "¿Qué dimensiones se revisan?", a: "Normalmente gobierno, planeación, gestión de proyectos, gestión administrativa y financiera, talento, alianzas, comunicación y sostenibilidad." },
      { q: "¿Qué se entrega al final?", a: "Un informe con hallazgos, una matriz de oportunidades de mejora y recomendaciones priorizadas, que sirven de base para un plan de fortalecimiento." }
    ],
    extra: [
      "<h2>Dimensiones que suele revisar un diagnóstico</h2>",
      "<table><thead><tr><th>Dimensión</th><th>Preguntas guía</th></tr></thead><tbody><tr><td>Gobierno</td><td>¿Hay estatutos vigentes, junta activa y actas al día?</td></tr><tr><td>Planeación</td><td>¿Existen misión, objetivos y un plan de acción?</td></tr><tr><td>Proyectos</td><td>¿Se formulan, ejecutan y reportan con orden?</td></tr><tr><td>Administración y finanzas</td><td>¿Hay presupuestos, contabilidad y control?</td></tr><tr><td>Talento</td><td>¿Roles claros, formación y relevo?</td></tr><tr><td>Sostenibilidad</td><td>¿Ingresos diversificados y alianzas activas?</td></tr></tbody></table>",
      "<h2>De los hallazgos a la acción</h2>",
      "Un buen diagnóstico termina en decisiones: se priorizan las brechas con mayor efecto, se define una ruta de fortalecimiento con responsables y plazos, y se acuerdan indicadores para medir el avance. Revisa también la guía de <a href='blog/planeacion-estrategica-para-esal-paso-a-paso.html'>planeación estratégica para ESAL</a>."
    ]
  },
  "que-es-el-marco-logico": {
    tituloSeo: "Qué es el marco lógico y para qué sirve",
    descripcion: "Qué es el marco lógico, sus componentes y para qué sirve en la formulación de proyectos sociales de organizaciones y ESAL.",
    imagenAlt: "Matriz de marco lógico y notas de planeación sobre una mesa",
    respuesta: "El marco lógico es una matriz que organiza un proyecto en cuatro niveles —objetivo general, resultados, actividades e insumos— y los relaciona con indicadores, fuentes de verificación y supuestos. Sirve para comprobar que el proyecto es coherente y para planear su seguimiento y evaluación.",
    faq: [
      { q: "¿Para qué sirve el marco lógico?", a: "Para estructurar un proyecto con coherencia, comunicar con claridad qué se quiere lograr y cómo se verificará, y facilitar el seguimiento y la evaluación." },
      { q: "¿Es lo mismo el marco lógico que la matriz de marco lógico?", a: "El marco lógico es el enfoque o metodología; la matriz es el resumen en forma de tabla donde se consignan objetivos, indicadores, fuentes de verificación y supuestos." },
      { q: "¿Se puede usar en una organización pequeña?", a: "Sí. Una versión sencilla, con pocos resultados e indicadores, ya ayuda a ordenar las ideas y a presentar proyectos más sólidos." }
    ],
    extra: [
      "<h2>Las cuatro columnas de la matriz</h2>",
      "<table><thead><tr><th>Columna</th><th>Qué contiene</th></tr></thead><tbody><tr><td>Resumen narrativo</td><td>Objetivo general, resultados y actividades.</td></tr><tr><td>Indicadores</td><td>Cómo se medirá el logro de cada nivel.</td></tr><tr><td>Fuentes de verificación</td><td>De dónde saldrá la información para medir.</td></tr><tr><td>Supuestos</td><td>Condiciones externas necesarias para que el proyecto funcione.</td></tr></tbody></table>",
      "<h2>Cómo se relaciona con el resto del proyecto</h2>",
      "El marco lógico se construye a partir del árbol de problemas y objetivos, y alimenta el cronograma, el presupuesto y el plan de seguimiento. Mira la guía completa de <a href='blog/como-formular-un-proyecto-social.html'>cómo formular un proyecto social</a> y la de <a href='blog/indicadores-para-proyectos-sociales.html'>indicadores</a>."
    ]
  },
  "preparate-para-buscar-financiacion": {
    tituloSeo: "Prepara tu ESAL antes de buscar financiación",
    descripcion: "Cómo preparar tu organización antes de buscar financiación: objetivos, elegibilidad, documentos, proyecto y hoja de ruta de convocatorias.",
    imagenAlt: "Asesoría a una organización para preparar su búsqueda de financiación",
    respuesta: "Antes de buscar financiación conviene definir qué se quiere financiar, revisar la elegibilidad de cada fuente, organizar los documentos legales y financieros, tener un proyecto bien estructurado y armar una hoja de ruta de oportunidades con fechas y responsables. Ningún proceso garantiza la aprobación.",
    faq: [
      { q: "¿Qué documentos suelen pedir las convocatorias?", a: "Certificado de existencia y representación legal, estatutos, RUT, estados financieros, certificaciones de experiencia y hojas de vida del equipo, además de los formatos propios de cada convocatoria." },
      { q: "¿Cuánto tiempo antes conviene prepararse?", a: "Lo ideal es tener los documentos y un perfil de proyecto listos antes de que se abran las convocatorias, porque los plazos de postulación suelen ser cortos." }
    ],
    extra: [
      "<h2>Lista de preparación en cinco pasos</h2>",
      "<ol><li>Definir la necesidad y el alcance de la iniciativa.</li><li>Identificar fuentes y revisar su elegibilidad.</li><li>Actualizar documentos legales, tributarios y financieros.</li><li>Estructurar el proyecto (marco lógico, presupuesto, cronograma).</li><li>Armar la hoja de ruta con fechas y responsables.</li></ol>",
      "Para profundizar, consulta las <a href='blog/fuentes-de-financiacion-para-esal-en-colombia.html'>fuentes de financiación para ESAL en Colombia</a>."
    ]
  }
};

(() => {
  if (typeof BLOG_POSTS === "undefined") return;
  BLOG_POSTS.forEach((p) => {
    const s = BLOG_SEO[p.slug];
    if (!s) return;
    const { extra, ...datos } = s;
    Object.assign(p, datos);
    if (extra && !p.__ampliado) {
      p.contenido.splice(p.contenido.length - 1, 0, ...extra); /* antes del párrafo de cierre */
      p.__ampliado = true;
    }
  });
})();
