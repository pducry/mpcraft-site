# Página de Liderança — Design Spec
**Data:** 2026-06-06  
**Projeto:** MPCraft · Mercado Pago  
**Escopo:** Template de página individual para cada líder de UX

## Abordagem: Portfólio de Liderança

Página que conta a história do líder com evidências concretas. Combina autoavaliação com registro de projetos e decisões. Serve tanto para reflexão pessoal quanto para apresentação à gestão.

## Estrutura de Seções (8)

| # | Seção | Formato |
|---|-------|---------|
| 01 | Perfil + Momento atual | Bio fixa + bloco Q atualizado |
| 02 | Fortalezas | Título bold + descrição com evidência |
| 03 | Oportunidades de Melhoria | Título + status pill (Identificado / Em desenvolvimento / Resolvido) |
| 04 | Visão de Liderança | Citação em itálico |
| 05 | Projetos de Impacto | Cards com nome, período, resultado |
| 06 | Desafios Ativos | Lista com bullet `·` |
| 07 | Próximos Passos | Lista com seta `→` e prazo |
| 08 | Decisões e Aprendizados | Entradas com data e narrativa |

## Visual

- Segue identidade MPCraft: dark canvas, Inter/Space Mono/Newsreader, theme.css existente
- Componentes: section-divider, meta-grid, pill, padrão ritual-step
- Status pills: amber (Em desenvolvimento), neutro (Identificado), green (Resolvido)
- Seção "Momento atual" com accent azul (#5b8fff)

## Acesso

- Cada página tem senha individual via SHA-256 + localStorage key único
- Sem link de navegação entre páginas de membros diferentes
