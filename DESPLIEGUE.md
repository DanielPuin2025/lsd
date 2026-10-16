# Despliegue y conservación de las salas

## EasyPanel

En `lsd-app`, configura estas dos opciones antes de desplegar:

1. En **Almacenamiento**, agrega un volumen persistente con la ruta de montaje `/data`.
2. En **Entorno**, agrega `DATA_DIR=/data`.

El servicio escucha en `0.0.0.0` y usa el puerto que EasyPanel proporciona mediante `PORT`. Mantén el dominio apuntando al puerto interno `3000`.

Despliega la rama `main` solo después de guardar ambas opciones. No elimines el volumen `/data`: contiene `rooms.json`, con las salas en curso y los resultados de las salas cerradas. Al iniciar, el servidor comprueba que puede leer y escribir el archivo y se detiene con un error explícito si el archivo no se puede leer o tiene un formato no válido.

Las salas y los resúmenes cerrados se conservan para que se puedan consultar con el código y la clave de administrador. El cierre ya no borra una sala. El almacenamiento JSON está diseñado para una sola instancia del servicio; no aumentes las réplicas.

## Copias de seguridad

El volumen protege los datos frente a reinicios y nuevos despliegues, pero no frente al borrado del volumen o a un fallo del servidor. Antes de cada jornada de pruebas y de la sustentación, abre **Almacenamiento** en EasyPanel, pulsa **Crear copia de seguridad de volumen** y confirma que la copia aparece en la lista. Guarda además una copia fuera del servidor. No publiques `rooms.json` ni sus copias: contienen las claves de administrador y las respuestas de las salas.

## Prueba de persistencia

Ejecuta `npm test` para crear una sala de prueba, guardar respuestas, cerrarla, reiniciar el servidor y verificar que el resumen sigue disponible.
