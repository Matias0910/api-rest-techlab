# 🚀 [api-rest-salazar] API REST

Una API RESTful construida con **Node.js** y **Express** para gestionar productos y autenticación de usuarios, utilizando **Firebase Firestore** como base de datos y **JSON Web Tokens (JWT)** para la seguridad.



## 📋 Tabla de Contenidos

* [Características](#características)
* [Tecnologías](#tecnologías)
* [Requisitos](#requisitos)
* [Instalación](#instalación)
* [Configuración de Firebase](#configuración-de-firebase)
* [Scripts Disponibles](#scripts-disponibles)
* [Endpoints de la API](#endpoints-de-la-api)

---

## ✨ Características

* **Autenticación JWT:** Registro (`/register`) e inicio de sesión (`/login`) con tokens de acceso seguro.
* **CRUD de Productos:** Gestión completa de productos (Crear, Leer, Actualizar, Eliminar).
* **Filtrado Avanzado:** Búsqueda de productos por **categoría** de forma *case-insensitive* (sin distinguir mayúsculas/minúsculas).
* **Seguridad:** Uso de middleware para proteger rutas que requieren autenticación.
* **Base de Datos NoSQL:** Persistencia de datos mediante Firebase Firestore.

---

## 💻 Tecnologías

* **Node.js**
* **Express.js** (Framework web)
* **Firebase Firestore** (Base de Datos)
* **bcrypt** (Hasheo de contraseñas)
* **jsonwebtoken** (Generación y verificación de tokens)
* **dotenv** (Gestión de variables de entorno)

---

## ⚙️ Requisitos

Asegúrate de tener instalado lo siguiente:

* **Node.js** (versión recomendada: LTS)
* **npm** 

---

## 📦 Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://aws.amazon.com/es/what-is/repo/](https://aws.amazon.com/es/what-is/repo/)
    cd [api-rest-salazar]
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

---

## 🔑 Configuración de Firebase

Este proyecto requiere un archivo `.env` en la raíz con las siguientes variables configuradas:

```env
# Variables de entorno
PORT=3000
JWT_SECRET="[TU_SECRETO_JWT_LARGO_Y_COMPLEJO]"

# Credenciales de Firebase (Obtenidas de la configuración de tu proyecto)
FIREBASE_API_KEY="[Tu clave API]"
FIREBASE_AUTH_DOMAIN="[Tu dominio de Auth]"
FIREBASE_PROJECT_ID="[Tu ID de Proyecto]"
FIREBASE_STORAGE_BUCKET="[Tu Bucket de Storage]"
FIREBASE_MESSAGING_SENDER_ID="[Tu ID de Sender]"
FIREBASE_APP_ID="[Tu ID de App]"
