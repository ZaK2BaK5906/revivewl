import { useState, useEffect } from 'react';
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
import { templateAPI } from '../services/api';
import toast from 'react-hot-toast';

type TemplateType = 'scenarios' | 'rules' | 'lexicon';

interface Scenario {
  id: number;
  title: string;
  description: string;
  expectedAnswer: string;
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
  const [loading, setLoading] = useState(true);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [ruleQuestions, setRuleQuestions] = useState<Question[]>([]);
  const [lexiconQuestions, setLexiconQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const [scenariosRes, rulesRes, lexiconRes] = await Promise.all([
        templateAPI.getScenarios(),
        templateAPI.getRuleQuestions(),
        templateAPI.getLexiconQuestions(),
      ]);

      setScenarios(scenariosRes.data || []);
      setRuleQuestions(rulesRes.data || []);
      setLexiconQuestions(lexiconRes.data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast.error('Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  };

  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    category: 'Legal',
    difficulty: 'Moyen',
  });

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    points: 5,
  });

  const handleAddScenario = async () => {
    if (newScenario.title && newScenario.description && newScenario.expectedAnswer) {
      try {
        const response = await templateAPI.createScenario({
          title: newScenario.title,
          description: newScenario.description,
          expectedAnswer: newScenario.expectedAnswer,
          category: newScenario.category,
          difficulty: newScenario.difficulty,
        });
        setScenarios([...scenarios, response.data]);
        setNewScenario({ category: 'Legal', difficulty: 'Moyen' });
        setIsAdding(false);
        toast.success('Scénario ajouté avec succès');
      } catch (error: any) {
        console.error('Error adding scenario:', error);
        toast.error('Erreur lors de l\'ajout du scénario');
      }
    }
  };

  const handleAddQuestion = async () => {
    if (newQuestion.question && newQuestion.answer) {
      try {
        const apiCall = activeTab === 'rules'
          ? templateAPI.createRuleQuestion
          : templateAPI.createLexiconQuestion;

        const response = await apiCall({
          question: newQuestion.question,
          answer: newQuestion.answer,
          points: newQuestion.points || 5,
        });

        if (activeTab === 'rules') {
          setRuleQuestions([...ruleQuestions, response.data]);
        } else {
          setLexiconQuestions([...lexiconQuestions, response.data]);
        }

        setNewQuestion({ points: 5 });
        setIsAdding(false);
        toast.success('Question ajoutée avec succès');
      } catch (error: any) {
        console.error('Error adding question:', error);
        toast.error('Erreur lors de l\'ajout de la question');
      }
    }
  };

  const handleDeleteScenario = async (id: number) => {
    try {
      await templateAPI.deleteScenario(id);
      setScenarios(scenarios.filter((s) => s.id !== id));
      toast.success('Scénario supprimé');
    } catch (error: any) {
      console.error('Error deleting scenario:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      const apiCall = activeTab === 'rules'
        ? templateAPI.deleteRuleQuestion
        : templateAPI.deleteLexiconQuestion;

      await apiCall(id);

      if (activeTab === 'rules') {
        setRuleQuestions(ruleQuestions.filter((q) => q.id !== id));
      } else {
        setLexiconQuestions(lexiconQuestions.filter((q) => q.id !== id));
      }
      toast.success('Question supprimée');
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des templates...</p>
        </div>
      </div>
    );
  }

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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Réponse Attendue
              </label>
              <textarea
                value={newScenario.expectedAnswer || ''}
                onChange={(e) => setNewScenario({ ...newScenario, expectedAnswer: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Décrivez la réponse attendue du candidat pour ce scénario..."
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
                  <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="bg-secondary/50 rounded-lg p-3 border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground font-medium">Réponse attendue:</p>
                    <p className="text-sm text-foreground mt-1">{scenario.expectedAnswer}</p>
                  </div>
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
