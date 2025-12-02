-- =====================================================
-- DONNÉES PAR DÉFAUT - Scénarios et Questions
-- =====================================================

USE fivem_whitelist;

-- =====================================================
-- SCÉNARIOS PAR DÉFAUT - LEGAL (10 scénarios)
-- =====================================================
INSERT INTO scenarios (titre, contenu, categorie, is_default, tags) VALUES
('Accident de la route', 'Vous conduisez tranquillement en ville lorsqu\'un autre véhicule vous percute par l\'arrière à un feu rouge. Le conducteur descend et commence à s\'énerver en vous accusant d\'avoir freiné trop brusquement. Comment réagissez-vous ?', 'legal', TRUE, '["conduite", "conflit", "police"]'),

('Contrôle routier', 'Vous êtes arrêté par la police pour un contrôle routier de routine. L\'agent vous demande vos papiers et vous informe que votre véhicule correspond à la description d\'un véhicule volé signalé il y a une heure. Comment gérez-vous cette situation ?', 'legal', TRUE, '["police", "malentendu", "documents"]'),

('Témoin d\'un braquage', 'Vous faites vos courses dans une supérette quand soudain deux individus masqués entrent et menacent le caissier avec des armes. Vous êtes caché derrière un rayonnage. Que faites-vous ?', 'legal', TRUE, '["criminalité", "témoin", "danger"]'),

('Proposition d\'emploi douteuse', 'Un inconnu vous aborde dans la rue et vous propose un travail très bien payé : livrer des colis sans poser de questions. Il insiste sur la discrétion et le paiement en cash. Comment réagissez-vous ?', 'legal', TRUE, '["emploi", "légalité", "choix"]'),

('Dispute conjugale publique', 'En vous promenant dans un parc, vous assistez à une violente dispute entre un couple. La situation s\'aggrave et l\'homme commence à devenir physiquement agressif envers la femme. Quelle est votre réaction ?', 'legal', TRUE, '["violence", "intervention", "civil"]'),

('Perte de papiers d\'identité', 'Vous réalisez que vous avez perdu votre carte d\'identité et votre permis de conduire. Le lendemain, vous devez absolument vous rendre à un rendez-vous important en voiture de l\'autre côté de la ville. Comment procédez-vous ?', 'legal', TRUE, '["administration", "documents", "responsabilité"]'),

('Arnaque au parking', 'Au parking, quelqu\'un vous aborde en prétendant être le gardien et vous demande 50$ pour vous garer. Il n\'a pas d\'uniforme mais semble insistant. Vous remarquez qu\'il n\'y a pas de barrière ni de système de paiement officiel. Comment réagissez-vous ?', 'legal', TRUE, '["arnaque", "argent", "vigilance"]'),

('Incendie dans un immeuble', 'Vous êtes chez vous quand l\'alarme incendie de votre immeuble se déclenche. Vous sentez une odeur de fumée venant de l\'appartement de votre voisin. Décrivez vos actions étape par étape.', 'legal', TRUE, '["urgence", "sécurité", "solidarité"]'),

('Harcèlement de rue', 'Vous marchez dans la rue quand vous voyez un groupe de personnes harceler et intimider un passant. La victime semble effrayée et tente de s\'éloigner mais ils la suivent. Que faites-vous ?', 'legal', TRUE, '["harcèlement", "intervention", "sécurité"]'),

('Problème médical en public', 'En faisant vos courses, vous voyez une personne âgée s\'effondrer soudainement. Elle semble inconsciente et plusieurs personnes se sont rassemblées autour sans savoir quoi faire. Comment intervenez-vous ?', 'legal', TRUE, '["urgence", "médical", "secours"]');

-- =====================================================
-- SCÉNARIOS PAR DÉFAUT - ILLÉGAL (10 scénarios)
-- =====================================================
INSERT INTO scenarios (titre, contenu, categorie, is_default, tags) VALUES
('Proposition de deal', 'Vous êtes dans un quartier et un membre d\'un gang adverse vous propose de faire un deal ensemble : partager un territoire en échange d\'une trêve temporaire. Il vous assure que c\'est bénéfique pour les deux parties. Comment répondez-vous et gérez-vous cette proposition ?', 'illégal', TRUE, '["gang", "territoire", "alliance"]'),

('Contrôle police avec marchandise', 'Vous transportez de la marchandise illégale dans votre véhicule quand vous apercevez un barrage de police devant vous. Vous avez quelques secondes pour réagir avant d\'arriver au contrôle. Que faites-vous ?', 'illégal', TRUE, '["police", "trafic", "évasion"]'),

('Conflit territorial', 'Votre gang découvre qu\'un gang rival a installé un point de vente sur votre territoire sans autorisation. Trois de leurs membres sont actuellement sur place. Comment gérez-vous cette provocation ?', 'illégal', TRUE, '["territoire", "conflit", "gang"]'),

('Balance dans l\'organisation', 'Des rumeurs circulent selon lesquelles quelqu\'un de votre organisation donne des informations à la police. Plusieurs membres suspectent un de vos proches collaborateurs. Vous êtes chargé de gérer la situation. Comment procédez-vous ?', 'illégal', TRUE, '["trahison", "enquête", "organisation"]'),

('Braquage qui tourne mal', 'Pendant un braquage planifié, un membre de votre équipe panique et tire sur un vigile alors que ce n\'était pas prévu. La police est en route, le vigile est blessé, et votre équipe attend vos ordres. Que faites-vous ?', 'illégal', TRUE, '["braquage", "urgence", "décision"]'),

('Proposition d\'infiltration', 'Un policier infiltré que vous ne connaissez pas encore tente de rejoindre votre organisation. Il semble suspect : trop insistant, pose beaucoup de questions, et son histoire ne colle pas totalement. Comment testez-vous sa loyauté et gérez-vous cette situation ?', 'illégal', TRUE, '["infiltration", "méfiance", "test"]'),

('Négociation otage', 'Votre groupe a pris un otage lors d\'une opération et la police a encerclé le bâtiment. Ils demandent à négocier. Votre boss vous désigne pour être le négociateur. Comment menez-vous la négociation pour vous en sortir ?', 'illégal', TRUE, '["otage", "négociation", "police"]'),

('Guerre des gangs', 'Un gang rival a tué un membre important de votre organisation dans une embuscade. Votre chef vous demande de planifier une réponse appropriée. Comment organisez-vous la riposte tout en minimisant les risques pour votre gang ?', 'illégal', TRUE, '["vengeance", "stratégie", "guerre"]'),

('Blanchiment d\'argent', 'Vous avez gagné beaucoup d\'argent sale qu\'il faut blanchir rapidement et discrètement. Un contact vous propose trois options : un casino, une société écran, ou des investissements immobiliers. Expliquez votre choix et votre méthode.', 'illégal', TRUE, '["blanchiment", "finance", "stratégie"]'),

('Corruption d\'un officiel', 'Un policier corrompu qui vous aide habituellement vous contacte en urgence : il est sous enquête interne et risque de parler pour sauver sa peau. Il vous demande de l\'aide. Comment gérez-vous cette situation délicate ?', 'illégal', TRUE, '["corruption", "risque", "décision"]');

-- =====================================================
-- SCÉNARIOS PAR DÉFAUT - INDÉPENDANT (5 scénarios)
-- =====================================================
INSERT INTO scenarios (titre, contenu, categorie, is_default, tags) VALUES
('Client mécontent', 'Vous êtes mécanicien indépendant. Un client revient furieux car sa voiture est retombée en panne 2 jours après votre réparation. Il exige un remboursement immédiat et menace de laisser des avis négatifs partout. Comment gérez-vous cette situation ?', 'indépendant', TRUE, '["service", "conflit", "réputation"]'),

('Proposition de partenariat louche', 'Un individu vous propose un partenariat pour votre business : il vous amène beaucoup de clients mais demande un pourcentage élevé et refuse de donner des détails sur la provenance de ces clients. Que faites-vous ?', 'indépendant', TRUE, '["business", "légalité", "choix"]'),

('Concurrence déloyale', 'Vous découvrez qu\'un concurrent direct répand des rumeurs malveillantes sur vous et votre travail pour vous voler vos clients. Plusieurs clients vous ont déjà quitté à cause de ces mensonges. Comment réagissez-vous ?', 'indépendant', TRUE, '["concurrence", "réputation", "réaction"]'),

('Problème de paiement', 'Un client régulier et important vous doit une grosse somme d\'argent depuis plusieurs semaines. Il esquive vos appels et trouve toujours des excuses pour reporter le paiement. Votre trésorerie en souffre. Comment récupérez-vous votre argent ?', 'indépendant', TRUE, '["finance", "recouvrement", "relation"]'),

('Expansion du business', 'Votre business marche bien et vous avez économisé assez d\'argent pour vous développer. Vous avez le choix entre : embaucher un employé, acheter du meilleur équipement, ou ouvrir un second local. Expliquez votre choix et votre stratégie.', 'indépendant', TRUE, '["business", "expansion", "stratégie"]');

-- =====================================================
-- SCÉNARIOS PAR DÉFAUT - UNIVERSEL (5 scénarios)
-- =====================================================
INSERT INTO scenarios (titre, contenu, categorie, is_default, tags) VALUES
('Rencontre inattendue', 'Au bar, vous rencontrez quelqu\'un qui prétend vous connaître d\'une ancienne ville où vous avez vécu. Vous ne le reconnaissez pas du tout mais il connaît des détails précis sur votre passé. Comment gérez-vous cette rencontre étrange ?', 'universel', TRUE, '["social", "mystère", "passé"]'),

('Rumeur sur vous', 'Vous apprenez qu\'une rumeur circule en ville selon laquelle vous auriez fait quelque chose de très grave (à vous de préciser quoi). Cette rumeur est totalement fausse mais beaucoup de gens y croient déjà. Comment rétablissez-vous votre réputation ?', 'universel', TRUE, '["réputation", "rumeur", "social"]'),

('Proposition amoureuse compliquée', 'Quelqu\'un que vous appréciez vous fait des avances mais cette personne est en couple avec quelqu\'un d\'important ou dangereux (membre de gang, policier, personne influente). Comment gérez-vous cette situation délicate ?', 'universel', TRUE, '["relationnel", "risque", "choix"]'),

('Dette de jeu', 'Vous avez perdu une grosse somme d\'argent au casino et vous devez maintenant de l\'argent à des gens peu recommandables. Ils vous donnent 48h pour payer ou il y aura des conséquences. Comment trouvez-vous cet argent ?', 'universel', TRUE, '["dette", "urgence", "survie"]'),

('Témoin gênant', 'Vous avez accidentellement été témoin d\'une scène compromettante impliquant des personnes puissantes (au choix : politiciens, gang, police). Ces personnes vous ont vu et savent que vous avez tout vu. Comment gérez-vous cette situation dangereuse ?', 'universel', TRUE, '["danger", "secret", "survie"]');

-- =====================================================
-- QUESTIONS DE RÈGLEMENT PAR DÉFAUT (70 questions)
-- =====================================================
INSERT INTO questions_reglement (question, reponse_correcte, explication, is_default) VALUES
-- Questions sur le RP général
('Qu\'est-ce que le terme "RP" signifie et qu\'implique-t-il ?', 'RP signifie RolePlay (jeu de rôle). Cela implique d\'incarner un personnage fictif avec une histoire, une personnalité et des motivations propres, en restant cohérent avec ce personnage à tout moment dans le jeu.', 'Le RolePlay est la base fondamentale du serveur. Tous les joueurs doivent rester dans leur rôle en permanence.', TRUE),

('Qu\'est-ce que le "HRP" et quand peut-on l\'utiliser ?', 'HRP signifie Hors RolePlay. On peut l\'utiliser uniquement pour des questions techniques urgentes, des problèmes de jeu, ou avec l\'accord des personnes concernées. Il doit être indiqué clairement (par exemple entre parenthèses) et utilisé avec parcimonie.', 'Le HRP doit être évité au maximum pour préserver l\'immersion.', TRUE),

('Qu\'est-ce que le "PowerRP" et pourquoi est-il interdit ?', 'Le PowerRP consiste à imposer des actions à un autre joueur sans lui laisser la possibilité de réagir. Exemple : "/me lui casse la mâchoire d\'un coup de poing". C\'est interdit car cela ne respecte pas le consentement et le libre arbitre des autres joueurs.', 'Chaque joueur doit pouvoir réagir aux actions des autres.', TRUE),

('Qu\'est-ce que le "FearRP" ?', 'Le FearRP est l\'obligation de jouer la peur de son personnage de manière réaliste. Si quelqu\'un vous braque avec une arme, vous devez avoir peur et coopérer, comme dans la vraie vie.', 'La peur est une émotion humaine naturelle qui doit être roleplayée.', TRUE),

('Expliquez ce qu\'est le "PainRP".', 'Le PainRP est l\'obligation de jouer la douleur. Si votre personnage est blessé, vous devez interpréter la douleur et les conséquences des blessures de manière réaliste (boiter, gémir, être affaibli, etc.).', 'Les blessures ont des conséquences qui doivent être jouées.', TRUE),

('Qu\'est-ce que le "MetaGaming" et pourquoi est-il interdit ?', 'Le MetaGaming consiste à utiliser des informations obtenues hors RP (Discord, stream, etc.) dans le RP. Exemple : regarder un stream et utiliser la position d\'un joueur en jeu. C\'est interdit car cela brise l\'immersion et l\'équité.', 'Votre personnage ne peut connaître que ce qu\'il a appris en RP.', TRUE),

('Qu\'est-ce que le "MixRP" ?', 'Le MixRP c\'est mélanger des informations HRP et RP. Exemple : utiliser le vrai prénom d\'un joueur au lieu du nom de son personnage en jeu. C\'est interdit.', 'Il faut strictement séparer le jeu de la réalité.', TRUE),

('Qu\'est-ce que le "Freekill" ?', 'Le Freekill c\'est tuer un joueur sans raison RP valable ou sans interaction RP préalable. C\'est strictement interdit et sanctionné lourdement.', 'Toute action hostile doit être justifiée par le RP.', TRUE),

('Qu\'est-ce que le "Freepunch" ?', 'Le Freepunch c\'est frapper quelqu\'un sans raison RP valable. Même sans tuer, c\'est interdit. Toute agression doit être justifiée par le RP.', 'La violence gratuite est interdite.', TRUE),

('Combien de joueurs minimum doivent être présents pour faire un braquage de banque/bijouterie ?', 'Généralement, il faut un minimum de policiers en service (souvent 4 ou 5 selon les serveurs). Il faut vérifier le règlement spécifique du serveur.', 'Les braquages nécessitent une présence policière suffisante pour l\'équilibre.', TRUE),

-- Questions sur les interactions
('Si un policier vous braque, devez-vous obligatoirement coopérer ?', 'Oui, c\'est du FearRP. Vous devez coopérer et obéir aux ordres tant que votre vie est menacée. Vous pouvez résister seulement si vous êtes en supériorité numérique claire ou si vous avez un avantage tactique.', 'Le FearRP s\'applique à toutes les interactions avec armes.', TRUE),

('Pouvez-vous tirer sur quelqu\'un depuis votre véhicule en mouvement ?', 'C\'est généralement interdit (DriveBy). Certains serveurs l\'autorisent dans des contextes très spécifiques (guerre de gangs déclarée, etc.). Il faut vérifier le règlement.', 'Le DriveBy est souvent considéré comme du jeu non-RP.', TRUE),

('Vous êtes blessé et à terre. Pouvez-vous continuer à parler normalement ?', 'Non, vous devez jouer la douleur et la faiblesse (PainRP). Votre personnage peut à peine parler, gémit de douleur, et ne peut pas donner d\'informations détaillées clairement.', 'Un personnage gravement blessé ne peut pas agir normalement.', TRUE),

('Qu\'est-ce qu\'une "zone safe" ?', 'Une zone safe est un endroit où toute action hostile est interdite (hôpital, zone de spawn, certains lieux publics selon les serveurs). C\'est un lieu neutre protégé.', 'Les zones safe protègent les joueurs de la violence.', TRUE),

('Pouvez-vous insulter gratuitement quelqu\'un dans la rue ?', 'Techniquement oui si c\'est cohérent avec votre personnage, mais cela doit avoir des conséquences RP. La personne peut réagir, se vexer, vous menacer, appeler la police, etc. Il faut assumer les conséquences.', 'Toute action a des conséquences dans le RP.', TRUE),

-- Questions sur la vie/mort
('Qu\'est-ce que le "CK" (Character Kill) ?', 'Le CK est la mort définitive d\'un personnage. Il nécessite généralement l\'accord des admins et/ou du joueur. Le personnage est mort pour toujours et ne peut plus être joué.', 'Le CK est irréversible et très rare.', TRUE),

('Qu\'est-ce que le "PK" (Player Kill) ?', 'Le PK est une mort temporaire. Le personnage meurt mais peut être réanimé. Cependant, il perd généralement la mémoire des événements ayant mené à sa mort (amnésie RP).', 'Le PK permet de mourir sans perdre son personnage.', TRUE),

('Après une mort (PK), que devez-vous oublier ?', 'Vous devez oublier les 15-30 dernières minutes avant votre mort (selon les serveurs), incluant qui vous a tué et pourquoi. Vous ne pouvez pas utiliser ces informations pour vous venger ou prévenir la police.', 'L\'amnésie post-mortem évite les cycles de vengeance infinis.', TRUE),

('Pouvez-vous retourner immédiatement sur le lieu de votre mort ?', 'Non, c\'est interdit. Il y a généralement une règle de distance et de temps (par exemple, ne pas revenir dans un rayon de 1km pendant 30 minutes).', 'Cela évite les abus et préserve le réalisme.', TRUE),

('Qu\'arrive-t-il si vous mourrez sans que personne ne vous réanime ?', 'Après un certain délai, vous pouvez "réapparaître" à l\'hôpital. Vous avez été trouvé par les secours et transporté. Vous gardez l\'amnésie des événements de votre mort.', 'Le système de mort permet de continuer à jouer.', TRUE),

-- Questions sur les véhicules
('Que devez-vous faire si votre véhicule a un accident grave ?', 'Vous devez jouer les conséquences : rester sur place, appeler les secours/police si nécessaire, roleplay les blessures éventuelles. Vous ne pouvez pas simplement repartir comme si de rien n\'était.', 'Les accidents ont des conséquences réalistes.', TRUE),

('Pouvez-vous conduire à 200 km/h en ville sans raison ?', 'Non, sauf si vous avez une raison RP valable (course-poursuite, urgence, etc.). La conduite doit rester réaliste et cohérente avec votre personnage.', 'La conduite doit être réaliste.', TRUE),

('Qu\'est-ce que le "VDM" (Vehicle Death Match) ?', 'C\'est le fait d\'utiliser volontairement son véhicule comme arme pour blesser ou tuer des joueurs. C\'est strictement interdit sauf contexte RP très spécifique et justifié.', 'Un véhicule n\'est pas une arme.', TRUE),

('Pouvez-vous voler n\'importe quel véhicule ?', 'Oui, si c\'est cohérent avec votre personnage et la situation RP. Mais attention aux conséquences : la police peut vous arrêter, le propriétaire peut vous poursuivre, etc.', 'Le vol de véhicule est possible mais risqué.', TRUE),

('Votre véhicule est détruit. Que faites-vous ?', 'Vous devez le faire remorquer/réparer via un mécanicien ou une fourrière. Vous ne pouvez pas simplement le faire disparaître et le rappeler magiquement (sauf si le serveur a un système spécifique).', 'Les véhicules détruits doivent être réparés de manière RP.', TRUE),

-- Questions sur la police
('La police peut-elle vous arrêter sans raison ?', 'Non, la police doit avoir une raison RP valable pour un contrôle ou une arrestation (comportement suspect, délit constaté, signalement, etc.).', 'La police doit respecter des règles RP comme tout le monde.', TRUE),

('Que se passe-t-il si vous refusez d\'obtempérer à un ordre policier ?', 'La police peut utiliser la force progressivement : sommations, menaces, taser, armes létales en dernier recours. Vous risquez l\'arrestation, des blessures ou la mort selon votre réaction.', 'Les ordres policiers ont des conséquences si ignorés.', TRUE),

('Pouvez-vous mentir à la police ?', 'Oui, si c\'est cohérent avec votre personnage. Mais la police peut ne pas vous croire, enquêter, trouver des preuves, et vous inculper pour faux témoignage en plus.', 'Mentir est autorisé mais risqué.', TRUE),

('Combien de temps la police peut-elle vous garder en garde à vue ?', 'Cela dépend du règlement du serveur, généralement entre 30 minutes et 2 heures RP. Au-delà, vous devez être libéré ou jugé.', 'La garde à vue a une durée limitée.', TRUE),

('La police peut-elle fouiller votre maison sans mandat ?', 'Généralement non, sauf circonstances exceptionnelles (flagrant délit, danger imminent). Sur la plupart des serveurs RP, un mandat est nécessaire.', 'Les droits des citoyens doivent être respectés.', TRUE),

-- Questions sur les gangs/organisations
('Qu\'est-ce qu\'un "territoire" de gang ?', 'C\'est une zone géographique contrôlée par un gang. D\'autres gangs doivent demander la permission pour y opérer ou s\'attendre à des conflits.', 'Les territoires sont des enjeux majeurs pour les gangs.', TRUE),

('Pouvez-vous tuer un membre d\'un gang rival sans raison ?', 'Non, même dans le monde criminel, il faut une raison RP valable (conflit territorial, trahison, vengeance justifiée, guerre déclarée, etc.). Le Freekill reste interdit.', 'Même le crime doit avoir une logique RP.', TRUE),

('Qu\'est-ce qu\'une "guerre de gangs" ?', 'C\'est un conflit déclaré entre deux organisations criminelles, généralement validé par les admins, avec des règles spécifiques et une durée limitée.', 'Les guerres de gangs sont encadrées pour éviter le chaos.', TRUE),

('Pouvez-vous kidnapper quelqu\'un ?', 'Oui, avec une raison RP valable et en respectant le FearRP de la victime. Il faut aussi respecter les règles du serveur sur la durée, le traitement de l\'otage, etc.', 'Le kidnapping est autorisé mais encadré.', TRUE),

('Un gang peut-il "taxer" les gens sur son territoire ?', 'Cela dépend du serveur. Sur certains serveurs oui, avec des règles précises. Sur d\'autres, c\'est limité ou interdit. Il faut vérifier.', 'Les règles sur les taxes varient selon les serveurs.', TRUE),

-- Questions sur l\'économie
('Pouvez-vous donner de l\'argent à un ami juste pour l\'aider sans raison RP ?', 'C\'est du "cheat" économique. L\'argent doit circuler avec des raisons RP (prêt, paiement pour un service, cadeau avec justification, etc.).', 'L\'économie doit rester cohérente avec le RP.', TRUE),

('Qu\'est-ce que le "farm" ?', 'C\'est répéter en boucle une action lucrative pour gagner de l\'argent rapidement. Un peu de farm est toléré mais il faut varier et privilégier le RP aux gains.', 'Le RP prime sur l\'argent.', TRUE),

('Pouvez-vous créer un business ?', 'Oui, sur la plupart des serveurs vous pouvez créer des entreprises légales (garage, bar, etc.) avec l\'accord des admins et en respectant les règles économiques du serveur.', 'L\'entrepreneuriat est encouragé dans le RP.', TRUE),

('Qu\'est-ce que le blanchiment d\'argent en RP ?', 'C\'est transformer de l\'argent sale (obtenu illégalement) en argent propre via des commerces légaux, des investissements, etc. C\'est une activité RP importante pour les criminels.', 'Le blanchiment est un aspect réaliste du crime.', TRUE),

('Pouvez-vous avoir plusieurs emplois en même temps ?', 'Cela dépend du serveur. Généralement, vous pouvez avoir un emploi principal et des activités secondaires si c\'est cohérent RP (exemple : policier de jour et voleur de nuit serait incohérent).', 'Les emplois doivent rester logiques avec votre personnage.', TRUE),

-- Questions sur les propriétés
('Comment obtenir une maison/appartement ?', 'Via le système immobilier du serveur : achat, location, ou obtention suite à un RP spécifique. Cela nécessite généralement de l\'argent et parfois une validation admin.', 'Les propriétés s\'obtiennent de manière RP.', TRUE),

('Quelqu\'un peut-il entrer chez vous sans permission ?', 'Non, sauf forces de l\'ordre avec mandat ou cambriolage réussi selon les règles. Votre domicile est privé et protégé.', 'La propriété privée est respectée.', TRUE),

('Que se passe-t-il si vous ne payez pas votre loyer ?', 'Selon le serveur, vous pouvez perdre votre logement, recevoir des avertissements, ou avoir des conséquences RP (expulsion, dette, etc.).', 'Les loyers doivent être payés comme dans la vraie vie.', TRUE),

('Pouvez-vous vendre votre propriété ?', 'Généralement oui, à un autre joueur ou au système du serveur, selon les règles économiques établies.', 'Les propriétés peuvent être transférées.', TRUE),

('Pouvez-vous être cambriolé ?', 'Sur la plupart des serveurs oui, si vous êtes absent et selon des règles précises (nombre de policiers, horaires, etc.). Vos biens stockés peuvent être volés.', 'Le cambriolage est un risque RP réaliste.', TRUE),

-- Questions sur le comportement général
('Que faire si un joueur ne respecte pas le RP ?', 'Ne pas riposter en HRP. Noter la situation, prendre des preuves (screenshots, vidéos), et faire un report aux admins via les canaux officiels. Ne pas faire justice soi-même.', 'Les problèmes de règles se règlent par les admins.', TRUE),

('Pouvez-vous jouer un personnage raciste, sexiste, ou offensant ?', 'C\'est très encadré et généralement déconseillé. Même si certains serveurs l\'autorisent dans un cadre RP strict, cela peut mener à des sanctions si mal géré ou si cela dérange d\'autres joueurs.', 'Le respect entre joueurs prime sur le RP.', TRUE),

('Qu\'est-ce que le "Fail RP" ?', 'C\'est une action non-réaliste ou incohérente qui brise l\'immersion. Exemples : survivre à une chute mortelle et repartir en courant, parler normalement avec une balle dans la tête, etc.', 'Le RP doit rester crédible et réaliste.', TRUE),

('Devez-vous avoir un background (histoire) pour votre personnage ?', 'Oui, c\'est fortement recommandé et souvent obligatoire. Votre personnage doit avoir un passé, des motivations, une personnalité qui justifient ses actions.', 'Un bon background enrichit le RP.', TRUE),

('Pouvez-vous jouer plusieurs personnages ?', 'Cela dépend du serveur. Beaucoup autorisent plusieurs personnages mais interdisent qu\'ils interagissent entre eux (c\'est du MetaGaming).', 'Les multi-personnages sont souvent autorisés avec restrictions.', TRUE),

-- Questions techniques
('Que signifie "/me" ?', '/me permet de décrire une action que votre personnage effectue. Exemple : "/me ouvre la porte doucement". C\'est essentiel pour décrire des actions non-animées par le jeu.', 'Le /me enrichit énormément le RP.', TRUE),

('Que signifie "/do" ?', '/do permet de décrire l\'environnement ou le résultat d\'une action. Exemple : "/do La porte grince en s\'ouvrant". C\'est la voix du narrateur.', 'Le /do complète le contexte RP.', TRUE),

('Quelle est la différence entre "/me" et "/do" ?', '/me = action du personnage, /do = description de l\'environnement/résultat. Exemple : "/me frappe à la porte" puis "/do Personne ne répond".', 'Chaque commande a son usage spécifique.', TRUE),

('Qu\'est-ce qu\'un "emote" ?', 'C\'est une animation ou commande pour faire faire une action à votre personnage (s\'asseoir, faire un signe, danser, etc.). Cela rend le RP plus visuel et immersif.', 'Les emotes enrichissent l\'interprétation visuelle.', TRUE),

('Comment signaler un joueur qui triche ?', 'Via le système de report du serveur (souvent /report) ou sur le Discord/forum officiel avec des preuves. Ne jamais accuser publiquement sans preuves.', 'Les reports doivent suivre la procédure officielle.', TRUE),

-- Questions sur situations spécifiques
('Vous trouvez un objet de valeur par terre. Pouvez-vous le prendre ?', 'Oui, mais jouez-le de manière RP : regarder autour, hésiter, justifier pourquoi votre personnage le prendrait. Si c\'est le résultat d\'un bug/déconnexion, prévenez un admin.', 'Même trouver un objet doit être roleplayé.', TRUE),

('Comment initier un braquage RP de manière correcte ?', 'Approche cohérente, armes sorties, ordres clairs, laissez le temps de réagir. Pas de "/me braque tout le monde, donnez l\'argent". Il faut un RP de qualité, pas juste l\'efficacité.', 'Les braquages doivent être roleplayés, pas rushés.', TRUE),

('Vous êtes témoin d\'un crime. Êtes-vous obligé d\'appeler la police ?', 'Non, c\'est un choix RP. Votre personnage peut avoir peur, être complice, s\'en ficher, ou au contraire être un bon citoyen. Tout dépend de votre background.', 'Vos actions doivent correspondre à votre personnage.', TRUE),

('Pouvez-vous reconnaître quelqu\'un qui porte un masque/cagoule ?', 'Non, sauf si vous avez des indices clairs (voix reconnaissable, vêtements uniques, tatouages visibles, etc.). Le déguisement doit être respecté.', 'Les masques cachent l\'identité de manière RP.', TRUE),

('Qu\'est-ce qu\'un "scénario RP" ?', 'C\'est une situation créée volontairement pour générer du RP intéressant (événements, histoires suivies, conflits planifiés, etc.). C\'est encouragé si bien fait.', 'Les scénarios enrichissent le serveur.', TRUE),

-- Questions sur les règles de communication
('Pouvez-vous utiliser Discord pour communiquer en pleine action RP ?', 'Non, c\'est du MetaGaming. Toute communication doit passer par le jeu (téléphone RP, radio, proximité vocale, etc.).', 'Discord doit rester HRP.', TRUE),

('Qu\'est-ce que la "radio RP" ?', 'C\'est un système de communication à distance dans le jeu, généralement utilisé par les organisations, gangs, ou services (police, EMS). Il faut avoir une radio en RP pour l\'utiliser.', 'Les communications doivent avoir un support RP.', TRUE),

('Pouvez-vous crier des informations à un ami qui est loin ?', 'Non, la voix a une portée limitée réaliste. Au-delà d\'une certaine distance, il faut utiliser téléphone ou radio.', 'La communication doit rester réaliste.', TRUE),

('Qu\'est-ce que le "StreamSniping" ?', 'C\'est regarder le stream d\'un joueur pour obtenir des informations sur sa position/actions et les utiliser en jeu. C\'est du MetaGaming grave et sanctionné lourdement.', 'Les streams ne doivent jamais influencer le jeu.', TRUE),

('Comment gérer un conflit HRP avec un autre joueur ?', 'En privé, calmement, en MP ou via les admins. Ne jamais régler des problèmes HRP en RP ou en vocal public. Gardez séparé le jeu et les problèmes personnels.', 'Les conflits HRP restent en HRP et se règlent correctement.', TRUE),

-- Questions difficiles / pièges
('Vous êtes poursuivi par la police. Pouvez-vous vous déconnecter pour échapper à l\'arrestation ?', 'Non, c\'est du "Combat Logging", strictement interdit et sanctionné très lourdement (ban). Vous devez assumer le RP jusqu\'au bout.', 'Se déconnecter pour éviter des conséquences est un des pires abus.', TRUE),

('La règle du "Respect" s\'applique-t-elle seulement en HRP ou aussi en RP ?', 'En HRP, le respect est absolu. En RP, votre personnage peut être irrespectueux mais sans tomber dans le harcèlement réel. Il faut toujours que l\'autre joueur (HRP) passe un bon moment.', 'Le plaisir de jeu de tous est prioritaire.', TRUE);

-- =====================================================
-- PARAMÈTRES SYSTÈME PAR DÉFAUT
-- =====================================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Mode maintenance actif ou non'),
('maintenance_message', 'Le panel est en maintenance. Retour prévu dans quelques minutes.', 'Message affiché en mode maintenance'),
('wl_score_minimum', '60', 'Score minimum pour validation automatique suggérée'),
('wl_nb_scenarios', '3', 'Nombre de scénarios par WL'),
('wl_nb_questions', '7', 'Nombre de questions règlement par WL'),
('backup_enabled', 'true', 'Backups automatiques activés'),
('daily_report_enabled', 'true', 'Rapport quotidien Discord activé'),
('registration_enabled', 'false', 'Inscription ouverte (false = seul Master Admin peut créer des comptes)'),
('server_name', 'FiveM RP Server', 'Nom du serveur RP'),
('server_logo_url', '', 'URL du logo du serveur'),
('timezone', 'Europe/Paris', 'Fuseau horaire du serveur');

-- =====================================================
-- MODULES DE FORMATION PAR DÉFAUT
-- =====================================================
INSERT INTO formation_modules (titre, description, contenu, order_index) VALUES
('Introduction au panel', 'Découvrez l\'interface et les fonctionnalités principales du panel d\'administration.', '# Bienvenue sur le Panel de Whitelist\n\nCe module vous présente l\'interface et les fonctionnalités de base.\n\n## Navigation\n- Dashboard : vue d\'ensemble\n- Mes entretiens : gestion de vos WL en cours\n- Historique : consultation des WL passées\n- Templates : bibliothèque de scénarios et questions\n\n## Raccourcis clavier\n- Ctrl+N : Nouvelle WL\n- Ctrl+S : Sauvegarder brouillon\n- Ctrl+K : Recherche globale', 1),

('Processus de Whitelist', 'Apprenez à mener un entretien de whitelist du début à la fin.', '# Processus complet d\'une Whitelist\n\n## Les 5 étapes\n1. Informations du candidat\n2. Choix de la catégorie\n3. Scénarios RP (3 scénarios)\n4. Questions règlement (7 questions)\n5. Décision finale\n\n## Bonnes pratiques\n- Soyez accueillant et rassurant\n- Lisez clairement les scénarios\n- Notez fidèlement les réponses\n- Soyez objectif dans la notation\n- Justifiez vos décisions', 2),

('Notation et évaluation', 'Comprenez comment évaluer correctement les candidats.', '# Système de notation\n\n## Répartition des points\n- Scénarios : 30 points (3x10)\n- Questions règlement : 70 points (7x10)\n- **Total : 100 points**\n\n## Critères d\'évaluation\n- Cohérence du RP\n- Réalisme des réponses\n- Connaissance des règles\n- Créativité\n- Maturité\n\n## Suggestions automatiques\n- ≥ 70 : Validation recommandée\n- 50-69 : En attente / À revoir\n- < 50 : Refus recommandé', 3);

-- =====================================================
-- QUIZ DE FORMATION
-- =====================================================
INSERT INTO formation_quiz (module_id, question, reponses, reponse_correcte_index, explication, order_index) VALUES
(1, 'Quel raccourci clavier permet de créer une nouvelle WL ?', '["Ctrl+W", "Ctrl+N", "Ctrl+C", "Ctrl+L"]', 1, 'Ctrl+N pour "New" whitelist', 1),
(1, 'Où trouve-t-on les WL en cours de traitement ?', '["Dashboard", "Historique", "Mes entretiens", "Templates"]', 2, 'La section "Mes entretiens" affiche les WL non finalisées', 2),

(2, 'Combien de scénarios sont posés lors d\'un entretien ?', '["2", "3", "5", "7"]', 1, 'Exactement 3 scénarios par entretien', 1),
(2, 'Combien de questions de règlement sont posées ?', '["5", "7", "10", "15"]', 1, '7 questions de règlement par entretien', 2),
(2, 'Que doit-on faire après avoir finalisé une WL ?', '["Rien, c\'est automatique", "Choisir une décision (accepter/refuser/attente)", "Fermer le navigateur", "Envoyer un email"]', 1, 'Il faut toujours prendre une décision finale', 3),

(3, 'Quel est le score maximum qu\'un candidat peut obtenir ?', '["50 points", "70 points", "100 points", "150 points"]', 2, 'Le score total est sur 100 points', 1),
(3, 'Combien de points valent les scénarios au total ?', '["20 points", "30 points", "40 points", "50 points"]', 1, '3 scénarios × 10 points = 30 points', 2),
(3, 'À partir de quel score une validation est-elle généralement recommandée ?', '["50 points", "60 points", "70 points", "80 points"]', 2, 'Un score ≥ 70/100 suggère une validation', 3);

-- =====================================================
-- CHANGELOG INITIAL
-- =====================================================
INSERT INTO changelog (version, titre, description, type, published_at) VALUES
('1.0.0', 'Lancement du Panel de Whitelist', 'Première version du panel d\'administration de whitelist FiveM RP avec toutes les fonctionnalités de base : gestion des entretiens, dashboard, statistiques, webhooks Discord, système de formation, et bien plus !', 'feature', NOW());

-- =====================================================
-- FIN DES DONNÉES PAR DÉFAUT
-- =====================================================
