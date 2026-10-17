# Centro Médico — Monorepo

Proyecto unificado del ecosistema Centro Médico. Un solo backend API sirve a ambos frontends Angular (pacientes + administración) mediante autenticación por roles (Patient / Doctor / Secretary).

## Estructura

```
CentroMedico/
├── CentroMedico.sln
├── CentromedicoDatabase/          # Capa de datos (EF Core, 31 entidades, Identity)
├── Centromedico.Api/              # API unificada (.NET 5, pura, sin SPA)
│   └── Centromedico.Api/
├── CentromedicoCliente/           # Portal de pacientes
│   ├── CentromedicoCliente/      # (backend original, referencia)
│   ├── Cliente.DTO/
│   ├── Cliente.Repository/
│   └── CentromedicoCliente/ClientApp/   # Angular 12
└── CentromedicoDoctor/            # Panel de administración
    ├── CentromedicoDoctor/       # (backend original, referencia)
    ├── Doctor.DTO/
    ├── Doctor.Repository/
    └── CentromedicoDoctor/ClientApp/       # Angular 14
```

## Requisitos
- .NET SDK 5.0 (instalado: 5.0.408)
- Node.js 16+
- SQL Server (localhost\\MSSQLSERVER01) con base `centromedico`

## Cómo correr todo

### 1. Backend unificado
Abrir `CentroMedico.sln` en Visual Studio, establecer **Centromedico.Api** como proyecto de inicio y ejecutar (IIS Express → `https://localhost:44337`).  
O por CLI:
```bash
cd Centromedico.Api/Centromedico.Api
dotnet run   # https://localhost:44337
```
Swagger: `https://localhost:44337/swagger`

### 2. Frontend pacientes (Angular 12)
```bash
cd CentromedicoCliente/CentromedicoCliente/ClientApp
npm install
npm start     # http://localhost:4211
```

### 3. Frontend administración (Angular 14)
```bash
cd CentromedicoDoctor/CentromedicoDoctor/ClientApp
npm install
npm start     # http://localhost:4200
```

### 4. Base de datos
La connection string está en `Centromedico.Api/.../appsettings.json` (gitignored por el .gitignore del doctor).  
Usar `appsettings.Development.json` o variables de entorno para credenciales reales.

## Secretos
Los secretos (AWS, Twilio, JWT) se manejan por variables de entorno / `dotnet user-secrets`.  
Los archivos `appsettings.json` con valores reales están gitignored; se suben placeholders.

## Build completo
```bash
dotnet build CentroMedico.sln   # 0 errores
```

## Notas
- Los proyectos API originales (`CentromedicoCliente/CentromedicoCliente` y `CentromedicoDoctor/CentromedicoDoctor`) se mantienen como referencia hasta validar la fusión.
- Los repositorios originales (`centromedico_cliente`, `centromedico_doctor`, `centromedico_database`) se mantienen en GitHub con su historial.
- Auditoría de diseño y PRODUCT.md del portal de pacientes están en `CentromedicoCliente/`.
