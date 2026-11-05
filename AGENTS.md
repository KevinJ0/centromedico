# Reglas de Diseño y Arquitectura Frontend — Centro Médico (Hospital del Salvador)

Siempre que diseñes, construyas, modifiques o audites cualquier pantalla o componente visual en este repositorio, aplica el flujo de trabajo de **5 pilares**:

1. **`ui-ux-pro-max` (Paleta, fuentes y sistema según el negocio)**:
   - Respeta los tokens de [`DESIGN.md`](./DESIGN.md) (*"Confianza cercana"*, azul médico `#186cb2` en `<= 15%` de la superficie, tipografía del sistema con `clamp()`, escala de 4 unidades).
   - Consulta `.agents/skills/ui-ux-pro-max/scripts/search.py` para decisiones de patrones UX, accesibilidad y Angular (`--stack angular`).
2. **`referencias` (Inspiración visual)**:
   - Activa la skill [`referencias`](./.agents/skills/referencias/SKILL.md) y consulta las librerías curadas de `.agents/skills/taste-skill/library/` (`directions.json`, `heroes.json`, `app.json`, `palettes.json`) antes de maquetar una nueva vista.
3. **`taste-skill` (Criterio de diseño anti-slop)**:
   - Activa [`taste-skill`](./.agents/skills/taste-skill/SKILL.md) para garantizar dirección de arte real, ritmo espacial, estados interactivos pulidos y ausencia total de clichés de IA (sin gradientes genéricos, sin kickers/eyebrows sobre cada título, sin tarjetas clonadas sin jerarquía).
   - **REGLA DE ORO (Anti-cliché de IA — Prohibición estricta de punto verde pulsante)**:
     - **PROHIBIDO TERMINANTEMENTE** usar el cliché genérico de IA del punto verde con animación de radar/pulso (`pulsing green dot / animated pulse dot`) para indicar que algo está activo, en vivo, en línea o disponible.
     - **Variantes aprobadas y profesionales obligatorias**:
       1. **Micro-pills tipográficos de estado:** Badges rectangulares sutiles con texto explícito en mayúsculas (ej. `EN VIVO`, `EN ATENCIÓN`, `DISPONIBLE`), tipografía compacta (0.65-0.75rem), tracking deliberado y colores del sistema de diseño (`--primary-color`).
       2. **Iconografía clínica intencional:** Iconos semánticos como `<mat-icon>sensors</mat-icon>` para streaming/en vivo, `<mat-icon>verified</mat-icon>` para acreditación/certificación, `<mat-icon>check_circle</mat-icon>` o `<mat-icon>event_available</mat-icon>`.
       3. **Indicadores de estado sobrios y estáticos:** Sin anillos animados repetitivos de CSS; la credibilidad y el tono hospitalario provienen de la sobriedad, la precisión de los datos y el contraste accesible.
4. **`impeccable` (Revisión de cada pantalla en busca de errores de diseño)**:
   - Activa [`impeccable`](./.agents/skills/impeccable/SKILL.md) y ejecuta `.agents/skills/impeccable/scripts/impeccable.cmd detect` sobre cada pantalla o componente modificado para detectar errores mecánicos, de contraste, tipografía o composición.
5. **Subagentes que construyen y auditan**:
   - **`ui-builder`** ([`.agents/agents/ui-builder.agent.md`](./.agents/agents/ui-builder.agent.md)): Subagente especializado en construir e implementar pantallas siguiendo `ui-ux-pro-max`, `referencias`, `taste-skill`, `DESIGN.md` y `context7`.
   - **`ui-auditor`** ([`.agents/agents/ui-auditor.agent.md`](./.agents/agents/ui-auditor.agent.md)): Subagente independiente que audita cada pantalla con `impeccable` y `taste-skill` y emite un veredicto (`ship`, `fix`, `rebuild`).
   - **Subagentes de ciclo `impeccable`**: `impeccable-finish-reviewer`, `impeccable-asset-producer`, `impeccable-documenter` e `impeccable-manual-edit-applier` en [`.agents/agents/`](./.agents/agents/).

## Integraciones MCP y Cloud Sandboxes
- **Context7** (`context7-mcp`, `context7-cli`, `find-docs`): Úsalo para consultar documentación oficial actualizada de Angular, .NET y librerías del proyecto.
- **Upstash Box** (`upstash-box-js`, `upstash-box-py`, `upstash-box-cli`, `upstash-box-remote-work`): Úsalo cuando se requiera aprovisionar contenedores seguros en la nube o sandboxes de ejecución remota.

## Principios de Ingeniería y Código: Karpathy Guidelines
Aplica rigurosamente la disciplina de [`.agents/skills/karpathy-guidelines/SKILL.md`](./.agents/skills/karpathy-guidelines/SKILL.md) en todo cambio de código:
1. **Think Before Coding**: No asumas en silencio; declara supuestos, evalúa trade-offs y pide aclaraciones si algo no es claro.
2. **Simplicity First**: La mínima cantidad de código que resuelve el problema. Sin abstracciones innecesarias ni código especulativo. Pasa el "Senior Engineer Test".
3. **Surgical Changes**: Toca estrictamente lo necesario. Cada línea cambiada debe vincularse directamente con la solicitud del usuario. Cero refactors no solicitados.
4. **Goal-Driven Execution**: Define criterios de éxito verificables antes de codificar (compilación, pruebas, verificación) y itera hasta verificar con evidencia en terminal (0 errores).
