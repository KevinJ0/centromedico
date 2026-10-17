# Centro Médico — Monorepo

Proyecto unificado del ecosistema Centro Médico, que consolida las tres capas en un solo repositorio:

- **`CentromedicoDatabase/`** — Capa de datos central (EF Core, 31 entidades, ASP.NET Identity sobre SQL Server). Compartida por ambas APIs.
- **`CentromedicoCliente/`** — Portal de pacientes: API ASP.NET Core 5 (JWT) + SPA Angular 12 (Material).
- **`CentromedicoDoctor/`** — Panel de administración: API ASP.NET Core 5 (JWT, roles, SignalR) + SPA Angular 14 (Material).

## Estructura

```
CentroMedico/
├── CentroMedico.sln
├── CentromedicoDatabase/
├── CentromedicoCliente/
│   ├── CentromedicoCliente/   (API + ClientApp Angular 12)
│   ├── Cliente.DTO/
│   └── Cliente.Repository/
└── CentromedicoDoctor/
    ├── CentromedicoDoctor/    (API + ClientApp Angular 14)
    ├── Doctor.DTO/
    └── Doctor.Repository/
```

## Build

```bash
dotnet build CentroMedico.sln
```

## Frontend (paciente)

```bash
cd CentromedicoCliente/CentromedicoCliente/ClientApp
npm install
npm start   # http://localhost:4211
```

## Frontend (administración)

```bash
cd CentromedicoDoctor/CentromedicoDoctor/ClientApp
npm install
npm start
```

## Notas

- Los proyectos referencian `CentromedicoDatabase` mediante `ProjectReference` relativo (`..\..\CentromedicoDatabase\...`).
- Historial de los repositorios originales (`centromedico_cliente`, `centromedico_doctor`, `centromedico_database`) se mantiene en sus repos individuales en GitHub.
