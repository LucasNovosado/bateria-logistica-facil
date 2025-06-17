
-- Criar enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('vendedora', 'entregador', 'admin');

-- Criar enum para status das entregas
CREATE TYPE delivery_status AS ENUM ('pendente', 'em_andamento', 'finalizada');

-- Criar tabela de usuários
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de entregas
CREATE TABLE public.entregas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endereco TEXT NOT NULL,
  numero TEXT NOT NULL,
  referencia TEXT,
  cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  bateria TEXT NOT NULL,
  valor NUMERIC(10,2),
  forma_pagamento TEXT NOT NULL,
  veiculo TEXT,
  data_entrega DATE,
  horario_entrega TIME,
  urgente BOOLEAN NOT NULL DEFAULT false,
  status delivery_status NOT NULL DEFAULT 'pendente',
  vendedor TEXT,
  entregador TEXT,
  horario_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  horario_inicio TIMESTAMP WITH TIME ZONE,
  horario_chegada TIMESTAMP WITH TIME ZONE,
  localizacao_entrega TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários (todos podem ler)
CREATE POLICY "Usuários podem visualizar todos os usuários" 
  ON public.usuarios 
  FOR SELECT 
  USING (true);

-- Políticas de segurança para entregas (todos podem ler e escrever por simplicidade)
CREATE POLICY "Todos podem visualizar entregas" 
  ON public.entregas 
  FOR SELECT 
  USING (true);

CREATE POLICY "Todos podem criar entregas" 
  ON public.entregas 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Todos podem atualizar entregas" 
  ON public.entregas 
  FOR UPDATE 
  USING (true);

-- Inserir usuários de exemplo
INSERT INTO public.usuarios (nome, tipo) VALUES 
  ('Carlos Silva', 'entregador'),
  ('Antônio Costa', 'entregador'),
  ('José Santos', 'entregador'),
  ('Pedro Oliveira', 'entregador'),
  ('Maria Vendedora', 'vendedora'),
  ('Admin Sistema', 'admin');

-- Habilitar realtime para as tabelas
ALTER TABLE public.entregas REPLICA IDENTITY FULL;
ALTER TABLE public.usuarios REPLICA IDENTITY FULL;

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.entregas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usuarios;
