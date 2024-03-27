# Sistema de Gestión de Citas para Software Nutricional

<details>
  <summary>Contenido 📝</summary>
  <ol>
    <li><a href="#descripcion-del-proyecto">Descripción del Proyecto</a></li>
    <li><a href="#funcionalidades-principales">Funcionalidades Principales</a></li>
    <li><a href="#funcionalidades-adicionales">Funcionalidades Adicionales</a></li>
    <li><a href="#tecnologías-utilizadas">Tecnologías Utilizadas</a></li>
    <li><a href="#estructura-del-repositorio">Estructura del Repositorio</a></li>
    <li><a href="#instrucciones-para-instalación-local">Instrucciones para Instalación Local</a></li>
    <li><a href="#urls">URLs</a></li>
    <li><a href="#objetivo">Objetivo</a></li>
    <li><a href="#sobre-el-proyecto">Sobre el proyecto</a></li>
  </ol>
</details>

## Descripción del Proyecto

Este proyecto se centra en el desarrollo del frontend para un sistema de gestión de citas destinado a servicios de nutrición. El objetivo principal es proporcionar a los clientes la capacidad de registrarse, realizar el inicio de sesión, acceder a su área personal, gestionar citas y ver información sobre dietistas-nutricionistas. Además, se incluyen funcionalidades extra para roles de superadmin y validaciones adicionales.

### Funcionalidades Principales

1. **Usuarios**
   - Registro de usuarios.
   - Inicio de sesión de usuarios.
   - Perfil de usuario.
   - Modificación de datos del perfil.
   - Ver plan nutricional

2. **Dietistas**
   - Registro de usuarios.
   - Inicio de sesión de usuarios.
   - Perfil de usuario.
   - Modificación de datos del perfil.
   - Crear y ver plan nutricional

3. **Admin**
   - Registro de nuevos usuarios con asignación de rol.
   - Inicio de sesión de usuarios.
   - Perfil de usuario.
   - Modificación de datos del perfil.

2. **Citas**
   - Creación de citas.
   - Visualización de todas las citas como cliente (solo las propias).
   - Visualización de todas las citas existentes con el dietista (role dietista).
   - Visualización, creación y modificación de citas (role admin).


### Funcionalidades Adicionales (Extra)

1. **Detalles de Citas (Extra)**
   - Visualización detallada de una cita.
   - Visualización detallada de un plan nutricional.

3. **Crear cita**
   - Escoger el tipo de servicio en las citas.

## Tecnologías Utilizadas

- Reactjs + Redux
- Bootstrap
## Estructura del Repositorio

- Se utiliza github para organizar el desarrollo con ramas específicas.
- Commits regulares y descriptivos para reflejar la evolución del proyecto.

## Instrucciones para Instalación Local

1. Clona este repositorio: `git clone https://github.com/monicasilvaa/Frontend_Proyecto5`
2. Instala las dependencias: `npm install`
3. Para la ejecución de la aplicación en desarrollo: `npm run dev`
4. Ejecuta la aplicación: `npm start`

## URLs

- **Registro de Usuarios**: `/register`
- **Inicio de Sesión**: `/login`
- **Perfil de Usuario**: `/profile`
- **Creación de Citas (Clientes)**: `/myAppointments`
- **Visualización de Citas como Cliente**: `/myAppointments`
- **Visualización de Citas con Dietista**: `/dietitianAppointments`
- **Visualización de los planes de un cliente**: `/dietplans/:clientId`

## Objetivo

Este proyecto tiene como objetivo proporcionar un frontend eficiente para el sistema de gestión de citas, cumpliendo con los requisitos del cliente y permitiendo futuras expansiones.

## Sobre el Proyecto

Este es el proyecto final a realizar para el Bootcamp Geekshubs Academy, destinado a desarrollar las habilidades en el manejo de tecnologías frontend y buenas prácticas de desarrollo.



