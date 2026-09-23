# PetVitta Intelligence — Dashboard Executivo

Dashboard financeiro e de desempenho operacional da rede PetVitta, construído com foco em leitura executiva rápida: visão consolidada da operação, comparação entre filiais, estrutura de custos, investimentos e rentabilidade gerencial, com filtros de período e filial aplicados de forma consistente em todas as abas.

Projeto gerado e iterado com [v0](https://v0.app).

## Visão geral

O dashboard é organizado em abas, cada uma respondendo a uma pergunta de negócio distinta:

| Aba | Objetivo |
|---|---|
| **Visão Executiva** | Panorama consolidado: receita, resultado, margem operacional, status geral da operação e alertas automáticos (ex.: "Atenção parcial" quando indicadores recuam no período). |
| **Filiais** | Comparação entre unidades: filiais em crescimento vs. em regressão, maior resultado, tabela ordenável por receita, margem, resultado, crescimento, participação e tendência. Suporta drill-down por filial individual. |
| **Receita** | Composição da receita por categoria (gráfico de pizza) e por canal de venda (loja física, WhatsApp, site, transferência, outros). |
| **Custos** | Indicadores de custos variáveis, despesas sobre receita e concentração dos top 5 custos, além de um ranking dos maiores ofensores de custo no período. |
| **Investimentos** | Investimento acumulado, investimento no mês, principal categoria de CAPEX e série histórica de investimentos por período (mantidos fora do resultado operacional). |
| **Rentabilidade** | Margem operacional por filial com marcador visual da margem média da rede (25,3%) sobreposto a cada barra, permitindo comparação instantânea acima/abaixo da média. |
| **Qualidade dos dados** | Metodologia aplicada (regra de status, base analisada, período) e limitações conhecidas da base, para transparência sobre os números apresentados. |

## Principais decisões de produto

- **Base de comparação padronizada**: todos os cards de KPI usam o rótulo "vs. período anterior" (dinâmico conforme o filtro de período selecionado), evitando a ambiguidade de rótulos fixos como "vs. mês anterior" quando o usuário filtra por trimestre, semestre etc.
- **Cálculo independente por métrica**: receita, resultado e margem são calculados a partir de suas próprias séries históricas — nenhuma métrica reaproveita o percentual de variação de outra.
- **Rótulos sem ambiguidade**: indicadores de proporção (ex.: filiais em crescimento) deixam explícita a base do cálculo (ex.: "2 de 4 filiais" / "50% da rede") em vez de percentuais isolados.
- **Benchmark visual embutido no componente**: a margem média da rede aparece tanto no cabeçalho quanto como um tick vertical sobre cada barra de progresso individual, dispensando a necessidade de comparar números mentalmente.
- **Filtros consistentes**: seleção de período e filial afeta todas as abas simultaneamente, mantendo os números sempre no mesmo contexto de análise.

## Stack técnica

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Gráficos**: [Recharts](https://recharts.org)
- **Ícones**: [lucide-react](https://lucide.dev)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)
- **Linguagem**: TypeScript

## Estrutura do projeto

```
app/
  layout.tsx      # Metadata, viewport e shell raiz da aplicação
  page.tsx         # Dashboard completo: dados, abas, KPIs, gráficos e tabelas
  globals.css      # Tokens de design e estilos globais (Tailwind v4)
components/
  ui/              # Componentes shadcn/ui (button, empty, skeleton, ...)
```

## Como rodar localmente

Pré-requisitos: Node.js 18+ e [pnpm](https://pnpm.io).

```bash
# instalar dependências
pnpm install

# ambiente de desenvolvimento (http://localhost:3000)
pnpm dev

# build de produção
pnpm build
pnpm start
```

## Publicação

Este projeto foi construído no [v0](https://v0.app). Duas formas de publicar:

1. **Deploy direto pelo v0**: clique em **Publish** no canto superior direito do chat para gerar um deployment na Vercel.
2. **GitHub**: conecte um repositório em **Settings → Git** (canto superior direito) para sincronizar os commits automaticamente e, a partir daí, abrir Pull Requests ou conectar a Vercel ao repositório para deploy contínuo.

## Notas sobre os dados

Os dados exibidos são ilustrativos e servem para demonstrar a experiência do dashboard. A aba **Qualidade dos dados** documenta a metodologia (regra de reconhecimento de status, base analisada, período de referência) e as limitações conhecidas, incluindo divergências entre quantidade × valor unitário e a definição de margem como **Margem de Contribuição Gerencial**.
