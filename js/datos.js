// ===== DATOS =====
// Aquí se editan los textos: personajes (D) y preguntas del quiz (Q).

// Personajes (nombres sutiles): n=nombre, i=imagen, a=nombre técnico,
// q=qué es, f=en qué afecta, t/m/l=efectos a corto/mediano/largo plazo
const D=[
{n:"Mari",i:"marihuana",a:"THC (cannabis)",q:"Planta cuyo componente principal, el THC, actúa sobre el cerebro. Puede consumirse de distintas formas.",f:"Afecta la atención, la memoria, la coordinación y la percepción del tiempo, y también el estado de ánimo.",t:"Risa, boca seca, ojos rojos, lentitud de reflejos y ansiedad en algunos casos.",m:"Problemas de atención y memoria, menor rendimiento escolar y menos motivación.",l:"Posible dependencia, afectación del desarrollo cerebral en adolescentes y daño pulmonar si se fuma."},
{n:"LSD",i:"lsd",a:"Ácido (alucinógeno)",q:"Sustancia sintética alucinógena que altera la percepción de la realidad.",f:"Afecta la percepción, el pensamiento y las emociones: cambia lo que ves, oyes y sientes.",t:"Alucinaciones, cambios de percepción, taquicardia y episodios de pánico (\"mal viaje\").",m:"Ansiedad, confusión y alteraciones del estado de ánimo.",l:"Recuerdos intrusos (flashbacks) y puede desencadenar o agravar problemas psiquiátricos."},
{n:"Hongui",i:"hongos",a:"Hongos con psilocibina",q:"Hongos que contienen psilocibina, una sustancia alucinógena de origen natural.",f:"Afectan la percepción, el estado de ánimo y el juicio; pueden causar confusión y miedo intenso.",t:"Alucinaciones, náuseas, cambios de ánimo y desorientación.",m:"Ansiedad y episodios de confusión; riesgo de accidentes.",l:"Posibles alteraciones de percepción persistentes y riesgo psicológico en personas vulnerables."},
{n:"Cris",i:"cristal",a:"Metanfetamina",q:"Estimulante sintético muy potente y altamente adictivo.",f:"Acelera el sistema nervioso: el corazón, la temperatura, el sueño y el apetito, y daña el cerebro.",t:"Mucha energía, taquicardia, subida de temperatura, agitación y falta de sueño y apetito.",m:"Paranoia, irritabilidad, pérdida de peso y problemas dentales.",l:"Dependencia fuerte, daño al corazón y al cerebro, psicosis y deterioro social."},
{n:"Tusi",i:"tussi",a:"\"Cocaína rosada\"",q:"Mezcla rosada de composición incierta que se vende con ese nombre; no se sabe con certeza qué contiene.",f:"Afecta el corazón, el estado de ánimo y la conciencia de forma impredecible.",t:"Agitación, taquicardia, confusión y riesgo de intoxicación grave.",m:"Ansiedad, problemas de sueño y deterioro del estado de ánimo.",l:"Riesgo de dependencia y daño a órganos; su composición variable la hace muy peligrosa."},
{n:"Éxtasi",i:"extasis",a:"MDMA",q:"Droga sintética que actúa como estimulante y alucinógeno suave, común en fiestas.",f:"Afecta el estado de ánimo, la temperatura corporal y el equilibrio de líquidos del cuerpo.",t:"Euforia, sensibilidad al tacto, deshidratación, aumento de temperatura y mandíbula tensa.",m:"Tristeza o ansiedad días después, cansancio y problemas de concentración.",l:"Alteraciones de memoria y del estado de ánimo, y posible daño a la regulación de la serotonina."},
{n:"Pasti",i:"pastillas",a:"Medicamentos mal usados",q:"Medicamentos como sedantes u opioides usados sin control médico.",f:"Enlentecen el sistema nervioso: provocan sueño y afectan la respiración y la memoria.",t:"Somnolencia, mareo, lentitud al respirar y confusión; riesgo de sobredosis.",m:"Tolerancia: se necesita más cantidad para el mismo efecto.",l:"Dependencia física, síndrome de abstinencia y riesgo de muerte por sobredosis."},
{n:"Peri",i:"perico",a:"Cocaína",q:"Estimulante en polvo que se obtiene de la hoja de coca; es muy adictivo.",f:"Afecta el corazón, la presión arterial y el cerebro, y genera una fuerte necesidad de volver a consumir.",t:"Energía breve, taquicardia, presión alta, ansiedad y riesgo de infarto.",m:"Insomnio, irritabilidad, pérdida de apetito y daño nasal.",l:"Dependencia intensa, problemas cardíacos, daño cerebral y deterioro familiar y económico."}
];

// Frases cortas de las burbujas (una por clic). La clave es el nombre de la imagen.
const TIPS={
"marihuana":["Soy Mari (THC). Afecto la atención, la memoria y la coordinación.", "En adolescentes puedo afectar el desarrollo del cerebro.", "Si me consumen seguido, el rendimiento escolar baja."],
"lsd":["Soy LSD, un alucinógeno: altero lo que ves, oyes y sientes.", "Un \"mal viaje\" puede ser pánico y confusión muy intensos.", "Mis efectos pueden volver días después (flashbacks)."],
"hongos":["Soy Hongui: tengo psilocibina, un alucinógeno natural.", "Natural no significa seguro: puedo causar miedo y confusión.", "Altero el juicio y eso puede provocar accidentes."],
"cristal":["Soy Cris (metanfetamina), un estimulante muy adictivo.", "Acelero el corazón y quito el sueño y el hambre.", "A largo plazo daño el cerebro, el corazón y los dientes."],
"tussi":["Soy Tusi: nadie sabe con certeza qué llevo dentro.", "Mi mezcla es impredecible y puede intoxicar gravemente.", "Lo que se vende como \"cocaína rosada\" no siempre es lo que dicen."],
"extasis":["Soy Éxtasi (MDMA): estimulante y alucinógeno suave.", "Subo la temperatura del cuerpo y deshidrato.", "Después pueden llegar la tristeza y la ansiedad."],
"pastillas":["Soy Pasti: medicamentos usados sin control médico.", "Enlentezco la respiración y doy mucho sueño.", "Mezclarme con otras sustancias aumenta el riesgo de sobredosis."],
"perico":["Soy Peri (cocaína), un estimulante en polvo muy adictivo.", "Acelero el corazón y subo la presión: hay riesgo de infarto.", "Genero una fuerte necesidad de volver a consumir."]
};

// Preguntas: q=pregunta, o=opciones, c=posición de la correcta, e=explicación
const Q=[
{q:"¿Qué significa L.S.D en esta página?",o:["Lenguaje Sutil sobre Drogas","Libre Sin Dependencia","Lista de Sustancias Dañinas"],c:0,e:"Es el nombre del proyecto educativo."},
{q:"¿Qué es lo más seguro frente a una presión de grupo para consumir?",o:["Probar solo una vez","Decir que no y buscar a un adulto de confianza","Ignorar los riesgos"],c:1,e:"Decir no es válido, y pedir ayuda ayuda siempre."},
{q:"El consumo de sustancias en la adolescencia puede afectar...",o:["El desarrollo del cerebro","Solo el estado de ánimo del día","Nada, si es ocasional"],c:0,e:"El cerebro sigue madurando hasta cerca de los 25 años."},
{q:"¿Qué línea de Colombia protege a niños, niñas y adolescentes?",o:["Línea 141 del ICBF","Línea 195","Línea 000"],c:0,e:"La Línea 141 del ICBF atiende casos de niñez y adolescencia."},
{q:"Si alguien tiene problemas con las drogas, lo mejor es...",o:["Burlarse","Apoyarlo y ayudarle a buscar atención profesional","Ocultarlo"],c:1,e:"La dependencia es un tema de salud y se puede tratar."}
];
