"use client";

import { useState } from "react";
import { Sparkles, Copy, Download, RotateCcw, ChevronRight, Check } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect" | "textarea";
  options?: string[];
  required: boolean;
}

interface Answer {
  [key: string]: string | string[];
}

export default function PromptBuilder() {
  const [step, setStep] = useState<"intro" | "questions" | "result">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const questions: Question[] = [
    {
      id: "objetivo",
      question: "Qual é o objetivo principal do seu prompt?",
      type: "textarea",
      required: true,
    },
    {
      id: "audiencia",
      question: "Quem é o público-alvo ou usuário final?",
      type: "text",
      required: true,
    },
    {
      id: "contexto",
      question: "Descreva o contexto ou domínio de aplicação:",
      type: "textarea",
      required: true,
    },
    {
      id: "tom",
      question: "Qual tom de voz deve ser usado?",
      type: "select",
      options: [
        "Profissional e formal",
        "Amigável e conversacional",
        "Técnico e detalhado",
        "Criativo e inspirador",
        "Educacional e explicativo",
        "Conciso e direto",
      ],
      required: true,
    },
    {
      id: "formato",
      question: "Qual formato de saída você prefere?",
      type: "select",
      options: [
        "Texto narrativo",
        "Lista com marcadores",
        "Passo a passo numerado",
        "Tabela ou estrutura",
        "Código ou scripts",
        "Perguntas e respostas",
      ],
      required: true,
    },
    {
      id: "restricoes",
      question: "Há alguma restrição ou limitação importante?",
      type: "textarea",
      required: false,
    },
    {
      id: "exemplos",
      question: "Você tem exemplos ou referências que deseja incluir?",
      type: "textarea",
      required: false,
    },
    {
      id: "elementos",
      question: "Quais elementos devem estar presentes na resposta?",
      type: "multiselect",
      options: [
        "Introdução clara",
        "Exemplos práticos",
        "Explicações detalhadas",
        "Citações ou referências",
        "Conclusão ou resumo",
        "Próximos passos ou ações",
        "Avisos ou considerações",
      ],
      required: false,
    },
    {
      id: "comprimento",
      question: "Qual deve ser o tamanho aproximado da resposta?",
      type: "select",
      options: [
        "Muito curta (1-2 parágrafos)",
        "Curta (3-5 parágrafos)",
        "Média (6-10 parágrafos)",
        "Longa (10+ parágrafos)",
        "Muito detalhada e extensa",
      ],
      required: true,
    },
    {
      id: "perspectiva",
      question: "De qual perspectiva a resposta deve ser escrita?",
      type: "select",
      options: [
        "Primeira pessoa (eu/nós)",
        "Segunda pessoa (você)",
        "Terceira pessoa (ele/ela/eles)",
        "Impessoal",
      ],
      required: true,
    },
    {
      id: "extras",
      question: "Alguma informação adicional ou requisito especial?",
      type: "textarea",
      required: false,
    },
  ];

  const handleStart = () => {
    setStep("questions");
  };

  const handleAnswer = (value: string | string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generatePrompt();
      setStep("result");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const generatePrompt = () => {
    const elementos = Array.isArray(answers.elementos)
      ? answers.elementos.join(", ")
      : answers.elementos || "elementos relevantes";

    const restricoesTexto = answers.restricoes
      ? `\n\nRESTRIÇÕES E LIMITAÇÕES:\n${answers.restricoes}`
      : "";

    const exemplosTexto = answers.exemplos
      ? `\n\nEXEMPLOS DE REFERÊNCIA:\n${answers.exemplos}`
      : "";

    const extrasTexto = answers.extras
      ? `\n\nREQUISITOS ADICIONAIS:\n${answers.extras}`
      : "";

    const prompt = `# OBJETIVO
${answers.objetivo}

# CONTEXTO
${answers.contexto}

# PÚBLICO-ALVO
${answers.audiencia}

# INSTRUÇÕES DE FORMATO E ESTILO

**Tom de Voz:** ${answers.tom}
**Formato de Saída:** ${answers.formato}
**Tamanho da Resposta:** ${answers.comprimento}
**Perspectiva:** ${answers.perspectiva}

# ELEMENTOS OBRIGATÓRIOS
A resposta deve incluir: ${elementos}
${restricoesTexto}${exemplosTexto}${extrasTexto}

# TAREFA
Com base nas informações acima, desenvolva uma resposta completa, estruturada e que atenda a todos os requisitos especificados. Certifique-se de seguir o tom, formato e perspectiva solicitados.`;

    setGeneratedPrompt(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt-complexo.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep("intro");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setGeneratedPrompt("");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];
  const canProceed =
    !currentQuestion?.required || (currentAnswer && currentAnswer.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step === "intro" && (
          <div className="text-center space-y-8 py-12">
            <div className="flex justify-center">
              <Sparkles className="w-20 h-20 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              Construtor de Prompts Complexos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Crie prompts robustos, detalhados e eficazes através de um processo
              interativo e guiado. Responda algumas perguntas e obtenha um prompt
              profissional pronto para usar.
            </p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Começar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === "questions" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>
                    Pergunta {currentQuestionIndex + 1} de {questions.length}
                  </span>
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {currentQuestion.question}
                {!currentQuestion.required && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    (Opcional)
                  </span>
                )}
              </h2>

              <div className="space-y-4">
                {currentQuestion.type === "text" && (
                  <input
                    type="text"
                    value={(currentAnswer as string) || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite sua resposta..."
                  />
                )}

                {currentQuestion.type === "textarea" && (
                  <textarea
                    value={(currentAnswer as string) || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite sua resposta..."
                  />
                )}

                {currentQuestion.type === "select" && (
                  <select
                    value={(currentAnswer as string) || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione uma opção...</option>
                    {currentQuestion.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {currentQuestion.type === "multiselect" && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option) => {
                      const selected = Array.isArray(currentAnswer)
                        ? currentAnswer.includes(option)
                        : false;
                      return (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const current = (currentAnswer as string[]) || [];
                              if (e.target.checked) {
                                handleAnswer([...current, option]);
                              } else {
                                handleAnswer(
                                  current.filter((item) => item !== option)
                                );
                              }
                            }}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-gray-800 dark:text-white">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Gerar Prompt"
                    : "Próxima"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <Check className="w-8 h-8 text-green-500" />
                  Seu Prompt Está Pronto!
                </h2>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Novo Prompt
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {generatedPrompt}
                </pre>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar Prompt
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Baixar (.txt)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
