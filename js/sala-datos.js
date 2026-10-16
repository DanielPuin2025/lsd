// ===== Preguntas del quiz en sala (recordatorio de la charla) =====
// t=tema, q=pregunta, o=opciones, c=índice correcto, e=explicación. Lo usan el navegador y server.js
const PREGS=[
{t:"Depresoras",q:"¿Qué hacen las depresoras con el sistema nervioso?",o:["Lo enlentecen","Lo aceleran","Cambian los colores"],c:0,e:"Lo enlentecen: dan sueño, relajación y bajan la respiración y el ritmo del corazón."},
{t:"Depresoras",q:"¿Qué es especialmente peligroso con las depresoras?",o:["Tomarlas con agua","Mezclarlas entre sí","Dormir después"],c:1,e:"Mezclarlas multiplica el riesgo de sobredosis y puede detener la respiración."},
{t:"Depresoras",q:"¿Cuál es una consecuencia a largo plazo de las depresoras?",o:["Dependencia y síndrome de abstinencia","Más estatura","Mejor memoria"],c:0,e:"Pueden causar dependencia, abstinencia, problemas de hígado y del estado de ánimo."},
{t:"Estimulantes",q:"¿Qué hacen las estimulantes con el sistema nervioso?",o:["Lo enlentecen","Lo aceleran","No lo afectan"],c:1,e:"Lo aceleran: dan energía y euforia falsas, y después llega un bajón."},
{t:"Estimulantes",q:"¿Cuál es un efecto típico de los estimulantes?",o:["Mucho sueño","Bajar la presión","Acelerar el corazón y quitar el sueño"],c:2,e:"Aceleran el corazón, suben la presión y la temperatura, y quitan el sueño y el hambre."},
{t:"Estimulantes",q:"¿Qué se sabe del tusi?",o:["Es un medicamento seguro","No se sabe qué contiene, por eso es muy riesgoso","Es igual al alcohol"],c:1,e:"Del tusi no se sabe qué contiene: es muy riesgoso."},
{t:"Alucinógenas",q:"¿En qué afectan principalmente las alucinógenas?",o:["En la percepción de la realidad","Solo en el apetito","En la estatura"],c:0,e:"Alteran cómo ves, oyes y sientes, y pueden causar pánico y confusión."},
{t:"Alucinógenas",q:"¿Qué afecta además la marihuana?",o:["La atención, la memoria y la coordinación","El color de ojos","La estatura"],c:0,e:"Afecta la atención, la memoria y la coordinación."},
{t:"Alucinógenas",q:"¿Qué riesgo tienen en adolescentes?",o:["Ninguno","Agravar problemas de salud mental y bajar el rendimiento escolar","Mejorar las notas"],c:1,e:"Pueden causar ansiedad, flashbacks, bajo rendimiento y agravar problemas de salud mental."}
];
if(typeof module!=='undefined')module.exports=PREGS;
