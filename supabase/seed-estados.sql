-- Seed inicial dos estados brasileiros.
-- Apenas TO ativo = true (dados carregados na Fase 1).
-- Para ativar um novo estado apos rodar o ETL:
--   UPDATE public.estados SET ativo = true WHERE sigla = 'PA';

insert into public.estados (sigla, nome, codigo_tse, ativo) values
  ('AC', 'Acre',                   'AC', false),
  ('AL', 'Alagoas',                'AL', false),
  ('AM', 'Amazonas',               'AM', false),
  ('AP', 'Amapa',                  'AP', false),
  ('BA', 'Bahia',                  'BA', false),
  ('CE', 'Ceara',                  'CE', false),
  ('DF', 'Distrito Federal',       'DF', false),
  ('ES', 'Espirito Santo',         'ES', false),
  ('GO', 'Goias',                  'GO', false),
  ('MA', 'Maranhao',               'MA', false),
  ('MG', 'Minas Gerais',           'MG', false),
  ('MS', 'Mato Grosso do Sul',     'MS', false),
  ('MT', 'Mato Grosso',            'MT', false),
  ('PA', 'Para',                   'PA', false),
  ('PB', 'Paraiba',                'PB', false),
  ('PE', 'Pernambuco',             'PE', false),
  ('PI', 'Piaui',                  'PI', false),
  ('PR', 'Parana',                 'PR', false),
  ('RJ', 'Rio de Janeiro',         'RJ', false),
  ('RN', 'Rio Grande do Norte',    'RN', false),
  ('RO', 'Rondonia',               'RO', false),
  ('RR', 'Roraima',                'RR', false),
  ('RS', 'Rio Grande do Sul',      'RS', false),
  ('SC', 'Santa Catarina',         'SC', false),
  ('SE', 'Sergipe',                'SE', false),
  ('SP', 'Sao Paulo',              'SP', false),
  ('TO', 'Tocantins',              'TO', true)
on conflict (sigla) do update
  set nome = excluded.nome,
      codigo_tse = excluded.codigo_tse;
