import { useEffect, useMemo, useState } from 'react';
import { ACTIVITY_REGISTRY } from './core/activityRegistry';
import { actualizarQueryParams, leerQueryParams } from './core/query';
import type { ActivityId, LangCode, QueryState } from './core/types';
import { ActivityShell } from './ui/ActivityShell';

const SESSION_RESET_KEY = 'microcopy-ia:activity-state-reset-v1';

const textosApp: Record<
  LangCode,
  {
    titulo: string;
    subtitulo: string;
    idioma: string;
    idiomaOptions: { es: string; en: string; pt: string };
    actividadNoEncontrada: string;
    actividadNoEncontradaTitulo: string;
    homeTitle: string;
    homeSubtitle: string;
    start: string;
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
    homeTitle: 'Seleccioná una actividad para empezar',
    homeSubtitle: 'Esta pantalla inicial dirige a cada actividad usando la URL.',
    start: 'Comenzar',
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
    homeTitle: 'Choose an activity to start',
    homeSubtitle: 'This start screen routes to each activity using the URL.',
    start: 'Start',
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
    homeTitle: 'Escolha uma atividade para começar',
    homeSubtitle: 'Esta tela inicial direciona para cada atividade usando a URL.',
    start: 'Iniciar',
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

function hasActivityInUrl(search = window.location.search): boolean {
  return new URLSearchParams(search).has('a');
}

function App(): JSX.Element {
  const [query, setQuery] = useState<QueryState>(() => leerQueryParams());
  const [showHome, setShowHome] = useState<boolean>(() => !hasActivityInUrl());

  useEffect(() => {
    const resetDone = window.sessionStorage.getItem(SESSION_RESET_KEY);
    if (resetDone) {
      return;
    }

    const keysToRemove = Object.keys(window.localStorage).filter((key) => key.startsWith('activity:'));
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    window.sessionStorage.setItem(SESSION_RESET_KEY, '1');
  }, []);

  useEffect(() => {
    const onPopState = (): void => {
      setQuery(leerQueryParams());
      setShowHome(!hasActivityInUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const textos = useMemo(() => textosApp[query.lang], [query.lang]);
  const opcionesActividad = useMemo(() => opcionesActividadPorIdioma[query.lang], [query.lang]);
  const config = ACTIVITY_REGISTRY[query.a];

  const goToActivity = (activityId: ActivityId): void => {
    const next = actualizarQueryParams({ a: activityId });
    setQuery(next);
    setShowHome(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>{textos.titulo}</h1>
          <p>{textos.subtitulo}</p>
        </div>
      </header>

      <main className="app-main">
        {showHome ? (
          <section className="card home-card">
            <h2>{textos.homeTitle}</h2>
            <p className="muted">{textos.homeSubtitle}</p>
            <div className="home-actions">
              {opcionesActividad.map((opcion) => (
                <button key={opcion.id} type="button" className="btn btn-primary" onClick={() => goToActivity(opcion.id)}>
                  {textos.start}: {opcion.label}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <>
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
          </>
        )}
      </main>

      <footer className="app-footer">{textos.footer}</footer>
    </div>
  );
}

export default App;