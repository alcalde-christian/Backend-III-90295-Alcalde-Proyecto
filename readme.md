
# Proyecto Final - Backend III (Coderhouse)

Este proyecto es una API desarrollada como parte del curso **Backend III** de **Coderhouse**. El objetivo principal es gestionar carritos de compra y realizar operaciones de checkout utilizando **Node.js**, **Express**, **MongoDB** y **Docker**.

---

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- **Node.js** (versión 20.12.1 o compatible)
- **Docker** (con soporte para WSL2 en Windows, si aplica)
- **MongoDB** (base de datos configurada y en ejecución)
- **Postman** o cualquier cliente para probar endpoints (opcional)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/alcalde-christian/Backend-III-90295-Alcalde-Proyecto.git
cd proyecto-final-backend-iii
```

### 2. Configurar el entorno

Crea un archivo `.env` en la raíz del proyecto con las variables provistas por privado:

```env
PORT=8080
MONGO_URL=url_de_ejemplo
SECRET_KEY=clave_de_ejemplo
```

> **Nota:** Asegúrate de usar tu propia configuración de MongoDB.

### 3. Construir la imagen Docker

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
docker build -t proyecto_final_backend_iii .
```

### 4. Ejecutar el contenedor

Inicia el proyecto con:

```bash
docker run -p 8080:8080 --env-file .env proyecto_final_backend_iii
```

### Método alternativo

Ingresar al siguiente enlace:

```
https://hub.docker.com/r/cra2008/proyecto_final_backend_iii
```

Descarga la imagen mediante el siguiente comando:

```bash
docker pull cra2008/proyecto_final_backend_iii
```

---

## Endpoints Principales

### Carritos
- **POST** `/api/carts/:cid/product/:pid`: Agregar un producto al carrito.
- **PUT** `/api/carts/:cid/product/:pid`: Actualizar la cantidad de un producto.

### Productos
- **GET** `/api/products`: Listar productos disponibles.
- **GET** `/api/products/:pid`: Obtener información de un producto específico.

---

## Documentación de APIs

La documentación está disponible en [http://localhost:8080/api-docs](http://localhost:8080/api-docs).  

---

## Tests

El proyecto incluye pruebas realizadas con **Supertest**. Para ejecutarlas:

1. Asegúrate de que la base de datos esté configurada.
2. Ejecuta:

```bash
    npm run test:jwt
    npm run test:bcrypt
    npm run test:models
    npm run supertest:products
    npm run supertest:carts
```

---

## Información adicional

- **Curso:** Backend III - Coderhouse
- **Desarrollador:** Christian Alcalde
- **Versión Node.js:** 20.12.1
- **Versión Docker:** 28.0.4
