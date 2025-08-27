import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, User, Building2, MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import InputMask from 'react-input-mask';

interface StepFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  cnpj: string;
  responsiblePhone: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const StepForm = ({ onSubmit, isLoading }: StepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    cnpj: '',
    responsiblePhone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const updateFormData = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      case 3:
        return formData.companyName && formData.cnpj && formData.responsiblePhone;
      case 4:
        return formData.address.street && formData.address.number && formData.address.city && formData.address.state && formData.address.zipCode;
      default:
        return false;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="card-elegant w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-foreground">Criar Nova Conta</CardTitle>
        <CardDescription>
          Passo {currentStep} de {totalSteps} - Cadastre sua empresa
        </CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Etapa 1: Dados Pessoais */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Dados Pessoais</h3>
                <p className="text-sm text-muted-foreground">Informe seus dados básicos</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    placeholder="Seu nome"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    placeholder="Seu sobrenome"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Etapa 2: Senha */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Segurança</h3>
                <p className="text-sm text-muted-foreground">Crie uma senha segura</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-destructive">As senhas não coincidem</p>
                )}
              </div>
            </div>
          )}

          {/* Etapa 3: Dados da Empresa */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Dados da Empresa</h3>
                <p className="text-sm text-muted-foreground">Informações da sua empresa</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Nome da sua empresa"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={formData.cnpj}
                  onChange={(e) => updateFormData('cnpj', e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  )}
                </InputMask>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsiblePhone">Telefone do Responsável</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.responsiblePhone}
                  onChange={(e) => updateFormData('responsiblePhone', e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="responsiblePhone"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  )}
                </InputMask>
              </div>
            </div>
          )}

          {/* Etapa 4: Endereço */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Endereço</h3>
                <p className="text-sm text-muted-foreground">Endereço da empresa</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <InputMask
                  mask="99999-999"
                  value={formData.address.zipCode}
                  onChange={(e) => updateFormData('address.zipCode', e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="zipCode"
                      placeholder="00000-000"
                      required
                    />
                  )}
                </InputMask>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Logradouro</Label>
                  <Input
                    id="street"
                    placeholder="Rua, Avenida..."
                    value={formData.address.street}
                    onChange={(e) => updateFormData('address.street', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    placeholder="123"
                    value={formData.address.number}
                    onChange={(e) => updateFormData('address.number', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento (opcional)</Label>
                <Input
                  id="complement"
                  placeholder="Sala, Andar..."
                  value={formData.address.complement}
                  onChange={(e) => updateFormData('address.complement', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Nome do bairro"
                  value={formData.address.neighborhood}
                  onChange={(e) => updateFormData('address.neighborhood', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Sua cidade"
                    value={formData.address.city}
                    onChange={(e) => updateFormData('address.city', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="UF"
                    maxLength={2}
                    value={formData.address.state}
                    onChange={(e) => updateFormData('address.state', e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                {isLoading ? 'Criando...' : 'Finalizar Cadastro'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};