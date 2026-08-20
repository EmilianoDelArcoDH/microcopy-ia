import type { LangCode } from '../core/types';

export interface AIClient {
    generateMicrocopy(prompt: string): Promise<string[]>;
}

export interface BuildPromptParams {
    textoOriginal: string;
    contexto: string;
    maxWords: number;
    lang: LangCode;
}

const idiomaMap: Record<LangCode, string> = {
    es: 'español neutro',
    en: 'english neutral',
    pt: 'português neutro',
};

export function buildMicrocopyPrompt(params: BuildPromptParams): string {
    const idiomaObjetivo = idiomaMap[params.lang];

    return [
        'Generá microcopy para UI accesible.',
        `Texto original: ${params.textoOriginal}`,
        `Contexto: ${params.contexto}`,
        `Límite de longitud: máximo ${params.maxWords} palabras por opción.`,
        `Idioma requerido: ${idiomaObjetivo}.`,
        'Respuesta: exactamente 3 opciones numeradas (1, 2 y 3).',
        'No uses lenguaje ambiguo ni promesas exageradas.',
    ].join('\n');
}

export class MockAIClient implements AIClient {
    async generateMicrocopy(_prompt: string): Promise<string[]> {
        return [
            'Descargar reporte mensual',
            'Bajar reporte en PDF',
            'Descargar PDF del mes',
        ];
    }
}

export class GroqAIClient implements AIClient {
    private readonly apiKey: string;
    private readonly model: string;

    constructor(apiKey: string, model = 'openai/gpt-oss-20b') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateMicrocopy(prompt: string): Promise<string[]> {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    temperature: 0.4,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });

            if (!response.ok) {
                console.warn(`Groq respondió con estado ${response.status}; se usará MockAIClient.`);
                return new MockAIClient().generateMicrocopy(prompt);
            }

            const payload = (await response.json()) as {
                choices?: Array<{ message?: { content?: string } }>;
            };
            const content = payload.choices?.[0]?.message?.content ?? '';

            const opciones = content
                .split('\n')
                .map((linea) => linea.trim())
                .filter((linea) => /^\d+[\).\-\s]/.test(linea))
                .map((linea) => linea.replace(/^\d+[\).\-\s]*/, '').trim())
                .filter(Boolean)
                .slice(0, 3);

            if (opciones.length === 3) {
                return opciones;
            }
        } catch (error) {
            console.warn('No se pudo conectar con Groq; se usará MockAIClient.', error);
        }

        return new MockAIClient().generateMicrocopy(prompt);
    }
}

export function hasGroqApiKey(): boolean {
    return Boolean(import.meta.env.VITE_GROQ_API_KEY);
}

export function createDefaultAIClient(): AIClient {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (apiKey) {
        return new GroqAIClient(apiKey);
    }
    return new MockAIClient();
}

// TODO: si movés Groq a backend, cambiá este cliente por llamadas a tu endpoint interno.
