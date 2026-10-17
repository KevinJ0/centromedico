# Plan: Fusión de Backends (CentromedicoCliente + CentromedicoDoctor) en una sola API

**Objetivo:** unificar las dos APIs ASP.NET Core 5 en un único backend que sirva a ambos frontends Angular (paciente + admin) mediante autenticación por roles.

**Estado actual:** monorepo `CentroMedico` con dos APIs separadas que comparten `CentromedicoDatabase` (EF Core + Identity). Cada una tiene su propio `Startup`, controllers, services, DTOs y frontend SPA.

---

## 1. Inventario y diferencias

### 1.1 Controllers

| Controller | Cliente | Doctor | Acción |
|---|---|---|---|
| AccountController | ✅ Roles: Patient | ✅ Roles: Doctor, Secretary | Fusionar (endpoints por rol) |
| TokenController | ✅ | ✅ | Fusionar (un solo emisor JWT) |
| EspecialidadesController | ✅ | ✅ | Fusionar (mismo dominio) |
| Horarios_MedicosController | ✅ | ✅ | Fusionar |
| SegurosController | ✅ | ✅ | Fusionar |
| CitasController | ✅ (paciente) | ✅ (doctor) | **Renombrar** → `CitasPacienteController` / `CitasDoctorController` o usar rutas por dominio |
| MedicosController | ✅ | ❌ | Mover a unified |
| PreguntasController | ✅ | ❌ | Mover |
| ResultadosController | ✅ | ❌ | Mover |
| GruposController | ❌ | ✅ | Mover |
| PacienteController | ❌ | ✅ | Mover |
| ServiciosController | ❌ | ✅ | Mover |
| TurnosController | ❌ | ✅ | Mover |

### 1.2 Services (interfaces)

Cliente: `IAccount, ICita, IHorarioMedico, IToken, IMedico, ISeguro, IPregunta, IS3, IEmail, INotification, IWhatsapp, ITwilio`
Doctor: `IAccount, ICita, IServicio, ISeguro, IHorarioMedico, IPaciente, INotification, IEmail, IGrupo, IEspecialidad, ITurno, IDatabaseChangeNotification`

Solapamiento: `IAccount, ICita, ISeguro, IHorarioMedico, INotification, IEmail`. Únicos por lado como arriba.

### 1.3 Roles (Identity, compartido en DB)
- Cliente: `"Patient"` (también acepta `"Client"` en policy)
- Doctor: `"Doctor"`, `"Secretary"`
- Policy unificada: `RequireLoggedIn` → `"Patient", "Client", "Doctor", "Secretary"`

### 1.4 Startup diferencias clave

| Aspecto | Cliente | Doctor |
|---|---|---|
| CORS | `AllowAnyOrigin` | Orígenes explícitos + credentials |
| SignalR | ❌ | ✅ Hub `/notificacion` + SqlTableDependency |
| SPA proxy | puerto 4211 | puerto 4200 |
| AWS S3 | `AddAWSService` | `BasicAWSCredentials` manual |
| Swagger | "Centro Medico Cliente Api" | (no configurado en el snippet) |
| Identity error describer | default | `SpanishIdentityErrorDescriber` |
| Exception filter | ✅ | ✅ |
| AutoMapper | `MappingProfile` (Cliente) | `MappingProfile` (Doctor) |

### 1.5 Frontends
- Cliente Angular 12 → `http://localhost:4211` (dev)
- Doctor Angular 14 → `http://localhost:4200` (dev)
- Ambos consumen `/api/...` y `/notificacion` (SignalR, solo doctor hoy).

---

## 2. Estrategia de fusión

**Enfoque: un único proyecto API `Centromedico.Api` que absorbe ambos.** Mantener los dos proyectos Angular separados (versiones distintas) pero apuntando a la misma URL base.

### Principios
1. **No romper lo que funciona**: mantener namespaces existentes (`CentromedicoCliente.*`, `CentromedicoDoctor.*`) coexistiendo en el proyecto unificado para minimizar cambios de using. Renombrar solo donde haya colisión de nombres de clase.
2. **Roles como frontera**: cada endpoint declara sus roles (`[Authorize(Roles="Patient")]` vs `[Authorize(Roles="Doctor,Secretary")]`). El mismo JWT sirve para ambos.
3. **Rutas por dominio**: endpoints del paciente bajo `/api/...` (como hoy) y del doctor bajo `/api/...` (como hoy). Como los nombres de controller difieren en varios casos, no hay colisión de rutas. Donde colisionan (Account, Token, Citas, Especialidades, Horarios, Seguros), renombrar el controller del doctor o usar `[Route("api/doctor/[controller]")]`.
4. **SignalR unificado**: un solo hub `/notificacion` con autorización por rol.
5. **CORS**: permitir ambos orígenes dev (4211, 4200) + producción.
6. **SPA**: el backend unificado NO sirve SPA (cada frontend se despliega aparte o vía proxy). Eliminar `UseSpa`/`AddSpaStaticFiles` del backend unificado (o dejar solo uno). Mejor: backend puro API + frontends independientes.

---

## 3. Plan por fases

### Fase 0 — Preparación (sin código)
- [ ] Decidir nombre del proyecto unificado: `Centromedico.Api` (sugerido).
- [ ] Decidir si se mantiene la SPA servida por el backend (no recomendado para dos frontends). Recomendación: backend puro API.
- [ ] Confirmar que ambos `appsettings.json` (con secrets reales) se manejan por entorno (ya gitignored en doctor; añadir client).

### Fase 1 — Crear proyecto unificado
- [ ] Crear `Centromedico.Api/Centromedico.Api.csproj` (SDK Web, net5.0) con las mismas PackageReferences de ambos (unión).
- [ ] Crear `Startup.cs` unificado:
  - Identity + EF (compartido, como hoy).
  - JWT con `LlaveSecreta` (un solo issuer/audience).
  - AutoMapper con ambos `MappingProfile`.
  - DI: registrar todos los services/repos de ambos (prefijar namespaces para evitar colisión).
  - CORS: orígenes 4211 + 4200 + producción.
  - SignalR + `SqlDependencyService` (del doctor).
  - AWS S3 (usar el enfoque del doctor, más limpio).
  - Swagger (un solo doc "Centro Medico API").
  - ExceptionFilter, InvalidModelStateResponseFactory (del cliente, mejor UX).
- [ ] `Program.cs` estándar.
- [ ] `appsettings.json` unificado (sin secrets; usar placeholders + env vars).
- [ ] Agregar al `CentroMedico.sln`.

### Fase 2 — Migrar controllers
- [ ] Copiar todos los controllers de ambos proyectos al nuevo proyecto.
- [ ] Resolver colisiones de nombre:
  - `AccountController` → mantener uno, fusionar endpoints (roles por método).
  - `TokenController` → mantener uno.
  - `CitasController` → renombrar doctor a `CitasDoctorController` (o `CitasController` con rutas `/api/citas/doctor`).
  - `EspecialidadesController`, `Horarios_MedicosController`, `SegurosController` → fusionar (mismo dominio, mismos métodos probablemente).
- [ ] Ajustar namespaces/usings (`CentromedicoCliente.Controllers` → `Centromedico.Api.Controllers` o mantener).
- [ ] Verificar rutas no colisionan (`[Route("api/[controller]")]`).

### Fase 3 — Migrar services, repos, DTOs, profiles
- [ ] Copiar `Services/`, `Services/Interfaces/`, `Services/Helpers/`, `Profiles/`, `Exceptions/` de ambos.
- [ ] Copiar `Cliente.DTO`, `Cliente.Repository`, `Doctor.DTO`, `Doctor.Repository` como carpetas del proyecto (o mantener como proyectos separados referenciados). Recomendación: mantener como proyectos separados para no romper referencias, pero ambos referenciados por `Centromedico.Api`.
- [ ] Resolver colisiones de interfaces (`ICitaService` existe en ambos con firmas distintas). Opción: renombrar a `ICitaPacienteService` / `ICitaDoctorService`, o unificar firma. Recomendación: renombrar para no romper.
- [ ] `MappingProfile` de ambos → registrar ambos en AutoMapper.

### Fase 4 — SignalR y notificaciones
- [ ] Copiar `Hubs/NotificationHub.cs` y `SqlDependencyService`.
- [ ] Registrar en Startup (ya en Fase 1).
- [ ] Endpoint `/notificacion` con `[Authorize]`.

### Fase 5 — Frontends
- [ ] Cliente Angular: actualizar `environment.ts` (apiUrl) al nuevo host/puerto (si cambió).
- [ ] Doctor Angular: idem.
- [ ] Verificar CORS permite ambos orígenes.
- [ ] Eliminar `UseSpa` del backend (frontends se sirven por `ng serve` / hosting estático).

### Fase 6 — Build, test, limpieza
- [ ] `dotnet build CentroMedico.sln` (0 errores).
- [ ] Probar endpoints clave con Swagger: login paciente, login doctor, crear cita, listar turnos.
- [ ] Probar SignalR (notificaciones).
- [ ] Eliminar (o archivar) los proyectos API viejos (`CentromedicoCliente/CentromedicoCliente`, `CentromedicoDoctor/CentromedicoDoctor`) — mantener solo los frontends `ClientApp` y los DTO/Repository. O mantenerlos como referencia hasta validar.
- [ ] Actualizar `README.md` del monorepo con instrucciones del API unificado.

### Fase 7 — (Opcional) Unificar Identity/roles seed
- [ ] Verificar que los roles "Patient", "Doctor", "Secretary" existen en la DB (ya están por el seed actual).
- [ ] Si no, añadir un seeder en Startup (`RoleManager`).

---

## 4. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Colisión de nombres de clases (interfaces `ICitaService`, `IAccountService`) | Renombrar con sufijo de dominio (`...Paciente`, `...Doctor`) o mantener en namespaces separados y usar alias |
| Dos `MappingProfile` con mismos nombres de tipo | Registrar ambos; AutoMapper los distingue por tipo |
| CORS con credentials + AllowAnyOrigin (incompatible) | Usar `WithOrigins(...)` explícito (como doctor) |
| SPA proxy ports (4211 vs 4200) | Backend ya no sirve SPA; frontends se sirven por `ng serve` |
| SignalR solo en doctor | Mover hub al unificado; el cliente puede suscribirse si se desea |
| Migraciones EF (compartidas) | No cambian; la DB es la misma |
| Secretos en código | Ya scrubbed; usar env vars / user-secrets |

---

## 5. Estimación

- Fase 1–2: ~2–3 horas (creación + migración controllers)
- Fase 3: ~2 horas (services/DTOs/repos)
- Fase 4–5: ~1 hora
- Fase 6–7: ~1–2 horas (build, test, limpieza)
- **Total:** ~6–8 horas de trabajo concentrado.

---

## 6. Decisión requerida antes de ejecutar

1. ¿El backend unificado **sirve SPA** (uno de los dos) o es **API pura**? Recomendación: API pura (frontends independientes).
2. ¿Renombramos los controllers colisionantes (`Citas` → `CitasPaciente`/`CitasDoctor`) o mantenemos rutas separadas por prefijo?
3. ¿Mantenemos los proyectos API viejos como referencia hasta validar, o los eliminamos directamente?

Responde con tus preferencias (o "adelante con las recomendaciones") y ejecuto fase por fase. 🙌
