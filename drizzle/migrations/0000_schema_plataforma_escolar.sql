
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Service inserts profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.turmas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classe int NOT NULL CHECK (classe BETWEEN 1 AND 12),
  nome text NOT NULL,
  ano_lectivo int NOT NULL DEFAULT 2026,
  UNIQUE (classe, nome, ano_lectivo)
);
GRANT SELECT ON public.turmas TO authenticated;
GRANT ALL ON public.turmas TO service_role;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read turmas" ON public.turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage turmas" ON public.turmas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  min_level int NOT NULL DEFAULT 1,
  max_level int NOT NULL DEFAULT 12
);
GRANT SELECT ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage subjects" ON public.subjects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.teacher_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  turma_id uuid NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  ano_lectivo int NOT NULL DEFAULT 2026,
  UNIQUE (subject_id, turma_id, ano_lectivo)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_allocations TO authenticated;
GRANT ALL ON public.teacher_allocations TO service_role;
ALTER TABLE public.teacher_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers read own allocations" ON public.teacher_allocations FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage allocations" ON public.teacher_allocations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  registo text NOT NULL UNIQUE,
  nome_completo text NOT NULL,
  email text,
  telefone text,
  classe int NOT NULL CHECK (classe BETWEEN 1 AND 12),
  turma_id uuid REFERENCES public.turmas(id),
  encarregado_nome text NOT NULL,
  encarregado_contacto text NOT NULL,
  consentimento boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','inactive')),
  code_issued_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student reads own row" ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read students" ON public.students FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update students" ON public.students FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers read students of own turmas" ON public.students FOR SELECT TO authenticated USING (
  status = 'active' AND EXISTS (
    SELECT 1 FROM public.teacher_allocations ta
    WHERE ta.turma_id = students.turma_id AND ta.teacher_id = auth.uid()
  )
);

CREATE TABLE public.grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id),
  turma_id uuid NOT NULL REFERENCES public.turmas(id),
  teacher_id uuid NOT NULL,
  trimester int NOT NULL CHECK (trimester BETWEEN 1 AND 3),
  ano_lectivo int NOT NULL DEFAULT 2026,
  score numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 20),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, subject_id, trimester, ano_lectivo)
);
GRANT SELECT, INSERT, UPDATE ON public.grades TO authenticated;
GRANT ALL ON public.grades TO service_role;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student reads own published grades" ON public.grades FOR SELECT TO authenticated USING (
  status = 'published' AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = grades.student_id AND s.user_id = auth.uid())
);
CREATE POLICY "Admins read grades" ON public.grades FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers read own grades" ON public.grades FOR SELECT TO authenticated USING (teacher_id = auth.uid());
CREATE POLICY "Teachers insert grades for own allocations" ON public.grades FOR INSERT TO authenticated WITH CHECK (
  teacher_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.teacher_allocations ta
    WHERE ta.teacher_id = auth.uid() AND ta.subject_id = grades.subject_id AND ta.turma_id = grades.turma_id AND ta.ano_lectivo = grades.ano_lectivo
  )
);
CREATE POLICY "Teachers update own grades" ON public.grades FOR UPDATE TO authenticated USING (teacher_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_grade_teacher()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.teacher_id := auth.uid();
  IF TG_OP = 'UPDATE' THEN
    NEW.student_id := OLD.student_id;
    NEW.subject_id := OLD.subject_id;
    NEW.turma_id := OLD.turma_id;
    NEW.trimester := OLD.trimester;
    NEW.ano_lectivo := OLD.ano_lectivo;
    IF OLD.status = 'published' AND NEW.score IS DISTINCT FROM OLD.score THEN
      INSERT INTO public.audit_logs (actor_id, acao, detalhes) VALUES (
        auth.uid(), 'grade_edit_published',
        jsonb_build_object('grade_id', OLD.id, 'old_score', OLD.score, 'new_score', NEW.score)
      );
    END IF;
  END IF;
  IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
    NEW.published_at := now();
  END IF;
  RETURN NEW;
END $$;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  acao text NOT NULL,
  detalhes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER grades_set_teacher BEFORE INSERT OR UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.set_grade_teacher();

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  conteudo text NOT NULL,
  publicado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published news" ON public.news FOR SELECT TO anon USING (publicado = true);
CREATE POLICY "Authenticated reads published news" ON public.news FOR SELECT TO authenticated USING (publicado = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Matriz curricular inicial
INSERT INTO public.subjects (nome, min_level, max_level) VALUES
  ('Língua Portuguesa', 1, 12),
  ('Matemática', 1, 12),
  ('Ciências Naturais', 1, 6),
  ('História', 1, 12),
  ('Geografia', 1, 12),
  ('Educação Física', 1, 12),
  ('Educação Visual e Ofícios', 1, 6),
  ('Física', 8, 12),
  ('Química', 8, 12),
  ('Biologia', 7, 12),
  ('Filosofia', 10, 12),
  ('Língua Inglesa', 7, 12),
  ('Língua Francesa', 7, 12),
  ('Agro-Pecuária', 7, 12);

INSERT INTO public.turmas (classe, nome, ano_lectivo) VALUES
  (1, 'A', 2026), (1, 'B', 2026), (2, 'A', 2026), (3, 'A', 2026);
