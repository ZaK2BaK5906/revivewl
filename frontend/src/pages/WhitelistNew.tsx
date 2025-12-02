import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, User, Tag, FileText, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { whitelistAPI } from '../services/api';

type Step = 1 | 2 | 3 | 4 | 5;

const WhitelistNew = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [ageBlocked, setAgeBlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Étape 1 - Infos candidat
    firstname: '',
    lastname: '',
    discord: '',
    age: '',
    experienceLevel: 'Débutant',
    rpHours: '',
    // Étape 2 - Catégorie
    category: 'Legal',
    // Étape 3 - Questions fixes
    fixedAnswers: {
      zoneSafe: '',
      passwordHidden: '',
      safeWord: '',
    },
    // Étape 4 - Scénarios et questions
    scenarios: [
      { id: 1, answer: '', validated: false, score: 0 },
      { id: 2, answer: '', validated: false, score: 0 },
      { id: 3, answer: '', validated: false, score: 0 },
    ],
    ruleQuestions: Array(4).fill({ answer: '', correct: false }),
    lexiconQuestions: Array(3).fill({ answer: '', correct: false }),
    // Étape 5 - Finalisation
    adminNotes: '',
  });

  const steps = [
    { number: 1, title: 'Informations', icon: User },
    { number: 2, title: 'Catégorie', icon: Tag },
    { number: 3, title: 'Questions fixes', icon: FileText },
    { number: 4, title: 'Entretien', icon: FileText },
    { number: 5, title: 'Finalisation', icon: CheckCircle },
  ];

  const handleNext = () => {
    // Check age validation on step 1
    if (currentStep === 1) {
      const age = parseInt(formData.age);
      if (age < 18) {
        setAgeBlocked(true);
        toast.error('Le candidat doit avoir au moins 18 ans pour être accepté sur le serveur.');
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleValidate = async () => {
    try {
      setSubmitting(true);

      // Create whitelist first
      const whitelistData = {
        candidate_firstname: formData.firstname,
        candidate_lastname: formData.lastname,
        discord_username: formData.discord,
        age: parseInt(formData.age),
        experience_level: formData.experienceLevel,
        rp_hours: parseInt(formData.rpHours) || 0,
        category: formData.category,
        admin_notes: formData.adminNotes,
        total_score: calculateScore(),
      };

      const response = await whitelistAPI.create(whitelistData);
      const whitelistId = response.data.id;

      // Then validate it
      await whitelistAPI.validate(whitelistId, formData.adminNotes);

      toast.success('Whitelist validée avec succès!');
      navigate('/whitelists');
    } catch (error: any) {
      console.error('Error validating whitelist:', error);
      toast.error('Erreur lors de la validation de la whitelist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefuse = async () => {
    const refusalReason = prompt('Raison du refus (obligatoire):');
    if (!refusalReason || refusalReason.trim() === '') {
      toast.error('La raison du refus est obligatoire');
      return;
    }

    try {
      setSubmitting(true);

      // Create whitelist first
      const whitelistData = {
        candidate_firstname: formData.firstname,
        candidate_lastname: formData.lastname,
        discord_username: formData.discord,
        age: parseInt(formData.age),
        experience_level: formData.experienceLevel,
        rp_hours: parseInt(formData.rpHours) || 0,
        category: formData.category,
        admin_notes: formData.adminNotes,
        total_score: calculateScore(),
      };

      const response = await whitelistAPI.create(whitelistData);
      const whitelistId = response.data.id;

      // Then refuse it
      await whitelistAPI.refuse(whitelistId, refusalReason);

      toast.success('Whitelist refusée');
      navigate('/whitelists');
    } catch (error: any) {
      console.error('Error refusing whitelist:', error);
      toast.error('Erreur lors du refus de la whitelist');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = () => {
    const scenarioScore = formData.scenarios.filter(s => s.validated).length * 10;
    const ruleScore = formData.ruleQuestions.filter(q => q.correct).length * 5;
    const lexiconScore = formData.lexiconQuestions.filter(q => q.correct).length * 5;
    return scenarioScore + ruleScore + lexiconScore;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Informations du candidat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prénom RP *
                </label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom RP *
                </label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pseudo Discord *
                </label>
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="username#1234"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Âge *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => {
                    const age = parseInt(e.target.value);
                    setFormData({ ...formData, age: e.target.value });
                    if (age < 18 && age > 0) {
                      setAgeBlocked(true);
                    } else {
                      setAgeBlocked(false);
                    }
                  }}
                  className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground ${
                    ageBlocked ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'
                  }`}
                  placeholder="18"
                  min="1"
                  required
                />
                {ageBlocked && (
                  <div className="mt-2 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-500">Candidat mineur détecté</p>
                      <p className="text-xs text-red-400 mt-1">
                        Les candidats de moins de 18 ans sont automatiquement refusés. Cette whitelist sera automatiquement marquée comme <strong>REFUSÉE</strong> pour raisons légales.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Niveau d'expérience RP *
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Expérimenté">Expérimenté</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre d'heures RP
                </label>
                <input
                  type="number"
                  value={formData.rpHours}
                  onChange={(e) => setFormData({ ...formData, rpHours: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Sélection de la catégorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setFormData({ ...formData, category: 'Legal' })}
                className={`p-8 rounded-xl border-2 transition-all ${
                  formData.category === 'Legal'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border bg-card hover:bg-secondary'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    formData.category === 'Legal' ? 'bg-green-500' : 'bg-green-500/20'
                  }`}>
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Legal</h3>
                  <p className="text-sm text-muted-foreground">Métiers et activités légales</p>
                </div>
              </button>

              <button
                onClick={() => setFormData({ ...formData, category: 'Illégal' })}
                className={`p-8 rounded-xl border-2 transition-all ${
                  formData.category === 'Illégal'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-border bg-card hover:bg-secondary'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    formData.category === 'Illégal' ? 'bg-red-500' : 'bg-red-500/20'
                  }`}>
                    <Tag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Illégal</h3>
                  <p className="text-sm text-muted-foreground">Métiers et activités illégales</p>
                </div>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Questions fixes</h2>
            <p className="text-muted-foreground mb-6">
              Ces questions sont toujours les mêmes pour tous les candidats.
            </p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Qu'est-ce qu'une zone safe ?
                </label>
                <input
                  type="text"
                  value={formData.fixedAnswers.zoneSafe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedAnswers: { ...formData.fixedAnswers, zoneSafe: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Réponse du candidat..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quel est le mot de passe caché dans le règlement ?
                </label>
                <input
                  type="text"
                  value={formData.fixedAnswers.passwordHidden}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedAnswers: { ...formData.fixedAnswers, passwordHidden: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Réponse du candidat..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quel est le safe word du serveur ?
                </label>
                <input
                  type="text"
                  value={formData.fixedAnswers.safeWord}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedAnswers: { ...formData.fixedAnswers, safeWord: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Réponse du candidat..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Scénarios RP</h2>
            <p className="text-muted-foreground mb-6">
              Lisez chaque scénario au candidat et notez sa réponse.
            </p>
            <div className="space-y-6">
              {formData.scenarios.map((scenario, index) => (
                <div key={scenario.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Scénario {index + 1}
                    </h3>
                    <button
                      onClick={() => {
                        const newScenarios = [...formData.scenarios];
                        newScenarios[index].validated = !newScenarios[index].validated;
                        setFormData({ ...formData, scenarios: newScenarios });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        scenario.validated
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {scenario.validated ? '✓ Validé' : '✗ Refusé'}
                    </button>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground italic">
                      [Le scénario sera généré automatiquement par le système]
                    </p>
                  </div>
                  <textarea
                    value={scenario.answer}
                    onChange={(e) => {
                      const newScenarios = [...formData.scenarios];
                      newScenarios[index].answer = e.target.value;
                      setFormData({ ...formData, scenarios: newScenarios });
                    }}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="Résumé de la réponse du candidat..."
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Questions de règlement et lexique</h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground">
                  Questions générées automatiquement : 4 questions de règlement + 3 questions de lexique
                </p>
                <div className="mt-4 flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Règlement</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formData.ruleQuestions.filter(q => q.correct).length}/4
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Lexique</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formData.lexiconQuestions.filter(q => q.correct).length}/3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        const totalScore = calculateScore();
        const suggestion = totalScore >= 70 ? 'accepter' : totalScore >= 50 ? 'en_attente' : 'refuser';

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Finalisation</h2>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Score total</p>
                <p className="text-5xl font-bold text-foreground">{totalScore}/100</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Scénarios</p>
                  <p className="text-xl font-bold text-foreground">
                    {formData.scenarios.filter(s => s.validated).length * 10}/30
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Questions</p>
                  <p className="text-xl font-bold text-foreground">
                    {(formData.ruleQuestions.filter(q => q.correct).length * 5) +
                      (formData.lexiconQuestions.filter(q => q.correct).length * 5)}/70
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Suggestion</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    suggestion === 'accepter' ? 'bg-green-500/20 text-green-400' :
                    suggestion === 'en_attente' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {suggestion === 'accepter' ? 'Accepter' :
                     suggestion === 'en_attente' ? 'En attente' : 'Refuser'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes administrateur
              </label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="Notes supplémentaires sur l'entretien..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleValidate}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'En cours...' : '✓ Confirmer et Valider'}
              </button>
              <button
                onClick={handleRefuse}
                disabled={submitting}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'En cours...' : '✗ Refuser la WL'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nouvelle Whitelist</h1>
        <p className="text-muted-foreground mt-2">Créer un nouvel entretien whitelist</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-6 min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Précédent
        </button>
        {currentStep < 5 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/50"
          >
            Suivant
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => console.log('Save draft')}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all"
          >
            <Save className="w-5 h-5" />
            Enregistrer le brouillon
          </button>
        )}
      </div>
    </div>
  );
};

export default WhitelistNew;
