import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  FileText,
  MessageSquare,
  Tag,
  Shield,
} from 'lucide-react';

const WhitelistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - would come from API based on ID
  const whitelist = {
    id: parseInt(id || '1'),
    firstname: 'Jean',
    lastname: 'Dupont',
    discord: 'jeandupont#1234',
    age: 24,
    experienceLevel: 'Intermédiaire',
    rpHours: 150,
    category: 'Legal',
    status: 'validée',
    score: 82,
    finalScore: 82,
    createdAt: '2024-03-15T14:30:00',
    admin: 'Admin1',
    duration: 28,
    fixedAnswers: {
      zoneSafe: 'Hôpital, commissariat, banque centrale',
      passwordHidden: 'Oui, toujours masquer le mot de passe',
      safeWord: 'Le safe word permet d\'arrêter une scène RP si elle devient inconfortable',
    },
    scenarios: [
      {
        id: 1,
        title: 'Contrôle Routier',
        question: 'Vous êtes arrêté par la police pour un contrôle routier. Comment réagissez-vous?',
        answer:
          'Je me gare sur le côté de manière sûre, je baisse ma vitre et je garde mes mains visibles sur le volant. Je salue poliment l\'officier et j\'attends ses instructions avant de bouger.',
        validated: true,
        adminComment: 'Excellente réaction, respecte bien les procédures RP',
        points: 10,
      },
      {
        id: 2,
        title: 'Négociation EMS',
        question: 'Vous êtes médecin et devez gérer un patient agressif.',
        answer:
          'Je reste calme et professionnel. J\'essaie d\'abord de dialoguer pour comprendre la raison de son agressivité. Si nécessaire, j\'appelle la sécurité ou la police pour assistance.',
        validated: true,
        adminComment: 'Bonne approche, priorise le dialogue',
        points: 10,
      },
      {
        id: 3,
        title: 'Situation d\'urgence',
        question: 'Un accident de voiture se produit devant vous. Que faites-vous?',
        answer:
          'J\'appelle immédiatement les urgences (911), je sécurise la zone si possible, et je vérifie l\'état des victimes sans les déplacer sauf danger imminent.',
        validated: true,
        adminComment: 'Parfait, suit les bonnes pratiques',
        points: 10,
      },
    ],
    ruleQuestions: [
      {
        question: 'Qu\'est-ce qu\'une zone safe?',
        answer: 'Zone où aucune violence n\'est autorisée',
        correct: true,
        expectedAnswer:
          'Une zone où aucune action RP violente (braquage, meurtre, etc.) n\'est autorisée. Exemples: Hôpital, Commissariat.',
        points: 5,
      },
      {
        question: 'Peut-on tuer sans raison RP valable?',
        answer: 'Non, c\'est du RDM',
        correct: true,
        expectedAnswer: 'Non, c\'est du RDM (Random Death Match) et c\'est strictement interdit.',
        points: 5,
      },
      {
        question: 'Qu\'est-ce que le PowerGaming?',
        answer: 'Forcer une action RP',
        correct: true,
        expectedAnswer:
          'C\'est le fait de forcer une action RP sans laisser de choix à l\'autre joueur ou d\'utiliser des informations HRP en RP.',
        points: 5,
      },
      {
        question: 'Peut-on utiliser des informations HRP en RP?',
        answer: 'Non, c\'est du metagaming',
        correct: true,
        expectedAnswer: 'Non, c\'est du metagaming et c\'est interdit.',
        points: 5,
      },
    ],
    lexiconQuestions: [
      {
        question: 'Que signifie "RDM"?',
        answer: 'Random Death Match',
        correct: true,
        expectedAnswer: 'Random Death Match - Tuer quelqu\'un sans raison RP valable.',
        points: 5,
      },
      {
        question: 'Que signifie "VDM"?',
        answer: 'Vehicle Death Match',
        correct: true,
        expectedAnswer: 'Vehicle Death Match - Écraser quelqu\'un volontairement sans raison RP.',
        points: 5,
      },
      {
        question: 'Que signifie "HRP" et "RP"?',
        answer: 'Hors RolePlay et RolePlay',
        correct: true,
        expectedAnswer:
          'HRP = Hors RolePlay (vie réelle), RP = RolePlay (personnage dans le jeu).',
        points: 5,
      },
    ],
    adminNotes:
      'Excellent candidat, montre une très bonne compréhension du RP et des règles. Recommande fortement pour la catégorie Legal.',
    decision: 'Validée',
    decisionReason: 'Score élevé, bonnes réponses, attitude professionnelle',
  };

  const scenarioScore = whitelist.scenarios.filter((s) => s.validated).length * 10;
  const ruleScore = whitelist.ruleQuestions.filter((q) => q.correct).length * 5;
  const lexiconScore = whitelist.lexiconQuestions.filter((q) => q.correct).length * 5;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validée':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'refusée':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'en_attente':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/whitelist/history')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Whitelist #{whitelist.id} - {whitelist.firstname} {whitelist.lastname}
            </h1>
            <p className="text-muted-foreground mt-2">
              Détails complets de l'entretien de whitelist
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(
            whitelist.status
          )}`}
        >
          {whitelist.status.toUpperCase()}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">Score Final</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{whitelist.finalScore}/100</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${whitelist.finalScore}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-muted-foreground">Administrateur</span>
          </div>
          <p className="text-xl font-bold text-foreground">{whitelist.admin}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">Durée</span>
          </div>
          <p className="text-xl font-bold text-foreground">{whitelist.duration} min</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Date</span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {new Date(whitelist.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(whitelist.createdAt).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Candidate Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Informations du Candidat</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Nom RP Complet</p>
            <p className="text-base font-medium text-foreground">
              {whitelist.firstname} {whitelist.lastname}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Discord</p>
            <p className="text-base font-medium text-foreground">{whitelist.discord}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Âge</p>
            <p className="text-base font-medium text-foreground">{whitelist.age} ans</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Expérience RP</p>
            <p className="text-base font-medium text-foreground">{whitelist.experienceLevel}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Heures RP</p>
            <p className="text-base font-medium text-foreground">{whitelist.rpHours}h</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Catégorie</p>
            <span
              className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                whitelist.category === 'Legal'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {whitelist.category}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Answers */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Questions Fixes</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Qu'est-ce qu'une zone safe?
            </p>
            <p className="text-base text-foreground">{whitelist.fixedAnswers.zoneSafe}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Pourquoi faut-il cacher son mot de passe?
            </p>
            <p className="text-base text-foreground">{whitelist.fixedAnswers.passwordHidden}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Qu'est-ce qu'un safe word?
            </p>
            <p className="text-base text-foreground">{whitelist.fixedAnswers.safeWord}</p>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Scénarios RP</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            Score: {scenarioScore}/30 points
          </span>
        </div>
        <div className="space-y-4">
          {whitelist.scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className="bg-secondary/30 border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{scenario.title}</h3>
                </div>
                {scenario.validated ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{scenario.question}</p>
              <div className="bg-background rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-foreground">{scenario.answer}</p>
              </div>
              {scenario.adminComment && (
                <div className="flex items-start gap-2 mt-2">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-muted-foreground italic">{scenario.adminComment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rule Questions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Questions Règlement</h2>
          </div>
          <span className="text-sm text-muted-foreground">Score: {ruleScore}/20 points</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {whitelist.ruleQuestions.map((q, index) => (
            <div
              key={index}
              className="bg-secondary/30 border border-border rounded-lg p-4 flex items-start justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Réponse:</strong> {q.answer}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  <strong>Attendu:</strong> {q.expectedAnswer}
                </p>
              </div>
              {q.correct ? (
                <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 ml-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lexicon Questions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Questions Lexique</h2>
          </div>
          <span className="text-sm text-muted-foreground">Score: {lexiconScore}/15 points</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {whitelist.lexiconQuestions.map((q, index) => (
            <div
              key={index}
              className="bg-secondary/30 border border-border rounded-lg p-4 flex items-start justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Réponse:</strong> {q.answer}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  <strong>Attendu:</strong> {q.expectedAnswer}
                </p>
              </div>
              {q.correct ? (
                <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 ml-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes & Decision */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Notes & Décision</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Notes de l'admin</p>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-base text-foreground">{whitelist.adminNotes}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Décision Finale & Raison
            </p>
            <div
              className={`rounded-lg p-4 border ${getStatusColor(whitelist.status)}`}
            >
              <p className="font-bold text-lg mb-1">{whitelist.decision}</p>
              <p className="text-sm">{whitelist.decisionReason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitelistDetail;
