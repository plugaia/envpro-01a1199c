import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, Users, Calendar, CheckCircle, Award, Crown, Medal } from "lucide-react";

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Mock data for reports
  const stats = {
    totalProposals: 156,
    approvedProposals: 89,
    pendingProposals: 45,
    rejectedProposals: 22,
    totalValue: 2580000,
    approvedValue: 1456000,
    avgValue: 16538,
    conversionRate: 57.1
  };

  const monthlyData = [
    { month: "Jan", proposals: 12, approved: 8, value: 185000 },
    { month: "Fev", proposals: 18, approved: 11, value: 245000 },
    { month: "Mar", proposals: 22, approved: 13, value: 298000 },
    { month: "Abr", proposals: 19, approved: 10, value: 212000 },
    { month: "Mai", proposals: 25, approved: 15, value: 356000 },
    { month: "Jun", proposals: 28, approved: 17, value: 394000 },
  ];

  // Lawyer performance data
  const lawyerPerformance = [
    {
      id: "1",
      name: "Dr. Giuvana Vargas",
      email: "giuvana.vargas@wonebank.com.br",
      totalProposals: 45,
      approvedProposals: 28,
      rejectedProposals: 8,
      pendingProposals: 9,
      totalValue: 890000,
      approvedValue: 542000,
      avgValue: 19778,
      conversionRate: 62.2
    },
    {
      id: "2", 
      name: "Dr. Eduardo Santos",
      email: "eduardo.santos@legalprop.com",
      totalProposals: 38,
      approvedProposals: 22,
      rejectedProposals: 6,
      pendingProposals: 10,
      totalValue: 675000,
      approvedValue: 412000,
      avgValue: 17763,
      conversionRate: 57.9
    },
    {
      id: "3",
      name: "Dra. Marina Costa",  
      email: "marina.costa@legalprop.com",
      totalProposals: 32,
      approvedProposals: 19,
      rejectedProposals: 4,
      pendingProposals: 9,
      totalValue: 548000,
      approvedValue: 334000,
      avgValue: 17125,
      conversionRate: 59.4
    },
    {
      id: "4",
      name: "Dr. Roberto Silva",
      email: "roberto.silva@legalprop.com", 
      totalProposals: 28,
      approvedProposals: 14,
      rejectedProposals: 3,
      pendingProposals: 11,
      totalValue: 412000,
      approvedValue: 235000,
      avgValue: 14714,
      conversionRate: 50.0
    },
    {
      id: "5",
      name: "Dra. Ana Oliveira",
      email: "ana.oliveira@legalprop.com",
      totalProposals: 13,
      approvedProposals: 6,
      rejectedProposals: 1,
      pendingProposals: 6,
      totalValue: 155000,
      approvedValue: 83000,
      avgValue: 11923,
      conversionRate: 46.2
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Relatórios</h1>
                  <p className="text-sm text-muted-foreground">Análise de desempenho e estatísticas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-md z-50">
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Propostas</p>
                        <p className="text-2xl font-bold text-foreground">{stats.totalProposals}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span className="text-xs text-success">+12% vs mês anterior</span>
                        </div>
                      </div>
                      <FileText className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
                        <p className="text-2xl font-bold text-success">{formatPercentage(stats.conversionRate)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span className="text-xs text-success">+3.2% vs mês anterior</span>
                        </div>
                      </div>
                      <CheckCircle className="w-8 h-8 text-success/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalValue)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span className="text-xs text-success">+18% vs mês anterior</span>
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Médio</p>
                        <p className="text-2xl font-bold text-warning">{formatCurrency(stats.avgValue)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingDown className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">-2.1% vs mês anterior</span>
                        </div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-warning/60" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status das Propostas</CardTitle>
                    <CardDescription>Distribuição por status atual</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Aprovadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.approvedProposals}</span>
                        <Badge className="bg-success text-success-foreground">
                          {formatPercentage((stats.approvedProposals / stats.totalProposals) * 100)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">Pendentes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.pendingProposals}</span>
                        <Badge className="bg-warning text-warning-foreground">
                          {formatPercentage((stats.pendingProposals / stats.totalProposals) * 100)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">Rejeitadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.rejectedProposals}</span>
                        <Badge className="bg-destructive text-destructive-foreground">
                          {formatPercentage((stats.rejectedProposals / stats.totalProposals) * 100)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Valores por Status</CardTitle>
                    <CardDescription>Distribuição financeira</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Valor Total</span>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(stats.totalValue)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Valor Aprovado</span>
                      </div>
                      <span className="font-bold text-success">{formatCurrency(stats.approvedValue)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span className="text-sm">Valor Médio</span>
                      </div>
                      <span className="font-bold">{formatCurrency(stats.avgValue)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Mensal</CardTitle>
                  <CardDescription>Evolução de propostas e aprovações nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={data.month} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-4">
                          <div className="w-12 text-center">
                            <span className="text-sm font-medium">{data.month}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{data.proposals} propostas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-sm text-success">{data.approved} aprovadas</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{formatCurrency(data.value)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercentage((data.approved / data.proposals) * 100)} aprovação
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lawyer Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Ranking de Advogados
                  </CardTitle>
                  <CardDescription>Performance dos advogados por número de propostas e taxa de aprovação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lawyerPerformance.map((lawyer, index) => (
                      <div key={lawyer.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                            {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                            {index === 2 && <Medal className="w-4 h-4 text-amber-600" />}
                            {index > 2 && <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{lawyer.name}</div>
                            <div className="text-xs text-muted-foreground">{lawyer.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-primary">{lawyer.totalProposals}</div>
                            <div className="text-xs text-muted-foreground">Propostas</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-success">{lawyer.approvedProposals}</div>
                            <div className="text-xs text-muted-foreground">Aprovadas</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-warning">{formatPercentage(lawyer.conversionRate)}</div>
                            <div className="text-xs text-muted-foreground">Taxa</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{formatCurrency(lawyer.totalValue)}</div>
                            <div className="text-xs text-muted-foreground">Valor Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Mais Propostas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lawyerPerformance
                        .sort((a, b) => b.totalProposals - a.totalProposals)
                        .slice(0, 3)
                        .map((lawyer, index) => (
                          <div key={lawyer.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground w-4">#{index + 1}</span>
                              <span className="text-sm font-medium">{lawyer.name.split(' ')[1]} {lawyer.name.split(' ')[2]}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {lawyer.totalProposals} propostas
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Maior Taxa de Aprovação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lawyerPerformance
                        .sort((a, b) => b.conversionRate - a.conversionRate)
                        .slice(0, 3)
                        .map((lawyer, index) => (
                          <div key={lawyer.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground w-4">#{index + 1}</span>
                              <span className="text-sm font-medium">{lawyer.name.split(' ')[1]} {lawyer.name.split(' ')[2]}</span>
                            </div>
                            <Badge className="bg-success text-success-foreground text-xs">
                              {formatPercentage(lawyer.conversionRate)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Maior Valor Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lawyerPerformance
                        .sort((a, b) => b.totalValue - a.totalValue)
                        .slice(0, 3)
                        .map((lawyer, index) => (
                          <div key={lawyer.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground w-4">#{index + 1}</span>
                              <span className="text-sm font-medium">{lawyer.name.split(' ')[1]} {lawyer.name.split(' ')[2]}</span>
                            </div>
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {formatCurrency(lawyer.totalValue)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Insights e Recomendações</CardTitle>
                  <CardDescription>Análises automáticas baseadas nos dados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-success">Taxa de aprovação em alta</h4>
                        <p className="text-sm text-muted-foreground">
                          Sua taxa de aprovação aumentou 3.2% no último mês. Continue focando em propostas similares às aprovadas recentemente.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning">Propostas pendentes</h4>
                        <p className="text-sm text-muted-foreground">
                          Você tem {stats.pendingProposals} propostas pendentes. Considere fazer follow-up com os clientes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-primary">Performance dos advogados</h4>
                        <p className="text-sm text-muted-foreground">
                          Dr. Giuvana Vargas lidera com {lawyerPerformance[0].totalProposals} propostas e {formatPercentage(lawyerPerformance[0].conversionRate)} de aprovação.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Relatorios;