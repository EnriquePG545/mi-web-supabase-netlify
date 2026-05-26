# Puesto 325 - Mercado Unicachi

Pagina web estatica para un puesto de abarrotes del mercado Unicachi.

## Que incluye

- Landing page comercial en `index.html`.
- Estilos responsivos en `styles.css`.
- Menu movil en `script.js`.
- Panel administrativo demo en `admin.html`.
- Estilos y logica del panel en `admin.css` y `admin.js`.
- Configuracion simple para Netlify en `netlify.toml`.

## Panel admin demo

La web publica tiene un boton `Admin` que abre `admin.html`.

Credenciales temporales:

- Usuario: `admin`
- Contrasena: `puesto325`

El panel permite ver y agregar datos de ejemplo para:

- Inventario.
- Ventas.
- Registros.

Importante: este login es solo una demostracion porque el repositorio es publico y el usuario/contrasena quedan visibles en el codigo. Para uso real hay que reemplazarlo por Supabase Auth y guardar inventario, ventas y registros en tablas de Supabase.

## Productos destacados

- Arroz y azucar por kilo o por saco.
- Menestras por kilo o por saco.
- Cafes.
- Galletas por caja.
- Aceites.
- Papel toalla y papel higienico.
- Otras categorias de abarrotes y productos para el hogar.

## Publicar en Netlify

1. En Netlify, crea un sitio nuevo desde GitHub.
2. Selecciona este repositorio: `EnriquePG545/mi-web-supabase-netlify`.
3. Usa la rama `main`.
4. Deja el comando de build vacio.
5. Usa `.` como carpeta de publicacion si Netlify lo solicita.

## Datos por cambiar antes de publicar

- Nombre final del negocio si cambia de `Puesto 325`.
- Numero de WhatsApp en `index.html`.
- Horario de atencion.
- Direccion mas exacta dentro del mercado si deseas agregarla.
- Fotos reales del puesto cuando las tengas.
- Autenticacion real del panel admin usando Supabase Auth.
