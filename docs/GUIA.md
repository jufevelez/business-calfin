# Calfin en palabras simples

## 1. Tres historias distintas

**Ventas:** lo entregado o devengado en el período, neto de descuentos y notas, sin impuestos trasladados.

**Resultado operativo:** ventas menos costo de lo vendido, gastos fijos, cobro, comisiones y otros gastos operativos. Es antes de intereses y renta, no utilidad neta fiscal.

**Caja:** lo que tenías más cobros y financiación, menos pagos, inversiones, deuda y retiros. Puede bajar aunque tengas ganancia. Un anticipo o préstamo puede aumentar caja sin producir ganancia.

Calfin no lee tu banco ni comprueba facturas. Introduce cifras conciliadas, referencias de soportes y fecha. La fecha de conciliación debe cubrir el mes completo. Una marca de “conciliado” es tu declaración, no una auditoría automática.

## 2. Antes de escribir un precio

Define una unidad concreta: producto, proyecto, hora o cuenta-mes. Registra solo el costo que cambia al vender una unidad adicional. No dupliques un sueldo fijo dentro del costo variable. Documenta materias primas, proveedores, consumo, soporte o IA que correspondan.

Para IA, calcula todos los intentos y fallos, herramientas y revisión: costo por éxito = costo total de intentos y revisión / resultados exitosos. Introduce el costo correspondiente a la unidad vendida; no prometas consumo ilimitado con costo desconocido.

El cargo de cobro por unidad debe estar asignado correctamente. Si una transacción contiene diez productos, no cargues diez veces el cargo fijo completo de la pasarela.

- Neto = lista × (1 − descuento).
- Pasarela = porcentaje × (neto + impuesto trasladado) + cargo asignado.
- Contribución = neto − variable − pasarela − comisión.
- Comisión sobre excedente = tasa × máximo(0, neto − variable − pasarela − provisión pactada).

La provisión pactada reduce la base de comisión; **no se resta de nuevo de la ganancia**. “Sin comisión” es una decisión explícita, no la regla predeterminada.

## 3. Equilibrio y precios de viabilidad

Introduce unidades de referencia para formar la mezcla. Calfin conserva esa proporción en bloques enteros. Una mezcla de 3 productos A por 2 B se vende en bloques de cinco para este cálculo. No es el mínimo entre todas las mezclas posibles.

Paquetes necesarios = techo((gastos fijos + ganancia objetivo) / contribución del paquete).

Si la contribución no es positiva, vender más no cubre los fijos. Si faltan horas de capacidad, el objetivo matemático no es ejecutable sin ajustar operación y costos.

El precio técnico reparte los fijos por igual entre unidades de referencia y busca un neto que cubra esa asignación y el margen deseado. Es una convención explícita, no una asignación causal para todos los negocios. **No es un precio óptimo:** contrasta beneficio para el cliente, alternativas y señales de pago. Los campos de evidencia ayudan a documentarlo, no inventan su valor.

## 4. Comisiones reales según una regla pactada

Usa una instantánea acumulada por contrato. No cargues dos cortes acumulados del mismo contrato y los sumes. Conserva cortes anteriores en respaldos o en un historial versionado al integrar.

Bases posibles: venta neta cobrada, ingreso neto devengado o excedente positivo después de costos y deducciones pactadas. No hay una base predeterminada.

El cobro neto es cobros menos devoluciones. El ingreso devengado y el valor contractual deben estar ya ajustados por notas; no restes la misma devolución dos veces. La base cobrada se limita al valor contractual vigente y advierte si existe un cobro superior.

Cuando el acuerdo exige cobro proporcional al devengado, se aplica base × mínimo(1, cobro neto / devengado). Con devengado cero, esa base condicionada es cero. No se aplica otra vez a una base ya cobrada.

Pendiente = máximo(0, comisión calculada + ajuste firmado − pagado). Exceso = máximo(0, pagado − derecho calculado). Un exceso requiere revisar el contrato: no autoriza recuperación o compensación automática entre personas.

No se calculan escalas por metas, vencimientos legales, nómina ni reparto entre múltiples beneficiarios. Si la política no encaja, no fuerces los campos: amplía el modelo con pruebas.

## 5. Proyección mensual

Cada fila indica unidades facturables de ese mes. En suscripciones son cuentas activas del mes, no nuevas altas que el sistema renueva automáticamente. No hay crecimiento ni renovación implícitos.

La fracción de cobro reduce el ingreso esperado y la base de comisión; el costo variable no se reduce porque el cliente no pague. El gasto de comisión es una provisión del escenario y su pago espera el cobro y la demora configurada.

Los costos variables y fijos se pagan en el mismo mes. El modelo excluye calendario fiscal, inventarios, anticipos anuales, intereses y amortización de deuda. El dinero recibido como financiación aumenta caja, no resultado operativo. Los pagos se mantienen aunque la caja quede negativa: el modelo no concede permiso para incumplirlos.

Equilibrio sostenido significa que permanece no negativo hasta el final del horizonte, no para siempre. Un cruce al último mes ofrece poca observación posterior.

## 6. Evidencia y precisión

Una casilla vacía es pendiente. Cero solo cuando realmente no aplica o cuando se ha definido así una hipótesis. Los ejemplos nunca constituyen un diagnóstico real.

Cada empresa usa una moneda. Se respetan sus decimales monetarios habituales (por ejemplo USD 2, JPY 0, KWD 3), con redondeo por componente a la mitad alejándose de cero. Tasas y multiplicadores usan hasta seis decimales. No es el motor fiscal de una factura; valida convenciones antes de integrar facturación.

Cambiar moneda cambia la unidad de presentación, **no convierte importes**. Para moneda distinta, crea otra empresa o convierte los datos de forma documentada.

## 7. Guardar y recuperar

Guardar conserva el espacio completo de empresas. En escritorio, se conserva el guardado anterior para recuperación ante daño del archivo principal. Exportar respaldo crea un archivo transportable. Importar reemplaza todo el espacio, no mezcla registros. Los CSV son resultados de consulta, no otro motor de cálculo. Imprimir imprime la sección visible.

El archivo local no está cifrado. No subas respaldos privados a GitHub ni los adjuntes a incidencias públicas. Mantén una copia segura externa al equipo.
