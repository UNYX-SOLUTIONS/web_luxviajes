# AUDITORÍA FINAL — Integración Datafast

> **Proyecto:** Lux Viajes — Botón de Pagos Dataweb  
> **Versión documentación:** Dataweb v3.2.1 + Pagos Recurrentes v3.3  
> **Fecha auditoría:** 2026-08-07  
> **Auditor previo:** 2026-07-31 (95% completado)  
> **Estado actual:** 90% — Correcciones críticas pendientes antes de certificación

---

## 1. Resumen Ejecutivo

La integración con Datafast está **funcional en su flujo básico** (creación de checkout → widget → pago → resultado), pero se identificaron **4 issues críticos** que deben resolverse antes de ejecutar el script de pruebas transaccionales y solicitar la certificación.

### Estado general

| Categoría | Completado | Pendiente |
|-----------|:---------:|:---------:|
| Backend — Checkout + Status + Refund | 95% | 1 fix crítico |
| Backend — Recurring + Token + Verify | 85% | 2 fixes |
| Frontend — Widget + Resultado | 90% | 2 fixes críticos |
| Frontend — Diálogo de compra | 70% | creditType/installments no llegan al backend |
| Pruebas automatizadas | 40% | Sin tests de controller ni frontend |
| Certificación Datafast | 0% | Pendiente ejecutar script de pruebas |

---

## 2. Checklist de Funcionalidades Implementadas

### 2.1 Backend — `datafast.service.ts` (277 líneas, `backend/src/services/datafast/`)

| Método | HTTP Datafast | Estado | Observaciones |
|--------|---------------|:------:|--------------|
| `createCheckout` | `POST /v1/checkouts` | ✅ | 25 campos obligatorios Fase 2 completos |
| `getPaymentStatus` | `GET /v1/checkouts/{id}/payment` | ✅ | Recibe resourcePath, filtra con entityId |
| `refundTransaction` | `POST /v1/payments/{id}` (RF) | ✅ | Sin validación de monto acumulado |
| `createRecurringPayment` | `POST /v1/registrations/{id}/payments` | ✅ | Solo init; sin gestión de suscripción |
| `deleteToken` | `DELETE /v1/registrations/{id}` | ✅ | |
| `verifyTransactionByPaymentId` | `GET /v1/query/{paymentId}` | ⚠️ | Endpoint `/v1/query/` no documentado en v3.2.1 |
| `verifyTransactionByMerchantId` | `GET /v1/query` | ⚠️ | Endpoint no documentado; posiblemente no soportado |

### 2.2 Backend — `datafast.client.ts` (88 líneas)

| Característica | Estado | Observaciones |
|---------------|:------:|--------------|
| Autenticación Bearer Token | ✅ | |
| Content-Type application/x-www-form-urlencoded | ✅ | |
| Retry con exponential backoff (POST) | ✅ | 3 intentos, 5xx/429/408, 1s-10s backoff |
| Timeout configurable | ✅ | 30s por defecto |
| Logging de requests/responses | ✅ | vía pino |
| Error interceptor para 4xx/5xx | 🔴 | **CRÍTICO** — ver ISSUE-001 |
| Retry en GET/DELETE | ❌ | Solo POST tiene retry |

### 2.3 Backend — `payment.service.ts` (350 líneas)

| Funcionalidad | Estado | Observaciones |
|--------------|:------:|--------------|
| createCheckout (DB + Datafast) | ✅ | Upsert Customer → Transaction PENDING → Datafast → update checkoutId |
| getPaymentStatus + update DB | ✅ | Mapea código a PaymentStatus; guarda token si success |
| refundTransaction | ✅ | Valida estado SUCCESS, inserta Refund |
| verifyTransaction | ✅ | |
| createRecurringPayment | ⚠️ | Crea Transaction pero **nunca crea RecurringPayment record** |
| deleteToken | ✅ | |
| mapStatus (código → enum) | ⚠️ | `code.startsWith('000.100.')` es peligrosamente amplio |
| saveToken (upsert) | ✅ | |

### 2.4 Frontend — Widget de pago

| Característica | Estado | Observaciones |
|---------------|:------:|--------------|
| Carga de paymentWidgets.js | ✅ | `eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=xxx` |
| Estados (loading/ready/expired/error) | ✅ | 20s timeout, polling 300ms |
| Validación cardholder | ✅ | `onBeforeSubmitCard` |
| Logo "Powered by Datafast" | ✅ | `injectCustomFields()` |
| `action="/pago/resultado"` | ✅ | **Corregido** — removido, Datafast usa URL del merchant |
| `shopperResultUrl` en params | ✅ | **Corregido** — ya no se envía desde el form |
| CSP `frame-ancestors` | 🔴 | **CRÍTICO** — ver ISSUE-002 |

### 2.5 Frontend — Página de resultado

| Característica | Estado | Observaciones |
|---------------|:------:|--------------|
| 5 estados (loading/success/failed/pending/error) | ✅ | |
| 12 códigos de error mapeados | ✅ | Faltan códigos de recurrentes (190, 191, 310-319) |
| Timeout 25s con AbortController | ✅ | |
| Detalles de transacción en tabla | ✅ | |
| Polling para estado `pending` | ❌ | Usuario se va sin notificación |

### 2.6 Frontend — Diálogo de compra y hook de pago

| Característica | Estado | Observaciones |
|---------------|:------:|--------------|
| `useDatafastPayment` hook | ✅ | IP via ipify.org, cálculo de IVA |
| `usePurchaseDialog` hook | ⚠️ | `handlePay` acepta paymentOptions pero nunca los recibe |
| `PurchaseSummaryDialog` | 🔴 | **CRÍTICO** — ver ISSUE-003 |
| Campos de cuotas / tipo crédito en UI | ❌ | No implementados en el diálogo |
| Tokenización (createRegistration) | ❌ | No hay checkbox en el diálogo |
| `merchantCustomerId` estable | ❌ | Incluye `Date.now()`, no es reutilizable |

---

## 3. Issues Críticos Identificados

### ISSUE-001 🔴 CRÍTICO — `datafast.client.ts:34` Error interceptor devuelve `error.response` en vez de rechazar

**Archivo:** `backend/src/services/datafast/datafast.client.ts:31-38`

```typescript
(error: AxiosError) => {
  if (error.response?.data) {
    logger.warn(`Datafast Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    return error.response;  // ← AQUÍ: resuelve en vez de rechazar
  }
  logger.error({ err: error.message }, 'Datafast Network Error');
  return Promise.reject(error);
}
```

**Problema:** Cuando Datafast responde con un error HTTP (4xx como `200.300.404`), el interceptor hace `return error.response` en lugar de `return Promise.reject(error)`. Esto hace que `this.client.post()` **resuelva** exitosamente con el body de error. El dato fluye como respuesta válida y `datafast.service.ts:118` loguea `"✅ Checkout creado"` aunque la transacción falló.

**Impacto:**
- La transacción se marca como FAILED solo cuando el error llega a `payment.service.ts:105-108`
- Si el error tiene campo `.id`, el código podría incluso sobreescribir el `checkoutId` en la DB con datos de error
- Los errores de Datafast no se propagan correctamente al frontend

**Corrección:**
```typescript
// CAMBIAR línea 34:
return error.response;

// POR:
return Promise.reject(error);
```

### ISSUE-002 🔴 CRÍTICO — CSP `frame-ancestors 'self'` bloquea iframes 3DS de Datafast

**Archivo:** `frontend/next.config.ts:61`

```typescript
{
  key: "Content-Security-Policy",
  value: "frame-ancestors 'self'",
}
```

**Problema:** La política CSP solo permite iframes del mismo origen. Datafast renderiza el desafío 3D Secure en un iframe desde `*.oppwa.com` o `*.datafast.com.ec`. Esta política **bloqueará todas las autenticaciones 3DS**, causando que las transacciones con tarjetas que requieren 3DS fallen silenciosamente.

**Corrección:**
```typescript
{
  key: "Content-Security-Policy",
  value: "frame-ancestors 'self' *.oppwa.com *.datafast.com.ec",
}
```

### ISSUE-003 🔴 CRÍTICO — `paymentOptions` (creditType/installments) nunca llegan al backend

**Archivos:** `frontend/src/components/common/purchase_summary_dialog.tsx:45` + `frontend/src/hooks/usePurchaseDialog.ts:56`

```typescript
// purchase_summary_dialog.tsx:45
onPay: (customerData: CustomerFormData) => void;  // ← solo acepta customerData

// usePurchaseDialog.ts:56
const handlePay = useCallback(async (
  customerData: CustomerFormData,
  paymentOptions?: { creditType?: string; installments?: number }  // ← espera paymentOptions
) => {
```

**Problema:** El `PurchaseSummaryDialog` define `onPay` como `(CustomerFormData) => void`, pero `usePurchaseDialog.handlePay` espera `(CustomerFormData, paymentOptions?)`. El diálogo **nunca pasa** `creditType` ni `installments`. Además, el diálogo no tiene controles UI para seleccionar tipo de crédito o cuotas.

**Impacto:**
- Los pagos diferidos (SHOPPER_TIPOCREDITO, SHOPPER_INSTALLMENTS) **nunca** se envían a Datafast
- 8 de los 8 eventos del script de pruebas de Datafast requieren diferidos → **el script de pruebas no se puede completar**

**Corrección:**
1. Agregar selectores de tipo de crédito y cuotas en `PurchaseSummaryDialog`
2. Cambiar tipo de `onPay` a: `(customerData: CustomerFormData, paymentOptions?: PaymentOptions) => void`
3. Pasar `paymentOptions` al hook `useDatafastPayment`

### ISSUE-004 🔴 ALTO — Modelo `RecurringPayment` nunca usado en código

**Archivos:** `backend/prisma/schema.prisma:91-108` + `backend/src/modules/payments/payment.service.ts:218-263`

**Problema:** El modelo `RecurringPayment` (con campos `frequency`, `nextChargeDate`, `endDate`, `status`) está definido en Prisma pero **ningún método del servicio lo crea o consulta**. `createRecurringPayment()` solo crea un `Transaction` y llama a Datafast, pero nunca persiste la suscripción.

**Impacto:**
- No hay registro de suscripciones recurrentes (frecuencia, próxima fecha, estado)
- Imposible implementar: pausar, reanudar, cancelar, modificar monto de suscripciones
- Sin historial de cobros recurrentes

**Corrección:** Insertar/actualizar `RecurringPayment` en `createRecurringPayment()`:
```typescript
await prisma.recurringPayment.upsert({
  where: { transactionId: transaction.id },
  create: { transactionId, tokenId, customerId: token.customerId, amount, frequency, status: 'ACTIVE', nextChargeDate },
  update: { status: 'ACTIVE', nextChargeDate },
});
```

---

## 4. Issues de Severidad Media

| ID | Archivo | Problema | Impacto |
|----|---------|----------|---------|
| ISSUE-005 | `datafast.service.ts:46` | `identificationDocId.padStart(10,'0')` — pasaportes pueden tener != 10 caracteres | Rechazo en Datafast para pasaportes |
| ISSUE-006 | `payment.service.ts:51` | Customer upsert usa `email` como unique key; dos personas con mismo email sobreescriben datos | Corrupción de datos de cliente |
| ISSUE-007 | `payment.service.ts:347` | `mapStatus`: `code.startsWith('000.100.')` asume SUCCESS para todos los `000.100.*` | Transacciones pendientes marcadas como exitosas |
| ISSUE-008 | `datafast.types.ts` | `CreditTypeOptions` solo expone 4 de 8 tipos de crédito | UI incompleta para diferidos |
| ISSUE-009 | `resultado/page.tsx` | Sin polling ni webhook para estado `pending` | Usuario abandona sin saber resultado final |
| ISSUE-010 | `config/datafast.ts:17-19` | `baseUrl` ignora `DATAFAST_BASE_URL` de .env; usa ternary hardcodeado | No se puede cambiar URL sin modificar código |
| ISSUE-011 | `useDatafastPayment.ts` | `billing.street1: "Av. Principal"` hardcodeado | Address Verification (AVS) puede fallar |
| ISSUE-012 | Backend tests | Sin tests de controller (6 endpoints), DTOs, ni frontend | Cobertura de tests <40% |
| ISSUE-013 | `datafast.client.ts` | Sin retry en GET (getPaymentStatus, verifyTransaction) | Timeouts de red matan consultas de estado |
| ISSUE-014 | `payment.controller.ts:51` | `resourcePath` sin validación de pertenencia al usuario | Usuario podría consultar transacciones ajenas |

---

## 5. Análisis del Script de Pruebas Datafast

### 5.1 Archivo: `TestScript-AGENCIALUXVIAJES.xlsx`

### 5.2 Campos requeridos

| Campo | Fuente en código | Notas |
|-------|-----------------|-------|
| Evento a Probar | Ver tabla 5.3 abajo | 8 eventos definidos |
| CustomerId | `customer.merchantCustomerId` (generado como `USER_{id}_{Date.now()}`) | **Debe ser diferente para cada transacción** |
| ID (JSON RESPUESTA) | `checkoutResponse.id` o `paymentResponse.id` | El `id` devuelto por Datafast |
| Meses Plazo | `installments` | Solo aplica a diferidos |
| Tipo Transacción | En Línea (siempre) | Widget web |
| Tarjeta | `4111111111111111` (prueba) | |
| Lote | Campo en respuesta Datafast | `resultDetails.BatchNo` o similar |
| Referencia | `merchantTransactionId` | `TRX_{timestamp}_{uuid8}` |
| Autorización | `resultDetails.AuthCode` | 6 dígitos |
| Valor | `data.amount` | |
| Base 0 | `data.taxes.base0` | |
| Base 12 | `data.taxes.baseImp` | Base imponible (grava IVA) |
| Iva | `data.taxes.iva` | |
| Servicio | `data.amount` (total) | |
| Interés | 0 (sin interés en pruebas) | |
| Gran Total | `data.amount` | Debe coincidir: `BASE0 + BASEIMP + IVA = amount` |
| Monto Fijo | 0 | |
| Propina | 0 | |
| Referencia Anulación | `merchantTransactionId` de la transacción original | Solo para eventos de anulación |
| Observaciones | Notas libres | |
| Payload | Body del request (opcional) | |

### 5.3 Eventos a probar y cómo completarlos

| # | Evento | creditType | installments | Monto | Base0 | BaseImp | IVA | Tarjeta |
|---|--------|:----------:|:------------:|------:|------:|--------:|----:|---------|
| 1 | Crédito corriente / Rotativo | `00` | — | $10.00 | 10.00 | 0 | 0 | `4111111111111111` |
| 2 | Crédito Diferido con interés | `02` | 3 | $10.00 | 10.00 | 0 | 0 | `4111111111111111` |
| 3 | Crédito Diferido sin interés | `03` | 3 | $10.00 | 10.00 | 0 | 0 | `4111111111111111` |
| 4 | Crédito Diferido Corriente (especial) | `01` | 3 | $10.00 | 10.00 | 0 | 0 | `4111111111111111` |
| 5 | Anulación Crédito Corriente | — | — | $10.00 | — | — | — | `4111111111111111` |
| 6 | Anulación Créd. Diferido con interés | — | — | $10.00 | — | — | — | `4111111111111111` |
| 7 | Anulación Créd. Diferido sin interés | — | — | $10.00 | — | — | — | `4111111111111111` |
| 8 | Anulación Créd. Diferido Corriente | — | — | $10.00 | — | — | — | `4111111111111111` |

> **Nota sobre impuestos para eventos 1-8:**  
> Datafast valida que `SHOPPER_VAL_BASE0 + SHOPPER_VAL_BASEIMP + SHOPPER_VAL_IVA = amount`.  
> Con monto total de $10.00, usar: `Base0=10.00, BaseImp=0, IVA=0`.  
>  
> Para probar con IVA (monto $1.43): `Base0=0, BaseImp=1.28, IVA=0.15` (approx).  
> El valor exacto es: `baseImp = amount / 1.15`, `iva = amount - baseImp`.

### 5.4 Códigos de respuesta esperados

| Escenario | Código esperado | Descripción |
|-----------|:--------------:|-------------|
| Pago exitoso (pruebas) | `000.100.110` | Transacción aprobada — Fase 1 (Integrador) |
| Pago exitoso (pruebas Fase 2) | `000.100.112` | Transacción aprobada — Fase 2 (Conector) |
| Pago exitoso (producción) | `000.000.000` | Transacción aprobada |
| Anulación exitosa | `000.000.000` | Anulación procesada |
| Pago pendiente | `000.200.*` | En procesamiento |
| Rechazo — parámetro inválido | `200.300.404` | Inválido o faltante |
| Rechazo — tarjeta | `800.100.151` | Tarjeta inválida |
| Rechazo — fondos | `800.100.155` | Fondos insuficientes |
| Rechazo — fecha | `800.100.157` | Expiración incorrecta |

### 5.5 Datos para MID/TID de prueba

| Campo | Valor |
|-------|-------|
| MID (Merchant ID) | `1000000505` |
| TID (Terminal ID) | `PD100406` |
| ECI | `0103910` |
| PSERV | `17913101` |
| VERSION | `2` |

---

## 6. Instrucciones para Completar el Script de Pruebas

### Paso 1: Preparar el entorno

```bash
# Backend — asegurar que esté corriendo
cd backend && npm run dev

# Frontend — asegurar que esté corriendo
cd frontend && npm run dev
```

### Paso 2: Resolver issues críticos antes de empezar

1. **ISSUE-001** (`datafast.client.ts:34`) — Corregir el error interceptor
2. **ISSUE-002** (`next.config.ts:61`) — Agregar dominios Datafast al CSP
3. **ISSUE-003** (`purchase_summary_dialog.tsx`) — Agregar controles de cuotas/tipo crédito y pasar `paymentOptions`

### Paso 3: Ejecutar transacciones

Para cada evento del script:

1. **Eventos 1-4 (Crédito):**
   - Iniciar un pago desde `/visas` con el monto configurado
   - **NOTA:** Si ISSUE-003 no está resuelto, usar el backend directamente con curl/Postman para enviar `creditType` y `installments`
   - Esperar redirección a `/pago/resultado`
   - Extraer de la respuesta/los detalles: `id`, `merchantTransactionId`, `AuthCode`, etc.
   - Anotar en el Excel

2. **Eventos 5-8 (Anulaciones):**
   - Usar el `paymentId` de las transacciones anteriores
   - Ejecutar refund via `POST /api/payments/refund`
   - El `merchantTransactionId` de la anulación es `RF_{timestamp}_{uuid8}`
   - Anotar en el Excel

### Paso 4: Validaciones previas a cada transacción

- [ ] `merchantTransactionId` es único (no reutilizar entre transacciones)
- [ ] `customer.merchantCustomerId` es diferente para cada transacción
- [ ] `BASE0 + BASEIMP + IVA = amount` (margen de ±$0.02 por floating point)
- [ ] `customer.identificationDocId` tiene 10 dígitos (cédula) o es pasaporte válido
- [ ] `customer.email` es un email válido diferente para cada transacción

### Paso 5: Enviar a Datafast

Enviar el Excel completado a `servbdpago@datafast.com.ec` con:
- Asunto: `Script de Pruebas — Agencia Lux Viajes — Fase 2`
- Adjuntar el archivo Excel
- Incluir MID y TID usados (`1000000505` / `PD100406`)

---

## 7. Pasos Restantes para Certificación y Producción

### 7.1 Certificación (Fase 2 → Producción)

| Paso | Descripción | Responsable | Duración estimada |
|:----:|-------------|:-----------:|:-----------------:|
| 1 | Resolver ISSUE-001, ISSUE-002, ISSUE-003 | Lux Viajes | 1-2 días |
| 2 | Ejecutar script de pruebas (8 eventos) | Lux Viajes | 1 día |
| 3 | Enviar script completado a Datafast | Lux Viajes | — |
| 4 | Datafast valida script de pruebas | Datafast | 1-2 días |
| 5 | Escaneo de vulnerabilidades | Datafast | 2 días |
| 6 | Gestión de códigos bancarios (ajuste en producción) | Datafast | 4 días |
| 7 | Ajuste de MID y TID para producción | Datafast | Incluido en paso 6 |
| 8 | Salida a producción | Ambos | 1 día |

### 7.2 Cambios técnicos para producción

| # | Cambio | Archivo | Valor actual (test) | Valor producción |
|---|--------|---------|---------------------|-------------------|
| 1 | URL del gateway | `config/datafast.ts:17-19` | `eu-test.oppwa.com` | `eu-prod.oppwa.com` |
| 2 | Entity ID | `.env` | `8ac7a4c89fb80ac8019fb94e006b02ba` | Credencial de producción |
| 3 | Bearer Token | `.env` | `OGE4Mjk0MTg1Y...` | Token de producción |
| 4 | MID | `.env` | `1000000505` | MID de producción |
| 5 | TID | `.env` | `PD100406` | TID de producción |
| 6 | Desactivar testMode | `datafast.service.ts:96-98` | `EXTERNAL` | No enviar (solo en dev) |
| 7 | Widget base URL | `widget.tsx:21-22` | `eu-test.oppwa.com` | `eu-prod.oppwa.com` |
| 8 | `NODE_ENV` | `.env` | `development` | `production` |
| 9 | ShopperResultUrl | `.env` | `localhost:3000/pago/resultado` | `https://agencialuxviajes.com/pago/resultado` |

### 7.3 Checklist pre-producción

- [ ] ISSUE-001, ISSUE-002, ISSUE-003 resueltos
- [ ] Script de pruebas aprobado por Datafast
- [ ] Escaneo de vulnerabilidades completado
- [ ] Códigos bancarios configurados en producción
- [ ] `.env.production` creado con credenciales reales
- [ ] `testMode` removido (condicionado a `NODE_ENV !== 'production'`)
- [ ] Logo "Powered by Datafast" visible en widget (ya implementado)
- [ ] Primera transacción de prueba en producción: **$1.00**
- [ ] Página de políticas publicada (Privacidad, Contacto, Envío, Términos)
- [ ] Monitoreo y alertas configurados para errores de pago
- [ ] Plan de rollback definido

---

## 8. Recomendaciones Finales

### Inmediatas (antes de ejecutar el script de pruebas)

1. **Corregir ISSUE-001** (`datafast.client.ts:34`) — `return Promise.reject(error)` en lugar de `return error.response`. Es 1 línea y evita que errores de Datafast se traten como respuestas exitosas.

2. **Corregir ISSUE-002** (`next.config.ts:61`) — Agregar `*.oppwa.com *.datafast.com.ec` al CSP `frame-ancestors`. Si no se corrige, las pruebas con 3DS fallarán.

3. **Corregir ISSUE-003** (`purchase_summary_dialog.tsx`) — Agregar selector de tipo de crédito y cuotas en el diálogo de compra. Sin esto, los 8 eventos del script de pruebas no se pueden ejecutar desde el frontend.

4. **Corregir ISSUE-004** (`payment.service.ts`) — Insertar `RecurringPayment` al crear pago recurrente. Sin esto, no hay tracking de suscripciones.

### Corto plazo (post-certificación)

5. Implementar selector de cuotas y tipo de crédito en `PurchaseSummaryDialog` (cubre ISSUE-003)
6. Agregar checkbox de tokenización (createRegistration) en el diálogo de compra
7. Implementar UI para administración de tokens guardados (OneClick)
8. Implementar UI de anulaciones para administradores
9. Usar `merchantCustomerId` estable (sin `Date.now()`) para que el usuario siempre tenga el mismo ID
10. Agregar tests de integración para los 6 endpoints del `PaymentController` (usando `supertest`, ya instalado)

### Producción

11. Agregar `DATAFAST_BASE_URL` al `.env.production` del frontend para evitar fallback al endpoint de test
12. Configurar webhook de Datafast para recibir notificaciones asíncronas (`notificationUrl`)
13. Implementar polling automático para transacciones en estado `pending` en la página de resultado
14. Agregar rate limiting a endpoints de pago (ya instalado `express-rate-limit`, verificar configuración)
15. Primera transacción en producción: **$1.00** como prueba única, verificar en panel de Datafast

---

## 9. Matriz de Pruebas Recomendadas (independiente del script Datafast)

| # | Escenario | Método | Resultado esperado |
|---|-----------|--------|-------------------|
| 1 | Pago corriente exitoso | Frontend → Visa → Pagar con `4111111111111111` | `status=success`, redirect a resultado con checkmark |
| 2 | Pago rechazado (fondos insuf.) | Frontend → Visa → Pagar con `5204736500000007` | `status=failed`, mensaje "Fondos insuficientes" |
| 3 | Pago con IVA ($10 con IVA) | Backend directo: `base0=0, baseImp=8.70, iva=1.30` | Checkout creado sin error `800.100.199` |
| 4 | Pago con impuestos inconsistentes | Backend: `base0=5, baseImp=3, iva=0.5` (suma=8.50, amount=10) | Error `800.100.199` — cálculo de impuestos incorrecto |
| 5 | Tokenización exitosa | Pagar con `createRegistration=true` | `registrationId` en respuesta, token guardado en DB |
| 6 | Pago recurrente con token | Usar `registrationId` del paso 5 | Nuevo `paymentId`, Transaction SUCCESS |
| 7 | Anulación exitosa | Refund sobre transacción del paso 1 | Transaction status → REFUNDED |
| 8 | Checkout expirado | Esperar 30 min, cargar widget | Widget muestra "expirado" |
| 9 | Cardholder vacío | Dejar nombre del titular en blanco | Validación bloquea submit, mensaje "Campo requerido" |
| 10 | merchantTransactionId duplicado | Reenviar mismo `merchantTransactionId` | DB rechaza por unique constraint |

---

## Apéndice A: Estructura de Archivos de la Integración

```
backend/
├── src/
│   ├── config/
│   │   ├── datafast.ts          ← Configuración (entityId, token, URL, constantes)
│   │   ├── database.ts          ← Prisma client
│   │   └── logger.ts            ← Pino logger
│   ├── modules/payments/
│   │   ├── payment.controller.ts ← 6 endpoints HTTP
│   │   ├── payment.service.ts   ← Orquestación + DB (350 líneas)
│   │   ├── payment.routes.ts    ← Definición de rutas Express
│   │   └── dto/
│   │       └── create-checkout.dto.ts ← Validación class-validator
│   └── services/datafast/
│       ├── datafast.client.ts   ← HTTP client (axios, retry, interceptors)
│       ├── datafast.service.ts  ← API Datafast (7 métodos, 277 líneas)
│       └── types/
│           └── datafast.types.ts ← Tipos, enums, StatusMapper (680 líneas)
├── prisma/
│   └── schema.prisma            ← Modelos: Customer, Transaction, Token, RecurringPayment, Refund, AuditLog
├── test/datafast/
│   ├── datafast.client.test.ts  ← 4 tests
│   └── datafast.service.test.ts ← 10 tests
└── test/payments/
    └── payment.service.test.ts  ← 11 tests

frontend/
├── src/
│   ├── app/pago/
│   │   ├── [checkoutId]/
│   │   │   ├── page.tsx         ← Server component wrapper
│   │   │   └── widget.tsx       ← Widget Datafast (357 líneas)
│   │   └── resultado/
│   │       └── page.tsx         ← Página de resultado (243 líneas)
│   ├── components/common/
│   │   └── purchase_summary_dialog.tsx ← Diálogo de compra (581 líneas)
│   ├── hooks/
│   │   ├── useDatafastPayment.ts ← Hook de creación de checkout
│   │   └── usePurchaseDialog.ts  ← Hook de compra (orquesta diálogo + pago)
│   └── services/
│       └── payments.ts          ← getPaymentStatus, verifyPayment
├── next.config.ts               ← Rewrites (proxy /api/payments → backend)
└── .env.local                   ← NEXT_PUBLIC_DATAFAST_BASE_URL
```

---

## Apéndice B: Contactos Datafast

| Rol | Email |
|-----|-------|
| Soporte integración | `servbdpago@datafast.com.ec` |
| Soporte producción | `servbdpago@datafast.com.ec` |

---

> **Próxima acción recomendada:** Resolver ISSUE-001 (1 línea, `datafast.client.ts:34`), ISSUE-002 (1 línea, `next.config.ts:61`), e ISSUE-003 (diálogo de compra) antes de ejecutar el script de pruebas. Los tres son bloqueantes para la certificación.
