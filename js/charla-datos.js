// ===== DATOS DE LA CHARLA =====
// Tres categorías: dep (depresoras), est (estimulantes), per (alucinógenas).
// q=qué son, af=en qué afectan, co=consecuencias, pr/op/ok/ex=pregunta final
const CAT={
dep:{nom:"Depresoras",img:"pastillas",guia:"Pastillas",
 q:"Las depresoras son sustancias que ENLENTECEN el sistema nervioso. Entre ellas están el alcohol, los sedantes y los opioides (algunas pastillas).",
 af:"Producen sueño, relajación, lentitud al hablar y moverse, y bajan la respiración y el ritmo del corazón. También afectan la memoria y el juicio.",
 co:"A corto plazo: accidentes, mareos y riesgo de sobredosis. A largo plazo: dependencia, síndrome de abstinencia, problemas de hígado y del estado de ánimo. Mezcladas entre sí pueden detener la respiración.",
 pr:"¿Qué es especialmente peligroso con las depresoras?",
 op:["Mezclarlas entre sí, porque puede fallar la respiración","Tomarlas con agua","Dormir después"],ok:0,
 ex:"Mezclar depresoras multiplica el riesgo de sobredosis."},
est:{nom:"Estimulantes",img:"perico",guia:"Perico",
 q:"Las estimulantes ACELERAN el sistema nervioso. Aquí están la cocaína (perico), la metanfetamina (cristal) y mezclas como el tusi y el éxtasis.",
 af:"Dan energía y euforia falsas, aceleran el corazón, suben la presión y la temperatura y quitan el sueño y el hambre. Después llega un bajón de cansancio y tristeza.",
 co:"A corto plazo: ansiedad, taquicardia, riesgo de infarto. A largo plazo: dependencia fuerte, paranoia, daño al corazón y al cerebro y deterioro familiar y económico. Del tusi no se sabe qué contiene: es muy riesgoso.",
 pr:"¿Cuál es un efecto típico de los estimulantes?",
 op:["Acelerar el corazón y quitar el sueño","Dar mucho sueño","Bajar la presión"],ok:0,
 ex:"Aceleran el cuerpo y pueden causar problemas del corazón."},
per:{nom:"Alucinógenas",img:"lsd",guia:"LSD",
 q:"Las alucinógenas o perturbadoras ALTERAN la percepción: cómo ves, oyes y sientes. Incluyen LSD, hongos y, en parte, la marihuana.",
 af:"Cambian los colores, los sonidos y el tiempo, y pueden causar alucinaciones, confusión y miedo intenso. La marihuana además afecta la atención, la memoria y la coordinación.",
 co:"A corto plazo: pánico, desorientación y accidentes. A largo plazo: ansiedad, flashbacks, bajo rendimiento escolar, riesgo de dependencia y de agravar problemas de salud mental, sobre todo en adolescentes.",
 pr:"¿En qué afectan principalmente las alucinógenas?",
 op:["En la percepción de la realidad","Solo en el apetito","En la estatura"],ok:0,
 ex:"Alteran la percepción y pueden provocar crisis de pánico."}
};
