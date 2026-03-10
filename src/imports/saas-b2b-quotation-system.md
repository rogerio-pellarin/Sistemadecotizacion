# 🎯 CONTEXTO DO PRODUTO

Estamos construindo um **Sistema de Cotação SaaS B2B** que substituirá um modelo complexo em Excel.

O sistema deve:

* Permitir criação estruturada de cotações por atividades
* Aplicar regras automáticas de custo, margem, testing, PM, segurança
* Permitir desconto configurável
* Trabalhar com múltiplas moedas (USD base + conversão)
* Gerar visualização final profissional da proposta
* Ser moderno, claro, executivo e fácil de usar

Estilo visual:

* Minimalista
* Profissional
* Tech B2B
* Interface limpa (estilo Linear / Stripe / Notion)
* Priorizar legibilidade e clareza de números

---

# 🧩 ARQUITETURA DE TELAS

O sistema terá as seguintes telas principais:

1. Dashboard
2. Lista de Cotações
3. Nova Cotação (Wizard)
4. Editor de Cotação (principal)
5. Gestão de Recursos (Roles)
6. Gestão de Parâmetros (Ks)
7. Visualização Final da Proposta
8. Modal de Desconto
9. Modal de Conversão de Moeda
10. Histórico / Versionamento

Agora, construa cada tela conforme instruções abaixo.

---

# 1️⃣ DASHBOARD

Objetivo: visão executiva rápida.

Componentes:

* Header superior com:

  * Nome do sistema
  * Empresa logada
  * Avatar usuário
* Cards métricos:

  * Total de cotações criadas
  * Total em USD
  * Total em moeda local
  * Ticket médio
* Gráfico:

  * Evolução mensal de cotações
* Botão principal:
  ➜ "Nueva Cotización"

Estilo:

* Cards com sombra leve
* Ícones lineares minimalistas
* Números grandes e fortes

---

# 2️⃣ LISTA DE COTAÇÕES

Tabela moderna com:

Colunas:

* Código
* Cliente
* Proyecto
* Fecha
* Moneda
* Total
* Estado
* Acciones (Editar / Ver / Duplicar / Eliminar)

Filtros superiores:

* Por cliente
* Por moneda
* Por estado
* Por rango de fecha

Botão flutuante:
➜ Nueva Cotización

---

# 3️⃣ WIZARD – CRIAÇÃO DE NOVA COTAÇÃO

Step 1 – Información General

Campos:

* Cliente
* Proyecto
* Idioma (EN / ES)
* Moneda de Cotización (USD / Local)
* TRM (editable si moneda ≠ USD)
* Margen de Seguridad (%)
* Factor Testing (%)
* Factor PM (%)
* Tipo de Descuento (Porcentaje / Fijo)
* Valor Descuento

Botão:
➜ Continuar

Layout:
Formulário em 2 colunas
Explicações pequenas abaixo de campos técnicos

---

# 4️⃣ EDITOR DE COTAÇÃO (TELA PRINCIPAL)

Essa é a tela mais importante.

Layout dividido em 3 áreas:

🟦 Coluna esquerda (70%) – Tabela de Itens
🟨 Coluna direita (30%) – Resumen dinámico

---

## 🟦 TABELA DE ITENS

Cada linha representa uma atividade.

Colunas:

* Código (A01, A02… auto)
* Descripción (editable)
* Rol (dropdown puxando de Recursos)
* Complejidad (opcional)
* Horas estimadas
* Costo Unidad (auto)
* Costo Total (auto)
* Precio Venta (auto)
* Acciones (duplicar / eliminar)

Botão abaixo:
➜ + Agregar Actividad

Regras visuais:

* Células calculadas em fundo cinza claro
* Atualização instantânea ao alterar horas ou rol
* Totais parciais no rodapé da tabela

---

## 🟨 RESUMEN DINÁMICO (SIDEBAR)

Card fixo mostrando:

Subtotal Base

* Testing (X%)
* Project Management (Y%)
* Margen Seguridad

---

Precio Antes Descuento
Descuento aplicado
------------------

TOTAL FINAL

Se moeda ≠ USD:
mostrar:

* Total USD
* Total moneda local
* TRM aplicada

Botão grande:
➜ Ver Propuesta Final

---

# 5️⃣ GESTIÓN DE RECURSOS (ROLES)

Tabela editável com:

* Nombre del Rol
* Tipo (Staff / Externo)
* Costo Base
* Prestaciones (%)
* Costo Total Calculado
* Activo (toggle)

Botão:
➜ Nuevo Rol

Essa tela permitirá alterar regras estruturais.

---

# 6️⃣ GESTIÓN DE PARÁMETROS (Ks)

Tela com cards editáveis:

* HorasMes
* Prestaciones Ley 50
* Prestaciones Integral
* Margen Seguridad Default
* Factor Testing Default
* Factor PM Default
* MaxItems

Cada um com tooltip explicando impacto.

---

# 7️⃣ VISUALIZAÇÃO FINAL DA PROPOSTA

Tela estilo documento executivo.

Header:

* Logo empresa
* Datos cliente
* Fecha

Tabela resumida:
Código | Descripción | Días | Precio

Resumo final destacado.

Se desconto aplicado:
mostrar linha:
"Descuento aplicado"

Botões:

* Exportar PDF
* Enviar por email
* Descargar Excel (opcional)

---

# 8️⃣ MODAL DE DESCUENTO

Campos:

* Tipo
* Valor
  Preview em tempo real:
  Mostrar impacto no total

---

# 9️⃣ MODAL DE CONVERSIÓN

Mostrar:

Total USD
TRM
Total Convertido

Permitir editar TRM e recalcular

---

# 🔟 HISTÓRICO / VERSIONAMENTO

Timeline lateral:

Versión 1
Versión 2
Versión 3

Mostrar:

* Quién modificó
* Qué cambió
* Fecha

Botão:
➜ Restaurar versión

---

# 🎨 DIRETRIZES VISUAIS

* Grid 8pt
* Border radius 8px
* Botões primários em azul escuro
* Inputs com borda suave
* Font: Inter / SF Pro
* Números alinhados à direita
* Sempre mostrar símbolo de moeda

---

# 🔁 INTERAÇÕES IMPORTANTES

* Atualização automática dos cálculos
* Tooltip explicando fórmulas
* Campos calculados não editáveis
* Alerta se ultrapassar MaxItems
* Confirmação antes de excluir item

---

# 📐 RESPONSIVIDADE

* Desktop prioritário
* Tablet adaptável
* Mobile apenas para visualização

---

# 🔐 PENSAR COMO SaaS

* Multi-empresa
* Permissões (Admin / Comercial / Viewer)
* Logs de auditoria
* Versionamento automático

