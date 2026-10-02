# Concevoir pour les systèmes critiques : Retour d'expérience chez Thales Alenia Space

## Contexte et environnement industriel

Mon intervention s'est déroulée chez Thales Alenia Space à Mandelieu-la-Napoule, au sein du pôle consacré aux systèmes sol, à l'avionique et aux logiciels. Dans un secteur spatial en pleine mutation concurrentielle, la fiabilité logicielle est déterminante pour la réussite des opérations.

En tant que designer UI/UX, j'ai travaillé sur l'amélioration continue d'outils métiers complexes. Ma mission s'est concentrée sur la recherche utilisateur, l'analyse qualitative des usages en place et le prototypage itératif, avec un objectif clair : sécuriser l'ergonomie et la cohérence fonctionnelle des logiciels avant leur développement.

---

## Démarche méthodologique

Pour s'intégrer efficacement aux équipes d'ingénierie, le design s'est calé sur les méthodes agiles déjà en vigueur.

Figma a servi d'outil principal, permettant de passer de wireframes basse fidélité à des maquettes haute fidélité interactives. Pour faciliter le travail des développeurs, chaque interface intégrait des annotations précises et un tableau de légende définissant les codes visuels et les acronymes techniques. La méthode MoSCoW a permis de hiérarchiser clairement les besoins, tandis que Jira assurait le suivi des priorités au rythme des sprints. Cette démarche issue du Design Thinking a permis de co-construire les interfaces directement avec les experts du domaine.

---

## Projet 1 : Structurer les retours utilisateurs pour guider la feuille de route

Le premier projet concernait un outil interne de télémétrie capable de surveiller jusqu'à douze satellites en simultané pour détecter d'éventuelles anomalies. Utilisé au quotidien par des ingénieurs expérimentés, le logiciel nécessitait un bilan d'usage complet pour guider les investissements techniques souhaités par le responsable du service.

J'ai conçu et animé plusieurs ateliers fondés sur le modèle du diamant de la participation, en alternant divergence, émergence et convergence. L'organisation a été pensée dans le détail : conducteur minuté, supports visuels et réservation d'une salle au plus près des équipes. Le format a également été adapté à distance sur Miro et Teams pour intégrer les collaborateurs du site de Toulouse.

Après un brise-glace, les participants ont exprimé les réussites et les points de blocage du logiciel, avant de proposer de nouvelles fonctionnalités et de les prioriser par un vote direct. Toutes les données ont ensuite été triées et synthétisées dans un livrable de restitution. En anonymisant l'ensemble des verbatims, j'ai garanti la neutralité des échanges et protégé la parole des utilisateurs. Cette restitution a permis d'objectiver les manques fonctionnels et de valider une feuille de route alignée sur les besoins réels du terrain.

---

## Projet 2 : Système de contrôle satellite et alignement sémantique

Le deuxième projet s'inscrivait dans la refonte d'un système de contrôle et de maintenance satellite (SCC), conçu pour remplacer un outil en service depuis 1990 et accompagner les satellites sur un cycle de vie d'environ quinze ans. Intégré au projet sous le framework SAFe, j'ai travaillé sur la conception des écrans de gestion des alarmes.

Lors des revues hebdomadaires de conception, nous soumettions nos prototypes interactifs aux utilisateurs finaux à travers des scénarios d'usage précis. L'observation directe de leurs réactions a permis de déceler des freins ergonomiques majeurs, notamment autour du vocabulaire visuel.

Cette étape a révélé un décalage sémantique capital. En design classique, on associe naturellement le rouge au danger critique, l'orange à la vigilance et le gris à la désactivation. Or, dans la réalité opérationnelle du spatial, le rouge désigne simplement une alarme active nécessitant une prise en compte, le vert indique l'état de veille normale d'un système opérationnel prêt à détecter une anomalie, et le gris correspond à une perte de données de télémétrie. Cet alignement a montré qu'une interface critique gagne en sécurité uniquement si elle adopte les modèles mentaux et les codes métiers des opérateurs.

J'ai également clarifié l'indicateur d'activation des alarmes, rédigé les spécifications d'un gestionnaire de son limitant la fatigue auditive grâce à des volumes réglables et des signatures sonores distinctes, et décliné les maquettes avec le design system Fusion du groupe.

---

## Projet 3 : Un PoC exploitant une technologie d'IA pour le Salon du Bourget

Ce troisième projet est né d'une collaboration avec un développeur autour d'un PoC exploitant une technologie d'IA sur une carte matérielle AMD VEK280 (Edge Computing). L'objectif était de réaliser la segmentation d'images satellites pour une démonstration officielle lors du Salon du Bourget.

L'application d'origine, codée en C++, imposait des étapes de configuration matérielle complexes et un jargon technique peu adapté à une présentation commerciale ou institutionnelle.

J'ai repensé l'architecture globale pour concevoir une interface sur un écran unique, claire et didactique. Les contrôles principaux ont été simplifiés dans le bandeau supérieur avec des commandes évidentes comme « Pause ». Le centre de l'interface a été consacré à la comparaison visuelle directe entre l'image source et le résultat traité, complété par un affichage des métriques et un journal d'événements lisible. Ce travail a permis de transformer une preuve de concept brute en un démonstrateur valorisant pour l'entreprise.

---

## Apports du design et enseignements

Ces réalisations montrent concrètement comment le design soutient l'amélioration des logiciels industriels. La démarche permet de transformer des avis subjectifs en données d'orientation exploitables, de sécuriser les choix ergonomiques par le prototypage avant la phase de code, et de rendre accessibles des technologies de pointe.

Cette expérience a également confirmé l'importance d'une documentation vivante et rigoureuse pour garantir la mémoire des projets face aux mouvements d'équipes dans le temps. Elle montre enfin que le design prend toute sa valeur lorsqu'il intervient dès les premières phases de réflexion technique, créant le lien indispensable entre ingénierie, utilisateurs et stratégie produit.
