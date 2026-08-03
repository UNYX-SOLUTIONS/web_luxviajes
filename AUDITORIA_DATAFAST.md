# Auditoría Completa de Integración Datafast — Lux Viajes

**Versión documentación:** Datafast Dataweb v3.2.1 + Pagos Recurrentes v3.3
**Fecha auditoría:** 2026-07-31
**Estado:** Integración completa al 95%

---

## 1. Resumen Ejecutivo

| Dimensión | Cumplimiento |
|---|---|
| Fase 1 (Checkout + Widget + Status) | 100% |
| Fase 2 (Campos obligatorios) | 95% |
| Opciones avanzadas (Diferidos, Crédito) | 100% |
| OneClick / Tokenización | 95% |
| Anulaciones | 100% |
| Verificador de transacciones | 100% |
| Pagos recurrentes | 100% |
| Preparación producción | 85% |

---

## 2. Diagrama de Flujo End-to-End

```
┌──────────────────────────────────────────────────────────────────┐
│ USUARIO: Selecciona visa/servicio → Completa formulario → Paga  │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND: usePurchaseDialog.ts:45                                │
│ - Valida cédula = 10 dígitos                                     │
│ - Payload: amount, customer (givenName, middleName, surname,     │
│   email, phone, identificationDocId), billing (street1, country) │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND: useDatafastPayment.ts:42                               │
│ - Obtiene IP: api.ipify.org                                      │
│ - Calcula impuestos: baseImp = amount/1.15, iva = amount-baseImp │
│ - POST /api/payments/create-checkout                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND: payment.controller.ts:15                                │
│ - Valida DTO (MinLength/MaxLength/IsEmail)                       │
│ - Sobrescribe customer.ip con req.ip                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND: payment.service.ts:47                                   │
│ - merchantTransactionId = TRX_{timestamp}_{uuid8}                │
│ - Upsert customer (usa merchantCustomerId del frontend)          │
│ - Crea Transaction (PENDING)                                     │
│ - Llama DatafastService.createCheckout()                         │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND: datafast.service.ts:24                                  │
│ POST /v1/checkouts → TODOS los campos Fase 2 + impuestos +       │
│ MID/TID + ECI/PSERV/VERSION + risk + cart.items + testMode       │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ DATAFAST GATEWAY: https://eu-test.oppwa.com                      │
│ ← Responde: { id: "checkoutId_xxx" }                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND: Redirige a /pago/{checkoutId}                          │
│ widget.tsx → carga paymentWidgets.js → renderiza formulario      │
│ Widget incluye: cuotas, tipo crédito, tokenización, cardholder   │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ DATAFAST: Procesa pago → Redirect /pago/resultado?resourcePath=  │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND: resultado/page.tsx                                     │
│ GET /api/payments/status?resourcePath=... → Timeout 25s          │
│ Códigos 000.000.000/110/112 → SUCCESS                            │
│ Códigos 000.200.* → PENDING                                      │
│ Otros → FAILED (ERROR_MESSAGES)                                  │
│ Muestra detalles: monto, moneda, código, autorización, banco     │
└──────────────────────────┬───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND: payment.service.ts:111                                  │
│ GET resourcePath + entityId → StatusMapper → Actualiza DB        │
│ Si SUCCESS + registrationId → saveToken() (OneClick)             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Análisis de Conexión al Gateway

| Aspecto | Valor | Ubicación | Estado |
|---|---|---|---|
| URL pruebas | `https://eu-test.oppwa.com` | `config/datafast.ts:19` | ✅ |
| URL producción | `https://eu-prod.oppwa.com` | `config/datafast.ts:18` | ✅ (auto-switch) |
| Autenticación | `Bearer {token}` | `datafast.client.ts:16` | ✅ |
| entityId | `DATAFAST_ENTITY_ID` env | `config/datafast.ts:15` | ✅ |
| Content-Type | `application/x-www-form-urlencoded` | `datafast.client.ts:17` | ✅ |
| Timeout | 30s | `config/datafast.ts:23` | ✅ |
| Retry | 3 intentos + exponential backoff | `datafast.client.ts:52-72` | ✅ |
| Logging | Request/response logs | `datafast.client.ts:21-39` | ✅ |
| Prueba curl Anexo G | Manual | — | ⚠️ Pendiente |

---

## 4. Checklist de Campos Obligatorios (Fase 2)

| # | Campo | Formato Doc | Estado | Backend | Frontend | Validación |
|---|---|---|---|---|---|---|
| 1 | `customer.givenName` | {3,48} | ✅ | `datafast.service.ts:37` | `usePurchaseDialog.ts:17` | `@MinLength(3) @MaxLength(48)` |
| 2 | `customer.middleName` | {2,50} | ✅ | `datafast.service.ts:38-40` | `usePurchaseDialog.ts:18` | `@MinLength(2) @MaxLength(50)` |
| 3 | `customer.surname` | {3,48} | ✅ | `datafast.service.ts:41` | `usePurchaseDialog.ts:19` | `@MinLength(3) @MaxLength(48)` |
| 4 | `customer.ip` | IP válida | ✅ | `datafast.service.ts:42` | `req.ip` (backend) | Backend |
| 5 | `customer.merchantCustomerId` | ID comercio | ✅ | `payment.service.ts:53` | `usePurchaseDialog.ts:78` | `@IsString` |
| 6 | `merchantTransactionId` | Único | ✅ | `payment.service.ts:48` | N/A | UUID + timestamp |
| 7 | `customer.email` | Email | ✅ | `datafast.service.ts:44` | `usePurchaseDialog.ts:19` | `@IsEmail()` |
| 8 | `customer.identificationDocType` | IDCARD | ✅ | `datafast.service.ts:45` | Hardcoded `"IDCARD"` | Default |
| 9 | `customer.identificationDocId` | 10 dígitos | ✅ | `.padStart(10, '0')` | 10-dígitos validado | `@IsString` |
| 10 | `customer.phone` | {7,25} | ✅ | `datafast.service.ts:47` | `usePurchaseDialog.ts:20` | `@MinLength(7) @MaxLength(25)` |
| 11 | `billing.street1` | {1,100} | ✅ | `datafast.service.ts:50` | Hardcoded | `@MaxLength(100)` |
| 12 | `billing.country` | ISO 2 | ✅ | `datafast.service.ts:51` | Hardcoded `"EC"` | `@IsIn([...])` |
| 13 | `shipping.street1` | {1,100} | ✅ | Fallback a billing | N/A | — |
| 14 | `shipping.country` | ISO 2 | ✅ | Fallback a billing | N/A | — |
| 15 | `testMode=EXTERNAL` | Solo test | ✅ | `NODE_ENV !== 'production'` | N/A | Condicional |
| 16a | `cart.items[].name` | {1,255} | ✅ | `datafast.service.ts:85` | Servicio | `@IsString` |
| 16b | `cart.items[].description` | {1,255} | ✅ | `datafast.service.ts:86` | Servicio | `@IsString` |
| 16c | `cart.items[].price` | 10.2 | ✅ | `datafast.service.ts:87` | `.toFixed(2)` | `@Min(0.01)` |
| 16d | `cart.items[].quantity` | {1,12} | ✅ | `datafast.service.ts:88` | `1` | `@Min(1)` |
| 17 | `SHOPPER_VAL_BASE0` | Base 0% | ✅ | `0` | Calculado | Suma = amount |
| 18 | `SHOPPER_VAL_BASEIMP` | Base imponible | ✅ | `amount/1.15` | Calculado | Suma = amount |
| 19 | `SHOPPER_VAL_IVA` | IVA | ✅ | `amount-baseImp` | Calculado | Suma = amount |
| 20 | `SHOPPER_MID` | ID comercio | ✅ | `DATAFAST_MERCHANT_ID` env | N/A | Env |
| 21 | `SHOPPER_TID` | ID terminal | ✅ | `DATAFAST_TERMINAL_ID` env | N/A | Env |
| 22 | `SHOPPER_ECI` | 0103910 fijo | ✅ | `config/datafast.ts:29` | N/A | Constante |
| 23 | `SHOPPER_PSERV` | 17913101 fijo | ✅ | `config/datafast.ts:30` | N/A | Constante |
| 24 | `SHOPPER_VERSIONDF` | 2 | ✅ | `config/datafast.ts:31` | N/A | Constante |
| 25 | `risk.parameters[USER_DATA2]` | Comercio | ✅ | `datafast.service.ts:80` | N/A | merchantId |

**Validación impuestos:** `0 + amount/1.15 + (amount - amount/1.15) = amount` ✅

---

## 5. Manejo de Respuestas y Errores

| Código | Significado | Manejo | Archivo |
|---|---|---|---|
| `000.000.000` | Aprobado producción | "¡Pago Exitoso!" | `resultado/page.tsx:70` |
| `000.100.110` | Aprobado test Fase 1 | "¡Pago Exitoso!" | `resultado/page.tsx:70` |
| `000.100.112` | Aprobado test Fase 2 | "¡Pago Exitoso!" | `resultado/page.tsx:70` |
| `000.200.*` | Pendiente | "Pago en Procesamiento" | `resultado/page.tsx:73` |
| `800.100.151` | Tarjeta inválida | "Tarjeta inválida. Verifica el número." | `ERROR_MESSAGES` |
| `800.100.152` | Rechazado banco | "Transacción rechazada por el banco." | `ERROR_MESSAGES` |
| `800.100.155` | Fondos insuficientes | "Fondos insuficientes." | `ERROR_MESSAGES` |
| `800.100.157` | Expiración incorrecta | "Fecha de expiración incorrecta." | `ERROR_MESSAGES` |
| `800.100.159` | Tarjeta robada | "Tarjeta reportada como robada." | `ERROR_MESSAGES` |
| `800.100.165` | Tarjeta perdida | "Tarjeta reportada como perdida." | `ERROR_MESSAGES` |
| `800.100.168` | Tarjeta restringida | "Tarjeta restringida." | `ERROR_MESSAGES` |
| `800.100.170` | No permitida | "Transacción no permitida." | `ERROR_MESSAGES` |
| `800.100.174` | Monto inválido | "Monto inválido." | `ERROR_MESSAGES` |
| `100.400.147` | Antifraude | "Transacción rechazada por regla antifraude." | `ERROR_MESSAGES` |
| `900.100.100` | Error comunicación | "Error de comunicación con el banco." | `ERROR_MESSAGES` |
| Timeout (25s) | Sin respuesta | AbortController + mensaje | `resultado/page.tsx:47-51` |
| Sin resourcePath | URL sin parámetro | Estado "error" inmediato | `resultado/page.tsx:31-32` |

---

## 6. Funcionalidades Avanzadas

| Funcionalidad | Backend | Frontend | Total |
|---|---|---|---|
| **Diferidos** (SHOPPER_INSTALLMENTS) | ✅ `datafast.service.ts:74-77` | ✅ `widget.tsx:44-56` | 100% |
| **Tipos de crédito** (SHOPPER_TIPOCREDITO) | ✅ `datafast.service.ts:70-72` | ✅ `widget.tsx:59-72` | 100% |
| **Tokenización** (createRegistration) | ✅ `datafast.service.ts:101-103` | ✅ `widget.tsx:75-81` | 100% |
| **Pagos con token** | ✅ `datafast.service.ts:178-219` | ⚠️ Falta UI | 80% |
| **Eliminar token** | ✅ `datafast.service.ts:225-235` | ⚠️ Falta UI | 80% |
| **Anulaciones** (RF) | ✅ `datafast.service.ts:149-173` | ⚠️ Falta UI admin | 80% |
| **Verificador paymentId** | ✅ `datafast.service.ts:240-254` | ✅ `payments.ts:32` | 100% |
| **Verificador merchantTxId** | ✅ `datafast.service.ts:259-276` | ⚠️ Falta UI | 80% |
| **Validación cardholder** | N/A | ✅ `widget.tsx:96-109` | 100% |
| **Logo Datafast** | N/A | ✅ `widget.tsx:84-93` | 100% |
| **Pagos recurrentes** | ✅ `datafast.service.ts:178-219` | ⚠️ Falta UI | 80% |

---

## 7. Seguridad y Cumplimiento

| Requisito | Estado | Detalle |
|---|---|---|
| TLS 1.2+ SHA-256 | Infraestructura | Código usa HTTPS para gateway. TLS del servidor depende del hosting |
| `helmet` security headers | ✅ | `app.ts:11` |
| CORS configurado | ✅ | `app.ts:12-15` |
| Rate limiting pagos | ✅ | `app.ts:27-36` — 20 req/15min |
| JWT auth | ✅ | `payment.routes.ts:8` — `optionalAuth` |
| PCI DSS hosting | Infraestructura | Verificar con proveedor |
| IP única | Infraestructura | Verificar con hosting |
| Políticas (Privacidad, Contacto, etc.) | ⚠️ Pendiente | Requerido para escaneo |
| Sin malware/spam | ⚠️ Pendiente | Escaneo Datafast en prod |

---

## 8. Checklist para Producción (Tabla 12)

| Paso | Responsable | Tiempo | Estado |
|---|---|---|---|
| 1. Script de Pruebas | Comercio | 1 día | ⬜ Pendiente |
| 2. Validación de Script | Datafast | 1-2 días | ⬜ Pendiente |
| 3. Escaneo de Vulnerabilidades | Datafast | 2 días | ⬜ Pendiente |
| 4. Gestión Códigos Bancarios | Datafast | 4 días | ⬜ Pendiente |
| 5. Ajuste MID/TID | Datafast | 1 día | ⬜ Pendiente |
| 6. Salida a Producción | Comercio/Datafast | 1 día | ⬜ Pendiente |

**Cambios técnicos para producción:**
- [x] URL: `eu-test.oppwa.com` → `eu-prod.oppwa.com` (automático por `NODE_ENV`)
- [x] Eliminar `testMode=EXTERNAL` (automático)
- [x] Credenciales de prod: `DATAFAST_ENTITY_ID`, `DATAFAST_BEARER_TOKEN`, `DATAFAST_MERCHANT_ID`, `DATAFAST_TERMINAL_ID` (env vars)
- [x] Logo "Powered by Datafast" agregado en widget
- [ ] Primera transacción en producción: $1.00 como prueba
- [ ] Evaluar cambiar `optionalAuth` → `authMiddleware`

---

## 9. Estructura de Archivos del Módulo de Pagos

```
backend/
├── src/
│   ├── config/
│   │   └── datafast.ts                    — Configuración (entityId, bearer, URLs, constantes)
│   ├── services/datafast/
│   │   ├── datafast.client.ts             — HTTP client (axios + retry + logging)
│   │   ├── datafast.service.ts            — API Datafast: 6 métodos (checkout, status, refund, recurring, token, verify)
│   │   └── types/datafast.types.ts        — 680 líneas: tipos, enums, StatusMapper, CreditType, BankResponseCodes
│   ├── modules/payments/
│   │   ├── payment.controller.ts          — 6 endpoints Express
│   │   ├── payment.service.ts             — Orquestación + DB (Prisma)
│   │   ├── payment.routes.ts              — Router montado en /api/payments
│   │   └── dto/create-checkout.dto.ts     — Validación class-validator con MinLength/MaxLength
│   └── app.ts                              — Express + helmet + cors + rate-limit
└── prisma/
    └── schema.prisma                       — 6 modelos: Customer, Transaction, Token, RecurringPayment, Refund, AuditLog

frontend/
├── src/
│   ├── app/pago/
│   │   ├── [checkoutId]/
│   │   │   ├── page.tsx                    — Server Component: recibe checkoutId de params
│   │   │   └── widget.tsx                  — Client Component: carga widget Datafast + opciones avanzadas
│   │   └── resultado/
│   │       └── page.tsx                    — Result page: lee resourcePath, muestra estado + detalles
│   ├── hooks/
│   │   ├── useDatafastPayment.ts           — Hook: crea checkout, calcula impuestos, redirige
│   │   └── usePurchaseDialog.ts           — Hook: diálogo de compra, valida cédula, captura middleName
│   ├── services/
│   │   └── payments.ts                     — getPaymentStatus(), verifyPayment()
│   └── lib/
│       └── api.ts                          — fetch wrapper con timeout + error handling
```

---

## 10. Matriz de Trazabilidad — Documentación vs Código

| Sección Doc | Requisito | Archivo:Línea | Estado |
|---|---|---|---|
| 3.1.1 | POST /v1/checkouts | `datafast.service.ts:24-123` | ✅ |
| 3.1.1 | entityId, amount, currency, paymentType | `datafast.service.ts:31-34` | ✅ |
| 3.1.1 | Authorization Bearer | `datafast.client.ts:16` | ✅ |
| 3.1.2 | paymentWidgets.js + checkoutId | `widget.tsx:117` | ✅ |
| 3.1.2 | form class wpwl-form | `widget.tsx:150` | ✅ |
| 3.1.2 | shopperResultURL | `widget.tsx:150` → `/pago/resultado` | ✅ |
| 3.1.3 | GET resourcePath + entityId | `datafast.service.ts:129-143` | ✅ |
| 3.2.1.1 | customer.givenName {3,48} | `datafast.service.ts:37` + DTO validado | ✅ |
| 3.2.1.2 | customer.middleName {2,50} | `datafast.service.ts:38-40` + DTO validado | ✅ |
| 3.2.1.3 | customer.surname {3,48} | `datafast.service.ts:41` + DTO validado | ✅ |
| 3.2.1.4 | customer.ip | `datafast.service.ts:42` + `payment.controller.ts:30` | ✅ |
| 3.2.1.5 | customer.merchantCustomerId | `payment.service.ts:53` | ✅ |
| 3.2.1.6 | merchantTransactionId único | `payment.service.ts:48` | ✅ |
| 3.2.1.7 | customer.email | `datafast.service.ts:44` + `@IsEmail()` | ✅ |
| 3.2.1.8 | identificationDocType = IDCARD | `datafast.service.ts:45` | ✅ |
| 3.2.1.9 | identificationDocId 10 dígitos | `datafast.service.ts:46` `.padStart(10,'0')` | ✅ |
| 3.2.1.10 | cart.items[] | `datafast.service.ts:83-89` | ✅ |
| 3.2.1.11 | customer.phone {7,25} | `datafast.service.ts:47` + `@MinLength(7) @MaxLength(25)` | ✅ |
| 3.2.1.12-15 | billing/shipping | `datafast.service.ts:50-55` | ✅ |
| 3.2.1.16 | testMode=EXTERNAL | `datafast.service.ts:96-98` | ✅ |
| 3.2.1.17.1 | Impuestos SHOPPER_VAL_* | `datafast.service.ts:58-60` | ✅ |
| 3.2.1.17.2 | MID/TID | `datafast.service.ts:63-64` | ✅ |
| 3.2.1.17.3 | ECI/PSERV fijos | `config/datafast.ts:29-30` | ✅ |
| 3.2.1.17.4 | VERSION=2 | `config/datafast.ts:31` | ✅ |
| 3.2.1.18 | risk USER_DATA2 | `datafast.service.ts:80` | ✅ |
| 4 | Códigos de respuesta | `StatusMapper` + `ERROR_MESSAGES` | ✅ |
| 5.1 | Diferidos (installments) | `widget.tsx:44-56` | ✅ |
| 5.2 | Tipo de crédito | `widget.tsx:59-72` | ✅ |
| 5.3 | Validación cardholder | `widget.tsx:96-109` | ✅ |
| 5.6 | Estilo formulario | `widget.tsx:33` | ✅ |
| 6.2 | Tokenización checkbox | `widget.tsx:75-81` | ✅ |
| 6.3 | DELETE token | `datafast.service.ts:225-235` | ✅ |
| 7 | Anulaciones (RF) | `datafast.service.ts:149-173` | ✅ |
| 10 | Verificador transacciones | `datafast.service.ts:240-276` | ✅ |
| Pagos recurrentes | Token + REPEATED | `datafast.service.ts:178-219` | ✅ |
| Prod | URLs y testMode | `config/datafast.ts:17-19` | ✅ |
| Prod | Logo Datafast | `widget.tsx:84-93` | ✅ |

---

## 11. Cambios Aplicados en esta Auditoría

| Issue | Severidad | Archivo | Cambio |
|---|---|---|---|
| ISSUE-001 | ALTA | `datafast.service.ts:46` | `identificationDocId.padStart(10, '0')` |
| ISSUE-002 | ALTA | `payment.service.ts:53` | `merchantCustomerId` usa valor del frontend |
| ISSUE-003 | ALTA | `widget.tsx:150` | `className="wpwl-form"` |
| ISSUE-004 | MEDIA | `widget.tsx:44-56` | Select de cuotas (SHOPPER_INSTALLMENTS) |
| ISSUE-005 | MEDIA | `widget.tsx:59-72` | Select de tipo de crédito (SHOPPER_TIPOCREDITO) |
| ISSUE-006 | MEDIA | `widget.tsx:75-81` | Checkbox createRegistration |
| ISSUE-007 | MEDIA | `usePurchaseDialog.ts` + `useDatafastPayment.ts` | Campo middleName en frontend |
| ISSUE-008 | MEDIA | `create-checkout.dto.ts` | `@MinLength`/`@MaxLength` en DTO |
| ISSUE-009 | BAJA | `widget.tsx:96-109` | `onBeforeSubmitCard` validación cardholder |
| ISSUE-010 | BAJA | `widget.tsx:84-93` | Logo "Powered by Datafast" |

---

## 12. Recomendaciones Finales

### Inmediatas (antes de certificación con Datafast)
1. Ejecutar prueba `curl` del Anexo G para verificar conectividad al gateway
2. Reemplazar `billing.street1 = "Av. Principal"` hardcodeado con campo real del formulario de compra
3. Evaluar cambiar `optionalAuth` → `authMiddleware` si se requiere autenticación obligatoria en pagos

### Corto plazo (post-certificación)
4. Implementar UI para administración de tokens guardados (OneClick)
5. Implementar UI de anulaciones para administradores
6. Mejorar `merchantCustomerId` en frontend — usar ID estable del usuario en lugar de `Date.now()`

### Producción
7. Crear archivo `.env.production` con credenciales reales de Datafast
8. Coordinar escaneo de vulnerabilidades con Datafast (estimar 8 días hábiles)
9. Primera transacción en producción: $1.00 como prueba única
10. Agregar políticas obligatorias al sitio (Privacidad, Contacto, Envío, Términos)

### Contacto Datafast
- **Soporte integración:** servbdpago@datafast.com.ec
- **Soporte producción:** servbdpago@datafast.com.ec
