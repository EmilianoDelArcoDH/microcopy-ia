import { useEffect, useMemo, useState } from 'react';
import { ACTIVITY_REGISTRY } from './core/activityRegistry';
import { actualizarQueryParams, leerQueryParams } from './core/query';
import type { ActivityId, LangCode, QueryState, Variant } from './core/types';
import { ActivityShell } from './ui/ActivityShell';

const textosApp: Record<
  LangCode,
  {
    titulo: string;
    subtitulo: string;
    idioma: string;
    idiomaOptions: { es: string; en: string; pt: string };
    actividadNoEncontrada: string;
    actividadNoEncontradaTitulo: string;
    actividad: string;
    variante: string;
    guiaTitulo: string;
    guiaPasos: [string, string, string, string];
    footer: string;
  }
> = {
  es: {
    titulo: 'Microcopy accesible con IA',
    subtitulo: 'Actividades del curso',
    idioma: 'Idioma',
    idiomaOptions: { es: 'Español', en: 'English', pt: 'Português' },
    actividadNoEncontrada: 'La actividad solicitada no existe en el registro.',
    actividadNoEncontradaTitulo: 'Actividad no encontrada',
    actividad: 'Actividad',
    variante: 'Variante',
    guiaTitulo: 'Cómo trabajar esta actividad',
    guiaPasos: [
      'Leé el objetivo y revisá las reglas.',
      'Completá cada bloque en orden.',
      'Marcá el checklist humano antes de validar.',
      'Usá el resultado de validación para iterar tu propuesta.',
    ],
    footer: 'Clase 4/5 – Microcopy accesible con IA',
  },
  en: {
    titulo: 'Accessible microcopy with AI',
    subtitulo: 'Course activities',
    idioma: 'Language',
    idiomaOptions: { es: 'Spanish', en: 'English', pt: 'Portuguese' },
    actividadNoEncontrada: 'The requested activity does not exist in the registry.',
    actividadNoEncontradaTitulo: 'Activity not found',
    actividad: 'Activity',
    variante: 'Variant',
    guiaTitulo: 'How to work on this activity',
    guiaPasos: [
      'Read the objective and review the rules.',
      'Complete each block in order.',
      'Check the human checklist before validating.',
      'Use validation results to iterate your proposal.',
    ],
    footer: 'Class 4/5 – Accessible microcopy with AI',
  },
  pt: {
    titulo: 'Microcopy acessível com IA',
    subtitulo: 'Atividades do curso',
    idioma: 'Idioma',
    idiomaOptions: { es: 'Espanhol', en: 'Inglês', pt: 'Português' },
    actividadNoEncontrada: 'A atividade solicitada não existe no registro.',
    actividadNoEncontradaTitulo: 'Atividade não encontrada',
    actividad: 'Atividade',
    variante: 'Variante',
    guiaTitulo: 'Como trabalhar esta atividade',
    guiaPasos: [
      'Leia o objetivo e revise as regras.',
      'Complete cada bloco em ordem.',
      'Marque o checklist humano antes de validar.',
      'Use o resultado da validação para iterar sua proposta.',
    ],
    footer: 'Aula 4/5 – Microcopy acessível com IA',
  },
};

const opcionesActividadPorIdioma: Record<LangCode, Array<{ id: ActivityId; label: string }>> = {
  es: [
    { id: 'microcopy-ia-01', label: '01 · Prompt guiado' },
    { id: 'microcopy-ia-02', label: '02 · Elegí la mejor opción' },
    { id: 'microcopy-ia-03', label: '03 · Auditoría de microcopy' },
  ],
  en: [
    { id: 'microcopy-ia-01', label: '01 · Guided prompt' },
    { id: 'microcopy-ia-02', label: '02 · Choose the best option' },
    { id: 'microcopy-ia-03', label: '03 · Broken microcopy audit' },
  ],
  pt: [
    { id: 'microcopy-ia-01', label: '01 · Prompt guiado' },
    { id: 'microcopy-ia-02', label: '02 · Escolha a melhor opção' },
    { id: 'microcopy-ia-03', label: '03 · Auditoria de microcopy' },
  ],
};

function App(): JSX.Element {
  const [query, setQuery] = useState<QueryState>(() => leerQueryParams());

  useEffect(() => {
    const onPopState = (): void => setQuery(leerQueryParams());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const textos = useMemo(() => textosApp[query.lang], [query.lang]);
  const opcionesActividad = useMemo(() => opcionesActividadPorIdioma[query.lang], [query.lang]);
  const config = ACTIVITY_REGISTRY[query.a];

  const handleLangChange = (lang: LangCode): void => {
    const next = actualizarQueryParams({ lang });
    setQuery(next);
  };

  const handleActivityChange = (activityId: ActivityId): void => {
    const next = actualizarQueryParams({ a: activityId });
    setQuery(next);
  };

  const handleVariantChange = (variant: Variant): void => {
    const next = actualizarQueryParams({ variant });
    setQuery(next);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>{textos.titulo}</h1>
          <p>{textos.subtitulo}</p>
        </div>

        <div className="header-actions">
          <label className="field-inline">
            {textos.actividad}
            <select value={query.a} onChange={(event) => handleActivityChange(event.target.value as ActivityId)}>
              {opcionesActividad.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-inline">
            {textos.idioma}
            <select value={query.lang} onChange={(event) => handleLangChange(event.target.value as LangCode)}>
              <option value="es">{textos.idiomaOptions.es}</option>
              <option value="en">{textos.idiomaOptions.en}</option>
              <option value="pt">{textos.idiomaOptions.pt}</option>
            </select>
          </label>
          <label className="field-inline">
            {textos.variante}
            <select value={query.variant} onChange={(event) => handleVariantChange(event.target.value as Variant)}>
              <option value="src">src</option>
              <option value="solution">solution</option>
            </select>
          </label>
        </div>
      </header>

      <main className="app-main">
        <section className="card alumno-help">
          <h2>{textos.guiaTitulo}</h2>
          <ol>
            {textos.guiaPasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </section>
        {config ? (
          <ActivityShell activityId={query.a} lang={query.lang} variant={query.variant} />
        ) : (
          <section className="card alert alert-error">
            <h2>{textos.actividadNoEncontradaTitulo}</h2>
            <p>{textos.actividadNoEncontrada}</p>
          </section>
        )}
      </main>

      <footer className="app-footer">{textos.footer}</footer>
    </div>
  );
}

export default App;