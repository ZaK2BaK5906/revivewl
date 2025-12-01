import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  BookOpen,
  Shield,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';

type TemplateType = 'scenarios' | 'rules' | 'lexicon';

interface Scenario {
  id: number;
  title: string;
  description: string;
  category: 'Legal' | 'Illégal';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

interface Question {
  id: number;
  question: string;
  answer: string;
  category?: 'Legal' | 'Illégal';
  points: number;
}

const Templates = () => {
  const [activeTab, setActiveTab] = useState<TemplateType>('scenarios');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Mock scenarios
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 1,
      title: 'Contrôle Routier',
      description: 'Vous êtes arrêté par la police pour un contrôle routier. Comment réagissez-vous?',
      category: 'Legal',
      difficulty: 'Facile',
    },
    {
      id: 2,
      title: 'Braquage de Banque',
      description: 'Vous planifiez un braquage de banque avec votre gang. Expliquez votre plan.',
      category: 'Illégal',
      difficulty: 'Difficile',
    },
    {
      id: 3,
      title: 'Négociation EMS',
      description: 'Vous êtes médecin et devez négocier avec un patient agressif.',
      category: 'Legal',
      difficulty: 'Moyen',
    },
  ]);

  // Mock rule questions
  const [ruleQuestions, setRuleQuestions] = useState<Question[]>([
    {
      id: 1,
      question: 'Qu\'est-ce qu\'une zone safe?',
      answer: 'Une zone où aucune action RP violente (braquage, meurtre, etc.) n\'est autorisée. Exemples: Hôpital, Commissariat.',
      points: 5,
    },
    {
      id: 2,
      question: 'Peut-on tuer sans raison RP valable?',
      answer: 'Non, c\'est du RDM (Random Death Match) et c\'est strictement interdit.',
      points: 5,
    },
    {
      id: 3,
      question: 'Qu\'est-ce que le PowerGaming?',
      answer: 'C\'est le fait de forcer une action RP sans laisser de choix à l\'autre joueur ou d\'utiliser des informations HRP en RP.',
      points: 5,
    },
  ]);

  // Mock lexicon questions
  const [lexiconQuestions, setLexiconQuestions] = useState<Question[]>([
    {
      id: 1,
      question: 'Que signifie "RDM"?',
      answer: 'Random Death Match - Tuer quelqu\'un sans raison RP valable.',
      points: 5,
    },
    {
      id: 2,
      question: 'Que signifie "VDM"?',
      answer: 'Vehicle Death Match - Écraser quelqu\'un volontairement sans raison RP.',
      points: 5,
    },
    {
      id: 3,
      question: 'Que signifie "HRP" et "RP"?',
      answer: 'HRP = Hors RolePlay (vie réelle), RP = RolePlay (personnage dans le jeu).',
      points: 5,
    },
  ]);

  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    category: 'Legal',
    difficulty: 'Moyen',
  });

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    points: 5,
  });

  const handleAddScenario = () => {
    if (newScenario.title && newScenario.description) {
      setScenarios([
        ...scenarios,
        {
          id: Date.now(),
          title: newScenario.title,
          description: newScenario.description,
          category: newScenario.category as 'Legal' | 'Illégal',
          difficulty: newScenario.difficulty as 'Facile' | 'Moyen' | 'Difficile',
        },
      ]);
      setNewScenario({ category: 'Legal', difficulty: 'Moyen' });
      setIsAdding(false);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.answer) {
      const questionList = activeTab === 'rules' ? ruleQuestions : lexiconQuestions;
      const setQuestionList = activeTab === 'rules' ? setRuleQuestions : setLexiconQuestions;

      setQuestionList([
        ...questionList,
        {
          id: Date.now(),
          question: newQuestion.question,
          answer: newQuestion.answer,
          points: newQuestion.points || 5,
        },
      ]);
      setNewQuestion({ points: 5 });
      setIsAdding(false);
    }
  };

  const handleDeleteScenario = (id: number) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const handleDeleteQuestion = (id: number) => {
    if (activeTab === 'rules') {
      setRuleQuestions(ruleQuestions.filter((q) => q.id !== id));
    } else {
      setLexiconQuestions(lexiconQuestions.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Templates</h1>
        <p className="text-muted-foreground mt-2">
          Gérer les scénarios, questions de règlement et lexique RP
        </p>
      </div>

      {/* Age Validation Warning */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-orange-500 mb-1">
              Validation Automatique de l'Âge
            </h3>
            <p className="text-sm text-orange-400/80">
              Les candidats de moins de 18 ans sont <strong>automatiquement refusés</strong> lors de
              la création d'une nouvelle whitelist. Cette règle est non-négociable pour des raisons
              légales et de modération.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => {
            setActiveTab('scenarios');
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'scenarios'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          Scénarios RP ({scenarios.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('rules');
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'rules'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4" />
          Questions Règlement ({ruleQuestions.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('lexicon');
            setIsAdding(false);
          }}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'lexicon'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Questions Lexique ({lexiconQuestions.length})
        </button>
      </div>

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'scenarios'
            ? 'Nouveau Scénario'
            : activeTab === 'rules'
            ? 'Nouvelle Question Règlement'
            : 'Nouvelle Question Lexique'}
        </button>
      )}

      {/* Add Form */}
      {isAdding && activeTab === 'scenarios' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Nouveau Scénario</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
              <input
                type="text"
                value={newScenario.title || ''}
                onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Contrôle Routier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description / Mise en situation
              </label>
              <textarea
                value={newScenario.description || ''}
                onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Décrivez le scénario RP que le candidat devra jouer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                <select
                  value={newScenario.category}
                  onChange={(e) =>
                    setNewScenario({ ...newScenario, category: e.target.value as 'Legal' | 'Illégal' })
                  }
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Legal">Legal</option>
                  <option value="Illégal">Illégal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulté</label>
                <select
                  value={newScenario.difficulty}
                  onChange={(e) =>
                    setNewScenario({
                      ...newScenario,
                      difficulty: e.target.value as 'Facile' | 'Moyen' | 'Difficile',
                    })
                  }
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddScenario}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewScenario({ category: 'Legal', difficulty: 'Moyen' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Form */}
      {isAdding && (activeTab === 'rules' || activeTab === 'lexicon') && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {activeTab === 'rules' ? 'Nouvelle Question Règlement' : 'Nouvelle Question Lexique'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Question</label>
              <input
                type="text"
                value={newQuestion.question || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={
                  activeTab === 'rules'
                    ? "Ex: Qu'est-ce que le RDM?"
                    : "Ex: Que signifie 'VDM'?"
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Réponse Attendue
              </label>
              <textarea
                value={newQuestion.answer || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Réponse correcte que le candidat doit fournir..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Points attribués
              </label>
              <input
                type="number"
                value={newQuestion.points || 5}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewQuestion({ points: 5 });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios List */}
      {activeTab === 'scenarios' && !isAdding && (
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{scenario.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        scenario.category === 'Legal'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {scenario.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        scenario.difficulty === 'Facile'
                          ? 'bg-blue-500/20 text-blue-400'
                          : scenario.difficulty === 'Moyen'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteScenario(scenario.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions List */}
      {(activeTab === 'rules' || activeTab === 'lexicon') && !isAdding && (
        <div className="grid grid-cols-1 gap-4">
          {(activeTab === 'rules' ? ruleQuestions : lexiconQuestions).map((question) => (
            <div
              key={question.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <h3 className="text-base font-semibold text-foreground">{question.question}</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                      {question.points} pts
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground font-medium">Réponse attendue:</p>
                    <p className="text-sm text-foreground mt-1">{question.answer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
