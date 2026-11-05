---
name: referencias
description: >-
  Sistema de referencias visuales e inspiración de diseño UI/UX. Úsalo antes de
  diseñar o rediseñar cualquier pantalla o componente para extraer dirección de
  arte, layouts, héroes, paletas y patrones reales desde las librerías curadas de
  taste-skill, ui-ux-pro-max y el sistema DESIGN.md del proyecto.
---

# Referencias e Inspiración Visual (`referencias`)

Esta skill estructura la fase de **inspiración y referencias visuales** antes de escribir código frontend, evitando diseños genéricos ("AI slop") y anclando cada pantalla en referencias reales y en la identidad de **Centro Médico — Hospital del Salvador** ([`DESIGN.md`](../../DESIGN.md)).

## 1. Librerías Locales de Referencias Curadas

Antes de construir una pantalla, consulta las referencias locales instaladas en el proyecto:

1. **Direcciones de Arte y Arquetipos (`taste-skill`)**:
   - Direcciones visuales completas: [`.agents/skills/taste-skill/library/directions.json`](../taste-skill/library/directions.json)
   - Composición de secciones Hero: [`.agents/skills/taste-skill/library/heroes.json`](../taste-skill/library/heroes.json)
   - Patrones de aplicación y paneles: [`.agents/skills/taste-skill/library/app.json`](../taste-skill/library/app.json)
   - Paletas curadas: [`.agents/skills/taste-skill/library/palettes.json`](../taste-skill/library/palettes.json)
   - Coreografías de movimiento: [`.agents/skills/taste-skill/library/motions.json`](../taste-skill/library/motions.json)

2. **Motor de Búsqueda por Tipo de Negocio (`ui-ux-pro-max`)**:
   Ejecuta el buscador local para obtener referencias de sistemas de salud, clínicas, portales de pacientes y paneles médicos:
   ```bash
   python ".agents/skills/ui-ux-pro-max/scripts/search.py" "healthcare clinic medical portal" --design-system
   ```

3. **Norte Creativo del Proyecto ([`DESIGN.md`](../../DESIGN.md))**:
   - **Concepto**: *"Confianza cercana"* — clínico, cálido, legible y accesible.
   - **Regla de Una Sola Voz**: Azul médico (`#186cb2`) en `<= 15%` de la pantalla para guiar la acción principal del paciente o médico.

## 2. Catálogo de Fuentes de Inspiración Externa

Cuando el usuario pida explorar referencias externas o capturas de inspiración (usando `/browser` o `impeccable`), prioriza:
- **Portales Clínicos y Salud Digital**: One Medical, Oscar Health, Doctolib, Zocdoc, Mayo Clinic Patient Portal, Apple Health.
- **Galerías de Diseño Web y Producto**:
  - **Mobbin** (`mobbin.com`): Flujos reales de reserva de citas, onboarding de pacientes y dashboards clínicos.
  - **Godly** (`godly.website`): Composición editorial, tipografía fluida y micro-interacciones limpias.
  - **Land-book / Curated Design**: Landing pages de servicios de salud y bienestar.

## 3. Flujo Obligatorio al Usar Referencias

1. **Extraer 3 pilares de la referencia**:
   - **Topología y Jerarquía**: Cómo se distribuye el peso visual en el primer viewport y cuál es la única acción principal.
   - **Ritmo y Densidad**: Relación entre superficie blanca (`#ffffff`), superficie alterna (`#f4f7fb`) y espacio negativo.
   - **Detalle Táctil**: Bordes sutiles (`rgba(24, 108, 178, 0.12)`), elevación solo en interacción y claridad tipográfica.
2. **Validar contra `taste-skill` e `impeccable`**:
   - Prohibido copiar clichés de IA (gradientes neón, 3 tarjetas centradas idénticas con iconos circulares genéricos, textos tipo kicker/eyebrow sobre todos los títulos).
