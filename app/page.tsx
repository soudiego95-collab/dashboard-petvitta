'use client'

import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Building2, ChevronDown, CircleDollarSign, Filter, LayoutDashboard, Menu, Package, RefreshCcw, Search, SearchX, Settings2, ShieldCheck, TrendingDown, TrendingUp, WalletCards, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const months = [
  { month: 'jul/25', receita: 126420, resultado: 38110, margem: 30.1 },
  { month: 'ago/25', receita: 134870, resultado: 43280, margem: 32.1 },
  { month: 'set/25', receita: 143650, resultado: 47620, margem: 33.1 },
  { month: 'out/25', receita: 119480, resultado: 27450, margem: 23.0 },
  { month: 'nov/25', receita: 125625, resultado: 60743, margem: 48.4 },
  { month: 'dez/25', receita: 114266, resultado: 66008, margem: 57.8 },
  { month: 'jan/26', receita: 107469, resultado: 44665, margem: 41.6 },
  { month: 'fev/26', receita: 66417, resultado: 14818, margem: 22.3 },
  { month: 'mar/26', receita: 97331, resultado: 38059, margem: 39.1 },
  { month: 'abr/26', receita: 94908, resultado: 36730, margem: 38.7 },
  { month: 'mai/26', receita: 106698, resultado: 39459, margem: 37.0 },
  { month: 'jun/26', receita: 87284, resultado: 19682, margem: 22.6 },
]

const branches = [
  { name: 'Vila Nova', receita: 746820, mc: 581400, despesas: 324900, resultado: 256500, margem: 34.4, crescimento: 12.8, participacao: 29.1, trend: 'Crescimento' },
  { name: 'Parque das Águas', receita: 721640, mc: 538200, despesas: 348700, resultado: 189500, margem: 26.3, crescimento: 7.4, participacao: 21.5, trend: 'Crescimento' },
  { name: 'Centro', receita: 704310, mc: 529600, despesas: 365100, resultado: 164500, margem: 23.4, crescimento: -3.2, participacao: 18.7, trend: 'Regressão' },
  { name: 'Jardim das Flores', receita: 667287, mc: 490400, despesas: 376700, resultado: 113700, margem: 17.0, crescimento: -8.6, participacao: 12.9, trend: 'Regressão' },
]

const categories = [
  { name: 'Venda de produtos', value: 1498200, share: 52.7, color: '#0f766e' },
  { name: 'Serviços', value: 1341857, share: 47.3, color: '#62a3a4' },
]
const costs = [
  { name: 'Folha de pagamento', value: 386420, delta: 9.8, type: 'Despesa operacional' },
  { name: 'Aluguel e condomínio', value: 218600, delta: 4.2, type: 'Despesa operacional' },
  { name: 'Taxas de cartão', value: 137840, delta: 18.6, type: 'Custo variável' },
  { name: 'Serviços terceirizados', value: 124780, delta: -2.4, type: 'Despesa operacional' },
  { name: 'Taxas de marketplace', value: 98650, delta: 22.1, type: 'Custo variável' },
]

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1).replace('.', ',')}%`

type Page = 'Visão Executiva' | 'Filiais' | 'Rentabilidade' | 'Receitas' | 'Custos' | 'Investimentos' | 'Qualidade dos Dados'

export default function Page() {
  const monthKeys = months.map((m) => m.month)
  const [page, setPage] = useState<Page>('Visão Executiva')
  const [selectedMonths, setSelectedMonths] = useState<string[]>(monthKeys)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [branch, setBranch] = useState('Todas as filiais')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState('Vila Nova')

  const [isFiltering, setIsFiltering] = useState(false)
  const filteredMonths = useMemo(() => months.filter((m) => selectedMonths.includes(m.month)), [selectedMonths])
  const current = filteredMonths[filteredMonths.length - 1] ?? months[months.length - 1]
  const previous = filteredMonths.length > 1 ? filteredMonths[filteredMonths.length - 2] : months[months.length - 2]
  const revenueGrowth = (current.receita / previous.receita - 1) * 100
  const resultGrowth = (current.resultado / previous.resultado - 1) * 100
  const marginDeltaPeriod = current.margem - previous.margem

  useEffect(() => {
    setIsFiltering(true)
    const t = setTimeout(() => setIsFiltering(false), 380)
    return () => clearTimeout(t)
  }, [branch, selectedMonths])

  const toggleMonth = (m: string) => setSelectedMonths((prev) => {
    if (prev.includes(m)) return prev.length <= 2 ? prev : prev.filter((x) => x !== m)
    return [...prev, m].sort((a, b) => monthKeys.indexOf(a) - monthKeys.indexOf(b))
  })
  const periodLabel = useMemo(() => {
    if (selectedMonths.length === monthKeys.length) return 'Todo o período'
    const last3 = monthKeys.slice(-3), last6 = monthKeys.slice(-6)
    if (selectedMonths.length === 3 && last3.every((m) => selectedMonths.includes(m))) return 'Últimos 3 meses'
    if (selectedMonths.length === 6 && last6.every((m) => selectedMonths.includes(m))) return 'Últimos 6 meses'
    if (selectedMonths.length === 1) return selectedMonths[0]
    return `${selectedMonths.length} meses selecionados`
  }, [selectedMonths])

  const filteredBranches = useMemo(() => branch === 'Todas as filiais' ? branches : branches.filter((b) => b.name === branch), [branch])
  const isSingleBranch = branch !== 'Todas as filiais'
  const totalReceitaAll = branches.reduce((s, b) => s + b.receita, 0)
  const periodFactor = filteredMonths.length / months.length
  const totalReceita = filteredBranches.reduce((s, b) => s + b.receita, 0) * periodFactor
  const totalResultado = filteredBranches.reduce((s, b) => s + b.resultado, 0) * periodFactor
  const margemOperacional = totalReceita ? (totalResultado / totalReceita) * 100 : 0
  const avgMarginAll = branches.reduce((s, b) => s + b.margem, 0) / branches.length
  const branchFactor = totalReceitaAll ? (filteredBranches.reduce((s, b) => s + b.receita, 0) / totalReceitaAll) : 1
  const scale = branchFactor * periodFactor
  const branchesEmAtencao = filteredBranches.filter((b) => b.trend === 'Regressão')
  // Receita, resultado e margem são calculados de forma independente a partir de suas próprias
  // séries históricas — evita reaproveitar o percentual de uma métrica em outra.
  const growthDetail = revenueGrowth
  const resultDetail = resultGrowth
  const marginDelta = marginDeltaPeriod
  const periodCaption = 'vs. período anterior'
  const marginVsAvg = isSingleBranch ? filteredBranches[0].margem - avgMarginAll : 0
  const secondaryGrowth = isSingleBranch ? `Crescimento anual da filial: ${pct(filteredBranches[0].crescimento)}` : undefined
  const secondaryResult = isSingleBranch ? `Participação no resultado da rede: ${filteredBranches[0].participacao.toFixed(1).replace('.', ',')}%` : undefined
  const secondaryMargin = isSingleBranch ? `vs. média da rede: ${marginVsAvg >= 0 ? '+' : ''}${marginVsAvg.toFixed(1).replace('.', ',')} p.p.` : undefined
  const hasData = filteredBranches.length > 0 && filteredMonths.length > 0
  const resetFilters = () => { setSelectedMonths(monthKeys); setBranch('Todas as filiais') }

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#173333]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#dce7e3] bg-[#fbfdfc] transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center gap-3 border-b border-[#e7efec] px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-[#0f766e] text-white shadow-sm"><Activity /></div>
          <div><p className="text-[17px] font-bold tracking-tight">Pet<span className="text-[#0f766e]">Vitta</span></p><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#8aa09c]">Intelligence</p></div>
        </div>
        <div className="px-4 py-7"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9aaca8]">Análise gerencial</p><nav className="flex flex-col gap-1">
          {(['Visão Executiva', 'Filiais', 'Rentabilidade', 'Receitas', 'Custos', 'Investimentos', 'Qualidade dos Dados'] as Page[]).map((item, i) => <button key={item} onClick={() => { setPage(item); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition-colors ${page === item ? 'bg-[#e2f2ee] font-semibold text-[#0f766e]' : 'text-[#718782] hover:bg-[#f0f6f3] hover:text-[#173333]'}`}>{[LayoutDashboard, Building2, CircleDollarSign, BarChart3, WalletCards, TrendingUp, ShieldCheck][i] && (() => { const I = [LayoutDashboard, Building2, CircleDollarSign, BarChart3, WalletCards, TrendingUp, ShieldCheck][i]; return <I data-icon="inline-start" /> })()}{item}{page === item && <span className="ml-auto size-1.5 rounded-full bg-[#0f766e]" />}</button>)}
        </nav></div>
        <div className="mt-auto border-t border-[#e7efec] p-5"><div className="rounded-xl bg-[#f0f7f4] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#39716c]"><RefreshCcw data-icon="inline-start" /> Dados atualizados</div><p className="text-[11px] leading-relaxed text-[#77908a]">Base publicada em 30 jun 2026<br />6.200 lançamentos analisados</p></div></div>
      </aside>
      {mobileOpen && <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-[#173333]/20 lg:hidden" />}
      <main className="lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[#e1ebe7] bg-[#fafdfe]/90 px-5 backdrop-blur-md sm:px-8 lg:px-10"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-[#eef5f2] lg:hidden"><Menu /></button><div><p className="text-xs font-medium text-[#87a09a]">Painel executivo / <span className="text-[#436963]">2026</span></p><h1 className="text-xl font-bold tracking-tight text-[#173333] sm:text-[22px]">{page}</h1></div></div><div className="flex items-center gap-2 sm:gap-4"><button type="button" title="Atenção parcial: a operação segue lucrativa, mas receita, resultado e margem recuaram no último mês." aria-label="Status: Atenção parcial. A operação segue lucrativa, mas receita, resultado e margem recuaram no último mês." className="hidden cursor-help items-center gap-2 rounded-lg border border-[#eadfca] bg-[#fffaf0] px-3 py-2 text-xs font-medium text-[#8a6a2f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c18b37] sm:flex"><span className="size-2 rounded-full bg-[#d7a34c]" /> Atenção parcial</button><button className="rounded-lg p-2 text-[#79918c] hover:bg-[#edf5f1]"><Bell /></button><div className="grid size-9 place-items-center rounded-full bg-[#d9ebe5] text-xs font-bold text-[#0f766e]">DR</div></div></header>
        <div className="mx-auto max-w-[1540px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="mb-1 text-sm font-medium text-[#0f766e]">Bom dia, Diretoria</p><h2 className="text-[27px] font-bold tracking-[-.03em] text-[#173333]">A PetVitta em um só olhar.</h2><p className="mt-1 text-sm text-[#78918b]">Acompanhe a performance econômica da operação por competência.</p></div><div className="flex flex-wrap gap-2"><div className="relative"><button type="button" onClick={() => setPeriodOpen((o) => !o)} className="flex items-center gap-2 rounded-lg border border-[#dce8e4] bg-white px-3 py-2 text-xs font-medium text-[#5f7972] hover:bg-[#f6faf8]"><Filter data-icon="inline-start" /><span>{periodLabel}</span><ChevronDown data-icon="inline-end" className={`size-3 transition-transform ${periodOpen ? 'rotate-180' : ''}`} /></button>{periodOpen && <button aria-label="Fechar filtro de período" onClick={() => setPeriodOpen(false)} className="fixed inset-0 z-30 cursor-default" />}{periodOpen && <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-[280px] rounded-xl border border-[#dce8e4] bg-white p-3 shadow-[0_10px_30px_rgba(23,51,51,.12)]"><div className="mb-2 flex flex-wrap gap-1.5">{[['Todo o período', monthKeys], ['Últimos 3 meses', monthKeys.slice(-3)], ['Últimos 6 meses', monthKeys.slice(-6)]].map(([label, list]: any) => <button key={label} type="button" onClick={() => setSelectedMonths(list)} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${JSON.stringify(selectedMonths) === JSON.stringify(list) ? 'border-[#0f766e] bg-[#e9f5f1] text-[#0f766e]' : 'border-[#dce8e4] text-[#5f7972] hover:bg-[#f6faf8]'}`}>{label}</button>)}</div><p className="mb-1.5 px-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9aaca8]">Selecionar meses individualmente</p><div className="grid grid-cols-3 gap-1.5">{monthKeys.map((m) => <button key={m} type="button" onClick={() => toggleMonth(m)} aria-pressed={selectedMonths.includes(m)} className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium ${selectedMonths.includes(m) ? 'border-[#0f766e] bg-[#0f766e] text-white' : 'border-[#e2ece8] text-[#5f7972] hover:bg-[#f6faf8]'}`}>{m}</button>)}</div><p className="mt-2 px-0.5 text-[10px] text-[#9aaca8]">Mínimo de 2 meses para calcular variações.</p></div>}</div><div className="flex items-center gap-2 rounded-lg border border-[#dce8e4] bg-white px-3 py-2 text-xs font-medium text-[#5f7972]"><Building2 data-icon="inline-start" /><select value={branch} onChange={e => setBranch(e.target.value)} className="bg-transparent outline-none"><option>Todas as filiais</option>{branches.map(b => <option key={b.name}>{b.name}</option>)}</select></div><button onClick={resetFilters} className="rounded-lg border border-[#dce8e4] bg-white px-3 py-2 text-[#78918b] hover:bg-[#f0f7f4]"><X data-icon="inline-start" /></button></div></div>
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#dce8e4] bg-[#f4f9f7] px-4 py-2.5 text-xs font-medium text-[#456b64]">
            <Filter className="size-3.5 shrink-0 text-[#0f766e]" />
            <span>
              Filtrando: <strong className="font-bold text-[#173333]">{branch}</strong>
              <span className="px-1.5 text-[#9aaca8]">•</span>
              <strong className="font-bold text-[#173333]">{periodLabel}</strong>
            </span>
            {(isSingleBranch || selectedMonths.length !== monthKeys.length) && (
              <button type="button" onClick={resetFilters} className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-[#0f766e] hover:bg-white hover:underline">
                <X className="size-3" /> Limpar filtros
              </button>
            )}
          </div>
          {isFiltering ? (
            <PageSkeleton />
          ) : !hasData ? (
            <Empty className="rounded-2xl border border-[#dfebe7] bg-white">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>Nenhum dado para este filtro</EmptyTitle>
                <EmptyDescription>Nenhuma filial ou período combina com a seleção atual. Ajuste os filtros para ver os resultados.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <button type="button" onClick={resetFilters} className="rounded-lg border border-[#dce8e4] bg-white px-3 py-2 text-xs font-semibold text-[#0f766e] hover:bg-[#f0f7f4]">Limpar filtros</button>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              {page === 'Visão Executiva' && <Executive current={current} previous={previous} growthDetail={growthDetail} resultDetail={resultDetail} periodCaption={periodCaption} marginDelta={marginDelta} marginCaption={periodCaption} secondaryGrowth={secondaryGrowth} secondaryResult={secondaryResult} secondaryMargin={secondaryMargin} isSingleBranch={isSingleBranch} avgMarginAll={avgMarginAll} filteredMonths={filteredMonths} filteredBranches={filteredBranches} branchesEmAtencao={branchesEmAtencao} totalReceita={totalReceita} totalResultado={totalResultado} margemOperacional={margemOperacional} setPage={setPage} />}
              {page === 'Filiais' && <Branches selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} filteredBranches={filteredBranches} filteredMonths={filteredMonths} isSingleBranch={isSingleBranch} avgMarginAll={avgMarginAll} periodCaption={periodCaption} />}
              {page === 'Receitas' && <Revenue scale={scale} />}
              {page === 'Custos' && <Costs scale={scale} periodCaption={periodCaption} />}
              {page === 'Investimentos' && <Investments scale={scale} filteredMonths={filteredMonths} periodCaption={periodCaption} />}
              {page === 'Rentabilidade' && <Profitability filteredBranches={filteredBranches} />}
              {page === 'Qualidade dos Dados' && <Quality />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Kpi({ label, value, detail, positive, icon: Icon, tone = 'teal', caption = 'vs. período anterior', secondary, onClick }: { label: string; value: string; detail: string; positive?: boolean; icon: any; tone?: string; caption?: string; secondary?: string; onClick?: () => void }) { const numericDetail = Number.parseFloat(detail.replace(',', '.')); const isUp = Number.isNaN(numericDetail) || numericDetail >= 0; const isFavorable = positive !== false; const Wrapper: any = onClick ? 'button' : 'div'; return <Wrapper type={onClick ? 'button' : undefined} onClick={onClick} className={`rounded-2xl border border-[#dfebe7] bg-white p-5 text-left shadow-[0_3px_14px_rgba(32,80,70,.035)] ${onClick ? 'cursor-pointer transition-shadow hover:shadow-[0_6px_18px_rgba(32,80,70,.08)]' : ''}`}><div className="mb-4 flex items-start justify-between"><span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#89a09b]">{label}</span><div className={`grid size-9 place-items-center rounded-xl ${tone === 'red' ? 'bg-[#fff0ee] text-[#c26156]' : tone === 'amber' ? 'bg-[#fff5e5] text-[#c18b37]' : 'bg-[#e9f5f1] text-[#0f766e]'}`}><Icon /></div></div><p className="text-[23px] font-bold tracking-tight text-[#173333]">{value}</p><div className="mt-2 flex items-center gap-1 text-[11px] font-semibold"><span className={isFavorable ? 'text-[#248a61]' : 'text-[#c26156]'}>{isUp ? <ArrowUpRight data-icon="inline-start" /> : <ArrowDownRight data-icon="inline-start" />}{detail}</span><span className="font-normal text-[#9aacA7]">{caption}</span></div>{secondary && <p className="mt-1.5 truncate text-[10px] text-[#9aaca8]" title={secondary}>{secondary}</p>}</Wrapper> }

function PageSkeleton() {
  return <>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="rounded-2xl border border-[#dfebe7] bg-white p-5"><Skeleton className="h-3 w-24" /><Skeleton className="mt-4 h-7 w-32" /><Skeleton className="mt-3 h-3 w-20" /></div>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
      <div className="rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><Skeleton className="h-4 w-48" /><Skeleton className="mt-6 h-[220px] w-full" /></div>
      <div className="rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><Skeleton className="h-4 w-40" /><Skeleton className="mt-6 h-[160px] w-full" /></div>
    </div>
  </>
}

function Executive({ current, previous, growthDetail, resultDetail, periodCaption, marginDelta, marginCaption, filteredMonths, filteredBranches, branchesEmAtencao, totalReceita, totalResultado, margemOperacional, setPage }: any) {
  const atencaoLabel = branchesEmAtencao.length === 0 ? 'Nenhuma filial em atenção neste filtro' : branchesEmAtencao.map((b: any) => b.name).join(' e ')
  const selectedBranch = filteredBranches.length === 1 ? filteredBranches[0] : null
  const insights = selectedBranch ? [
    { tone: selectedBranch.crescimento >= 0 ? 'green' : 'red', title: `${selectedBranch.name}: ${selectedBranch.crescimento >= 0 ? 'crescimento' : 'regressão'}`, text: `Variação anual de ${pct(selectedBranch.crescimento)}, margem de ${selectedBranch.margem.toFixed(1).replace('.', ',')}% e resultado de ${brl(selectedBranch.resultado)}.` },
    { tone: selectedBranch.margem >= 28 ? 'green' : 'amber', title: 'Comparação com a média da rede', text: `A margem está ${Math.abs(selectedBranch.margem - 25.3).toFixed(1).replace('.', ',')} p.p. ${selectedBranch.margem >= 25.3 ? 'acima' : 'abaixo'} da média da rede.` },
    { tone: 'green', title: 'Participação no resultado', text: `${selectedBranch.name} representa ${selectedBranch.participacao.toFixed(1).replace('.', ',')}% do resultado consolidado.` },
  ] : [
    { tone: 'amber', title: 'Margem em deterioração', text: 'A receita cresceu, mas a margem operacional recuou 3,4 p.p. no último mês.' },
    { tone: 'green', title: 'Vila Nova lidera resultado', text: 'A filial representa 29,1% do resultado consolidado, com crescimento de 12,8%.' },
    { tone: 'red', title: 'Centro e Jardim das Flores em regressão', text: 'Queda de 3,2% e 8,6% na receita, respectivamente, com margem operacional abaixo da média da rede.' },
  ]
  return <>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi label="Receita líquida" value={brl(totalReceita)} detail={pct(growthDetail)} positive={growthDetail >= 0} icon={CircleDollarSign} caption={periodCaption} /><Kpi label="Resultado operacional" value={brl(totalResultado)} detail={pct(resultDetail)} positive={resultDetail >= 0} icon={resultDetail >= 0 ? TrendingUp : TrendingDown} tone={resultDetail >= 0 ? 'teal' : 'red'} caption={periodCaption} /><Kpi label="Margem operacional" value={`${margemOperacional.toFixed(1).replace('.', ',')}%`} detail={`${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1).replace('.', ',')} p.p.`} positive={marginDelta >= 0} icon={Activity} tone={marginDelta >= 0 ? 'teal' : 'amber'} caption={marginCaption} /><Kpi label="Filiais em atenção" value={`${branchesEmAtencao.length} de ${filteredBranches.length}`} detail={atencaoLabel} positive={branchesEmAtencao.length === 0} icon={Building2} onClick={() => setPage('Filiais')} /></div>
  <div className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]"><section className="rounded-2xl border border-[#dfebe7] bg-white p-5 shadow-[0_3px_14px_rgba(32,80,70,.035)] sm:p-6"><div className="mb-6 flex items-start justify-between"><div><h3 className="font-bold text-[#173333]">Evolução do resultado</h3><p className="mt-1 text-xs text-[#8ba09a]">Receita líquida e resultado operacional · competência</p></div><button className="rounded-lg border border-[#e2ece8] px-3 py-2 text-xs font-semibold text-[#5d7770]">Mensal <ChevronDown data-icon="inline-end" /></button></div><div className="h-[250px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={filteredMonths}><defs><linearGradient id="receita" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7eb9b0" stopOpacity={.28}/><stop offset="100%" stopColor="#7eb9b0" stopOpacity={0}/></linearGradient><linearGradient id="resultado" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={.22}/><stop offset="100%" stopColor="#0f766e" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf3f0"/><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}} tickFormatter={(v) => `${Math.round(v/1000)}k`} width={35}/><Tooltip formatter={(v: any) => brl(v)} contentStyle={{borderRadius:12,border:'1px solid #dfebe7',fontSize:12}}/><Area type="monotone" dataKey="receita" name="Receita líquida" stroke="#78aba6" strokeWidth={2} fill="url(#receita)"/><Area type="monotone" dataKey="resultado" name="Resultado operacional" stroke="#0f766e" strokeWidth={2.5} fill="url(#resultado)"/></AreaChart></ResponsiveContainer></div><div className="mt-4 flex gap-5 text-[11px] text-[#78918b]"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#78aba6]"/> Receita líquida</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#0f766e]"/> Resultado operacional</span></div></section>
  <section className="rounded-2xl border border-[#dfebe7] bg-white p-5 shadow-[0_3px_14px_rgba(32,80,70,.035)] sm:p-6"><div className="mb-6 flex items-start justify-between"><div><h3 className="font-bold text-[#173333]">Participação por filial</h3><p className="mt-1 text-xs text-[#8ba09a]">Contribuição no resultado consolidado</p></div><button onClick={() => setPage('Filiais')} className="text-xs font-bold text-[#0f766e]">Ver detalhes</button></div><div className="h-[180px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={filteredBranches} layout="vertical" margin={{left:5,right:15}}><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={102} tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#6d8780'}}/><Tooltip formatter={(v: any) => brl(v)} contentStyle={{borderRadius:12,border:'1px solid #dfebe7',fontSize:12}}/><Bar dataKey="resultado" radius={[0,5,5,0]} barSize={18} fill="#0f766e" /></BarChart></ResponsiveContainer></div><div className="mt-3 divide-y divide-[#edf3f0]">{filteredBranches.map((b: any) => <div key={b.name} className="flex items-center justify-between py-2 text-xs"><span className="text-[#6f8781]">{b.name}</span><span className="font-bold text-[#173333]">{brl(b.resultado)}</span></div>)}</div></section></div>
  <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]"><section className="rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold">Sinais para decisão</h3><p className="mt-1 text-xs text-[#8ba09a]">Variações que merecem atenção</p></div><Bell className="text-[#c18b37]" /></div><div className="flex flex-col gap-3">{insights.map((insight) => <Alert key={insight.title} tone={insight.tone} title={insight.title} text={insight.text} />)}</div></section><section className="rounded-2xl border border-[#dfebe7] bg-[#f0f7f4] p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-white text-[#0f766e]"><ShieldCheck /></div><div><h3 className="font-bold">Confiabilidade dos dados</h3><p className="text-xs text-[#72908a]">Transparência da metodologia</p></div></div><p className="text-sm leading-relaxed text-[#55736c]">Receita calculada pelo <strong>Valor líquido (R$)</strong>. Cancelados excluídos. A margem atual é gerencial e não representa rentabilidade individual por produto.</p><button className="mt-4 text-xs font-bold text-[#0f766e]">Ver metodologia completa →</button></section></div>
</> }

function Alert({ tone, title, text }: { tone: string; title: string; text: string }) { const isNegative = tone === 'red'; return <div className="flex gap-3 rounded-xl border border-[#edf2ef] bg-[#fbfdfc] p-3"><div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${isNegative ? 'bg-[#fff0ee] text-[#c26156]' : tone === 'amber' ? 'bg-[#fff5e5] text-[#c18b37]' : 'bg-[#e9f5f1] text-[#248a61]'}`} aria-hidden="true">{isNegative ? '↘' : '↗'}</div><div><p className="text-xs font-bold text-[#34544d]">{title}</p><p className="mt-1 text-[11px] leading-relaxed text-[#78918b]">{text}</p></div></div> }

function Branches({ selectedBranch, setSelectedBranch, filteredBranches, filteredMonths, isSingleBranch, avgMarginAll, periodCaption = 'vs. período anterior' }: any) { const effectiveSelected = filteredBranches.some((x: any) => x.name === selectedBranch) ? selectedBranch : filteredBranches[0]?.name; const b = filteredBranches.find((x: any) => x.name === effectiveSelected) ?? branches[0]; const [sortKey, setSortKey] = useState<string | null>(null); const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc'); const columns: [string, string][] = [['Filial','name'],['Receita','receita'],['Margem operacional','margem'],['Resultado','resultado'],['Crescimento','crescimento'],['Participação','participacao'],['Tendência','trend']]; const toggleSort = (key: string) => { if (sortKey === key) { setSortDir(sortDir === 'asc' ? 'desc' : 'asc') } else { setSortKey(key); setSortDir('desc') } }; const sortedBranches = (sortKey ? [...filteredBranches].sort((a: any, c: any) => { const av = (a as any)[sortKey]; const cv = (c as any)[sortKey]; const cmp = typeof av === 'string' ? av.localeCompare(cv) : av - cv; return sortDir === 'asc' ? cmp : -cmp }) : filteredBranches); const growing = filteredBranches.filter((x: any) => x.trend === 'Crescimento'); const declining = filteredBranches.filter((x: any) => x.trend === 'Regressão'); const leader = [...filteredBranches].sort((a: any, c: any) => c.resultado - a.resultado)[0]; const selected = filteredBranches[0]; const marginDelta = selected ? selected.margem - avgMarginAll : 0; return <><div className="mb-5 grid gap-4 sm:grid-cols-3">{isSingleBranch ? <><Kpi label="Margem vs. média da rede" value={`${selected.margem.toFixed(1).replace('.', ',')}%`} detail={`${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1).replace('.', ',')} p.p.`} positive={marginDelta >= 0} icon={Activity} tone={marginDelta >= 0 ? 'teal' : 'red'} caption="vs. média da rede"/><Kpi label="Resultado da filial" value={brl(selected.resultado)} detail={`${selected.participacao.toFixed(1).replace('.', ',')}% da rede`} icon={Building2}/></> : <><Kpi label="Filiais em crescimento" value={String(growing.length)} detail={`${growing.length} de ${filteredBranches.length} filiais`} icon={TrendingUp} caption={periodCaption}/><Kpi label="Maior resultado" value={leader?.name ?? '—'} detail={leader ? brl(leader.resultado) : '—'} icon={Building2} caption={periodCaption}/></>}<Kpi label="Em regressão" value={String(declining.length)} detail={declining.length ? 'Requer investigação' : 'Nenhuma no filtro'} positive={declining.length === 0} icon={Activity} tone={declining.length ? 'red' : 'teal'} caption={periodCaption}/></div><section className="rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-bold">Tabela de desempenho das filiais</h3><p className="mt-1 text-xs text-[#8ba09a]">Clique em uma unidade para explorar sua evolução</p></div><span className="rounded-lg bg-[#f0f7f4] px-3 py-2 text-xs font-medium text-[#5f7972]">Clique em uma linha para ver o detalhe</span></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-y border-[#edf3f0] text-[10px] uppercase tracking-wider text-[#9aaca8]"><tr>{columns.map(([label,key])=><th key={key} className="px-3 py-3 font-bold"><button type="button" onClick={()=>toggleSort(key)} className="flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] text-[#9aaca8] hover:text-[#0f766e]">{label}<ChevronDown data-icon="inline-end" className={`size-3 transition-transform ${sortKey===key ? (sortDir==='asc' ? 'rotate-180 text-[#0f766e]' : 'text-[#0f766e]') : 'opacity-40'}`} /></button></th>)}</tr></thead><tbody className="divide-y divide-[#edf3f0]">{sortedBranches.map((x: any)=><tr key={x.name} className={`cursor-pointer hover:bg-[#f8fbfa] ${x.name===effectiveSelected?'bg-[#f3f9f7]':''}`} onClick={()=>setSelectedBranch(x.name)}><td className="px-3 py-4 font-bold text-[#35564f]">{x.name}</td><td className="px-3 py-4 text-[#5b7770]">{brl(x.receita)}</td><td className="px-3 py-4 font-semibold text-[#0f766e]">{x.margem.toFixed(1).replace('.',',')}%</td><td className="px-3 py-4 font-bold">{brl(x.resultado)}</td><td className={`px-3 py-4 font-semibold ${x.crescimento>0?'text-[#248a61]':'text-[#c26156]'}`}>{pct(x.crescimento)}</td><td className="px-3 py-4 text-[#5b7770]">{x.participacao.toFixed(1).replace('.',',')}%</td><td className="px-3 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${x.trend==='Crescimento'?'bg-[#e5f5ed] text-[#23845b]':'bg-[#fff0ee] text-[#c26156]'}`}>{x.trend}</span></td></tr>)}</tbody></table></div></section><section className="mt-5 rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><h3 className="font-bold">Evolução · {b.name}</h3><p className="mt-1 text-xs text-[#8ba09a]">Resultado operacional e média móvel de 3 meses</p><div className="mt-5 h-[230px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={filteredMonths}><CartesianGrid vertical={false} stroke="#edf3f0"/><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={(v:any)=>brl(v)}/><Area type="monotone" dataKey="resultado" stroke="#0f766e" fill="#dff1eb" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div></section></> }

function Revenue({ scale = 1 }: { scale?: number }) { return <><div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]"><section className="rounded-2xl border border-[#dfebe7] bg-white p-6"><h3 className="font-bold">Receita por categoria</h3><p className="mt-1 text-xs text-[#8ba09a]">Participação no faturamento líquido · valores ajustados ao filtro ativo</p><div className="mt-5 flex items-center gap-5"><div className="h-[220px] w-1/2"><ResponsiveContainer><PieChart><Pie data={categories} dataKey="value" innerRadius={58} outerRadius={88} paddingAngle={3}>{categories.map(c=><Cell key={c.name} fill={c.color}/>)}</Pie><Tooltip formatter={(v:any)=>brl(v*scale)}/></PieChart></ResponsiveContainer></div><div className="flex flex-col gap-4">{categories.map(c=><div key={c.name}><div className="mb-1 flex items-center gap-2 text-xs text-[#68827b]"><i className="size-2.5 rounded-full" style={{background:c.color}}/>{c.name}</div><p className="text-lg font-bold">{brl(c.value*scale)}</p><p className="text-[11px] text-[#8ba09a]">{c.share}% da receita</p></div>)}</div></div></section><section className="rounded-2xl border border-[#dfebe7] bg-white p-6"><h3 className="font-bold">Receita por canal</h3><p className="mt-1 text-xs text-[#8ba09a]">Onde as vendas acontecem</p><div className="mt-6 flex flex-col gap-5">{[['Loja física',42],['WhatsApp',24],['Site',18],['Transferência',10],['Outros',6]].map(([n,v])=><div key={n as string}><div className="mb-2 flex justify-between text-xs"><span className="text-[#5e7972]">{n}</span><b>{v}%</b></div><div className="h-2 rounded-full bg-[#edf4f1]"><div className="h-2 rounded-full bg-[#0f766e]" style={{width:`${v}%`}}/></div></div>)}</div></section></div></> }
function Costs({ scale = 1, periodCaption = 'vs. período anterior' }: { scale?: number; periodCaption?: string }) { return <><div className="grid gap-4 sm:grid-cols-3"><Kpi label="Custos variáveis / receita" value="17,6%" detail="+1,8 p.p." positive={false} icon={WalletCards} tone="amber" caption={periodCaption}/><Kpi label="Despesas / receita" value="45,2%" detail="+2,4 p.p." positive={false} icon={CircleDollarSign} tone="red" caption={periodCaption}/><Kpi label="Concentração top 5" value="68,4%" detail="+5,3 p.p." positive={false} icon={BarChart3} tone="amber" caption={periodCaption}/></div><section className="mt-5 rounded-2xl border border-[#dfebe7] bg-white p-5 sm:p-6"><div className="mb-5"><h3 className="font-bold">Ofensores de custo</h3><p className="mt-1 text-xs text-[#8ba09a]">Ranking por maior aumento absoluto no período · valores ajustados ao filtro ativo</p></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-y border-[#edf3f0] text-[10px] uppercase tracking-wider text-[#9aaca8]"><tr>{['Componente','Classificação','Valor atual','Variação','Participação'].map(x=><th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-[#edf3f0]">{costs.map(c=><tr key={c.name}><td className="px-3 py-4 font-bold">{c.name}</td><td className="px-3 py-4 text-[#718a84]">{c.type}</td><td className="px-3 py-4 font-semibold">{brl(c.value*scale)}</td><td className={`px-3 py-4 font-bold ${c.delta>0?'text-[#c26156]':'text-[#248a61]'}`}>{pct(c.delta)}</td><td className="px-3 py-4 text-[#718a84]">{(c.value/1282687*100).toFixed(1).replace('.',',')}%</td></tr>)}</tbody></table></div></section></> }
function Investments({ scale = 1, filteredMonths = months, periodCaption = 'vs. período anterior' }: { scale?: number; filteredMonths?: typeof months; periodCaption?: string }) { return <><div className="grid gap-4 sm:grid-cols-3"><Kpi label="Investimento acumulado" value={brl(728119*scale)} detail="25,6% da receita" icon={TrendingUp} tone="amber" caption={periodCaption}/><Kpi label="Investimento no mês" value={brl(18216*scale)} detail="-21,2%" positive={false} icon={CircleDollarSign} caption={periodCaption}/><Kpi label="Principal categoria" value="Equipamentos" detail="42,8% do CAPEX" icon={Package} caption={periodCaption}/></div><section className="mt-5 rounded-2xl border border-[#dfebe7] bg-white p-6"><h3 className="font-bold">Investimentos por período</h3><p className="mt-1 text-xs text-[#8ba09a]">Mantidos fora do resultado operacional</p><div className="mt-6 h-[260px]"><ResponsiveContainer><BarChart data={filteredMonths}><CartesianGrid vertical={false} stroke="#edf3f0"/><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#8aa09c'}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={(v:any)=>brl(v)}/><Bar dataKey="receita" name="Investimentos" fill="#d0a55b" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></section></> }
function Profitability({ filteredBranches = branches }: { filteredBranches?: typeof branches }) { const avgMargin = branches.reduce((s, b) => s + b.margem, 0) / branches.length; return <><div className="rounded-2xl border border-[#dfebe7] bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">Rentabilidade gerencial por filial</h3><p className="mt-1 text-xs text-[#8ba09a]">Resultado operacional sem misturar investimentos ou fluxo de caixa</p></div><span title={`Margem média da rede: ${avgMargin.toFixed(1).replace('.', ',')}%`} className="flex items-center gap-2 text-[11px] font-medium text-[#6d8780]"><i className="inline-block h-3 w-0.5 rounded-full bg-[#173333]/50" /> Margem média da rede: {avgMargin.toFixed(1).replace('.', ',')}%</span></div><div className="mt-6 grid gap-4 md:grid-cols-2">{filteredBranches.map(b=><div key={b.name} className="rounded-xl border border-[#e8f0ed] p-4"><div className="flex justify-between"><span className="font-bold">{b.name}</span><span className={`text-xs font-semibold ${b.margem < 20 ? 'text-[#c26156]' : b.margem <= 27 ? 'text-[#c18b37]' : 'text-[#248a61]'}`}>{b.margem}% margem</span></div><div className="relative mt-4 h-2 rounded bg-[#edf4f1]"><div className={`h-2 rounded ${b.margem < 20 ? 'bg-[#d4776d]' : b.margem <= 27 ? 'bg-[#d7a34c]' : 'bg-[#41a876]'}`} style={{width:`${b.margem*2.1}%`}}/><div title={`Margem média da rede: ${avgMargin.toFixed(1).replace('.', ',')}%`} className="absolute -top-1 -bottom-1 w-px bg-[#173333]/60" style={{left:`${avgMargin*2.1}%`}}/></div><div className="mt-3 flex justify-between text-xs text-[#77918a]"><span>Receita {brl(b.receita)}</span><strong className="text-[#173333]">Resultado {brl(b.resultado)}</strong></div></div>)}</div></div></> }
function Quality() { return <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-[#dfebe7] bg-white p-6"><h3 className="font-bold">Metodologia aplicada</h3><div className="mt-5 flex flex-col gap-4">{[['Fonte temporal','Competência'],['Receita oficial','Valor líquido (R$)'],['Regra de status','Cancelados excluídos; Realizados e Pendentes reconhecidos'],['Base analisada','6.200 lançamentos · 6.005 válidos'],['Período','Julho de 2025 a Junho de 2026']].map(([a,b])=><div key={a} className="border-b border-[#edf3f0] pb-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#9aaca8]">{a}</p><p className="mt-1 text-sm font-semibold text-[#42645c]">{b}</p></div>)}</div></section><section className="rounded-2xl border border-[#eadfca] bg-[#fffaf0] p-6"><h3 className="font-bold text-[#725b2d]">Limitações conhecidas</h3><div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-[#897549]"><p>Existem divergências entre quantidade × valor unitário e valor bruto.</p><p>Existem divergências entre valor bruto − desconto + acréscimo e valor líquido.</p><p>A margem apresentada é <strong>Margem de Contribuição Gerencial</strong>.</p><p>Rentabilidade individual por produto requer custo unitário, CMV/CPV e tributos.</p></div></section></div> }

// Indicadores calculados diretamente da planilha publicada, com Valor líquido como fonte oficial.
