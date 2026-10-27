# IA opcional y revisión de viabilidad

## Estado de esta etapa

El código añade una biblioteca de pricing, un diagnóstico financiero local y conectores de escritorio para OpenAI y Anthropic. Los conectores se han probado con respuestas simuladas: no se han usado claves reales ni generado cargos. No se publica un instalador nuevo hasta verificar una identidad de firma. Logos, dashboard reordenable y hasta tres firmantes del informe pertenecen a la siguiente etapa; no están implementados todavía.

## Uso en el escritorio

En las secciones de resultados, ofertas y proyección aparece el panel de viabilidad. El diagnóstico local y la biblioteca funcionan sin contratar IA. Para un análisis conectado:

1. Selecciona proveedor, un modelo disponible en tu cuenta y un máximo diario de solicitudes.
2. Guarda tu clave en el campo de contraseña del aplicativo, nunca en un chat, un respaldo o el repositorio. La aplicación exige almacenamiento protegido del sistema operativo. No comparte claves entre equipos.
3. Previsualiza el resumen. Solo contiene cifras agregadas, moneda, indicadores de completitud y la marca de ejemplo. No incluye nombres, identificadores, contratos, notas, logos, firmas ni referencias de soportes. Las cifras pueden seguir siendo sensibles; no se garantiza anonimato.
4. Autoriza ese envío concreto. Calfin solicita además una confirmación nativa antes de contactar al proveedor.
5. Revisa el resultado. Si cambian los datos o la empresa, el análisis anterior se oculta del reporte. Los análisis de esta etapa permanecen en la sesión: imprime/guarda el PDF si necesitas conservarlos; no constituyen un historial auditado.

El proveedor identifica tu cuenta, aplica sus condiciones y puede cobrar. Una suscripción de chat no necesariamente incluye API. Cada intento autorizado cuenta contra el límite local, incluidos errores; no hay reintentos automáticos. El límite diario se reinicia en UTC y no es un límite monetario ni un control de facturación resistente a manipulación. Máximo de salida por solicitud: 1500 tokens; espera máxima: un minuto. Cancelar no garantiza reembolso del trabajo ya realizado. Revisa también los controles de gasto de tu proveedor.

OpenAI se solicita con store=false; esto no equivale a prometer ausencia total de registros del proveedor. Las condiciones de conservación, ubicación y tratamiento dependen del proveedor y del contrato del usuario.

## Controles de interpretación

El modelo no realiza los cálculos del aplicativo ni puede ejecutar acciones. Sus hallazgos deben referenciar métricas existentes y principios de la biblioteca. Se rechazan cifras libres, HTML, enlaces y referencias inexistentes en sus textos; las cifras se insertan desde el motor. Son controles parciales: una interpretación puede ser incorrecta y requiere revisión humana.

La situación registrada, el escenario proyectado y la evidencia de demanda se muestran por separado. La demanda no se declara validada a partir de los datos financieros. Un excedente operativo no prueba liquidez, valor percibido, aceptación de precio ni viabilidad universal. Las proyecciones siguen teniendo las limitaciones mensuales documentadas; esta etapa no añade todavía VPN, cohortes o contabilidad fiscal.

## Biblioteca

Ocho módulos de síntesis propia con enlaces, autorías y profundidad consultada. Consulta histórica: 24 de octubre de 2026. Se incorporan enseñanzas públicas de Lina Restrepo, Simon, Nagle y coautores, Ramanujam/Tacke, Liozu, Hinterhuber, Holden y Mohammed. No son un ranking demostrado, un método privado, un entrenamiento de pesos ni un aval de los autores. No se redistribuyen libros completos.

## Reportes

La impresión añade empresa, sección, período/alcance, versión, hora local, zona horaria y timestamp UTC del reloj del equipo. No es un sello de tiempo certificado ni una firma del informe. Se conservan los avisos de datos de ejemplo y conciliación pendiente. La firma Authenticode del programa es una protección separada.

## Desarrollo y pruebas

`npm test` ejecuta regresiones financieras, timestamps y controles de IA. `npm run test:browser` comprueba los recorridos existentes. `npm run test:extensions` prueba consentimiento, invalidación del análisis e impresión PDF con un puente de IA simulado. `python3 tests/check_decimal.py` contrasta los importes de forma independiente. Ninguna de estas pruebas consume una API de IA real.

Fuentes técnicas: https://www.electronjs.org/docs/latest/api/safe-storage y https://platform.claude.com/docs/en/api/messages. La página de referencia de OpenAI no pudo consultarse en esta revisión por una respuesta de acceso denegado; el adaptador Responses requiere una prueba autorizada con cuenta real antes de afirmar compatibilidad operativa con un modelo concreto.
